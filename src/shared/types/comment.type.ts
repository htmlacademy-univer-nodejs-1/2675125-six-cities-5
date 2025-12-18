import {User} from './user.type';

export type Comment = {
  text: string;
  publicationDate: Date;
  rating: number;
  author: User;
}
