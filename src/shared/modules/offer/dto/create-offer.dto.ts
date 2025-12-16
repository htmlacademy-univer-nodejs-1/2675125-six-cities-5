import {Feature} from '../../../types/feature.type.js';
import {OfferType} from '../../../types/offer-type.enum.js';
import {CityName, Location} from '../../../types';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public city: CityName;
  public previewImage!: string;
  public photos!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public type!: OfferType;
  public rating!: number;
  public roomsCount!: number;
  public guestsCount!: number;
  public price!: number;
  public features!: Feature[];
  public authorId!: string;
  public commentsCount!: number;
  public location!: Location;
  public createdDate!: Date;
}
