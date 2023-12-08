import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class SigninUserDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: "user1", description: "User's username or email"})
    public login: string

    @IsString()
    @ApiProperty({example: "password", description: "User's password"})
    @MinLength(8)
    public password: string
}