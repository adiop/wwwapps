<%@ page import = "com.warn.web.InternetUtils, java.util.Map, com.warn.web.internet.ProductRegistration, com.warn.partner.EROI, java.util.*, com.warn.utils.WGeoIP" %>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Cache-Control" content="no-store" />
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<script> 
		//these 2 script blocks are for AppD monitoring
    	window['adrum-start-time']= new Date().getTime(); 
	</script> 
	<script src="/wwwapps/shared/adrum.js"></script>
	<title>Product Feedback</title>

	<script src="/wwwapps/shared/jquery/jquery-3.1.0.js"></script>
	<script src="/wwwapps/shared/jquery/jquery-ui-1.12.0.custom/jquery-ui.js"></script>
	<link rel="stylesheet" href="/wwwapps/shared/jquery/jquery-ui-1.12.0.custom/jquery-ui.min.css">

	<link rel="stylesheet" href="/wwwapps/shared/wwwapps.css">
	<script src="register.js"></script>

</head>
<body>
<div style="width:760px;">
	<table width="100%" border="0" height="50px">
		<tr>
			<td align="left">
			<a href="/index.shtml"><img	src="/wwwapps/shared/WarnLogoWeb.gif" border="0"></a>
			<span style="font-size:26px;">Product Feedback</span>
			</td>
		</tr>
	</table>
<%

String mode = InternetUtils.getStringFromParameters("mode", request, "");
if(mode.equalsIgnoreCase("save")){ 
	
	ProductRegistration pr = ProductRegistration.getRegistrationForParameters(request);
	pr.save();
	
	//write out a thank you
	%>
	   Thank you for your recent WARN product purchase.
	   <br>
	   For more than 50 years, the WARN team has worked with pride to design and build innovative, reliable products that help our customers enjoy their outdoor pursuits.  
	   We appreciate your business and look forward to serving you for many years to come.
	   <br>
	   <!-- <a href="/newsletter/sign_up.jsp"><b>Sign up for the WARN Newsletter!</b></a> -->
	</div>
	</body>
	</html>
	<%
	
	return;
}

%>

<table width="100%">
	<tr>
		<td>Please take a few seconds to tell us
			about your WARN purchase. WARN is always looking for new
			ways to innovate and create the right products for our
			customers and this information will assist in our efforts
			to deliver industry leading products and service to you.
			(THIS IS NOT FOR WARRANTY PURPOSES)
		</td>
	</tr>
</table>
<hr>
	<form method="post" action="register.jsp?mode=save"	name="register" onsubmit="return save();" >
	<table class="formTable" >
		<tr>
			<td>First Name:</td>
			<td ><input name="first_name" type="text" value="" size="30"></td>
		</tr>
		<tr>
			<td>Last Name:</td>
			<td ><input name="last_name" type="text" value="" size="30"></td>
		</tr>
		<tr>
			<td>Address:</td>
			<td ><input name="address1" type="text" value="" size="30"></td>
		</tr>
		<tr>
			<td>Address Line2:</td>
			<td ><input name="address2" type="text" value="" size="30"></td>
		</tr>
		<tr>
			<td>City:</td>
			<td ><input name="city" type="text" value="" size="30"></td>
		</tr>
		<tr>
			<td>State:</td>
			<td ><input name="state" type="text"	value="" size="30"></td>
		</tr>
		<tr>
			<td>Country:</td>
			<td >
				<select name="country" id="country">
					<option value="">Please Select</option>
					<option value="US">United States</option>
	<%
	
	LinkedHashMap<String, String> countries = ProductRegistration.getListOfCountries();
	Iterator<Map.Entry<String, String>> it = countries.entrySet().iterator();
	while (it.hasNext()) {
	    Map.Entry<String, String> pair = (Map.Entry<String, String>)it.next();
	    %><option value="<%= pair.getKey() %>" ><%= pair.getValue() %></option><%
	    it.remove(); // avoids a ConcurrentModificationException
	}
	
	//set default selected value to the country where the user is from
	String usersIPAddress = request.getRemoteAddr();
	WGeoIP geoip = new WGeoIP();
	String countryCode = geoip.getCountryCode(usersIPAddress);
	
	%>	
				</select>
				<script>$("#country").val("<%= countryCode %>");</script>
			</td>
		</tr>
		<tr>
			<td>Zip Code:</td>
			<td ><input name="zip" type="text" value="" size="30"></td>
		</tr>
		<tr>
			<td>E-mail Address:</td>
			<td ><input name="email" type="text"	value="" size="30"> &nbsp; 
				<i>Only one	address please</i></td>
		</tr>
		<tr>
			<td>Age Group:</td>
			<td >
				<input type="radio" name="age_group" id="16-24" value="16-24">16-24 &nbsp;
				<input type="radio" name="age_group" id="25-39" value="25-39">25-39 &nbsp;
				<input type="radio" name="age_group" id="40-49" value="40-49">40-49 &nbsp;
				<input type="radio" name="age_group" id="50-64" value="50-64">50-64 &nbsp;
				<input type="radio" name="age_group" id="65+" value="65+">65+
			</td>
		</tr>
		<tr>
			<td>Product:</td>
			<td >
				<input name="product" type="text" value="" size="30">
			</td>
		</tr>
		<tr>
			<td>Model Number:</td>
			<td >
				<input name="model_number"	type="text" value="" size="30">
			</td>
		</tr>
		<tr>
			<td>Serial Number:</td>
			<td >
				<input name="serial_number" type="text" value="" size="30"> &nbsp;&nbsp;<i>If applicable</i>
			</td>
		</tr>
		<tr>
			<td>Date Purchased:</td>
			<td >
				<input name="date" id="date" type="text" value="">
			</td>
		</tr>
		<tr>
			<td NOWRAP>Is this your first Warn Product:</td>
			<td >
					<input type="radio" name="first_warn_product" id="first_warn_product_yes" value="Yes">Yes &nbsp;
					<input type="radio"	name="first_warn_product" id="first_warn_product_no" value="No">No
			</td>
		</tr>
		<tr>
			<td>Is this a Replacement Winch:</td>
			<td >
				<input type="radio" name="replacement_winch" value="Yes">Yes &nbsp;
				<input type="radio" name="replacement_winch" value="No">No &nbsp;
				<input type="radio" name="replacement_winch" value="N/A">N/A 
			</td>
		</tr>
	
		<tr>
			<td>Vehicle:</td>
			<td>Year:<input name="vehicle_year" type="text" value="" size="4" maxlength="4"> &nbsp;
				Make:<input name="vehicle_make" type="text" value="" size="15">&nbsp;
				Model:<input name="vehicle_model" type="text" value="" size="15">
			</td>
		</tr>
		<tr><td colspan="2"><hr></td></tr>
	
		<tr>
			<td>Did you Purchase a Mounting System:</td>
			<td valign="top">
				<input type="radio"	name="did_purchase_mounting_system" value="Yes">Yes  &nbsp;
				<input type="radio"	name="did_purchase_mounting_system" value="No">No
			</td>
		</tr>
		<tr>
			<td></td>
			<td>If so, what type? <input name="mounting_system_type" type="text" value="" size="20"> &nbsp;
				Brand:<input name="mounting_system_brand" type="text" value="" size="15">
			</td>
		</tr>
		<tr><td colspan="2"><hr></td></tr>
		<tr>
			<td align="right">Did you Purchase any additional accessories:</td>
			<td valign="top">
				<input type="radio"	name="did_purchase_accessories" value="Yes">Yes  &nbsp;
				<input type="radio"	name="did_purchase_accessories" value="No">No
			</td>
		</tr>
		<tr>
			<td></td>
			<td>
				If so, what type? <input name="accessories_type" type="text" value="" size="20">&nbsp;
				Brand:<input name="accessories_brand" type="text" value="" size="15">
			</td>
		</tr>
		<tr><td colspan="2"><hr></td></tr>
		<tr>
			<td>Place of Purchase:</td>
			<td >
				<select name="place_purchased">
					<option value="Dealer">Dealer</option>
					<option value="Internet">Internet</option>
					<option value="Other">Other</option>
				</select>
			</td>
		</tr>
		<tr>
			<td>Self installation:</td>
			<td >
				<input type="radio" name="self_install"	value="Yes">Yes  &nbsp;
				<input type="radio" name="self_install"	value="No">No  &nbsp;
				<input type="radio" name="self_install"	value="N/A">N/A
			</td>
		</tr>
		<tr>
			<td>I use my WARN Product for:</td>
			<td >
				<INPUT TYPE=checkbox name="used_for_recreation" VALUE="1">Recreational Activity  &nbsp;
				<INPUT TYPE=checkbox name="used_for_work" VALUE="1">Commercial Activity
			</td>
		</tr>
		<tr><td colspan="2"><hr></td></tr>
		<tr>
			<td>I own:</td>
			<td >
				<table style="width:100%;" >
					<tr>
						<td valign=top>
							<INPUT TYPE=checkbox name="vehicle_Truck" VALUE="1">Truck/SUV/Jeep
						</td>
						<td valign=top>
							<INPUT TYPE=checkbox name="vehicle_Offroad"	VALUE="1">Offroad (Not street legal)
						</td>
						<td valign=top>
							<INPUT TYPE=checkbox name="vehicle_ATV"	VALUE="1">ATV/UTV
						</td>
					</tr>
					<tr>
						<td valign=top>
							<INPUT TYPE=checkbox name="vehicle_Watercraft" value="1">Watercraft
						</td>
						<td valign=top>
							<INPUT TYPE=checkbox name="vehicle_Snowmobile"	VALUE="1">Snowmobile
						</td>
						<td valign=top>&nbsp;</td>
					</tr>
				</table>
			</td>
		</tr>
		
		<tr><td colspan="2"><hr></td></tr>
		<tr>
			<td>Reason for selecting Warn:</td>
			<td >
				<input	name="reason_for_selecting_warn" type="text" value="" size="65" maxlength="100"></td>
		</tr>
		<tr>
			<td>Clubs or Event you Attend:</td>
			<td >
				<input name="clubs_events" type="text" value="" size="65" maxlength="100">
			</td>
		</tr>
		<tr>
			<td>Publications you read on a regular basis:</td>
			<td valign="top" >
				<input name="publications" type="text" value="" size="65" maxlength="100">
			</td>
		</tr>
		<tr>
			<td>Social Networking sites you use:</td>
			<td valign="top">
				<input name="social_networking_sites" type="text" value="" size="65" maxlength="100">
			</td>
		</tr>
		<tr>
			<td>Where did you hear about Warn:</td>
			<td valign="top" >
				<input name="hear_about_warn" type="text" value="" size="65" maxlength="100">
			</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td  align="right">
				<input type="hidden" name="subject" value=""> 
				<input type="hidden" name="jstest" value="">
			
				<input type="submit" value="Register">
			</td>
		</tr>
	</table> 
	</form>

	<table style="width:100%;">
		<tr>
			<td valign="bottom" height="27px" background="/wwwapps/shared/bottom-border.jpg"></td>
		</tr>
	</table>
</div><!-- end outerdiv -->		

</body>
</html>


