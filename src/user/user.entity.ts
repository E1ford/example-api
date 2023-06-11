import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  patronymic: string;

  @Column({ type: 'enum', enum: UserGender, default: UserGender.OTHER })
  gender: UserGender;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @CreateDateColumn({ nullable: true, default: null })
  birthday: Date;

  @CreateDateColumn({ type: 'enum', enum: UserRole, default: UserRole.GHOST })
  role: UserRole;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
