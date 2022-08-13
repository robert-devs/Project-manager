import mssql, { VarChar } from 'mssql'
import { sqlConfig } from '../Config/config'
import {v4 as uid} from 'uuid'
import{ Request,RequestHandler,Response} from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ExtendedUserRequest } from '../interfaces/users.interface'
import { loginUserSchema, registerUserSchema, updateUserSchema } from '../Helper/userValidator'

export const loginUserController = async (req:ExtendedUserRequest,res:Response)=>{
    try {
        const pool= await mssql.connect(sqlConfig)


        // Validate REQ BODY (JOI)
        const {error} = loginUserSchema.validate(req.body);
        if(error){
            return res.status(400).send({message: error?.details[0].message, success: false})
        }

        // Validate email exist in db
        const result = await pool
                .request()
                .input("email", req.body.email)
                .execute("getUserByEmail")
        const{recordset} = result

        if(recordset.length === 0){
            return res.status(404).send({message: "Email not found", success: false})
        }

        const user = recordset[0]

        // Validate correct password
        const validPassword = await bcrypt.compare(req.body.password, user.password);

         if(!validPassword){
            return res.status(404).send({message: "Invalid password provided", success: false})
        }        

        // Generate token
        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET ?? "")

        // Return response with user and token    
        res.json({message:'Login successful', user, token , success: true})
    } catch (error: any) {
        res.status(500).send({message:"Internal Server Error: "+ error.message, success: false})
        
    }
}

export const registerUserController = async (req:ExtendedUserRequest,res:Response)=>{
    try {

        const id = uid()
        const pool= await mssql.connect(sqlConfig)

        console.log(req.body);
        


        // Validate REQ BODY (JOI)
        const {error} = registerUserSchema.validate(req.body);
        if(error){
            return res.status(400).send({message: error?.details[0].message,  success: false})
        }

        // Validate Email Is Unique - does not exist in database
        const result = await pool
                .request()
                .input("email", req.body.email)
                .execute("getUserByEmail")
        const{recordset} = result

        if(recordset.length > 0){
            return res.status(400).send({message: "Email already registered", success: false})
        }       

        // HASH Password (bcrypt)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)        

        // Insert Data to DB
        const{username,name,role,email}= req.body
        await pool.request()
            .input('id',mssql.VarChar,id)
            .input('username',mssql.VarChar,username)
            .input('name',mssql.VarChar,name)
            .input('email',mssql.VarChar,email)
            .input('role',mssql.VarChar,role)
            .input('password',mssql.VarChar, hashedPassword)
            .execute('createUser')

        // Get Created User
        const userResult = await pool
                .request()
                .input("id", id)
                .execute("getUserById")
        const user = userResult.recordset[0]

        // Generate token with inserted data
        const token = jwt.sign({id, role: user.role}, process.env.JWT_SECRET ?? "")

        // Return response with user and token    
        res.json({message:'user registered successfully', user, token, success: true})
    } catch (error:any) {
        res.status(500).send({message:"Internal Server Error: "+ error.message, success: false})
    }
}

export const getUsers =async(req:Request,res:Response)=>{
    try {
       const pool= await mssql.connect(sqlConfig)
       const users = await pool.request().execute('getUsers')
        const{recordset} = users
       res.json({users: recordset,  success: true})
    } catch (error:any) {
        res.status(500).send({message:"Internal Server Error: "+ error.message,  success: false})
        
    }
}
export const getOneUser:RequestHandler<{id:string}> =async(req,res)=>{
        try {
            const id = req.params.id
            const pool= await mssql.connect(sqlConfig)
           const users = await pool.request()
           .input('id',mssql.VarChar,id)
           .execute('getUserById')
            const{recordset} = users
            
            if(!recordset[0]){
                 return res.status(404).send({message:`User with id '${id}' not found`,  success: false})
            }
           res.send({user:recordset[0], success: true})

        } catch (error:any) {
         res.status(500).send({message:"Internal Server Error: "+ error.message,  success: false})
        }    
}
export const updateUser:RequestHandler<{id:string}>=async(req,res)=>{
    try {
           // Validate REQ BODY (JOI)
        const {error} = updateUserSchema.validate(req.body);
        if(error){
            return res.status(400).send({message: error?.details[0].message,  success: false})
        }
        const id = req.params.id
        const pool= await mssql.connect(sqlConfig)
        const{name,username,email,role }= req.body as{
            name:string,
            username: string,
            email: string,
            role: string
        }
        const users = await pool.request()
           .input('id',mssql.VarChar,id)
           .execute('getUserById')
            if(!users.recordset[0]){
                return res.json({message:"user not found",  success: false})
            }

            await pool.request()
                .input('id',mssql.VarChar,id)
                .input('username',mssql.VarChar,username)
                .input('name',mssql.VarChar,name)
                .input('email',mssql.VarChar,email)
                .input('role',mssql.VarChar,role)
                .execute('updateUser')

        // Get Update User
        const userResult = await pool
                .request()
                .input("id", id)
                .execute("getUserById")
        const user = userResult.recordset[0]  
        
                res.json({message:"user updated", user,  success: true})
    } catch (error:any) {
        res.status(500).send({message:"Internal Server Error: "+ error.message,  success: false})
        
    }
}
export const deleteUser:RequestHandler<{id :string}> =async(req,res)=>{
    try {
        const id = req.params.id
        const pool= await mssql.connect(sqlConfig)

        // Valid user ID
        const usersResult = await pool.request()
           .input('id',mssql.VarChar,id)
           .execute('getUserById')
            const{recordset} = usersResult
            
        if(!recordset[0]){
            return res.status(404).send({message:`User with id '${id}' not found`,  success: false})
        }

        const user = recordset[0]

        // Check if user has existing projects
        const projects = await pool.request()
           .input('userId',mssql.VarChar,user.id)
           .execute('getProjectsByUserId')
            
            if(projects.recordset.length>0){
                 return res.status(400).send({message:`Cannot delete user. User already has projects assigned to them`,  success: false})
            }
            
        await pool.request().query(`DELETE FROM users WHERE id='${id}'`)
        
         res.json({message:'user deleted',  success: true})
    } catch (error:any) {
         res.status(500).send({message:"Internal Server Error: "+ error.message,  success: false})
    }
}

