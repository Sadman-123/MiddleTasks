const mongo=require('mongoose');
const Schem=new mongo.Schema(
    {
        user:String,
        task:String,
        created:Date
    }
);
const mod=mongo.model('todo',Schem,'todo');
module.exports=mod;