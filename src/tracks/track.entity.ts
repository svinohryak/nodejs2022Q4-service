import { Album } from 'src/albums/album.entity';
import { Artist } from 'src/artist/artist.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null;

  @Column({ nullable: true })
  albumId: string | null;

  @Column()
  duration: number;

  @ManyToOne(() => Artist, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  // @JoinColumn({ name: 'artist_id', referencedColumnName: 'id' })
  artist: Artist;

  @ManyToOne(() => Album, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'albumId', referencedColumnName: 'id' })
  // @JoinColumn({ name: 'album_id', referencedColumnName: 'id' })
  album: Album;
}
