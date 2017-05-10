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
      type: 'string',
			required: true
    },
    lastname:{
      type: 'string',
			required: true
    },
    admin:{
      type:'boolean',
      defaultsTo: false
    },
    online:{
      type: 'boolean',
      defaultsTo: false
    },
		poll:{
			collection:'poll',
			via: 'user'
		},
		vote:{
			collection: 'vote',
			via: 'user'
		}
  },
  toJSON: function(){
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
  },
	beforeValidate: function(values, next){
    console.log(values);
    if(typeof values.admin !== 'undefined'){
      if(values.admin === 'unchecked'){
        values.admin = false;
      }else if (values.admin[1] === 'on'){
        values.admin = true;
      }
      next();
    }else{
      next();
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

