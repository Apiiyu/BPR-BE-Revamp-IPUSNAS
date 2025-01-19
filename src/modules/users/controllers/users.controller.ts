// DTOs
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { ParamIdDto } from '../../../common/dtos/param-id.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

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
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

// Services
import { UsersService } from '../services/users.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthenticationJWTGuard)
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @ApiOperation({
    summary: 'Retrieve all users',
    description: 'Retrieve all users from the database',
  })
  @Get()
  @HttpCode(200)
  public async findAll(@Query() requestQuery: ListOptionDto): Promise<unknown> {
    const result = await this._usersService.findAll(requestQuery);

    return {
      message: 'Users has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Retrieve current user',
    description: 'Retrieve the current user from the database',
  })
  @Get('me')
  @HttpCode(200)
  public async findMe(@Req() request: ICustomRequestHeaders): Promise<unknown> {
    const result = await this._usersService.findOneById(request.user.id);

    return {
      message: 'User has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Retrieve a user',
    description: 'Retrieve a user from the database',
  })
  @Get('/:id')
  @HttpCode(200)
  public async findOne(
    @Param('id') requestParams: ParamIdDto,
  ): Promise<unknown> {
    const result = await this._usersService.findOneById(requestParams.id);

    return {
      message: 'User has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Update current user',
    description: 'Update the current user from the database',
  })
  @Put('me')
  @HttpCode(200)
  public async updateMe(
    @Req() request: ICustomRequestHeaders,
    @Body() requestBody: UpdateUserDto,
  ): Promise<unknown> {
    const result = await this._usersService.update(
      request.user.id,
      requestBody,
      request.user,
    );

    return {
      message: 'User has been updated successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Update a user',
    description: 'Update a user from the database',
  })
  @Put('/:id')
  @HttpCode(200)
  public async update(
    @Req() request: ICustomRequestHeaders,
    @Param('id') requestParams: ParamIdDto,
    @Body() requestBody: UpdateUserDto,
  ): Promise<unknown> {
    const result = await this._usersService.update(
      requestParams.id,
      requestBody,
      request.user,
    );

    return {
      message: 'User has been updated successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Delete a user',
    description: 'Delete a user from the database',
  })
  @Delete('/:id')
  @HttpCode(200)
  public async delete(
    @Req() request: ICustomRequestHeaders,
    @Param('id') requestParams: ParamIdDto,
  ): Promise<unknown> {
    const result = await this._usersService.delete(
      requestParams.id,
      request.user,
    );

    return {
      message: 'User has been deleted successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Restore a user',
    description: 'Restore a user from the database',
  })
  @Put('/:id/restore')
  @HttpCode(200)
  public async restore(
    @Req() request: ICustomRequestHeaders,
    @Param('id') requestParams: ParamIdDto,
  ): Promise<unknown> {
    const result = await this._usersService.restore(
      requestParams.id,
      request.user,
    );

    return {
      message: 'User has been restored successfully',
      result,
    };
  }
}
