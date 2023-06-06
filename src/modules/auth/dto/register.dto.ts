import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from "class-validator";

const strongPasswordRegExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(150)
  @Matches(strongPasswordRegExp, { message: "password too weak" })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
