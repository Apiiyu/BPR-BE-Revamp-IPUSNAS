// Class Validator
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

export class CreateUpdateUserInterests {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public genre_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public user_id: string;
}

export class ArrayCreateUpdateUserInterests {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  public interests: CreateUpdateUserInterests[];
}
