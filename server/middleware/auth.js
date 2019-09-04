const {User} = require('./../models/user');

let auth = (req,res,next)=>{

    let token = req.cookies.auth;
    //console.log(token);
   
    User.findByToken(token,(err,user)=>{
       
       // console.log(user);
         if(err) throw err;
         if(!user) return res.status(401).send('No access');

         req.token= token;
         next();
      
    });

}

module.exports = { auth }