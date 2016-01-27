<%-- sampleUI.jsp --%>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.orchestranetworks.service.*"%>
<%@page import="com.orchestranetworks.schema.*"%>
<%@page import="com.onwbp.adaptation.*"%>
<%@page import="java.math.BigDecimal"%>
<%@page import="java.util.Random"%>
<%
	/*ServiceContext provides the necessary context and navigation functions for integrating UI services into EBX.Manager.*/
	ServiceContext sContext = ServiceContext.getServiceContext(request);

	/*Selecting Titles table*/
	Adaptation adaptation = sContext.getCurrentAdaptation();
	AdaptationTable aTable = (AdaptationTable) adaptation.get(Path.parse("/root/Titles"));

	/*Selecting random occurrence*/
	Request tableRequest = aTable.createRequest();
	RequestResult requestResult = tableRequest.execute();
	int random = new Random().nextInt(requestResult.getSize());
	final Adaptation target = requestResult.getAdaptation(random);
%>
<p class="title">Random price modification of a random book</p>
<%
	String title = (String) target.get(Path.parse("/title"));
	BigDecimal price = (BigDecimal) target.get(Path.parse("/unit_price"));
%>
<b>Book title: </b><%=title%><br />
<b>Old book price: </b><%=price%><br />
<br />
<i>Changing book price...</i>
<br />
<%
	BigDecimal newPriceTmp = new BigDecimal(Math.random() * 100);
	final BigDecimal newprice = newPriceTmp.setScale(2, BigDecimal.ROUND_CEILING);
	/* Defines the procedure that modifies the price */
	Procedure procedure = new Procedure()
	{
		public void execute(ProcedureContext aContext) throws Exception
		{
			ValueContextForUpdate valueContext = aContext.getContext(target.getAdaptationName());
			valueContext.setValue(newprice, Path.parse("/unit_price"));
			aContext.doModifyContent(target, valueContext);
		}
	};
	/* Executes procedure from ServiceContext */
	sContext.execute(procedure);
%>
<%
	price = (BigDecimal) target.get(Path.parse("/unit_price"));
%>
<b>New book price: </b><%=price%><br />
<br />
<%
	/* Generates direct link URLs*/
	String tableURL = sContext.getURLForSelection(adaptation, Path.parse("/root/Titles"));
	String occurrenceURL = sContext.getURLForSelection(target);
%>
The following link points directly to the table:
<br />
<a href="<%=tableURL%>">Here is the link to the table</a>
<br />
<br />
The following link points directly to the occurrence:
<br />
<a href="<%=occurrenceURL%>">Here is the link to the modified occurrence</a>




