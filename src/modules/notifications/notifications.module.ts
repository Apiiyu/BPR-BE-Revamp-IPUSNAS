// Controllers
import { NotificationsController } from './controllers/notifications.controller';

// Entities
import { NotificationsEntity } from './entities/notifications.entity';

// NestJS Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { NotificationsService } from './services/notifications.service';

@Module({
  controllers: [NotificationsController],
  exports: [NotificationsService],
  imports: [TypeOrmModule.forFeature([NotificationsEntity])],
  providers: [NotificationsService],
})
export class NotificationsModule {}
