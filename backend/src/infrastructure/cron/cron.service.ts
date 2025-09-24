// infrastructure/cron/machine-cron.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MachineCheckService } from './machine-check.service';

@Injectable()
export class CronService {
  constructor(private readonly machineCheckService: MachineCheckService) {}

  @Cron(CronExpression.EVERY_10_MINUTES, { name: 'checkMachines' })
  handleCron() {
    this.machineCheckService.checkMachines();
  }
}