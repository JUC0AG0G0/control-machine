// domain/entities/machines.entity.ts
export class Machines {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly ip: string,
    public readonly username: string,
    public readonly password: string,
    public readonly status: string = 'offline',
    public readonly lastSeen: Date | null = null,
  ) {}
}
