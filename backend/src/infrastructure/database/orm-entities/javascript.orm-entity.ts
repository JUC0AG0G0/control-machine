// infrastructure/database/orm-entities/javascript.orm-entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('javascript')
export class JavascriptOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, unique: true })
  path: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}
