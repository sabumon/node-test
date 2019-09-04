const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const bcrypt = require('bcrypt');
const SALT_I = 10;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth');



const { User } = require('./models/user');

app.use(bodyParser.json());



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
            
               if(!user) res.json({message:'auth error, user not founrd'});
             //  res.status(200).send(user)

               bcrypt.compare(req.body.password, user.password,(err, isMatch)=>{
                   if(err) throw err;
                   res.status(200).send(isMatch);
               })

        })

})





const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Started at port ${port}`);
})