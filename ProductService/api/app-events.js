const {CustomerService}=require('../service/index')
const {PublishCustomerEvents}=require('../utils/index')

module.exports=(app)=>{
    app.use('/app-events',async(req,res,next)=>{
        
      const {payload}=req.body

      console.log("+++++++++++service++++++++")

      return res.status(200).json(payload)
    })
}