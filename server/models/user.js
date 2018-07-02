var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = require('mongodb').ObjectID

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.user.password);
};

//authenticate input against database
userSchema.statics.authenticate = function (email, password, callback) {
	UserModel.findOne({ username: email }).exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
		  var err = new Error('Password does not match');
          return callback(err);
        }
      })
    });
}


var UserModel = mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema);