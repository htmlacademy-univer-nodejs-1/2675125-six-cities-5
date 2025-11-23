import {Location} from './location.enum';
import {City} from './city.type.js';
import {User} from './user.type';
import {OfferType} from './offer-type.enum';
import {Feature} from './feature.type';

export type Offer = {
  title: string;
  description: string;
  createdDate: Date;
  city: City;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: OfferType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  features: Feature[];
  author: User;
  commentsCount: number;
  location: Location
}

