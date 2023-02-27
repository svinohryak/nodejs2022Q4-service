import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

dotenv.config();

async function bootstrap() {
  const PORT = Number(process.env.PORT) || 4050;

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useGlobalGuards(new JwtAuthGuard());

  await app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
}

bootstrap();
