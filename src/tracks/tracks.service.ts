import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './create-track.dto';
import { Track, TrackRepository } from './tracks.repository';

const HttpExceptionMessage = {
  NOT_FOUND: 'Track not found',
};
@Injectable()
export class TracksService {
  constructor(private tracksRepository: TrackRepository) {}

  createTrack(dto: CreateTrackDto) {
    const track = this.tracksRepository.create(dto);
    return track;
  }

  async getAllArtists(): Promise<Track[]> {
    const findAllTracks = await this.tracksRepository.findAll();
    return findAllTracks;
  }

  getTrack(id: string) {
    const track = this.tracksRepository.findUnique(id);

    if (!track) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return track;
  }

  updateTrack(id: string, dto: CreateTrackDto) {
    const track = this.tracksRepository.findOneAndUpdate(id, dto);

    if (track === 404) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return track;
  }

  deleteTrack(id: string) {
    const removedTrack = this.tracksRepository.delete(id);

    if (removedTrack === 404) {
      throw new HttpException(
        HttpExceptionMessage.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
