import {RequestBody, RequestParams} from '../../libs/rest/index.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {Request} from 'express';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
