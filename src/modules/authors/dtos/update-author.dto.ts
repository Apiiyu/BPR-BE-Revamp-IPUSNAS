// DTOs
import { CreateAuthorDto } from './create-author.dto';

// NestJS Libraries
import { PartialType } from '@nestjs/swagger';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {}
