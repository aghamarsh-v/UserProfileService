const Mongoose = require("mongoose")

const localDB = 'mongodb+srv://2023mt93313:dbpass_123@bookmanagement.h2hjm.mongodb.net/bms_user_db?retryWrites=true&w=majority&appName=BookManagement'
const connectDB = async function () {
    await Mongoose.connect(localDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    
    console.log("Mongo DB connected")
};

module.exports = connectDB;