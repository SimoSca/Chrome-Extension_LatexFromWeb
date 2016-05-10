var $check = $('[type="checkbox"]');


$check.on('change', function(){
	var $last = '';
	var count = 0;
	$check.each(function(){
		$(this).parent().toggleClass('viewed', false);
		$(this).parent().toggleClass('last', false);
		if($(this).get(0).checked){
			$(this).parent().toggleClass('viewed', true);
			$last = $(this).parent();
			count++;
		}
	});
	$last.toggleClass('last', true);
	var th2 = (count === $check.length);
	if(!th2) return;
	setTimeout(function(){
		$check.parents().toggleClass('last', false);
		$('h2').toggleClass('finish', th2);
	}, 3000);

})