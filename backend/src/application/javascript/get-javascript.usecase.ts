import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { JavascriptRepository } from '../../domain/repositories/javascript.repository';
import { MinioService } from '../../infrastructure/storage/minio.service';

@Injectable()
export class GetJavascriptUseCase {
  constructor(
    private readonly minioService: MinioService,
    @Inject('JavascriptRepository') private readonly javascriptRepository: JavascriptRepository,
  ) {}

  async execute(id: number) {
    const javascript = await this.javascriptRepository.findById(id);
    if (!javascript) {
      throw new NotFoundException('Javascript not found');
    }

    const [bucket, ...fileParts] = javascript.path.split('/');
    const filePath = fileParts.join('/');

    const fileStream = await this.minioService.getFile(bucket, filePath);
    return { fileStream, fileName: javascript.name };
  }
}
