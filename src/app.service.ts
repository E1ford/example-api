import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Injectable()
export class AppService {
  // constructor(private configService: ConfigService) {}

  // eslint-disable-next-line prettier/prettier
  getHello(): string {
    // log(this.configService.get('POSTGRES_USERNAME'));
    return `process.env.POSTGRES_USERNAME`;
  }
}
