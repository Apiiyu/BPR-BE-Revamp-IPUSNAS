// Entities
import { AppBaseEntity } from '../../../common/entities/base.entity';

// NestJS Libraries
import { ApiProperty } from '@nestjs/swagger';

// TypeORM
import { Column, Entity } from 'typeorm';

@Entity('genres')
export class GenresEntity extends AppBaseEntity {
  @ApiProperty()
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  public name: string;
}
