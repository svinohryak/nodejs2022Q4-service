import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { CreateTrackDto } from './create-track.dto';

export interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}
@Injectable()
export class TrackRepository {
  private tracks: Track[];

  constructor() {
    this.tracks = [];
  }

  create = (data: CreateTrackDto) => {
    const id = uuid.v4();
    const newTrack: Track = { id, ...data };

    this.tracks.push(newTrack);

    return newTrack;
  };

  findAll = async (): Promise<Track[]> => {
    return this.tracks;
  };

  findUnique = (id: string) => {
    const track = this.tracks.find((track) => track.id === id);
    return track;
  };

  findOneAndUpdate = (id: string, dto: CreateTrackDto) => {
    const track = this.tracks.find((user) => user.id === id);

    if (!track) {
      return 404;
    }

    track.name = dto.name || track.name;
    track.duration = dto.duration || track.duration;
    track.artistId = dto.artistId;

    return track;
  };

  delete = (id: string) => {
    const index = this.tracks.findIndex((artist) => artist.id === id);

    if (index < 0) {
      return 404;
    }

    this.tracks.splice(index, 1);
  };

  cleanArtistId = async (artistId: string) => {
    const track = this.tracks.find((track) => track.artistId === artistId);

    if (track) {
      track.artistId = null;
    }
  };
}
