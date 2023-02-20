import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FAV, FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites() {
    return this.favoritesService.getAll();
  }

  @Post('track/:id')
  addTrackToFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
  ) {
    return this.favoritesService.add(id, FAV.TRACK);
  }
  // @Post('track/:id')
  // addTrackToFavorites(
  //   @Param(
  //     'id',
  //     new ParseUUIDPipe({
  //       errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  //       version: '4',
  //     }),
  //   )
  //   id: string,
  // ) {
  //   return this.favoritesService.addTrack(id);
  // }

  @Post('album/:id')
  addAlbumToFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
  ) {
    return this.favoritesService.add(id, FAV.ALBUM);
  }
  // @Post('album/:id')
  // addAlbumToFavorites(
  //   @Param(
  //     'id',
  //     new ParseUUIDPipe({
  //       errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  //       version: '4',
  //     }),
  //   )
  //   id: string,
  // ) {
  //   return this.favoritesService.addAlbum(id);
  // }

  @Post('artist/:id')
  addArtistToFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
  ) {
    return this.favoritesService.add(id, FAV.ARTIST);
  }
  // @Post('artist/:id')
  // addArtistToFavorites(
  //   @Param(
  //     'id',
  //     new ParseUUIDPipe({
  //       errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  //       version: '4',
  //     }),
  //   )
  //   id: string,
  // ) {
  //   return this.favoritesService.addArtist(id);
  // }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
  ) {
    return this.favoritesService.delete(id, FAV.TRACK);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
  ) {
    return this.favoritesService.delete(id, FAV.ALBUM);
  }
  // @Delete('album/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // deleteAlbum(
  //   @Param(
  //     'id',
  //     new ParseUUIDPipe({
  //       errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  //       version: '4',
  //     }),
  //   )
  //   id: string,
  // ) {
  //   return this.favoritesService.deleteAlbum(id);
  // }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
  ) {
    return this.favoritesService.delete(id, FAV.ARTIST);
  }
}
