import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string; // previous password

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  newPassword: string; // new password
}
