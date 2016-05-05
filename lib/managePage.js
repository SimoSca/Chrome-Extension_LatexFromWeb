function managePage(globalObj){

	var __me = this;

	// load simple style
	this.loads = [chrome.extension.getURL('style/style.css')];
	load_synch(this.loads)

	// globals
	this.g = globalObj;

	this.init =  function(){
		var selectors = this.g.selectors;
		var latexEls = document.querySelectorAll(selectors);

		// send command to update badge number
		chrome.runtime.sendMessage({action: 'setBadgeText', text: latexEls.length.toString()});


		for(var i in latexEls){
			var el = latexEls[i];
			if(typeof (el || {}).addEventListener === 'function'){
				el.addEventListener("mouseover", this.hoverLatex);
				el.addEventListener("mouseout", this.outLatex);
				el.addEventListener('click', this.copyToClipboard);
			} 
		}

	}


	this.copyToClipboard = function(){
		var text = this.getAttribute(__me.g.getLatex).trim();
		// console.log(text)
		text = text.replace(/\\,\\!$/, '');
		// console.log('make copy of: ' + text)
		var html = '';
		__me.g.copy.copyText(text, function(r){
			// console.log(r)
			if(r.state){
				html = 'Latex Copied:<br/>' + r.text;
			}else{
				html = 'Error while copying Latex code, sorry.';
			}
			var el = copied_box({html: html, 'class': __me.g.responseClass});
		});
	}


	this.outLatex = function(){
		// remove stored copy buttons (ususally one)
		var i = __me.g.copyEls.length;
		while(i--){
			var el = __me.g.copyEls[i];
			__me.g.copyParent.removeChild(el);
			__me.g.copyEls.splice(i, 1);
		}
	}


	this.hoverLatex = function(){

		// set style to append element
		var pos = fixedPosition(this);
			
		var iDiv = document.createElement('div');
		iDiv.className = __me.g.copyClass;
		iDiv.innerHTML = 'Copy Latex';
		iDiv.style.position = 'absolute';
		var top = (__me.g.hoverPosition || {}).top || 0 ;
		var left = (__me.g.hoverPosition || {}).left || 0 ;
		iDiv.style.left = pos.left - left + 'px';
		iDiv.style.top = pos.top - top + 'px';
		__me.g.copyParent.appendChild(iDiv);
			
		// store to delete onmouseout
		__me.g.copyEls.push(iDiv);
	}




	// start when ready: positioned on bottom to load each this.prop as variable
	this.initT = new Date();
	this.attendReady = function(){
		var _me = this;
		var deltaT = new Date() - this.initT;
		// console.log(deltaT)
		// retry for 5 minutes
		if(document.readyState === 'complete' || deltaT > 300000){
			_me.init();
		}else{
			setTimeout(function(){ _me.attendReady();	}, 	1000);
		}
	};
	// immediate execution
	this.attendReady();


	// absolute position respect to body: then i append element to body with absolute attr
	function fixedPosition (element){
		var bodyRect = document.body.getBoundingClientRect(),
		    elemRect = element.getBoundingClientRect();
		var fixed = {
			top: elemRect.top - bodyRect.top,
			left: elemRect.left - bodyRect.left
		}
		return fixed;
	}

}