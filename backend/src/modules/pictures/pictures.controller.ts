import { Controller, Get } from '@nestjs/common';
import { AppService } from './pictures.service';

@Controller('pictures')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPictures(): string {
    return this.appService.getHello();
  }
}
