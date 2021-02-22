require('dotenv').config()
const express = require('express');
const router = express.Router();
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
});


router.post('/api/registrationotp', (req, res) => {
  // A user registers with a mobile phone number
  let phoneNumber = Number(req.body.number);
  let message = "OTP";
  
  console.log(req.body);
  console.log(phoneNumber);
  // res.json({ requestId: "requestId", status: "0"  });
  nexmo.verify.request({number: phoneNumber, brand: message}, (err, result) => {
    if(err) {
      //res.sendStatus(500);
      res.render('status', {message: 'Server Error'});
    } else {
      console.log(result);
      let requestId = result.request_id;
      if(result.status == '0') {
        res.json({ requestId: requestId, status: result.status  });
      } else {
        // res.status(401).send(result.error_text);
        // res.render('status', {message: result.error_text, requestId: requestId});
        // return -1;
        res.json({ requestId: requestId, status: result.status, message: result.error_text  });
      }
    }
  });
});


module.exports = router;
