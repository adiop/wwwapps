$(document).ready(	function() {
	populateStateSelectors( ["US", "CA"] );
});

function populateStateSelectors(countryCodes){

	var qsArgs = {};
	qsArgs["countryCodes"] = countryCodes;
	
	var jqxhr = $.getJSON( "/wwwapps/api/shared/" + "v1/states", qsArgs);
	
	jqxhr.done(function(data) {
		
	    console.log( "populateStateSelectors() got data: " + data);

	    populateDropDownFromData( $("#physical_address_state"), data ); 

	    populateDropDownFromData( $("#mailing_address_state"), data ); 

	    console.log( "populateStateSelectors() done loading state drop downs");

	})
	  
	jqxhr.fail(function(data) {
		console.log( "populateStateSelector() error: " + jqxhr.responseText );
		$("messageSpan").html("ERROR: could not load state selectors for addresses. Please contact WARN.");
	})
	
}

function populateDropDownFromData(myDropDown, data){
    var newOption = $("<option value=\"\">Choose</option>");
	myDropDown.append(newOption);
	myDropDown.val("-1");
    
    for(i in data){
    	var newOption = $("<option value=\"" + i + "\">" + data[i] + "</option>");
    	myDropDown.append(newOption);
    }
}

function submitForm(){
	
	console.log("submitForm()");
	
	//rest endpoint POST access form-urlencoded
	var formServiceURL = "/wwwapps/api/retailer/v1";
	
	//trying to pass an HTML5 FormData object to the jqXHR is somewhat problematic.
	//see here: http://www.mattlunn.me.uk/blog/2012/05/sending-formdata-with-jquery-ajax/
	//you have to set  processData: false,  contentType: false, but this will cause the data to be sent as 
	//form multipart, so the REST endpoint has to be set up for that
	//TODO consider moving away from jquery xhr and just use vanilla javascript
	
	var formData = $("#rapp").serialize();
	
	//by default, type = post causes processData = true, which causes form data to be URL encoded
	//also by default, the contentType that will be sent will be "application/x-www-form-urlencoded"
	var jqxhr = $.ajax( {
	      url: formServiceURL,
	      type: 'POST',
	      data: formData,
	      processData: true,
	      contentType: "application/x-www-form-urlencoded"
	    } );
	
	console.log("done sending ajax, waiting");
	
	jqxhr.done( function(data, textStatus, xhr) {
	    
		var appURL = xhr.getResponseHeader("Location");
		console.log("Location response header was: " + appURL );
		
		var uuID =  xhr.getResponseHeader("UUID");

		//send them to the pdf signing page
		//cookie: default expiration, path and domain are OK for this 
		Cookies.set("retailerAppUUID", uuID);
		window.location = "signAgreement.htm";
	    
	})
	  
	jqxhr.fail( function(jqXHR, testStatus, errThrown) {
		console.log( "submitForm() error: " + jqxhr.responseText );
		var errMsg = "AJAX Error: \n " + jqxhr.responseText;
		alert(errMsg);
		//newTab.close(); //ep ?
	})
	  
}