$(document).ready(function() {
	
	//NOTE this JS code is shared between the consumer and dealer  order forms
	
	//set the ATV make selector to query string val
	var qsMake = getParameterValue("make");
	if(qsMake != null && qsMake != ""){
		qsMake = decodeURIComponent(qsMake);
	}
	
	if(qsMake != null && qsMake == "Arctic Cat"){
		var qsArcticCatVerified = getParameterValue("acverified");
		if(qsArcticCatVerified != 1){
			alert("You have selected ATV Make of \"Arctic Cat\". There is a special notification that you must read before you come to this order form. Redirecting you there now.");
			window.location = "arcticCat.htm";
		}
	}
	
	if(qsMake != null && qsMake != ""){
		$("#make").val(qsMake);
	}
	
	if( $("#userType").val() == 2){//we are in dealer form

		//if a dealer is using this, make the phone number what he put in earlier
		var dealerPhone = getParameterValue("phone");//will look like this 111-222-3333
		$("#phone").val(dealerPhone);

		//try to load a dealer for this phone number, if none found, assume new
		loadDealerFormForPhone(dealerPhone);
		
	}
	
	//if consumer, when they enter a vin, disable the "no vin excuse" field
	$( "#vin" ).keyup(function() {
		if( $("#vin").val() == ""){
			$("#notes").prop("disabled", false);
			$(".vinExcuseRow").css("color", "black");
		}else{
			$("#notes").val("");
			$("#notes").prop("disabled", true);
			$(".vinExcuseRow").css("color", "grey");
		}
	});
	
});

function loadDealerFormForPhone(dealerPhone){
	
	var formServiceURL = "/wwwapps/api/contactorrecall/recalluser/v1?userType=2&phone=" + dealerPhone;
	
	var jqxhr = $.ajax( {
	      url: formServiceURL,
	      method: 'GET'
	    } );
	
	console.log("done sending ajax, waiting");
	
	jqxhr.done( function(data, textStatus, xhr) {
	    console.log("get dealer is done, loading form");
	    
	    $("#name").val(data.name);
	    $("#company").val(data.company);
	    
	    $("#address1").val(data.address1);
	    $("#address2").val(data.address2);
	    $("#city").val(data.city);
	    $("#state").val(data.stateCode + "~" + data.countryCode);
	    $("#zip").val(data.zip);
	    
	    $("#fax").val(data.fax);
	    $("#email").val(data.email);
	    $("#means_of_notification").val(data.notifiedBy);
	    
	    //from legacy, some fields are not changeable
	    $("#company").prop("readonly", true);
	    //we can't just disable the whole dropdown or the form value will not be submitted at all
	    $('#state option:not(:selected)').attr('disabled', true);

	})
	  
	jqxhr.fail( function(xhr, textStatus, errThrown) {
		console.log( "submitForm() error");
		//TODO check error to see if the user was not found, should make error type 404
		//in which case we just leave the form blank except for phone number
		var msg = xhr.getResponseHeader("MESSAGE");
		var errMsg = "Error: \n " + msg;
		console.log(errMsg);


	})
	
}
 

function stateChanged() {

	//this is to make sure that if the user selects country other than USA
	//that they have to check "acknowledged_service_outside_us" yes
	
	//the value from the state selecotr is a name value pair like 
	//"AK~US">Alaska or	<option value="AB~CA">Alberta
	//get the country code
	var stateCountryVal = $("#state").val();
	var countryVal = stateCountryVal.substring(stateCountryVal.indexOf('~') + 1).toUpperCase();

	//this code only applies to consumers form, dealer dont have to sign 
	if( $("#userType").val() == 1){
		//reset acknowledge checkbox to no
		$("input[name=acknowledged_service_outside_us][value=No]").prop('checked', true);
	
		if(countryVal == "US" || countryVal == "-1"){
			
			//if the country is US, , OR they selected "Please Select" -1, enable the submit button, disable acknowledge block
			$("#outsideClaimsRow").css('color', '#bbb');
			$("#submitButton").prop("disabled", false);
			$("input[name=acknowledged_service_outside_us]").prop('disabled', true);
			
		}else{
	
			//if the country was not US
			//disable the submit button and enable the acknowlegde block
			$("#outsideClaimsRow").css('color', 'black');
			$("#submitButton").prop("disabled", true);
			$("input[name=acknowledged_service_outside_us]").prop('disabled', false);
	
		}
	}
	
}

function acknowledgedChanged(){
	//this should only be changeable if the country is not US, assume not US
	var acknowledgeChecked = $("input[name=acknowledged_service_outside_us]:checked").val();
	console.log("ack val is " + acknowledgeChecked);

	if(acknowledgeChecked == "Yes"){
		$("#submitButton").prop("disabled", false);
	}else{
		$("#submitButton").prop("disabled", true);
	}
		
}

function save(event) {

	event.preventDefault();
	
	var results = validate();
	
	if (results == "") {
		
		$("#jstest").val("CDO1234");
		submitForm();
		
	} else {
		//submit failed validation, reenable submit button
		alert(results);
		$("#submitButton").prop("disabled", false);
	}
}

function validate() {

	var errors = "";

	var userIsConsumer = true;
	var userIsDealer = false;
	if ( $("#userType").val() == '2' ) {
		userIsConsumer = false;
		userIsDealer = true;
	}
	
	if ( isEmpty("#name") ) {
		if (userIsConsumer) {
			errors += "Please enter your Name\n";
		} else {
			errors += "Please enter a Contact Name\n";
		}
	}
	
	if (userIsDealer) { //company name only exists for dealer, and is required
		if ( isEmpty("#company") ) {
			errors += "Please enter your Comany Name\n";
		}
	}
	
	if ( isEmpty("#address1") ) {
		errors += "Please enter a street address\n";
	}
	
	if ( isEmpty("#city") ) {
		errors += "Please enter a city\n";
	}
	
	if ( isEmpty("#state") || $("#state").val() == -1) {
		errors += "Please select a state or province\n";
	}
	
	if ( isEmpty("#zip") ) {
		errors += "Please enter a Zip code\n";
	}
	
	if ( isEmpty("#phone") ) {
		errors += "Please enter a Phone number\n";
	}
	
	if (userIsDealer) { //fax required on dealer form
		if ( isEmpty("#fax") ){
			errors += "Please enter a Fax number\n";
		}
	}
	
	if ( isEmpty("#means_of_notification") || $("#means_of_notification").val() == "1") {
		errors += "Please choose how you where notified of this recall\n";
	}
	
	//some fields are only on the consumer form
	if (userIsConsumer) {
		if ( isEmpty("#product") || $("#product").val() == 1 ) {
			errors += "Please chose which Product you own\n";
		}
		if ( isEmpty("#date_purchased") ) {
			errors += "Please enter the Date Purchased\n";
		}
		if ( isEmpty("#make") ) {
			errors += "Please Select the Make of your ATV\n";
		}
		if ( isEmpty("#model") ) {
			errors += "Please enter the Model of your ATV\n";
		}
		if ( isEmpty("#year") ) {
			errors += "Please enter the Year of your ATV\n";
		}
		if ( isEmpty("#vin") && isEmpty("#notes")) {
			errors += "Explanation is required if not entering VIN#\n";
		}
	}
	
	try {
		var sval = "";
		var scon = "";
		
		sval = $("form select[name='state'] option:selected").val();

		scon = sval.substring(sval.indexOf('~') + 1).toUpperCase();

		if (scon.length > 0) {
			if (scon == 'CA') {
				var ackVal = $("input[name=acknowledged_service_outside_us]:checked").val();
				if (ackVal == 'No') {
					errors += "Please acknowledge that services were performed outside the US\n";
				}
			}
		}
	} catch (err) {
		errors += err.message;
	}

	return errors;
}

function submitForm(){
	console.log("submitForm()");
	
	//keep them from spamming button
	$("#submitButton").prop("disabled", true);
	
	
	var formServiceURL = "/wwwapps/api/contactorrecall/recalluser/v1";
	
	var formData = $("#recall").serialize();
	
	//by default, type = post causes processData = true, which causes form data to be URL encoded
	//also by default, the contentType that will be sent will be "application/x-www-form-urlencoded"
	var jqxhr = $.ajax( {
	      url: formServiceURL,
	      method: 'POST',
	      data: formData,
	      processData: true,
	      contentType: "application/x-www-form-urlencoded"
	    } );
	
	console.log("done sending ajax, waiting");
	
	jqxhr.done( function(data, textStatus, xhr) {
	    console.log("jqxhr: done, responseText = " + xhr.responseText);
		console.log("headers " + xhr.getAllResponseHeaders());

		var phoneNumber = xhr.getResponseHeader("ID");
    	window.location = "orderConfirm.htm?usertype=" + $("#userType").val() + "&phone=" + phoneNumber;
	    
	})
	  
	jqxhr.fail( function(xhr, textStatus, errThrown) {
		console.log( "submitForm() error");
		var msg = xhr.getResponseHeader("MESSAGE");
		var errMsg = "Error: \n " + msg;
		alert(errMsg);
		//reenable button
		$("#submitButton").prop("disabled", false);

	})
		  
}

function isEmpty(fieldID){
	if( ! $(fieldID).val() || $(fieldID).val().length < 1){
		return true;
	}else{
		return false;
	}
}

function getParameterValue(param) {  
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');  
    for (var i = 0; i < url.length; i++) {  
        var urlparam = url[i].split('=');  
        if (urlparam[0] == param) {  
            return urlparam[1];  
        }  
    }  
} 