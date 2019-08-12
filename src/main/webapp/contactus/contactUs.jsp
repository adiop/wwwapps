<%@ page import="java.util.*, com.warn.web.internet.Contact, com.maxmind.geoip.*"%>
<!DOCTYPE html> 
<html>
<head>
	<meta charset="utf-8" />
	<meta http-equiv="Cache-Control" content="no-store" />
	<script> 
		//these 2 script blocks are for AppD monitoring
    	window['adrum-start-time']= new Date().getTime(); 
	</script> 
	<script src="/wwwapps/shared/adrum.js"></script>
	<title>Contact Us</title>
	
	<link rel="stylesheet" href="/wwwapps/shared/wwwapps.css" type="text/css">
	
	<link rel="stylesheet" href="/wwwapps/shared/jquery/jquery-ui-1.12.0.custom/jquery-ui.min.css">
	<script src="/wwwapps/shared/jquery/jquery-3.1.0.js"></script>
	<script src="/wwwapps/shared/jquery/jquery-ui-1.12.0.custom/jquery-ui.js"></script>
	
	<script src="/wwwapps/shared/jquery/multifile-master/jquery.MultiFile.js"></script>
	<script src="contactUs.js"></script>
</head>
<body>
<div class="mainDiv">  
	<table width="100%" border="0" height="50px">
		<tr>
			<td align="left">
			<a href="/index.shtml"><img	src="/wwwapps/shared/WarnLogoWeb.gif" border="0"></a>
			<span style="font-size:26px;">Contact Us</span>
			</td>
		</tr>
	</table>
	<h2>Use one of these methods:</h2>	
	<table style="background-color: #ebebeb;" width="100%" >
		<tr>
			<td valign="top" width="33%"><b><u>E-Mail:</u></b><br>

				cs@warn.com
				
			</td>
			<td valign="top" width="33%"><b><u>Mailing Address:</u></b><br>
				Warn Industries, Inc.<br>
				12900 S.E. Capps Road<br>
				Clackamas, Oregon 97015<br>
				U.S.A.
			</td>
			<td valign="top" width="33%"><b><u>Telephone (North America):</u></b><br>
				Customer Service:<br>
				1.800.543.9276<br>
				<br>
				Dealer Locator Service:<br>
				1.800.910.1122<br>
			</td>
		</tr>
	</table>

<h2>Or fill out the form below:</h2>	
	
	<form method="post" action="ContactService?mode=save" name="contact" onsubmit="return save();" ENCTYPE="multipart/form-data" >
		<table class="formTable" style="background-color: #ebebeb;">
			<tr>
				<td>Classification:</td>
				<td>
					<input name="natureName" id="natureName" type="hidden" value="">
					<% //classification options, default is 1
					{
						LinkedHashMap<String, String> classes = Contact.getClassificationOptions();
						Iterator<Map.Entry<String, String>> it = classes.entrySet().iterator();
						while (it.hasNext()) {
						    Map.Entry<String, String> pair = (Map.Entry<String, String>)it.next();
						    %>
						    <input type="radio" name="natureid" id="natureid" value="<%= pair.getKey() %>" ><span><%= pair.getValue() %></span><br>
						    <%
						    it.remove(); 
						}
					}		
					%>
					<input type="radio" name="natureid" id="natureid" value="Sponsorship"  class="classification" >Sponsorship

				</td>
			</tr>
			<tr>
				<td colspan="2"><hr></td>
			</tr>
			<tr>
				<td>Regarding:</td>
				<td>
					<input name="areaName" id="areaName" type="hidden" value="">
					<% //regarding options default is 4, which is the first option, core code needs to be rewritten
					{
						LinkedHashMap<String, String> areas = Contact.getRegardingOptions();
						Iterator<Map.Entry<String, String>> it = areas.entrySet().iterator();
						while (it.hasNext()) {
						    Map.Entry<String, String> pair = (Map.Entry<String, String>)it.next();
						    %>
						    <input type="radio" name="areaid" id="areaid" value="<%= pair.getKey() %>" ><span><%= pair.getValue() %></span><br>
						    <%
						    it.remove(); 
						}
					}
							
					%>
				</td>
			</tr>
			<tr>
				<td colspan="2"><hr></td>
			</tr>
			<tr>
				<td>Country:</td>
				<td>
					<input name="countryName" id="countryName" type="hidden" value="">
					<%
					//store off the geoip country code so we can try to set it
		            LookupService cl = new LookupService("/opt/jsproot/GeoIP.dat", LookupService.GEOIP_MEMORY_CACHE);
		            String ip = request.getRemoteAddr();
		            String geoCountryCode = cl.getCountry(ip).getCode();
					
					%>
					<input id="geoCountryCode" type="hidden" value="<%= geoCountryCode %>">
					<select name="country_code" id="country_code">
						<option value="--">Please Select</option>
						<option value="US">United States</option>

						<% 
						{
							LinkedHashMap<String, String> countries = Contact.getListOfCountriesExcludingUS();
							Iterator<Map.Entry<String, String>> it = countries.entrySet().iterator();
							while (it.hasNext()) {
							    Map.Entry<String, String> pair = (Map.Entry<String, String>)it.next();
							    %><option value="<%= pair.getKey() %>" ><%= pair.getValue() %></option><%
							    it.remove(); // avoids a ConcurrentModificationException
							}
						}
						
						%>
					
					</select>

				</td>
			</tr>
			<tr>
				<td>First Name:</td>
				<td>
					<input name="first_name" id="first_name" type="text" value="" size="30">
				</td>
			</tr>
			<tr>
				<td>Last Name:</td>
				<td>
					<input name="last_name" id="last_name" type="text"	value="" size="30">
				</td>
			</tr>
			<tr>
				<td>E-mail Address:</td>
				<td>
					<input name="email" id="email" type="text"	value="" size="30"> &nbsp; 
					<i>Only one	address please</i>
				</td>
			</tr>
			<tr>
				<td>Join Our Mailing List:</td>
				<td>
					<input type="radio" name="confirm" id="confirm" value="1">Yes
					<input type="radio" name="confirm" id="confirm" value="0" checked>No
				</td>
			</tr>
			<tr>
				<td>Voice Phone:</td>
				<td>
					<input name="voice" id="voice" type="text" value="" size="30">
				</td>
			</tr>
			<tr>
				<td>Fax:</td>
				<td>
					<input name="fax" id="fax" type="text" value="" size="30">
				</td>
			</tr>
			<tr>
				<td>Address:</td>
				<td colspan="2">
					<input name="address" id="address" type="text" value="" size="30">
				</td>
			</tr>
			<tr>
				<td>City:</td>
				<td>
					<input name="city" id="city" type="text"	value="" size="30">
				</td>
			</tr>
			<tr>
				<td>State (or Province):</td>
				<td>
					<input name="state" id="state" type="text"	value="" size="30">
				</td>
			</tr>
			<tr>
				<td>Zip (Postal):</td>
				<td >
					<input name="zip" id="zip" type="text" value="" size="30">
				</td>
			</tr>
			<tr>
				<td>Age group (optional):</td>
				<td>
					<select name="ageRange" id="ageRange" >
						<option value="" selected >Please Select</option>
						<option value="&lt;25" >&lt;25</option>
						<option value="25-35" >25-35</option>
						<option value="36-45" >36-45</option>
						<option value="46-55" >46-55</option>
						<option value="&gt;55" >&gt;55</option>
					</select>
				</td>
			</tr>
			<tr><td colspan="2"><hr></td></tr>
			<tr>
				<td colspan="2" style="text-align: left;">
					To attach a picture or file, click	the Choose Files button. <i>Maximum 10 files, 1MB each.</i>
				</td>
			</tr>
			<tr>
				<td></td>
				<td>
					<input type="file" multiple class="multi" maxlength="10" data-maxfile="1024" name="files" id="files">
				</td>
			</tr>
			<tr><td colspan="2"><hr></td></tr>
			<tr>
				<td>Subject</td>
				<td>
					<input name="subject" id="subject" type="text" value="" size="69">
				</td>
			</tr>
			<tr>
				<td>Message</td>
				<td>
					<textarea rows=10 cols=70 name="comment" id="comment"></textarea>
				</td>
			</tr>
			<tr>
				<td colspan="2" align="left">
					<span style="float:right;"><input type="submit" value="submit"></span>
				</td>
			</tr>

		</table>
	</form>
</div>
</body>
</html>


