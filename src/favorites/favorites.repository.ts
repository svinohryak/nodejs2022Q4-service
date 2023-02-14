import { Injectable } from '@nestjs/common';
import { Album } from 'src/albums/albums.repository';
import { Artist } from 'src/artist/artist.repository';
import { Track } from 'src/tracks/tracks.repository';
import * as uuid from 'uuid';
// import { CreateAlbumDto } from './create-album.dto';

export interface FavoritesRepsonse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

@Injectable()
export class FavoritesRepository {
  private favs: Favorites;

  constructor() {
    this.favs = { artists: [], albums: [], tracks: [] };
  }

  getAll = () => {
    return this.favs;
  };

  addTrack = (data: string) => {
    this.favs.tracks.push(data);
  };

  addAlbum = (data: string) => {
    this.favs.albums.push(data);
  };

  addArtist = (data: string) => {
    this.favs.artists.push(data);
  };

  deleteTrack = (id: string) => {
    const index = this.favs.tracks.findIndex((track) => track === id);

    if (index < 0) {
      return 404;
    }

    this.favs.tracks.splice(index, 1);
  };

  deleteAlbum = (id: string) => {
    const index = this.favs.albums.findIndex((album) => album === id);

    if (index < 0) {
      return 404;
    }

    this.favs.albums.splice(index, 1);
  };

  deleteArtist = (id: string) => {
    const index = this.favs.artists.findIndex((artist) => artist === id);

    if (index < 0) {
      return 404;
    }

    this.favs.artists.splice(index, 1);
  };
}
