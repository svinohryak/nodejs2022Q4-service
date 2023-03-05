import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryColumn({ default: 1 })
  @Exclude()
  id: number;

  @Column({ type: 'simple-array', nullable: true })
  artists: string[];

  @Column({ type: 'simple-array', nullable: true })
  albums: string[];

  @Column({ type: 'simple-array', nullable: true })
  tracks: string[];
}
