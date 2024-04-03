const jwt=require('jsonwebtoken')
let  APP_SECRET='savetheworld'
const axios=require('axios')
const amqplib=require('amqplib')
let EXCHAGE_NAME="online_shopping"
let BROKER_URL=process.env.BROKER_URL

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

  //at first using webhooks
  module.exports.PublishCustomerEvents=async(payload)=>{
      axios.post('http://localhost:7000/customer/app-events',{payload})
  }

  module.exports.PublishShoppingEvents=async()=>{
     axios.post('http://localhost:7000/shopping/app-events',{payload})
  }

  module.exports.CreateChannel=async()=>{
    try {
      const connection=await amqplib.connect(BROKER_URL)
      const channel=await connection.createChannel()
      await channel.assertExchange(EXCHAGE_NAME,'direct',false)
      return channel
    } catch (error) {
        throw error
    }
  }

  module.exports.PublishMessage=async(channel,binding_key,message)=>{
     try {
       await channel.publish(EXCHAGE_NAME,binding_key,Buffer.from(message))
     } catch (error) {
       throw error
     }
  }

  module.exports.SubscribeMessage=async(channel,service,binding_key)=>{

    try {
      const appQueue=await channel.assertQueue(QUEUE_NAME)

      channel.bindQueue(appQueue.queue,EXCHAGE_NAME,binding_key)

      channel.consume(appQueue.queue,data=>{
        console.log('recieved data')
        console.log(data.content.toString())
      })
    } catch (error) {
      
    }
  }
  
