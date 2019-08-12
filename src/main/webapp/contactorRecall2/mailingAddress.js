
$(document).ready(function() {

	var phone = getParameterValue("dealerPhone");//will look like this 111-222-3333
	if(!phone){
	
		alert("There is no phone number in the URL. You cannot create or edit a mailing address. Contact WARN.");

	}else{
		
		var action = getParameterValue("action");//create, update, delete
		$("#action").val(action);
		
		$("#phone").val(phone);
		if( action == "update" || action == "delete"){
			loadValuesIfExisting(phone);
		}
	}

});

function loadValuesIfExisting(phoneNum){

	var url = "/wwwapps/api/contactorrecall/mailingaddress/v1?phone=" + phoneNum;
	
	var jqxhr = $.get(url);
	
	console.log("done sending ajax, waiting");
	
	jqxhr.done( function(data, textStatus, xhr) {
	    
		console.log("jqxhr: done");
	    
    	//populate form values
	    $("#address1").val(data.address1);
	    $("#address2").val(data.address2);
	    
	    $("#city").val(data.city);
	    $("#zip").val(data.zip);

	    $("#stateCode").val(data.stateCode);
	    $("#countryCode").val(data.countryCode);
	    
	    var stateVal = data.stateCode + "~" + data.countryCode;
	    $("#state").val(stateVal);
	    
	})
	  
	jqxhr.fail( function(jqXHR, testStatus, errThrown) {
		console.log( "submitForm() error: " + jqxhr.responseText );
		var errMsg = "Error: \n " + jqxhr.responseText;
		alert(errMsg);
	})
}

function save(event) {

	event.preventDefault();
	
	var results = validate();
	if (results == "") {

		console.log("passed validation");
		if($("#action").val() == "create"){
			createOnServer();
		}else if( $("#action").val() == "update"){
			updateOnServer();
		}

		
	} else {
		alert(results);
		return false;
	}
}

function validate() {
	var errors = "";

	if ( $("#address1").val().length < 1) {
		errors += "Please enter a street address\n";
	}
	if ( $("#city").val().length < 1) {
		errors += "Please enter a city\n";
	}
	if ( $("#state").val() == '-1') {
		errors += "Please select a state or province\n";
	}
	if ( $("#zip").val().length < 1) {
		errors += "Please enter a Zip code\n";
	}

	return errors;
}

function createOnServer(){
	createOrUpdateOnServer("POST");
}

function updateOnServer(){
	createOrUpdateOnServer("PUT");
}

function createOrUpdateOnServer(ajaxType){
	var formServiceURL = "/wwwapps/api/contactorrecall/mailingaddress/v1";
	
	var formData = $("#addressForm").serialize();
	
	var jqxhr = $.ajax( {
	      url: formServiceURL,
	      type: ajaxType,
	      data: formData,
	      processData: true,
	      contentType: "application/x-www-form-urlencoded"
	    } );
	
	console.log("done sending ajax, waiting");
	
	jqxhr.done( function(data, textStatus, xhr) {
	    console.log("jqxhr: done");
    	window.location = "laborReimbursement.htm?phone=" + $("#phone").val()
	    
	})
	  
	jqxhr.fail( function(jqXHR, testStatus, errThrown) {
		console.log( "submitForm() error: " + jqxhr.responseText );
		var errMsg = "Error: \n " + jqxhr.responseText;
		alert(errMsg);
	})
}

function stateSelectorChanged(){
	
	var stateCountryCode = $("#state").val();//like "GA~US"
	
	var stateCode = stateCountryCode.substring(0, stateCountryCode.indexOf("~"));
	var countryCode = stateCountryCode.substring(stateCountryCode.indexOf("~") + 1);

	$("#stateCode").val(stateCode);
    $("#countryCode").val(countryCode);
    
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

