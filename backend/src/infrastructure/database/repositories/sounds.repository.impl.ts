import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { SoundsRepository } from '../../../domain/repositories/sounds.repository';
import { Sounds } from '../../../domain/entities/sounds.entity';
import { SoundsOrmEntity } from '../orm-entities/sounds.orm-entity';

@Injectable()
export class SoundsRepositoryImpl implements SoundsRepository {
  constructor(
    @InjectRepository(SoundsOrmEntity)
    private readonly ormRepository: Repository<SoundsOrmEntity>,
  ) {}

  async findAll(): Promise<Sounds[]> {
    const soundsOrm = await this.ormRepository.find();
    return soundsOrm.map(
      (p) => new Sounds(p.id, p.name, p.path, p.updated_at),
    );
  }

  async findById(id: number): Promise<Sounds | null> {
    const pictureOrm = await this.ormRepository.findOne({ where: { id } });
    if (!pictureOrm) return null;
    return new Sounds(pictureOrm.id, pictureOrm.name, pictureOrm.path, pictureOrm.updated_at);
  }

  async save(sound: Sounds): Promise<Sounds> {
    const entity = this.ormRepository.create({
      name: sound.name,
      path: sound.path,
      updated_at: sound.updated_at,
    });

    const saved = await this.ormRepository.save(entity);

    return new Sounds(saved.id!, saved.name, saved.path, saved.updated_at);
  }
}
