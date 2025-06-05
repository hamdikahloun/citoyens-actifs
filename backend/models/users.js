const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  city: String,
  token: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;