const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
      username: {type: String, required: true, unique: true, lowercase: true},
      name: {type: String, required: true},
      email: {type: String, required: false, unique: false, lowercase: true},
      password: {type: String, required: true, select: false},
      datecreated: {type: Date, default: Date.now}

});

UserSchema.pre('save', function (next){
      
      const user = this;
      const saltRounds = 10;

      if(!user.isModified('password')) return next();

      let salt = bcrypt.genSaltSync(saltRounds);
  
      let hash = bcrypt.hashSync(user.password, salt);

      user.password = hash;

      next();

});

/*
UserSchema.pre('save', function (next){
      
      const user = this;
      const saltRounds = 10;

      if(!user.isModified('password')) return next();

      bcrypt.hash(user.password, saltRounds).then(function(hash) {
           user.password = hash;
        });
});*/

module.exports = mongoose.model('Users', UserSchema);