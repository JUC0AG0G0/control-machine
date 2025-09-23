// domain/entities/pictures.entity.ts
export class Pictures {
  constructor(
    public id: number,
    public name: string,
    public path: string,
    public updated_at: Date,
  ) {}
}
