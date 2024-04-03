const {customerModel,AddressModel}=require('../models/index')


class CustomerRepo{
    async createCustomer({email,password,phone,salt}){
        try {
            const customer = new customerModel({
              email,
              password,
              salt,
              phone,
              address: [],
            });
            const customerResult = await customer.save();
            return customerResult;
          } catch (err) {
            consoel.log(err) 
          }
    }

    async FindCustomer({ email }) {
        try {
          const existingCustomer = await customerModel.findOne({ email: email });
          return existingCustomer;
        } catch (err) {
           console.log(err)
        }
      }


      async AddOrderToProfile(customerId, order) {
        try {
          const profile = await customerModel.findById(customerId);
    
          if (profile) {
            if (profile.orders == undefined) {
              profile.orders = [];
            }
            profile.orders.push(order);
    
            profile.cart = [];
    
            const profileResult = await profile.save();
    
            return profileResult;
          }
    
          throw new Error("Unable to add to order!");
        } catch (err) {
          throw new Error(
            "Unable to Create Customer"
          );
        }
      }
    

      async CreateAddress({ _id, street, postalCode, city, country }) {
        try {
          const profile = await customerModel.findById(_id);
    
          if (profile) {
            const newAddress = new AddressModel({
              street,
              postalCode,
              city,
              country,
            });
    
            await newAddress.save();
    
            profile.address.push(newAddress);
          }
    
          return await profile.save();
        } catch (err) {
          throw new Error(
            "Error on Create Address"
          );
        }
      }

      async  FindCustomerById({ id }) {
        try {
          const existingCustomer = await customerModel.findById(id)
          .populate('address')
          return existingCustomer;
        } catch (err) {
          throw new Error(
            "Unable to Find Customer"
          );
        }
      }

      async Wishlist(customerId) {
        try {
          const profile = await customerModel.findById(customerId).populate(
            "wishlist"
          );
    
          return profile.wishlist;
        } catch (err) {
          throw new APIError(
            "API Error",
            STATUS_CODES.INTERNAL_ERROR,
            "Unable to Get Wishlist "
          );
        }
      }
    
      async AddWishlistItem(customerId,{_id,name,banner,available,price,description}) {
        try {
          const profile = await customerModel.findById(customerId).populate("wishlist");

          const product={
            _id,
            name,
            banner,
            available,
            price,
            description
          }
    
          if (profile) {
            let wishlist = profile.wishlist;
    
            if (wishlist.length > 0) {
              let isExist = false;
              wishlist.map((item) => {
                if (item._id.toString() === product._id.toString()) {
                  const index = wishlist.indexOf(item);
                  wishlist.splice(index, 1);
                  isExist = true;
                }
              });
    
              if (!isExist) {
                wishlist.push(product);
              }
            } else {
              wishlist.push(product);
            }
    
            profile.wishlist = wishlist;
          }
    
          const profileResult = await profile.save();
    
          return profileResult.wishlist;
        } catch (err) {
          throw new Error(
            "Unable to Add to WishList"
          );
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
}

module.exports=CustomerRepo