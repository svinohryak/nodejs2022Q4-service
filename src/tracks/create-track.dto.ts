import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  duration: number; // integer number

  @IsOptional()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  artistId: string | null;

  @IsOptional()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  albumId: string | null;
}
