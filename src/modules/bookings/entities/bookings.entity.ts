// Class Transformer
import { Exclude } from 'class-transformer';

// Entities
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { BooksEntity } from '../../books/entities/books.entity';
import { UsersEntity } from '../../users/entities/users.entity';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

// TypeORM
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('bookings')
export class BookingsEntity extends AppBaseEntity {
  @ApiProperty()
  @Column({
    name: 'book_id',
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  public bookId: string;

  @ApiProperty()
  @Column({
    name: 'user_id',
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  public userId: string;

  @ApiProperty()
  @Column({
    name: 'duration',
    type: 'int',
    nullable: false,
  })
  public duration: number;

  @ApiProperty()
  @Column({
    name: 'due_date',
    type: 'bigint',
    nullable: false,
  })
  public dueDate: number;

  /**
   * Relations
   */
  @ManyToOne(() => BooksEntity)
  @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
  public book: BooksEntity;

  @ManyToOne(() => UsersEntity, (user) => user.bookings)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: UsersEntity;
}
