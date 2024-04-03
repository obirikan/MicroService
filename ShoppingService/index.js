const express=require('express')
const app=express()
const {dbcon}=require('./DB_config/index')
const expressApp =require('./express-app')

const startServer=async()=>{
   await dbcon()
   await expressApp(app)

    // app.get('/',async (req,res)=>{
    // res.json('hello form products')
    // })
    
    app.listen(8002, () => {
        console.log(`listening to port shopping Server 8002`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

startServer()