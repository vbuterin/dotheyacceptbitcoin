document.addEventListener('DOMContentLoaded', init);
function init() {
  document.getElementById("showAlways").value = window.localStorage.showAlways;
  document.getElementById("submit").onclick=function() {
    window.localStorage.showAlways = document.getElementById("showAlways").value;
  };
}
