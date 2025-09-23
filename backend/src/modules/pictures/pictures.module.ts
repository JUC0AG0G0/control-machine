import { Module } from '@nestjs/common';
import { AppController } from './pictures.controller';
import { AppService } from './pictures.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
