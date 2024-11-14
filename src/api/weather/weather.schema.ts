import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Weather extends Document {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true, type: Object })
  data: Record<string, any>;

  @Prop({ default: Date.now })
  date: Date;
}

export type WeatherDocument = Weather & Document;
export const WeatherSchema = SchemaFactory.createForClass(Weather);
