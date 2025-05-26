const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: String,
  name: String,
  email: String,
  token: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;