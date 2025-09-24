import { Inject, Injectable } from "@nestjs/common";
import type { MachinesRepository } from "../../domain/repositories/machines.repository";
import { Machine } from "../../domain/entities/machines.entity";
import { MachineCheckService } from "../../infrastructure/cron/machine-check.service";

@Injectable()
export class ListMachinesUseCase {
  constructor(
    @Inject('MachinesRepository')
    private readonly machinesRepository: MachinesRepository,
    private readonly machineCheckService: MachineCheckService,
  ) {}

  async execute(): Promise<Machine[]> {
    this.machineCheckService.checkMachines();
    return this.machinesRepository.findAll();
  }
}
