$(document).ready(function() {

	var dealerPhone = getParameterValue("dealerPhone");//will look like this 111-222-3333
	if(!dealerPhone){
		alert("You do not have a dealer phone number. You cannot submit a claim.");
	}else{
		$("#dealerPhone").val(dealerPhone);//hidden field
	}
	
	$( "#dateRepaired" ).datepicker();
	
	$("#dealerVinRow").hide();
	$("#dealerNoVinRow").hide();
	
	//if they enter a vin, disable the "no vin excuse" field
	$( "#vin" ).keyup(function() {

		if( $("#vin") && $("#vin").val().trim() == ""){
			//if vin is empty, enable checkbox
			$("#dealerNoVinRow").css("color", "black");
			$("#no_vin").prop( "disabled", false );
			
		}else{
			//if vin has content, disable checkbox
			$("#dealerNoVinRow").css("color", "grey");
			$("#no_vin").prop( "disabled", true );
			
		}
	});
	
	//if they check the no_vin checkbox, blank and disable the vin text box
	$( "#no_vin").change(function() {
		if( $("#no_vin").is(":checked") ){
			$("#vin").val("");
			$("#vin").prop( "disabled", true );
		}else{
			//if they uncheck, reenable the vin text box
			$("#vin").prop( "disabled", false );
		}
	});
	
});

function phoneFilter(evt) {

	var keynum = evt.keyCode || e.which;
	
	var keychar = String.fromCharCode(keynum);
	
	var rval = true;
	if (isNaN(keychar) && keychar != '-') {
		rval = false;
	}
	return rval;
}

function stateChanged() {

	//this is to make sure that if the user selects country other than USA
	//that they have to check "acknowledged_service_outside_us" yes

	//the value from the state selecotr is a name value pair like 
	//"AK~US">Alaska or	<option value="AB~CA">Alberta
	//get the country code
	var stateCountryVal = $("#state").val();
	var stateVal = "";
	var countryVal = "";
	
	if(stateCountryVal != "-1"){
		//-1 means they selected "please selected"
		stateVal = stateCountryVal.substring(0, stateCountryVal.indexOf('~')).toUpperCase()
		countryVal = stateCountryVal.substring(stateCountryVal.indexOf('~') + 1).toUpperCase()
	}

	$("#stateCode").val(stateVal);
	$("#country").val(countryVal);
	
	//no matter what reset checkbox to No
	$("input[name=acknowledged_service_outside_us][value=No]").prop('checked', true);

	if(countryVal == "US"){

		//if the country is US, enable the submit button, disable acknowledge block
		$("#outsideClaimsRow").css('color', '#bbb');
		$("input[name=acknowledged_service_outside_us]").prop('disabled', true);
		$("#submitButton").prop("disabled", false);

	}else if(countryVal == ""){
		//they selected "please select" reset all to original
		$("#outsideClaimsRow").css('color', '#bbb');
		$("input[name=acknowledged_service_outside_us]").prop('disabled', true);
		$("#submitButton").prop("disabled", true);

	}else{

		//if the country was not US, disable the submit button and enable the acknowlegde block
		$("#outsideClaimsRow").css('color', 'black');
		$("input[name=acknowledged_service_outside_us]").prop('disabled', false);
		$("#submitButton").prop("disabled", true);

	}
	
}

function changeWho(){
	var whoReplaced = $("input[type=radio][name=who_replaced]:checked").val();
	
	if(whoReplaced == "Dealer"){
		$("#dealerVinRow").show();
		$("#dealerNoVinRow").show();
	}else{
		$("#dealerVinRow").hide();
		$("#dealerNoVinRow").hide();
	}
}

function changeAcknowledged(){
	
	var ackChecked =  $("input:radio[name=acknowledged_service_outside_us]:checked").val();

	var stateCountryVal = $("#state").val();
	var stateVal = "";
	var countryVal = "";
	
	if(stateCountryVal != "-1"){
		//-1 means they selected "please selected"
		stateVal = stateCountryVal.substring(0, stateCountryVal.indexOf('~')).toUpperCase()
		countryVal = stateCountryVal.substring(stateCountryVal.indexOf('~') + 1).toUpperCase()
	}

	//if the country is not US, and they check yes, enable the button
	if(countryVal != "US" && countryVal != ""){
		if(ackChecked == "Yes"){
			$("#submitButton").prop("disabled", false);
		}else{
			$("#submitButton").prop("disabled", true);
		}
	}
}

function save() {

	var results = validate();

	if (results == "") {
		
		var dealerPhone = getParameterValue("dealerPhone");
		if(dealerPhone.length < 1){
			alert("You do not have a dealer phone number. You cannot submit a claim.");
		}
		
		console.log("submitForm()");
		
		var formServiceURL = "/wwwapps/api/contactorrecall/dealerpayment/v1";
		
		var formData = $("#dealerPayment").serialize();
		
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
		    console.log("jqxhr: done");
		    alert("Claim added and awaiting review by Warn.")
		    
	    	window.location = "laborReimbursement.htm?phone=" + $("#dealerPhone").val();
		    
		})
		  
		jqxhr.fail( function(jqXHR, testStatus, errThrown) {
			console.log( "submitForm() error: " + jqxhr.responseText );
			var errMsg = "Error: \n " + jqxhr.responseText;
			alert(errMsg);
		})
		  
	} else {
		alert(results);
	}
}

function validate() {

	var errors = "";

	if ( $("#name").val().length < 1) {
		errors += "Please enter the ATV Owner Name\n";
	}
	if ( $("#phone").val().length < 1) {
		errors += "Please enter a Phone number\n";
	}
	
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

	if ( $("#dateRepaired").val().length < 1) {
		errors += "Please enter the Date Repaired\n";
	}
	
	if ( $("#make").val() == "1") {
		errors += "Please Select the Make of the ATV\n";
	}
	if ( $("#model").val() < 1) {
		errors += "Please enter the Model of the ATV\n";
	}
	
	var whoReplaced = $("input[type=radio][name=who_replaced]:checked").val();
	if ( whoReplaced == 'Dealer') {
		
		var vinNum = $("#vin").val();
		var noVinChecked = $("#no_vin").is(':checked');
		
		if ( vinNum.length < 1 && !noVinChecked ) {
			errors += "Please enter the VIN# of the ATV OR check the box acknowledging that you will not be paid.\n";
		}
	}

	var selectedVal = $("form select[name='state'] option:selected").val();
	var countryCode = selectedVal.substring(selectedVal.indexOf('~') + 1).toUpperCase();
	if (countryCode.length > 0) {
		if (countryCode == 'CA') {
			if ( $("#acknowledged_service_outside_us").val() == 'No') {
				errors += "Please acknowledge that services were performed outside the US\n";
			}
		}
	}

	return errors;
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
