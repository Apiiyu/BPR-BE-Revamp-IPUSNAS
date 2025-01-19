// Class Validator
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public bookingId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public message: string;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  public is_read: boolean;
}
