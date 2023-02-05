import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { User, UserRepository } from './user.repository';
import * as uuid from 'uuid';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  createUser(userDto: CreateUserDto) {
    const user = this.userRepository.create(userDto);
    const { password, ...userToReturn } = user;
    return userToReturn;
  }

  async getAllUsers(): Promise<User[]> {
    const findAllUsers = await this.userRepository.findAll();
    return findAllUsers;
  }

  getUser(id: string) {
    // if (!uuid.validate(id)) {
    //   throw new HttpException('User id should be uuid', HttpStatus.BAD_REQUEST);
    // }

    const user = this.userRepository.findUnique(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { password, ...userToReturn } = user;

    return userToReturn;
  }

  async deleteUser(id: string) {
    // if (!uuid.validate(id)) {
    //   throw new HttpException('User id should be uuid', HttpStatus.BAD_REQUEST);
    // }

    const allUsers = await this.getAllUsers();
    const userToRemove = allUsers.find((user) => user.id === id);

    if (!userToRemove) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      this.userRepository.delete(id);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (!uuid.validate(id)) {
      throw new HttpException('User id should be uuid', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOneAndUpdate(id, updateUserDto);

    if (user === 403) {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    } else if (user === 404) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      const { password, ...userToReturn } = user;
      return userToReturn;
    }
  }
}
