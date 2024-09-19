require('dotenv').config();
const jwt=require('jsonwebtoken');
const VerifyUser=(req,res,next)=>{
      const {authorization} = req.headers;
      try{
        const token=authorization.split(' ')[1];
        const decoded= jwt.verify(token,process.env.secret);
        const {id,username}=decoded;
        req.username=username;
        req.id=id;
        next();
      }
      catch{
        next("Auth Failure");
      }
};
module.exports=VerifyUser;