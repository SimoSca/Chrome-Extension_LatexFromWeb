// from classes.js: listen to copy the text via injected script
var _g = {
    copy: new CopyToClipboard(),
    store: new SettingsStorage(),
    regex: {
		wikipedia: new RegExp( '^https?:\/\/[^\/]+wikipedia.org' ,'i'),
		wolfram: new RegExp('^https?:\/\/mathworld.wolfram.com', 'i'),
		instructure: new RegExp('^https?:\/\/.*.instructure.com', 'i'),
	}
}

// init copy listening
_g.copy.backgroundListen();


// retry storage values (or defaults) and then start
_g.store.getAll().always(function(r){
    _g.settings = r;
    init();
});


function init(){
    // azione all'aggiornamento di una pagina:
    chrome.tabs.onUpdated.addListener(tabs_check);
}


// when settings are updated reload matching tabs to apply changes
_g.store.onChange(function(changes){
	_g.settings = changes.newValue;
	// now update all matching tabs
	chrome.tabs.query({}, function(tabAr){
		tabAr.map(function(tb){
			var match = false;
			tb.url = tb.url || '';
			for(var j in _g.regex){	if( tb.url.match(_g.regex[j]) ) match = true; };
			if(match) chrome.tabs.reload(tb.id);
		});
	});
})

// naturalmente posso svolgere degli if in base al tipo di caricamento
function tabs_check(id, info, tab){
	// questo script si avvia quando info.status e' loading che quando e' complete!
	// logs in background page
	// console.log(id) // test
	// console.log(info)
	// console.log(tab)
    
    // check if monitor or not the page
    var monitor = _g.settings.monitor; 
	
	if( info.status === 'complete'){
		
		var match = false;
		var url = tab['url'];
		var chromeUrl = false;
		// console.log(url)

		if(typeof url === 'undefined') return;

		var inj = ["lib/classes.js", "lib/managePage.js"];

		// gli url come chrome-extension creano problemi di accesso
		// visto che attualmente non mi servono, li ignoro
		if(url.match( /^chrome.*:\/\//i ) ){
			console.log('url matchante: ' + url);
			chromeUrl = true;
			return;
		}

		if( monitor.wikipedia && url.match( _g.regex.wikipedia )){
			// NB: l'ordine di caricamento e' importante!
			var def = inj.concat(["injection/wikipedia.js"]);
			concatenateInjections(id, def);
			match = true;
		}

		if( monitor.instructure && url.match( _g.regex.instructure )){
			// NB: l'ordine di caricamento e' importante!
			var def = inj.concat(["injection/instructure.js"]);
			concatenateInjections(id, def);
			match = true;
		}

		if( monitor.wolfram && url.match( _g.regex.wolfram )){
		  	// NB: l'ordine di caricamento e' importante!
			var def = inj.concat(["injection/wolfram.js"]);
		 	concatenateInjections(id, def);
            match = true;
		}

		// update icon for matching tabs
		if(match){
			chrome.browserAction.setIcon({
				path:	{
					"19" : "images/19-aico.png",
					"38" : "images/38-aico.png"
				},
				tabId: id
			});
		}

	}	
}


// on icon click open in new tab
chrome.browserAction.onClicked.addListener(function(){
	var manifest = chrome.runtime.getManifest();
	var optionsUri = chrome.extension.getURL(manifest['options_page']);
	var win = window.open(optionsUri, '_blanck');
	win.focus();
});


// retrieve tab it to pass in injected code (managePage.js) - content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){ 
    if(request.action && request.action === 'setBadgeText'){
    	chrome.browserAction.setBadgeText({text: request.text, tabId: sender.tab.id});
    	chrome.browserAction.setBadgeBackgroundColor({color: '#888873', tabId: sender.tab.id});
    }
});


// inject script into tab recursively: the array "ar" order is the same as injection, so you've to warning about scripts dependency
function concatenateInjections(id, ar, scrpt){

	// add scrpt to ar so inject() will be simple
	if( typeof scrpt !== 'undefined' ) ar = ar.concat([scrpt]);

	var i = ar.length;
	var idx = 0 ;
	
	(function (){
	var that = arguments.callee;
	idx++;
	if(idx <= i){
		var f = ar[idx-1];
		chrome.tabs.executeScript(id, { file: f , /*allFrames : true,*/ runAt: "document_end"}, function() {
			that(idx);
		});
	}
	})();

}

