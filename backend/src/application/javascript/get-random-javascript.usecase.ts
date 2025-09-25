import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { JavascriptRepository } from '../../domain/repositories/javascript.repository';
import { MinioService } from '../../infrastructure/storage/minio.service';

@Injectable()
export class GetRandomJavascriptUseCase {
  constructor(
    private readonly minioService: MinioService,
    @Inject('JavascriptRepository') private readonly javascriptRepository: JavascriptRepository,
  ) {}

  async execute() {
    const scripts = await this.javascriptRepository.findAll();
    if (!scripts || scripts.length === 0) {
      throw new NotFoundException('No Javascript scripts available');
    }

    // choisir un script au hasard
    const randomScript = scripts[Math.floor(Math.random() * scripts.length)];

    const [bucket, ...fileParts] = randomScript.path.split('/');
    const filePath = fileParts.join('/');

    const fileStream = await this.minioService.getFile(bucket, filePath);
    return { fileStream, fileName: randomScript.name };
  }
}
