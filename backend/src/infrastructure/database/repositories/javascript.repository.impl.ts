import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { JavascriptRepository } from '../../../domain/repositories/javascript.repository';
import { Javascript } from '../../../domain/entities/javascript.entity';
import { JavascriptOrmEntity } from '../orm-entities/javascript.orm-entity';

@Injectable()
export class JavascriptRepositoryImpl implements JavascriptRepository {
  constructor(
    @InjectRepository(JavascriptOrmEntity)
    private readonly ormRepository: Repository<JavascriptOrmEntity>,
  ) {}

  async findAll(): Promise<Javascript[]> {
    const javascriptOrm = await this.ormRepository.find();
    return javascriptOrm.map(
      (p) => new Javascript(p.id!, p.name, p.path, p.updated_at),
    );
  }

  async findById(id: number): Promise<Javascript | null> {
    const javascriptOrm = await this.ormRepository.findOne({ where: { id } });
    if (!javascriptOrm) return null;
    return new Javascript(
      javascriptOrm.id!,
      javascriptOrm.name,
      javascriptOrm.path,
      javascriptOrm.updated_at,
    );
  }

  async save(javascript: Javascript): Promise<Javascript> {
    const entity = this.ormRepository.create({
      name: javascript.name,
      path: javascript.path,
      updated_at: javascript.updated_at,
    });

    const saved = await this.ormRepository.save(entity);

    return new Javascript(saved.id!, saved.name, saved.path, saved.updated_at);
  }
}
