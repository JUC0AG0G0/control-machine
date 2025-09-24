// src/modules/files/files.controller.ts
import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { GetFileUseCase } from '../../application/files/get-files.usecase';
import { lookup } from 'mime-types';

@Controller('files')
export class FilesController {
  constructor(private readonly getFileUseCase: GetFileUseCase) {}

  @Get(':folder/:filename')
  async getFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const bucket = 'files'; // ton bucket unique
    const filePath = `${folder}/${decodeURIComponent(filename)}`;

    try {
      const buffer: Buffer = await this.getFileUseCase.execute(bucket, filePath);

      const mimeType = (lookup(filePath) as string) || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      return res.send(buffer);
    } catch (err) {
      // tu peux logger err ici si besoin
      throw new NotFoundException(`File ${filename} not found in ${folder}`);
    }
  }
}
