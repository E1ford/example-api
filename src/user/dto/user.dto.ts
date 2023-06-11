import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDate,
  IsStrongPassword,
} from 'class-validator';

import { UserGender } from '../user.entity';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  patronymic: string;

  @IsEnum(UserGender)
  gender: UserGender;

  @IsEmail()
  email: string;

  @IsString() //тут фото
  @IsOptional()
  avatar: string;

  @IsDate()
  @IsOptional()
  birthday: Date;
}

export class LoginDto {
  @IsStrongPassword()
  password: string;

  @IsEmail()
  email: string;
}
