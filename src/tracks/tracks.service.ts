import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './create-track.dto';
import { Track } from './track.entity';

const HttpExceptionMessage = {
  NOT_FOUND: 'Track not found',
};
@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  async createTrack(dto: CreateTrackDto) {
    const track = await this.tracksRepository.save(dto);
    return track;
  }

  async getAllTracks(): Promise<Track[]> {
    const findAllTracks = await this.tracksRepository.find();

    return findAllTracks;
  }

  async getTrack(id: string) {
    const track = await this.tracksRepository.findOneBy({ id });

    if (!track) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return track;
  }

  async updateTrack(id: string, dto: CreateTrackDto) {
    const track = await this.getTrack(id);

    await this.tracksRepository.update(
      { id },
      {
        name: dto.name || track.name,
        duration: dto.duration || track.duration,
        artistId: dto.artistId,
      },
    );

    const updatedTrack = await this.getTrack(id);

    return updatedTrack;
  }

  async deleteTrack(id: string) {
    const track = await this.getTrack(id);

    if (track) {
      await this.tracksRepository.delete(id);
    }
  }

  async cleanArtistId(artistId: string) {
    const track = await this.tracksRepository.findOneBy({ artistId });

    if (track) {
      await this.tracksRepository.update(
        { id: track.id },
        {
          artistId: null,
        },
      );
    }
  }

  async cleanAlbumId(albumId: string) {
    const track = await this.tracksRepository.findOneBy({ albumId });

    if (track) {
      await this.tracksRepository.update(
        { id: track.id },
        {
          albumId: null,
        },
      );
    }
  }

  async findAllById(ids: string[]) {
    const promises = ids.map(
      async (id) => await this.tracksRepository.findOneBy({ id }),
    );

    const result = await Promise.all(promises);

    return result;
  }
}
