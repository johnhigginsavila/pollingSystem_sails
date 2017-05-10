/**
 * VoteController
 *
 * @description :: Server-side logic for managing votes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index:function(req, res, next){
		Poll.find().populate('user').then(function(polls){
			if(!polls){
				return next();
			}else{
				res.view({polls: polls});
			}
		}).catch(function(err){
			return next(err);
		})
	},
  create:function(req, res, next){
    Vote.create({poll:req.body.poll, pollAnswer:req.body.pollAnswer, user:req.session.User.id}).then(function(vote){
      console.log(vote);
      res.view({vote:vote});
    }).catch(function(err){
      return next(err);
    }) 
  }
};

