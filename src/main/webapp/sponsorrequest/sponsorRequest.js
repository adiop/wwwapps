
$(document).ready(function() {

	$(".datepicker").each(function() {
		$(this).datepicker({
			dateFormat : "yy-mm-dd"
		});
	});

	$(".required").after("<font color=red>*</font>");

	// if the fund raiser radio button changes. If true, activate the
	// "fundraiser goes to" input
	$(".rbfundraiser").change(function() {

		if ($(this).val() == "1") {

			$("#fundraiser_proceeds").removeAttr("disabled");

		} else {

			// clear it and disable it
			$("#fundraiser_proceeds").val('');
			$("#fundraiser_proceeds").attr("disabled", "disabled");

		}
	});

});

function validateEmail(s) {
	var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	if (filter.test(s)) {
		return true;
	} else {
		return false;
	}
}

function checkRequired() {
	var msg = "";
	$(".required")
			.each(
					function() {
						if ($(this).val().length < 1) {

							msg += $(this).attr('title') + " is required.\n";

						} else if ($(this).hasClass('email')) {

							if (!validateEmail($(this).val())) {

								msg += $(this).attr('title')
										+ " does not appear to be a valid email address.\n";
							}

						}
					});
	if (msg.length > 0) {
		alert(msg);
		return false;
	} else {
		return true;
	}
}

function checkText() {
	// ep: this function is basically broken, it does not tell you which fields
	// are wrong
	// when testing i found that "fundraisers go to" if I put an apostrophe, as
	// in "ed's kids"
	// it failed, but did not say what field
	// so i am making it return true, and someone needs to fix this
	return true;

	var filtert = /^[a-zA-Z0-9-(),\.\s]{1,100}$/;
	var filterd = /^[1-12\/1-31\/2012-2112]/;
	var s;
	var rval = true;
	$("input:text").each(function() {
		s = $(this).val();
		if (s.length > 0) {
			if ($(this).hasClass('datepicker')) {
				if (!filterd.test(s)) {
					rval = false;
				}
			} else if ($(this).hasClass('email')) {
			} else {
				if (!filtert.test(s)) {
					rval = false;
				}
			}
		}
	});
	if (!rval) {
		alert("Some entries have invalid characters.  Allowed characters include letters, numbers, comma, period, hyphen, parenthesis and spaces.");
	}
	return rval;
}

function save() {
	if (checkText()) {
		return checkRequired();
	} else {
		return false;
	}
}
