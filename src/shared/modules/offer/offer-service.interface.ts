import {CreateOfferDto} from './dto/create-offer.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {UpdateOfferDto} from './dto/update-offer.dto';

export interface OfferService {
  getAllOffers(): Promise<DocumentType<OfferEntity>[]>;

  exists(offerId: string): Promise<boolean>;

  getOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

  updateOfferById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;

  deleteOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null>;

  updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  getPremiumOffersByCity(cityName: string): Promise<DocumentType<OfferEntity>[]>;

  addToFavorite(offerId: string, userId: string): Promise<null>

  removeFromFavorite(offerId: string, userId: string): Promise<null>

  getFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
}
