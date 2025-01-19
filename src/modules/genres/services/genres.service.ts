// DTOs
import { CreateGenreDto } from '../dtos/create-genre.dto';
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { UpdateGenreDto } from '../dtos/update-genre.dto';
import { PaginateDto } from '../../../common/dtos/paginate.dto';
import { PageMetaDto } from '../../../common/dtos/page-meta.dto';

// Entities
import { GenresEntity } from '../entities/genres.entity';

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
export class GenresService {
  constructor(
    @InjectRepository(GenresEntity)
    private readonly _genresRepository: Repository<GenresEntity>,
    private readonly _dataSource: DataSource,
  ) {}

  /**
   * @description Handle added relationship
   * @param {SelectQueryBuilder<GenresEntity>} query
   *
   * @returns {void}
   */
  private _addRelations(query: SelectQueryBuilder<GenresEntity>): void {
    // ? Add relations here
  }

  /**
   * @description Handle business logic for searching users
   */
  private _searchData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<GenresEntity>,
  ): void {
    query.andWhere(
      `(
          genres.name ILIKE :search
        )
        ${filters.isDeleted ? '' : 'AND genres.deleted_at IS NULL'}
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
    query: SelectQueryBuilder<GenresEntity>,
  ): void {
    const permitSort = {
      name: 'genres.name',
    };

    QuerySortingHelper(query, filters.sortBy, permitSort);
  }

  /**
   * @description Handle filters data
   */
  private async _filterData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<GenresEntity>,
  ): Promise<IResultFilter> {
    try {
      this._addRelations(query);

      if (filters.search) {
        this._searchData(filters, query);
      }

      if (filters.isDeleted) {
        query.andWhere('genres.deleted_at IS NOT NULL');
      } else {
        query.andWhere('genres.deleted_at IS NULL');
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
    payload: CreateGenreDto,
    user: IRequestUser,
  ): Promise<GenresEntity> {
    let createdDataId = '';

    await this._dataSource.transaction(async (manager: EntityManager) => {
      // Create a new entity of users and save it into database
      const result = this._genresRepository.create(payload);
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
   * @description Handle business logic for listing all users
   */
  public async delete(id: string, user: IRequestUser): Promise<GenresEntity> {
    try {
      const selectedUser = await this.findOneById(id);
      const deletedAt = Math.floor(Date.now() / 1000);

      // Merge Two Entity into single one and save it
      this._genresRepository.merge(selectedUser, {
        deletedAt,
      });

      return await this._genresRepository.save(selectedUser, {
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
   * @description Handle find all users
   */
  public async findAll(
    filters: ListOptionDto,
  ): Promise<PaginateDto<GenresEntity>> {
    try {
      const query: SelectQueryBuilder<GenresEntity> =
        this._genresRepository.createQueryBuilder('genres');
      const { data, total, totalData } = await this._filterData(filters, query);

      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto<GenresEntity>(data, meta);
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
  public async findOneById(id: string): Promise<GenresEntity> {
    try {
      return await this._genresRepository.findOneByOrFail({
        id,
      });
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle business logic for restoring a user
   */
  public async restore(id: string, user: IRequestUser): Promise<GenresEntity> {
    try {
      const selectedUser = await this.findOneById(id);

      // Merge Two Entity into single one and save it
      this._genresRepository.merge(selectedUser, {
        deletedAt: null,
      });

      return await this._genresRepository.save(selectedUser, {
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
   * @description Handle business logic for updating a user
   */
  public async update(
    id: string,
    payload: UpdateGenreDto,
    user: IRequestUser,
  ): Promise<GenresEntity> {
    try {
      await this._dataSource.transaction(async (manager: EntityManager) => {
        const selectedUser = await this._genresRepository.findOneOrFail({
          where: {
            id,
          },
        });

        // Merge Two Entity into single one and save it
        this._genresRepository.merge(selectedUser, payload);

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
