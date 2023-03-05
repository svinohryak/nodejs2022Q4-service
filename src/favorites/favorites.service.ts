import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/albums/album.entity';
import { AlbumsService } from 'src/albums/albums.service';
import { Artist } from 'src/artist/artist.entity';
import { ArtistService } from 'src/artist/artist.service';
import { Track } from 'src/tracks/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { Repository } from 'typeorm';
import { Favorites } from './favorites.entity';

export interface FavoritesRepsonse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export enum FAV {
  ALBUM = 'albums',
  ARTIST = 'artists',
  TRACK = 'tracks',
}
@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    private tracksService: TracksService,
  ) {}

  getAll = async () => {
    const favsIds = await this.favoritesRepository.findOne({
      where: { id: 1 },
    });

    const albums = await this.albumsService.findAllById(favsIds?.albums || []);
    const artists = await this.artistService.findAllById(
      favsIds?.artists || [],
    );
    const tracks = await this.tracksService.findAllById(favsIds?.tracks || []);

    return {
      albums: albums,
      artists: artists,
      tracks: tracks,
    };
  };

  add = async (id: string, name: FAV) => {
    let items: (Artist | Album | Track)[];
    let currIds: string[];
    const favsIds = await this.favoritesRepository.findOne({
      where: { id: 1 },
    });

    switch (name) {
      case FAV.ALBUM:
        items = await this.albumsService.getAllAlbums();
        currIds = favsIds?.albums || [];
        break;

      case FAV.ARTIST:
        items = await this.artistService.getAllArtists();
        currIds = favsIds?.artists || [];
        break;

      case FAV.TRACK:
        items = await this.tracksService.getAllTracks();
        currIds = favsIds?.tracks || [];
        break;

      default:
        break;
    }

    const item = items.find((item) => item.id === id);

    if (!item) {
      throw new HttpException(
        `${name} does not exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const uniqueIds = [...new Set([...currIds, id])];

    await this.favoritesRepository.save({ id: 1, [name]: uniqueIds });

    return {
      message: `${name} added to favorites`,
    };
  };

  async delete(id: string, name: FAV, isFromFav?: boolean) {
    const favsIds = await this.favoritesRepository.findOne({
      where: { id: 1 },
    });

    const currIds = favsIds?.[name] || [];

    const isInFavs = currIds?.some((item) => item === id);

    if (isInFavs === false && isFromFav) {
      throw new HttpException(
        `${name} is not in favorites`,
        HttpStatus.NOT_FOUND,
      );
    }

    const filteredIds = currIds?.filter((item) => item !== id);

    if (filteredIds) {
      await this.favoritesRepository.save({ id: 1, [name]: filteredIds });
    }
  }
}
