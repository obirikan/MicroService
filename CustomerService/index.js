const express=require('express')
const app=express()
const {dbcon}=require('./DB_config/index')
const expressApp =require('./express-app')
const { CreateChannel } = require('./utils')
require('dotenv').config()

const startServer=async()=>{
   await dbcon()

   const channel=await CreateChannel()
   await expressApp(app,channel)
    
    app.listen(8000, () => {
        console.log(`listening to port customer Server 8000`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

startServer()