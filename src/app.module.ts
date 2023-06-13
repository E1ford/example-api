import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { DataBaseModule } from './dataBase/dataBase.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    DataBaseModule,
    UserModule,
    TokenModule,
    AdminModule,
    AuthModule,
  ],
})
export class AppModule {}
