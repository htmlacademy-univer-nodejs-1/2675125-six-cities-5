import { UserRdo } from '../../user/rdo/user.rdo.js';
import { Expose, Type } from 'class-transformer';
import {CityName, Location} from '../../../types';
import {OfferType} from '../../../types/offer-type.enum';
import {Feature} from '../../../types/feature.type';

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose({ name: 'createdAt' })
  public postDate!: Date;

  @Expose()
  public city!: CityName;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public features!: Feature[];

  @Expose()
  @Type(() => UserRdo)
  public user!: UserRdo;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public location!: Location;
}
