$(document).ready(function(){
	// Validate
	//http://bassistance.de/jquery-plugins/jquery-plugin-validation/
	//http://docs.jquery.com/Plugins/Validation/
	//http://docs.jquery.com/Plugins/Validation/validate#toptions
	
	jQuery(function($){
		$('#sign-up-form').validate({
			rules:{
				name:{
					required: true
				},
				email:{
					required:true,
					email:true
				},
				password:{
					minlength:4,
					required: true
				},
				confirmation:{
					minlength:4,
					required: true,
					equalTo: '#mypassword'
				}
			},
			success: function(element){
				element
					.text('OKAY').addClass('valid');
			}
		});
	})	
});