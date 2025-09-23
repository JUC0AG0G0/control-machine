// domain/repositories/machines.repository.ts
import { Machines } from '../entities/machines.entity';

export interface MachinesRepository {
  findAll(): Promise<Machines[]>;
  findById(id: number): Promise<Machines | null>;
  save(machines: Machines): Promise<Machines>;
}
