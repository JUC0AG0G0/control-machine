// domain/entities/javascript.entity.ts
export class Javascript {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly path: string,
    public readonly updatedAt: Date,
  ) {}
}
