import {UserType} from '../../../types/user-type.enum';

export class CreateUserDto {
  public name: string;
  public email: string;
  public avatarPath?: string;
  public type: UserType;
  public password: string;
}
