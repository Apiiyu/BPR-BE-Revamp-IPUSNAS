// DTOs
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { ParamIdDto } from '../../../common/dtos/param-id.dto';
import { UpdateAuthorDto } from '../dtos/update-author.dto';

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
import { AuthorsService } from '../services/authors.service';

@ApiBearerAuth()
@ApiTags('Authors')
@Controller('authors')
@UseGuards(AuthenticationJWTGuard)
export class AuthorsController {
  constructor(private readonly _authorsService: AuthorsService) {}

  @ApiOperation({
    summary: 'Retrieve all authors',
    description: 'Retrieve all authors from the database',
  })
  @Get()
  @HttpCode(200)
  public async findAll(@Query() requestQuery: ListOptionDto): Promise<unknown> {
    const result = await this._authorsService.findAll(requestQuery);

    return {
      message: 'authors has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Retrieve a author',
    description: 'Retrieve a author from the database',
  })
  @Get(':id')
  @HttpCode(200)
  public async findOne(@Param() requestParams: ParamIdDto): Promise<unknown> {
    const result = await this._authorsService.findOneById(requestParams.id);

    return {
      message: 'Author has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Create a author',
    description: 'Create a author in the database',
  })
  @Post()
  @HttpCode(201)
  public async create(
    @Body() payload: CreateAuthorDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._authorsService.create(payload, request.user);

    return {
      message: 'Author has been created successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Update a author',
    description: 'Update a author in the database',
  })
  @Put(':id')
  @HttpCode(200)
  public async update(
    @Param() requestParams: ParamIdDto,
    @Body() payload: UpdateAuthorDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._authorsService.update(
      requestParams.id,
      payload,
      request.user,
    );

    return {
      message: 'Author has been updated successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Delete a author',
    description: 'Delete a author in the database',
  })
  @Delete(':id')
  @HttpCode(200)
  public async delete(
    @Param() requestParams: ParamIdDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._authorsService.delete(
      requestParams.id,
      request.user,
    );

    return {
      message: 'Author has been deleted successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Restore a author',
    description: 'Restore a author in the database',
  })
  @Post(':id/restore')
  @HttpCode(200)
  public async restore(
    @Param() requestParams: ParamIdDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._authorsService.restore(
      requestParams.id,
      request.user,
    );

    return {
      message: 'Author has been restored successfully',
      result,
    };
  }
}
