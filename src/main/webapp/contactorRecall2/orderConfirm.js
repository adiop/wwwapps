$(document).ready(function() {

	// get phone from qs, load values
	var qsPhone = getParameterValue("phone");
	if (qsPhone != null && qsPhone != "") {
		qsPhone = decodeURIComponent(qsPhone);
	}

	if (!qsPhone || qsPhone.length == 0) {
		alert("no phone number supplied in QS, cannot load info.");
	} else {
		var qsUserType = getParameterValue("usertype");
		loadRecallInfo(qsUserType, qsPhone);
	}

});

function loadRecallInfo(userType, phone) {

	var formServiceURL = "/wwwapps/api/contactorrecall/recalluser/v1"	+ "?userType=" + userType + "&phone=" + phone;

	var jqxhr = $.ajax({
		url : formServiceURL,
		method : 'GET'
	});

	jqxhr.done(function(data, textStatus, xhr) {
		
		$("#details").show();
		
		//console.log("jqxhr: done, responseText = " + xhr.responseText);
		if(data.userType == "1"){ //1 is consumer
			$("#nameName").html("Name:");
			$("#companyRow").hide();
		}else{ //2 is dealer
			$("#nameName").html("Contact Name:");
			$("#companyRow").show();
			$("#company").html(data.company);
		}
		
		$("#name").html(data.name);
		
		$("#address1").html(data.address1 + "<br>");
		if(data.address2){
			$("#address2").html(data.address2 + "<br>");
		}
		$("#city").html(data.city + ", ");
		$("#stateCode").html(data.stateCode);
		$("#zip").html(data.zip);
		$("#countryCode").html(data.countryCode);
		
		$("#phone").html(data.phone);
		
		$("#vin").html(data.vin);
		
		var userType = getParameterValue("usertype");
		if(userType == 2){
			$("#backToDealerDiv").html("<br><a href='laborReimbursement.htm?phone=" + data.phone + "'>Your summary.</a>");
		}
		

	})

	jqxhr.fail(function(xhr, textStatus, errThrown) {
		console.log("responseText = " + xhr.responseText)
		var msg = xhr.getResponseHeader("MESSAGE");
		var errMsg = "Error: \n " + msg;
		$("#errorMsg").html(msg);
		//alert(errMsg);

	})

}

function getParameterValue(param) {
	var url = window.location.href.slice(window.location.href.indexOf('?') + 1)
			.split('&');
	for (var i = 0; i < url.length; i++) {
		var urlparam = url[i].split('=');
		if (urlparam[0] == param) {
			return urlparam[1];
		}
	}
}