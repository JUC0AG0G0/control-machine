import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JavascriptController } from './javascript.controller';
import { ListJavascriptUseCase } from '../../application/javascript/list-javascript.usecase';
import { JavascriptRepositoryImpl } from '../../infrastructure/database/repositories/javascript.repository.impl';
import { JavascriptOrmEntity } from '../../infrastructure/database/orm-entities/javascript.orm-entity';
import { MinioService } from 'src/infrastructure/storage/minio.service';
import { GetJavascriptUseCase } from 'src/application/javascript/get-javascript.usecase';
import { UploadJavascriptUseCase } from 'src/application/javascript/upload-javascript.usecase';
import { GetRandomJavascriptUseCase } from '../../application/javascript/get-random-javascript.usecase';


@Module({
  imports: [
    TypeOrmModule.forFeature([JavascriptOrmEntity]),
  ],
  controllers: [JavascriptController],
  providers: [
    ListJavascriptUseCase,
    MinioService,
    GetJavascriptUseCase,
    UploadJavascriptUseCase,
    GetRandomJavascriptUseCase,
    {
      provide: 'JavascriptRepository',
      useClass: JavascriptRepositoryImpl,
    },
  ],
})
export class JavascriptModule {}
