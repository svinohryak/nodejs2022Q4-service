import { Injectable } from '@nestjs/common';
// import { db } from 'src/db';
import { CreateUserDto } from './create-user.dto';
import { UserRepository } from './user.repository';
// import { User } from './users.model';

@Injectable()
export class UsersService {
  // constructor(@Injectable(User) private userRepository: typeof User) {}
  constructor(private userRepository: UserRepository) {}

  createUser(userDto: CreateUserDto) {
    this.userRepository.create(userDto);
  }

  async getAllUsers() {
    const findAllUsers = this.userRepository.findAll();
    return findAllUsers;
  }

  getUser(id: string) {
    const user = this.userRepository.findUnique(id);
    return user;
  }

  //   private mockUsers = [];

  //   private userRep = db.userRepository()

  //   async createUser(userDto: CreateUserDto) {
  //     const createUser = db.userRepository('create');
  //     await createUser(userDto);
  //   }

  //   async getAllUsers() {
  //     const findAllUsers = db.userRepository('findAll');
  //     return await findAllUsers();
  //   }

  //   async createUser(dto: CreateUserDto) {
  //     const user = await this.userRepository.create(dto);
  //     return user;
  //   }

  //   async getAllUsers() {
  //     const users = await this.userRepository.findAll();
  //     return users;
  //   }
}
