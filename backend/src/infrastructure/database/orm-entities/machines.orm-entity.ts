import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("machines")
export class MachinesOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ip: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: "offline" })
  status: string;

  @Column({ type: "timestamp", nullable: true })
  last_seen: Date | null;
}
