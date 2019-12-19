<%@ page import="java.util.LinkedHashMap" %>
<%@ page import="java.util.Map" %>
<%@ page import="com.warn.web.internet.Contact" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="com.maxmind.geoip.LookupService" %>
<% request.setAttribute("title", "Dealer locator"); %>

<jsp:include page="/template/header.jsp" />

<script	src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCNQZ88u0FF1BEEPpV1rIFm_dp5KI46YDI&libraries=geometry"></script>

<style>

	table {
		border: #fff;
		border: 0px;
		border-collapse: initial;
	}

	.dealerInfo {
		text-align: left;
	}

	.dealerCont td {
		text-align: left;
	}

	hr {
		border: 1px dashed #ccc;
		letter-spacing: 2px;
		width: 100%;

	}

	@media only screen and (max-width: 600px) {

		table {
			border: #fff;
			border: 0px;
			border-collapse: initial;
		}

		table tr {
			border: #fff;
			border: 0px;
			border-collapse: initial;
		}

		table td {
			border: #fff;
			border: 0px;
			border-collapse: initial;
		}

	}

</style>

<form id="dealerForm" name="dealerForm">

	<div class="page">
		<div class="page-title">
			<h1>Dealer Locator</h1>
		</div>
		<div class="page-body">

			<div class="fieldset">
				<div class="title">
					<strong>Search for a Local Store & Installer</strong>
				</div>
				<div class="inputs first-name">
					<label for="searchAddress">Address</label>
					<input name="searchAddress" id="searchAddress"	type="text" value="" size="50"class="text-box single-line" data-val="true" placeholder="e.g. Portland, Or or 97229 or Paris, France"  >
					<span class="required">*</span>
					<span class="field-validation-error" data-valmsg-for="searchAddress" data-valmsg-replace="true"></span>
				</div>
				<div class="inputs">
					<label>Country:</label>
					<select	name="countrySelector" id="countrySelector"	onchange="countrySelectorChanged();" >
					</select>
				</div>
				<div class="inputs" id="stateSelectorDiv">
					<label>State:</label>
					<select id="stateSelector" onchange="stateSelectorChanged();">
					</select>
				</div>

				<div class="inputs" id="citySelectorRow" style="display:none;" >
					<label>City:</label>
					<!-- container for city label and selector, city is always called city.-->
					<!-- If country is US or CA, this only shows up once a state is selected. For other countries, no state, only cities show up -->
					<select id="citySelector" onchange="citySelectorChanged();"></select>
				</div>

				<div class="buttons">
					<input class="button-1" type="submit" value="Find">
				</div>

			</div>

			<div class="fieldset">

				<div style="font-size: 12px; float: right; padding-bottom: 5px">
					<a style="color: #ff0000;" href="javascript:showRedLetterDialog();">What is a RLD?</a> | <a style="color: #ff0000;" href="javascript:showDirectLinkDialog();">Share this Map</a>&nbsp;
				</div>

				<!--  mapCanvas div holds the map widget created by javascript -->
				<div id="mapCanvas" style="width: 100%; height: 600px; color: #d1cfcf;"	></div>

				<table id="iconDefinitions" style="width: 100%;">
					<tr>
						<td align="right" valign="top" style="font-size: 12px;">
							<a href="javascript:showRedLetterDialog();"><img src="assets/dealer-icon.png" style="border:0;" ></a>
							<a href="javascript:showRedLetterDialog();" style="color:#CE1126;vertical-align:top;">Red Letter Dealer</a>
							&nbsp;&nbsp;&nbsp;
							<img src="assets/pin.gif">
							<span style="vertical-align:top;">Dealers that carry WARN</span>
						</td>
					</tr>
				</table>

				<!-- table holds the search results details for each dealer  -->
				<table id="searchResultsTable" style="width:100%;" >
					<tbody>

					</tbody>
				</table>

			</div>

		</div>
	</div>

</form>

<!-- these are popup divs. -->
<div id="loadingImgDiv" style="position: absolute; z-index: 2000; display: none;">
	<img id="loadingImg" src="assets/loading.gif" alt="Loading">
</div>

<div id="directLinkDiv"	style="border: 20px solid black; text-align: center; background-color: white;">
	Copy this URL to link to this map (use ctrl+c).<br>
	<br>
	<input	id="directLinkURLField" name="directLinkURLField" size="30" type="text" onclick="this.select();" >
</div>

<div id="redLetterDiv"	style="border: 20px solid black; text-align: center; background-color: white; padding: 20px;">
	WARN Red Letter Dealers are an elite group of WARN authorized retail
	outlets that help provide consumers with the highest level of WARN
	brand product information, availability and service. <br />
	<br />
	<a href="red_letter_dealer_program.shtml" target="_blank">
		<font color="#d92d39"> Become a Red Letter Dealer.</font>
	</a>.
</div>

<script src="dealerLocator.js"></script>
<script src="locationSelectors.js"></script>
<link rel="stylesheet" href="dealerLocator.css" type="text/css">

<script>

	$(function() {

		$(document).keypress(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == '13'){
				console.log('enter key pressed');
				event.preventDefault();
				searchByAddress();
			}
		});

		$( "#dealerForm" ).submit(function( event ) {
			console.log("form submit fuction called");
			event.preventDefault();
			searchByAddress();
		});

		//this turns the div into a dialog box that is closed/hidden
		$("#redLetterDiv").dialog({
			autoOpen : false,
			title : "What is a Red Letter Dealer?"
		});

		$("#directLinkDiv").dialog({
			autoOpen : false,
			title : "Link to this map",
			width : "auto"
		});

		populateCountrySelector();


	});
</script>

<jsp:include page="/template/footer.jsp" />

