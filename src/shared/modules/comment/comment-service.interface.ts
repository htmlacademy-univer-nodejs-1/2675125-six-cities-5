import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import {CreateCommentDto} from './dto/create-comment.dto';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  getByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>
  deleteByOfferId(offerId: string): Promise<number | null>;
}
