/**
 * XULSchoolChrome namespace.
 */
if ("undefined" == typeof(XULSchoolChrome)) {
  var XULSchoolChrome = {};
};

// implements nsIWebProgressListener
var listener = {
    onLocationChange: function(aProgress, aRequest, aURI) {
        // fires on tab change; update status here;
        // get the currently selected tab
        var currDoc = gBrowser.contentDocument; 
        load_sitelist();
        if (wls.btcmerc) {
          var u = check_url(""+currDoc.location,JSON.parse(wls.btcmerc));
          window.elt = document.getElementById("dotheyacceptbitcoin-hello-world-button");
          if (u) {
              window.elt.setAttribute("style",'list-style-image: url("chrome://dotheyacceptbitcoin/skin/bitcoin19.png")');
          }
          else {
              window.elt.setAttribute("style",'list-style-image: url("chrome://dotheyacceptbitcoin/skin/noaccept.png")');
          }
          window.elt.select();
          wls["btcmerc_lasturl"+tabId] = u;
          wls["btcmerc_lastresult"+tabId] = u ? 1 : 0;
        }
    },
    onStateChange: function(a, b, c, d) {},
    onProgressChange: function(a, b, c, d, e, f) {},
    onStatusChange: function(a, b, c, d) {},
    onSecurityChange: function(a, b, c) {}
}

gBrowser.addProgressListener(
    listener, 
    Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
/**
 * Controls the browser overlay for the Hello World extension.
 */
XULSchoolChrome.BrowserOverlay = {
  doSomething : function(aEvent) {
    var url = ""+gBrowser.contentDocument.location;
    var domain = url.substr(url.indexOf('//')+2);
    if (domain.indexOf('/') >= 0) { domain = domain.substr(0,domain.indexOf('/')); }
    var doweaccept = (aEvent.target.style == 'list-style-image: url("chrome://dotheyacceptbitcoin/skin/bitcoin19.png")');
    if (confirm("Do We Accept Bitcoin? reported that this website " + (doweaccept ? "accepts Bitcoin." : "does not accept Bitcoin.") + " Report this as incorrect?")) {
      correct(domain,!doweaccept,function(xhr) { 
        if (xhr.status < 400) {
            alert("Your correction has been duly noted.");
        }
      });
    }
  },
  mystumble : function(aEvent) {
    stumble(function(url) {
      gBrowser.loadURI("http://"+url); 
      window.elt.setAttribute("style",'list-style-image: url("chrome://dotheyacceptbitcoin/skin/bitcoin19.png")');
    });
  }
};

