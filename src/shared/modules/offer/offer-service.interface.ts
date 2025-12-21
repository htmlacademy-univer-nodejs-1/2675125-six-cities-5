import {CreateOfferDto} from './dto/create-offer.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {UpdateOfferDto} from './dto/update-offer.dto';
import {DocumentExists} from '../../types/document-exists.interface';
import {FavoriteEntity} from './favorite.entity';
import {CityName} from '../../types';

export interface OfferService extends DocumentExists {
  getOffers(limit?: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;

  exists(offerId: string): Promise<boolean>;

  getOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

  updateOfferById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;

  deleteOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  getPremiumOffersByCity(city: CityName, userId?: string): Promise<DocumentType<OfferEntity>[]>;

  addToFavorite(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null>

  removeFromFavorite(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null>

  getFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
}
