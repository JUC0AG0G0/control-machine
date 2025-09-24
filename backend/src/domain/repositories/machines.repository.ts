import { Machine } from "../entities/machines.entity";

export interface MachinesRepository {
  findAll(): Promise<Machine[]>;
  save(machine: Machine): Promise<Machine>;
}
