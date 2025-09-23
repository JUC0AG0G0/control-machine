import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import des ORM Entities
import { MachinesOrmEntity } from './infrastructure/database/orm-entities/machines.orm-entity';
import { SoundsOrmEntity } from './infrastructure/database/orm-entities/sounds.orm-entity';
import { PicturesOrmEntity } from './infrastructure/database/orm-entities/pictures.orm-entity';
import { JavascriptOrmEntity } from './infrastructure/database/orm-entities/javascript.orm-entity';

import { PicturesModule } from './modules/pictures/pictures.module';
import { SoundsModule } from './modules/sounds/sounds.module';

@Module({
  imports: [
    PicturesModule,
    SoundsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'db',
      entities: [
        MachinesOrmEntity,
        SoundsOrmEntity,
        PicturesOrmEntity,
        JavascriptOrmEntity,
      ],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      MachinesOrmEntity,
      SoundsOrmEntity,
      PicturesOrmEntity,
      JavascriptOrmEntity,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
