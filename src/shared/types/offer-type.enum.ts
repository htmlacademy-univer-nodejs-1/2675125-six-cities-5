export enum OfferTypeEnum {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel',
}

export type OfferType = keyof typeof OfferTypeEnum;
