import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { TracksController } from './tracks.controller';
import { TrackRepository } from './tracks.repository';
import { TracksService } from './tracks.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService, TrackRepository],
  exports: [TrackRepository, TracksService],
  imports: [TypeOrmModule.forFeature([Track])],
})
export class TracksModule {}
