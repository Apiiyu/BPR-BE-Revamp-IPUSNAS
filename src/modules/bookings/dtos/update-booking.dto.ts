// DTOs
import { CreateBookingDto } from './create-booking.dto';

// NestJS Libraries
import { PartialType } from '@nestjs/swagger';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
