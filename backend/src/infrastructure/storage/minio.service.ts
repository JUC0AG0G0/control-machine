import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { Readable } from 'stream';

@Injectable()
export class MinioService {
  private client: Client;

  constructor() {
    this.client = new Client({
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: 'admin',
      secretKey: 'admin123',
    });
  }

  async getFile(bucket: string, filePath: string): Promise<Readable> {
    return this.client.getObject(bucket, filePath);
  }

  async uploadFile(
    bucket: string,
    filePath: string,
    fileBuffer: Buffer,
    contentType: string,
  ) {
    await this.client.putObject(
      bucket,
      filePath,
      fileBuffer,
      fileBuffer.length,
      { 'Content-Type': contentType },
    );

    return filePath;
  }
}
