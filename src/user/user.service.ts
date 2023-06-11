import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';

import { CreateUserDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const candidate = await this.findUserByEmail(user.email);
    if (candidate) throw new BadRequestException('user already exists!');

    return await this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('user not found!');

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException('wrong password!');
    return user;
  }
}
