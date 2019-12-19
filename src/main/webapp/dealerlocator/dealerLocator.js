//constants, ie wont let you use const ///////////////////////////

var dealerFinderServiceURL = "/wwwapps/api/dealerlocator/v1/dealer";

//zoom to radius
//13 is about 4 mile radius
//12z = 8miles, 11 is 16, 10 is 32, 9 is 64, 8:128, 7:256 
var defaultZoom = 11;
//we dont want people zooming too far out
var warnMinZoom = 7;

//end constants///////////////////////////

//holds ref to the google map
var googleMap = null;
var mapPins = new Array();

//event vars to help with event handling to minimize the number of calls to the server
//when dragging because the "coasting" that happens at the end,
//dragend fires during the coasting but we only want to hit the server after it gets completely done
//this page is extremely helpful https://developers.google.com/maps/documentation/javascript/events
var dragHappened = false;
var mapLoadedFirstTime = false;
var zoomSearchSuppressed = false; //we suppress the search that happens on zoom change when we center the map (which also resets the zoom, but we dont want to search)

//holds ref to a google geo coder that knows how to translate a street address to a lat long
var googleGeoCoder = null;
//used to display details about a push pin
var pushPinInfoWindow = new google.maps.InfoWindow( {   size: new google.maps.Size( 50, 10 )   } );

//ready fires when the page loads
$( document ).ready( function( ) {
	
	console.log("ready()");
	
	//get initial settings
	//usually the page is loaded from a vanilla link, but it can also be loaded from a link that has lat, long zoom args
	var googleMapOptions = createInitalMapOptions();
	
	//creates a googlemap with initial settings, then calls dealer search
	mapLoadedFirstTime = true;
	initGoogleMap( googleMapOptions );

	console.log("ready() Done");
	 
} );

function createInitalMapOptions(){
	
	console.log( "createInitalMapOptions()" );
	
	//defaults to Portland OR
	var initialCtrLng = -122.676601; //-122.6157;
	var initialCtrLat = 45.522466;//45.440704;
	var initialZoom = defaultZoom;
	
	//get any params from qs params
	var urlCtrLng = getUrlVars()["ctrLng"];
	if(urlCtrLng != null){
		initialCtrLng = Number(urlCtrLng);	
	}

	var urlCtrLat = getUrlVars()["ctrLat"];
	if(urlCtrLat != null){
		initialCtrLat = Number(urlCtrLat);	
	}
	
	var urlZoom = getUrlVars()["zoom"];
	if(urlZoom != null){
		initialZoom = Number(urlZoom);
	}
	
	//TODO, if QS values are empty ask browser for location and set from that
	

	//initiate the google map and set its event handlers
	console.log("createInitialMapOptoins(): initCtrLat {}, initCtrLng {}, initZoom {}", initialCtrLat, initialCtrLng, initialZoom);
	var latlng = new google.maps.LatLng(initialCtrLat, initialCtrLng);

	var googleMapOptions = {
			zoom: initialZoom,
			center: latlng,
			mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
			navigationControl: true,
			mapTypeControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			minZoom: warnMinZoom
			
	};
  
	 return googleMapOptions;
	
	
}

function initGoogleMap(googleMapOptions) {
	
	 console.log( "initGoogleMap()" );

	 //initiate the geocoder object
	 googleGeoCoder = new google.maps.Geocoder(); 

	 //create a new map using the options above, insert it into the "mapCanvas" div
	 googleMap = new google.maps.Map( $("#mapCanvas")[0], googleMapOptions );
	 
	 //https://developers.google.com/maps/documentation/javascript/events
	 //idle fires after a drag event is complete, after a zoom event and after map.setCenter()
	 //and apparently after the map comes back from the constructor	
	 //and apparently after map fit bounds is called
	 googleMap.addListener("idle", function(e){
		 console.log("idle");
		 if(dragHappened || mapLoadedFirstTime ){
			 dragHappened = false;
			 mapLoadedFirstTime = false;
			 search();
		 }
	 });
	 
	 googleMap.addListener("dragstart", function(e){
		 console.log("dragstart");
		 dragHappened = true;
	 });
	
	 //zoom changes when the zoom button has been hit OR fitBounds() has been called
	 googleMap.addListener("zoom_changed", function(e){
		 console.log("zoom_changed");
		 if(zoomSearchSuppressed){
			 console.log("zoomSearch was suppressed");
			 zoomSearchSuppressed = false;
		 }else{
			 search();
		 }
	 });

	 /*
	 //this is for when the canvas has been resized
	 googleMap.addListener("resize", function(e){
		 console.log("resize");
		 search();
	 });
	 */
	 
	 console.log("done initing, idle should fire and a search should happen");

}

function searchByAddress(){
	
	console.log("searchByAddress");
	
	//if the user entered an address by hand, or used the country, state and city drill down to populate the address
	//we first use google to translate the address to a lat long and set the map
	var address = $("#searchAddress").val();
	if( address == null || address === ""){
		alert("You must enter an address in the address field. You can enter it by hand or use the Country, State, City selectors to build the address.")
		return;
	}

	centerMapOnAddressThenSearch(address, googleGeoCoder, googleMap);

}

function centerMapOnAddressThenSearch(address, geocoder, resultsMap) {
    
	console.log("centermapOnAddress()");
    
	googleGeoCoder.geocode(
			{'address': address},
			function(results, status) {

				if (status === 'OK') {
					zoomSearchSuppressed = true; //zoom event listener will fire but we don't want a search to happen
					googleMap.setZoom(defaultZoom);
					googleMap.setCenter(results[0].geometry.location);
					search();
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
			}
	);
}

//this gets back json objects that contain dealers 
//this should only be called once the bounds object exist
//which only exist after the map is done loading, otherwise the latLng calls will fail or be wrong
//becuase the info has not come back from google yet
function search() {

	console.log( "search()" );
	
	try {
	   
		showLoadingAnimation();
		var bounds = googleMap.getBounds();
		if(!bounds){
			console.log("search() was called but map not loaded yet");
			return;
		}
		
		//we populate a datamap that we will pass to the finder service
		var qsArgs = {};
		
		//findDealersWithinBounds()
		qsArgs["ctrLng"] = bounds.getCenter().lng();
		qsArgs["ctrLat"] = bounds.getCenter().lat();
		
		qsArgs["swLng"] = bounds.getSouthWest().lng();
		qsArgs["swLat"] = bounds.getSouthWest().lat();

		qsArgs["neLng"] = bounds.getNorthEast().lng();
		qsArgs["neLat"] = bounds.getNorthEast().lat();
			 
		var jqxhr = $.getJSON( dealerFinderServiceURL, qsArgs);
			
		jqxhr.done(function(data) {
		    console.log( "done: " + data);
		    renderDealers(data);
		})
		  
		jqxhr.fail(function(data) {
			console.log( "error: " + data );
		})
		  
		jqxhr.always(function(data) {
			hideLoadingAnimation();
		});
	   
	} catch( e ) {
		hideLoadingAnimation();
		alert( 'search exception: ' + e.description );
	}
	
}

function getSearchRadiusForZoomInMilesRoundedDown( bounds){
	console.log("getSearchRadiusForZoomInMilesRoundedDown()");
	
	var inMeters = getSearchRadiusForZoomInMeters(bounds);
	return Math.floor(computedRadiusMeters * 0.000621371192); //conversion factor to miles
}

function renderDealers(dealers){
	
	console.log("renderDealers()");
	
	clearPins();
	
	//clear list of dealers
	$("#searchResultsTable tr").remove();
	
	var bounds = googleMap.getBounds();
	
	var summaryMsg = "<tr><th colspan=\"3\" >Found: " + dealers.length
	
	var radiusInMiles = getSearchRadiusForZoomInMilesRoundedDown(bounds);
	summaryMsg += " within " + radiusInMiles + " mile(s)."; 	
	summaryMsg += " In order of # of products carried.</th></tr>";
	$("#searchResultsTable > tbody").append(summaryMsg);
	

	for(i in dealers){

		var thisDealer = dealers[i];
		
		renderDetailsForDealer(thisDealer, i);
		
		var pinDetailsHTML = buildPinDetailsHTML(thisDealer); 
		pushPinForDealer(thisDealer, i, pinDetailsHTML);
		
	}
	
}

function renderDetailsForDealer(thisDealer, i){
	console.log("renderDetailsForDealer()");
	
	//was going to use a template library, but the logic would have been a pain so hand rolling it for now
	//TODO find a javascript templating lib that is easy to script 
	
	//build a row and add it to the #searchResults table 
	var rowHTML = "";
	
	rowHTML = "<tr><td colspan=\"3\"><hr width=90% align=center></td></tr>";
	
	//each dealer gets one row in the searchResults table
	rowHTML += "<tr><td colspan=3 ><a href=\"javascript:showPinDetails(" + i + ");\"><b>" + thisDealer.name + "</b></a></td></tr>";
	rowHTML += "<tr>";
	rowHTML += "<td valign=\"top\" class='dealerInfo'>" + getDetailColumn1( thisDealer, i) + "</td>";
	rowHTML += "<td valign=\"top\">" + buildImageAndHoursColumn( thisDealer) + "</td>";
	rowHTML += "<td valign=\"top\" >" + getDetailColumn3( thisDealer) + "</td>";
	
	rowHTML += "</tr>";
	$("#searchResultsTable > tbody").append(rowHTML);
	
}

function getDetailColumn1(thisDealer, i){
	console.log("getDetailColumn1()");
	
	//name is red
	var html = "";
	
	html += getLineForVal(thisDealer.address1, "<br />");
	html += getLineForVal(thisDealer.address2, "<br />");
	html += getLineForVal(thisDealer.address3, "<br />");

	html += getLineForVal(thisDealer.city, ", ");
	html += getLineForVal(thisDealer.stateorprovince, " ");
	html += getLineForVal(thisDealer.country, " ");	
	html += getLineForVal(thisDealer.postalCode, "");	

	html += "<br />";
	
	html += "Installs Products: ";
	if(thisDealer.installsProducts){
		html += "Yes";
	}else{
		html += "Yes";
	}
	html += "<br />";
	
	html += "<span style=\"text-decoration: underline;padding: 3px 0;display: block;\">Products We Sell (call for stock):</span>";
	
	html += getLineForArrayVal("Accessories", thisDealer.accessories);	
	html += getLineForArrayVal("Hubs", thisDealer.hubs);	
	html += getLineForArrayVal("Lights", thisDealer.lights);	
	html += getLineForArrayVal("Plows", thisDealer.plows);	
	html += getLineForArrayVal("Winches", thisDealer.winches);	
	
	return html;

}

function buildImageAndHoursColumn(thisDealer){

	var html = "";
	
	if(thisDealer.redLetterRanking == 100){
		
		if(
				thisDealer.fileName 
				&& thisDealer.fileName.trim().length > 0
		){
			//ex: imageMimeType	:	"image/pjpeg"
			//html += "<img src=\"/wwwapps/shared/dealerimages/"	+ thisDealer.fileName + "\" width=\"174\" height=\"108\" ><br />";
			html += "<img border=\"0\"  src=\"data:" + thisDealer.imageMimeType + ";base64," + thisDealer.imageString + "\"  width=\"174\" height=\"108\" ><br />";
		}
		
		//store hours is a string with line breaks. We replace the line breaks with <br>
		var storeHours = thisDealer.storeHours;
		if(storeHours){
			storeHours = storeHours.replace(/(?:\r\n|\r|\n)/g, "<br />");
			html += storeHours;
		}
	}
	
	return html;
	
}

function getDetailColumn3(thisDealer){
	
	console.log("getDetailColumn3()");

	var html = "<table class='dealerCont'>";

	if (thisDealer.redLetterRanking == 100) {
		
		html += "<tr><td><img src=\"/wwwapps/shared/warn-logo.gif\"></td>";
		html += "<td><a href=\"javascript:showRedLetterDialog();\">Red Letter Dealer</a></td></tr>";
	}

	if(thisDealer.phone800){
		html += "<tr><td><img src=\"assets/phonr.gif\"></td>"
		html += "<td>" + thisDealer.phone800 + "</td></tr>";
	}
	
	if(thisDealer.phone){
		html += "<tr><td><img src=\"assets/phonr.gif\"></td>";
		html += "<td>" + thisDealer.phone + "</td></tr>";
	}
	
	if(thisDealer.website){
		
		html += "<tr><td></td>";
		html += "<td><a href=\"";
		if ( thisDealer.website.indexOf("http") < 0 && thisDealer.website.indexOf("https") < 0) {
			html += "http://";
		}
		html +=  thisDealer.website + "\" target=\"new\">Website</a>";
		html += "</td></tr>";

	}
	
	//populate the directions link
	if(thisDealer.address1 && thisDealer.city && thisDealer.stateorprovince){
		
		html += "<tr><td><img src=\"assets/directions.gif\"></td>";
		html += "<td><a href=\"";
		
		var directions = "http://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q=";
		directions += thisDealer.address1 + ", " + thisDealer.city + ", " + thisDealer.stateorprovince;
		directions = encodeURI(directions);
		
		directions += "&aq=0&sll=" + thisDealer.getLat + "," + thisDealer.geoLng + "&z=16";
	
		html += directions + "\" target=\"_new\">Get Directions</a></td></tr>";
	}
	
	//Math.round(num * 10) / 10; //1 decimal place accuracy
	var distance; 
	console.log("computing distance string, country is \"" + thisDealer.country + "\"");
	if(thisDealer.country != "US"){
		//convert to KM
		distance = thisDealer.distInMiles * 1.6;
		distance = Math.round(distance * 10)/10;
		distance += " kms";
	}else{
		distance = Math.round(thisDealer.distInMiles * 10)/10;
		distance += " miles";
	}
	
	html += "<tr><td></td><td>Distance: " + distance + "</td></tr>";
	
	html += "</table>";
	
	return html;
	
}

function buildPinDetailsHTML(thisDealer){
	//even though a lot of this is the same as building the detail
	//separating it out lets us customize it more easily
	console.log("buildPinDetailsHTML()");
	
	var html = "";
	
	html += "<table border=0 width=400><tr>"
	
	html += "<td valign=\"top\" style=\"color: #000000;\">" + buildPinDetailCol1(thisDealer) + "</td>";
	html += "<td valign=\"top\">" + buildImageAndHoursColumn( thisDealer) + "</td>";
		
	html += "</tr></table>";
	
	return html;
}

function buildPinDetailCol1(thisDealer){
	
	var html = "<b>" + thisDealer.name + "</b>"
	
	//build the div
	html += "<div id=\"padd\">";
	
	//buildAddress
	html += getLineForVal(thisDealer.address1, "<br />");
	html += getLineForVal(thisDealer.address2, "<br />");
	html += getLineForVal(thisDealer.address3, "<br />");

	html += getLineForVal(thisDealer.city, ", ");
	html += getLineForVal(thisDealer.stateorprovince, " ");
	html += getLineForVal(thisDealer.country, " ");	
	html += getLineForVal(thisDealer.postalCode, "");	

	html += "<br />";
	
	//installs products string
	html += "Installs Products: ";
	if(thisDealer.installsProducts){
		html += "Yes";
	}else{
		html += "Yes";
	}
	html += "<br />";
	
	//products we sell string
	html += "<span style=\"text-decoration: underline;padding: 3px 0;display: block;\">Products We Sell (call for stock):</span>";
	
	html += getLineForArrayVal("Accessories", thisDealer.accessories);	
	html += getLineForArrayVal("Hubs", thisDealer.hubs);	
	html += getLineForArrayVal("Lights", thisDealer.lights);	
	html += getLineForArrayVal("Plows", thisDealer.plows);	
	html += getLineForArrayVal("Winches", thisDealer.winches);	
	
	html += "<br>";
		
	//phone numbers, website
	if(thisDealer.phone800){
		html += "Toll Free:" + thisDealer.phone800 + "<br><br>";
	}
	if(thisDealer.phone){
		html += "Phone:" + thisDealer.phone + "<br><br>";
	}
	
	if(thisDealer.website){
		
		html += "<a href=\"";
		//some website urls have protocol, some do not
		if ( thisDealer.website.indexOf("http") < 0 && thisDealer.website.indexOf("https") < 0) {
			html += "http://";
		}
		html +=  thisDealer.website + "\" target=\"new\">Website</a>";
		html += "<br><br>";

	}
	
	//populate the directions link
	if(thisDealer.address1 && thisDealer.city && thisDealer.stateorprovince){
		
		html += "<a href=\"";
		
		var directions = "http://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q=";
		directions += thisDealer.address1 + ", " + thisDealer.city + ", " + thisDealer.stateorprovince;
		directions = encodeURI(directions);
		
		directions += "&aq=0&sll=" + thisDealer.getLat + "," + thisDealer.geoLng + "&z=16";
	
		html += directions + "\" target=\"_new\">Get Directions</a><br><br>";
	}	
	
	html += "</div>";
	
	//if RLD, RLD stuff
	if(thisDealer.redLetterRanking == 100){
		html += "<br>"
		html += "<img src=\"/wwwapps/shared/warn-logo.gif\"><br>";
		html += "<span style=\"color: #ff0000\">Red Letter Dealer</span>";
	}
	
	return html;
}




function getLineForVal( aVal, lineEnding ){
	if(aVal && aVal.length > 0){
		return aVal + lineEnding;
	}else{
		return "";
	}
	
}

function getLineForArrayVal(aName, arrVal ){

	if(arrVal && arrVal.length > 0){
		
		var retVal = "<b>" + aName + "</b>: &nbsp;<i>";
		
		for(i in arrVal){
			retVal += arrVal[i] + ", ";
		}
		retVal = retVal.slice(0, -2); //remove last comma
		
		retVal += "</i><br />";
		
		return  retVal;
		
	}else{
		return "";
	}
	
}

//this puts a pin in the map. if dealter type is 1 (RLD) then it uses the dealer icon
function pushPinForDealer( dealer, zOrder, pinDetails ) {
	
	console.log("pushPinForDealer()");
	
	var isRedLetterDealer = false;
	if(dealer.redLetterRanking == 100){
		isRedLetterDealer = true;
	}
	
	var lat = dealer.geoLat;
	var lng = dealer.geoLong;
	zOrder = Number(zOrder);
	
	console.log( 'pushPin', 'isRedLetterDealer: ' + isRedLetterDealer + ', lat: ' + lat + ', lng: ' + lng + ', zOrder: ' + zOrder );
	 
	 var image, shadow, title;

	 if ( isRedLetterDealer ) {

		 image = new google.maps.MarkerImage(
			'assets/dealer-icon.png',        
			new google.maps.Size( 43, 32 ), //size
			new google.maps.Point( 0, 0 ), //orign
			new google.maps.Point( 0, 32 )//anchor offset 
		 ); 

		 shadow = new google.maps.MarkerImage( 
			'assets/shadow-dealer-icon.png',
			new google.maps.Size( 60, 32 ), 
			new google.maps.Point( 0, 0 ), 
			new google.maps.Point( 0, 32 ) 
		 ); 
		 
		 title = "Red Letter Dealer";
		 
	 } else {
		 
	   image = new google.maps.MarkerImage(
		   'assets/pin-short.png',
			new google.maps.Size( 12, 19 ), 
			new google.maps.Point( 0, 0 ),
			new google.maps.Point( 0, 19 ) 
	   ); 
	   
	   title = "Dealer";
	   
	 }
    
	 var dealerLatLng = new google.maps.LatLng(lat, lng);
	 
	 var marker = new google.maps.Marker( {
	   position: dealerLatLng,
	   map: googleMap, 
	   icon: image,
	   title: title,
	   zIndex: zOrder
	 } );	 

	 if ( isRedLetterDealer ) {
	   marker.setShadow( shadow );
	 }

	 var x = mapPins.push( marker );
	 
	 google.maps.event.addListener( marker, 'click', function() {
		 pushPinInfoWindow.setContent( pinDetails ); 
		 pushPinInfoWindow.open( googleMap, mapPins[x - 1] );        
	 } );
	 
	 //return a latlng bounds so we can grow the map to catch the pins that are off the edge 
	 return dealerLatLng;
}

//this clears the pins from the map
function clearPins() {
	 
	console.log( "clearPins()");

	 if ( mapPins ) {
	   
		 for ( x in mapPins ) {
	     mapPins[x].setMap( null );
	   }
	   
	   mapPins = new Array();
	 } 
}

function showPinDetails( markerIndex ) {
	console.log("showPinDetails() " + markerIndex);
	
	google.maps.event.trigger( mapPins[markerIndex], 'click' );
	 
}

function showRedLetterDialog() {
	$("#redLetterDiv").dialog("open");
}

function showDirectLinkDialog() {
	console.log("showDirectLinkDialog()");
	
	var bounds = googleMap.getBounds();
	
	var computedRadiusMeters = getSearchRadiusForZoomInMeters(bounds);

	var latLngCenter = googleMap.getCenter();

	var url = location.protocol + "//" + location.hostname	+ (location.port ? ':' + location.port : '');
	url += "/wwwapps/dealerlocator/dealerLocator.htm?";
	url += '&ctrLng=' + latLngCenter.lng();
	url += '&ctrLat=' + latLngCenter.lat();
	url += '&zoom=' + googleMap.getZoom();

	$("#directLinkURLField").val(url);
	$("#directLinkURLField").select();

	$("#directLinkDiv").dialog("open");
}


function showLoadingAnimation() {
	console.log("showLoadingAnimation()");
	//from http://api.jqueryui.com/position/: Note: jQuery UI does not support positioning hidden elements.
	//so you have to show it before you reposition it. otherwise, it adds on to where it was before
	//and moves off the scree to the lower right as you call this multiple times
	$("#loadingImgDiv").show();
	$( "#loadingImgDiv" ).position({
		  my: "center",
		  at: "center",
		  of: "#mapCanvas"
	});

}

function hideLoadingAnimation() {
	console.log("hideLoadingAnimation()");
	 $("#loadingImgDiv").hide();
}

//Read a page's GET URL variables and return them as an associative array.
//ex use: var meVal = getUrlVars()["me"];
function getUrlVars(){
	
	console.log("getURLVars()");

	var queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
    var hashes = queryString.split('&');

    var qsVars = [];
    var hash;
    for(var i = 0; i < hashes.length; i++) {
    	
        hash = hashes[i].split('=');
        qsVars.push(hash[0]);
        qsVars[hash[0]] = hash[1];
    }
    
    return qsVars;
    
}

function getSearchRadiusForZoomInMeters( bounds){
	console.log("getSearchRadiusForZoomInMeters()");
	
	//finds distance from center of map to the top right corner
	//google.maps.LatLng
	var latLngCenter = bounds.getCenter();

	if (latLngCenter) {
	  
		var outerBounds = bounds.getNorthEast();//causes some found to be outside edge of visible map if ortho to center of map
	  
		//Calculate radius (in meters).
		//this requires that the geometry library be included in the maps api script
		computedRadiusMeters = google.maps.geometry.spherical.computeDistanceBetween(latLngCenter, outerBounds);
	  
		//we have to round it to an int because it can be a decimal, and way too big for a double, and the REST signature will not recognize it
		//we only need int accuracy
		computedRadiusMeters = Math.floor(computedRadiusMeters);
		
		return computedRadiusMeters;
	  
	}else{

		return minimumComputedSearchRadiusInMeters;
	}

}

/*
function getCoordinatesForAddressFromGoogle( address, callback ) {    
	 
	console.log( "getCoordinatesForAddressFromGoogle() address: " + ( address ? address : 'null' )   + ", callback: " + ( callback ? callback : 'null' ) );

	 var location = null; 
				
     googleGeoCoder.geocode( 
    		 {  'address': address  }, 
		     function( results, status ) {
    			 if ( status == google.maps.GeocoderStatus.OK ) {
    				 
    				 location = results[0].geometry.location;
		       
		       } else {

		    	   alert( 'Unable to determine the location of the address provided.' );						

		    	   location = new google.maps.LatLng(initialLatitude, initialLongitude);
		    	   
		       }
    			 
				 callback( location );
    			 
    		 }
    );
     
}
*/

/*	
//these 2 functions are to support getting the users current location using HTML5
function getCountryForCurrentUser(callback ) {    
 

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log = "Geolocation is not supported by this browser.";
    }

	function showPosition(position) {
    	x.innerHTML = "Latitude: " + position.coords.latitude + 
    	"<br>Longitude: " + position.coords.longitude;
    	} 

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': <YOURLATLNGRESPONSEFROMGEO>}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var loc = getCountry(results);
                }
            }
        })
     
}
*/
/*
function getCountryFromGoogleGeoResults(results){
    
	for (var i = 0; i < results[0].address_components.length; i++) {
	
	    var shortname = results[0].address_components[i].short_name;
	    var longname = results[0].address_components[i].long_name;
	    var type = results[0].address_components[i].types;
	
	    if (type.indexOf("country") != -1) {
	        if (shortname && shortname.trim().length > 0 ) {
	            return shortname;
	        }else {
	            return longname;
	        }
	    }
	}
}
*/

