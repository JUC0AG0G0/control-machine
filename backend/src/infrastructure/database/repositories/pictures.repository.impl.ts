// infrastructure/database/repositories/pictures.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PicturesRepository } from '../../../domain/repositories/pictures.repository';
import { Pictures } from '../../../domain/entities/pictures.entity';
import { PicturesOrmEntity } from '../orm-entities/pictures.orm-entity';

@Injectable()
export class PicturesRepositoryImpl implements PicturesRepository {
  constructor(
    @InjectRepository(PicturesOrmEntity)
    private readonly repo: Repository<PicturesOrmEntity>,
  ) {}

  async findAll(): Promise<Pictures[]> {
    const pictures = await this.repo.find();
    return pictures.map(i => new Pictures(i.id, i.name, i.path, i.updated_at));
  }

  async findById(id: number): Promise<Pictures | null> {
    const i = await this.repo.findOneBy({ id });
    return i ? new Pictures(i.id, i.name, i.path, i.updated_at) : null;
  }

  async save(pictures: Pictures): Promise<Pictures> {
    const entity = this.repo.create({
      id: pictures.id,
      name: pictures.name,
      path: pictures.path,
      updated_at: pictures.updatedAt,
    });
    const saved = await this.repo.save(entity);
    return new Pictures(saved.id, saved.name, saved.path, saved.updated_at);
  }
}
