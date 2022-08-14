import express from 'express'
import cron from 'node-cron'
import SendEmails from './EmailService./EmailService'


const app= express()

const run =()=>{
cron.schedule('*/30 * * * * *', async() => {
  console.log('running a 30 seconds');
  await SendEmails()
})
}
run()


app.listen(8080, ()=>{
    console.log('App is Running');
    
})