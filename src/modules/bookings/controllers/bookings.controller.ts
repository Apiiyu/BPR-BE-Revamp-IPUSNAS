// DTOs
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { ParamIdDto } from '../../../common/dtos/param-id.dto';

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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

// Services
import { BookingsService } from '../services/bookings.service';

@ApiBearerAuth()
@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthenticationJWTGuard)
export class BookingsController {
  constructor(private readonly _bookingsService: BookingsService) {}

  @ApiOperation({
    summary: 'Retrieve all bookings',
    description: 'Retrieve all bookings from the database',
  })
  @Get()
  @HttpCode(200)
  public async findAll(@Query() requestQuery: ListOptionDto): Promise<unknown> {
    const result = await this._bookingsService.findAll(requestQuery);

    return {
      message: 'Bookings has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Retrieve a booking',
    description: 'Retrieve a booking from the database',
  })
  @Get(':id')
  @HttpCode(200)
  public async findOne(@Param() requestParams: ParamIdDto): Promise<unknown> {
    const result = await this._bookingsService.findOneById(requestParams.id);

    return {
      message: 'Booking has been retrieved successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Create a booking',
    description: 'Create a booking in the database',
  })
  @Post()
  @HttpCode(201)
  public async create(
    @Body() payload: CreateBookingDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._bookingsService.create(payload, request.user);

    return {
      message: 'Booking has been created successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Delete a booking',
    description: 'Delete a booking in the database',
  })
  @Delete(':id')
  @HttpCode(200)
  public async delete(
    @Param() requestParams: ParamIdDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._bookingsService.delete(
      requestParams.id,
      request.user,
    );

    return {
      message: 'Booking has been deleted successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Restore a booking',
    description: 'Restore a booking in the database',
  })
  @Post(':id/restore')
  @HttpCode(200)
  public async restore(
    @Param() requestParams: ParamIdDto,
    @Req() request: ICustomRequestHeaders,
  ): Promise<unknown> {
    const result = await this._bookingsService.restore(
      requestParams.id,
      request.user,
    );

    return {
      message: 'Booking has been restored successfully',
      result,
    };
  }
}
