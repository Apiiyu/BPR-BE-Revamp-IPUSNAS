// DTOs
import { CreateNotificationDto } from './create-notification.dto';

// NestJS Libraries
import { PartialType } from '@nestjs/swagger';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
