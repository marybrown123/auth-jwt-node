import { User} from "@prisma/client";

export interface UserRegistrationDto {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface UserLoginDto {
    email: string,
    password: string
}

export class UserResponse {
    constructor(user: User, token: string) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.token = token;
    }
    firstName: string;
    lastName: string;
    email: string;
    token: string
}