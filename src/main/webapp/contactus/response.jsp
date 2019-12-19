<% request.setAttribute("title", "Contact us"); %>

<jsp:include page="/template/header.jsp" />

<%
	String msg = "Thank you for contacting us."; 
	
	String errMsg = (String)request.getAttribute("errMsg");

	if(errMsg != null && !errMsg.isEmpty()){
		msg = "It seems that an error occurred while we were trying to send your message!";
	}

%>

<div class="page">
	<div class="page-title">
		<h1>Contact us</h1>
	</div>
	<div class="page-body">

		<table>
			<tr><td colspan="3">
				<h2 style="color: #ff0000"><%= msg %></h2></td>
			</tr>
		</table>

	</div>
</div>

<jsp:include page="/template/footer.jsp" />
