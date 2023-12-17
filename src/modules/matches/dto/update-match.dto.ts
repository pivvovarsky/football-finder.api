import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateStadiumDto {
  @IsString()
  hostId: string;

  @IsString()
  guestId: string;

  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsInt()
  hostGoals: number;

  @IsInt()
  guestGoals: number;
}
