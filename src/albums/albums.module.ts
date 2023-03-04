import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from 'src/tracks/tracks.module';
import { Album } from './album.entity';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
  imports: [forwardRef(() => TracksModule), TypeOrmModule.forFeature([Album])],
})
export class AlbumsModule {}
