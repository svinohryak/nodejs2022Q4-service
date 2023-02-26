import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'SECRET',
      signOptions: {
        // expiresIn: '24h',
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      },
    }),
  ],
  // imports: [
  //   forwardRef(() => UsersModule),
  //   JwtModule.register({
  //     secret: process.env.JWT_SECRET_KEY || 'SECRET',
  //     signOptions: {
  //       expiresIn: '24h',
  //     },
  //   }),
  // ],
})
export class AuthModule {}
