import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  artistId: string | null; // refers to Artist
}
