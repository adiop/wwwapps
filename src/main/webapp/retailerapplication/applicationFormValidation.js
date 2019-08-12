//ep: heavily formatted and commented, removed dependecies on wfuncs.js
$(document).ready(	function() {
	
	$('.hidden').each(
		function() {
			$(this).hide();
		}
	);
	
	//if you click the same address box, billing fields populate with values from your physical info
	$('#sameadd').click(
		function() {
			if ($(this).is(':checked')) {
				
				$('#mailing_address_line_one').val(	$('#physical_address_line_one').val());
				$('#mailing_address_line_two').val(	$('#physical_address_line_two').val());
				
				$('#mailing_address_city').val(	$('#physical_address_city').val());
				$('#mailing_address_state').val($('#physical_address_state :selected').val());
				$('#mailing_address_zip').val($('#physical_address_zip').val());
				
				$('select[name="mailing_address_country"] option[value="' 
						+ $('select[name="physical_address_country"] option:selected').val()
						+ '"]').attr('selected', 'selected'
				);
			}
		}
	);
					
	//every time you edit where your sales occur, it modifies the total number
	//and if the total is less than 100, it is flagged red
	$('.sales').keyup(function() {

		var tot = 0;
		
		$('.sales').each(function() {
			var o = $(this);
			if (o.val().length > 0) {
				if (!isNaN(o.val())) {
					tot += parseInt(o.val());
				}
			}
		});
		
		$('#total').val(tot);
		
		if (tot != 100) {
			$('#total').css('border', '1px solid Red');
		} else {
			$('#total').css('border', '0');
		}
		
	});
		
	//any input that is of the digits class will be checked that it only contains digits
	//every time you type in it
	$('.digits').keyup(function() {
		
		$('.digits').each(function() {
			$(this).wfuncs('digitsOnly');
		});
		
		$('.len3, .len4').each(function() {
			
			var len = 0;
			var c = $(this);
			
			if (c.hasClass('len3')) {
				len = 3;
			}
			
			if (c.hasClass('len4')) {
				len = 4;
			}
			
			if (c.val().length > 1 && c.val().length > len) {
				c.val(c.val().substring(0, len));
			}
			
		});
		
	});

	//whenever you type in the main phone number field it sets the hidden value
	$('.ph1').keyup(
		function() {
			if (
					$('#mphone1').val().length > 0
					&& $('#mphone2').val().length > 0
					&& $('#mphone3').val().length > 0
			){
				
				$('#main_phone_number').val(
					$('#mphone1').val() + '-' + $('#mphone2').val() + '-' + $('#mphone3').val()
				);
				
			} else {
				
				$('#main_phone_number').val('');
			}
		}
	);
	
	$('.ph2').keyup(function() {
			$('#contact_phone_number').val(
					$('#cphone1').val() + '-' + $('#cphone2').val() + '-' + $('#cphone3').val());
		}
	);

	$('.ph3').keyup(function() {
			$('#contact_fax_number').val(
					$('#fax1').val() + '-' + $('#fax2').val() + '-' + $('#fax3').val());
		}
	);
	
	//add an asterisk after any field that is of the required or xrequired class and is not hidden
	$('.required,.xrequired').not(':hidden').each(function() {
			$(this).after('<span style=\"color: red;\">*</span>');
		}
	);
		
	//mark physical address country required ? why not mark with .requried?
	$('#physical_address_country').after('<span style=\"color: red;\">*</span>');
				
	//if you check that you found warn from the supplier or other, the details become required
	$('input[name="how_found"]:radio').click(
		function() {
			if ($(this).val() == 'My distributor/supplier'	|| $(this).val() == 'Other') {
				
				$('TR.hidden').show();
				$('#how_found_detail').addClass('required');
				
			} else {
				
				$('TR.hidden').hide();
				$('#how_found_detail').removeClass('required');
			}
		}
	);

	//if product installer is checked yes, num install bays becomes required
	$('input[name="product_installer"]').on(
		'change',
		function() {
			if ($('input[name="product_installer"]:checked').val() == 'Yes') {
				
				$('#install_bays').addClass('required');
			
			} else {
			
				$('#install_bays').removeClass('required');
			}
		}
	);
					
	//?
	$('#btn-test').on('click', function() {	});	
	
});//end on document load 


function save(evt) {
	
	//now that this is pure AJAX, make sure the form does not submit
	evt.preventDefault();
	 
	var msg = '';

	// getProductChecks(); //ep I dont know why this is commented out yet
	getProductQualifiers();
	

	//wfuncs is a custom jquery extension
	//TODO replace with something off the shelf
	var errors = $('form *').wfuncs('validateFormFields', 'required', '', 'email');
	
	for (e in errors) {
		msg += $(this).wfuncs('getDisplayName', $(errors).get(e).attr('id'))
				+ ' is a required field.\n';
		if ($(errors).get(e).attr('id').indexOf('web') > -1) {
			msg += 'You may enter NA if you do not have a website.\n';
		}
		
		$('#' + $(errors).get(e).attr('id')).css('background', '#FFFACD');
		
		if ($(errors).get(e).attr('id') == 'main_phone_number') {
			$('#mphone1, #mphone2, #mphone3').css('background', '#FFFACD');
		}
	}
	
	if ($('#physical_address_state option:selected').val().length < 1) {
		msg += 'Physical Address State is a required field.\n';
	}
	
	if ($('#mailing_address_state option:selected').val().length < 1) {
		msg += 'Mailing Address State is a required field.\n';
	}
	
	if ($('#physical_address_country option:selected').val().length < 1) {
		msg += 'Physical Address Country is a required field.\n';
	}
	
	if ($('#total').val() != null && $('#total').val() != '100') {
		
		msg += 'The total for you sales categories must equal 100 percent.\n';
		
		$('#total, #store, #catalog, #online, #phone, #other').css(	'background', '#FFFACD');
	}
	
	if ($('input[name="how_found"]:checked').val() == undefined) {
		
		msg += 'Please tell us how you found out about this program.\n';
	
	} else if ($('input[name="how_found"]:checked').val() == 'My distributor/supplier' || $('input[name="how_found"]:checked').val() == 'Other') {
		
		if ($('#how_found_detail').val().length < 1) {
			
			$('#how_found_detail').css('background', '#FFFACD');
			
			msg += 'Please specify where you heard about this program.\n';
		}
		
	}

	//some sort of spam test thing, can probably be removed
	$('#wf').val('pass');
	
	if (msg.length > 0) {
		alert(msg);
		return false;
	} else {

		try{
			//this is in applicationFormAjax.js
			submitForm();
		}catch(e){
			console.log(e.stack);
			alert(e.message);
		}
		return false;
	}
}

//looks like this walks some checkboxes and build a list of tilda seperated product infos? which are themselves colon delimited
//seems awfully complicated. I commented it to help out.
//ends up looking like 6:2:1~5:1:2~4:2:1~3:2:2~1:2:1~1:3:2
//which is {ProductTypeId}:{ProductSegmentId}:{DealerQualifier}
//which is stored in the DB 
function getProductQualifiers() {
	var products = '';
	//for each row
	$('.product-qualifier input[type="radio"]:checked').each(function() {
		try {
			if ($(this).val()) {
				//if sell or sell & stock are checked
				if ($(this).val() == '1' || $(this).val() == '2') {
					//if it has a name, like "rb-pid3-sid2"
					if ($(this).attr('name')) {
						//split the name up
						var parts = $(this).attr('name').split('-');
						if (parts) {
							if (parts.length == 3) {
								if (products.length > 0) {
									products += '~';
								}
								//skip first val which is rb
								products += parts[1].substr(3);//product id, 1 digit
								products += ':';
								products += parts[2].substr(3);//sub id, ?
								products += ':';
								products += $(this).val();//1 means sell, 2 means sell and stock
							}
						}
					}
				}
			}
		} catch (err) {
		}
	});
	$('#warn_products_checked').val(products);
	// return products;
}

//not sure this is used ever, keeping around because they kept it around
function getProductChecksNOTUSED() {
	var product = null;
	/*
	 * product.id = 0; product.name = ''; product.sells = 0; product.stocks = 0;
	 * product.displays = 0;
	 */
	var products = new Array();
	var prodChecks = null;
	var prodId = null;
	var checkVal = 0;
	var pidx = -1;
	var re1 = '.*?(?:[a-z][a-z0-9_]*).*?(?:product).*?((?:[a-z][a-z0-9_~]*)).*?((?:[a-z][a-z0-9_]*))';
	var patt1 = new RegExp(re1, [ "i" ]);

	$('.section-products td input[type="checkbox"]:checked').each(function() {
		var vid = $(this).attr('id');
		if (patt1.test(vid)) {
			var m1 = patt1.exec(vid);
			prodChecks = $(this).val().split(':');
			if (prodChecks) {
				if (prodChecks.length == 2) {
					prodId = prodChecks[0];
					if (products) {
						if (products.length > 0) {
							for (var i = 0; i < products.length; i++) {
								if (products[i].id == prodId) {
									pidx = i;
								}
							}
						}
					} else {
						products = new Array();
					}
					if (pidx < 0) {
						product = new Object();
						product.displays = 0;
						product.stocks = 0;
						product.sells = 0;
					} else {
						product = products[pidx];
					}
					if (!product.id) {
						product.id = parseInt(prodId);
					}
					if (!product.name) {
						product.name = m1[1];
					}
					checkVal = parseInt(prodChecks[1]);
					if (checkVal == 'NaN') {
						checkVal = 0;
					}
					if (checkVal > 0) {
						if ((checkVal & 1) == 1) {
							product.displays = 1;
						}
						if ((checkVal & 10) == 10) {
							product.stocks = 1;
						}
						if ((checkVal & 100) == 100) {
							product.sells = 1;
						}
					}
					if (pidx == -1) {
						products.push(product);
					}
				}
			}
			prodId = null;
			checkVal = 0;
			pidx = -1;
			product = null;
		}
	});
	
	var productsChecked = '';
	for (var i = 0; i < products.length; i++) {
		var product = products[i];
		if (productsChecked.length > 0) {
			productsChecked += '::';
		}
		productsChecked += product.id + '~';
		productsChecked += product.sells + '~';
		productsChecked += product.stocks + '~';
		productsChecked += product.displays;
	}
	
	$('#ih_products_checked').val(productsChecked);
}

