import {FileReader} from './file-reader.interface.js';
import {readFileSync} from 'node:fs';
import {Offer} from '../../types';
import {City} from '../../types/city.type.js';
import {OfferType} from '../../types/offer-type.enum';
import {Feature} from '../../types/feature.type';
import {UserType} from '../../types/user-type.enum';

const CITIES: Record<string, City> = {
  Paris: {name: 'Paris', latitude: 48.85661, longitude: 2.351499},
  Cologne: {name: 'Cologne', latitude: 50.938361, longitude: 6.959974},
  Brussels: {name: 'Brussels', latitude: 50.846557, longitude: 4.351697},
  Amsterdam: {name: 'Amsterdam', latitude: 52.370216, longitude: 4.895168},
  Hamburg: {name: 'Hamburg', latitude: 53.550341, longitude: 10.000654},
  Dusseldorf: {name: 'Dusseldorf', latitude: 51.225402, longitude: 6.776314},
};

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, createdDate, city, previewImage, photos, isPremium, isFavorite, rating, type, roomsCount, guestsCount, price, features, authorName, authorEmail, authorAvatar, authorPassword, authorType, commentsCount, latitude, longitude]) => ({
        title,
        description,
        createdDate: new Date(createdDate),
        city: CITIES[city],
        previewImage,
        photos: photos.split(';'),
        isPremium: isPremium === 'true',
        isFavorite: isFavorite === 'true',
        rating: parseFloat(rating),
        type: type as OfferType,
        roomsCount: parseInt(roomsCount, 10),
        guestsCount: parseInt(guestsCount, 10),
        price: parseFloat(price),
        features: features.split(';') as Feature[],
        author: {
          name: authorName,
          email: authorEmail,
          password: authorPassword,
          avatarPath: authorAvatar,
          type: authorType as UserType
        },
        commentsCount: parseInt(commentsCount, 10),
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }
      }));
  }
}
