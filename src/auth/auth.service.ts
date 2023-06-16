import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { Response } from 'express';

import { LoginDto, RegistrationDto } from './dto/auth.dto';

import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}
  private readonly cookieMaxAge: number = 30 * 24 * 60 * 60 * 1000;

  async registration(dto: RegistrationDto, response: Response) {
    const oldUser = await this.userService.findUserByEmail(dto.email);
    if (oldUser) throw new BadRequestException('user already registered!');

    const newUser = await this.userService.createUser(dto);
    const { access_token, refresh_token } =
      await this.tokenService.generateTokens(newUser);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: this.cookieMaxAge,
    });

    const userOmitPassword = omit(newUser, 'password');
    return { ...userOmitPassword, access_token };
  }

  async login(dto: LoginDto, response: Response) {
    const validateUser = await this.userService.validateUser(
      dto.email,
      dto.password,
    );
    const { access_token, refresh_token } =
      await this.tokenService.generateTokens(validateUser);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: this.cookieMaxAge,
    });

    const userOmitPassword = omit(validateUser, 'password');
    return { ...userOmitPassword, access_token };
  }

  async logout(authorizationHeaders: string, response: Response) {
    await this.tokenService.deleteToken(authorizationHeaders);
    response.clearCookie('refresh_token');
    return 'you logout';
  }

  async whoAmI(authorizationHeaders: string) {
    if (!authorizationHeaders)
      throw new UnauthorizedException('you are not authorized!');

    const payload = this.tokenService.decode(authorizationHeaders);
    const { password, ...userOmitPassword } =
      await this.userService.findUserByEmail(payload['email']);
    return userOmitPassword;
  }

  async refresh(response: Response, authorizationHeaders: string) {
    if (!authorizationHeaders)
      throw new UnauthorizedException('you are not authorized!');

    const payload = this.tokenService.decode(authorizationHeaders);
    const user = await this.userService.findUserByEmail(payload['email']);
    const { access_token, refresh_token } =
      await this.tokenService.generateTokens(user);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }
}
