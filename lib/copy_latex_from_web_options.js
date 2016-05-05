// globals

_g = {};

function manage_init(){

	// prevent to reload page
	$('form').on('submit', function(e){
		e.preventDefault();
		e.stopPropagation();
	});

	var _me = this;

	// first time
	this.active = '-active';
	this.activeS = 'sidebar' + this.active;
	this.activeC = 'content' + this.active;

	this.$submit = $('#save');

	//*********** switch interface 
	this.setActiveContent = function(){
		// azione per ogni link attivo
		$('.'+this.activeS).each(function(){
			// devo avere un solo content, pertanto rimuovo tutti gli altri
			$('.'+_me.activeC).toggleClass(_me.activeC, false);
			var id = $(this).attr('id');
			var contentId = '#' + id.replace("view_", "content_");
			$(contentId).toggleClass(_me.activeC, true);
		});
	}
	this.setActiveContent();

	$('#sidebar ul li').on('click', function(){
		// le rimuovo tutte, ma la appendo a questa cliccata
		$('.' + _me.activeS).toggleClass(_me.activeS, false);
		$(this).find('[id^="view_"]').toggleClass(_me.activeS, true);
		_me.setActiveContent();
	});
	//*********** end switch interface
	
	// retrieve data from storage and set in form
	$('[data-storage-key]').each(function(){
		var key = $(this).attr('data-storage-key');
		var prop = 'seT' + key;
		_g.form[prop]({action: 'set'});
	});

	// action on save
	$('#save').on('click', function(){
		var dfrArray = [];
		$('fieldset').each(function(){
			var key = $(this).attr('data-storage-key');
			var prop = 'seT' + key;
			dfrArray.push( _g.form[prop]({action: 'save'}) );
		});

		//  if one request fails, the entire chain fails
		$.when.apply($, dfrArray).then(function(){ 
				var Jel = $('<div/>', {
					'class': 'advise-ok',
					'html': 'Options saved succesfully.'
				});
				_me.$submit.after(Jel);
				Jel.delay(1000).fadeOut(2000, function(){
					$(this).remove();
				})
			},
			function(rej){ console.log(rej);}
		);
	});


}


function ManageForm(action){

	// save monitor data or fill the form
	this.seTmonitor = function(o){
		var monitor = {};
		var attr = 'data-monitor-key';
		var ret;
		$('input['+attr+']').each(function(){
			var key = $(this).attr(attr);
			console.log(key)
			if(o.action == 'set'){
				var _that = $(this);
				_g.store.getProp('monitor').then(function(res){
					console.log(res);
					console.log(key)
					_that.prop('checked', res.value[key] );
				});
				ret = true;
			}else if(o.action == 'save'){
				monitor[key] = $(this).prop('checked');
				ret = _g.store.setProp('monitor', monitor);
			}
		});
		return ret;
	}


}



$(function(){
	_g.store = new SettingsStorage();
	_g.form = new ManageForm();
	_g.init = new manage_init();
});
