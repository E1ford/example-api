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
  SetMetadata,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserRole } from './user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.EDITOR)
  @Get('/1')
  async sad() {
    return 'for editor';
  }

  @Roles(UserRole.ADMIN)
  @Get('/2')
  async dasd() {
    return 'for admin';
  }

  @Get('/')
  async getAll(
    // TODO значение по умолчанию
    @Query('page', ParseIntPipe) page: number | undefined,
    @Query('limit', ParseIntPipe) limit: number | undefined,
  ) {
    return await this.userService.getAll(page, limit);
  }

  @Get('/:userId')
  async findById(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.findById(userId);
  }

  // защитить его
  @Patch('/')
  async changeRole(
    @Body('id', ParseIntPipe) userId: number,
    @Body('role', new ParseEnumPipe(UserRole)) role: UserRole,
  ) {
    return await this.userService.changeRole(userId, role);
  }
}
