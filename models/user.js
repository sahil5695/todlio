var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
require('./articles')

var userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,unique:true,required:true},
    email:{type:String,unique:true,required:true},
    article:[{ type:mongoose.Schema.Types.ObjectId , ref: 'Article'}],
    hash:String,
    salt:String
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    name: this.name,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'A_Filthy_Dark_secret');
};

mongoose.model("User",userSchema);