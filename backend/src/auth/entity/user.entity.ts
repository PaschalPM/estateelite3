import { Exclude } from "class-transformer";
import { User } from "@prisma/client";

export class UserEntity{
     
    @Exclude()
    public hash: string

    @Exclude()
    public updatedAt: string
    
    constructor(partial: Partial<User>) {
        Object.assign(this, partial)
    }
}