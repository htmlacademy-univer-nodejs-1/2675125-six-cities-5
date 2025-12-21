import {inject, injectable} from 'inversify';
import {OfferService} from './offer-service.interface.js';
import {CityName, Component, DESCENDING_ORDER} from '../../types';
import {Logger} from '../../libs/logger';
import {DocumentType, types} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {Types} from 'mongoose';
import {FavoriteEntity} from './favorite.entity';
import {CommentEntity} from '../comment';
import {UpdateOfferDto} from './dto/update-offer.dto';
import {DEFAULT_OFFERS_LIMIT, DEFAULT_PREMIUM_CITY_OFFERS_LIMIT} from './offer.constant';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: offerId})) !== null;
  }

  public async createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`Offer created: ${dto.title}`);

    return result;
  }

  public async getOffers(limit?: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find()
      .limit(limit ?? DEFAULT_OFFERS_LIMIT)
      .sort({ createdAt: DESCENDING_ORDER });
    return this.joinUserFavorites(offers, userId);
  }

  public async getOfferById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const isFavorite = userId !== undefined && await this.favoriteModel.findOne({offerId, userId}) !== null;

    const offer = await this.offerModel
      .findById(offerId)
      .populate('userId');

    if (offer !== null) {
      offer.isFavorite = isFavorite;
    }

    return offer;
  }

  public async updateOfferById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(offerId, { $set: dto, }, { new: true });
    this.logger.info(`Offer ${offerId} was updated`);
    return result;
  }

  public async deleteOfferById(offerId: string): Promise<null> {
    await this.offerModel.findByIdAndDelete(offerId);
    await this.commentModel.deleteMany({offerId: offerId});
    this.logger.info(`Offer ${offerId} was deleted`);
    return null;
  }

  public async incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null> {
    const updatedOffer = await this.offerModel
      .findByIdAndUpdate(
        id,
        {$inc: {commentsCount: 1}},
        {new: true}
      )
      .exec();

    if (updatedOffer) {
      return this.updateRating(id);
    }

    return null;
  }

  public async updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const aggregateResult = await this.offerModel
      .aggregate([
        {$match: {_id: new Types.ObjectId(offerId)}},
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments'
          }
        },
        {
          $addFields: {
            rating: {$avg: '$comments.rating'}
          }
        },
        {$project: {comments: 0}}
      ])
      .exec();

    if (!aggregateResult.length) {
      return null;
    }

    const newRating = aggregateResult[0].rating || 0;
    return this.offerModel
      .findByIdAndUpdate(
        offerId,
        {rating: parseFloat(newRating.toFixed(1))},
        {new: true}
      )
      .populate('userId')
      .exec();
  }

  public async getPremiumOffersByCity(city: CityName, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find({ city, isPremium: true })
      .limit(DEFAULT_PREMIUM_CITY_OFFERS_LIMIT)
      .sort({ createdAt: DESCENDING_ORDER });

    return this.joinUserFavorites(offers, userId);
  }

  public async getFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const favorites = await this.favoriteModel.find({ userId });
    const offerIds = favorites.map((fav) => fav.offerId as Types.ObjectId);

    return await this.offerModel.find({ _id: { $in: offerIds } });
  }

  public async addToFavorite(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null> {
    const existing = await this.favoriteModel.findOne({ offerId, userId });

    if (existing !== null) {
      return null;
    }

    this.logger.info(`User ${userId} added offer ${offerId} to favorites`);

    return this.favoriteModel.create({ offerId, userId });
  }

  public async removeFromFavorite(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null> {
    const deleted = await this.favoriteModel.findOneAndRemove({ offerId, userId });
    this.logger.info(`User ${userId} removed offer ${offerId} from favorites`);
    return deleted;
  }

  private async joinUserFavorites(offers: DocumentType<OfferEntity>[], userId?: string) : Promise<DocumentType<OfferEntity>[]> {
    let favoriteOfferIds = new Set<string>();

    if (userId) {
      const favorites = await this.favoriteModel.find({ userId: new Types.ObjectId(userId) }).select('offerId');
      favoriteOfferIds = new Set(favorites.map((f) => f.offerId.toString()));
    }

    return offers.map((offer) => {
      offer.isFavorite = favoriteOfferIds.has(offer._id.toString());
      return offer;
    });
  }
}

