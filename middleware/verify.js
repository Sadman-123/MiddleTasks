require('dotenv').config();
const jwt=require('jsonwebtoken');//so token will be like Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWMyMWQ3ZjE0ZjAyZDMxOGVhMmY3NCIsInVzZXJuYW1lIjoic2FkbWFuIiwiaWF0IjoxNzI2NzUxMjA5LCJleHAiOjE3MjY3NTg0MDl9.5Rz_DKguYYMRqN4bfu1NosuE3tZOI4ku5tljSAinZIA
const AuthenticateUser=(req,res,next)=>{
    const {authorization}=req.headers;
    try{
        const token=authorization.split(" ")[1];
        const decoded=jwt.verify(token,process.env.secret);
        const {username,id}=decoded;
        req.username=username;
        req.id=id;
        next();
    }
    catch{
        next("Auth Error");
    }
}
module.exports=AuthenticateUser;