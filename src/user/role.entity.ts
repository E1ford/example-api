// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
// } from 'typeorm';

// export enum UserRole {
//   ADMIN = 'admin',
//   EDITOR = 'editor',
//   GHOST = 'ghost',
// }

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'enum', enum: UserRole, default: UserRole.GHOST })
//   role: UserRole;

//   @CreateDateColumn()
//   created: Date;
// }
