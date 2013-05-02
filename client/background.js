// Based on the "Page Action By URL" sample from http://developer.chrome.com/extensions/samples.html
// released under the BSD license, Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Modifications by Vitalik Buterin, also released under BSD

var wls = window.localStorage;

function load_from(urls) {
    if (urls.length == 0) { return; }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var t = xhr.responseText.split('\n').map(function(x) { return x.replace('\r','') });
        if (t.length > 200) { //Sanity check
          wls.btcmerc = JSON.stringify(t);
          wls.btcmerc_lastload = time;
          xhr.close;
        }
        else { load_from(urls.slice(1)); } //Recurse through the list until you get to a page which gives good results
      }
    }
    xhr.open("GET", urls[0], true);
    xhr.send();
}

// Called when the url of a tab changes.
function checkUrl(tabId, changeInfo, tab) {
  time = new Date().getTime();
  if (!wls.btcmerc || wls.btcmerc_lastload < time - 86400000) {
    load_from(['http://216.155.145.197/acceptbitcoin.txt',
               'http://bitcoinmagazine.com/sandbox/acceptbitcoin.txt',
               'http://pastebin.com/raw.php?i=hxUwtBpD']);
  }
  if (wls.btcmerc) {
    var u = JSON.parse(wls.btcmerc);
    var domain = tab.url.substr(tab.url.indexOf('//')+2);
    domain = domain.substr(0,domain.indexOf('/'));
    var done = false;
    for (var i = 0; i < u.length; i++) {
      if (u[i].length > 1 && domain.indexOf(u[i]) > -1) {
        done = true;
        chrome.pageAction.setIcon({tabId:tabId, path:'bitcoin19.png'});
        chrome.pageAction.setTitle({tabId:tabId, title:'Accepts Bitcoin'});
        chrome.pageAction.show(tabId);
        break;
      }
    }
    if (!done && window.localStorage.showAlways != "0") {
        chrome.pageAction.setIcon({tabId:tabId, path:'noaccept.png'});
        chrome.pageAction.setTitle({tabId:tabId, title:'Does not accept Bitcoin'});
        chrome.pageAction.show(tabId);
    }
    wls["btcmerc_lasturl"+tabId] = domain;
    wls["btcmerc_lastresult"+tabId] = done ? 1 : 0;
  }
};


// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkUrl);
