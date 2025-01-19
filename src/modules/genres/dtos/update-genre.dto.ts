// DTOs
import { CreateGenreDto } from './create-genre.dto';

// NestJS Libraries
import { PartialType } from '@nestjs/swagger';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {}
