// infrastructure/database/repositories/machines.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MachinesRepository } from '../../../domain/repositories/machines.repository';
import { Machines } from '../../../domain/entities/machines.entity';
import { MachinesOrmEntity } from '../orm-entities/machines.orm-entity';

@Injectable()
export class MachinesRepositoryImpl implements MachinesRepository {
  constructor(
    @InjectRepository(MachinesOrmEntity)
    private readonly repo: Repository<MachinesOrmEntity>,
  ) {}

  async findAll(): Promise<Machines[]> {
    const machines = await this.repo.find();
    return machines.map(m => new Machines(m.id, m.name, m.ip, m.username, m.password, m.status, m.last_seen));
  }

  async findById(id: number): Promise<Machines | null> {
    const m = await this.repo.findOneBy({ id });
    return m ? new Machines(m.id, m.name, m.ip, m.username, m.password, m.status, m.last_seen) : null;
  }

  async save(machines: Machines): Promise<Machines> {
    const entity = this.repo.create({
      id: machines.id,
      name: machines.name,
      ip: machines.ip,
      username: machines.username,
      password: machines.password,
      status: machines.status,
      last_seen: machines.lastSeen,
    });
    const saved = await this.repo.save(entity);
    return new Machines(saved.id, saved.name, saved.ip, saved.username, saved.password, saved.status, saved.last_seen);
  }
}
