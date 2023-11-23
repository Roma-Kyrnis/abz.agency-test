import { Position } from '../positions/position.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
