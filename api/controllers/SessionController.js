/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt');
module.exports = {
	'new':function(req, res, next){
      res.view();
    },
  create:function(req, res, next){
    //get input, validate user, validate password, log user in, render view
    requireEmailAndPassword()
      .then(validateEmail)
      .then(validatePassword)
      .then(logUserIn)
      .then(updateUser)
      .then(function(data){
      if(!req.session.User.admin){
        res.redirect('/user/show/'+data.user.id);
      }else{
        res.redirect('/user');
      }
    }).catch(function(err){
      req.session.flash = {err: err}
      res.redirect('/session/new');
    })
    function requireEmailAndPassword(){
      var promise = new Promise(function(resolve, reject){
        if(!req.param('email') || !req.param('password')){
          var requireEmailAndPasswordError = [{name:'requireEmailAndPassword', message:'Please input your password and email to continue..'}]
          reject(requireEmailAndPasswordError);
        }else{
          var data = {
            email:req.param('email'),
            password: req.param('password')
          }
          console.log(data);
          resolve(data);
        }
      })
      return promise;
    }
    function validateEmail(data){
      var promise = new Promise(function(resolve, reject){
        User.findOneByEmail(data.email)
          .then(function(user){
          if(!user){
            console.log(user);
            var validateEmailError = [{name: 'validateEmailError', message:'Email '+data.email+' is not registered'}]
            reject(validateEmailError);
          }else{
            data.user = user;
            resolve(data);
          }
        }).catch(function(err){
          reject({err:'findUserError'});
        })
      })
      return promise;
    }
    function validatePassword(data){
      var promise = new Promise(function(resolve, reject){
        bcrypt.compare(data.password, data.user.encryptedPassword).then(function(res){
          if(!res){
            var passwordMismatchError = [{name:'passwordMismatchError', message:'Invalid email and password combination'}]
            reject(passwordMismatchError);
          }else{
            resolve(data);
          }
        }).catch(function(err){
          reject({err:'comparePasswordError'});
        })
      })
      return promise;
    }
    function logUserIn(data){
      var promise = new Promise(function(resolve, reject){
        if(data.user){
          req.session.authenticated = true;
          req.session.User = data.user;
          resolve(data);
        }else{
          var userLoginError = [{name:'userError', message:'There is a error in logging the user'}]
          reject(userLoginError);
        }  
      })
      return promise;
    }
    function updateUser(data){
        promise = new Promise(function(resolve, reject){
          User.update({id:data.user.id},{online: true})
            .then(function(user){
		    data.user = user[0];
            resolve(data);
          }).catch(function(err){
            var updateUserError = [{name:'updateUserError', message:'Unable to update user: '+user.name,err:err}]
            reject(updateUserError);
          })
        })
        return promise;
      }
		/*function publishUserUpdate(data){
			promise = new Promise(function(resolve, reject){
				User.publishUpdate(req.session.User.id,{online:data.user.online});
				resolve(data);
			})
			return promise;
		}
		function informOtherSockets (data){
      var promise = new Promise(function(resolve, reject){
         //Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
        User.publishUpdate(data.user.id,{
					online: true, id: data.user.id, name:data.user.name, action:' has logged in'
				}, req,{
					previous:{
						online: data.user.online
					}
				});
          resolve(data);
      })
      return promise;
    }*/
  },
	destroy:function(req, res, next){
		updateUserToLogout(req.session.User)
			.then(logUserOut)
			.then(function(user){
			res.redirect('/');
		}).catch(function(err){
			return next(err);
		})
		function updateUserToLogout (user){
			var promise = new Promise(function(resolve, reject){
				User.update({id:user.id},{online: false}).then(function(user){
					resolve(user[0]);
				}).catch(function(err){
					var updateUserToLogoutError = [{name: 'updateUserToLogoutError', message:'Unable to update user to log out'}]
					reject(updateUserToLogoutError);
				})
			})
			return promise;
		}
		function logUserOut(user){
			var promise = new Promise(function(resolve, reject){
				req.session.authenticated = false;
				req.session.User = {};
				resolve(user);
			})
			return promise;
		}
	}
	
};

