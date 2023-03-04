import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { RefreshToken, TokenPayload } from './auth.dto';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: User) {
    const user = await this.validateUser(userDto);
    const token = await this.generateToken(user);

    return token;
  }

  async registration(userDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(
      userDto.password,
      Number(process.env.CRYPT_SALT || 10),
    );
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return {
      id: user.id,
    };
  }

  async refresh(refreshToken: RefreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken.refreshToken,
        process.env.JWT_SECRET_REFRESH_KEY,
      ) as TokenPayload;

      const user = await this.userService.getUserById(decoded.userId);
      if (!user) throw new ForbiddenException();

      return this.createTokens(user);
    } catch (error) {
      throw new HttpException(
        'No refreshToken in body',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async generateToken(user: Omit<User, 'password'>) {
    const payload = { userId: user.id, login: user.login };
    const tokens = {
      accessToken: jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      refreshToken: jwt.sign(payload, process.env.JWT_SECRET_REFRESH_KEY, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
    return tokens;
  }

  createTokens(user: User) {
    const payload = { userId: user.id, login: user.login };
    const tokens = {
      accessToken: jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      refreshToken: jwt.sign(payload, process.env.JWT_SECRET_REFRESH_KEY, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
    return tokens;
  }

  private async validateUser(userDto: User) {
    const user = await this.userService.getUserById(userDto.id);

    if (user) {
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );

      if (passwordEquals) {
        return user;
      }
    }

    throw new HttpException('Wrong login or password', HttpStatus.FORBIDDEN);
  }
}
