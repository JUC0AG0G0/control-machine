import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MachinesRepository } from "../../../domain/repositories/machines.repository";
import { Machine } from "../../../domain/entities/machines.entity";
import { MachinesOrmEntity } from "../orm-entities/machines.orm-entity";

@Injectable()
export class MachinesRepositoryImpl implements MachinesRepository {
  constructor(
    @InjectRepository(MachinesOrmEntity)
    private readonly repository: Repository<MachinesOrmEntity>
  ) {}

  async findAll(): Promise<Machine[]> {
    return this.repository.find();
  }

  async save(machine: Machine): Promise<Machine> {
    const machineOrm = this.repository.create(machine);
    const saved = await this.repository.save(machineOrm);
    return new Machine(
      saved.id,
      saved.name,
      saved.ip,
      saved.username,
      saved.password,
      saved.status,
      saved.last_seen,
    );
  }
}
