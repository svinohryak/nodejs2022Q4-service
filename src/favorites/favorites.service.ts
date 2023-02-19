import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album, AlbumsRepository } from 'src/albums/albums.repository';
import { Artist, ArtistRepository } from 'src/artist/artist.repository';
import { Track } from 'src/tracks/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { FavoritesRepository } from './favorites.repository';

export interface FavoritesRepsonse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
@Injectable()
export class FavoritesService {
  constructor(
    private artistRepository: ArtistRepository,
    private albumsRepository: AlbumsRepository,
    private tracksService: TracksService,
    private favoritesRepository: FavoritesRepository,
  ) {}

  getAll = () => {
    const favs = this.favoritesRepository.getAll();
    const { artists, albums, tracks } = favs;
    const favTracks = this.tracksService.findAllById(tracks);
    const favAlbums = this.albumsRepository.findAllById(albums);
    const favArtists = this.artistRepository.findAllById(artists);

    const allFavorites: FavoritesRepsonse = {
      artists: favArtists,
      albums: favAlbums,
      tracks: favTracks,
    };
    return allFavorites;
  };

  addTrack = async (id: string) => {
    const track = await this.tracksService.getTrack(id);

    if (!track) {
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.favoritesRepository.addTrack(track.id);
  };

  addAlbum = (id: string) => {
    const album = this.albumsRepository.findUnique(id);

    if (!album) {
      throw new HttpException(
        'Album does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.favoritesRepository.addAlbum(album.id);
  };

  addArtist = (id: string) => {
    const artist = this.artistRepository.findUnique(id);

    if (!artist) {
      throw new HttpException(
        'Artist does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.favoritesRepository.addArtist(artist.id);
  };

  deleteTrack(id: string) {
    const removedTrack = this.favoritesRepository.deleteTrack(id);

    if (removedTrack === 404) {
      throw new HttpException(
        'Track is not in favorites',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  deleteAlbum(id: string) {
    const removedAlbum = this.favoritesRepository.deleteAlbum(id);

    if (removedAlbum === 404) {
      throw new HttpException(
        'Album is not in favorites',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  deleteArtist(id: string) {
    const removedTrack = this.favoritesRepository.deleteArtist(id);

    if (removedTrack === 404) {
      throw new HttpException(
        'Artist is not in favorites',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
