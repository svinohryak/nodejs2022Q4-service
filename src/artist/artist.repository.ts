import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { CreateArtistDto } from './create-artist.dto';

export interface Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

@Injectable()
export class ArtistRepository {
  private artists: Artist[];

  constructor() {
    this.artists = [];
  }

  create = (data?: CreateArtistDto) => {
    const id = uuid.v4();
    const newArtist: Artist = { id, ...data };
    this.artists.push(newArtist);

    return newArtist;
  };

  findOneAndUpdate = async (id: string, dto: CreateArtistDto) => {
    const artist = this.artists.find((user) => user.id === id);

    if (!artist) {
      return 404;
    }

    artist.grammy = dto.grammy;
    artist.name = dto.name;

    return artist;
  };

  findAll = async (): Promise<Artist[]> => {
    return this.artists;
  };

  findUnique = (id: string) => {
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  };

  delete = (id: string) => {
    const index = this.artists.findIndex((artist) => artist.id === id);
    this.artists.splice(index, 1);
  };

  findAllById(ids: string[]) {
    const result = [];

    ids.forEach((id) => {
      const artist = this.findUnique(id);
      result.push(artist);
    });

    return result;
  }
}
