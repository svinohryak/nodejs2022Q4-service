import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TrackRepository } from './tracks.repository';
import { TracksService } from './tracks.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService, TrackRepository],
  exports: [TrackRepository],
})
export class TracksModule {}
