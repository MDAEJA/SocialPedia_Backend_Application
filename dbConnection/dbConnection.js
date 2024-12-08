// db connection

const dotenv = require('dotenv');
const mongoose = require("mongoose");
dotenv.config({path:"./config.env"});
const Monggose_url =  process.env.MONGOOSE_URL;

const dbConnection = async()=>{
 await  mongoose.connect(Monggose_url).then(()=>{
    console.log("Data Base Connected Successfully !!!")
   }).catch((err)=>{
    console.log(err)
   })
}

module.exports = dbConnection;