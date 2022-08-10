import Joi from "joi";

enum UserRole{
    admin="admin",
    user="user",
}
    
export const registerUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    name: Joi.string().min(5).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid(...Object.values(UserRole)).required(),
})


export const loginUserSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(8).required(),
})

export const updateUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    name: Joi.string().min(5).required(),
    role: Joi.string().valid(...Object.values(UserRole)).required(),
})

// PROJECT SCHEMA

export const createProjectSchema =Joi.object({
    name:Joi.string().min(5).required(),
    userId:Joi.string().required(),
    description:Joi.string().required(),
    duedate:Joi.string().required()
})
export const updateProjectSchema =Joi.object({
     name:Joi.string().min(5).required(),
    userId:Joi.string().required(),
    description:Joi.string().required(),
    duedate:Joi.string().required()
})