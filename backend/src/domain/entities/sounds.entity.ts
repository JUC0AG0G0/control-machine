// domain/entities/sounds.entity.ts
export class Sounds {
  constructor(
    public id: number,
    public name: string,
    public path: string,
    public updated_at: Date,
  ) {}
}
