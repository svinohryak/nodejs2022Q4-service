import { forwardRef, Module } from '@nestjs/common';
import { TracksModule } from '../tracks/tracks.module';
import { TrackRepository } from 'src/tracks/tracks.repository';
import { TracksService } from 'src/tracks/tracks.service';
import { ArtistController } from './artist.controller';
import { ArtistRepository } from './artist.repository';
import { ArtistService } from './artist.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepository],
  exports: [ArtistService],
  imports: [forwardRef(() => TracksModule)],
})
export class ArtistModule {}
