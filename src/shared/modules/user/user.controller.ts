import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  UploadFileMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import {Logger} from '../../libs/logger/index.js';
import {Component} from '../../types/index.js';
import {CreateUserRequest} from './create-user-request.type.js';
import {UserService} from './user-service.interface.js';
import {Config, RestSchema} from '../../libs/config/index.js';
import {fillDTO} from '../../helpers/index.js';
import {UserRdo} from './rdo/user.rdo.js';
import {LoginUserRequest} from './login-user-request.type.js';
import {LoginUserDto} from './dto/login-user.dto';
import {ValidateDtoMiddleware} from '../../libs/rest';
import {AuthService} from '../auth';
import {PrivateRouteMiddleware} from '../../libs/rest';
import {LoggedUserRdo} from './rdo/logged-user.rdo';
import {AnonymousRouteMiddleware} from '../../libs/rest/middleware/anonymous-route.middleware';
import {CreateUserDto} from './dto/create-user.dto';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto),
        new AnonymousRouteMiddleware(),
      ]
    });
    this.addRoute({ path: '/status', method: HttpMethod.Get, handler: this.status });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(
    {body}: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({body}: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token,
    });
    this.ok(res, responseData);
  }

  public async status({tokenPayload: {email}}: Request, res: Response): Promise<void> {
    const foundUser = await this.userService.findByEmail(email);

    if (!foundUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundUser));
  }

  public async uploadAvatar({ file, tokenPayload }: Request, res: Response
  ): Promise<void> {
    if (!file) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'No file uploaded' });
      return;
    }

    const updatedUser = await this.userService.updateAvatar(tokenPayload.id, `/static/${file.filename}`);

    res.status(StatusCodes.CREATED).json({ avatarUrl: updatedUser?.avatarPath || '/static/default-avatar-picture.png' });
  }
}
