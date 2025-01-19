// Class Validator
import { IsNotEmpty, IsString } from 'class-validator';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;
}
