import { Controller, Get } from '@nestjs/common';
import { ListPicturesUseCase } from '../../application/pictures/list-pictures.usecase';
import { Pictures } from '../../domain/entities/pictures.entity';

@Controller('pictures')
export class PicturesController {
  constructor(private listPicturesUseCase: ListPicturesUseCase) {}

  @Get()
  async getAll(): Promise<Partial<Pictures>[]> {
    const pictures = await this.listPicturesUseCase.execute();

    // On renvoie uniquement id, name, path et updatedAt
    return pictures.map(({ id, name, path, updated_at }) => ({
      id,
      name,
      path,
      updated_at,
    }));
  }
}