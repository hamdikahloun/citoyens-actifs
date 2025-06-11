const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
  name: String,
  community: String,
  email: String,
  poste: String,
  token: String,
});

const User = mongoose.model('community', communitySchema);

module.exports = Community;