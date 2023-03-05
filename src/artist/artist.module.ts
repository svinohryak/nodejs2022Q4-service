import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { ArtistController } from './artist.controller';
import { Artist } from './artist.entity';
import { ArtistService } from './artist.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
  imports: [
    forwardRef(() => FavoritesModule),
    TypeOrmModule.forFeature([Artist]),
  ],
})
export class ArtistModule {}
