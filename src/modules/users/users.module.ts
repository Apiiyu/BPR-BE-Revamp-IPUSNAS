// Controllers
import { UsersController } from './controllers/users.controller';

// NestJS Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { UsersEntity } from './entities/users.entity';

// Services
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersService],
})
export class UsersModule {}
