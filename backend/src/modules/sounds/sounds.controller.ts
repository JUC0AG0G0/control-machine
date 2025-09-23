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
import { ListSoundsUseCase } from '../../application/sounds/list-sounds.usecase';
import { GetSoundUseCase } from '../../application/sounds/get-sound.usecase';
import { Sounds } from '../../domain/entities/sounds.entity';
import type { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadSoundUseCase } from '../../application/sounds/upload-sound.usecase';
import type { MulterFile } from '../../infrastructure/types/multer-file.type';

@Controller('sounds')
export class SoundsController {
  constructor(
    private listSoundsUseCase: ListSoundsUseCase,
    private readonly getSoundUseCase: GetSoundUseCase,
    private readonly UploadSoundUseCase: UploadSoundUseCase,
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

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MulterFile): Promise<Sounds> {
    return this.UploadSoundUseCase.execute(file);
  }
}
