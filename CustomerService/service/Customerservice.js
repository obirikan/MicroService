const {CustomerRepo}=require("../repo/index")
const {GenerateSalt,GeneratePassword,GenerateSignature,FormateData,ValidatePassword}=require('../utils/index')


class CustomerService{

    constructor(){
        this.repository=new CustomerRepo()
    }

    async SignUp(userInputs){
      const {email,password,phone}=userInputs
      try {

            let salt = await GenerateSalt();
            
            let userPassword = await GeneratePassword(password, salt);
            const existing = await this.repository.FindCustomer({email});

            if(existing){
                return FormateData({msg: 'user already exist' })
            }
            const existingCustomer = await this.repository.createCustomer({ email, password: userPassword, phone, salt});
            
            const token = await GenerateSignature({ email: email, _id: existingCustomer._id});

            return FormateData({id: existingCustomer._id, token, email })

      } catch (error) {
        console.log(error);
      }
    }

    async SignIn(userInputs){

      const { email, password } = userInputs;
      
      try {
          
          const existingCustomer = await this.repository.FindCustomer({email});

          if(existingCustomer){
          
              const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt);
              
              if(validPassword){
                  const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer._id});
                  return FormateData({id: existingCustomer._id, token });
              } 
          }
  
          return FormateData(null);

      } catch (err) {
          throw new Error('Data Not found', err)
      }
     
  }

  async GetProfile(id){

    try {
        const existingCustomer = await this.repository.FindCustomerById({id})
      
        return FormateData(existingCustomer);
        
    } catch (err) {
        throw new Error('Data Not found', err)
    }
}


async AddNewAddress(_id,userInputs){
        
  const { street, postalCode, city,country} = userInputs;
  
  try {
      const addressResult = await this.repository.CreateAddress({ _id, street, postalCode, city,country})
      return FormateData(addressResult);
      
  } catch (err) {
      throw new Error('Data Not found', err)
  }
  

}

async AddToWishlist(customerId, product){
  try {
      const wishlistResult = await this.repository.AddWishlistItem(customerId, product);        
     return FormateData(wishlistResult);

  } catch (err) {
      throw new APIError('Data Not found', err)
  }
}

async AddCartItem(customerId,{_id,name,banner,available,price,description} , qty, isRemove) {
  try {
    const profile = await customerModel.findById(customerId).populate(
      "cart"
    );

    if (profile) {
      const cartItem = {
        product:{
          _id,
          name,
          banner,
          available,
          price,
          description
        },
        unit: qty,
      };

      let cartItems = profile.cart;

      if (cartItems.length > 0) {
        let isExist = false;
        cartItems.map((item) => {
          if (item.product._id.toString() === product._id.toString()) {
            if (isRemove) {
              cartItems.splice(cartItems.indexOf(item), 1);
            } else {
              item.unit = qty;
            }
            isExist = true;
          }
        });

        if (!isExist) {
          cartItems.push(cartItem);
        }
      } else {
        cartItems.push(cartItem);
      }

      profile.cart = cartItems;

      const cartSaveResult = await profile.save();

      return cartSaveResult ;
    }

    throw new Error("Unable to add to cart!");
  } catch (err) {
    throw new APIError(
      "Unable to Create Customer"
    );
  }
}

async ManageOrder(customerId, order){
  try {
      const orderResult = await this.repository.AddOrderToProfile(customerId, order);
      return FormateData(orderResult);
  } catch (err) {
      throw new APIError('Data Not found', err)
  }
}


async SubscribeEvents(payload){
 
  const { event, data } =  payload;

  const { userId, product, order, qty } = data;

  switch(event){
      case 'ADD_TO_WISHLIST':
      case 'REMOVE_FROM_WISHLIST':
          this.AddToWishlist(userId,product)
          break;
      case 'ADD_TO_CART':
          this.ManageCart(userId,product, qty, false);
          break;
      case 'REMOVE_FROM_CART':
          this.ManageCart(userId,product,qty, true);
          break;
      case 'CREATE_ORDER':
          this.ManageOrder(userId,order);
          break;
      case 'TEST':
          console.log('worling');
          break;
      default:
          break;
  }

}
}

module.exports=CustomerService