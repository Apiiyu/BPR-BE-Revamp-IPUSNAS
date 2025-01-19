// Class Validator
import { IsNotEmpty, IsString } from 'class-validator';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;
}
