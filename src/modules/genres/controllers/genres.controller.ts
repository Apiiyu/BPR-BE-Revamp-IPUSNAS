// DTOs
import { CreateGenreDto } from '../dtos/create-genre.dto';
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { ParamIdDto } from '../../../common/dtos/param-id.dto';
import { UpdateGenreDto } from '../dtos/update-genre.dto';

// Guards
import { AuthenticationJWTGuard } from '../../../common/guards/authentication-jwt.guard';

// NestJS Libraries
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  UseGuards,
} from '@nestjs/common';

// Services
import { GenresService } from '../services/genres.service';

@ApiBearerAuth()
@ApiTags('Genres')
@Controller('genres')
@UseGuards(AuthenticationJWTGuard)
export class GenresController {
  constructor(private readonly _genresService: GenresService) {}

  @ApiOperation({
    summary: 'Retrieve all genres',
    description: 'Retrieve all genres from the database',
  })
  @Get()
  @HttpCode(200)
  public async findAll(@Query() requestQuery: ListOptionDto): Promise<unknown> {
    const result = await this._genresService.findAll(requestQuery);

    return {
      message: 'Genres has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Retrieve a genre',
    description: 'Retrieve a genre from the database',
  })
  @Get(':id')
  @HttpCode(200)
  public async findOne(@Param() requestParams: ParamIdDto): Promise<unknown> {
    const result = await this._genresService.findOneById(requestParams.id);

    return {
      message: 'Genre has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Create a genre',
    description: 'Create a genre in the database',
  })
  @Post()
  @HttpCode(201)
  public async create(
    @Body() payload: CreateGenreDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._genresService.create(payload, request.user);

    return {
      message: 'Genre has been created successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Update a genre',
    description: 'Update a genre in the database',
  })
  @Put(':id')
  @HttpCode(200)
  public async update(
    @Param() requestParams: ParamIdDto,
    @Body() payload: UpdateGenreDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._genresService.update(
      requestParams.id,
      payload,
      request.user,
    );

    return {
      message: 'Genre has been updated successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Delete a genre',
    description: 'Delete a genre in the database',
  })
  @Delete(':id')
  @HttpCode(200)
  public async delete(
    @Param() requestParams: ParamIdDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._genresService.delete(
      requestParams.id,
      request.user,
    );

    return {
      message: 'Genre has been deleted successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Restore a genre',
    description: 'Restore a genre in the database',
  })
  @Post(':id/restore')
  @HttpCode(200)
  public async restore(
    @Param() requestParams: ParamIdDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._genresService.restore(
      requestParams.id,
      request.user,
    );

    return {
      message: 'Genre has been restored successfully',
      result,
    };
  }
}
