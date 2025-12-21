import {CreateCommentMessages} from './create-comment.messages.js';
import {IsMongoId, IsString, Length} from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(5, 1024, { message: CreateCommentMessages.text.lengthField })
  public text!: string;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId!: string;

  @IsMongoId({ message: CreateCommentMessages.userId.invalidFormat })
  public userId!: string;
}
