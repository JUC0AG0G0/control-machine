// src/common/dto/script-injection.dto.ts
import { IsString, IsIn } from 'class-validator';
import { THEME_API_CONFIG, ThemeName } from '../../infrastructure/config/theme-api.config';

export class ScriptInjectionDto {
  @IsString()
  @IsIn(['random', ...Array.from({ length: 1000 }, (_, i) => (i + 1).toString())])
  id: string;
}

export const isValidTheme = (theme: string): theme is ThemeName => {
  return Object.keys(THEME_API_CONFIG).includes(theme);
};