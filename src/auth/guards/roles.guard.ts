import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  // reflector нужен для получения кастомных метаданных установлеными на контроллере
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!roles) return true;

    const req = ctx.switchToHttp().getRequest();
    const userToken = this.extractBearerTokenFromHeader(req);

    try {
      const { role: userRole } = await this.jwtService.verify(userToken);
      return this.matchRoles(roles, userRole);
    } catch (error) {
      log('---->', error);
      // TODO обработать невалидный токен
    }
  }

  private matchRoles(rolesList: string[], userRole: string): boolean {
    return rolesList.includes(userRole);
  }

  private extractBearerTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
