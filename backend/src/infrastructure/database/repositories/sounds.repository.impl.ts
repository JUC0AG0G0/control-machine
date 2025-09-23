// infrastructure/database/repositories/sounds.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoundsRepository } from '../../../domain/repositories/sounds.repository';
import { Sounds } from '../../../domain/entities/sounds.entity';
import { SoundsOrmEntity } from '../orm-entities/sounds.orm-entity';

@Injectable()
export class SoundsRepositoryImpl implements SoundsRepository {
  constructor(
    @InjectRepository(SoundsOrmEntity)
    private readonly repo: Repository<SoundsOrmEntity>,
  ) {}

  async findAll(): Promise<Sounds[]> {
    const sounds = await this.repo.find();
    return sounds.map(a => new Sounds(a.id, a.name, a.path, a.updated_at));
  }

  async findById(id: number): Promise<Sounds | null> {
    const a = await this.repo.findOneBy({ id });
    return a ? new Sounds(a.id, a.name, a.path, a.updated_at) : null;
  }

  async save(sounds: Sounds): Promise<Sounds> {
    const entity = this.repo.create({
      id: sounds.id,
      name: sounds.name,
      path: sounds.path,
      updated_at: sounds.updatedAt,
    });
    const saved = await this.repo.save(entity);
    return new Sounds(saved.id, saved.name, saved.path, saved.updated_at);
  }
}
