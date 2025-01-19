// DTOs
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { ParamIdDto } from '../../../common/dtos/param-id.dto';
import { UpdateNotificationDto } from '../dtos/update-notification.dto';

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
import { NotificationsService } from '../services/notifications.service';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(AuthenticationJWTGuard)
export class NotificationsController {
  constructor(private readonly _notificationsService: NotificationsService) {}

  @ApiOperation({
    summary: 'Retrieve all notifications',
    description: 'Retrieve all notifications from the database',
  })
  @Get()
  @HttpCode(200)
  public async findAll(@Query() requestQuery: ListOptionDto): Promise<unknown> {
    const result = await this._notificationsService.findAll(requestQuery);

    return {
      message: 'Notifications has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Retrieve a notification',
    description: 'Retrieve a notification from the database',
  })
  @Get(':id')
  @HttpCode(200)
  public async findOne(@Param() requestParams: ParamIdDto): Promise<unknown> {
    const result = await this._notificationsService.findOneById(
      requestParams.id,
    );

    return {
      message: 'Notification has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Create a notification',
    description: 'Create a notification in the database',
  })
  @Post()
  @HttpCode(201)
  public async create(
    @Body() payload: CreateNotificationDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._notificationsService.create(
      payload,
      request.user,
    );

    return {
      message: 'Notification has been created successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Update a notification',
    description: 'Update a notification in the database',
  })
  @Put(':id')
  @HttpCode(200)
  public async update(
    @Param() requestParams: ParamIdDto,
    @Body() payload: UpdateNotificationDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._notificationsService.update(
      requestParams.id,
      payload,
      request.user,
    );

    return {
      message: 'Notification has been updated successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Delete a notification',
    description: 'Delete a notification in the database',
  })
  @Delete(':id')
  @HttpCode(200)
  public async delete(
    @Param() requestParams: ParamIdDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._notificationsService.delete(
      requestParams.id,
      request.user,
    );

    return {
      message: 'Notification has been deleted successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Restore a notification',
    description: 'Restore a notification in the database',
  })
  @Post(':id/restore')
  @HttpCode(200)
  public async restore(
    @Param() requestParams: ParamIdDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._notificationsService.restore(
      requestParams.id,
      request.user,
    );

    return {
      message: 'Notification has been restored successfully',
      result,
    };
  }
}
