require('dotenv').config();
const db=require('./db/userdb')
const app=require('express')();
const cors=require('cors');
const bdy=require('body-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
app.use(cors());
app.use(bdy.json());
app.use(bdy.urlencoded({extended:true}));
app.post('/register',async(req,res)=>{
    const {username,password}=req.body;
    const user= await db.findOne({
        username:username
    });
    if(user)
    {
        res.status(400).send('Already exist')
    }
    else{
        bcrypt.hash(password, 10, async function(err, hash) {
            const newuser=new db({
                username:username,
                password:hash,
                createdtime:new Date().toUTCString()
            });
            await newuser.save()
            .then(()=>res.status(200).send('user created'))
            .catch(e=>console.log(e))
        });  
    }
})
app.listen(process.env.port,()=>{
    console.log('listening')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.findOne({
        username: username
    });
    if (user) {
        bcrypt.compare(password, user.password, async function (err, result) {
            if (result) {
                const token = await jwt.sign({
                    id: user._id,
                    username: user.username
                }, process.env.secret, { expiresIn: '2h' });
                return res.status(200).json({
                    msg: "Login Successful",
                    token: token,
                });
            }
            return res.status(404).send('Password not matched');
        });
    } else {
        res.status(404).send('No User Found');
    }
});
