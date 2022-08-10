import { Request } from "express"

export interface User {
    id?: string,
    username:string,
    name:string,
    email:string,
    role:string
    password:string
}

export interface ExtendedUserRequest extends Request{
    body: User
}