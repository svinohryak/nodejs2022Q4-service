import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [UsersModule, TracksModule, ArtistModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
