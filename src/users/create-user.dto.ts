// interface CreateUserDto {
//   login: string;
//   password: string;
// }

import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly login: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  readonly password: string;
}
