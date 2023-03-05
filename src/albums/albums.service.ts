import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FAV, FavoritesService } from 'src/favorites/favorites.service';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { CreateAlbumDto } from './create-album.dto';

const HttpExceptionMessage = {
  NOT_FOUND: 'Album not found',
};

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async createAlbum(dto: CreateAlbumDto) {
    const album = await this.albumsRepository.save(dto);
    return album;
  }

  async getAllAlbums(): Promise<Album[]> {
    const findAllTracks = await this.albumsRepository.find();
    return findAllTracks;
  }

  async getAlbum(id: string) {
    const album = await this.albumsRepository.findOneBy({ id });

    if (!album) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  async updateAlbum(id: string, dto: CreateAlbumDto) {
    const album = await this.getAlbum(id);

    await this.albumsRepository.update(
      { id },
      {
        name: dto.name || album.name,
        year: dto.year || album.year,
        artistId: dto.artistId || album.artistId,
      },
    );

    const updatedAlbum = await this.getAlbum(id);

    return updatedAlbum;
  }

  async deleteAlbum(id: string) {
    await this.getAlbum(id);

    await this.albumsRepository.delete(id);
    await this.favoritesService.delete(id, FAV.ALBUM);
  }

  async findAllById(ids: string[]) {
    const promises = ids.map(
      async (id) => await this.albumsRepository.findOneBy({ id }),
    );

    const result = await Promise.all(promises);

    return result;
  }
}
