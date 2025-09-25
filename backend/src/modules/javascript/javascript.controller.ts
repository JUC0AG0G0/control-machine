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
import { ListJavascriptUseCase } from '../../application/javascript/list-javascript.usecase';
import { GetJavascriptUseCase } from '../../application/javascript/get-javascript.usecase';
import { Javascript } from '../../domain/entities/javascript.entity';
import type { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadJavascriptUseCase } from 'src/application/javascript/upload-javascript.usecase';
import { GetRandomJavascriptUseCase } from 'src/application/javascript/get-random-javascript.usecase';
import type { MulterFile } from '../../infrastructure/types/multer-file.type';

@Controller('javascript')
export class JavascriptController {
  constructor(
    private readonly listJavascriptUseCase: ListJavascriptUseCase,
    private readonly getJavascriptUseCase: GetJavascriptUseCase,
    private readonly uploadJavascriptUseCase: UploadJavascriptUseCase,
    private readonly getRandomJavascriptUseCase: GetRandomJavascriptUseCase,
  ) { }

  @Get()
  async getAll(): Promise<Partial<Javascript>[]> {
    const pictures = await this.listJavascriptUseCase.execute();

    return pictures.map(({ id, name, path, updated_at }) => ({
      id,
      name,
      path,
      updated_at,
    }));
  }

  @Get('random')
  async getRandomFile(@Res() res: Response) {
    const { fileStream, fileName } = await this.getRandomJavascriptUseCase.execute();

    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    fileStream.pipe(res);
  }

  @Get(':id')
  async getFile(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const { fileStream, fileName } = await this.getJavascriptUseCase.execute(id);

    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    fileStream.pipe(res);
  }


  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MulterFile): Promise<Javascript> {
    return this.uploadJavascriptUseCase.execute(file);
  }
}
