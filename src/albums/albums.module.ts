import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from 'src/tracks/tracks.module';
import { Album } from './album.entity';
import { AlbumsController } from './albums.controller';
import { AlbumsRepository } from './albums.repository';
import { AlbumsService } from './albums.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, AlbumsRepository],
  exports: [AlbumsService, AlbumsRepository],
  imports: [forwardRef(() => TracksModule), TypeOrmModule.forFeature([Album])],
})
export class AlbumsModule {}
