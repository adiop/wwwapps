
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

		var isValid = true;

		$( "span[data-valmsg-for='Country']").text('');
		$( "span[data-valmsg-for='FirstName']").text('');
		$( "span[data-valmsg-for='LastName']").text('');
		$( "span[data-valmsg-for='Email']").text('');
		$( "span[data-valmsg-for='Voice']").text('');
		$( "span[data-valmsg-for='Subject']").text('');
		$( "span[data-valmsg-for='Comment']").text('');

		var doc = document.contact;

		if (doc.country_code.value.length < 1 || doc.country_code.value == '--') {
			isValid = false;
			$( "span[data-valmsg-for='Country']").text('Please select a Country');
		}

		if (doc.first_name.value.length < 1) {
			isValid = false;
			$( "span[data-valmsg-for='FirstName']").text('Please enter a first name');
		}

		if (doc.last_name.value.length < 1) {
			isValid = false;
			$( "span[data-valmsg-for='LastName']").text('Please enter a last name');
		}

		if (doc.email.value.length < 1 ||
			doc.email.value.indexOf('@') == -1 ||
			doc.email.value.indexOf('.') == -1 ||
			doc.email.value.indexOf(' ') != -1) {
			isValid = false;
			$( "span[data-valmsg-for='Email']").text('Please enter a valid email address');
		}



		if (doc.voice.value.length < 1) {
			isValid = false;
			$( "span[data-valmsg-for='Voice']").text('Please enter a phone');
		}

		if (doc.subject.value.length < 1) {
			isValid = false;
			$( "span[data-valmsg-for='Subject']").text('Please enter a subject');
		}
		if (doc.comment.value.length < 1) {
			isValid = false;
			$( "span[data-valmsg-for='Comment']").text('Please enter a message');
		}

		return isValid;
	}

	function cleanError(selectExpression) {

	}

	function showError(selectExpression, message) {

	}

	function save() {
		return validate();
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
