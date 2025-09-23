import { Injectable, Inject } from '@nestjs/common';
import type { PicturesRepository } from '../../domain/repositories/pictures.repository';
import { MinioService } from '../../infrastructure/storage/minio.service';
import { Pictures } from '../../domain/entities/pictures.entity';
import type { MulterFile } from '../../infrastructure/types/multer-file.type';


@Injectable()
export class UploadPictureUseCase {
  constructor(
    private readonly minioService: MinioService,
    @Inject('PicturesRepository')
    private readonly picturesRepository: PicturesRepository,
  ) {}

  async execute(file: MulterFile): Promise<Pictures> {
    if (!file) {
      throw new Error('No file provided');
    }

    const bucket = 'files'; // ou ton bucket choisi
    const folder = 'images';
    const filePath = `${folder}/${file.originalname}`;

    // Upload dans MinIO
    await this.minioService.uploadFile(
      bucket,
      filePath,
      file.buffer,
      file.mimetype,
    );

    // Créer l'entité
    const picture = new Pictures(
      -1,
      file.originalname,
      `${bucket}/${filePath}`,
      new Date(),
    );

    // Sauvegarder en base
    return this.picturesRepository.save(picture);
  }
}
