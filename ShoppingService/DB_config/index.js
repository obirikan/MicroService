
const mongoose = require('mongoose');

const dbcon =async() => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log(' Connected to shopping db')
        
    } catch (error) {
        console.log('Error ============')
        console.log(error);
        process.exit(1);
    }
 
};

module.exports = {dbcon}