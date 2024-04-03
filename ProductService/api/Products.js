const {ProductService}=require('../service/index')
const {PublishCustomerEvents,PublishShoppingEvents, PublishMessage}=require('../utils/index')
const UserAuth=require('./middleware/auth')

module.exports=(app,channel)=>{
    const service=new ProductService()

    app.get('/', async (req,res,next) => {
      //check validation
      try {
          const { data } = await service.GetProducts();        
          return res.status(200).json(data);
      } catch (error) {
          next(err)
      }
      
  })


  app.post('/create', async(req,res,next) => {
        
    try {
        const { name, desc, type, unit,price, available, suplier, banner } = req.body; 
        // validation
        const { data } =  await service.CreateProduct({ name, desc, type, unit,price, available, suplier, banner });
        return res.json(data);
        
    } catch (err) {
        next(err)    
    }
    
});

app.put('/wishlist',UserAuth,async (req,res,next) => {

    const { _id } = req.user;

    const {data}=await service.GetProductPayload(_id,{productId:req.body._id},'ADD_TO_WISHLIST')
    
    try {
         let bindingkey='customer_service'
         PublishMessage(channel,bindingkey,JSON.stringify(data))
        return res.status(200).json(data);
    } catch (err) {
        
    }
});





}