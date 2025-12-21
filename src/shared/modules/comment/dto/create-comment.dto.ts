import {CreateCommentMessages} from './create-comment.messages.js';
import {IsMongoId, IsNumber, IsString, Length, Max, Min} from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(5, 1024, { message: CreateCommentMessages.text.lengthField })
  public text!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  public rating: number;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId!: string;

  @IsMongoId({ message: CreateCommentMessages.userId.invalidFormat })
  public userId!: string;
}
