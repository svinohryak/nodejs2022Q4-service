import { forwardRef, Module } from '@nestjs/common';
import { AlbumsModule } from 'src/albums/albums.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesRepository } from './favorites.repository';
import { FavoritesService } from './favorites.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesRepository],
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumsModule),
  ],
})
export class FavoritesModule {}
