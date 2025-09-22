import { Module } from '@nestjs/common';
import { AppController } from './control.controller';
import { AppService } from './control.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// Pour faire tourner un script de verification des etats des machines