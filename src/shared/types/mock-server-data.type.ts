import {Feature} from './feature.type';
import {OfferType} from './offer-type.enum';
import {UserType} from './user-type.enum';

export type MockServerData = {
  categories: string[];
  titles: string[];
  descriptions: string[];
  images: string[];
  types: OfferType[];
  features: Feature[];
  cities: string[];
  userNames: string[];
  userEmails: string[];
  userAvatars: string[];
  userPasswords: string[];
  userTypes: UserType[];
};
