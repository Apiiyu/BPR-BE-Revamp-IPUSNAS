// Class Transformer
import { Exclude } from 'class-transformer';

// Entities
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { BookingsEntity } from 'src/modules/bookings/entities/bookings.entity';
import { UsersEntity } from 'src/modules/users/entities/users.entity';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

// TypeORM
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('notifications')
export class NotificationsEntity extends AppBaseEntity {
  @ApiProperty()
  @Column({
    name: 'booking_id',
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  public bookingId: string;

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
    name: 'title',
    type: 'varchar',
    nullable: false,
  })
  public title: string;

  @ApiProperty()
  @Column({
    name: 'message',
    type: 'varchar',
    nullable: false,
  })
  public message: string;

  @ApiProperty()
  @Column({
    name: 'is_read',
    type: 'boolean',
    nullable: false,
  })
  public isRead: boolean;

  /**
   * Relations
   */
  @ManyToOne(() => BookingsEntity)
  @JoinColumn({ name: 'booking_id', referencedColumnName: 'id' })
  public booking: BookingsEntity;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: UsersEntity;
}
