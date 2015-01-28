
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
    if (selectedId=="transit"){ train(); }
    if (selectedId=="car"){ car(); }
    if (selectedId=="walking"){ walking(); }
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
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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
  allTimes();
  turnGreen();
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      buttonclick=true;
      directionsDisplay.setDirections(response);
      computeTotalDistance(directionsDisplay.getDirections());
      show_visibility('travelOptions');
      show_visibility2('bcirc_transit');
      enable_transit();
      
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
  allTimes();
  turnGreen();
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      buttonclick=true;
      directionsDisplay.setDirections(response);
      computeTotalDistance(directionsDisplay.getDirections());
      show_visibility('travelOptions');

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

//-----------------------------------------------------------------------------
// function to calculate travel times
var d = 0;
var t = 0;
var w = 0;

function allTimes(){
 var start = document.getElementById('start').value;
  var end = document.getElementById('dest').value;
  var ctime=0;
  var rtime=0;
  var wtime=0;
  var cartime={
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  }
  var railtime={
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.TRANSIT
  }
  var walktime={
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.WALKING
  }

  directionsService.route(cartime, function(response,status){
    ctime=computeTotalTime(response);
    d=ctime;
    document.getElementById('dtime').innerHTML=convertTime(ctime);
  });
  directionsService.route(railtime, function(response,status){
    rtime=computeTotalTime(response);
    t=rtime;
    document.getElementById('ttime').innerHTML=convertTime(rtime);
  });
  directionsService.route(walktime, function(response,status){
    wtime=computeTotalTime(response);
    w=wtime;
    document.getElementById('watime').innerHTML=convertTime(wtime);
  });
}

function computeTotalTime(result){
  var myroute = result.routes[0];
  var total=0;
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].duration.value;
  }
  return total;
}

//Sunnia's code below
function convertTime(secs) {
  var str='';
  var mins=0;
  var hours=0;
  var days=0;
  if (secs > 86400) {
    days = Math.round(secs/86400 * 1) / 1;
    secs = secs - days*86400;
    if (days===1) { str += days + ' day '; } 
    else { str += days + ' days '; }
  }
  if (secs > 3600) {
    hours = Math.round(secs/3600* 1) / 1;
    secs = secs - hours*3600;
    if (hours===1) { str += hours + ' hour '; } 
    else { str += hours + ' hours '; }
  }
  if (secs > 60) {
    mins = Math.round(secs/60* 1) / 1;
    if (mins===1) { str += mins + ' min ';} 
    else { str += mins + ' mins '; }
  }
  return str;
}

function turnGreen() { //takes in seconds as parameters
 
  if (w <= 1800) {
    //walk is green
    document.getElementById('bcirc_car').style.background = '#06c';
    document.getElementById('bcirc_transit').style.background = '#06c';
    document.getElementById('bcirc_walk').style.background = '#093';

    document.getElementById('driveButton').className = 'btn btn-primary';
    document.getElementById('transitButton').className = 'btn btn-primary';
    document.getElementById('walkButton').className = 'btn btn-success';
  } else if (t < 3600) {
    //transit is green if it takes less than an hour 
    document.getElementById('bcirc_car').style.background = '#06c';
    document.getElementById('bcirc_transit').style.background = '#093';
    document.getElementById('bcirc_walk').style.background = '#06c';

    document.getElementById('driveButton').className = 'btn btn-primary';
    document.getElementById('transitButton').className = 'btn btn-success';
    document.getElementById('walkButton').className = 'btn btn-primary';
  } else {
    //car is green bc it's the most reasonable
    document.getElementById('bcirc_car').style.background = '#093';
    document.getElementById('bcirc_transit').style.background = '#06c';
    document.getElementById('bcirc_walk').style.background = '#06c';

    document.getElementById('driveButton').className = 'btn btn-success';
    document.getElementById('transitButton').className = 'btn btn-primary';
    document.getElementById('walkButton').className = 'btn btn-primary';
  }
}

//-----------------------------------------------------------------------------


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

