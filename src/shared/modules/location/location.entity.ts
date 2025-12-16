import { prop } from '@typegoose/typegoose';
import { Location } from '../../types';

export class CoordinatesEntity implements Location {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}
