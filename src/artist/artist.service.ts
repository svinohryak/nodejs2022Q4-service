import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TracksService } from 'src/tracks/tracks.service';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './create-artist.dto';

const HttpExceptionMessage = {
  NOT_FOUND: 'Artist not found',
};

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private tracksService: TracksService,
  ) {}

  async createArtist(dto: CreateArtistDto) {
    const artist = await this.artistRepository.save(dto);
    return artist;
  }

  async getAllArtists(): Promise<Artist[]> {
    const findAllArtists = await this.artistRepository.find();
    return findAllArtists;
  }

  async getArtist(id: string) {
    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return artist;
  }

  async deleteArtist(id: string) {
    await this.getArtist(id);

    // this.tracksService.cleanArtistId(id);
    this.artistRepository.delete(id);
  }

  async updateArtist(id: string, dto: CreateArtistDto) {
    const artist = await this.getArtist(id);

    await this.artistRepository.update(
      { id },
      {
        grammy: dto.grammy,
        name: dto.name || artist.name,
      },
    );

    const updatedArtist = await this.getArtist(id);

    return updatedArtist;
  }

  async findAllById(ids: string[]) {
    const promises = ids.map(
      async (id) => await this.artistRepository.findOneBy({ id }),
    );

    const result = await Promise.all(promises);

    return result;
  }
}
