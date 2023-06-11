import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { TokenService } from './token.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { Token } from './token.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory(config) {
        return {
          secret: config.get('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    PassportModule,
    TypeOrmModule.forFeature([Token]),
  ],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService, JwtStrategy],
})
export class TokenModule {}
