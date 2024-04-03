const {ProductsRepo}=require("../../ProductService/repo/index")
const {GenerateSalt,GeneratePassword,GenerateSignature,FormateData}=require('../../ProductService/utils/index')


class ProductService{

    constructor(){
        this.repository=new ProductsRepo()
    }

    async GetProducts(){
      try{
          const products = await this.repository.Products();
  
          let categories = {};
  
          products.map(({ type }) => {
              categories[type] = type;
          });
          
          return FormateData({
              products,
              categories:  Object.keys(categories) ,
          })

      }catch(err){
          throw new Error('Data Not found')
      }
  }

  async CreateProduct(productInputs){
    try{
        const productResult = await this.repository.CreateProduct(productInputs)
        return FormateData(productResult);
    }catch(err){
        throw new APIError('Data Not found')
    }
}

async GetProductById(productId){
    try {
        return await this.repository.FindById(productId);
    } catch (err) {
        throw new APIError('Data Not found')
    }
}

async GetProductPayload(userId,{productId,qty},event){
 const product=await this.repository.FindById(productId)
 if(product){
      const payload={
          event,
          data:{
            userId,
            product,
            qty
          }
      }
    return FormateData(payload)
 }else{

 }
}



}

module.exports=ProductService