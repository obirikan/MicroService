const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
let  APP_SECRET='savetheworld'
const amqplib=require('amqplib')
let EXCHAGE_NAME="online_shopping"
let BROKER_URL=process.env.BROKER_URL
let QUEUE_NAME='CustomerQ'

module.exports.GenerateSalt=async()=>{
    return await bcrypt.genSalt()
}


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

module.exports.GeneratePassword=async(password,salt)=>{
    return await bcrypt.hash(password, salt);
}

module.exports.GenerateSignature = async (payload) => {
    try {
      return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  
  module.exports.ValidatePassword = async (
    enteredPassword,
    savedPassword,
    salt
  ) => {
    return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
  };

  module.exports.FormateData = (data) => {
    if (data) {
      return { data };
    } else {
      throw new Error("Data Not found!");
    }
  };


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


  module.exports.SubscribeMessage=async(channel,service)=>{
    try {
      let binding_key='customer_service'
      const appQueue=await channel.assertQueue(QUEUE_NAME)

      channel.bindQueue(appQueue.queue,EXCHAGE_NAME,binding_key)

      channel.consume(appQueue.queue,data=>{
        console.log('recieved data')
        console.log(data.content.toString())
        service.SubscribeEvents(JSON.parse(data.content.toString()))
        channel.ack(data)
        
      })
    } catch (error) {
      
    }
  }
  
