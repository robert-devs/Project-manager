

import ejs from 'ejs'
import mssql from 'mssql'
import dotenv from 'dotenv'
import { sqlConfig } from '../Config/config'
import sendMail from '../Helpers.ts/Email'
dotenv.config()
interface Project{
    id:string;
    name:string;
    description: string;
    userId: string;
    duedate: string;
}


const SendEmails= async()=>{
    const pool = await mssql.connect(sqlConfig)
    const projects:Project[]= await(await pool.request().query(`SELECT * FROM projects WHERE issent='0'`)).recordset

    for(let project of projects){

    // get user by id using project.userId
    const users = await pool.request()
              .input('id',mssql.VarChar,project.userId)
              .execute('getUserById')
              const{recordset} = users
  
    if(!recordset[0]){
      const user = recordset[0]
      ejs.renderFile('templates/registration.ejs',{name:user.name,task:project.name} ,async(error,data)=>{
          let messageoption={
              from:process.env.EMAIL,
              to:user.email,
              subject:"Jitu Project Task",
              html:data
          }
          try {
              
              await sendMail(messageoption)
              await pool.request().query(`UPDATE project SET issent='1' WHERE id = ${project.id}`)
              console.log('Email is Sent');
              
          } catch (error) {
              console.log(error);
          }  
        })
      }
    }

}

export default SendEmails