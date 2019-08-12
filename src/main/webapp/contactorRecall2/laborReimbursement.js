$(document).ready(function() {
	
	var dealerPhone = getParameterValue("phone");//will look like this 111-222-3333
	if(!dealerPhone){
		
		alert("No phone number was supplied. You cannot submit a claim.");
		$("#dealerNotFound").show();
		
	}else{
		
		$("#dealerPhoneSpan").text(dealerPhone);
		$("#phone").val(dealerPhone);
		
		//try to get the dealer for this phone number
		loadValuesIfExisting(dealerPhone);
	}


	
});

function loadValuesIfExisting(phoneNum){

	var url = "/wwwapps/api/contactorrecall/recalluser/v1?phone=" + phoneNum;
	
	var jqxhr = $.get(url);
	
	console.log("done sending ajax, waiting");
	
	jqxhr.done( function(data, textStatus, xhr) {
	    
		$("#dealerFound").show();
		
		console.log("jqxhr: done");
	    
		$("#name").text(data.name);
		$("#company").text(data.company);
		
		$("#address1").text(data.address1);
	    if(data.address2 && data.address2.length > 0){
	    	$("#address2").html(data.address2 + "<br>");
	    }
	    
	    $("#city").text(data.city);
	    $("#stateCode").text(data.stateCode);
	    $("#zip").text(data.zip);
	    $("#countryCode").text(data.countryCode);
	    
	    $("#phoneDisplay").text(data.phone);
	    
	    if(data.hasSeparateMailAddress && data.hasSeparateMailAddress == true){
	    	$("#hasSeparateMailAddresss").show();
	    	$("#sameAsShipping").hide();
	    	
			$("#mailAddress1").text(data.mailAddress1);
		    if(data.mailAddress2 && data.mailAddress2.length > 0){
		    	$("#mailAddress2").html(data.mailAddress2 + "<br>");
		    }
		    
		    $("#mailCity").text(data.mailCity);
		    $("#mailStateCode").text(data.mailState);
		    $("#mailZip").text(data.mailZIP);
		    $("#mailCountryCode").text(data.mailCountry);
	    	
	    }else{
	    	$("#hasSeparateMailAddresss").hide();
	    	$("#sameAsShipping").show();
	    	
	    }
	    
	    $("#contactorsIssued").text(data.contactorsIssued);
	    $("#contactorsClaimed").text(data.contactorsClaimed);
	    
	    if( data.contactorsClaimed < data.contactorsIssued){
	    	$("#mustFileClaims").show();
	    }else{
	    	$("#orderMoreContactors").show();
	    }
	    
	    loadPaymentHistory(data.dealerPayments);
	    
	})
	  
	jqxhr.fail( function(jqXHR, testStatus, errThrown) {
		console.log( "submitForm() error: " + jqxhr.responseText );
		$("#dealerNotFound").show();
	})
}

function loadPaymentHistory(dealerPayments){

	var dp;
	var arLen = dealerPayments.length;
	for(var i = 0; i < arLen; i++){
		dp = dealerPayments[i];
		
		var rowData = "<tr class='dataRow' >";
		rowData += "<td valign='top'>" + dp.name + "<br>" + dp.phone + "</td>";
		
		rowData += "<td valign='top'>" + dp.address1 + "<br>";
		if(dp.address2){
			rowData += dp.address2 + "<br>"; 
		}
		rowData += dp.city + ", " + dp.state + "<br>";
		rowData += dp.zip + " " + dp.country;
		rowData += "</td>";

		rowData += "<td valign='top'>" + dp.make + " " + dp.model + "</td>";
		rowData += "<td valign='top'>" + dp.product + "</td>";

		rowData += "<td valign='top'>" + dp.dateRepaired + "</td>";
		rowData += "<td valign='top'>" + dp.whoReplaced + "</td>";
		rowData += "<td valign='top'>" + dp.vin + "</td>";

		if(dp.status == "Other"){
			rowData += "<td valign='top'>Other:<br>" + dp.reasonDisapproved + "</td>";
		}else{
			rowData += "<td valign='top'>" + dp.status + "</td>";
		}
		rowData += "<td valign='top'>" + dp.id + "</td>";

		rowData += "</tr>";
		
		$('#dealerPayments tbody').append(rowData);
		
	}
	
}
    
function next(){
    //we had to submit the phone number again
    window.location='?phone=' + $("#phone").val();
}

function createMailingAddress(){
	window.location = "mailingAddress.htm?action=create&dealerPhone=" + $("#phone").val();  
}

function editMailingAddress(){
	window.location = "mailingAddress.htm?action=update&dealerPhone=" + $("#phone").val();
}

function addClaim(){
	window.location = "fileClaim.htm?dealerPhone=" + $("#phone").val();
}

function orderContactor(){
    window.location = 'orderFormDealer.htm?phone=' +  $("#phone").val();
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

    
