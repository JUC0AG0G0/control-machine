import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoundsController } from './sounds.controller';
import { ListSoundsUseCase } from '../../application/sounds/list-sounds.usecase';
import { SoundsRepositoryImpl } from '../../infrastructure/database/repositories/sounds.repository.impl';
import { SoundsOrmEntity } from '../../infrastructure/database/orm-entities/sounds.orm-entity';
import { MinioService } from 'src/infrastructure/storage/minio.service';
import { GetSoundUseCase } from 'src/application/sounds/get-sound.usecase';
import { UploadSoundUseCase } from '../../application/sounds/upload-sound.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([SoundsOrmEntity]),
  ],
  controllers: [SoundsController],
  providers: [
    ListSoundsUseCase,
    MinioService,
    GetSoundUseCase,
    UploadSoundUseCase,
    {
      provide: 'SoundsRepository',
      useClass: SoundsRepositoryImpl,
    },
  ],
})
export class SoundsModule {}
