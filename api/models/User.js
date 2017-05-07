/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {
  schema: true,
  attributes: {
    email:{
      type: 'string',
      required: true,
      unique: true,
      email: true
    },
    encryptedPassword:{
      type: 'string'
    },
    firstname:{
      type: 'string'
    },
    lastname:{
      type: 'string'
    }
  },
  beforeCreate: function(values, next){
    if(!values.password || values.password != values.confirmation){
      return next({err:["Password doesn't match password confirmation."]});
    }else{
      bcrypt.hash(values.password, 10).then(function(encryptedPassword){
        values.encryptedPassword = encryptedPassword;
        next();
      }).catch(function(err){
        return next(err);
      })
    }
  }
};

