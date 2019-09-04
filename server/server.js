const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const cookieParser = require('cookie-parser');

const bcrypt = require('bcrypt');
const SALT_I = 10;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth');



const { User } = require('./models/user');
const {auth} = require('./middleware/auth');


app.use(bodyParser.json());
app.use(cookieParser());


app.post('/api/user',(req,res)=>{
     
      const user = new User({
          email:req.body.email,
          password:req.body.password
      });

      user.save((err,doc)=>{
          if(err) res.status(400).send(err)
          res.status(200).send(doc)
      })
      
})


app.post('/api/user/login',(req,res)=>{

        User.findOne({'email':req.body.email},(err,user)=>{
            
               if(!user) res.json({message:'auth error, user not founrd'})
             //  res.status(200).send(user)

            //    bcrypt.compare(req.body.password, user.password,(err, isMatch)=>{
            //        if(err) throw err;
            //        res.status(200).send(isMatch);
            //    })
              
               user.comparePassword(req.body.password,(err,isMatch)=>{
                     if(err) return err;
                     if(!isMatch) return res.status(400).json({
                          message : 'Wrong password'
                     });

                    // res.status(200).send(isMatch);
                    
                     user.generateToken((err,user)=>{
                        if(err) return res.status(400).send(err);
                        res.cookie('auth',user.token).send('ok');
                     })


               })
        })

})


app.get('/user/profile',auth,(req,res)=>{

    // let token = req.cookies.auth;
    //  //console.log(token);

    
    //  User.findByToken(token,(err,user)=>{
        
    //     // console.log(user);
    //       if(err) throw err;
    //       if(!user) return res.status(401).send('No access');

    //       res.status(200).send('you have access to this page');
       
    //  });


    //res.status(200).send('Ok');

    res.status(200).send(req.token);
})


const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Started at port ${port}`);
})