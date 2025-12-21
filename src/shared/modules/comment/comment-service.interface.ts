import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import {CreateCommentDto} from './dto/create-comment.dto';

export interface CommentService {
  createComment(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  getCommentsByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>
  deleteCommentByOfferId(offerId: string): Promise<number | null>;
}
