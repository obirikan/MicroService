const jwt=require('jsonwebtoken')
let  APP_SECRET='savetheworld'
const axios=require('axios')


module.exports.GenerateSignature = async (payload) => {
    try {
      return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  
  module.exports.ValidateSignature = async (req) => {
    try {
      const signature = req.get("Authorization");
      console.log(signature);
      const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
      req.user = payload;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  
  module.exports.FormateData = (data) => {
    if (data) {
      return { data };
    } else {
      throw new Error("Data Not found!");
    }
  };


  module.exports.PublishCustomerEvents=async(payload)=>{
      axios.post('http://localhost:7000/customer/app-events',{payload})
  }

  // module.exports.PublishShoppingEvents=async()=>{
  //    axios.post('http://localhost:7000/shopping/app-events',{payload})
  // }