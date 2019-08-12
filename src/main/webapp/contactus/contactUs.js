
	function refresh() {
		var doc = document.contact;
		var url = "contactus.jsp?refresh=true";
		
		var x = 0;
		for (x = 0; x < doc.length; x++) {
			var add = false;
			var e = doc.elements[x];
			if (e.type != "button") {
				
				if (e.type == "radio" || e.type == "checkbox") {
					if (e.checked) {
						add = true;
					}
				} else {
					add = true;
				}
				
				if (add) {
					url += "&" + e.name + "=" + escape(e.value);
				}
			}
		}
		window.location = url;
	}
	
	function validate() {
		var errors = "";
		var doc = document.contact;

		if (doc.first_name.value.length < 1) {
			errors += "Please enter a first name\n";
		}

		if (doc.last_name.value.length < 1) {
			errors += "Please enter a last name\n";
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
			}
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
		if (doc.country_code.value.length < 1) {
			errors += "Please select a Country\n";
		}
		if (doc.subject.value.length < 1) {
			errors += "Please enter a subject\n";
		}
		if (doc.comment.value.length < 1) {
			errors += "Please enter a message\n";
		}
		return errors;
	}
	
	function save() {

		var results = validate();

		if (results == "") {
			return true;
		} else {
			alert(results);
			return false;
		}
	}
	
	$(document).ready(function() {
		//ep: moved this code from the page. I'm not sure why they used so many hidden fields
		
		//ep: if you change the classifiation to sponsorship, it will take you to the sponsorship request form 
		$(".classification").change(function() {
			if ($(this).val() == "Sponsorship") {
				window.location = "/wwwapps/sponsorrequest/sponsorRequest.jsp";
			}
		});
		
		//store off the value of the checked Classification/nature name radio button
		$("input[name=natureid]:radio").change(function () {
			var areaName = $("input[name=natureid]:checked").next().text();
			$("#natureName").val(areaName);
		});
		
		$("input[name=natureid][value='1']").click();

		
		//when the regarding/area id changes, change some hidden field
		$("input[name=areaid]:radio").change(function () {
			var areaName = $("input[name=areaid]:checked").next().text();
			$("#areaName").val(areaName);
		});
		
		$("input[name=areaid][value='4']").click();

		
		//when selector value changes, change value of hidden field to be selected option label
		$("#country_code").change(function() {
			var countryName = $("#country_code option:selected").text();
			$("#countryName").val(countryName);
		});
		
		var geoCountryCode =  $("#geoCountryCode").val();
		console.log("geoCountryCode was :" + geoCountryCode + ":" )
		$("#country_code").val( geoCountryCode );

		
	});
