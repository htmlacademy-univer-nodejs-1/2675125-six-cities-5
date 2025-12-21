import {IsEmail, IsEnum, IsOptional, IsString, Length, Matches} from 'class-validator';
import {CreateUserValidationMessage} from './create-user.messages.js';
import {UserType, UserTypeEnum} from '../../../types/user-type.enum';

export class CreateUserDto {
  @IsString({ message: CreateUserValidationMessage.name.invalidFormat })
  @Length(1, 15, { message: CreateUserValidationMessage.name.length })
  public name!: string;

  @IsEmail({}, { message: CreateUserValidationMessage.email.invalidFormat })
  public email!: string;

  @IsOptional()
  @IsString({ message: CreateUserValidationMessage.avatarPath.invalidFormat })
  @Matches(/\.(jpg|png)$/i, {
    message: CreateUserValidationMessage.avatarPath.invalidExtension
  })
  public avatarPath!: string;

  @IsString({ message: CreateUserValidationMessage.password.invalidFormat })
  @Length(6, 12, { message: CreateUserValidationMessage.password.length })
  public password!: string;

  @IsEnum(UserTypeEnum, { message: CreateUserValidationMessage.type.invalid })
  public type!: UserType;
}
