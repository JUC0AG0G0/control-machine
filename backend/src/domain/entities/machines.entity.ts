// domain/entities/machines.entity.ts
export class Machine {
  constructor(
    public id: number,
    public name: string,
    public ip: string,
    public username: string,
    public password: string,
    public status: string,
    public last_seen: Date | null,
  ) {}
}
