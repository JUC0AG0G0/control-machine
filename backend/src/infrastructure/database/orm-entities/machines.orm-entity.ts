// infrastructure/database/orm-entities/machines.orm-entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('machines')
export class MachinesOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  ip: string;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 50, default: 'offline' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  last_seen: Date | null;
}
