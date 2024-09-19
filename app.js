require('dotenv').config();
const app=require('express')();
const bdy=require('body-parser');
const cors=require('cors');
const jwt=require('jsonwebtoken');
app.use(bdy.json());
app.use(bdy.urlencoded({extended:true}));
app.use(cors());
const bcrypt=require('bcrypt');
const userdb=require('./db/userdb')
app.post('/registration',async (req,res)=>{
    const uname=req.body.username;
    const pass=req.body.password;
    const user=await userdb.findOne({username:uname});
   try{
        if(user)
        {
           res.status(401).send("user Already exists") 
        }
        else{
            bcrypt.hash(pass, 10, async function(err, hash) {
                const newuser=new userdb({
                    username:uname,
                    password:hash,
                    createdtime:new Date().toUTCString()
                });
                await newuser.save()
                .then(()=>{
                    res.status(200).json({
                        "create":true,
                        "username":uname,
                        "password":hash
                    })
                })
                .catch(err=>res.status(401).send('Error while creating user'))
            });
        }
   }
   catch(e)
   {
    console.log(e)
   }

    
})
app.listen(process.env.port,()=>{
    console.log('listening')
})

app.post('/login',async(req,res)=>{
    const uname=req.body.username;
    const pass=req.body.password;
    const user=await userdb.findOne({username:uname});
    if(user){
        bcrypt.compare(pass, user.password, function(err, result) {
            if(result)
                {
                    const token=jwt.sign({id:user._id,username:user.username},process.env.secret,{expiresIn:'2h'})
                    res.status(200).json({
                        login:true,
                        token:token
                    })
                }
                else
                    {
                        res.status(401).send("Password Dont Match")
                    } 
        });
    }
    else{
        res.status(401).send("User Not Exists")
    }

})
