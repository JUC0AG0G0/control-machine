// src/modules/script-injection/script-injection.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApifilrougeController } from './apifilrouge.controller';
import { InjectScriptToApiUseCase } from '../../application/apifilrouge/inject-script-to-api.usecase';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    })
  ],
  controllers: [ApifilrougeController],
  providers: [InjectScriptToApiUseCase],
})
export class ApifilrougeModule {}