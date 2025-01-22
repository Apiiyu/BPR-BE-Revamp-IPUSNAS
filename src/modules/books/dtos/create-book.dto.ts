// Class Validator
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

// NestJS Libraries
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public authorId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public genreId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public sysnopsis: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public content: string;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  public copies?: number;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  public isNew?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  public status?: string;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  public queue?: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  public cover?: any;
}
