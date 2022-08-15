import mssql from 'mssql'
import{Request,RequestHandler,Response} from 'express'
import{v4 as uid} from 'uuid'
import { sqlConfig } from '../Config/config'
import { createProjectSchema, updateProjectSchema } from '../Helper/userValidator'

interface ExtendsRequest extends Request{
    body: {
        name:string,
        description: string,
        userId: string,
        duedate: string
    }
}

export const createProjectController = async(req:ExtendsRequest,res:Response)=>{
    try {
        const pool= await mssql.connect(sqlConfig)

        console.log(req.body);
        
        // Validate REQ BODY (JOI)
         const {error} = createProjectSchema.validate(req.body);
        if(error){
            return res.status(400).send({message: error?.details[0].message})
        }
        
        //validate if userId exist
         const result = await pool
                .request()
                .input("id", req.body.userId)
                .execute("getUserById")
        const{recordset} = result

        if(recordset.length === 0){
            return res.status(404).send({message: "user not found"})
        }

        const id = uid()
        const {name,userId,description,duedate} = req.body
        
        
       await pool.request()
        .input('id',mssql.VarChar,id)
        .input('name',mssql.VarChar,name)
        .input('description',mssql.VarChar,description)
        .input('userId',mssql.VarChar,userId)
        .input('duedate',mssql.VarChar,duedate)
        .execute('createProject')
            
        // Get Created project
        const projectsResult = await pool
                .request()
                .input("id", id)
                .execute("getProjectById")
        const project = projectsResult.recordset[0]
        
        res.send({message: "project created succefully", project: project, success: true})
        
    } catch (error:any) {
        res.status(500).send({message:"Internal Server Error: "+ error.message,  success: false})
        
    }
}

export const getAllProjectsController = async(req:Request,res:Response)=>{
   try {
      
       const pool= await mssql.connect(sqlConfig)
       const projects = await pool.request().execute('getAllProjects')
        const{recordset} = projects
       res.json({projects: recordset})
    } catch (error:any) {
        res.json({error})
        
    }
}

export const getOneProjectController:RequestHandler<{id:string}> = async(req,res)=>{
    
        try {
        
       
            const id = req.params.id
            const pool= await mssql.connect(sqlConfig)
           const projects = await pool.request()
           .input('id',mssql.VarChar,id)
           .execute('getProjectById')
            const{recordset} = projects
            
            if(!projects.recordset[0]){
                 return res.status(404).send({message:`Project with id '${id}' not found`})
            }
           res.send({projects:recordset[0]})
        } catch (error:any) {
             res.status(500).send({message:"Internal Server Error: "+ error.message})
        }  
}
export const getOneProjectsByUserIdController:RequestHandler<{id:string}> = async(req,res)=>{
    
        try {
        
            const id = req.params.id
            const pool= await mssql.connect(sqlConfig)
           const projects = await pool.request()
           .input('userId',mssql.VarChar,id)
           .execute('getProjectsByUserId')
            const{recordset} = projects
    
           res.send({projects:recordset, success: true})
        } catch (error:any) {
            res.status(500).send({message:"Internal Server Error: "+ error.message,  success: false})
        }  
}

export const updateProjects:RequestHandler<{id:string}>=async(req,res)=>{
    try {
          // Validate REQ BODY (JOI)
             const {error} = updateProjectSchema.validate(req.body);
            if(error){
                return res.status(400).send({message: error?.details[0].message, success: false})
            }

        const id = req.params.id
        const pool= await mssql.connect(sqlConfig)
        const{name,description,userId,duedate }= req.body as{
            name:string,
            description: string,
            userId: string,
            duedate: string
        }
        const projects = await pool.request()
           .input('id',mssql.VarChar,id)
           .execute('getProjectById')
            if(!projects.recordset[0]){
                res.json({message:"project not found"})
            }else
            await pool.request()
                .input('id',mssql.VarChar,id)
                .input('name',mssql.VarChar,name)
                .input('description',mssql.VarChar,description)
                .input('userId',mssql.VarChar,userId)
                .input('duedate',mssql.VarChar,duedate)
                .execute('updateProjects')

                res.json({message:"project updated"})
    } catch (error:any) {
        res.status(500).send({message:"Internal Server Error: "+ error.message,  success: false})
        
    }
}

export const deleteProject:RequestHandler<{id :string}> =async(req,res)=>{
    try {
        const id = req.params.id
        const pool= await mssql.connect(sqlConfig)
        await pool.request().query(`DELETE FROM projects WHERE id='${id}'`)

        res.json({message:'projects deleted', success: true})
    } catch (error:any) {
        res.status(500).send({message:"Internal Server Error: "+ error.message,  success: false})
    }
}
