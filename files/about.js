$(document).ready(function(){
  $(".aboutnav").click(function(){
    showabout();
    fadecontainer();
  });
  $("#aboutback").click(function(){
    hideabout();
    defaultcontainer();
  });
});


function showabout() {
  document.getElementById("aboutinfo").style.zIndex = "10";
}
function hideabout() {
  document.getElementById("aboutinfo").style.zIndex = "-1";
}
function fadecontainer() {
  document.getElementById("container").style.opacity = "0.5";
  document.getElementById("container").element.style.filter  = 'alpha(opacity=50)'; // IE fallback
}
function defaultcontainer() {
  document.getElementById("container").style.opacity = "1.0";
  document.getElementById("container").element.style.filter  = 'alpha(opacity=100)'; // IE fallback
}
