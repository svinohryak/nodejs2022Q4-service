import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { CreateAlbumDto } from './create-album.dto';

export interface Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

@Injectable()
export class AlbumsRepository {
  private albums: Album[];

  constructor() {
    this.albums = [];
  }

  create = (data: CreateAlbumDto) => {
    const id = uuid.v4();
    const newAlbum: Album = { id, ...data };

    this.albums.push(newAlbum);

    return newAlbum;
  };

  findAll = async (): Promise<Album[]> => {
    return this.albums;
  };

  findUnique = (id: string) => {
    const album = this.albums.find((album) => album.id === id);
    return album;
  };

  findOneAndUpdate = (id: string, dto: CreateAlbumDto) => {
    const album = this.albums.find((user) => user.id === id);

    if (!album) {
      return 404;
    }

    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId;

    return album;
  };

  delete = (id: string) => {
    const index = this.albums.findIndex((artist) => artist.id === id);

    if (index < 0) {
      return 404;
    }

    this.albums.splice(index, 1);
  };

  findAllById(ids: string[]) {
    const result = [];

    ids.forEach((id) => {
      const album = this.findUnique(id);
      result.push(album);
    });

    return result;
  }
}
