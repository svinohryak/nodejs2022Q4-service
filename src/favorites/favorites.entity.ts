import { Album } from 'src/albums/album.entity';
import { Artist } from 'src/artist/artist.entity';
import { Track } from 'src/tracks/track.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryColumn()
  fav: string;

  // @Column({ type: 'simple-array', nullable: true })
  // @Column({ type: 'simple-array', default: [], nullable: true })
  @Column('simple-array')
  ids: string[];

  // @OneToMany(() => Artist, (artist) => artist.favorites)
  @ManyToOne(() => Artist, { onDelete: 'SET NULL' })
  // @ManyToOne(() => Artist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artists', referencedColumnName: 'id' })
  // @JoinColumn({ name: 'artist_id', referencedColumnName: 'id' })
  // artists: Artist;
  artists: Artist[];

  // @OneToMany(() => Album, (album) => album.favorites)
  @ManyToOne(() => Album, { onDelete: 'SET NULL' })
  // @ManyToOne(() => Album, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'albums', referencedColumnName: 'id' })
  @Column({ type: 'simple-array', default: [], nullable: true })
  // @JoinColumn({ name: 'album_id', referencedColumnName: 'id' })
  // albums: Album;
  albums: string[];

  // @OneToMany(() => Track, (track) => track.favorites)
  @ManyToOne(() => Track, { onDelete: 'SET NULL' })
  // @ManyToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tracks', referencedColumnName: 'id' })
  // @JoinColumn({ name: 'track_id', referencedColumnName: 'id' })
  // tracks: Track;
  tracks: Track[];
}
