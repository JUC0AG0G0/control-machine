import { Injectable, Inject } from '@nestjs/common';
import type { SoundsRepository } from '../../domain/repositories/sounds.repository';
import { Sounds } from '../../domain/entities/sounds.entity';

@Injectable()
export class ListSoundsUseCase {
  constructor(
    @Inject('SoundsRepository') private soundsRepository: SoundsRepository,
  ) {}

  async execute(): Promise<Sounds[]> {
    return this.soundsRepository.findAll();
  }
}
