// infrastructure/cron/machine-cron.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineCheckService } from './machine-check.service';
import { MachineCronService } from './machine-cron.service';
import { MachinesOrmEntity } from '../database/orm-entities/machines.orm-entity';
import { MachinesRepositoryImpl } from '../database/repositories/machines.repository.impl';
import { MachinesRepository } from '../../domain/repositories/machines.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MachinesOrmEntity])],
  providers: [
    MachineCheckService,
    MachineCronService,
    {
      provide: 'MachinesRepository',
      useClass: MachinesRepositoryImpl,
    },
  ],
  exports: [MachineCheckService],
})
export class MachineCronModule {}
