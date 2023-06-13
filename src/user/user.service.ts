import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';

import { CreateUserDto } from './dto/user.dto';
import { User, UserRole } from './user.entity';

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

  async getAll(page: number, limit: number): Promise<any> {
    const MAX_LIMIT_USERS = 100;

    const take = limit && limit < 500 ? limit : MAX_LIMIT_USERS;
    const skip = page ? (page - 1) * limit : 0;

    const [users, totalCountUser] = await this.userRepository.findAndCount({
      take,
      skip,
    });

    users.forEach((el) => {
      delete el.password;
    });

    return {
      users,
      limit,
      currentPage: page,
      totalPage: totalCountUser / limit,
      totalCountUser,
    };
  }

  async findById(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new NotFoundException('user not found');
    const { password, ...userOmitPassword } = user;
    return userOmitPassword;
  }

  async changeRole(userId: number, role: UserRole) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('user not found');

    const userWithNewRole = await this.userRepository.save({ ...user, role });
    const { password, ...userOmitPassword } = userWithNewRole;
    return userOmitPassword;
  }
}
