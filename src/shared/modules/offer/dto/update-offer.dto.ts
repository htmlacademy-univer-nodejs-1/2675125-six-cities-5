import {
  IsArray,
  IsBoolean,
  IsEnum, IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength, ValidateNested
} from 'class-validator';
import {Type} from 'class-transformer';
import {UpdateOfferValidationMessage} from './update-offer.messages.js';
import {CityName, CityNameEnum} from '../../../types';
import {OfferType, OfferTypeEnum} from '../../../types/offer-type.enum';
import {Feature, FeatureEnum} from '../../../types/feature.type';

export class LocationDto {
  @IsOptional()
  @IsNumber({}, { message: UpdateOfferValidationMessage.location.latitude.invalidFormat })
  @Min(-90, { message: UpdateOfferValidationMessage.location.latitude.minValue })
  @Max(90, { message: UpdateOfferValidationMessage.location.latitude.maxValue })
  public latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: UpdateOfferValidationMessage.location.longitude.invalidFormat })
  @Min(-180, { message: UpdateOfferValidationMessage.location.longitude.minValue })
  @Max(180, { message: UpdateOfferValidationMessage.location.longitude.maxValue })
  public longitude?: number;
}
export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: UpdateOfferValidationMessage.title.invalidFormat })
  @MinLength(10, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: UpdateOfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @IsString({ message: UpdateOfferValidationMessage.description.invalidFormat })
  @MinLength(20, { message: UpdateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: UpdateOfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsEnum(CityNameEnum, { message: UpdateOfferValidationMessage.city.invalid })
  public city?: CityName;

  @IsOptional()
  @IsUrl({}, { message: UpdateOfferValidationMessage.previewImage.invalidFormat })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.images.invalidFormat })
  @IsUrl({}, { each: true, message: UpdateOfferValidationMessage.images.invalidItems })
  @MaxLength(6, { message: UpdateOfferValidationMessage.images.maxSize })
  @MinLength(6, { message: UpdateOfferValidationMessage.images.minSize })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(OfferTypeEnum, { message: UpdateOfferValidationMessage.type.invalid })
  public type?: OfferType;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.rooms.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.rooms.minValue })
  @Max(8, { message: UpdateOfferValidationMessage.rooms.maxValue })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.guests.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.guests.minValue })
  @Max(10, { message: UpdateOfferValidationMessage.guests.maxValue })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(100000, { message: UpdateOfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.features.invalidFormat })
  @IsEnum(FeatureEnum, { each: true, message: UpdateOfferValidationMessage.features.invalidItems })
  public features?: Feature[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  public location?: LocationDto;
}

