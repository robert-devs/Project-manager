import express,{json, Request, Response} from 'express'
import { sqlConfig } from './Config/config'
import mssql from 'mssql'
import cors from 'cors'

// Routes
import projectsRoutes from './Routes/projects'
import usersRoutes from './Routes/users'

const connect  = async()=>{
    const pool = await mssql.connect(sqlConfig)
    if(pool.connected){
        console.log('connected')
    }
}
connect()

const app = express()

app.use(json())
app.use(cors())

app.use('/projects', projectsRoutes)
app.use('/users', usersRoutes)

app.get("/todos/all", (req:Request, res: Response)=>{
    res.send({todos: [1,2,4,5,6]})
})

app.post("/todos", (req:Request, res: Response)=>{
    // Insert to db

    res.send({message:"Inserted Successfully"})
})


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
console.log(`server is running on port ${PORT}`);
    
})
