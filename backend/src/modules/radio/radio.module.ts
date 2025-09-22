import { Module } from '@nestjs/common';
import { AppController } from './radio.controller';
import { AppService } from './radio.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// Pour jouer des sons en direct sur les machiene
// Je parle dans le site avec le micro et le son sort sur les machines