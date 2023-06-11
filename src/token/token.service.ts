import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { User } from 'src/user/user.entity';
import { Token } from './token.entity';

type PayloadJWT = Pick<User, 'email' | 'id' | 'role'>;
type CreateToken = Pick<Token, 'token' | 'user'>;

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
  ) {}

  async generateTokens(user: Pick<User, 'email' | 'id' | 'role'>) {
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
  async saveToken({ token, user }: CreateToken) {
    this.tokenRepository.save({ token, user });
  }

  async deleteToken(token: string) {
    return await this.tokenRepository.delete({ token });
  }

  async decode(tokenWithBearer: string) {
    const [_, tokenWithoutBearer] = tokenWithBearer.split(' ');
    return this.jwtService.decode(tokenWithoutBearer);
  }
}
