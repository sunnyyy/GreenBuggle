
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
    var i = 0;
  
  for ( var id in tabLinks ) {
    tabLinks[id].onclick = showTab;
    tabLinks[id].onfocus = function() { this.blur() };
    i++;
  }

  // Hide all content divs 
 var i = 0;
  for ( var id in contentDivs ) {
    contentDivs[id].className = 'tabContent hide';
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
    /*
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
    } */
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

// CALCULATES TRANSIT ROUTE AT BEGINNING
function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('dest').value;
  var request={
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.TRANSIT
  }
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      buttonclick=true;
      directionsDisplay.setDirections(response);
      computeTotalDistance(directionsDisplay.getDirections());
      show_visibility('travelOptions');
      show_visibility2('bcirc_transit');
      enable_transit();
      allTimes();
      document.getElementById('transli').className = 'active';
      document.getElementById('driveli').className = '';
      document.getElementById('walkli').className = '';
    } else if(status=="ZERO_RESULTS"){
      hide_visibility2('bcirc_transit');
      disable_transit();
      calcRoute2(); // IMPORTANT!! SWITCHES TO CAR IF TRANSIT UNAVAILABLE
    } else{
      hide_visibility('travelOptions');
      hide_visibility('travelChoice');
      alert('Please enter both text fields correctly');
    }
  });
}

// DEFAULTS TO CAR ROUTE IF TRANSIT UNAVAILABLE
function calcRoute2() {
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
      show_visibility('travelOptions');
      allTimes();
      document.getElementById('transli').className = '';
      document.getElementById('driveli').className = 'active';
      document.getElementById('walkli').className = '';
    } else if(status=="ZERO_RESULTS"){
      hide_visibility('travelOptions');
      hide_visibility('travelChoice');
      alert('no route found');
    } else{
      hide_visibility('travelOptions');
      hide_visibility('travelChoice');
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
      show_visibility2('bcirc_transit');
      directionsDisplay.setDirections(response);
      //computeTotalDistance(directionsDisplay.getDirections());
      document.getElementById('transli').className = 'active';
      document.getElementById('driveli').className = '';
      document.getElementById('walkli').className = '';
    }
     else if(status=="ZERO_RESULTS"){
      hide_visibility2('bcirc_transit');
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
      document.getElementById('transli').className = '';
      document.getElementById('driveli').className = 'active';
      document.getElementById('walkli').className = '';
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
      document.getElementById('transli').className = '';
      document.getElementById('driveli').className = '';
      document.getElementById('walkli').className = 'active';
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
  //var plane=0;
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.0;
  carbon= round((total/37)*8.7, 2);
  railcar= round(total*.1, 2);
  //plane= total*.22;
  document.getElementById('total').innerHTML = carbon;
  document.getElementById('rail').innerHTML = railcar;
  //document.getElementById('flight').innerHTML = round(plane,2) + ' kg';
}


// code for displaying buttons
function show_visibility(id) {
  document.getElementById(id).style.display = 'block';
}
function hide_visibility(id) {
  document.getElementById(id).style.display = 'none';
}

// code for displaying circles
function show_visibility2(id) {
  document.getElementById(id).style.visibility = 'visible';
}
function hide_visibility2(id) {
  document.getElementById(id).style.visibility = 'hidden';
}

// code for disabling transit button
function disable_transit() {
  document.getElementById('transitButton').disabled = 'disabled';
}
function enable_transit() {
  document.getElementById('transitButton').disabled = '';
}

//Lilian's database passing
function mySubmitCar() {
  document.forms["myFormCar"]["startInput"].value = document.getElementById('start').value;
  document.forms["myFormCar"]["endInput"].value = document.getElementById('dest').value;
  document.forms["myFormCar"]["carbonInput"].value = document.getElementById('total').innerHTML;
}
function mySubmitTransit() {
  document.forms["myFormTransit"]["startInput"].value = document.getElementById('start').value;
  document.forms["myFormTransit"]["endInput"].value = document.getElementById('dest').value;
  document.forms["myFormTransit"]["carbonInput"].value = document.getElementById('rail').innerHTML;
}
function mySubmitWalk() {
  document.forms["myFormWalk"]["startInput"].value = document.getElementById('start').value;
  document.forms["myFormWalk"]["endInput"].value = document.getElementById('dest').value;    
}

// flight popover
function showpop() {
  $('#but').popover('show');
}
function hidepop() {
  $('#but').popover('hide');
}


//Portions of this page are modifications based on work created and shared by Google 
//and used according to terms described in the Creative Commons 3.0 Attribution License.

