import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class RegisterUserDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Transform(({ value }) => value.trim())
    @Transform(({ value }) => value.toLowerCase())
    @ApiProperty({ example: "user1", description: "User's username" })
    public username: string

    @IsEmail({}, { message: "email field must be an email" })
    @ApiProperty({ example: "user1@gmail.com", description: "User's email" })
    public email: string

    @IsString()
    @MinLength(8)
    @ApiProperty({ example: "password", description: "User's password" })
    public password: string
}