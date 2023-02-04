import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { CreateUserDto } from './create-user.dto';

export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  //   updatedAt: number; // timestamp of last update
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
    const newUser: User = { id, version, createdAt, ...data };

    this.users.push(newUser);
  };

  // findAll = async (): Promise<User[]> => {
  findAll = () => {
    return this.users;
  };

  findUnique = (id: string) => {
    const user = this.users.find((user) => user.id === id);

    if (user) {
      return user;
    }
  };
}
