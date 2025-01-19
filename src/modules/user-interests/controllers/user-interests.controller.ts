// DTOs
import { ArrayCreateUpdateUserInterests } from '../dtos/create-update-user-interests.dto';

// Guards
import { AuthenticationJWTGuard } from '../../../common/guards/authentication-jwt.guard';

// NestJS Libraries
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';

// Services
import { UserInterestsService } from '../services/user-interests.service';

@ApiBearerAuth()
@ApiTags('User Interests')
@Controller('user-interests')
@UseGuards(AuthenticationJWTGuard)
export class UserInterestsController {
  constructor(private readonly _userInterestsService: UserInterestsService) {}

  @ApiOperation({
    summary: 'Create or update user interests',
    description: 'Create or update user interests in the database',
  })
  @Post()
  @HttpCode(201)
  public async createOrUpdateUserInterests(
    @Body() payload: ArrayCreateUpdateUserInterests,
  ): Promise<unknown> {
    const result =
      await this._userInterestsService.createOrUpdateUserInterests(payload);

    return {
      message: 'User interests has been created or updated successfully',
      result,
    };
  }

  @ApiOperation({
    summary: 'Delete user interests',
    description: 'Delete user interests in the database',
  })
  @Delete()
  @HttpCode(200)
  public async deleteUserInterests(
    @Body() payload: string[],
  ): Promise<unknown> {
    const result =
      await this._userInterestsService.deleteUserInterests(payload);

    return {
      message: 'User interests has been deleted successfully',
      result,
    };
  }
}
