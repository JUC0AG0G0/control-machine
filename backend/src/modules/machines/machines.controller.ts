import { Controller, Get } from "@nestjs/common";
import { ListMachinesUseCase } from "../../application/machines/list-machines.usecase";
import { Machine } from "../../domain/entities/machines.entity";

@Controller("machines")
export class MachinesController {
  constructor(private readonly listMachinesUseCase: ListMachinesUseCase) {}

  @Get()
  async findAll(): Promise<Machine[]> {
    return this.listMachinesUseCase.execute();
  }
}
