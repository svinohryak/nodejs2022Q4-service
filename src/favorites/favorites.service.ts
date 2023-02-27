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
    console.log('++++', arrFavs);
    return nullLessFavs;
  };

  getAll = async () => {
    const favs = await this.favoritesRepository.find();

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

    // const cleanArtist = artists1.filter((a) => a !== null);

    // console.log('>>111>>', cleanArtist);
    const allFavorites: FavoritesRepsonse = {
      artists: this.getCleanFavs(artists1, FAV.ARTIST),
      albums: this.getCleanFavs(albums1, FAV.ALBUM),
      tracks: this.getCleanFavs(tracks1, FAV.TRACK),
    };
    // console.log(allFavorites.artists);
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
    console.log(items);
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
    console.log(oldIds);
    // ids?.ids.push(id);
    // const idsT =
    oldIds.push(id);
    console.log(oldIds);
    this.favoritesRepository.save({ fav: name, ids: oldIds });
    // this.favoritesRepository.save({ fav: name, ids: [...oldIds, id] });
    // this.favoritesRepository.save({ fav: name, ids: ids?.ids });
  };

  async delete(id: string, name: FAV) {
    const favs = await this.favoritesRepository.find();

    const favsIds: FavoritesIds = favs.reduce((acc, cur) => {
      acc[cur.fav] = cur.ids;
      return acc;
    }, {});

    const ids = favsIds[name];

    const index = ids.findIndex((item) => item === id);

    if (index < 0) {
      throw new HttpException(
        `${name} is not in favorites`,
        HttpStatus.NOT_FOUND,
      );
    }

    ids.splice(index, 1);
    // console.log(ids);
    // this.favoritesRepository.delete({ fav: name });
    this.favoritesRepository.save({ fav: name, ids: ids });
  }

  // async deleteTrack(id: string) {
  //   const favs = await this.favoritesRepository.find();

  //   const favsIds: FavoritesIds = favs.reduce((acc, cur) => {
  //     acc[cur.fav] = cur.ids;
  //     return acc;
  //   }, {});

  //   const ids = favsIds['track'];

  //   const index = ids.findIndex((item) => item === id);

  //   if (index < 0) {
  //     throw new HttpException(
  //       'Track is not in favorites',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   ids.splice(index, 1);
  //   console.log(ids);

  //   this.favoritesRepository.save({ fav: 'track', ids: [...ids] });
  // }

  // addTrack = async (id: string) => {
  //   const items = await this.tracksService.getAllTracks();
  //   const item = items.find((item) => item.id === id);

  //   const ids = await this.favoritesRepository.findOneBy({
  //     fav: 'track',
  //   });

  //   if (!item) {
  //     throw new HttpException(
  //       'Track does not exist',
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }
  //   const oldIds = ids.ids || [];

  //   this.favoritesRepository.save({ fav: 'track', ids: [...oldIds, id] });
  // };

  // addAlbum = async (id: string) => {
  // const album = await this.albumsService.getAlbum(id);
  // if (!album) {
  //   throw new HttpException(
  //     'Album does not exist',
  //     HttpStatus.UNPROCESSABLE_ENTITY,
  //   );
  // }
  // this.favoritesRepository.addAlbum(album.id);
  // };

  // addArtist = async (id: string) => {
  // const artist = await this.artistService.getArtist(id);
  // if (!artist) {
  //   throw new HttpException(
  //     'Artist does not exist',
  //     HttpStatus.UNPROCESSABLE_ENTITY,
  //   );
  // }
  // this.favoritesRepository.addArtist(artist.id);
  // };

  // deleteTrack(id: string) {
  // const removedTrack = this.favoritesRepository.deleteTrack(id);
  // if (removedTrack === 404) {
  //   throw new HttpException(
  //     'Track is not in favorites',
  //     HttpStatus.NOT_FOUND,
  //   );
  // }
  // }

  // deleteAlbum(id: string) {
  // const removedAlbum = this.favoritesRepository.deleteAlbum(id);
  // if (removedAlbum === 404) {
  //   throw new HttpException(
  //     'Album is not in favorites',
  //     HttpStatus.NOT_FOUND,
  //   );
  // }
  // }

  // deleteArtist(id: string) {
  // const removedTrack = this.favoritesRepository.deleteArtist(id);
  // if (removedTrack === 404) {
  //   throw new HttpException(
  //     'Artist is not in favorites',
  //     HttpStatus.NOT_FOUND,
  //   );
  // }
  // }

  // getAll = () => {
  //   const favs = this.favoritesRepository.getAll();
  //   const { artists, albums, tracks } = favs;
  //   const favTracks = this.tracksService.findAllById(tracks);
  //   const favAlbums = this.albumsService.findAllById(albums);
  //   const favArtists = this.artistService.findAllById(artists);

  //   const allFavorites: FavoritesRepsonse = {
  //     artists: favArtists,
  //     albums: favAlbums,
  //     tracks: favTracks,
  //   };
  //   return allFavorites;
  // };

  // addTrack = async (id: string) => {
  //   const track = await this.tracksService.getTrack(id);

  //   if (!track) {
  //     throw new HttpException(
  //       'Track does not exist',
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }

  //   this.favoritesRepository.addTrack(track.id);
  // };

  // addAlbum = async (id: string) => {
  //   const album = await this.albumsService.getAlbum(id);

  //   if (!album) {
  //     throw new HttpException(
  //       'Album does not exist',
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }

  //   this.favoritesRepository.addAlbum(album.id);
  // };

  // addArtist = async (id: string) => {
  //   const artist = await this.artistService.getArtist(id);

  //   if (!artist) {
  //     throw new HttpException(
  //       'Artist does not exist',
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }

  //   this.favoritesRepository.addArtist(artist.id);
  // };

  // deleteTrack(id: string) {
  //   const removedTrack = this.favoritesRepository.deleteTrack(id);

  //   if (removedTrack === 404) {
  //     throw new HttpException(
  //       'Track is not in favorites',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  // }

  // deleteAlbum(id: string) {
  //   const removedAlbum = this.favoritesRepository.deleteAlbum(id);

  //   if (removedAlbum === 404) {
  //     throw new HttpException(
  //       'Album is not in favorites',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  // }

  // deleteArtist(id: string) {
  //   const removedTrack = this.favoritesRepository.deleteArtist(id);

  //   if (removedTrack === 404) {
  //     throw new HttpException(
  //       'Artist is not in favorites',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  // }
}
