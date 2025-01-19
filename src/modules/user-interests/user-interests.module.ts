// Controllers
import { UserInterestsController } from './controllers/user-interests.controller';

// Entities
import { UserInterestsEntity } from './entities/user-interests.entity';

// NestJS Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { UserInterestsService } from './services/user-interests.service';

@Module({
  controllers: [UserInterestsController],
  exports: [UserInterestsService],
  imports: [TypeOrmModule.forFeature([UserInterestsEntity])],
  providers: [UserInterestsService],
})
export class UserInterestsModule {}
