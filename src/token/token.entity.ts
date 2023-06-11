import { User } from 'src/user/user.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @CreateDateColumn()
  date: string;

  @ManyToOne(() => User, (user) => user.id)
  user: number;
}
