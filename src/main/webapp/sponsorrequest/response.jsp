<%@ page import = "com.warn.web.InternetUtils, com.warn.mktg.WSponsorship, java.util.List" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<title>Sponsorship Request</title>
	<link rel="stylesheet" href="/wwwapps/shared/warn.css" type="text/css">

</head>
<body style="font-size: 62.5%;">
<%
	String msg = "Thank you for your sponsorship request.  We will contact you soon."; 
	
	String errMsg = (String)request.getAttribute("errMsg");
	if(errMsg != null && !errMsg.isEmpty()){
	
		msg = errMsg;
		
	}

%>
  	<div class="odiv" align="center">
		<table class="otable">
			<tr>
				<td colspan="3">
					<table class="topnav" border="0" height="50px" width="100%">
						<tr>
							<td width="150">
								<a href="/index.shtml"><img src="/wwwapps/shared/WarnLogoWeb.gif" border="0"></a>
							</td>
							<td align="right" valign="top"></td>
						</tr>
					</table>
				</td>
			</tr>
			<tr><td colspan="3"><h2>Corporate Sponsorship Request</h2></td></tr>
			<tr>
				<td colspan="3"><%= msg %></td>
			</tr>
		</table>
	</div>
</body>
</html>

