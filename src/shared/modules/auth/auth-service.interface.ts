import {UserEntity} from '../user';
import {LoginUserDto} from '../user/dto/login-user.dto';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
}
