const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// bcrypt.genSalt(10,(err,salt)=>{

//     if (err) return next(err);

//     bcrypt.hash('pasword123',salt,(err,hash)=>{

//         if (err) return next(err);
      
//          console.log(hash);

//     })

   
// })


const userId = 1000;
const secretWord = 'Shb';

const token = jwt.sign(userId,secretWord);
const receivedToken = 'eyJhbGciOiJIUzI1NiJ9.MTAwMA.1_lWBq-2L3jMwEN0f0Nfmd0yfo3xmeYqQ9CGUXE4-4E';

console.log(token);

const decodeToken = jwt.verify(receivedToken,secretWord);

console.log(decodeToken);