// infrastructure/storage/files.repository.impl.ts
import { Injectable } from "@nestjs/common";
import { FilesRepository } from "../../domain/repositories/files.repository";
import { MinioService } from "./minio.service";

@Injectable()
export class FilesRepositoryImpl implements FilesRepository {
  constructor(private readonly minio: MinioService) {}

  async getFile(bucket: string, filename: string): Promise<Buffer> {
    const stream = await this.minio.client.getObject(bucket, filename);

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });
  }
}
