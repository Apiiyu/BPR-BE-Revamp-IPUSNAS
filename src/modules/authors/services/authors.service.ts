// DTOs
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { UpdateAuthorDto } from '../dtos/update-author.dto';
import { PaginateDto } from '../../../common/dtos/paginate.dto';
import { PageMetaDto } from '../../../common/dtos/page-meta.dto';

// Entities
import { AuthorsEntity } from '../entities/authors.entity';

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
export class AuthorsService {
  constructor(
    @InjectRepository(AuthorsEntity)
    private readonly _genresRepository: Repository<AuthorsEntity>,
    private readonly _dataSource: DataSource,
  ) {}

  /**
   * @description Handle added relationship
   * @param {SelectQueryBuilder<AuthorsEntity>} query
   *
   * @returns {void}
   */
  private _addRelations(query: SelectQueryBuilder<AuthorsEntity>): void {
    // ? Add relations here
  }

  /**
   * @description Handle business logic for searching authors
   */
  private _searchData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<AuthorsEntity>,
  ): void {
    query.andWhere(
      `(
          authors.name ILIKE :search
        )
        ${filters.isDeleted ? '' : 'AND authors.deleted_at IS NULL'}
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
    query: SelectQueryBuilder<AuthorsEntity>,
  ): void {
    const permitSort = {
      name: 'authors.name',
    };

    QuerySortingHelper(query, filters.sortBy, permitSort);
  }

  /**
   * @description Handle filters data
   */
  private async _filterData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<AuthorsEntity>,
  ): Promise<IResultFilter> {
    try {
      this._addRelations(query);

      if (filters.search) {
        this._searchData(filters, query);
      }

      if (filters.isDeleted) {
        query.andWhere('authors.deleted_at IS NOT NULL');
      } else {
        query.andWhere('authors.deleted_at IS NULL');
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
    payload: CreateAuthorDto,
    user: IRequestUser,
  ): Promise<AuthorsEntity> {
    let createdDataId = '';

    await this._dataSource.transaction(async (manager: EntityManager) => {
      // Create a new entity of authors and save it into database
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
   * @description Handle business logic for listing all authors
   */
  public async delete(id: string, user: IRequestUser): Promise<AuthorsEntity> {
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
   * @description Handle find all authors
   */
  public async findAll(
    filters: ListOptionDto,
  ): Promise<PaginateDto<AuthorsEntity>> {
    try {
      const query: SelectQueryBuilder<AuthorsEntity> =
        this._genresRepository.createQueryBuilder('genres');
      const { data, total, totalData } = await this._filterData(filters, query);

      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto<AuthorsEntity>(data, meta);
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
  public async findOneById(id: string): Promise<AuthorsEntity> {
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
  public async restore(id: string, user: IRequestUser): Promise<AuthorsEntity> {
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
    payload: UpdateAuthorDto,
    user: IRequestUser,
  ): Promise<AuthorsEntity> {
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
