import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('/api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @Get('users')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get('user/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }
}
