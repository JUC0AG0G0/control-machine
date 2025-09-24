import { IsString, IsIP } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  name: string;

  @IsIP()
  ip: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
