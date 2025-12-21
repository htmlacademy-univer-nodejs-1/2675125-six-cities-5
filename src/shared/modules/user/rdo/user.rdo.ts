import { Expose } from 'class-transformer';
import {UserType} from '../../../types/user-type.enum';

export class UserRdo {
  @Expose()
  public email!: string ;

  @Expose()
  public avatarPath!: string;

  @Expose()
  public name!: string;

  @Expose()
  public userType?: UserType;
}
