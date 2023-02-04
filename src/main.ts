import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const PORT = Number(process.env.PORT) || 4050;

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
}

bootstrap();
