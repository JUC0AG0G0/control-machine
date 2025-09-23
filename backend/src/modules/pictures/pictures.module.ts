import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PicturesController } from './pictures.controller';
import { ListPicturesUseCase } from '../../application/pictures/list-pictures.usecase';
import { PicturesRepositoryImpl } from '../../infrastructure/database/repositories/pictures.repository.impl';
import { PicturesOrmEntity } from '../../infrastructure/database/orm-entities/pictures.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PicturesOrmEntity]), // ← dit à Nest quels ORM entities sont disponibles
  ],
  controllers: [PicturesController],
  providers: [
    ListPicturesUseCase,
    {
      provide: 'PicturesRepository',
      useClass: PicturesRepositoryImpl,
    },
  ],
})
export class PicturesModule {}
