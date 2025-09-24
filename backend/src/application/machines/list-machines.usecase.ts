import { Inject, Injectable } from "@nestjs/common";
import type { MachinesRepository } from "../../domain/repositories/machines.repository";
import { Machine } from "../../domain/entities/machines.entity";

@Injectable()
export class ListMachinesUseCase {
  constructor(
    @Inject('MachinesRepository') // <- utiliser le même token que CreateMachineUseCase
    private readonly machinesRepository: MachinesRepository,
  ) {}

  async execute(): Promise<Machine[]> {
    return this.machinesRepository.findAll();
  }
}
