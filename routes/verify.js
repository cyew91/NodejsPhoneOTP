require('dotenv').config()
const express = require('express');
const router = express.Router();
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
});

router.get('/verify',(req,res)=>{
  res.render('verify');
});

router.post('/api/confirmotp', (req, res) => {
  // Checking to see if the code matches
  let pin = req.body.pin;
  let requestId = req.body.requestId;
  console.log('value of requestid in verify post handler is ' + requestId);
  console.log(pin);
  nexmo.verify.check({request_id: requestId, code: pin}, (err, result) => {
    if(err) {
      //res.status(500).send(err);
      res.render('status', {message: 'Server Error'});
    } else {
      console.log(result);
      // Error status code: https://docs.nexmo.com/verify/api-reference/api-reference#check
      if(result && result.status == '0') {
        //res.status(200).send('Account verified!');
        // res.render('status', {message: 'Account verified! 🎉'});
        res.json({ message: 'Account verified! 🎉', status: result.status  });
      } else {
        //res.status(401).send(result.error_text);
        res.json({ message: 'Wrong OTP! ❌', status: -1 });
      }
    }
  });
});


module.exports = router;
