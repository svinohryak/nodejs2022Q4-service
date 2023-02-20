import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryColumn()
  fav: string;

  // @Column({ type: 'simple-array', nullable: true })
  // @Column({ type: 'simple-array', default: [], nullable: true })
  @Column('simple-array')
  ids: string[];
}
// @Entity()
// export class Favorites {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column('simple-array')
//   artists: string[]; // favorite artists ids

//   @Column('simple-array')
//   albums: string[]; // favorite albums ids

//   @Column('simple-array')
//   tracks: string[]; // favorite tracks ids
// }
// @Entity()
// export class Favorites {
//   @PrimaryColumn('text', { array: true })
//   artists: string[]; // favorite artists ids

//   @PrimaryColumn('text', { array: true })
//   albums: string[]; // favorite albums ids

//   @PrimaryColumn('text', { array: true })
//   tracks: string[]; // favorite tracks ids
// }

// @Column({
//   type: 'text',
//   array: true,
// })
// strings: string[]
