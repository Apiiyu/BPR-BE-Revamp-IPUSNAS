// DTOs
import { CreateBookDto } from '../dtos/create-book.dto';
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { ParamIdDto } from '../../../common/dtos/param-id.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';

// Guards
import { AuthenticationJWTGuard } from '../../../common/guards/authentication-jwt.guard';

// NestJS Libraries
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

// Services
import { BooksService } from '../services/books.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Books')
@Controller('books')
@UseGuards(AuthenticationJWTGuard)
export class BooksController {
  constructor(private readonly _booksService: BooksService) {}

  @ApiOperation({
    summary: 'Retrieve all books',
    description: 'Retrieve all books from the database',
  })
  @Get()
  @HttpCode(200)
  public async findAll(@Query() requestQuery: ListOptionDto): Promise<unknown> {
    const result = await this._booksService.findAll(requestQuery);

    return {
      message: 'Books has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Retrieve a book',
    description: 'Retrieve a book from the database',
  })
  @Get(':id')
  @HttpCode(200)
  public async findOne(@Param() requestParams: ParamIdDto): Promise<unknown> {
    const result = await this._booksService.findOneById(requestParams.id);

    return {
      message: 'Book has been retrieved successfully',
      result,
    };
  }

  @ApiBody({
    description: 'Create a book',
    type: CreateBookDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a book',
    description: 'Create a book in the database',
  })
  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('cover', {
      limits: {
        fileSize: 1 * 1024 * 1024, // 1MB
      },
    }),
  )
  public async create(
    @Body() payload: CreateBookDto,
    @Req() request: ICustomRequestHeaders,
    @UploadedFile() cover: Express.Multer.File,
  ): Promise<unknown> {
    const result = await this._booksService.create(
      cover,
      payload,
      request.user,
    );

    return {
      message: 'Book has been created successfully',
      result,
    };
  }

  @ApiBody({
    description: 'Update a book',
    type: UpdateBookDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update a book',
    description: 'Update a book in the database',
  })
  @Put(':id')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1 * 1024 * 1024, // 1MB
      },
    }),
  )
  public async update(
    @Param() requestParams: ParamIdDto,
    @Body() payload: UpdateBookDto,
    @Req() request: ICustomRequestHeaders,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<unknown> {
    const result = await this._booksService.update(
      requestParams.id,
      file,
      payload,
      request.user,
    );

    return {
      message: 'Book has been updated successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Delete a book',
    description: 'Delete a book in the database',
  })
  @Delete(':id')
  @HttpCode(200)
  public async delete(
    @Param() requestParams: ParamIdDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._booksService.delete(
      requestParams.id,
      request.user,
    );

    return {
      message: 'Book has been deleted successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Restore a book',
    description: 'Restore a book in the database',
  })
  @Post(':id/restore')
  @HttpCode(200)
  public async restore(
    @Param() requestParams: ParamIdDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._booksService.restore(
      requestParams.id,
      request.user,
    );

    return {
      message: 'Book has been restored successfully',
      result,
    };
  }
}
