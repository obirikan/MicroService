const express =require('express')
const cors=require('cors')
const {Shopping,appEvents}=require('./api/index')

module.exports=async (app)=>{
    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

        //events
        appEvents(app)
        //api
        Shopping(app);
}