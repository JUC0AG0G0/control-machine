import { Injectable } from "@nestjs/common";
import type { MachinesRepository } from "../../domain/repositories/machines.repository";
import { Machine } from "../../domain/entities/machines.entity";
import { MachinesRepositoryImpl } from "src/infrastructure/database/repositories/machines.repository.impl";

@Injectable()
export class ListMachinesUseCase {
  constructor(
    private readonly machinesRepository: MachinesRepositoryImpl
  ) {}

  async execute(): Promise<Machine[]> {
    return this.machinesRepository.findAll();
  }
}
