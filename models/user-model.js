const mongoose = require('mongoose');
const crypto = require('crypto'); // password hashing
const uuidv1 = require('uuid/v1'); // unique

const Schema = mongoose.Schema


const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    trim: true,
  },
  salt: String,
  role: {
    type: Number,
    default: 0 // 1 for admin
  },
  history: { // purchase history
    type: Array,
    default: []
  }
},
{
  timestamps: true
});


// Virtual field
userSchema.virtual('password')
.set(function(password) {
  this._password = password;
  this.salt = uuidv1();
  this.hashed_password = this.encryptPassword(password);
})
.get(function() {
  return this._password;
})

// Schema Methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function(password) {
    if(!password) return '';

    try {
      return crypto
          .createHmac('sha1', this.salt)
          .update(password)
          .digest('hex');
    } catch(err) {
        return '';
      }
  }
};


const User = mongoose.model('User', userSchema);
module.exports = User;