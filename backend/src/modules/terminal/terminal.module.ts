import { Module } from '@nestjs/common';
import { AppController } from './terminal.controller';
import { AppService } from './terminal.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// Pour ce connecter en ssh aux machines