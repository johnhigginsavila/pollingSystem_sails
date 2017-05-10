/**
 * PollAnswer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	schema: true,
  attributes: {
		poll:{
			model:'poll',
			required:true
		},
        answer:{
          type:'string',
          required: true
        },
		vote:{
			collection: 'vote',
			via: 'pollAnswer'
		}
  }
};

