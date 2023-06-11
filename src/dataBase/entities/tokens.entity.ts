import { Users } from './';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Tokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @CreateDateColumn()
  date: string;

  @ManyToOne(() => Users, (user) => user.id)
  user: number;
}
