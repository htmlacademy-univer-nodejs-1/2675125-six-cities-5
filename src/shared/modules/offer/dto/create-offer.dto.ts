import {
  IsArray,
  IsBoolean, IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import {Type} from 'class-transformer';
import {CreateOfferValidationMessage} from './create-offer.messages.js';
import {OfferType, OfferTypeEnum} from '../../../types/offer-type.enum';
import {Feature, FeatureEnum} from '../../../types/feature.type';
import {CityName, CityNameEnum} from '../../../types';

export class LocationDto {
  @IsNumber({}, {message: CreateOfferValidationMessage.location.latitude.invalidFormat})
  @Min(-90, {message: CreateOfferValidationMessage.location.latitude.minValue})
  @Max(90, {message: CreateOfferValidationMessage.location.latitude.maxValue})
  public latitude!: number;

  @IsNumber({}, {message: CreateOfferValidationMessage.location.longitude.invalidFormat})
  @Min(-180, {message: CreateOfferValidationMessage.location.longitude.minValue})
  @Max(180, {message: CreateOfferValidationMessage.location.longitude.maxValue})
  public longitude!: number;
}

export class CreateOfferDto {
  @IsString({message: CreateOfferValidationMessage.title.invalidFormat})
  @MinLength(10, {message: CreateOfferValidationMessage.title.minLength})
  @MaxLength(100, {message: CreateOfferValidationMessage.title.maxLength})
  public title!: string;

  @IsString({message: CreateOfferValidationMessage.description.invalidFormat})
  @MinLength(20, {message: CreateOfferValidationMessage.description.minLength})
  @MaxLength(1024, {message: CreateOfferValidationMessage.description.maxLength})
  public description!: string;

  @IsEnum(CityNameEnum, {message: CreateOfferValidationMessage.city.invalid})
  public city!: CityName;

  @IsUrl({}, {message: CreateOfferValidationMessage.previewImage.invalidFormat})
  public previewImage!: string;

  @IsDateString()
  public createdDate!: Date;

  @IsArray({message: CreateOfferValidationMessage.images.invalidFormat})
  @IsUrl({}, {each: true, message: CreateOfferValidationMessage.images.invalidItems})
  @MaxLength(6, {message: CreateOfferValidationMessage.images.maxSize})
  @MinLength(6, {message: CreateOfferValidationMessage.images.minSize})
  public photos!: string[];

  @IsBoolean({message: CreateOfferValidationMessage.isPremium.invalidFormat})
  public isPremium!: boolean;

  @IsEnum(OfferTypeEnum, {message: CreateOfferValidationMessage.type.invalid})
  public type!: OfferType;

  @IsInt({message: CreateOfferValidationMessage.rooms.invalidFormat})
  @Min(1, {message: CreateOfferValidationMessage.rooms.minValue})
  @Max(8, {message: CreateOfferValidationMessage.rooms.maxValue})
  public roomsCount!: number;

  @IsInt({message: CreateOfferValidationMessage.guests.invalidFormat})
  @Min(1, {message: CreateOfferValidationMessage.guests.minValue})
  @Max(10, {message: CreateOfferValidationMessage.guests.maxValue})
  public guestsCount!: number;

  @IsInt({message: CreateOfferValidationMessage.price.invalidFormat})
  @Min(100, {message: CreateOfferValidationMessage.price.minValue})
  @Max(100000, {message: CreateOfferValidationMessage.price.maxValue})
  public price!: number;

  @IsArray({message: CreateOfferValidationMessage.features.invalidFormat})
  @IsEnum(FeatureEnum, {each: true, message: CreateOfferValidationMessage.features.invalidItems})
  public features!: Feature[];

  @IsString({message: CreateOfferValidationMessage.authorId.invalidFormat})
  public authorId!: string;

  @ValidateNested()
  @Type(() => LocationDto)
  public location!: LocationDto;
}
