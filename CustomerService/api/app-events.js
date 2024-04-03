const {CustomerService}=require('../service/index')

const service=new CustomerService()
module.exports=(app)=>{
    app.use('/app-events',async(req,res,next)=>{
        
      const {payload}=req.body

      service.SubscribeEvents(payload)

      console.log("+++++++++++service++++++++")

      return res.status(200).json(payload)
    })
}