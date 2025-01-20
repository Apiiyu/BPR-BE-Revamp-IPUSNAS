// Express
import { Response } from 'express';

// Guards
import { AuthenticationJWTGuard } from '../../../common/guards/authentication-jwt.guard';

// NestJS Libraries
import {
  Controller,
  Get,
  HttpCode,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { basename, join } from 'path';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  private readonly _directories = `${process.env.APP_UPLOAD_DIRECTORIES}`;

  @ApiOperation({
    summary: 'Retrieve a public file',
    description: 'Retrieve a public file from the server',
  })
  @Get(':filepath')
  @HttpCode(200)
  public findOne(
    @Param('filepath') filepath: string,
    @Res() responseBody: Response,
  ): any {
    const filePath = join(`${this._directories}/public`, filepath);
    const filename = basename(filePath);
    const mimeType = filename.split('.')[1];

    responseBody.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}`,
    );
    responseBody.setHeader('Content-Type', mimeType);
    responseBody.sendFile(filePath);

    return {
      message: 'Successfully received a file!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a private file',
    description: 'Retrieve a private file from the server',
  })
  @Get('private/:filepath')
  @HttpCode(200)
  @UseGuards(AuthenticationJWTGuard)
  public findOnePrivate(
    @Param('filepath') filepath: string,
    @Res() responseBody: Response,
  ): any {
    const filePath = join(`${this._directories}/private`, filepath);
    const filename = basename(filePath);
    const mimeType = filename.split('.')[1];
    responseBody.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}`,
    );
    responseBody.setHeader('Content-Type', mimeType);
    responseBody.sendFile(filePath);

    return {
      message: 'Successfully received a file!',
    };
  }
}
