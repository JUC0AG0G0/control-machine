import {
  Controller,
  Get,
  Param,
  Res,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ListPicturesUseCase } from '../../application/pictures/list-pictures.usecase';
import { GetPictureUseCase } from '../../application/pictures/get-picture.usecase';
import { Pictures } from '../../domain/entities/pictures.entity';
import type { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPictureUseCase } from 'src/application/pictures/upload-picture.usecase';
import type { MulterFile } from '../../infrastructure/types/multer-file.type';

@Controller('pictures')
export class PicturesController {
  constructor(
    private readonly listPicturesUseCase: ListPicturesUseCase,
    private readonly getPictureUseCase: GetPictureUseCase,
    private readonly uploadPictureUseCase: UploadPictureUseCase,
  ) { }

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

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MulterFile): Promise<Pictures> {
    return this.uploadPictureUseCase.execute(file);
  }
}
