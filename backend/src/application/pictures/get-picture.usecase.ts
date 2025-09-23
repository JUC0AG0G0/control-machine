import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { PicturesRepository } from '../../domain/repositories/pictures.repository';
import { MinioService } from '../../infrastructure/storage/minio.service';

@Injectable()
export class GetPictureUseCase {
  constructor(
    private readonly minioService: MinioService,
    @Inject('PicturesRepository') private readonly picturesRepository: PicturesRepository,
  ) {}

  async execute(id: number) {
    const picture = await this.picturesRepository.findById(id);
    if (!picture) {
      throw new NotFoundException('Picture not found');
    }

    const [bucket, ...fileParts] = picture.path.split('/');
    const filePath = fileParts.join('/');

    const fileStream = await this.minioService.getFile(bucket, filePath);
    return { fileStream, fileName: picture.name };
  }
}
