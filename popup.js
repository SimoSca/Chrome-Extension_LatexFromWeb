alert('lol')


// need bookmarks permission in manifest
// need jquery script enabled in manifest
// need policy to external call "content_security_policy": "script-src 'self' https://ajax.googleapis.com; object-src 'self'",
// 
// 
// good page refer:
// http://code.tutsplus.com/tutorials/developing-google-chrome-extensions--net-33076

// chrome.browserAction.setBadgeText({text: "yeah"});

// UTILIZZO DEI MESSAGG: PASSAGGIO PARAMETRI TRA PAGINE
// 
// Any extension page (except content scripts) has direct access to the background page via chrome.extension.getBackgroundPage().

// That means, within the popup page, you can just do:
// chrome.extension.getBackgroundPage().console.log('foo');

// To make it easier to use:
// var bkg = chrome.extension.getBackgroundPage();
// bkg.console.log('foo');

// Now if you want to do the same within content scripts you have to use Message Passing to achieve that. The reason, they both belong to different domains, which make sense. There are many examples in the Message Passing page for you to check out.


// oggetto che scrive un log nella pagina di background:
// utile perche' con la app "chrome apps and extension..." posso monitorare la pagina di background tramite "inspect views"
var bkg = {
  page : chrome.extension.getBackgroundPage(),
  log: function(str){
    this.page.console.log(str);
  }
}

// bkg.log('Caricato popup')

// le azioni della popup
window.onload = function() {

    document.getElementById("getVideo").onclick = function() {
        // per mandare un messaggio di dialogo alle altre pagine, come la background
        // chrome.extension.sendMessage({
        //     type: "color-divs"
        // });
        
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            // lo script viene eseguito come se fosse nella tab specificata
            
            chrome.tabs.executeScript(null, {file: "injection/getVideo.js"});  

            // nel caso allo script voglia anche passare dei parametri
            // NB: nello script da eseguire la variabile viene riconosciuta utilizzando il nome assegnato nel secondo parametro
            // var myobj = {msg: 'complicated value'};
            // chrome.tabs.executeScript(
            //   null, 
            //   { code: 'var config = ' + JSON.stringify(myobj) + ' ; console.log(\'lol\');' }, 
            //   function() {  chrome.tabs.executeScript(null, {file: 'popup_injection/inject.js'}); }
            // );
             
            //    Parametri attuale tab
            //    that.url = tabs[0].url;
            //    obj = {
            //     url: that.url
            //    }
        });
    }
    // bkg.log(new Date())
    var divs = document.querySelectorAll(".resize-current");
    for(var i =0; i  < divs.length; i++){
        bkg.log('resize-current #' + i)
        divs[i].onclick = clickResizer;
    }
    
    function clickResizer(e){
        bkg.log('cliccato resize-current')

        // bkg.log(chrome.windows.WINDOW_ID_CURRENT);
        
        
        // screen dimensions
        var Sh = window.screen.availHeight
        var Sw = window.screen.availWidth
        // "a" means "action"
        // numbers in relative scale: default are full width and height,  with top let screen corner
        var atop = this.getAttribute('data-top') || 0
        var aleft = this.getAttribute('data-left') || 0
        var awidth = this.getAttribute('data-width') || 1
        var aheight = this.getAttribute('data-height') || 1

        chrome.windows.getCurrent({}, function(curWindow){
            var updateInfo = {
                top: Sh*atop,
                left: Sw*aleft,
                width: Sw *awidth,
                height: Sh*aheight
                //top: 20,
                //width: 50
            }

            bkg.log(updateInfo)
            function callback(){
                // bkg.log('callback')
                bkg.log(arguments)
            }
            // bkg.log(updateInfo)
            wid = curWindow.id;
            // bkg.log(curWindow.id)
            // wid = chrome.windows.WINDOW_ID_CURRENT;
            chrome.windows.update(wid, updateInfo, function(){
                bkg.log('ciao')

            });
        
        });

    }

    /************************* START GESTIONE ENOMIS_APP *******************************************/
    var eApp = document.getElementById('enomis_app');

    eApp.onclick = function(e){

        var sName = 'EnomisApp';

        chrome.storage.sync.get(sName, function(items){
            var eAppId = items[sName];
            // devo ancora inserire l'id e salvarlo... in questo caso svolgo dei controlli
            if(typeof eAppId == 'undefined'){
                // alert('Id EnomisApp Mancante: non posso lanciare l\' App! ');
                save_app_id(sName);
            }else{
                // all'app do il comando per far partire il suo runtime di window
                chrome.runtime.sendMessage(eAppId, { action: "launch" },function(){} );
            }
        });

    }

    // okemmhbmbndhkjpkpecganoppgkklphc

    function save_app_id(sName){
        function prom(){ return prompt('Per lanciare l\' App devi prima inserire il suo Id:'); };
        var extensionId = prom();
        while(extensionId.length < 25) extensionId = prom(); // "se schiaccio Annulla" svolge un completo exit
        // verifico
        chrome.runtime.sendMessage(extensionId, { action: "info" },
            function (reply) {
                if(typeof reply == 'undefined'){
                    alert('App Id #' + extensionId + ' non valido. Si prega di riprovare.');
                }else{
                    bkg.log('salvo nello storage');
                    var store = {} ;
                    store[sName] = reply.id;
                    bkg.log(store);
                    chrome.storage.sync.set(store, function(){});
                }
        });


    }
    /************************* END GESTIONE ENOMIS_APP *******************************************/


}


// loadXMLDoc = function(dataObj) {
//     var xmlhttp;
//     bkg.log(dataObj);

//     bkg.log('dentro loadxmldoc')

//     if (window.XMLHttpRequest) {
//         // code for IE7+, Firefox, Chrome, Opera, Safari
//         xmlhttp = new XMLHttpRequest();
//     } else {
//         // code for IE6, IE5
//         xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//     }

//     xmlhttp.onreadystatechange = function() {
//         if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
//            if(xmlhttp.status == 200){
//                // document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
//                bkg.log(xmlhttp.responseText);
//            }
//            else if(xmlhttp.status == 400) {
//               alert('There was an error 400')
//            }
//            else {
//                alert('something else other than 200 was returned')
//            }
//         }
//     }

//     xmlhttp.open("GET", "http://ilnullatore.altervista.org", true);
//     xmlhttp.send();
// }
