// Controllers
import { GenresController } from './controllers/genres.controller';

// Entities
import { GenresEntity } from './entities/genres.entity';

// NestJS Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { GenresService } from './services/genres.service';

@Module({
  controllers: [GenresController],
  exports: [GenresService],
  imports: [TypeOrmModule.forFeature([GenresEntity])],
  providers: [GenresService],
})
export class GenresModule {}
