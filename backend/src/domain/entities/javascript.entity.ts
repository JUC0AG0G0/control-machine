// domain/entities/javascript.entity.ts
export class Javascript {
  constructor(
    public id: number,
    public name: string,
    public path: string,
    public updated_at: Date,
  ) {}
}
