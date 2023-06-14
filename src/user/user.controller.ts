import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Patch,
  Body,
  ParseEnumPipe,
  UseGuards,
  DefaultValuePipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserRole } from './user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
  ) {
    return await this.userService.getAll(page, limit);
  }

  @Get('/:userId')
  async findById(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.findById(userId);
  }

  @Roles(UserRole.ADMIN)
  @Patch('/')
  async changeRole(
    @Body('id', ParseIntPipe) userId: number,
    @Body('role', new ParseEnumPipe(UserRole)) role: UserRole,
  ) {
    return await this.userService.changeRole(userId, role);
  }
}
