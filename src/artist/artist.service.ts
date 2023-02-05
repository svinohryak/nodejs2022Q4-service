import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Artist, ArtistRepository } from './artist.repository';
import { CreateArtistDto } from './create-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private artistRepository: ArtistRepository) {}

  createArtist(userDto: CreateArtistDto) {
    const artist = this.artistRepository.create(userDto);
    return artist;
  }

  async getAllArtists(): Promise<Artist[]> {
    const findAllArtists = await this.artistRepository.findAll();
    return findAllArtists;
  }

  getArtist(id: string) {
    const artist = this.artistRepository.findUnique(id);

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  async deleteArtist(id: string) {
    const allArtists = await this.getAllArtists();
    const artistToRemove = allArtists.find((user) => user.id === id);

    if (!artistToRemove) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    } else {
      this.artistRepository.delete(id);
    }
  }

  async updateArtist(id: string, updateArtistDto: CreateArtistDto) {
    const artist = await this.artistRepository.findOneAndUpdate(
      id,
      updateArtistDto,
    );

    if (artist === 404) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }
}
