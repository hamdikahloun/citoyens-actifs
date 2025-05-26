var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//nouveau compte
router.post('/signup', (req, res) => {
  /*if (!checkBody(req.body, ['userName', 'name', 'email'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }*/

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null) {
      //const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        userName: req.body.username,
        name:  req.body.name,
        email: req.body.email,
        token: uid2(32),        
      });      

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {      
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

module.exports = router;
