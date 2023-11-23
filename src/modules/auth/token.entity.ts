import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  token: string;
}
