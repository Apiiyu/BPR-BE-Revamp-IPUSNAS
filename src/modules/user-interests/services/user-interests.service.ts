// DTOs
import { ArrayCreateUpdateUserInterests } from '../dtos/create-update-user-interests.dto';

// Entities
import { UserInterestsEntity } from '../entities/user-interests.entity';

// NestJS Libraries
import { BadRequestException, Injectable } from '@nestjs/common';

// TypeORM
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class UserInterestsService {
  constructor(private readonly _dataSource: DataSource) {}

  /**
   * @description Handle create or update data of user interests
   */
  public async createOrUpdateUserInterests(
    payload: ArrayCreateUpdateUserInterests,
    manager?: EntityManager,
  ): Promise<unknown> {
    try {
      const activeManager = manager
        ? manager.createQueryBuilder()
        : this._dataSource.createQueryBuilder();

      return await activeManager
        .insert()
        .into(UserInterestsEntity)
        .values(payload.interests)
        .orUpdate(['user_id', 'genre_id'], ['user_id', 'genre_id'], {
          skipUpdateIfNoValuesChanged: true,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle delete data of user interests
   */
  public async deleteUserInterests(
    ids: string[],
    manager?: EntityManager,
  ): Promise<unknown> {
    try {
      const activeManager = manager
        ? manager.createQueryBuilder()
        : this._dataSource.createQueryBuilder();

      return await activeManager
        .delete()
        .from(UserInterestsEntity)
        .where('id IN (:...ids)', { ids })
        .execute();
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
