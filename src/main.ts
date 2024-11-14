import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { MongoExceptionFilter } from 'utils/mongo-exception';
import { AppModule } from './app.module';
import * as serverless from 'serverless-http';
import * as express from 'express';

const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new MongoExceptionFilter());
  app.enableCors();

  await app.init();
}

bootstrap();

export const handler = serverless(expressApp);
