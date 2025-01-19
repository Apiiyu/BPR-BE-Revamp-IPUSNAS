// Controllers
import { BookingsController } from './controllers/bookings.controller';

// Entities
import { BookingsEntity } from './entities/bookings.entity';

// NestJS Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { BookingsService } from './services/bookings.service';

@Module({
  controllers: [BookingsController],
  exports: [BookingsService],
  imports: [TypeOrmModule.forFeature([BookingsEntity])],
  providers: [BookingsService],
})
export class BookingsModule {}
