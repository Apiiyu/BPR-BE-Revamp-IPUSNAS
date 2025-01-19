// Class Transformer
import { Exclude } from 'class-transformer';

// Entities
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { GenresEntity } from '../../genres/entities/genres.entity';
import { UsersEntity } from '../../users/entities/users.entity';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

// TypeORM
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_interests')
@Index(['user_id', 'genre_id'], { unique: true })
export class UserInterestsEntity extends AppBaseEntity {
  @ApiProperty()
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  @Exclude()
  public user_id: string;

  @ApiProperty()
  @Column({
    name: 'genre_id',
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  public genre_id: string;

  /**
   * Relations
   */
  @ManyToOne(() => GenresEntity)
  @JoinColumn({ name: 'genre_id', referencedColumnName: 'id' })
  public genre: GenresEntity;

  @ManyToOne(() => UsersEntity, (user) => user.interests)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: UsersEntity;
}
