import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { SoundsRepository } from '../../domain/repositories/sounds.repository';
import { MinioService } from '../../infrastructure/storage/minio.service';

@Injectable()
export class GetSoundUseCase {
  constructor(
    private readonly minioService: MinioService,
    @Inject('SoundsRepository') private readonly soundsRepository: SoundsRepository,
  ) {}

  async execute(id: number) {
    const picture = await this.soundsRepository.findById(id);
    if (!picture) {
      throw new NotFoundException('Picture not found');
    }

    const [bucket, ...fileParts] = picture.path.split('/');
    const filePath = fileParts.join('/');

    const fileStream = await this.minioService.getFile(bucket, filePath);
    return { fileStream, fileName: picture.name };
  }
}
