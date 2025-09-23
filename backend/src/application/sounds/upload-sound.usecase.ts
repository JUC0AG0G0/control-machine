import { Injectable, Inject } from '@nestjs/common';
import type { SoundsRepository } from '../../domain/repositories/sounds.repository';
import { MinioService } from '../../infrastructure/storage/minio.service';
import { Sounds } from '../../domain/entities/sounds.entity';
import type { MulterFile } from '../../infrastructure/types/multer-file.type';


@Injectable()
export class UploadSoundUseCase {
  constructor(
    private readonly minioService: MinioService,
    @Inject('SoundsRepository')
    private readonly soundsRepository: SoundsRepository,
  ) {}

  async execute(file: MulterFile): Promise<Sounds> {
    if (!file) {
      throw new Error('No file provided');
    }

    const bucket = 'files';
    const folder = 'audio';
    const filePath = `${folder}/${file.originalname}`;

    // Upload dans MinIO
    await this.minioService.uploadFile(
      bucket,
      filePath,
      file.buffer,
      file.mimetype,
    );

    // Créer l'entité
    const sound = new Sounds(
      -1,
      file.originalname,
      `${bucket}/${filePath}`,
      new Date(),
    );

    // Sauvegarder en base
    return this.soundsRepository.save(sound);
  }
}
