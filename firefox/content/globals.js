window.wls = (window.content || window).localStorage;

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

function load_sitelist() {
  time = new Date().getTime();
  window.wls = (window.content || window).localStorage;
  if (!wls.btcmerc || wls.btcmerc_lastload < time - 43200000) { //12 hours
    load_from(['http://216.155.145.197/acceptbitcoin.txt',
               'http://bitcoinmagazine.com/sandbox/acceptbitcoin.txt',
               'http://pastebin.com/raw.php?i=hxUwtBpD']);
  }
}

function check_url(url, urls) {
    var domain = url.substr(url.indexOf('//')+2);
    if (domain.indexOf('/') >= 0) { domain = domain.substr(0,domain.indexOf('/')); }
    for (var i = 0; i < urls.length; i++) {
      if (urls[i].length > 1 && domain.indexOf(urls[i]) > -1) {
        return urls[i];
      }
    }
    return false;
}

function correct(url,realans,callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        callback(xhr);
      }
    }
    var keyword = realans ? "add" : "remove";
    var requrl = "http://216.155.145.197/suggest?" + keyword + "=" + url;
    xhr.open("GET", requrl, true);
    xhr.send();
}

function stumble(callback) {
  var u = JSON.parse(wls.btcmerc);
  var pos = Math.floor(Math.random() * u.length);
  callback(u[pos]);
}
