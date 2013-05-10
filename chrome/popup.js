var wls = window.localStorage;
function init() {
  chrome.tabs.getSelected(null, function(tab) {
    window.tabId = tab.id;
    if (wls["btcmerc_lastresult"+tabId] == 1) {
      document.getElementById('yestheydo').style.display = 'block';
      document.getElementById('notheydont').style.display = 'none';
    }
    document.getElementById('btnremove').onclick = clickbtn;
    document.getElementById('btnadd').onclick = clickbtn;
    document.getElementById('stumble1').onclick = stumble;
    document.getElementById('stumble2').onclick = stumble;
  });
}
document.addEventListener('DOMContentLoaded', init);
function clickbtn() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status < 400) {
          alert("Your correction has been duly noted.");
        }
        chrome.tabs.update(tabId, { selected: true } )
      }
    }
    var keyword = (wls["btcmerc_lastresult"+tabId] == 1) ? "remove" : "add";
    var url = "http://216.155.145.197/suggest?" + keyword + "=" + wls["btcmerc_lasturl"+tabId];
    xhr.open("GET", url, true);
    xhr.send();
}
function stumble() {
  var u = JSON.parse(wls.btcmerc);
  var pos = Math.floor(Math.random() * u.length);
  chrome.tabs.update(tabId, { url: "http://"+u[pos], selected: true });
}
