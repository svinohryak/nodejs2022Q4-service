import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/albums/album.entity';
import { AlbumsService } from 'src/albums/albums.service';
import { Artist } from 'src/artist/artist.entity';
import { ArtistService } from 'src/artist/artist.service';
import { Track } from 'src/tracks/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { Repository } from 'typeorm';
import { Favorites } from './favorites.entity';
// import { FavoritesRepository } from './favorites.repository';

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
    // private favoritesRepository: FavoritesRepository,
    private artistService: ArtistService,
    private albumsService: AlbumsService,
    private tracksService: TracksService,
  ) {}

  private getCleanFavs = (favs, type: FAV) => {
    const nullLessFavs = favs.filter((a) => a !== null);
    // console.log(nullLessFavs);

    const arrFavs = nullLessFavs.map((i) => {
      // console.log('>>>', i);
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

  // // private async getFavoritiesByType<T extends keyof Favorites>(
  // //   type: FavsPathType,
  // // ): Promise<Pick<Favorites, T>> {
  // //   return await this.favoritesRepository.findOne({
  // //     where: { id: 1 },
  // //     select: [type],
  // //     relations: [type],
  // //   });
  // // }

  // // private async getEntityByType(type: FavsPathType, id: string) {
  // //   const entity = await this.getServiceByType(type).tryFindOne(id);

  // //   if (!entity) {
  // //     throw new HttpException(
  // //       `${type} with id=${id} not found`,
  // //       HttpStatus.UNPROCESSABLE_ENTITY,
  // //     );
  // //   }
  // //   return entity;
  // // }

  // async create(type: FavsPathType, id: string) {
  //   const entity = await this.getEntityByType(type, id);

  //   const favItem = await this.getFavoritiesByType<typeof type>(type);

  //   const isAlreadyInFavs = favItem[type].some((item) => item.id === id);

  //   if (isAlreadyInFavs) {
  //     throw new HttpException('Already in favorites', HttpStatus.CONFLICT);
  //   }

  //   await this.favoritesRepository.save({
  //     id: 1,
  //     [type]: [...favItem[type], entity],
  //   });

  //   return {
  //     message: `Id: ${id} successfully added to ${type}`,
  //   };
  // }

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
    // const oldIds = [...ids?.ids, id];
    const oldIds = ids?.ids || [];
    // ids?.ids.push(id);
    // const idsT =
    oldIds.push(id);

    const favsTest = this.favoritesRepository.create({
      fav: name,
      ids: oldIds,
    });
    this.favoritesRepository.save(favsTest);
    // this.favoritesRepository.save({ fav: name, ids: oldIds });
    //
    // this.favoritesRepository.save({
    //   fav: 'favs',
    //   // ids: oldIds,
    //   albums: ['111qwerasds'],
    // });
    // this.favoritesRepository.save({ fav: 'favs', albums: oldIds });
    // this.favoritesRepository.save({ fav: name, ids: [...oldIds, id] });
    // this.favoritesRepository.save({ fav: name, ids: ids?.ids });
  };

  async delete(id: string, name: FAV) {
    // const favs = await this.favoritesRepository.find();
    const favIds = await this.favoritesRepository.find({
      where: { fav: name },
    });

    // console.log('FAVSSS', favIds[0]);

    const filteredFavIds = favIds[0].ids.filter((fId) => fId !== id);

    if (favIds[0].ids.length === filteredFavIds.length) {
      throw new HttpException(
        `${name} is not in favorites`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.favoritesRepository.save({ fav: name, ids: filteredFavIds });

    // const favsIds: FavoritesIds = favs.reduce((acc, cur) => {
    //   acc[cur.fav] = cur.ids;
    //   return acc;
    // }, {});

    // const ids = favsIds[name];

    // const index = ids.findIndex((item) => item === id);

    // if (index < 0) {
    //   throw new HttpException(
    //     `${name} is not in favorites`,
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    // ids.splice(index, 1);
    // // this.favoritesRepository.delete({ fav: name });
    // this.favoritesRepository.save({ fav: name, ids: ids });
  }
}
