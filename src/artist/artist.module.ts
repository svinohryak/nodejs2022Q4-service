import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from '../tracks/tracks.module';
import { ArtistController } from './artist.controller';
import { Artist } from './artist.entity';
import { ArtistRepository } from './artist.repository';
import { ArtistService } from './artist.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepository],
  exports: [ArtistRepository],
  imports: [forwardRef(() => TracksModule), TypeOrmModule.forFeature([Artist])],
})
export class ArtistModule {}
