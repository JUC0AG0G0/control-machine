// application/files/get-file.usecase.ts
import { Injectable, Inject } from "@nestjs/common";
import type { FilesRepository } from "../../domain/repositories/files.repository";

@Injectable()
export class GetFileUseCase {
  constructor(
    @Inject("FilesRepository")
    private readonly filesRepository: FilesRepository,
  ) {}

  async execute(bucket: string, filename: string): Promise<Buffer> {
    return this.filesRepository.getFile(bucket, filename);
  }
}
