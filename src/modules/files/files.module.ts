// Controllers
import { FilesController } from './controllers/files.controller';

// NestJS Libraries
import { Module } from '@nestjs/common';

@Module({
  controllers: [FilesController],
})
export class FilesModule {}
