require('dotenv').config();
const mongoose=require('mongoose');
mongoose.connect(process.env.mongourl);
const Schem=new mongoose.Schema(
    {
        username:String,
        password:String,
        createdtime:Date
    }
);
const mod=mongoose.model('user',Schem,'user');
module.exports=mod;