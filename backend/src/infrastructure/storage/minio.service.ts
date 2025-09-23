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
}
