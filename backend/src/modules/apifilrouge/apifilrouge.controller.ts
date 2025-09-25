// src/modules/script-injection/script-injection.controller.ts
import { Controller, Post, Param, Body, BadRequestException } from '@nestjs/common';
import { InjectScriptToApiUseCase } from '../../application/apifilrouge/inject-script-to-api.usecase';
import { ScriptInjectionDto, isValidTheme } from '../../common/dto/script-injection.dto';
import { ThemeName } from '../../infrastructure/config/theme-api.config';

@Controller('apifilrouge')
export class ApifilrougeController {
  constructor(
    private readonly injectScriptToApiUseCase: InjectScriptToApiUseCase
  ) {}

  @Post('addscripttoapi/:theme')
  async injectScript(
    @Param('theme') theme: string,
    @Body() body: ScriptInjectionDto
  ) {
    // Valider le thème
    if (!isValidTheme(theme)) {
      throw new BadRequestException(`Invalid theme: ${theme}. Available themes: ${Object.keys(require('../../infrastructure/config/theme-api.config').THEME_API_CONFIG).join(', ')}`);
    }

    // Valider l'ID
    if (!body.id || (body.id !== 'random' && isNaN(Number(body.id)))) {
      throw new BadRequestException('ID must be either "random" or a valid number');
    }

    try {
      const result = await this.injectScriptToApiUseCase.execute(theme as ThemeName, body.id);
      
      return {
        success: result.success,
        message: result.message,
        theme,
        scriptId: body.id,
        scriptUrl: `http://localhost:3001/files/script/${body.id}`
      };
      
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}