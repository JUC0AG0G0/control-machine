import { Injectable, Inject } from '@nestjs/common';
import type { MachinesRepository } from '../../domain/repositories/machines.repository';
import { Machine } from '../../domain/entities/machines.entity';
import { CreateMachineDto } from '../../common/dto/create-machine.dto';

@Injectable()
export class CreateMachineUseCase {
  constructor(
    @Inject('MachinesRepository')
    private readonly machinesRepository: MachinesRepository,
  ) {}

  async execute(data: CreateMachineDto): Promise<Machine> {
    const machine = new Machine(-1, data.name, data.ip, data.username, data.password, 'offline', null);


    return this.machinesRepository.save(machine);
  }
}
