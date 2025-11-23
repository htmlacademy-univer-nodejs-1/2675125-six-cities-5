import {Location, Offer, User} from '../types';
import {OfferType} from '../types/offer-type.enum';
import {Feature} from '../types/feature.type';
import {UserType} from '../types/user-type.enum';
import {City} from '../types/city.type';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    createdDate,
    cityName,
    cityLatitude,
    cityLongitude,
    previewImage,
    photos,
    isPremium,
    isFavorite,
    rating,
    type,
    roomsCount,
    guestsCount,
    price,
    features,
    authorName,
    authorEmail,
    authorAvatar,
    authorPassword,
    authorType,
    commentsCount,
    latitude,
    longitude
  ] = offerData.replace('\n', '').split('\t');

  const author: User = {
    name: authorName,
    email: authorEmail,
    type: authorType as UserType,
    avatarPath: authorAvatar,
    password: authorPassword
  };

  const city: City = {
    name: cityName,
    latitude: Number(cityLatitude),
    longitude: Number(cityLongitude),
  };

  const location: Location = {
    latitude: Number(latitude),
    longitude: Number(longitude)
  };

  return {
    title,
    description,
    createdDate: new Date(createdDate),
    city,
    previewImage,
    photos: photos.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: Number(rating),
    type: type as OfferType,
    roomsCount: Number(roomsCount),
    guestsCount: Number(guestsCount),
    price: Number.parseInt(price, 10),
    features: features.split(';') as Feature[],
    author,
    commentsCount: Number(commentsCount),
    location
  };
}
