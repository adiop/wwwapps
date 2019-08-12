(function(i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function() {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
	a = s.createElement(o), m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m)
})(window, document, 'script',
		'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-304623-1', 'auto');
ga('send', 'pageview');

$(document).ready(function() {

	setDisplayBasedOnIPCountry();

});

function setDisplayBasedOnIPCountry(){
	
	var formServiceURL = "/wwwapps/api/shared/geoip/v1";

	//is asynch cause it makes a big dif
	//about what the user sees
	var jqxhr = $.ajax({
		url : formServiceURL,
		method : 'GET'
	});

	jqxhr.done(function(data, textStatus, xhr) {
		
		console.log("geoip ajax done, data.countryCode = " + data.countryCode);
		var isUSOrCanada = false;
		if(data.countryCode == "US" || data.countryCode == "CA"){
			isUSOrCanada = true;
		}

		$("#waitMessageDiv").hide();

		if(isUSOrCanada){
			
			$("#formDiv").show();
			$("#nonUSorCanadaDiv").hide();
			setSelectorAndLoadDealers();
			
		}else{
			
			$("#formDiv").hide();
			$("#nonUSorCanadaDiv").show();
			
		}

	})

	jqxhr.fail(function(xhr, textStatus, errThrown) {
		
		console.log("geoip fail. responseText = " + xhr.responseText)
		
		$("#waitMessageDiv").hide();
		var msg = xhr.getResponseHeader("MESSAGE");
		var errMsg = "Error: \n " + msg;
		$("#messageSpan").html("<br>" + errMsg + "<br>Please notify Warn and include this error.");

	})

	
	return false;

}

function setSelectorAndLoadDealers(){

	//we set the product type dropdown based on the referring page
	var productKey = "winches_truck";
	var referer =  document.referrer;
	var productArg = getParameterValue("productSelector"); //from qs
	
	if (!productArg) {
		//we have no qs arg, infer from referer url
	    if (referer) {
	        if (referer.indexOf("/truck/") > 0) {
	        	productKey = "winches_truck";
	            if (referer.indexOf("/truck/hubs/") > 0) {
	            	productKey = "hubs";
	            }
	        }
	        if (referer.indexOf("/atv/") > 0) {
	        	productKey = "winches_atv";
	        }
	        if (referer.indexOf("/lights/") > 0) {
	        	productKey = "lights";
	        }
	        if (referer.indexOf("/plows/") > 0) {
	        	productKey = "plows";
	        }
	    }
	} else {
	    productKey = productArg;
	}

	$("#productSelector").val(productKey);
	
	
	getAndDisplayDealers(productKey);
	
}

function getAndDisplayDealers(productKey){
	
	var formServiceURL = "/wwwapps/api/webdealer/v1" + "?productKey=" + productKey;

	var jqxhr = $.ajax({
		url : formServiceURL,
		method : 'GET'
	});

	jqxhr.done(function(data, textStatus, xhr) {
		
		console.log("dealers list ajax done");
		displayDealers(data);

	})

	jqxhr.fail(function(xhr, textStatus, errThrown) {
		console.log("responseText = " + xhr.responseText)
		var msg = xhr.getResponseHeader("MESSAGE");
		var errMsg = "Error: \n " + msg;
		alert(errMsg);

	})

}

function displayDealers(dealers){
	
	// after this the divs are laid out in columns based on css 
	// TODO data stores off most of path to the web dealer image in displayName????, but it moved, take out path info from DB 
	// example of a webDealer.displayName is "/images/webdealers/onlinedealer-Northridge4x4.gif" 
	//	List<WebDealer> webDealers = WebDealer.getWebDealersFor(productKey); 

	var dealerDivs = "";
	var divHTML = "";
	for(var i = 0; i < dealers.length; i++){
		
		var webDealer = dealers[i];
		
		divHTML = "<div onclick=\"forwardWithReferral( " + webDealer.id + ", '" + webDealer.url + "' ); \" >";
		divHTML += "<img border=\"0\" src=\"/wwwapps/webdealers" + webDealer.displayName + "\" />";
		divHTML += "</div>";
		
		dealerDivs += divHTML;
	}

	$("#dealersCell").html(dealerDivs);
	
	
}

function forwardWithReferral(dealerID, webDealerURL){

	//save that this dealers link was clicked on
	//then forward to the web dealers page
	
	var formServiceURL = "/wwwapps/api/webdealer/addclick/v1" + "?dealerID=" + dealerID;

	//TODO: this might should be a post
	var jqxhr = $.ajax({
		url : formServiceURL,
		method : 'GET'
	});

	jqxhr.done(function(data, textStatus, xhr) {
		console.log("addclick ajax done");
	})

	jqxhr.fail(function(xhr, textStatus, errThrown) {

		$("#formDiv").hide();
		$("#nonUSorCanadaDiv").hide();
		
		console.log("responseText = " + xhr.responseText)
		var msg = xhr.getResponseHeader("MESSAGE");
		if(!msg && xhr.status == 404){
			msg = "Click service not found. Please contact WARN.";
		}
		var errMsg = "Error: \n " + msg;
		$("#messageSpan").html(errMsg);

	})
	
	console.log("about to location to " + webDealerURL);
	window.open( webDealerURL, "_blank");

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



