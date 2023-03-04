import { Album } from 'src/albums/album.entity';
import { Favorites } from 'src/favorites/favorites.entity';
import { Track } from 'src/tracks/track.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  // @ManyToOne(() => Favorites, (favorites) => favorites.artists)
  // favorites: Favorites;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album;
  // albums: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track;
  // tracks: Track[];

  // @ManyToOne(() => Favorites, (favorites) => favorites.artists)
  // favorites: Favorites;
}
