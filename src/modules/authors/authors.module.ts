// Controllers
import { AuthorsController } from './controllers/authors.controller';

// Entities
import { AuthorsEntity } from './entities/authors.entity';

// NestJS Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { AuthorsService } from './services/authors.service';

@Module({
  controllers: [AuthorsController],
  exports: [AuthorsService],
  imports: [TypeOrmModule.forFeature([AuthorsEntity])],
  providers: [AuthorsService],
})
export class AuthorsModule {}
