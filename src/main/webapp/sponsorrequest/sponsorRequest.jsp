<%@ page import = "com.warn.web.InternetUtils, com.warn.mktg.WSponsorship, java.util.List" %>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<script> 
		//these 2 script blocks are for AppD monitoring
    	window['adrum-start-time']= new Date().getTime(); 
	</script> 
	<script src="/wwwapps/shared/adrum.js"></script>
	<title>Sponsorship Request</title>

	<script src="/wwwapps/shared/jquery/jquery-3.1.0.js"></script>
	<script src="/wwwapps/shared/jquery/jquery-ui-1.12.0.custom/jquery-ui.js"></script>
	<link rel="stylesheet" href="/wwwapps/shared/jquery/jquery-ui-1.12.0.custom/jquery-ui.min.css">

	<script src="sponsorRequest.js"></script>
 	<link rel="stylesheet" href="/wwwapps/shared/warn.css" type="text/css">
 
 	<style>
	 	.formTable2Col{
	 		background-color:GAINSBORO;
	 		cellpadding:10;
	 		margin:10px;
	 	}
	 	
	 	.formTable2Col td:nth-child(1){
	 		text-align:right;
	 		width:30%;
	 		font-weight:bold;
	 	}
	 	
	 	.formTable2Col td:nth-child(2){
	 		text-align:left;
	 	}
	 	
 	</style>
</head>
<body style="font-size: 62.5%; width:660px; ">
<%

int requestTypeID = InternetUtils.getIntFromParameters("type", request, WSponsorship.TYPE_1_CLUBEVENT);
String requestTypeName = WSponsorship.getRequestTypeNameForID(requestTypeID);

%>
<table width="100%" border="0" height="50px">
	<tr>
		<td align="left">
		<a href="/index.shtml"><img	src="/wwwapps/shared/WarnLogoWeb.gif" border="0"></a>
		<span style="font-size:26px;">Corporate: Sponsorship Request</span>
		</td>
	</tr>
</table>
<form method="post" action="/wwwapps/sponsorrequest/SponsorshipRequestService" name="sponsor" onsubmit="return save();" enctype="multipart/form-data">
	<table class="formTable2Col"  >
		<tr>
			<td  align="left">
				<span class="title2">Sponsorship Request</span>
				<br>
			</td>
		</tr>
		<tr>
			<td width="40%" >Request Type:</td>
			<td >
				<b><%= requestTypeName %></b>
				<input name="requestTypeID" type="hidden" value="<%= requestTypeID %>" >
			</td>
		</tr>
		<tr>
			<td >Organization Name:</td>
			<td>
				<input name="org_name" type="text"	value="" size="30" class="required"	title="Organization Name">
			</td>
		</tr>
		<tr>
			<td >Event Name:</td>
			<td>
				<input name="name" type="text"	value="" size="30" class="required" title="Event Name">
			</td>
		</tr>
		<tr>
			<td >Event Location:</td>
			<td >
				<input name="event_location" type="text" value="" size="30" class="required" title="Event Location">
			</td>
		</tr>
		<tr>
			<td >Event Dates:</td>
			<td >
			<!--  format yyyy-mm-dd  -->
				<input name="event_from" type="text" value="" size="10" class="datepicker"> 
				to 
				<input name="event_to" type="text" value="" size="10" class="datepicker">
			</td>
		</tr>
		<tr>
			<td >Average Number of Vehicles:</td>
			<td >
				<select name="registered_vehiclesID"	id="registered_vehiclesID">
					<option value="" selected>Choose One</option>
					<option value="1">0-100</option>
					<option value="2">100-200</option>
					<option value="3">200+</option>
				</select>
			</td>
		</tr>
		<tr>
			<td >Expected Attendance:</td>
			<td >
				<select name="expected_attendanceID"	id="expected_attendanceID">
					<option value="" selected>Choose One</option>
					<option value="1">0-200</option>
					<option value="2">200-400</option>
					<option value="3">400-600</option>
					<option value="4">600+</option>
				</select>
			</td>
		</tr>
		<tr>
			<td >Media Coverage:</td>
			<td >
				<input name="media_coverage" type="text" value="" size="30">
			</td>
		</tr>
		<tr>
			<td >Product Requested:</td>
			<td >
				<select name="product_requested" id="product_requested">
					<option value="" selected>Choose One</option>
					<option value="ATV Accessories">ATV Accessories</option>
					<option value="ATV Mounting Kits">ATV Mounting Kits</option>
					<option value="ATV/SUV Plow Systems">ATV/SUV Plow Systems</option>
					<option value="ATV Winches">ATV Winches</option>
					<option value="Truck Accessories">Truck Accessories</option>
					<option value="Truck Mounting Kits">Truck Mounting Kits</option>
					<option value="Truck Winches">Truck Winches</option>
					<option value="Other">Other</option>
			</select></td>
		</tr>
		<tr>
			<td >Product Use:</td>
			<td >
				<select name="product_use" id="product_use">
					<option value="" selected>Choose One</option>
					<option value="Prize">Prize</option>
					<option value="Raffle">Raffle</option>
					<option value="Silent Auction">Silent Auction</option>
					<option value="Other">Other</option>
				</select>
			</td>
		</tr>
		<tr>
			<td >Date Needed:</td>
			<td >
				<input name="date_needed" type="text" value="" size="10" class="datepicker">
			</td>
		</tr>
		<tr>
			<td >Event Is a Fundraiser:</td>
			<td >
				<input type="radio" name="is_fundraiser" value="1" class="rbfundraiser">Yes
				<input type="radio" name="is_fundraiser" value="0" checked class="rbfundraiser">No
			</td>
		</tr>
		<tr>
			<td >Fundraiser Proceeds Go To:</td>
			<td >
				<input name="fundraiser_proceeds" id="fundraiser_proceeds" type="text" value="" size="30"  disabled>
			</td>
		</tr>
		<tr>
			<td colspan="3" >
				<hr />
			</td>
		</tr>
		<tr>
			<td >Publication Name:</td>
			<td >
				<input name="publication_name" type="text" value="" size="30">
			</td>
		</tr>
		<tr>
			<td >Editor Name:</td>
			<td >
				<input name="editor_name" type="text" value="" size="30">
			</td>
		</tr>
		<tr>
			<td >Staff or Freelance Writer:</td>
			<td >
				<input type="radio" name="is_staff" value="1">Staff
				<input type="radio" name="is_staff" value="0" checked>Freelance
			</td>
		</tr>
		<tr>
			<td >Circulation Numbers:</td>
			<td >
				<select name="circulation_numbersID" id="circulation_numbersID">
					<option value="" selected>Choose One</option>
					<option value="1">5000-10,000</option>
					<option value="2">10,000-30,000</option>
					<option value="3">30,000+</option>
				</select>
			</td>
		</tr>
		<tr>
			<td >Publication Date:</td>
			<td >
				<input name="publication_date"	type="text" value="" size="10" class="datepicker">
			</td>
		</tr>
		
		<tr><td colspan="2" ><hr /></td></tr>
		
		<tr>
			<td >Contact Name:</td>
			<td >
				<input name="contact_name" type="text" value="" size="30" class="required" title="Contact Name">
			</td>
		</tr>
		<tr>
			<td >Email Address:</td>
			<td >
				<input name="email" type="text" value="" size="30" class="required email" title="Contact Email Address">
			</td>
		</tr>
		<tr>
			<td >Phone Number:</td>
			<td >
				<input name="phone_number" type="text" value="" size="30">
			</td>
		</tr>
		<tr>
			<td >Street Address:</td>
			<td >
				<input name="street_address" type="text" value="" size="30" class="required" title="Street Address">
			</td>
		</tr>
		<tr>
			<td >City:</td>
			<td >
				<input name="city" type="text" value="" size="30" class="required" title="City">
			</td>
		</tr>
		<tr>
			<td >State (or Province):</td>
			<td >
				<input name="state" type="text"	value="" size="30" class="required" title="State">
			</td>
		</tr>
		<tr>
			<td >Zip (Postal):</td>
			<td >
				<input name="zip" type="text" value="" size="30" class="required" title="Zip">
			</td>
		</tr>
		<tr>
			<td colspan="3" >
				<hr />
			</td>
		</tr>
		<tr>
			<td valign="top" >Description:</td>
			<td>
				<textarea rows=5 cols=60 name="description"></textarea>
			</td>
		</tr>
	<%
	if ( requestTypeID == WSponsorship.TYPE_6_AUTOMOTIVEINDUSTRY || requestTypeID == WSponsorship.TYPE_8_MEDIA ) {
		%>													
		<tr>
			<td colspan="2" ><hr/></td>
		</tr>
		<tr>
			<td >Vehicle Make:</td>
			<td >
				<input name="vehicle_make" type="text" value="" size="30" >
			</td>
		</tr>
		<tr>
			<td >Vehicle Model:</td>
			<td >
				<input name="vehicle_model" type="text" value="" size="30" >
			</td>
		</tr>
		<tr>
			<td >Vehicle Year:</td>
			<td >
				<select name="vehicle_year"  id="vehicle_year" >
					<option value="" selected>Choose One</option>
					<% 
					List<Integer> yearOptions = WSponsorship.getVehicleYearOptions();
				    for (int y: yearOptions) {
				        %><option value="<%= y %>" ><%= y %> </option><%
				    }
					
					%>
				</select>
			</td>
		</tr>
		<tr>
			<td valign="top" >Exisiting WARN Products:</td>
			<td >
				<textarea rows=5 cols=60 name="existing_warn_products" ></textarea>
			</td>
		</tr>
		<tr>
			<td valign="top" >Existing Similar Products:</td>
			<td >
				<textarea rows=5 cols=60 name="existing_competitor_products" ></textarea>
			</td>
		</tr>
		<tr>
			<td valign="top" >Other Events (Place and Date):</td>
			<td >
				<textarea rows=5 cols=60 name="other_events" ></textarea>
			</td>
		</tr>
		<%
	}
	%>													
		
		<tr><td colspan="2" ><hr /></td></tr>
		<tr>
			<td colspan="2" style="text-align:center;">
				If request does not meet Warn sponsorship criteria,<br> are you willing to purchase at a discounted price?
				<br>
				<input type="radio" name="will_purchase" value="1">Yes	<input type="radio" name="will_purchase" value="0" checked>No
			</td>
		</tr>
		<tr><td colspan="2" ><hr /></td></tr>
		<tr>
			<td  style="font-weight: bold;">Add Attachment:&nbsp;</td>
			<td>
				<input type="file" name="fileUploadControl" id="fileUploadControl" size="45" />
			</td>
		</tr>

		<tr><td colspan="2" ></td></tr>

		<tr><td colspan="2" ><hr /></td></tr>

		<tr>
			<td colspan="2" align="center">
				<input type="submit" value="Submit" />
			</td>
		</tr>
		<tr>
			<td  colspan="2" valign="bottom" height="27px" 	background="/wwwapps/shared/bottom-border.jpg"></td>
		</tr>
	</table>
</form>
				
</body>
</html>



