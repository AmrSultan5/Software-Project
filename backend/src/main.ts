import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationException, ValidationFilter } from './util/filter.validation';
import { ValidationError } from 'class-validator';
import * as path from 'path'; // Correct import for path module
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

 
  // Serve backups directory
  app.use('/backups', express.static(path.join(__dirname, '../backups')));

  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const errMsg = {};
        errors.forEach((err) => {
          errMsg[err.property] = [...Object.values(err.constraints)];
        });
        return new ValidationException(errMsg);
      },
    }),
  );

  const port = process.env.PORT || 3000; // Add default port as fallback
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();