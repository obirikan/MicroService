const {ShoppingService}=require('../service/index')
const UserAuth=require('./middlewares/auth')
const service=new ShoppingService()
const {PublishCustomerEvents}=require('../utils/index')

module.exports=(app)=>{


    app.post('/order',UserAuth, async (req,res,next) => {

        const { _id :customerId} = req.user;
        const { txnId,orderId,amount} = req.body;


        try {
            const { data } = await service.PlaceOrder(customerId,txnId,orderId,amount);

            const {data:newdata}=await service.GetOrderPayload(customerId,data,'CREATE_ORDER')
            PublishCustomerEvents(newdata)
            return res.status(200).json(newdata);
            
        } catch (err) {
            next(err)
        }

    });


  app.post('/product/create', async(req,res,next) => {
        
    try {
        const { name, desc, type, unit,price, available, suplier, banner } = req.body; 
        // validation
        const { data } =  await service.CreateProduct({ name, desc, type, unit,price, available, suplier, banner });
        return res.json(data);
        
    } catch (err) {
        next(err)    
    }
    
});




}