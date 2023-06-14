import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class DefaultValuePipe implements PipeTransform {
  defaultValue: number | string | null = null;

  constructor(defaultValue: number | string) {
    this.defaultValue = defaultValue;
  }

  transform(value: any) {
    if (!value) return this.defaultValue;
    return value;
  }
}
