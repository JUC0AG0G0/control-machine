import { Controller, Get, Param, Res, ParseIntPipe } from '@nestjs/common';
import { ListPicturesUseCase } from '../../application/pictures/list-pictures.usecase';
import { GetPictureUseCase } from '../../application/pictures/get-picture.usecase';
import { Pictures } from '../../domain/entities/pictures.entity';
import type { Response } from 'express';

@Controller('pictures')
export class PicturesController {
  constructor(
    private listPicturesUseCase: ListPicturesUseCase, 
    private readonly getPictureUseCase: GetPictureUseCase
  ) {}

  @Get()
  async getAll(): Promise<Partial<Pictures>[]> {
    const pictures = await this.listPicturesUseCase.execute();

    return pictures.map(({ id, name, path, updated_at }) => ({
      id,
      name,
      path,
      updated_at,
    }));
  }

  @Get(':id')
  async getFile(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const { fileStream, fileName } = await this.getPictureUseCase.execute(id);

    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

    fileStream.pipe(res);
  }
}