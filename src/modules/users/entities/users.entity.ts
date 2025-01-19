// Class Transformer
import { Exclude } from 'class-transformer';

// Entities
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { UserInterestsEntity } from '../../user-interests/entities/user-interests.entity';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

// TypeORM
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class UsersEntity extends AppBaseEntity {
  @ApiProperty()
  @Column({ name: 'username', type: 'varchar', length: 100 })
  public username: string;

  @ApiProperty()
  @Column({ name: 'email', type: 'varchar', length: 100 })
  public email: string;

  @Exclude()
  @Column({ name: 'password', type: 'varchar', length: 100 })
  public password: string;

  /**
   * Relations
   */
  @OneToMany(() => UserInterestsEntity, (userInterest) => userInterest.user)
  public interests: UserInterestsEntity[];
}
