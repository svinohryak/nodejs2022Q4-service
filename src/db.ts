import { CreateUserDto } from './users/create-user.dto';
import * as uuid from 'uuid';

interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  //   updatedAt: number; // timestamp of last update
}

interface DB {
  users: User[];
}

class Db {
  private db: DB;

  constructor() {
    this.db = { users: [] };
  }

  //   userRepository(method: 'create' | 'findAll') {
  //     switch (method) {
  //       case 'create':
  //         return async (data?: CreateUserDto): Promise<void> => {
  //           const id = uuid.v4();
  //           const version = 1;
  //           const createdAt = Date.now();
  //           const newUser: User = { id, version, createdAt, ...data };

  //           this.db.users.push(newUser);
  //         };
  //       case 'findAll':
  //         return async (): Promise<User[]> => {
  //           return this.db.users;
  //         };

  //       default:
  //         break;
  //     }
  //   }

  createUser = async (data?: CreateUserDto): Promise<void> => {
    const id = uuid.v4();
    const version = 1;
    const createdAt = Date.now();
    const newUser: User = { id, version, createdAt, ...data };

    this.db.users.push(newUser);
  };

  findAllUsers = async (): Promise<User[]> => {
    return this.db.users;
  };
}

export const db = new Db();
