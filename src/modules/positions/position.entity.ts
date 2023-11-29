import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../users/user.entity';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, user => user.position)
  users?: User[];
}
