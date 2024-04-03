const {ShoppingRepo}=require("../repo/index")
const {GenerateSalt,GeneratePassword,GenerateSignature,FormateData}=require('../../ProductService/utils/index')


class ShopppingService{

    constructor(){
        this.repository=new ShoppingRepo()
    }
    async PlaceOrder(userInput) {
        const {customerId,txnId,orderId,amount} = userInput;
    
        // Verify the txn number with payment logs
    
        try {
          const orderResult = await this.repository.CreateNewOrder(customerId,txnId,orderId,amount);
          return FormateData(orderResult);
        } catch (err) {
          throw new APIError("Data Not found", err);
        }
      }
    
      async GetOrders(customerId) {
        try {
          const orders = await this.repository.Orders(customerId);
          return FormateData(orders);
        } catch (err) {
          throw new APIError("Data Not found", err);
        }
      }

      

      async GetOrderPayload(userId,order,event){
             const payload={
                 event,
                 data:{
                   userId,
                   order,
                 }
             }
           return FormateData(payload)
       }
}

module.exports=ShopppingService