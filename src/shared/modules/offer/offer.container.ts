import { Container } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import {FavoriteEntity, FavoriteModel} from './favorite.entity';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService);
  offerContainer.bind<ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<ModelType<FavoriteEntity>>(Component.FavoriteModel).toConstantValue(FavoriteModel);

  return offerContainer;
}
