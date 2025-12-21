import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export class AnonymousRouteMiddleware {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (req.tokenPayload) {
      return next(new HttpError(
        StatusCodes.FORBIDDEN,
        'You must be anonymous to access this route.',
        'AnonymousRouteMiddleware'
      ));
    }

    return next();
  }
}
