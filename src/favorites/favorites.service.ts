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
interface FavoritesIds {
  artist?: string[];
  album?: string[];
  track?: string[];
}

export enum FAV {
  ALBUM = 'album',
  ARTIST = 'artist',
  TRACK = 'track',
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

  private getCleanFavs = (favs, type: FAV) => {
    const nullLessFavs = favs.filter((a) => a !== null);

    const arrFavs = nullLessFavs.map((i) => {
      switch (type) {
        case FAV.ARTIST:
          return { id: i.id, name: i.name, grammy: i.grammy };

        case FAV.ALBUM:
          return { id: i.id, name: i.name, year: i.year, artistId: i.artistId };

        case FAV.TRACK:
          return {
            id: i.id,
            name: i.name,
            albumId: i.albumId,
            artistId: i.artistId,
            duration: i.duration,
          };

        default:
          break;
      }
    });
    return nullLessFavs;
  };

  getAll = async () => {
    const favs = await this.favoritesRepository.find();

    console.log(favs);

    const favsIds: FavoritesIds = favs.reduce((acc, cur) => {
      acc[cur.fav] = cur.ids;
      return acc;
    }, {});

    const tracks1 = await this.tracksService.findAllById(
      favsIds['track'] || [],
    );
    const albums1 = await this.albumsService.findAllById(
      favsIds['album'] || [],
    );
    const artists1 = await this.artistService.findAllById(
      favsIds['artist'] || [],
    );

    const allFavorites: FavoritesRepsonse = {
      artists: this.getCleanFavs(artists1, FAV.ARTIST),
      albums: this.getCleanFavs(albums1, FAV.ALBUM),
      tracks: this.getCleanFavs(tracks1, FAV.TRACK),
    };

    return allFavorites;
  };

  add = async (id: string, name: FAV) => {
    let items: (Artist | Album | Track)[];

    switch (name) {
      case FAV.ALBUM:
        items = await this.albumsService.getAllAlbums();
        break;
      case FAV.ARTIST:
        items = await this.artistService.getAllArtists();
        break;
      case FAV.TRACK:
        items = await this.tracksService.getAllTracks();
        break;

      default:
        break;
    }

    const item = items.find((item) => item.id === id);

    const ids = await this.favoritesRepository.findOneBy({
      fav: name,
    });

    if (!item) {
      throw new HttpException(
        `${name} does not exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const oldIds = ids?.ids || [];
    oldIds.push(id);

    const favsTest = this.favoritesRepository.create({
      fav: name,
      ids: oldIds,
    });
    this.favoritesRepository.save(favsTest);
  };

  async delete(id: string, name: FAV, isFromFav?: boolean) {
    const favIds = await this.favoritesRepository.find({
      where: { fav: name },
    });

    const filteredFavIds = favIds[0]?.ids.filter((fId) => fId !== id);

    if (favIds[0].ids.length === filteredFavIds?.length && isFromFav) {
      throw new HttpException(
        `${name} is not in favorites`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.favoritesRepository.save({ fav: name, ids: filteredFavIds });
  }
}
