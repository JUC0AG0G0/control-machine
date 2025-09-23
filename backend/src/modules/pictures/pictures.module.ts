import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PicturesController } from './pictures.controller';
import { ListPicturesUseCase } from '../../application/pictures/list-pictures.usecase';
import { PicturesRepositoryImpl } from '../../infrastructure/database/repositories/pictures.repository.impl';
import { PicturesOrmEntity } from '../../infrastructure/database/orm-entities/pictures.orm-entity';
import { MinioService } from 'src/infrastructure/storage/minio.service';
import { GetPictureUseCase } from 'src/application/pictures/get-picture.usecase';
import { UploadPictureUseCase } from 'src/application/pictures/upload-picture.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([PicturesOrmEntity]),
  ],
  controllers: [PicturesController],
  providers: [
    ListPicturesUseCase,
    MinioService,
    GetPictureUseCase,
    UploadPictureUseCase,
    {
      provide: 'PicturesRepository',
      useClass: PicturesRepositoryImpl,
    },
  ],
})
export class PicturesModule {}
