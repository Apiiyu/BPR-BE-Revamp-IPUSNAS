// DTOs
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { PaginateDto } from '../../../common/dtos/paginate.dto';
import { PageMetaDto } from '../../../common/dtos/page-meta.dto';
import { UpdateNotificationDto } from '../dtos/update-notification.dto';

// Entities
import { NotificationsEntity } from '../entities/notifications.entity';

// NestJS Libraries
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// TypeORM
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QuerySortingHelper } from '../../../common/helpers/query-sorting.helper';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationsEntity)
    private readonly _notificationsRepository: Repository<NotificationsEntity>,
    private readonly _dataSource: DataSource,
  ) {}

  /**
   * @description Handle added relationship
   * @param {SelectQueryBuilder<NotificationsEntity>} query
   *
   * @returns {void}
   */
  private _addRelations(query: SelectQueryBuilder<NotificationsEntity>): void {
    // ? Add relations here
  }

  /**
   * @description Handle business logic for searching notifications
   */
  private _searchData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<NotificationsEntity>,
  ): void {
    query.andWhere(
      `(
          notifications.name ILIKE :search
        )
        ${filters.isDeleted ? '' : 'AND notifications.deleted_at IS NULL'}
        `,
      {
        search: `%${filters.search}%`,
      },
    );
  }

  /**
   * @description Handle sorting data
   */
  private _sortData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<NotificationsEntity>,
  ): void {
    const permitSort = {
      name: 'notifications.name',
    };

    QuerySortingHelper(query, filters.sortBy, permitSort);
  }

  /**
   * @description Handle filters data
   */
  private async _filterData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<NotificationsEntity>,
  ): Promise<IResultFilter> {
    try {
      this._addRelations(query);

      if (filters.search) {
        this._searchData(filters, query);
      }

      if (filters.isDeleted) {
        query.andWhere('notifications.deleted_at IS NOT NULL');
      } else {
        query.andWhere('notifications.deleted_at IS NULL');
      }

      if (filters.sortBy.length) {
        this._sortData(filters, query);
      }

      if (!filters.disablePaginate) {
        query.take(filters.limit);
        query.skip(filters.skip);
      }

      const [data, totalData] = await query.cache(true).getManyAndCount();
      const total = data.length;

      return {
        data,
        total,
        totalData,
      };
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle business logic for creating a user
   */
  public async create(
    payload: CreateNotificationDto,
    user: IRequestUser,
  ): Promise<NotificationsEntity> {
    let createdDataId = '';

    await this._dataSource.transaction(async (manager: EntityManager) => {
      // Create a new entity of genres and save it into database
      const result = this._notificationsRepository.create(payload);
      createdDataId = result.id;

      await manager.save(result, {
        data: {
          action: 'UPDATE',
          user,
        },
      });
    });

    return this.findOneById(createdDataId);
  }

  /**
   * @description Handle business logic for listing all genres
   */
  public async delete(
    id: string,
    user: IRequestUser,
  ): Promise<NotificationsEntity> {
    try {
      const selectedUser = await this.findOneById(id);
      const deletedAt = Math.floor(Date.now() / 1000);

      // Merge Two Entity into single one and save it
      this._notificationsRepository.merge(selectedUser, {
        deletedAt,
      });

      return await this._notificationsRepository.save(selectedUser, {
        data: {
          action: 'DELETE',
          user,
        },
      });
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle find all genres
   */
  public async findAll(
    filters: ListOptionDto,
  ): Promise<PaginateDto<NotificationsEntity>> {
    try {
      const query: SelectQueryBuilder<NotificationsEntity> =
        this._notificationsRepository.createQueryBuilder('notifications');
      const { data, total, totalData } = await this._filterData(filters, query);

      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto<NotificationsEntity>(data, meta);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle business logic for finding a by specific id
   */
  public async findOneById(id: string): Promise<NotificationsEntity> {
    try {
      const selectedNotification = await this._notificationsRepository.findOne({
        where: {
          id,
        },
        relations: ['booking', 'booking.book', 'user'],
      });

      if (!selectedNotification) {
        throw new NotFoundException('Not Found', {
          cause: new Error(),
          description: 'Book not found',
        });
      }

      return selectedNotification;
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle business logic for restoring a notification
   */
  public async restore(
    id: string,
    user: IRequestUser,
  ): Promise<NotificationsEntity> {
    try {
      const selectedUser = await this.findOneById(id);

      // Merge Two Entity into single one and save it
      this._notificationsRepository.merge(selectedUser, {
        deletedAt: null,
      });

      return await this._notificationsRepository.save(selectedUser, {
        data: {
          action: 'RESTORE',
          user,
        },
      });
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle business logic for updating a notific
   */
  public async update(
    id: string,
    payload: UpdateNotificationDto,
    user: IRequestUser,
  ): Promise<NotificationsEntity> {
    try {
      await this._dataSource.transaction(async (manager: EntityManager) => {
        const selectedUser = await this._notificationsRepository.findOneOrFail({
          where: {
            id,
          },
        });

        // Merge Two Entity into single one and save it
        this._notificationsRepository.merge(selectedUser, payload);

        await manager.save(selectedUser, {
          data: {
            action: 'UPDATE',
            user,
          },
        });
      });

      return this.findOneById(id);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
