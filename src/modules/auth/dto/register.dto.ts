import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from "class-validator";

const strongPasswordRegExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(70)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(70)
  @Matches(strongPasswordRegExp, { message: "password too weak" })
  password: string;
}
