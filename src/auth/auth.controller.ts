import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/create-user.dto';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  // login(@Body() userDto: CreateUserDto) {
  login(@Body() userDto: User) {
    return this.authService.login(userDto);
  }

  @Post('signup')
  signup(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
}
