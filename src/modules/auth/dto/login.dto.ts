import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(70)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(70)
  password: string;
}
