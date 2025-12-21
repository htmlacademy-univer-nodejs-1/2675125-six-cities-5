import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import {UserEntity} from '../user/index.js';
import {OfferType, OfferTypeEnum} from '../../types/offer-type.enum.js';
import {Feature, FeatureEnum} from '../../types/feature.type.js';
import {City} from '../../types/city.type.js';
import {CITIES_LOCATIONS, Location} from '../../types';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(_doc, ret) {
        delete ret._id;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function(_doc, ret) {
        delete ret._id;
        return ret;
      }
    }
  }
})

export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    minlength: 10,
    maxlength: 100,
    trim: true
  })
  public title!: string;

  @prop({
    required: true,
    minlength: 20,
    maxlength: 1024,
    trim: true
  })
  public description!: string;

  @prop({
    required: true,
    default: Date.now
  })
  public postDate!: Date;

  @prop({
    required: true,
    enum: Object.keys(CITIES_LOCATIONS),
  })
  public city!: City;

  @prop({
    required: true,
    match: [/\.(jpg|png)$/i, 'Preview image must be a JPG or PNG image']
  })
  public previewImage!: string;

  @prop({
    required: true,
  })
  public photos!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({
    required: true,
    min: 1,
    max: 5,
    default: 1
  })
  public rating!: number;

  @prop({
    required: true,
    enum: OfferTypeEnum,
    validate: {
      validator: (offer: OfferType) => Object.values(OfferTypeEnum).includes(offer as OfferTypeEnum),
      message: 'Invalid place types'
    }
  })
  public type!: OfferType;

  @prop({
    required: true,
    min: 1,
    max: 8
  })
  public rooms!: number;

  @prop({
    required: true,
    min: 1,
    max: 10
  })
  public guests!: number;

  @prop({
    required: true,
    min: 100,
    max: 100000
  })
  public price!: number;

  @prop({
    required: true,
    enum: FeatureEnum,
    type: [String],
    validate: {
      validator: (features: Feature[]) => features.length > 0 && features.every((a) => Object.keys(FeatureEnum).includes(a)),
      message: 'At least one feature must be provided'
    }
  })
  public features!: Feature[];

  @prop({
    required: true,
    ref: UserEntity
  })
  public userId!: Ref<UserEntity>;

  @prop({
    required: true,
    default: 0
  })
  public commentsCount!: number;

  @prop({
    required: true,
    validate: {
      validator: (v: Location) =>
        v.latitude >= -90 &&
        v.latitude <= 90 &&
        v.longitude >= -180 &&
        v.longitude <= 180,
      message: 'Invalid location'
    }
  })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
