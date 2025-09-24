import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MachinesOrmEntity } from "../../infrastructure/database/orm-entities/machines.orm-entity";
import { MachinesRepositoryImpl } from "../../infrastructure/database/repositories/machines.repository.impl";
import { ListMachinesUseCase } from "../../application/machines/list-machines.usecase";
import { MachinesController } from "./machines.controller";
import { CreateMachineUseCase } from "src/application/machines/create-machine.usecase";

@Module({
  imports: [TypeOrmModule.forFeature([MachinesOrmEntity])],
  controllers: [MachinesController],
  providers: [
    ListMachinesUseCase,
    CreateMachineUseCase,
    {
      provide: 'MachinesRepository',
      useClass: MachinesRepositoryImpl,
    },
  ],
})
export class MachinesModule {}
