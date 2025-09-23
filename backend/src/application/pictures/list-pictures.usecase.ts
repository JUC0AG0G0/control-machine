import { Injectable, Inject } from '@nestjs/common';
import type { PicturesRepository } from '../../domain/repositories/pictures.repository';
import { Pictures } from '../../domain/entities/pictures.entity';

@Injectable()
export class ListPicturesUseCase {
  constructor(
    @Inject('PicturesRepository') private picturesRepository: PicturesRepository,
  ) {}

  async execute(): Promise<Pictures[]> {
    return this.picturesRepository.findAll();
  }
}
