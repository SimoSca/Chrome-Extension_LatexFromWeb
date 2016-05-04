// improve inherits
Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
} 


/**
 * usage:
 *
 * function Test(){
 * 		......
 * }
 *
 * function TestInehritClass(){
 *      ......
 * }
 *
 * TestInheritClass.inheritsFrom( Test );
 * TestInheritClass.prototype.setExtId = function(value){ return this.setProp(this.extKey, value);}
 */



function CopyToClipboard(){

	var _action = "EnomisCopyToClipboard";

	// background listen copy message
	this.backgroundListen = function(){

		chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
		    // console.log(arguments)
		    if (request.action == _action){
		      	document.addEventListener("copy", function(event){
		          	event.clipboardData.setData(/*mimetype*/'Text', request.text);
		          	event.preventDefault();
		          	// rimuovo questo specifico eventListener: in sostanza ogni handler viene eseguito solo una volta
		          	// questo remove con la terza opzione true, non funziona!
		          	// this.removeEventListener(e.type, arguments.callee);
		    	});
		     	document.execCommand("copy", false, null);
		    	sendResponse({'state': true, 'text': request.text});
		    }else{
		    	sendResponse({'state': false, 'action': _action, 'message': 'action unknown'});
		    }
		});
	}

	// copy text to clipboard
	this.copyText = function(textToCopy, callback){
		chrome.runtime.sendMessage({action: _action, text: textToCopy}, function(response) {
		          if(typeof callback === 'function') callback(response);
		});
	}

}



// can load and array of sources
function load_synch(extraSrcs){

	var srcs = [];

	if( extraSrcs && extraSrcs.length && extraSrcs.length > 0 ) srcs = srcs.concat(extraSrcs);

	var oBody = document.getElementsByTagName('body')[0];
	var oHead = document.getElementsByTagName('head')[0];


	var tmp = [];
	(function load_synch(){
		if(srcs.length <= tmp.length){ 
			window.enomis_loads_finish = true;
			return;
		}
		var idx = tmp.length;
		var s = srcs[idx];
		var ext =  s.substr(s.lastIndexOf('.')+1);
		tmp.push(s);

		if(ext == 'js'){
			var obj = document.createElement('script');
			obj.type = 'text/javascript';
			var attr = 'src';
			parent = oBody;	
		}else if(ext == 'css'){
			var obj = document.createElement('link');
			obj.rel = 'stylesheet';
			obj.type = 'text/css';
			var attr = 'href';
			parent = oHead;
		}
		
		obj.onload = function(){	load_synch();	}
		obj.onerror = function(){
			console.log('Error while loading : ' + s);
			window.enomis_loads_error = true;
		}
		obj[attr] = s;
		parent.appendChild(obj);
	})();

}


// see also css
function copied_box(o){

	var parent = o.parent || document.getElementsByTagName('body')[0];
	var iDiv = document.createElement('div');
	iDiv.className = o.class;
	iDiv.innerHTML = o.html;
	iDiv.style.position = o.position || 'fixed';
	iDiv.style.left = 0;
	iDiv.style.bottom = 0;
	
	parent.appendChild(iDiv);

	var tout = o.timeout || 2000;
	setTimeout(function(){
		parent.removeChild(iDiv);
	}, tout);

	return iDiv;
}


// monitor input text 
function enomis_throttle(f, delay){
    var timer = null;
    return function(){
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = window.setTimeout(function(){
            f.apply(context, args);
        },
        delay || 1000);
    };
}