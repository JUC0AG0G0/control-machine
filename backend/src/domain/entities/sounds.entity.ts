// domain/entities/sounds.entity.ts
export class Sounds {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly path: string,
    public readonly updatedAt: Date,
  ) {}
}
