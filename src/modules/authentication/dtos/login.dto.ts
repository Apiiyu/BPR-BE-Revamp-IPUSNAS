// Class Validator
import { IsEmail, IsNotEmpty } from 'class-validator';

// Interfaces
import { ILogin } from '../interfaces/authentication.interface';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

export class LoginEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  public password: string;
}

export class LoginWithAccessToken implements ILogin {
  @ApiProperty()
  public accessToken: string;
}
