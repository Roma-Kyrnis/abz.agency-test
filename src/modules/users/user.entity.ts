import { Position } from '../positions/position.entity';
import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';

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

  @Column('int')
  position_id: number;

  @ManyToOne(() => Position, (position) => position.users, { nullable: false })
  @JoinColumn({
    name: 'position_id',
    foreignKeyConstraintName: 'position_id',
    referencedColumnName: 'id',
  })
  position: Position;
}
