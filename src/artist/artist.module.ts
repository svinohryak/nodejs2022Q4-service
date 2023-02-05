import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistRepository } from './artist.repository';
import { ArtistService } from './artist.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepository],
})
export class ArtistModule {}
