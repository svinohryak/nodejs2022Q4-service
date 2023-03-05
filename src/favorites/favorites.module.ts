import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsModule } from 'src/albums/albums.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavoritesController } from './favorites.controller';
import { Favorites } from './favorites.entity';
import { FavoritesService } from './favorites.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumsModule),
    TypeOrmModule.forFeature([Favorites]),
  ],
})
export class FavoritesModule {}
