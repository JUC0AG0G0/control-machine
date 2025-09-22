import { Module } from '@nestjs/common';
import { AppController } from './song.controller';
import { AppService } from './song.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// Pour jouer des sons