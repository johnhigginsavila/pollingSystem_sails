
$(document).ready(function(){
	var counter = 3;
	$('#addPollAnswer').click(function(){
		if(counter < 6){
			$('#'+counter).append('<section class="form-group"><input type="text" class="form-control" placeholder="answer'+counter+'" name="answer['+(counter-1)+']" id="answer'+counter+'"></section><span id="'+(counter+1)+'"></span>');
			counter++;
		}else{
			$("#addPollAnswer").addClass("disabled");
		}

	});
});
