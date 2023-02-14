import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TrackRepository } from 'src/tracks/tracks.repository';
import { Album, AlbumsRepository } from './albums.repository';
import { CreateAlbumDto } from './create-album.dto';

const HttpExceptionMessage = {
  NOT_FOUND: 'Album not found',
};

@Injectable()
export class AlbumsService {
  constructor(
    private albumsRepository: AlbumsRepository,
    private tracksRepository: TrackRepository,
  ) {}

  createAlbum(dto: CreateAlbumDto) {
    const album = this.albumsRepository.create(dto);
    return album;
  }

  async getAllAlbums(): Promise<Album[]> {
    const findAllTracks = await this.albumsRepository.findAll();
    return findAllTracks;
  }

  getAlbum(id: string) {
    const album = this.albumsRepository.findUnique(id);

    if (!album) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  updateAlbum(id: string, dto: CreateAlbumDto) {
    const album = this.albumsRepository.findOneAndUpdate(id, dto);

    if (album === 404) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  async deleteAlbum(id: string) {
    const allAlbums = await this.getAllAlbums();
    const albumToRemove = allAlbums.find((album) => album.id === id);

    if (!albumToRemove) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    } else {
      this.tracksRepository.cleanAlbumId(id);
      this.albumsRepository.delete(id);
    }
  }
}
