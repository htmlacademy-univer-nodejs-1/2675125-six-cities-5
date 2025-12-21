import {CityName, Location, Offer, User} from '../types';
import {OfferType} from '../types/offer-type.enum';
import {FeatureEnum} from '../types/feature.type';
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
    rooms,
    guests,
    price,
    features,
    userName,
    userEmail,
    userAvatar,
    userPassword,
    userType,
    commentsCount,
    latitude,
    longitude
  ] = offerData.replace('\n', '').split('\t');

  const user: User = {
    name: userName,
    email: userEmail,
    type: userType as UserType,
    avatarPath: userAvatar,
    password: userPassword
  };

  const city: City = {
    name: cityName as CityName,
    latitude: Number(cityLatitude),
    longitude: Number(cityLongitude),
  };

  const location: Location = {
    latitude: Number(latitude),
    longitude: Number(longitude)
  };

  const featuresArray = features.split(';')
    .filter((feature) => feature.trim() !== '')
    .map((feature) => feature.trim() as keyof typeof FeatureEnum)
    .filter((feature) =>
      Object.keys(FeatureEnum).includes(feature)
    );

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
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number.parseInt(price, 10),
    features: featuresArray,
    user: user,
    commentsCount: Number(commentsCount),
    location
  };
}
