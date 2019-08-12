
$( document ).ready( function() { 
	
	//only enable create application button if they have checked the read agreement box
	$('#accept, #read_agreement, #signed_by, #title').bind(
		'click keyup',
		function() {
			if (
				$('#accept').is(':checked')
				&& $('#read_agreement').is(':checked')
				&& $('#signed_by').val().length > 0
				&& $('#title').val().length > 0
			) {
				$("#signButton").removeAttr('disabled');
			} else {
				$("#signButton").attr('disabled', 'disabled');
			}
		}
	);
	
	//set the value of the hidden uuID form field
	var uuID = Cookies.get("retailerAppUUID");
	$("#uuID").val(uuID);
	
});
	 
function downloadAgreement(){

	window.open("/wwwapps/retailer/ApplicationPDF", "_blank");
}

function aggreeAndSign(){
	
	var uuID = Cookies.get("retailerAppUUID");
	var formServiceURL = "/wwwapps/api/retailer/v1/" + uuID + "/sign";

	var formData = $("#rapp").serialize();

	var jqxhr = $.ajax( {
	      url: formServiceURL,
	      type: "PUT",
	      data: formData,
	      processData: true,
	      contentType: "application/x-www-form-urlencoded"
	    } );
	
	console.log("done sending ajax, waiting");
	
	jqxhr.done( function(data, textStatus, jqXHR) {
	    
		var appID = jqXHR.getResponseHeader("Location");
		console.log( "submitForm() done: textStatus = " + textStatus + " and data = " + data);
		window.location.assign("thanks.htm");
	    
	})
	  
	jqxhr.fail( function(jqXHR, testStatus, errThrown) {
		console.log( "submitForm() error: " + jqxhr.responseText );
		var errMsg = "Error Signing: \n\n " + jqxhr.responseText;
		errMsg += "\n\n Please contact WARN. ";
		alert(errMsg);
	})
	  

}
/*
function getParameterByName(name, url) {
    
	if (!url) url = window.location.href;
    
    name = name.replace(/[\[\]]/g, "\\$&");
    
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    
    if (!results) return null;
    
    if (!results[2]) return '';
    
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
*/