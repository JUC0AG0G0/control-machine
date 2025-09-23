// domain/repositories/pictures.repository.ts
import { Pictures } from '../entities/pictures.entity';

export interface PicturesRepository {
  findAll(): Promise<Pictures[]>;
  findById(id: number): Promise<Pictures | null>;
}
