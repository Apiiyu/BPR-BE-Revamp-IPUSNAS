// DTOs
import {
  CreateBookingDto,
  ExpectedCreateOrUpdateBookingDto,
} from '../dtos/create-booking.dto';
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { PaginateDto } from '../../../common/dtos/paginate.dto';
import { PageMetaDto } from '../../../common/dtos/page-meta.dto';

// Entities
import { BookingsEntity } from '../entities/bookings.entity';

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
export class BookingsService {
  constructor(
    @InjectRepository(BookingsEntity)
    private readonly _bookingsRepository: Repository<BookingsEntity>,
    private readonly _dataSource: DataSource,
  ) {}

  /**
   * @description Handle added relationship
   * @param {SelectQueryBuilder<BookingsEntity>} query
   *
   * @returns {void}
   */
  private _addRelations(query: SelectQueryBuilder<BookingsEntity>): void {
    // ? Add relations here
    query.leftJoinAndSelect('bookings.book', 'book');
    query.leftJoinAndSelect('book.author', 'author');
    query.leftJoinAndSelect('bookings.user', 'user');
  }

  /**
   * @description Handle business logic for searching bookings
   */
  private _searchData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<BookingsEntity>,
  ): void {
    query.andWhere(
      `(
          bookings.name ILIKE :search
        )
        ${filters.isDeleted ? '' : 'AND bookings.deleted_at IS NULL'}
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
    query: SelectQueryBuilder<BookingsEntity>,
  ): void {
    const permitSort = {
      name: 'bookings.name',
    };

    QuerySortingHelper(query, filters.sortBy, permitSort);
  }

  /**
   * @description Handle filters data
   */
  private async _filterData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<BookingsEntity>,
  ): Promise<IResultFilter> {
    try {
      this._addRelations(query);

      if (filters.search) {
        this._searchData(filters, query);
      }

      if (filters.isDeleted) {
        query.andWhere('bookings.deleted_at IS NOT NULL');
      } else {
        query.andWhere('bookings.deleted_at IS NULL');
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
    payload: CreateBookingDto,
    user: IRequestUser,
  ): Promise<BookingsEntity> {
    try {
      let createdDataId = '';
      const dueDate = Math.floor(Date.now() / 1000) + 604800; // Set due date to 7 days from now in unix timestamp
      const finalPayload: ExpectedCreateOrUpdateBookingDto = {
        ...payload,
        duration: 7,
        dueDate,
      };

      await this._dataSource.transaction(async (manager: EntityManager) => {
        // Create a new entity of bookings and save it into database
        const result = this._bookingsRepository.create(finalPayload);
        createdDataId = result.id;

        await manager.save(result, {
          data: {
            action: 'UPDATE',
            user,
          },
        });
      });

      return this.findOneById(createdDataId);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle business logic for listing all bookings
   */
  public async delete(id: string, user: IRequestUser): Promise<BookingsEntity> {
    try {
      const selectedUser = await this.findOneById(id);
      const deletedAt = Math.floor(Date.now() / 1000);

      // Merge Two Entity into single one and save it
      this._bookingsRepository.merge(selectedUser, {
        deletedAt,
      });

      return await this._bookingsRepository.save(selectedUser, {
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
   * @description Handle find all bookings
   */
  public async findAll(
    filters: ListOptionDto,
  ): Promise<PaginateDto<BookingsEntity>> {
    try {
      const query: SelectQueryBuilder<BookingsEntity> =
        this._bookingsRepository.createQueryBuilder('genres');
      const { data, total, totalData } = await this._filterData(filters, query);

      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto<BookingsEntity>(data, meta);
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
  public async findOneById(id: string): Promise<BookingsEntity> {
    try {
      const selectedBook = await this._bookingsRepository.findOne({
        where: {
          id,
        },
        relations: ['book', 'book.author', 'user'],
      });

      if (!selectedBook) {
        throw new NotFoundException('Not Found', {
          cause: new Error(),
          description: 'Book not found',
        });
      }

      return selectedBook;
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
  public async restore(
    id: string,
    user: IRequestUser,
  ): Promise<BookingsEntity> {
    try {
      const selectedUser = await this.findOneById(id);

      // Merge Two Entity into single one and save it
      this._bookingsRepository.merge(selectedUser, {
        deletedAt: null,
      });

      return await this._bookingsRepository.save(selectedUser, {
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
}
