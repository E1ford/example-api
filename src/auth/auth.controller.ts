import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
  Headers,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('registration')
  async registration(
    @Body() dto: RegistrationDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.registration(dto, response);
  }

  @UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(dto, response);
  }

  @Get('who-am-i')
  async whoAmI(
    @Req() request: Request,
    @Headers('authorization') authorizationHeaders: string,
  ) {
    return this.authService.whoAmI(authorizationHeaders);
  }

  @Get('refresh')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Headers('authorization') authorizationHeaders: string,
  ) {
    return this.authService.refresh(response, authorizationHeaders);
  }

  @Get('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Headers('authorization') authorizationHeaders: string,
  ) {
    return this.authService.logout(authorizationHeaders, response);
  }
}
