import { Position } from '../positions/position.entity';
import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column('text')
  photo: string;

  @Column('bigint')
  registration_timestamp: number;

  @OneToOne(() => Position)
  @JoinColumn({ name: 'position_id' })
  position: Position;
}
