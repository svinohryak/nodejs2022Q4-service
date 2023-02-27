import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private getUserToReturn = (user: User): Omit<User, 'password'> => {
    const { password, createdAt, updatedAt, ...userToReturn } = user;
    const date = new Date(createdAt);
    const dateUp = new Date(updatedAt);

    return {
      ...userToReturn,
      createdAt: date.getTime(),
      updatedAt: dateUp.getTime(),
    };
  };

  async createUser(userDto: CreateUserDto) {
    const user = await this.usersRepository.save(userDto);

    return this.getUserToReturn(user);
  }

  async getAllUsers(): Promise<User[]> {
    const findAllUsers = await this.usersRepository.find();
    return findAllUsers;
  }

  async getUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { password, ...userToReturn } = user;

    return userToReturn;
  }

  async getUserByLogin(login: string) {
    const user = await this.usersRepository.findOneBy({ login });

    return user;
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    return user;
  }

  async deleteUser(id: string) {
    const allUsers = await this.getAllUsers();
    const userToRemove = allUsers.find((user) => user.id === id);

    if (!userToRemove) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      await this.usersRepository.delete(id);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.password !== updateUserDto.oldPassword) {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }

    await this.usersRepository.update(
      { id },
      { password: updateUserDto.newPassword },
    );

    const updatedUser = await this.usersRepository.findOneBy({ id });

    return this.getUserToReturn(updatedUser);
  }
}
