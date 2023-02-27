import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  // async login(userDto: CreateUserDto) {
  async login(userDto: User) {
    const user = await this.validateUser(userDto);
    const token = await this.generateToken(user);

    return token;
  }

  async registration(userDto: CreateUserDto) {
    // const candidate = await this.userService.getUserByLogin(userDto.login);

    // if (candidate) {
    //   throw new HttpException('User is already exist', HttpStatus.BAD_REQUEST);
    // }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    // return this.generateToken(user);
    return {
      id: user.id,
    };
  }

  //   private async generateToken(user: User) {
  private async generateToken(user: Omit<User, 'password'>) {
    // const payload = { login: user.login, userId: user.id };

    // return {
    //   token: this.jwtService.sign(payload),
    // };
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

  // private async validateUser(userDto: CreateUserDto) {
  private async validateUser(userDto: User) {
    // const user = await this.userService.getUserByLogin(userDto.login);
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
