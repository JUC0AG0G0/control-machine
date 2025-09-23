import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PicturesRepository } from '../../../domain/repositories/pictures.repository';
import { Pictures } from '../../../domain/entities/pictures.entity';
import { PicturesOrmEntity } from '../orm-entities/pictures.orm-entity';

@Injectable()
export class PicturesRepositoryImpl implements PicturesRepository {
  constructor(
    @InjectRepository(PicturesOrmEntity)
    private readonly ormRepository: Repository<PicturesOrmEntity>,
  ) {}

  async findAll(): Promise<Pictures[]> {
    const picturesOrm = await this.ormRepository.find();
    return picturesOrm.map(
      (p) => new Pictures(p.id!, p.name, p.path, p.updated_at),
    );
  }

  async findById(id: number): Promise<Pictures | null> {
    const pictureOrm = await this.ormRepository.findOne({ where: { id } });
    if (!pictureOrm) return null;
    return new Pictures(
      pictureOrm.id!,
      pictureOrm.name,
      pictureOrm.path,
      pictureOrm.updated_at,
    );
  }

  async save(picture: Pictures): Promise<Pictures> {
    const entity = this.ormRepository.create({
      name: picture.name,
      path: picture.path,
      updated_at: picture.updated_at,
    });

    const saved = await this.ormRepository.save(entity);

    return new Pictures(saved.id!, saved.name, saved.path, saved.updated_at);
  }
}
