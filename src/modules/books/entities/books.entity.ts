// Class Transformer
import { Exclude } from 'class-transformer';

// Entities
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { AuthorsEntity } from '../../authors/entities/authors.entity';
import { GenresEntity } from '../../genres/entities/genres.entity';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

// TypeORM
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('books')
export class BooksEntity extends AppBaseEntity {
  @ApiProperty()
  @Column({
    name: 'author_id',
    type: 'uuid',
    nullable: false,
  })
  @Exclude()
  public authorId: string;

  @ApiProperty()
  @Column({
    name: 'genre_id',
    type: 'uuid',
    nullable: false,
  })
  @Exclude()
  public genreId: string;

  @ApiProperty()
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  public name: string;

  @ApiProperty()
  @Column({
    name: 'sysnopsis',
    type: 'text',
    nullable: false,
  })
  public sysnopsis: string;

  @ApiProperty()
  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
  })
  public content: string;

  @ApiProperty()
  @Column({
    name: 'copies',
    type: 'int',
    nullable: false,
    default: 0,
  })
  public copies: number;

  @ApiProperty()
  @Column({
    name: 'cover',
    type: 'varchar',
    nullable: false,
  })
  public cover: string;

  @ApiProperty()
  @Column({
    name: 'is_new',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  public isNew: boolean;

  @ApiProperty()
  @Column({
    name: 'status',
    type: 'varchar',
    nullable: false,
    default: 'active',
  })
  public status: string;

  @ApiProperty()
  @Column({
    name: 'queue',
    type: 'int',
    nullable: false,
    default: 0,
  })
  public queue: number;

  /**
   * Relations
   */
  @ManyToOne(() => AuthorsEntity)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  public author: AuthorsEntity;

  @ManyToOne(() => GenresEntity)
  @JoinColumn({ name: 'genre_id', referencedColumnName: 'id' })
  public genre: GenresEntity;
}
