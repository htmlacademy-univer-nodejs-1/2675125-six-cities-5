import dayjs from 'dayjs';
import {OfferGenerator} from './offer-generator.interface.js';
import {MockServerData} from '../../types';
import {generateRandomValue, getRandomItem, getRandomItems} from '../../helpers';
import {UserType} from '../../types/user-type.enum';

const MIN_PRICE = 100;
const MAX_PRICE = 10000;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 10;

const MIN_GUESTS_COUNT = 1;
const MAX_GUESTS_COUNT = 10;

const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 20;

const MIN_COORDINATES = 0;
const MAX_COORDINATES = 55;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {
  }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const cityName = getRandomItem<string>(this.mockData.cities);
    const cityLatitude = generateRandomValue(MIN_COORDINATES, MAX_COORDINATES, 5);
    const cityLongitude = generateRandomValue(MIN_COORDINATES, MAX_COORDINATES, 5);
    const previewImage = getRandomItem<string>(this.mockData.images);
    const photos = getRandomItems<string>(this.mockData.images);
    const isPremium = getRandomItem<boolean>([true, false]);
    const isFavorite = getRandomItem<boolean>([true, false]);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING);
    const type = getRandomItem(this.mockData.types);
    const roomsCount = generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);
    const guestsCount = generateRandomValue(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const features = getRandomItems(this.mockData.features);
    const authorName = getRandomItem(this.mockData.userNames);
    const authorEmail = getRandomItem(this.mockData.userEmails);
    const authorAvatar = getRandomItem(this.mockData.userAvatars);
    const authorPassword = getRandomItem(this.mockData.userPasswords);
    const authorType = getRandomItem(Object.keys(UserType));
    const commentsCount = generateRandomValue(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);
    const latitude = generateRandomValue(MIN_COORDINATES, MAX_COORDINATES, 5);
    const longitude = generateRandomValue(MIN_COORDINATES, MAX_COORDINATES, 5);

    return [
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
    ].join('\t');
  }
}

