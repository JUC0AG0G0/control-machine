// infrastructure/database/orm-entities/sounds.orm-entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sounds')
export class SoundsOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, unique: true })
  path: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}
