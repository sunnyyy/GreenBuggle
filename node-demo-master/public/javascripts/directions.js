
var tabLinks = new Array();
var contentDivs = new Array();
var buttonclick=false;
var autocomplete,another;

function init() {
  // Grab the tab links and content divs from the page
  var tabListItems = document.getElementById('tabs').childNodes;
  for ( var i = 0; i < tabListItems.length; i++ ) {
    if ( tabListItems[i].nodeName == "LI" ) {
      var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
      var id = getHash( tabLink.getAttribute('href') );
      tabLinks[id] = tabLink;
      contentDivs[id] = document.getElementById( id );
    }
  }
  // Assign onclick events to the tab links, and
  // highlight the first tab
  var i = 0;
  for ( var id in tabLinks ) {
    tabLinks[id].onclick = showTab;
    tabLinks[id].onfocus = function() { this.blur() };
    if ( i == 0 ) tabLinks[id].className = 'selected';
    i++;
  }

  // Hide all content divs except the first
  var i = 0;
  for ( var id in contentDivs ) {
    if ( i != 0 ) contentDivs[id].className = 'tabContent hide';
    i++;
  }
}

function showTab() {
  if(buttonclick==true) {
  var selectedId = getHash( this.getAttribute('href') );
    if (selectedId=="transit"){
      train();
    }
    if (selectedId=="car"){
      car();
    }
    if (selectedId=="walking"){
      walking();
    }
    // Highlight the selected tab, and dim all others.
    // Also show the selected content div, and hide all others.
    for ( var id in contentDivs ) {
      if ( id == selectedId ) {
      
        tabLinks[id].className = 'selected';
        contentDivs[id].className = 'tabContent';
      } else {
        tabLinks[id].className = '';
        contentDivs[id].className = 'tabContent hide';
      }
    }
    // Stop the browser following the link
    return false;
  } else{
    alert('Please click the calculate route button first');
  }
} // end showTab() function

function getFirstChildWithTagName( element, tagName ) {
  for ( var i = 0; i < element.childNodes.length; i++ ) {
    if ( element.childNodes[i].nodeName == tagName ) return element.childNodes[i];
  }
}


function getHash( url ) {
  var hashPos = url.lastIndexOf ( '#' );
  return url.substring( hashPos + 1 );
}

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(42.3581, -71.0636)
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  var control = document.getElementById('control');
  control.style.display = 'block';
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  // Create the autocomplete object, restricting the search
  // to geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */(document.getElementById('start')),
      { types: ['geocode'] });

    another= new google.maps.places.Autocomplete(
      /**= @type {HTMLInputElement} */(document.getElementById('dest')),
      { types: ['geocode'] });
 
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
  });
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('dest').value;
  var request={
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  }
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      buttonclick=true;
      directionsDisplay.setDirections(response);
      computeTotalDistance(directionsDisplay.getDirections());
    } else if(status=="ZERO_RESULTS"){
      alert('no route found');
    } else{
      alert('Please enter both text fields correctly');
    }
  });
}

function train(){
  var start = document.getElementById('start').value;
  var end = document.getElementById('dest').value;
  var request={
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.TRANSIT
   }
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      //computeTotalDistance(directionsDisplay.getDirections());
    }
     else if(status=="ZERO_RESULTS"){
      alert('no route found');
    }
    
    else{
      alert('Please enter both text fields correctly');
    }
  });
}

function car(){
  var start = document.getElementById('start').value;
  var end = document.getElementById('dest').value;
  var request={
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  }
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      //computeTotalDistance(directionsDisplay.getDirections());
    } else if (status=="ZERO_RESULTS"){
      alert('no route found');
    } else{
      alert('Please enter both text fields correctly');
    }
  });
}

function walking(){
  var start = document.getElementById('start').value;
  var end = document.getElementById('dest').value;
  var request={
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.WALKING
  }
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      //computeTotalDistance(directionsDisplay.getDirections());
    } else if (status=="ZERO_RESULTS"){
      alert('no route found');
    } else{
      alert('Please enter both text fields correctly');
    }
  });
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  var carbon=0;
  var railcar=0;
  var plane=0;
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.0;
  carbon= (total/37)*8.7;
  railcar= total*.1;
  plane= total*.22;
  document.getElementById('total').innerHTML = round(carbon,2) + ' kg';
  document.getElementById('rail').innerHTML = round(railcar,2) + ' kg';
  document.getElementById('flight').innerHTML = round(plane,2) + ' kg';
}


//Lilian's database passing
function mySubmit() {

  document.forms["myForm"]["startInput"].value = document.getElementById('start').value;
  document.forms["myForm"]["endInput"].value = document.getElementById('dest').value;
  // if (document.forms["myForm"]["drive"].checked) {
//   document.forms["myForm"]["carbonInput"].value = document.getElementById('carbon').value;
// } else if (document.forms["myForm"]["public"].checked){
//   document.forms["myForm"]["carbonInput"].value = document.getElementById('railcar').value;
// } else {
//       document.forms["myForm"]["carbonInput"].value = 0;
// }
//  var type = document.getElementsByName("transportation");
//         if (type[0].checked) {
// document.forms["myForm"]["carbonInput"].value = document.getElementById('carbon').value;                
//      } else if (type[1].checked){
//      document.forms["myForm"]["carbonInput"].value = document.getElementById('railcar').value;
// } else {
//   document.forms["myForm"]["carbonInput"].value = 0;
console.log(document.forms["myForm"]["startInput"].value);
console.log(document.getElementById('carbon').value);
switch(document.forms["myForm"]["startInput"].value){
  case "drive": 
  document.forms["myForm"]["carbonInput"].value = document.getElementById('carbon').value;
  break;
  case "transit": 
  document.forms["myForm"]["carbonInput"].value = document.getElementById('railcar').value;
  break;
  case "walk": 0;
  case "no": 0;

}

}

