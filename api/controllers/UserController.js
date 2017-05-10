/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new':function(req, res, next){
      res.view();
    },
  index:function(req, res, next){
    User.find().then(function(users){
      if(!users){
        return next();
      }else{
        res.view({users:users});
      }
      
    }).catch(function(err){
      return next(err);
    })
    
  },
  create:function(req, res, next){
   
    checkUserInstance(req.body)
      .then(createUser)
      .then(logUserIn)
      .then(updateUser)
      .then(function(user){
      res.redirect('/user/show/'+user.id);
    }).catch(function(err){
        req.session.flash = {
            err : err
        }
				console.log(err);
        res.redirect('/user/new/');
    })
    function checkUserInstance(data){
      var promise = new Promise(function(resolve, reject){
        User.count().then(function(count){
          if(count == 0){
            data.admin = true;
          }else{
            data.admin = false;
          }
          resolve(data);
        }).catch(function(err){
          var checkUserInstanceError = [{name:'checkUserInstanceError', message: 'Unable to check instance of a user', err:err}]
          reject(checkUserInstanceError);
        })
      })
      return promise;
    }
    function createUser(data){
      var promise = new Promise(function(resolve, reject){
        User.create(data).then(function(user){
          resolve(user);
        }).catch(function(err){
          var createUserError = [{name:'createUserError', message:'Unable to create user at this time.', err:err}]
          reject(createUserError);
        })
      })
      return promise;
    }
    function logUserIn(user){
      var promise = new Promise(function(resolve, reject){
        if(!user){
          var logUserInError = [{name:'logUserInError', message:'Unable to log in user'}]
          reject(logUserInError);
        }else{
          req.session.authenticated = true;
		  req.session.User = user;
          resolve(user);
        }
      })
      return promise;
    }
		function updateUser(user){
			var promise = new Promise(function(resolve, reject){
                User.update({id: user.id}, {online: true}).then(function(user){
                    user = user[0];
                    resolve(user);
                }).catch(function(err){
                    var updateUserError = [{name: 'updateUserError', message:'Unable to update user to login', err:err}]
                    reject(updateUserError);
                })
			})
			return promise;
		}
		/*function publishOnlineUser(user){
			var promise = new Promise(function(resolve, reject){
				User.publishCreate({
					id:user.id,
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email,
					admin: user.admin,
					online: user.online
				});
				resolve(user);
			})
			return promise;
		}*/
  },
  show: function(req, res, next){
    User.findOne(req.param('id')).then(function(user){
      if(!user){
        return next()
      }else{
        res.view({user: user})
      }
    }).catch(function(err){
      return next(err);
    })
  },
	edit:function(req, res, next){
		User.findOne(req.param('id')).then(function(user){
			if(!user){
				return next();
			}else{
				res.view({user:user});
			}
		}).catch(function(err){
			var findOneError = [{name: 'findOneError', message:'Unable to query at this time', err:err}]
			return next(findOneError);
		})
	},
	//process the info from edit view
    update : function(req, res, next){
      if(req.session.User.admin){
        var userObj = {
          name : req.param('name'),
          title : req.param('title'),
          email : req.param('email'),
          admin : req.param('admin')
        }
      }else{
        var userObj ={
          name : req.param('name'),
          title : req.param('title'),
          email : req.param('email')
        }
      }
      User.update(req.param('id'), userObj)
        .then(function(result){
        res.redirect('/user/show/' + req.param('id'));
      }).catch(function(err){
				console.log(err);
        res.redirect('/user/edit/'+req.param('id'));
      })
    },
    destroy : function(req, res, next){
      findUser(req.param('id'))
        .then(destroyUser)
        .then(function(result){
        res.redirect('/user');
      }).catch(function(err){
        return next(err);
      })
      function findUser(param){
        var promise = new Promise(function(resolve, reject){
          User.findOne(param).then(function(user){
            if(!user){
              reject('User doesn\'t exist.' );
            }else{
              resolve(param);
            }
          }).catch(function(err){
            reject(err);
          })
        })
        return promise;
      }
      function destroyUser(param){
        var promise = new Promise(function(resolve, reject){
          User.destroy(param).then(function(result){
            resolve(result);
          }).catch(function(err){
            reject(err);
          })
        })
        return promise;
      }
    },
	subscribe: function(req, res){
    User.find().then(function(users){
			res.send(users);
		}).catch(function(err){
			res.send(err);
		})
  }
};

