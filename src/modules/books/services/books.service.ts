// DTOs
import { CreateBookDto } from '../dtos/create-book.dto';
import { ListOptionDto } from '../../../common/dtos/list-options.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';
import { PaginateDto } from '../../../common/dtos/paginate.dto';
import { PageMetaDto } from '../../../common/dtos/page-meta.dto';

// Entities
import { BooksEntity } from '../entities/books.entity';

// File Systems
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';

// NestJS Libraries
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Path
import { join } from 'path';

// TypeORM
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QuerySortingHelper } from '../../../common/helpers/query-sorting.helper';

@Injectable()
export class BooksService {
  private readonly _prefix = 'books';
  private readonly _uploadDirectory = `${process.env.APP_UPLOAD_DIRECTORIES}`;

  constructor(
    @InjectRepository(BooksEntity)
    private readonly _booksRepository: Repository<BooksEntity>,
    private readonly _dataSource: DataSource,
  ) {}

  /**
   * @description Handle added relationship
   * @param {SelectQueryBuilder<BooksEntity>} query
   *
   * @returns {void}
   */
  private _addRelations(query: SelectQueryBuilder<BooksEntity>): void {
    // ? Add relations here
    query.leftJoinAndSelect('books.author', 'author');
    query.leftJoinAndSelect('books.genre', 'genre');
  }

  /**
   * @description Handle business logic for searching books
   */
  private _searchData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<BooksEntity>,
  ): void {
    query.andWhere(
      `(
          books.name ILIKE :search
        )
        ${filters.isDeleted ? '' : 'AND books.deleted_at IS NULL'}
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
    query: SelectQueryBuilder<BooksEntity>,
  ): void {
    const permitSort = {
      name: 'books.name',
    };

    QuerySortingHelper(query, filters.sortBy, permitSort);
  }

  /**
   * @description Handle filters data
   */
  private async _filterData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<BooksEntity>,
  ): Promise<IResultFilter> {
    try {
      this._addRelations(query);

      if (filters.search) {
        this._searchData(filters, query);
      }

      if (filters.isDeleted) {
        query.andWhere('books.deleted_at IS NOT NULL');
      } else {
        query.andWhere('books.deleted_at IS NULL');
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
    file: Express.Multer.File,
    payload: CreateBookDto,
    user: IRequestUser,
  ): Promise<BooksEntity> {
    try {
      let createdDataId = '';
      let cover: string;

      if (file) {
        // Create directory if not exist
        if (!existsSync(`${this._uploadDirectory}/${this._prefix}`)) {
          mkdirSync(`${this._uploadDirectory}/${this._prefix}`, {
            recursive: true,
          });
        }

        const filename = file.originalname;
        const filePath = join(
          `${this._uploadDirectory}/${this._prefix}`,
          filename,
        );
        writeFileSync(filePath, file.buffer);

        cover = `${this._prefix}/${filename}`;
      }

      await this._dataSource.transaction(async (manager: EntityManager) => {
        // Create a new entity of books and save it into database
        const result = this._booksRepository.create({
          ...payload,
          cover,
        });
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
   * @description Handle business logic for listing all books
   */
  public async delete(id: string, user: IRequestUser): Promise<BooksEntity> {
    try {
      const selectedUser = await this.findOneById(id);
      const deletedAt = Math.floor(Date.now() / 1000);

      // Merge Two Entity into single one and save it
      this._booksRepository.merge(selectedUser, {
        deletedAt,
      });

      return await this._booksRepository.save(selectedUser, {
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
   * @description Handle find all books
   */
  public async findAll(
    filters: ListOptionDto,
  ): Promise<PaginateDto<BooksEntity>> {
    try {
      const query: SelectQueryBuilder<BooksEntity> =
        this._booksRepository.createQueryBuilder('books');
      const { data, total, totalData } = await this._filterData(filters, query);

      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto<BooksEntity>(data, meta);
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
  public async findOneById(id: string): Promise<BooksEntity> {
    try {
      const selectedBook = await this._booksRepository.findOne({
        where: {
          id,
        },
        relations: ['author', 'genre'],
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
  public async restore(id: string, user: IRequestUser): Promise<BooksEntity> {
    try {
      const selectedUser = await this.findOneById(id);

      // Merge Two Entity into single one and save it
      this._booksRepository.merge(selectedUser, {
        deletedAt: null,
      });

      return await this._booksRepository.save(selectedUser, {
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
    file: Express.Multer.File,
    payload: UpdateBookDto,
    user: IRequestUser,
  ): Promise<BooksEntity> {
    try {
      let cover: string;

      await this._dataSource.transaction(async (manager: EntityManager) => {
        const selectedUser = await this._booksRepository.findOneOrFail({
          where: {
            id,
          },
        });

        if (file) {
          if (selectedUser.cover) {
            unlinkSync(join(`${this._uploadDirectory}`, selectedUser.cover));
          }

          // Create directory if not exist
          if (!existsSync(`${this._uploadDirectory}/${this._prefix}`)) {
            mkdirSync(`${this._uploadDirectory}/${this._prefix}`, {
              recursive: true,
            });
          }

          const filename = file.originalname;
          const filePath = join(
            `${this._uploadDirectory}/${this._prefix}`,
            filename,
          );

          writeFileSync(filePath, file.buffer);
          cover = `${this._prefix}/${filename}`;
        }

        // Merge Two Entity into single one and save it
        this._booksRepository.merge(selectedUser, {
          ...payload,
          cover,
        });

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
