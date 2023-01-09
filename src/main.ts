import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/app.module';
import * as session from 'express-session';
import { HttpExceptionFilter } from './infrastructure/service/common/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: '2022-11-01-coPang',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(3000);
}
bootstrap();
