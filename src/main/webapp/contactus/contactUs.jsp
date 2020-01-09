<%@ page import="java.util.LinkedHashMap" %>
<%@ page import="java.util.Map" %>
<%@ page import="com.warn.web.internet.Contact" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="com.maxmind.geoip.LookupService" %>
<% request.setAttribute("title", "Contact us"); %>

<jsp:include page="/template/header.jsp" />

<style>

	.MultiFile-list {
	}

	.MultiFile-label {
		color: #003eff;
		width: 100%;
		margin: 10px 0 7px;
		text-align: left;
		font-size: 12px;
	}

	.MultiFile-title {
		color: #000;
		width: 100%;
		margin: 0 0 7px;
		text-align: left;
		font-size: 12px;
	}

	@media only screen and (max-width: 600px) {
		#methods {
			display: none;
		}
	}

</style>

<form method="post" action="ContactService?mode=save" name="contact" onsubmit="return save();" ENCTYPE="multipart/form-data" >

	<div class="page">
		<div class="page-title">
			<h1>Contact us</h1>
		</div>
		<div class="page-body">

			<div class="fieldset" id="methods">
				<div class="title">
					<strong>Use one of these methods</strong>
				</div>

				<div class="grid">

					<div class="item-grid">
						<div class="item-box" style="width: 32%">
							<b>E-Mail:</b>
							<br>
							<br>

							cs@warn.com
						</div>
						<div class="item-box" style="width: 32%">
							<b>Mailing Address:</b>
							<br>
							<br>

							Warn Industries, Inc.<br>
							12900 S.E. Capps Road<br>
							Clackamas, Oregon 97015<br>
							U.S.A.
						</div>
						<div class="item-box"style="width: 32%">
							<b>Telephone (North America):</b>
							<br>
							<br>

							Customer Service:<br>
							1.800.543.9276
							<br>
							<br>

							Dealer Locator Service:<br>
							1.800.910.1122
						</div>
					</div>

				</div>

			</div>

			<div class="fieldset">
				<div class="title">
					<strong>Or fill the form below</strong>
				</div>
				<div class="form-fields">
					<div class="inputs">
						<label>Products / Services:</label>
						<div>
							<% //classification options, default is 1
								{
									LinkedHashMap<String, String> classes = Contact.getClassificationOptions();
									Iterator<Map.Entry<String, String>> it = classes.entrySet().iterator();
									while (it.hasNext()) {
										Map.Entry<String, String> pair = (Map.Entry<String, String>)it.next();
							%>
							<span>
                                <input type="radio" name="natureid" id="natureid_<%= pair.getKey() %>" value="<%= pair.getKey() %>" ><span><%= pair.getValue() %></span>
                                <label class="forcheckbox" for="natureid_<%= pair.getKey() %>"><%= pair.getValue() %></label>
                            </span>
							<%
										it.remove();
									}
								}
							%>
						</div>
					</div>
					<div class="inputs">
						<label>Country:</label>
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
						<span class="required">*</span>
						<span class="field-validation-error" data-valmsg-for="Country" data-valmsg-replace="true"></span>
					</div>
				</div>
				<div class="inputs first-name">
					<label for="first_name">First name:</label>
					<input name="first_name" id="first_name" type="text" value="" size="30" class="text-box single-line" data-val="true" data-val-required="First name is required." >
					<span class="required">*</span>
					<span class="field-validation-error" data-valmsg-for="FirstName" data-valmsg-replace="true"></span>
				</div>
				<div class="inputs last-name">
					<label for="last_name">Last name:</label>
					<input name="last_name" id="last_name" type="text"	value="" size="30" class="text-box single-line" data-val="true" data-val-required="Last name is required.">
					<span class="required">*</span>
					<span class="field-validation-error" data-valmsg-for="LastName"
						  data-valmsg-replace="true"></span>
				</div>
				<div class="inputs">
					<label for="email">Email:</label>
					<input class="text-box single-line" data-val="true" data-val-email="Wrong email" data-val-required="Email is required." id="email" name="email" type="text">
					<span class="required">*</span>
					<span class="field-validation-error" data-valmsg-for="Email"
						  data-valmsg-replace="true"></span>
				</div>
				<div class="inputs">
					<label for="voice">Voice phone:</label>
					<input name="voice" id="voice" type="text" value="" size="30" class="text-box single-line" data-val="true" data-val-required="Voice phone is required." >
					<span class="required">*</span>
					<span class="field-validation-error" data-valmsg-for="Voice" data-valmsg-replace="true"></span>
				</div>
				<div class="inputs">
					<label for="state">State or province:</label>
					<input name="state" id="state" type="text"	value="" size="30" class="text-box single-line">
				</div>
			</div>

			<div class="fieldset">
				<div class="title">
					<strong>Attach content</strong>
				</div>
				<div class="inputs">
					<label for="files">To attach a picture or file, click the Choose Files button. Maximum 10 files, 1MB each:</label>
					<input type="file" multiple class="multi" maxlength="10" data-maxfile="1024" name="files" id="files">
				</div>
			</div>

			<div class="fieldset">
				<div class="title">
					<strong>Message</strong>
				</div>
				<div class="inputs">
					<label for="subject">Subject:</label>
					<input name="subject" id="subject" type="text" value="" size="69" class="text-box single-line" data-val="true" data-val-required="Subject is required.">
					<span class="required">*</span>
					<span class="field-validation-error" data-valmsg-for="Subject" data-valmsg-replace="true"></span>
				</div>
				<div class="inputs">
					<label for="comment">Message:</label>
					<textarea rows=10 cols=70 name="comment" id="comment" class="text-box" data-val="true" data-val-required="Message is required."></textarea>
					<span class="required">*</span>
					<span class="field-validation-error" data-valmsg-for="Comment" data-valmsg-replace="true"></span>
				</div>
			</div>

			<div class="fieldset" style="background-color: #FFF; margin-bottom: 15px; padding: 5px;">

					<a href="https://www.warn.com/privacy-policy" style="color: #007fff">
						Please read our <strong style="font-weight: bold">Privacy Policy</strong> carefully as it will help you make informed decisions about sharing your personal information with us.
					</a>

			</div>

			<div class="buttons">
				<input class="button-1" type="submit" value="Send">
			</div>

		</div>

	</div>

</form>

<script src="contactUs.js"></script>

<jsp:include page="/template/footer.jsp" />
