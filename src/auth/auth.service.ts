import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { Response } from 'express';
import { compare } from 'bcryptjs';

import { LoginDto, RegistrationDto } from './dto/auth.dto';
import { Tokens, Users } from 'src/dataBase/entities';

type PayloadJWT = Pick<Users, 'email' | 'id' | 'role'>;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Tokens)
    private tokenRepository: Repository<Tokens>,
    private readonly jwtService: JwtService,
  ) {}

  async registration(dto: RegistrationDto, response: Response) {
    const oldUser = await this.findUser(dto.email);
    if (oldUser) throw new BadRequestException('user already registered!');

    const newUser = await this.createUser(dto);
    const { access_token, refresh_token } = await this.generateTokens(newUser);
    await this.saveToken(refresh_token, newUser.id);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const userOmitPassword = omit(newUser, 'password');
    return { ...userOmitPassword, access_token };
  }

  async saveToken(token: string, userId: number) {
    return await this.tokenRepository.save({ token, user: userId });
  }

  async deleteToken(token: string) {
    return await this.tokenRepository.delete({ token });
  }

  async findUser(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async createUser(user: RegistrationDto): Promise<Users> {
    return await this.usersRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.findUser(email);
    if (!user) throw new UnauthorizedException('user not found!');

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException('wrong password!');
    return user;
  }

  async generateTokens(user: Pick<Users, 'email' | 'id' | 'role'>) {
    const payload: PayloadJWT = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    const access_token = `Bearer ${await this.jwtService.signAsync(payload, {
      expiresIn: '10h',
    })}`;
    const refresh_token = `Bearer ${await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
    })}`;
    return { access_token, refresh_token };
  }

  async login(dto: LoginDto, response: Response) {
    const validateUser = await this.validateUser(dto.email, dto.password);
    const { access_token, refresh_token } = await this.generateTokens(
      validateUser,
    );
    await this.saveToken(refresh_token, validateUser.id);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const userOmitPassword = omit(validateUser, 'password');
    return { ...userOmitPassword, access_token };
  }

  async logout(authorizationHeaders: string, response: Response) {
    await this.deleteToken(authorizationHeaders);
    response.clearCookie('refresh_token');
    return 'you logout';
  }

  async whoAmI(authorizationHeaders: string) {
    const [_, tokenWithoutBearer] = authorizationHeaders.split(' ');

    const payload = this.jwtService.decode(tokenWithoutBearer);
    const { password, ...userOmitPassword } = await this.findUser(
      payload['email'],
    );
    return userOmitPassword;
  }

  async refresh(response: Response, authorizationHeaders: string) {
    const [_, tokenWithoutBearer] = authorizationHeaders.split(' ');

    const payload = this.jwtService.decode(tokenWithoutBearer);
    const user = await this.findUser(payload['email']);
    const { access_token, refresh_token } = await this.generateTokens(user);
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { access_token };
  }
}
