<%@ page import = "com.warn.web.InternetUtils, com.warn.mktg.WSponsorship, java.util.List" %>
<!DOCTYPE html> 
<html>
<head>
	<meta charset="utf-8" />
	<meta http-equiv="Cache-Control" content="no-store" />
	<title>Contact Us</title>
	<link rel="stylesheet" href="/wwwapps/shared/wwwapps.css" type="text/css">
</head>
<body>
<%
	String msg = "Thank you for contacting us."; 
	
	String errMsg = (String)request.getAttribute("errMsg");
	if(errMsg != null && !errMsg.isEmpty()){
	
		msg = errMsg;
		
	}

%>
  	<div >
		<table>
			<tr>
			<td colspan="3">
				<a href="/index.shtml"><img src="/wwwapps/shared/WarnLogoWeb.gif" border="0"></a>
			</td>
			</tr>
			<tr><td colspan="3"><h2>Contacting Warn Industries</h2></td></tr>
			<tr>
				<td colspan="3"><%= msg %></td>
			</tr>
		</table>
	</div>
</body>
</html>

