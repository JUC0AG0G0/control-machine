// domain/repositories/files.repository.ts
export interface FilesRepository {
  getFile(bucket: string, filename: string): Promise<Buffer>;
}
