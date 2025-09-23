// infrastructure/database/repositories/javascript.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JavascriptRepository } from '../../../domain/repositories/javascript.repository';
import { Javascript } from '../../../domain/entities/javascript.entity';
import { JavascriptOrmEntity } from '../orm-entities/javascript.orm-entity';

@Injectable()
export class JavascriptRepositoryImpl implements JavascriptRepository {
  constructor(
    @InjectRepository(JavascriptOrmEntity)
    private readonly repo: Repository<JavascriptOrmEntity>,
  ) {}

  async findAll(): Promise<Javascript[]> {
    const scripts = await this.repo.find();
    return scripts.map(s => new Javascript(s.id, s.name, s.path, s.updated_at));
  }

  async findById(id: number): Promise<Javascript | null> {
    const s = await this.repo.findOneBy({ id });
    return s ? new Javascript(s.id, s.name, s.path, s.updated_at) : null;
  }

  async save(js: Javascript): Promise<Javascript> {
    const entity = this.repo.create({
      id: js.id,
      name: js.name,
      path: js.path,
      updated_at: js.updatedAt,
    });
    const saved = await this.repo.save(entity);
    return new Javascript(saved.id, saved.name, saved.path, saved.updated_at);
  }
}
