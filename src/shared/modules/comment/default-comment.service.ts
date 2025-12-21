import { inject, injectable } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import {Component, DESCENDING_ORDER} from '../../types';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import {OfferEntity} from '../offer';
import { Logger } from '../../libs/logger';
import {DEFAULT_COMMENTS_LIMIT} from './comment.constant';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async createComment(dto: CreateCommentDto): Promise<types.DocumentType<CommentEntity>> {
    const result = (await this.commentModel.create(dto)).populate('userId');
    this.logger.info(`New comment created: ${dto.text}`);

    await this.offerModel.findByIdAndUpdate(dto.offerId, {
      $inc: { commentsCount: 1, totalRating: dto.rating, }
    });

    return result;
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
