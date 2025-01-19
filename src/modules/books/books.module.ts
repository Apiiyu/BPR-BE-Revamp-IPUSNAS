// Controllers
import { BooksController } from './controllers/books.controller';

// Entities
import { BooksEntity } from './entities/books.entity';

// NestJS Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { BooksService } from './services/books.service';

@Module({
  controllers: [BooksController],
  exports: [BooksService],
  imports: [TypeOrmModule.forFeature([BooksEntity])],
  providers: [BooksService],
})
export class BooksModule {}
