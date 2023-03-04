import { Artist } from 'src/artist/artist.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Artist, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  // @JoinColumn({ name: 'artist_id', referencedColumnName: 'id' })
  artist: Artist;
}
