import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: JSON.parse(process.env.ORIGIN) ?? [],
    credentials: true,
  });
  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET, {}));

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', {}));
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes any properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if extra properties are provided
      transform: true, // Automatically transforms request data to the expected DTO type
      errorHttpStatusCode: 422, // Customize the HTTP status code (e.g., 422 for Unprocessable Entity)
      transformOptions: {
        enableImplicitConversion: true, // Enables implicit type conversion
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
