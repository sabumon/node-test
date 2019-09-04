const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const SALT_I = 10;

const jwt = require('jsonwebtoken');


//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/auth');


const userSchema = mongoose.Schema({
      email:{
          type:String,
          required:true,
          trim:true,
          unique:1
      },
      password:{
          type:String,
          required:true,
          minlength:6
      },
      token:{
          type:String
      }
});



userSchema.pre('save',function(next){
    
       var user=this;  /// get all schema and values into this filed

           if(user.isModified('password')){

            bcrypt.genSalt(SALT_I,(err,salt)=>{

                if (err) return next(err);
            
                bcrypt.hash(user.password,salt,(err,hash)=>{
            
                    if (err) return next(err);
                
                    user.password = hash;
                    next();
            
                })
        
            })

   }else{
       next();
   }


})


userSchema.methods.comparePassword = function(candidatePassword, cb){

     bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })


}


userSchema.methods.generateToken = function(cb){
    var user = this;
    const secretWord = 'Shb';
    var token = jwt.sign(user._id.toHexString(),secretWord);

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user)
    })
}


userSchema.statics.findByToken = function(token,cb){
    const user = this;
    const secretWord = 'Shb';
    
    jwt.verify(token,secretWord, function(err,decode){

        user.findOne({"_id":decode,"token":token}, function(err,user){
               
                 if(err) return cb(err);
                 cb (null, user);
                   
        })

    });
}






const User = mongoose.model('User', userSchema)

module.exports = { User }