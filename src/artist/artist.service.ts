import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TrackRepository } from 'src/tracks/tracks.repository';
import { Artist, ArtistRepository } from './artist.repository';
import { CreateArtistDto } from './create-artist.dto';

const HttpExceptionMessage = {
  NOT_FOUND: 'Artist not found',
};

@Injectable()
export class ArtistService {
  constructor(
    private artistRepository: ArtistRepository,
    private tracksRepository: TrackRepository,
  ) {}

  async createArtist(dto: CreateArtistDto) {
    const artist = this.artistRepository.create(dto);
    return artist;
  }

  async getAllArtists(): Promise<Artist[]> {
    const findAllArtists = await this.artistRepository.findAll();
    return findAllArtists;
  }

  getArtist(id: string) {
    const artist = this.artistRepository.findUnique(id);

    if (!artist) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return artist;
  }

  async deleteArtist(id: string) {
    const allArtists = await this.getAllArtists();
    const artistToRemove = allArtists.find((artist) => artist.id === id);
    if (!artistToRemove) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    } else {
      this.tracksRepository.cleanArtistId(id);
      this.artistRepository.delete(id);
    }
  }

  async updateArtist(id: string, updateArtistDto: CreateArtistDto) {
    const artist = await this.artistRepository.findOneAndUpdate(
      id,
      updateArtistDto,
    );

    if (artist === 404) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return artist;
  }
}
