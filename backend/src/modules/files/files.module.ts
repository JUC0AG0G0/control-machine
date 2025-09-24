// modules/files/files.module.ts
import { Module } from "@nestjs/common";
import { GetFileUseCase } from "../../application/files/get-files.usecase";
import { FilesRepositoryImpl } from "../../infrastructure/storage/files.repository.impl";
import { FilesController } from "./files.controller";
import { MinioService } from "../../infrastructure/storage/minio.service";

@Module({
  controllers: [FilesController],
  providers: [
    GetFileUseCase,
    MinioService,
    {
      provide: "FilesRepository",
      useClass: FilesRepositoryImpl,
    },
  ],
})
export class FilesModule {}
