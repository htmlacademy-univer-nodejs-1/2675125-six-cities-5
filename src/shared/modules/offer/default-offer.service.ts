import {inject, injectable} from 'inversify';
import {OfferService} from './offer-service.interface.js';
import {Component} from '../../types';
import {Logger} from '../../libs/logger';
import {DocumentType, types} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {Types} from 'mongoose';
import {FavoriteEntity} from './favorite.entity';
import {CommentEntity} from '../comment';
import {UpdateOfferDto} from './dto/update-offer.dto';

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

  public async getAllOffers(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .limit(60)
      .sort({postDate: -1});
  }

  public async getOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findById(offerId)
      .populate('authorId')
      .exec();

    if (!offer) {
      this.logger.info(`Offer ${offerId} was not found`);
      return null;
    }

    return offer;
  }

  public async updateOfferById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = this.offerModel.findByIdAndUpdate(offerId, { $set: dto, }, { new: true });
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
      .populate('authorId')
      .exec();
  }

  public async getPremiumOffersByCity(cityName: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({cityName, isPremium: true})
      .limit(3)
      .sort({postDate: -1})
      .populate('authorId');
  }

  public async getFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.favoriteModel
      .find({userId,})
      .populate('offerId');
  }

  public async addToFavorite(offerId: string, userId: string): Promise<null> {
    await this.favoriteModel.create({offerId, userId});

    this.logger.info(`User ${userId} added offer ${offerId} to favorites`);

    return null;
  }

  public async removeFromFavorite(offerId: string, userId: string): Promise<null> {
    await this.favoriteModel.findOneAndRemove({offerId, userId});

    this.logger.info(`User ${userId} removed offer ${offerId} from favorites`);

    return null;
  }
}

