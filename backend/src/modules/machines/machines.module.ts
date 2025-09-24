import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MachinesOrmEntity } from "../../infrastructure/database/orm-entities/machines.orm-entity";
import { MachinesRepositoryImpl } from "../../infrastructure/database/repositories/machines.repository.impl";
import { ListMachinesUseCase } from "../../application/machines/list-machines.usecase";
import { MachinesController } from "./machines.controller";

@Module({
  imports: [TypeOrmModule.forFeature([MachinesOrmEntity])],
  controllers: [MachinesController],
  providers: [
    ListMachinesUseCase,
    {
      provide: MachinesRepositoryImpl,
      useClass: MachinesRepositoryImpl,
    },
  ],
})
export class MachinesModule {}
