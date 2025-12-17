import {CreateOfferDto} from './dto/create-offer.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {CityName} from '../../types';

export interface OfferService {
  getAllOffers(): Promise<DocumentType<OfferEntity>[]>;

  getOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

  updateOfferById(offerId: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;

  deleteOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null>;

  updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  getPremiumOffersByCity(cityName: CityName): Promise<DocumentType<OfferEntity>[]>;

  addToFavorite(offerId: string, userId: string): Promise<null>

  removeFromFavorite(offerId: string, userId: string): Promise<null>

  getFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
}
