// Class Validator
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public bookId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public userId: string;
}

export class ExpectedCreateOrUpdateBookingDto extends CreateBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public duration: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public dueDate: number;
}
