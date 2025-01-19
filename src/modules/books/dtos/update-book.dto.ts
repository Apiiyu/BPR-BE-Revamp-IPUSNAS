// DTOs
import { CreateBookDto } from './create-book.dto';

// NestJS Libraries
import { PartialType } from '@nestjs/swagger';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
