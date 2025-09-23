import { Controller, Get, Param, Res, ParseIntPipe } from '@nestjs/common';
import { ListSoundsUseCase } from '../../application/sounds/list-sounds.usecase';
import { GetSoundUseCase } from '../../application/sounds/get-sound.usecase';
import { Sounds } from '../../domain/entities/sounds.entity';
import type { Response } from 'express';

@Controller('sounds')
export class SoundsController {
  constructor(
    private listSoundsUseCase: ListSoundsUseCase, 
    private readonly getSoundUseCase: GetSoundUseCase
  ) {}

  @Get()
  async getAll(): Promise<Partial<Sounds>[]> {
    const sounds = await this.listSoundsUseCase.execute();

    return sounds.map(({ id, name, path, updated_at }) => ({
      id,
      name,
      path,
      updated_at,
    }));
  }

  @Get(':id')
  async getFile(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const { fileStream, fileName } = await this.getSoundUseCase.execute(id);

    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

    fileStream.pipe(res);
  }
}