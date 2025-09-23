// domain/entities/pictures.entity.ts
export class Pictures {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly path: string,
    public readonly updatedAt: Date,
  ) {}
}
