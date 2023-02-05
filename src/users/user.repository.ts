import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

// interface DB {
//   users: User[];
// }

@Injectable()
export class UserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  //   create = async (data?: CreateUserDto): Promise<void> => {
  create = (data?: CreateUserDto) => {
    const id = uuid.v4();
    const version = 1;
    const createdAt = Date.now();
    const updatedAt = Date.now();
    const newUser: User = { id, version, createdAt, updatedAt, ...data };

    this.users.push(newUser);

    return newUser;
  };

  findOneAndUpdate = async (id: string, updateUserDto: UpdateUserDto) => {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return 404;
    }

    if (user.password !== updateUserDto.oldPassword) {
      return 403;
    }

    user.password = updateUserDto.newPassword;
    user.version++;
    user.updatedAt = Date.now();

    return user;
  };

  // findAll = async (): Promise<User[]> => {
  findAll = async (): Promise<User[]> => {
    return this.users;
  };

  findUnique = (id: string) => {
    const user = this.users.find((user) => user.id === id);
    return user;
  };

  delete = (id: string) => {
    const index = this.users.findIndex((user) => user.id === id);
    this.users.splice(index, 1);
  };
}
