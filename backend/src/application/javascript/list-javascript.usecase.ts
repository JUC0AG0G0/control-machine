import { Injectable, Inject } from '@nestjs/common';
import type { JavascriptRepository } from '../../domain/repositories/javascript.repository';
import { Pictures } from '../../domain/entities/pictures.entity';
import { Javascript } from 'src/domain/entities/javascript.entity';

@Injectable()
export class ListJavascriptUseCase {
  constructor(
    @Inject('JavascriptRepository') private javascriptRepository: JavascriptRepository,
  ) {}

  async execute(): Promise<Javascript[]> {
    return this.javascriptRepository.findAll();
  }
}
