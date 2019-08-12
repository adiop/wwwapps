
 $( function() {
    $( "#date" ).datepicker();
  } );
 
function save() {
	var doc = document.register;
	var results = validate();
	if (results == "") {
		doc.jstest.value = 'cdo1234';
		
		return true;
	} else {
		alert(results);
		return false;
	}
}

function validate() {
	
	var errors = "";
	var doc = document.register;
	if (doc.first_name.value.length < 1) {
		errors += "Please enter a First name\n";
	}
	if (doc.last_name.value.length < 1) {
		errors += "Please enter a Last name\n";
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

	if (doc.city.value.length < 1) {
		errors += "Please enter a city\n";
	}
	if (doc.state.value.length < 1) {
		errors += "Please enter a state\n";
	}
	if (doc.country.value.length < 1) {
		errors += "Please enter a Country\n";
	}
	if (doc.zip.value.length < 1) {
		errors += "Please enter a Zip code\n";
	}
	if (doc.date.value.length < 1) {
		errors += "Please enter the Date Purchased\n";
	}
	if (doc.product.value.length < 1) {
		errors += "Please enter the Product/Model Number\n";
	}

	return errors;
}