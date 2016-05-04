// from classes.js: listen to copy the text via injected script
$copy = new CopyToClipboard();
$copy.backgroundListen();


// azione all'aggiornamento di una pagina:
// naturalmente posso svolgere degli if in base al tipo di caricamento
chrome.tabs.onUpdated.addListener(function(id, info, tab){
    // NB:
    // questo script avvie sia quando info.status e' loading che quando e' complete!
    // logs in background page
    // console.log(id) // test
    // console.log(info)
    // console.log(tab)
    



    if( info.status === 'complete'){
      
      var match = false;
      var url = tab['url'];
      var chromeUrl = false;

      if(typeof url === 'undefined') return;

      var inj = ["lib/classes.js", "lib/managePage.js"];

      // gli url come chrome-extension creano problemi di accesso
      // visto che attualmente non mi servono, li ignoro
      if(url.match( /^chrome.*:\/\//i ) ){
        // console.log('url matchante: ' + url);
        chromeUrl = true;
        return;
      }


      if(url.match( /^https?:\/\/[^\/]+wikipedia.org/i )){
        // NB: l'ordine di caricamento e' importante!
        var def = inj.concat(["injection/wikipedia.js"]);
        concatenateInjections(id, def);
        match = true;
      }

      if(url.match( /^https?:\/\/mathworld.wolfram.com/i )){
        // NB: l'ordine di caricamento e' importante!
        var def = inj.concat(["injection/wolfram.js"]);
        concatenateInjections(id, def);
        match = true;
      }

      // update icon for matching tabs
      if(match){
        chrome.browserAction.setIcon({
          path:  {
              "19" : "images/19-aico.png",
              "48" : "images/48-aico.png",
              "128" : "images/128-aico.png"
          },
          tabId: id
        });
      }

    }
  
});



// 
// chrome.browserAction.enable(id);
chrome.browserAction.onClicked.addListener(function(){
  console.log('click')
    var manifest = chrome.runtime.getManifest();
    var optionsUri = chrome.extension.getURL(manifest['options_page']);
    var win = window.open(optionsUri, '_blanck');
    win.focus();
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

