const {ShoppingModel}=require('../models/index')


class ShoppingRepo{


    // payment

    async Orders(customerId){
      try{
          const orders = await ShoppingModel.find({customerId});        
          return orders;
      }catch(err){
          throw new Error('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders')
      }
  }


  async  CreateNewOrder(customerId,txnId,orderId,amount){
      //check transaction for payment Status
      
      try{
              
                  const order = new ShoppingModel({
                      orderId,
                      customerId,
                      amount,
                      txnId,
                      status: 'received',
                  })

                  const orderResult = await order.save();
  
                  await order.save();
  
                  return orderResult ;
              

      }catch(err){
          throw new Error('Unable to Find Category')
      }
      

  }

}

module.exports=ShoppingRepo