import { Module } from '@nestjs/common';
import { AppController } from './background.controller';
import { AppService } from './background.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// Par rapport au changement de fond d'ecran