//constants, ie wont let you use const ///////////////////////////

var locationServiceURL = "/wwwapps/api/dealerlocator/";

//end constants

function countrySelectorChanged() {
	 
	console.log( "countrySelectorChanged(), val was " + $("#countrySelector").val() );
	
	if( $("#countrySelector").val() == "US" || $("#countrySelector").val() == "CA"){
		//we are in CA or US
		//and there are so many dealers in US an CA that we are going to make the user drill down more
		populateStateSelector();
		
	}else{
		
		//we are in another country where the number of dealers is low enough that we just show a list of cities
		hideStateSelector();
		clearStateSelector();
		
		populateCitySelector();
	}
	
}

function stateSelectorChanged() {

	console.log("stateSelectorChanged()");
	
	if( $("#stateSelector").val() == -1){
		//the user selected "--Select--" and we just hide and clear the city
		hideCitySelector();
		clearCitySelector();
	}
	
	populateCitySelector();
	   
}

function citySelectorChanged() {
	
	console.log("citySelectorChanged()");

	//if -1, the user selected "--Select City--" and we don't do anything
	if($("#citySelector").val() != -1){

		//once a city is selected, we populate the address field and search by address
		var addressString = $("#citySelector").val();
		
		if( $("#stateSelector").val() && $("#stateSelector").val() != -1){
			addressString += " " +  $("#stateSelector").val();
		}
		
		addressString += ", " + $("#countrySelector").val();
		
		$("#searchAddress").val(addressString);
			 
		searchByAddress();
	}
	
}

function populateCountrySelector(){
	
	hideStateSelector();
	clearStateSelector();
	hideCitySelector();
	clearCitySelector();
	
	var qsArgs = {};
	
	qsArgs["includeUSATop"] = true;
	qsArgs["includeCATop"] = true;	
	
	var jqxhr = $.getJSON( locationServiceURL + "v1/dealercountries", qsArgs);
	
	jqxhr.done(function(data) {
	    
		console.log( "populateCountrySelector() done: " + data);
	    
	    var myDropDown = $("#countrySelector");
	    
	    for(i in data){
	    	var newOption = $("<option value=\"" + i + "\">" + data[i] + "</option>");
	    	myDropDown.append(newOption);
	    }
	    
	    //by default, US is selected and the state selector is populate with states
    	myDropDown.val("US");
    	
    	populateStateSelector();
	    
	})
	  
	jqxhr.fail(function(data) {
		console.log( "populateCountrySelector() error: " + jqxhr.responseText );
	})
	  
	jqxhr.always(function(data) {
	});
	
}

function populateStateSelector(){
	
	hideStateSelector();
	clearStateSelector();
	hideCitySelector();
	clearCitySelector();
	
	var countryCode = $("#countrySelector").val();

	if(countryCode == "US"){
		$("#stateLabelSpan").html("State:");
	}else if(countryCode == "CA"){
		$("#stateLabelSpan").html("Province:");
	}

	var qsArgs = {};
	qsArgs["countryCode"] = countryCode;
	
	var jqxhr = $.getJSON( locationServiceURL + "v1/dealerstates", qsArgs);
	
	jqxhr.done(function(data) {
		
	    console.log( "populateStateSelector() done: " + data);
	    var myDropDown = $("#stateSelector"); 
	    
	    var newOption = $("<option value=\"-1\">--Select--</option>");
    	myDropDown.append(newOption);
    	myDropDown.val("-1");
	    
	    for(i in data){
	    	var newOption = $("<option value=\"" + i + "\">" + data[i] + "</option>");
	    	myDropDown.append(newOption);
	    }
	  
	    showStateSelector();
	    
	})
	  
	jqxhr.fail(function(data) {
		console.log( "populateStateSelector() error: " + jqxhr.responseText );
	})
	  
	jqxhr.always(function(data) {
	});
	
	
	
}

function populateCitySelector(){
	
	hideCitySelector();
	clearCitySelector();
	
	var qsArgs = {};
	qsArgs["countryCode"] = $("#countrySelector").val();
	qsArgs["stateCode"] = $("#stateSelector").val(); //if this is -1 or null or empty, the city list will be for the whole country
	
	var jqxhr = $.getJSON( locationServiceURL + "v1/dealercities", qsArgs);
	
	jqxhr.done(function(data) {
		
	    console.log( "populateCitySelector() done: " + data);
	    var myDropDown = $("#citySelector"); 
	    
	    var newOption = $("<option value=\"-1\">--Select--</option>");
    	myDropDown.append(newOption);
    	myDropDown.val("-1");
	    
	    for(i in data){
	    	var newOption = $("<option value=\"" + i + "\">" + data[i] + "</option>");
	    	myDropDown.append(newOption);
	    }
	  
	    showCitySelector();
	    
	})
	  
	jqxhr.fail(function(data) {
		console.log( "populateCitySelector() error: " + jqxhr.responseText );
	})
	  
	jqxhr.always(function(data) {
	});
	
}

function hideStateSelector(){
	$("#stateSelectorDiv").hide();
}
function showStateSelector(){
	$("#stateSelectorDiv").show();
}
function clearStateSelector(){
	$("#stateSelector").empty();
}

function hideCitySelector(){
	$("#citySelectorRow").hide();
}
function showCitySelector(){
	$("#citySelectorRow").show();
}
function clearCitySelector(){
	$("#citySelector").empty("");
}
