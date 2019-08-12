function save(evt) {
	
	evt.preventDefault();
	
	var results = validate();
	if (results == "") {
		submitForm();
	} else {
		alert(results);
	}
}

function validate() {

	var errors = "";

	var doc = document.rld_request;

	if (doc.store_name.value.length < 1) {
		errors += "Please enter a Store name\n";
	}

	if (doc.store_address.value.length < 1) {
		errors += "Please enter a Store Address\n";
	}

	if (doc.city.value.length < 1) {
		errors += "Please enter a city\n";
	}

	if (doc.state.value.length < 1) {
		errors += "Please enter a state\n";
	}

	if (doc.zip.value.length < 1) {
		errors += "Please enter a Zip code\n";
	}

	if (doc.owner.value.length < 1) {
		errors += "Please enter a Owner/Manager\n";
	}

	if (doc.phone.value.length < 1) {
		errors += "Please enter a Phone Number\n";
	}

	if (doc.email.value.length < 1) {
		errors += "Please enter an email address\n";
	} else {

		if (doc.email.value.indexOf('@') == -1) {
			errors += "Your email address must contain a @ to be valid\n";
		} else if (doc.email.value.indexOf('.') == -1) {
			errors += "Your email address must contain a . to be valid\n";
		} else if (doc.email.value.indexOf(' ') != -1) {
			errors += "Your email address can NOT contain spaces\n";
		} else if (doc.email.value.indexOf(';') != -1) {
			errors += "Your email address can NOT contain ;\n";
		}

	}
	
	//ep?
	doc.jtest.value = 'CDO123';

	return errors;
}

function submitForm(){
	
	console.log("submitForm()");
	
	var formServiceURL = "/wwwapps/api/rldrequest/v1";
	var formData = $("#rld_request").serialize(); //this is NOT a formData object
	console.log("formData was " + formData);
	
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
		
		window.location = "thanks.htm";
	    
	})
	  
	jqxhr.fail( function(jqXHR, testStatus, errThrown) {
		console.log( "submitForm() error: " + jqxhr.responseText );
		var errMsg = "Error: \n " + jqxhr.responseText;
		alert(errMsg);
	})
	  
}


