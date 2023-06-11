import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as subscribers from './entities';

const autoloadSubscribers = Object.keys(subscribers).map(
  (subscriber) => subscribers[subscriber],
);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        // entities: ['src/db/entities/*'],
        autoLoadEntities: true,
        migrationsTableName: 'migrations',
        // migrations: ['src/migration/*.ts'],
        synchronize: true, //убрать перед продакшеном
        subscribers: autoloadSubscribers,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DataBaseModule {}
