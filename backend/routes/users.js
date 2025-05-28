var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* GET users listing. */
router.get('/:username', function (req, res) {
  console.log(req.params.username);
  User.findOne({ username: req.params.username }).then(data => {
      if (data) {
        res.json({ result: true, message: 'connected' });
      } else {
        res.json({ result: false, error: 'unknown username' });
      }
    });
});

//nouveau compte
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'name', 'email'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  if (!EMAIL_REGEX.test(req.body.email)) {
    res.json({ result: false, error: 'invalid email' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null) {
      //const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        name: req.body.name,
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
