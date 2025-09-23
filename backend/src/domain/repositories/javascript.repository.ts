// domain/repositories/javascript.repository.ts
import { Javascript } from '../entities/javascript.entity';

export interface JavascriptRepository {
  findAll(): Promise<Javascript[]>;
  findById(id: number): Promise<Javascript | null>;
  save(js: Javascript): Promise<Javascript>;
}
