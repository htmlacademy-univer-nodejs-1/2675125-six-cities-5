import { inject, injectable } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import {Component, DESCENDING_ORDER} from '../../types';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferService } from '../offer';
import { Logger } from '../../libs/logger';
import {DEFAULT_COMMENTS_LIMIT} from './comment.constant';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {}

  public async createComment(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`New comment created for offer ${dto.offerId}`);

    await this.offerService.incCommentCount(dto.offerId);
    await this.offerService.updateRating(dto.offerId);

    return comment.populate('userId');
  }

  public async getCommentsByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .limit(DEFAULT_COMMENTS_LIMIT)
      .sort({ createdAt: DESCENDING_ORDER })
      .populate('userId');
  }

  public async deleteCommentByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
