import { Body, Controller, Get, Post } from "@nestjs/common";
import { ListMachinesUseCase } from "../../application/machines/list-machines.usecase";
import { CreateMachineUseCase } from "../../application/machines/create-machine.usecase";
import { Machine } from "../../domain/entities/machines.entity";
import { CreateMachineDto } from "src/common/dto/create-machine.dto";

@Controller("machines")
export class MachinesController {
  constructor(
    private readonly listMachinesUseCase: ListMachinesUseCase,
    private readonly createMachineUseCase: CreateMachineUseCase,
  ) {}

  @Get()
  async findAll(): Promise<Machine[]> {
    return this.listMachinesUseCase.execute();
  }

  @Post()
  async create(@Body() data: CreateMachineDto): Promise<Machine> {
    return this.createMachineUseCase.execute(data);
  }
}
