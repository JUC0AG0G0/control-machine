// domain/repositories/sounds.repository.ts
import { Sounds } from '../entities/sounds.entity';

export interface SoundsRepository {
  findAll(): Promise<Sounds[]>;
  findById(id: number): Promise<Sounds | null>;
}
