import { Injectable, Inject } from '@nestjs/common';
import type { JavascriptRepository } from '../../domain/repositories/javascript.repository';
import { MinioService } from '../../infrastructure/storage/minio.service';
import type { MulterFile } from '../../infrastructure/types/multer-file.type';
import { Javascript } from 'src/domain/entities/javascript.entity';


@Injectable()
export class UploadJavascriptUseCase {
  constructor(
    private readonly minioService: MinioService,
    @Inject('JavascriptRepository')
    private readonly javascriptRepository: JavascriptRepository,
  ) {}

  async execute(file: MulterFile): Promise<Javascript> {
    if (!file) {
      throw new Error('No file provided');
    }

    const bucket = 'files';
    const folder = 'javascript';
    const filePath = `${folder}/${file.originalname}`;

    // Upload dans MinIO
    await this.minioService.uploadFile(
      bucket,
      filePath,
      file.buffer,
      file.mimetype,
    );

    // Créer l'entité
    const javascript = new Javascript(
      -1,
      file.originalname,
      `${bucket}/${filePath}`,
      new Date(),
    );

    // Sauvegarder en base
    return this.javascriptRepository.save(javascript);
  }
}
