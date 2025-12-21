import {
  BaseController, DocumentExistsMiddleware,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {Request, Response} from 'express';
import {OfferService} from './offer-service.interface.js';
import {ParamCity} from './type/param-city.type.js';
import {ParamOfferId} from './type/param-offerid.type.js';
import {fillDTO} from '../../helpers/index.js';
import {OfferRdo} from './rdo/offer.rdo.js';
import {CreateOfferRequest} from './type/create-offer-request.type.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {CommentRdo, CommentService} from '../comment/index.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.showOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createOffer,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.updateOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremiumByCity
    });
  }

  public async showOffer({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.getOfferById(offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.offerService.getAllOffers();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async createOffer({body}: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.createOffer(body);
    const offer = await this.offerService.getOfferById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async deleteOffer({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.deleteOfferById(offerId);

    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, offer);
  }

  public async updateOffer({body, params}: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateOfferById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async getComments({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.getByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async getPremiumByCity({params}: Request<ParamCity>, res: Response): Promise<void> {
    const offers = await this.offerService.getPremiumOffersByCity(params.city);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
