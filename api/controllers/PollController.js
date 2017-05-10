/**
 * PollController
 *
 * @description :: Server-side logic for managing polls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new':function(req, res, next){
		res.view();
	},
	index:function(req, res, next){
		Poll.find({user : req.session.User.id}).populate('user').then(function(polls){
          //console.log(polls);
			if(!polls){
				return next();
			}else{
              
				res.view({polls: polls});
			}
		}).catch(function(err){
			return next(err);
		})
	},
	create: function(req, res, next){
		Poll.create({user:req.session.User, pollQuestion: req.body.pollquestion})
          .then(addAnswer)
          .then(function(result){
          res.redirect('/poll')
        }).catch(function(err){
          console.log(err);
          req.session.flash ={err:err};
        })
      
      function addAnswer(poll){
        var promise = new Promise(function(resolve, reject){
           var data = {
            poll: poll,
            pollAnswer: []
          }
          var ans = [];
          function answer(item, index, array){
            PollAnswer.create({poll:data.poll, answer:array[index]}).then(function(answer){
              ans.push(answer);
            }).catch(function(err){
              return next(err);
            })
            return(answer);
          }
          var myAnswer = req.body.answer;
          console.log(myAnswer);
          myAnswer.forEach(answer);
          data.pollAnswer = ans;
          resolve(data);
          
        })
        return promise;
      }
	},
    show:function(req, res, next){
      Poll.findOne({id:req.param('id')})
        .populate('pollAnswer',{poll:req.param('id')})
        .populate('vote',{poll:req.param('id')})
        .populate('user').then(findPollAnswerAndVote)
        .then(function(poll){
        return poll;
      }).then(checkIfVoted)
        .then(function(poll){
				console.log(poll);
        //res.send(poll);
        res.view({poll:poll})
      }).catch(function(err){
        res.send(err);
      })
      function findPollAnswerAndVote(poll){
        var promise = new Promise(function(resolve, reject){
          /*PollAnswer.find({poll:poll.id}).populate('vote').then(function(pollAnswer){
            poll.result = pollAnswer[0];
            resolve(poll);
          }).catch(function(err){
            reject(err);
          })*/
					
					var result = [];
					function getResult(item, index, array){
						Vote.count({pollAnswer: array[index].id}).then(function(count){
							array[index].result = count;
						}).catch(function(err){
							return next(err);
						})
					}
					poll.pollAnswer.forEach(getResult);
					resolve(poll);
        })
        return promise;
      }
      function checkIfVoted(poll){
        var promise = new Promise(function(resolve, reject){
          Vote.findOne({poll:poll.id, user:req.session.User.id}).then(function(vote){
            if(!vote){
              poll.isVoted = false;
            }else{
              poll.isVoted = true;
            }
            resolve(poll);
          }).catch(function(err){
            console.log(err);
            reject(err);
          })
          
        })
        return promise;
      }
    }
};

