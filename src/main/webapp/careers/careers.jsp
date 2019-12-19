<%@ page import="java.util.LinkedHashMap" %>
<%@ page import="java.util.Map" %>
<%@ page import="com.warn.web.internet.Contact" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="com.maxmind.geoip.LookupService" %>
<%@ page import="com.warn.hr.JobPosting" %>
<%@ page import="java.util.List" %>
<% request.setAttribute("title", "Carreer Opportunities"); %>

<jsp:include page="/template/header.jsp" />

<link rel="StyleSheet" HREF="careers.css" type="text/css">

<style>
	table td {
		text-align: left;
	}

	table td a {
		font-size: 14px;
		color: #ff0000;
	}

	table td a:hover {
		font-size: 14px;
		color: #808080;
	}

	table td ul li {
		margin-left: 15px;
		list-style-type: square;
	}

	@media only screen and (max-width: 600px) {

		table {
			margin: 0px;
			padding: 0px;
			border: #fff;
			border: 0px;
			border-collapse: initial;
		}

		table tr {
			margin: 0px;
			padding: 0px;
			border: #fff;
			border: 0px;
			border-collapse: initial;
		}

		table td {
			margin: 5px;
			padding: 0px;
			border: #fff;
			border: 0px;
			border-collapse: initial;
		}

		#main_cell {
			width: 98%;
		}

	}

</style>

<div class="page">
	<div class="page-title">
		<h1>Career Opportunities</h1>
	</div>
	<div class="page-body">
		<table align="center"><!-- this table divides the page into 2 other tables -->
			<tr><td valign="top">
				<table width="100%">
					<tr>
						<td valign="top" id="main_cell">
							<img src="jobs2.jpg"><br>
							<br>
							<b>About Warn</b>
							<br>
							<br>
							<p>Warn Industries is a great place to work. Why? We offer
								fun, exciting products that help people "Go Prepared" on their
								adventures, no matter where the destination. As one of the most
								recognized, trusted brands in the off-road vehicle industry,
								our products have been adored by outdoor enthusiasts around the
								globe for more than 60 years. That passion is echoed in our
								workplace culture, since many WARN employees are off-road
								enthusiasts, and regularly use the products they make.</p>
							<p>In business since 1948, Warn Industries is a
								well-established company offering competitive pay and a host of
								available benefits. In fact, our 400+ employees average an
								impressive 11 years of service with the company. From machining
								to marketing, production to purchasing, welding to website
								development, we offer a diverse range of jobs, people, and
								opportunities in a safe, friendly, and exciting environment.</p>
							<p>At Warn Industries, we design, engineer, manufacture and
								market hundreds of great products for those who crave
								adventure. And not only do we have the best products on the
								market, we also have the best employees. Start your own
								adventure by applying for one of our open positions, and find
								out for yourself why Warn Industries is a great place to work.</p>
						</td>
					</tr>
				</table>
				<table class=" printwidth">
					<tr>
						<td colspan="2">
							<b>Current Opportunities</b>
					</tr>
					<tr class="Header"><td>Job Number</td><td>Job Title</td></tr>
					<%

						List<JobPosting> jobs = JobPosting.getPublicJobPostings();
						if(jobs.size() > 0) {
							for(JobPosting job : jobs){
					%>
					<tr>
						<td><a href="<%= job.getExternalLink() %>"><%= job.getJobNumber() %></a></td>
						<td><a href="<%= job.getExternalLink() %>"><%= job.getJobTitle() %></a></td>
					</tr>
					<%
						}
					}else{
					%><tr><td colspan="2">There are no open positions to Warn Industries. &nbsp;Please continue to visit our website for future career opportunities.</td></tr><%
					}
				%>

				</table>
				<hr>
				<table>
					<tr><td colspan="3"><b>Our locations:</b></td></tr>
					<tr>
						<td valign=top width=250>12900 SE Capps Road<br>
							Clackamas, OR 97015<br>
							<a href="http://maps.google.com/maps?q=12900+SE+Capps+Road&hl=en&sll=45.426928,-122.589829&sspn=0.010542,0.017145&vpsrc=0&hnear=12900+SE+Capps+Rd,+Clackamas,+Oregon+97015&t=h&z=16"
							   target=_new><font size="1">Google Maps</font></a>
						</td>
					</tr>
				</table>
			</td>
				<td width="20">&nbsp;</td><!--  spacer column -->
				<td valign="top" id="right_cell"><!--  begin right hand column -->
					<div >
						<b>OUR BENEFITS PACKAGE</b>
						<br>
						<br>
						In addition to working for
						the most recognized brand in the off-road and winching markets,
						you will have access to an excellent benefits package; it's
						considered to be one of the best in the industry.
						<ul>
							<li>Medical</li>
							<li>Dental</li>
							<li>Vision</li>
							<li>Wellness Incentives</li>
							<li>Employee Assistance Plan</li>
							<li>Tax Advantaged Savings Accounts</li>
							<li>401(k) Plan</li>
							<li>10 Paid Holidays a Year</li>
							<li>Paid Time Off</li>
							<li>Long Term Care</li>
							<li>Pay for Performance</li>
							<li>Education Assistance</li>
							<li>Years of Service Awards</li>
							<li>Employee Discount on Warn Products</li>
							<%--				<li>Annual Family Picnic</li>--%>
							<li>Community Volunteer Opportunities</li>
							<li>Scholarship Program</li>
						</ul>
					</div> <br> <br>
					<div >
						<b>EQUAL OPPORTUNITY EMPLOYER</b>
						<br>
						<br>
						Warn Industries is
						committed to providing Equal Employment Opportunity for all
						applicants, regardless of race, religion, sex, national origin,
						citizenship, age, disability, veteran status, or marital
						status, and encourages applications from people of diverse
						backgrounds.
					</div> <br> <br>
					<div>
						<b>WARN & LKQ VALUES:</b>
						<br>
						<br>
						<ul>
							<li>Collaborative Entrepreneurial Spirit</li>
							<li>Winning Through Customers</li>
							<li>High Ethical Standards</li>
							<li>Openness and Trust</li>
							<li>Expectation for Results</li>
							<li>Respect and Value People</li>
						</ul>
					</div>
					<br>
					<br>
					<div align=center>
						<a href="http://www.lkqcorp.com">
							<img src="WF000LKQ.jpg" border=0>
						</a>
					</div>
					<br>
					<br>
				</td></tr>
		</table>
	</div>
</div>

<jsp:include page="/template/footer.jsp" />
