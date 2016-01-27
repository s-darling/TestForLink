/*
 * Copyright Orchestra Networks 2000-2011. All rights reserved.
 */
package com.orchestranetworks.tutorial.editor;

import com.onwbp.adaptation.*;
import com.onwbp.base.text.*;
import com.onwbp.org.apache.axis.utils.*;
import com.orchestranetworks.schema.*;
import com.orchestranetworks.tutorial.module.*;
import com.orchestranetworks.ui.*;
import com.orchestranetworks.ui.base.*;
import com.orchestranetworks.ui.base.Size.*;
import com.orchestranetworks.ui.form.*;
import com.orchestranetworks.ui.form.widget.*;

public class TitleFormPane implements UIFormPane
{
	public static final String ID_AU_ID = "AU_ID";
	public static final String ID_AU_FN = "AU_FN";
	public static final String ID_AU_LN = "AU_LN";

	public static final String PN_NEWAUTHOR = "auId";

	public static final String ID_PU_ID = "PU_ID";
	public static final String ID_PU_NAME = "PU_NAME";
	public static final String ID_PU_CITY = "PU_CITY";

	public static final String PN_NEWPUBLISHER = "puId";

	private static final String PAGE_EFFECT_STYLE = "border-style: double; border-width: 0 3px 3px 0; padding: 0 1px 1px 0;";

	public void writePane(UIFormPaneWriter aWriter, UIFormContext aContext)
	{
		//// start page
		aWriter.add("<div");
		aWriter.add(" style=\"margin: 10px;\"");
		aWriter.add(">");

		//// id
		aWriter.add("<div");
		aWriter.add(" style=\"width: 410px; padding: 5px;\"");
		aWriter.add(">");
		aWriter.startTableFormRow();
		UITextBox keyWidget = aWriter.newTextBox(Paths._Titles._Title_id);
		keyWidget.setWidth(new Size(300, Unit.PIXEL));
		aWriter.addFormRow(keyWidget);
		aWriter.endTableFormRow();
		aWriter.add("</div>");

		//// start book

		// start page effect
		aWriter.add("<div");
		aWriter.add(" class=\"").add(UICSSClasses.COLORED_BORDER).add("\"");
		aWriter.add(" style=\"display: inline-block; border-width: 3px; border-radius: 3px; -moz-border-radius: 3px; -webkit-border-radius: 3px;\"");
		aWriter.add(">");
		aWriter.add("<div");
		aWriter.add(" class=\"").add(UICSSClasses.COLORED_BORDER).add("\"");
		aWriter.add(" style=\"").add(PAGE_EFFECT_STYLE).add("\"");
		aWriter.add(">");
		aWriter.add("<div");
		aWriter.add(" class=\"").add(UICSSClasses.COLORED_BORDER).add("\"");
		aWriter.add(" style=\"").add(PAGE_EFFECT_STYLE).add("\"");
		aWriter.add(">");
		aWriter.add("<div");
		aWriter.add(" class=\"").add(UICSSClasses.COLORED_BORDER).add("\"");
		aWriter.add(" style=\"").add(PAGE_EFFECT_STYLE).add("\"");
		aWriter.add(">");
		aWriter.add("<div");
		aWriter.add(" class=\"").add(UICSSClasses.COLORED_BORDER).add("\"");
		aWriter.add(" style=\"border-width: 0 3px 3px 0; border-radius: 3px; -moz-border-radius: 3px; -webkit-border-radius: 3px;\"");
		aWriter.add(">");

		// start book content
		aWriter.add("<div");
		aWriter.add(" style=\"height: 550px; width: 400px;\"");
		aWriter.add(">");

		// start author
		aWriter.add("<div");
		aWriter.add(" style=\"padding: 10px;\"");
		aWriter.add(">");
		aWriter.startTableFormRow();

		UIFormRow authorFormRow = aWriter.newFormRow(Paths._Titles._Au_id);
		authorFormRow.setIconDisplayed(false);
		authorFormRow.setLabelWidth(new Size(300, Unit.PIXEL));

		UIComboBox authorComboBox = aWriter.newComboBox(Paths._Titles._Au_id);
		authorComboBox.setPageSize(20);
		authorComboBox.setWidth(new Size(250, Unit.PIXEL));
		authorComboBox.setActionOnAfterValueChanged(JsFunctionCall.on("callAjaxTitleUpdateAuthorInfo"));

		aWriter.addFormRow(authorFormRow, authorComboBox);

		aWriter.endTableFormRow();
		aWriter.add("</div>");
		// end author

		// start title
		aWriter.add("<div");
		aWriter.add(" style=\"padding: 30px 10px 10px 10px;\"");
		aWriter.add(">");
		aWriter.startTableFormRow();

		UIFormRow titleFormRow = aWriter.newFormRow(Paths._Titles._Title);
		titleFormRow.setIconDisplayed(false);
		titleFormRow.setLabelDisplayed(false);
		aWriter.startFormRow(titleFormRow);

		UIFormRow titleFormRow2 = aWriter.newFormRow(Paths._Titles._Title);
		titleFormRow2.setIconDisplayed(false);
		titleFormRow2.setWidgetWidth(new Size(0, Unit.PIXEL));
		aWriter.startFormRow(titleFormRow2);
		aWriter.endFormRow();

		UITextBox titleWidget = aWriter.newTextBox(Paths._Titles._Title);
		titleWidget.setWidth(new Size(370, Unit.PIXEL));
		aWriter.addWidget(titleWidget);

		aWriter.endFormRow();

		aWriter.endTableFormRow();
		aWriter.add("</div>");
		// end title

		// start type
		aWriter.add("<div");
		aWriter.add(" style=\"padding: 10px 10px 30px 10px;\"");
		aWriter.add(">");

		UIFormRow typeFormRow = aWriter.newFormRow(Paths._Titles._Type);
		typeFormRow.setIconDisplayed(false);
		typeFormRow.setLabelDisplayed(false);
		typeFormRow.setWidgetWidth(new Size(370, Unit.PIXEL));

		aWriter.startFormRow(typeFormRow);

		aWriter.add("<div");
		aWriter.add(" style=\"text-align: center;\"");
		aWriter.add(">");
		aWriter.add("<div");
		aWriter.add(" style=\"display: inline-block;\"");
		aWriter.add(">");

		UIComboBox typeWidget = aWriter.newComboBox(Paths._Titles._Type);
		typeWidget.setWidth(new Size(170, Unit.PIXEL));
		aWriter.addWidget(typeWidget);

		aWriter.add("</div>");
		aWriter.add("</div>");

		aWriter.endFormRow();

		aWriter.add("</div>");
		// end type

		// start image
		aWriter.add("<div");
		aWriter.add(" style=\"padding-top: 20px; text-align: center;\"");
		aWriter.add(">");

		aWriter.add("<div");
		aWriter.add(" style=\"display: inline-block;\"");
		aWriter.add(">");

		aWriter.startBorder(true);
		aWriter.add("<div");
		aWriter.add(" class=\"").add(UICSSClasses.LIGHT_COLORED_BACKGROUND).add("\"");
		aWriter.add(" style=\" width: 300px; height: 200px;\"");
		aWriter.add(">");
		aWriter.add("</div>");
		aWriter.endBorder();

		aWriter.add("</div>");
		aWriter.add("</div>");
		// end image

		// price
		aWriter.add("<div");
		aWriter.add(" style=\"padding: 20px 10px 10px 10px; text-align: right;\"");
		aWriter.add(">");
		aWriter.add("<div");
		aWriter.add(" class=\"").add(UICSSClasses.COLORED_BORDER).add("\"");
		aWriter.add(" style=\"display: inline-block; width: 110px; padding: 0 15px; border-radius: 100px 30px; -moz-border-radius: 100px 30px;\"");
		aWriter.add(">");
		aWriter.startTableFormRow();

		UIFormRow priceFormRow = aWriter.newFormRow(Paths._Titles._Unit_price);
		priceFormRow.setWidgetWidth(new Size(0, Unit.PIXEL));
		aWriter.startFormRow(priceFormRow);

		UITextBox priceWidget = aWriter.newTextBox(Paths._Titles._Unit_price);
		priceWidget.setWidth(new Size(5, Unit.CHARACTER));
		aWriter.addWidget(priceWidget);

		aWriter.endFormRow();

		aWriter.endTableFormRow();
		aWriter.add("</div>");
		aWriter.add("</div>");

		// start publisher
		aWriter.add("<div");
		aWriter.add(" style=\"padding: 40px 10px 10px 10px;\"");
		aWriter.add(">");
		aWriter.startTableFormRow();

		UIFormRow publisherFormRow = aWriter.newFormRow(Paths._Titles._Pub_id);
		publisherFormRow.setIconDisplayed(false);
		publisherFormRow.setLabelWidth(new Size(300, Unit.PIXEL));

		UIComboBox publisherComboBox = aWriter.newComboBox(Paths._Titles._Pub_id);
		publisherComboBox.setWidth(new Size(250, Unit.PIXEL));
		publisherComboBox.setActionOnAfterValueChanged(JsFunctionCall.on("callAjaxTitleUpdatePublisherInfo"));

		aWriter.addFormRow(publisherFormRow, publisherComboBox);

		aWriter.endTableFormRow();
		aWriter.add("</div>");
		// end publisher

		aWriter.add("</div>");
		// end book content

		aWriter.add("</div>");
		aWriter.add("</div>");
		aWriter.add("</div>");
		aWriter.add("</div>");
		aWriter.add("</div>");
		// end page effect
		//// end book

		//// start right pane
		aWriter.add("<div");
		aWriter.add(" style=\"display: inline-block; padding-left: 20px; vertical-align: top;\"");
		aWriter.add(">");

		// author info
		aWriter.add("<div");
		aWriter.add(" style=\"padding: 10px;\"");
		aWriter.add(">");
		this.displayAuthor(aContext, aWriter);
		aWriter.add("</div>");

		// publisher info
		aWriter.add("<div");
		aWriter.add(" style=\"padding: 10px;\"");
		aWriter.add(">");
		this.displayPublisher(aContext, aWriter);
		aWriter.add("</div>");

		// separator
		aWriter.add("<div");
		aWriter.add(" class=\"").add(UICSSClasses.COLORED_BORDER).add("\"");
		aWriter.add(" style=\"margin: 10px; border-style: outset; border-width: 3px; border-radius: 100%; -moz-border-radius: 100%; -webkit-border-radius: 100%;\"");
		aWriter.add("></div>");

		// sales
		aWriter.add("<div");
		aWriter.add(" style=\"padding: 10px; text-align: center;\"");
		aWriter.add(">");
		aWriter.add("<div");
		aWriter.add(" style=\"display: inline-block;\"");
		aWriter.add(">");
		UIFormRow saleFormRow = aWriter.newFormRow(Paths._Titles._Total_sales);
		saleFormRow.setIconURL("http://upload.wikimedia.org/wikipedia/commons/5/59/Money.png");
		saleFormRow.setLabelWidth(new Size(50, Unit.PIXEL));
		saleFormRow.setWidgetWidth(new Size(10, Unit.CHARACTER));
		UITextBox salesTextBox = aWriter.newTextBox(Paths._Titles._Total_sales);
		salesTextBox.setWidth(new Size(10, Unit.CHARACTER));
		aWriter.addFormRow(saleFormRow, salesTextBox);
		aWriter.add("</div>");
		aWriter.add("</div>");

		this.displayNodeAccessor(aWriter);

		aWriter.add("</div>");
		//// end right pane

		aWriter.add("</div>");
		//// end page
	}

	private void displayPublisher(UIFormContext aContext, UIFormPaneWriter aWriter)
	{
		aWriter.startBorder(true, UserMessage.createInfo("Publisher Info"));

		SchemaNode titleTable = aContext.getCurrentDataSet().getSchemaNode().getNode(
			Paths._Titles.getPathInSchema());
		SchemaNode publisherTable = aContext.getCurrentDataSet().getSchemaNode().getNode(
			Paths._Publishers.getPathInSchema());

		SchemaNode publisherNode = titleTable.getTableOccurrenceRootNode().getNode(
			Paths._Titles._Pub_id);
		Adaptation linkedRecord = publisherNode.getFacetOnTableReference().getLinkedRecord(
			aContext.getValueContext());

		aWriter.add("<table class=\"").add(
			UICSSClasses.TABLE.ESSENTIAL + " " + UICSSClasses.TABLE.FULL_WIDTH).add("\">");
		aWriter.add("<tr>");
		aWriter.add("<th>");
		SchemaNode pubId = publisherTable.getTableOccurrenceRootNode().getNode(
			Paths._Publishers._Pub_id);
		aWriter.add(this.getSchemaNodeLabelOrName(pubId, aWriter));
		aWriter.add("</th>");
		aWriter.add("<th>");
		SchemaNode pubName = publisherTable.getTableOccurrenceRootNode().getNode(
			Paths._Publishers._Name);
		aWriter.add(this.getSchemaNodeLabelOrName(pubName, aWriter));
		aWriter.add("</th>");
		aWriter.add("<th>");
		SchemaNode pubCity = publisherTable.getTableOccurrenceRootNode().getNode(
			Paths._Publishers._City);
		aWriter.add(this.getSchemaNodeLabelOrName(pubCity, aWriter));
		aWriter.add("</th>");
		aWriter.add("</tr>");

		aWriter.add("<tr>");
		aWriter.add("<td>");
		aWriter.add("<span id=\"").add(ID_PU_ID).add("\">");
		if (linkedRecord != null)
			aWriter.add(linkedRecord.getString(Paths._Publishers._Pub_id));
		else
			aWriter.add("[Not defined]");
		aWriter.add("</span>");
		aWriter.add("</td>");
		aWriter.add("<td>");
		aWriter.add("<span id=\"").add(ID_PU_NAME).add("\">");
		if (linkedRecord != null)
			aWriter.add(linkedRecord.getString(Paths._Publishers._Name));
		else
			aWriter.add("[Not defined]");
		aWriter.add("</span>");
		aWriter.add("</td>");
		aWriter.add("<td>");
		aWriter.add("<span id=\"").add(ID_PU_CITY).add("\">");
		if (linkedRecord != null)
			aWriter.add(linkedRecord.getString(Paths._Publishers._City));
		else
			aWriter.add("[Not defined]");
		aWriter.add("</span>");
		aWriter.add("</td>");
		aWriter.add("</tr>");
		aWriter.add("</table>");

		aWriter.endBorder();

		this.addPublisherJSCode(aWriter);
	}

	private String getSchemaNodeLabelOrName(SchemaNode node, UIFormPaneWriter aWriter)
	{
		String label = node.getLabel(aWriter.getSession());
		if (StringUtils.isEmpty(label))
			label = node.getPathInAdaptation().getLastStep().format();
		return label;
	}

	private void displayAuthor(UIFormContext aContext, UIFormPaneWriter aWriter)
	{
		aWriter.startBorder(true, UserMessage.createInfo("Author Info"));

		SchemaNode titleTable = aContext.getCurrentDataSet().getSchemaNode().getNode(
			Paths._Titles.getPathInSchema());
		SchemaNode authorTable = aContext.getCurrentDataSet().getSchemaNode().getNode(
			Paths._Authors.getPathInSchema());

		SchemaNode authorNode = titleTable.getTableOccurrenceRootNode().getNode(
			Paths._Titles._Au_id);
		Adaptation linkedRecord = authorNode.getFacetOnTableReference().getLinkedRecord(
			aContext.getValueContext());

		aWriter.add("<table class=\"").add(
			UICSSClasses.TABLE.ESSENTIAL + " " + UICSSClasses.TABLE.FULL_WIDTH).add("\">");
		aWriter.add("<tr>");
		aWriter.add("<th>");
		SchemaNode auId = authorTable.getTableOccurrenceRootNode().getNode(Paths._Authors._Au_id);
		aWriter.add(this.getSchemaNodeLabelOrName(auId, aWriter));
		aWriter.add("</th>");
		aWriter.add("<th>");
		SchemaNode auFirstName = authorTable.getTableOccurrenceRootNode().getNode(
			Paths._Authors._Firstname);
		aWriter.add(this.getSchemaNodeLabelOrName(auFirstName, aWriter));
		aWriter.add("</th>");
		aWriter.add("<th>");
		SchemaNode auLastName = authorTable.getTableOccurrenceRootNode().getNode(
			Paths._Authors._Lastname);
		aWriter.add(this.getSchemaNodeLabelOrName(auLastName, aWriter));
		aWriter.add("</th>");
		aWriter.add("</tr>");

		aWriter.add("<tr>");
		aWriter.add("<td>");
		aWriter.add("<span id=\"").add(ID_AU_ID).add("\">");
		if (linkedRecord != null)
			aWriter.add(linkedRecord.getString(Paths._Authors._Au_id));
		else
			aWriter.add("[Not defined]");
		aWriter.add("</span>");
		aWriter.add("</td>");
		aWriter.add("<td>");
		aWriter.add("<span id=\"").add(ID_AU_FN).add("\">");
		if (linkedRecord != null)
			aWriter.add(linkedRecord.getString(Paths._Authors._Firstname));
		else
			aWriter.add("[Not defined]");
		aWriter.add("</span>");
		aWriter.add("</td>");
		aWriter.add("<td>");
		aWriter.add("<span id=\"").add(ID_AU_LN).add("\">");
		if (linkedRecord != null)
			aWriter.add(linkedRecord.getString(Paths._Authors._Lastname));
		else
			aWriter.add("[Not defined]");
		aWriter.add("</span>");
		aWriter.add("</td>");
		aWriter.add("</tr>");
		aWriter.add("</table>");

		aWriter.endBorder();

		this.addAuthorJSCode(aWriter);
	}

	private final void addAuthorJSCode(UIFormPaneWriter aWriter)
	{
		aWriter.addJS("AjaxTitleUpdateAuthorInfo = function(){");
		aWriter.addJS("    this.handleAjaxResponseSuccess = function(responseContent){");
		aWriter.addJS("        var jsonObj = YAHOO.lang.JSON.parse(responseContent);");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_AU_ID).addJS(
			"\").innerHTML=jsonObj.").addJS(ID_AU_ID).addJS(";");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_AU_FN).addJS(
			"\").innerHTML=jsonObj.").addJS(ID_AU_FN).addJS(";");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_AU_LN).addJS(
			"\").innerHTML=jsonObj.").addJS(ID_AU_LN).addJS(";");
		aWriter.addJS("    };");
		aWriter.addJS("    this.handleAjaxResponseFailed = function(responseContent){");
		aWriter.addJS("    };");
		aWriter.addJS("};");
		aWriter.addJS("AjaxTitleUpdateAuthorInfo.prototype = new EBX_AJAXResponseHandler();");

		aWriter.addJS("function callAjaxTitleUpdateAuthorInfo(value, arg){");
		aWriter.addJS("    var myAjaxHandler = new AjaxTitleUpdateAuthorInfo();");
		aWriter.addJS("    if(value === null){");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_AU_ID).addJS(
			"\").innerHTML=\"[Not defined]\";");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_AU_FN).addJS(
			"\").innerHTML=\"[Not defined]\";");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_AU_LN).addJS(
			"\").innerHTML=\"[Not defined]\";");
		aWriter.addJS("        return;");
		aWriter.addJS("    }");
		aWriter.addJS("    var newAuthorId = value.key;");
		aWriter.addJS("    myAjaxHandler.sendRequest(\"").addJS(
			aWriter.getURLForAjaxComponent("AjaxTitleUpdateAuthorInfoDisplay")).addJS("&").addJS(
			PN_NEWAUTHOR).addJS("=\" + newAuthorId);");
		aWriter.addJS("};");
	}

	private final void addPublisherJSCode(UIFormPaneWriter aWriter)
	{
		aWriter.addJS("AjaxTitleUpdatePublisherInfo = function(){");
		aWriter.addJS("    this.handleAjaxResponseSuccess = function(responseContent){");
		aWriter.addJS("        var jsonObj = YAHOO.lang.JSON.parse(responseContent);");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_PU_ID).addJS(
			"\").innerHTML=jsonObj.").addJS(ID_PU_ID).addJS(";");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_PU_NAME).addJS(
			"\").innerHTML=jsonObj.").addJS(ID_PU_NAME).addJS(";");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_PU_CITY).addJS(
			"\").innerHTML=jsonObj.").addJS(ID_PU_CITY).addJS(";");
		aWriter.addJS("    };");
		aWriter.addJS("    this.handleAjaxResponseFailed = function(responseContent){");
		aWriter.addJS("    };");
		aWriter.addJS("};");
		aWriter.addJS("AjaxTitleUpdatePublisherInfo.prototype = new EBX_AJAXResponseHandler();");

		aWriter.addJS("function callAjaxTitleUpdatePublisherInfo(value){");
		aWriter.addJS("    var myAjaxHandler = new AjaxTitleUpdatePublisherInfo();");
		aWriter.addJS("    if(value === null){");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_PU_ID).addJS(
			"\").innerHTML=\"[Not defined]\";");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_PU_NAME).addJS(
			"\").innerHTML=\"[Not defined]\";");
		aWriter.addJS("        document.getElementById(\"").addJS(ID_PU_CITY).addJS(
			"\").innerHTML=\"[Not defined]\";");
		aWriter.addJS("        return;");
		aWriter.addJS("    }");
		aWriter.addJS("    var newPublisherId = value.key;");
		aWriter.addJS("    myAjaxHandler.sendRequest(\"")
			.addJS(aWriter.getURLForAjaxComponent("AjaxTitleUpdatePublisherInfoDisplay"))
			.addJS("&")
			.addJS(PN_NEWPUBLISHER)
			.addJS("=\" + newPublisherId);");
		aWriter.addJS("};");
	}

	private void displayNodeAccessor(UIFormPaneWriter aWriter)
	{
		String nullLabel = "\"[null]\"";

		aWriter.startBorder(false, UserMessage.createInfo("Node Accessor"));

		aWriter.add("<table>");

		//// title

		String titleInputId = "title_accessor";
		aWriter.add("<tr>");
		aWriter.add("<td>");
		aWriter.addLabel(Paths._Titles._Title);
		aWriter.add("</td>");

		aWriter.add("<td>");
		aWriter.add("<input type=\"text\" id=\"").add(titleInputId).add("\"/>");
		aWriter.add("</td>");

		aWriter.add("<td>");
		UIButtonSpecJSAction getTitle = new UIButtonSpecJSAction(
			UserMessage.createInfo("get"),
			"getTitleValue();");
		aWriter.addButtonJavaScript(getTitle);
		UIButtonSpecJSAction setTitle = new UIButtonSpecJSAction(
			UserMessage.createInfo("set"),
			"setTitleValue();");
		aWriter.addButtonJavaScript(setTitle);
		aWriter.add("</td>");
		aWriter.add("</tr>");

		String titleValueVarName = "titleValue";

		aWriter.addJS("function getTitleValue(){");
		{
			aWriter.addJS("var ").addJS(titleValueVarName).addJS(" = ");
			aWriter.addJS_getNodeValue(Paths._Titles._Title).addJS(";");
			aWriter.addJS("document.getElementById(\"")
				.addJS(titleInputId)
				.addJS("\").value = ")
				.addJS(titleValueVarName)
				.addJS(";");
		}
		aWriter.addJS("}");

		aWriter.addJS("function setTitleValue(){");
		{
			aWriter.addJS("var ")
				.addJS(titleValueVarName)
				.addJS(" = document.getElementById(\"")
				.addJS(titleInputId)
				.addJS("\").value;");
			aWriter.addJS_setNodeValue(titleValueVarName, Paths._Titles._Title);
		}
		aWriter.addJS("}");

		//// author
		String authorKeyInputId = "author_key_accessor";
		String authorLabelInputId = "author_label_accessor";
		aWriter.add("<tr>");
		aWriter.add("<td>");
		aWriter.addLabel(Paths._Titles._Au_id);
		aWriter.add("</td>");

		aWriter.add("<td>");
		aWriter.add("key <input type=\"text\" id=\"").add(authorKeyInputId).add("\"/>");
		aWriter.add("<br/>");
		aWriter.add("label <input type=\"text\" id=\"").add(authorLabelInputId).add("\"/>");
		aWriter.add("</td>");

		aWriter.add("<td>");
		UIButtonSpecJSAction getAuthor = new UIButtonSpecJSAction(
			UserMessage.createInfo("get"),
			"getAuthorValue();");
		aWriter.addButtonJavaScript(getAuthor);
		UIButtonSpecJSAction setAuthor = new UIButtonSpecJSAction(
			UserMessage.createInfo("set"),
			"setAuthorValue()");
		aWriter.addButtonJavaScript(setAuthor);
		UIButtonSpecJSAction setAuthorNull = new UIButtonSpecJSAction(
			UserMessage.createInfo("set null"),
			"setAuthorNull()");
		aWriter.addButtonJavaScript(setAuthorNull);
		aWriter.add("</td>");
		aWriter.add("</tr>");

		String authorValueVarName = "authorValue";

		aWriter.addJS("function getAuthorValue(){");
		{
			aWriter.addJS("var ").addJS(authorValueVarName).addJS(" = ");
			aWriter.addJS_getNodeValue(Paths._Titles._Au_id).addJS(";");

			aWriter.addJS("if (").addJS(authorValueVarName).addJS(" === null){");
			{
				aWriter.addJS("document.getElementById(\"").addJS(authorKeyInputId).addJS(
					"\").value = ").addJS(nullLabel).addJS(";");
				aWriter.addJS("document.getElementById(\"").addJS(authorLabelInputId).addJS(
					"\").value = ").addJS(nullLabel).addJS(";");
			}
			aWriter.addJS("} else {");
			{
				aWriter.addJS("document.getElementById(\"").addJS(authorKeyInputId).addJS(
					"\").value = ").addJS(authorValueVarName).addJS(".key;");
				aWriter.addJS("document.getElementById(\"").addJS(authorLabelInputId).addJS(
					"\").value = ").addJS(authorValueVarName).addJS(".label;");
			}
			aWriter.addJS("}");
		}
		aWriter.addJS("}");

		aWriter.addJS("function setAuthorValue(){");
		{
			aWriter.addJS("var ").addJS(authorValueVarName).addJS(" = {");
			{
				aWriter.addJS("key: document.getElementById(\"").addJS(authorKeyInputId).addJS(
					"\").value,");
				aWriter.addJS("label: document.getElementById(\"").addJS(authorLabelInputId).addJS(
					"\").value");
			}
			aWriter.addJS("};");

			aWriter.addJS_setNodeValue(authorValueVarName, Paths._Titles._Au_id);
		}
		aWriter.addJS("}");

		aWriter.addJS("function setAuthorNull(){");
		{
			aWriter.addJS_setNodeValue("null", Paths._Titles._Au_id);
		}
		aWriter.addJS("}");

		//// publisher
		String publisherKeyInputId = "publisher_key_accessor";
		String publisherLabelInputId = "publisher_label_accessor";
		aWriter.add("<tr>");
		aWriter.add("<td>");
		aWriter.addLabel(Paths._Titles._Pub_id);
		aWriter.add("</td>");

		aWriter.add("<td>");
		aWriter.add("key <input type=\"text\" id=\"").add(publisherKeyInputId).add("\"/>");
		aWriter.add("<br/>");
		aWriter.add("label <input type=\"text\" id=\"").add(publisherLabelInputId).add("\"/>");
		aWriter.add("</td>");

		aWriter.add("<td>");
		UIButtonSpecJSAction getPublisher = new UIButtonSpecJSAction(
			UserMessage.createInfo("get"),
			"getPublisherValue();");
		aWriter.addButtonJavaScript(getPublisher);
		UIButtonSpecJSAction setPublisher = new UIButtonSpecJSAction(
			UserMessage.createInfo("set"),
			"setPublisherValue()");
		aWriter.addButtonJavaScript(setPublisher);
		UIButtonSpecJSAction setPublisherNull = new UIButtonSpecJSAction(
			UserMessage.createInfo("set null"),
			"setPublisherNull()");
		aWriter.addButtonJavaScript(setPublisherNull);
		aWriter.add("</td>");
		aWriter.add("</tr>");

		String publisherValueVarName = "publisherValue";

		aWriter.addJS("function getPublisherValue(){");
		{
			aWriter.addJS("var ").addJS(publisherValueVarName).addJS(" = ");
			aWriter.addJS_getNodeValue(Paths._Titles._Pub_id).addJS(";");

			aWriter.addJS("if (").addJS(publisherValueVarName).addJS(" === null){");
			{
				aWriter.addJS("document.getElementById(\"").addJS(publisherKeyInputId).addJS(
					"\").value = ").addJS(nullLabel).addJS(";");
				aWriter.addJS("document.getElementById(\"").addJS(publisherLabelInputId).addJS(
					"\").value = ").addJS(nullLabel).addJS(";");
			}
			aWriter.addJS("} else {");
			{
				aWriter.addJS("document.getElementById(\"").addJS(publisherKeyInputId).addJS(
					"\").value = ").addJS(publisherValueVarName).addJS(".key;");
				aWriter.addJS("document.getElementById(\"").addJS(publisherLabelInputId).addJS(
					"\").value = ").addJS(publisherValueVarName).addJS(".label;");
			}
			aWriter.addJS("}");
		}
		aWriter.addJS("}");

		aWriter.addJS("function setPublisherValue(){");
		{
			aWriter.addJS("var ").addJS(publisherValueVarName).addJS(" = {");
			{
				aWriter.addJS("key: document.getElementById(\"").addJS(publisherKeyInputId).addJS(
					"\").value,");
				aWriter.addJS("label: document.getElementById(\"")
					.addJS(publisherLabelInputId)
					.addJS("\").value");
			}
			aWriter.addJS("};");

			aWriter.addJS_setNodeValue(publisherValueVarName, Paths._Titles._Pub_id);
		}
		aWriter.addJS("}");

		aWriter.addJS("function setPublisherNull(){");
		{
			aWriter.addJS_setNodeValue("null", Paths._Titles._Pub_id);
		}
		aWriter.addJS("}");

		//// type
		String typeKeyInputId = "type_key_accessor";
		String typeLabelInputId = "type_label_accessor";
		aWriter.add("<tr>");
		aWriter.add("<td>");
		aWriter.addLabel(Paths._Titles._Type);
		aWriter.add("</td>");

		aWriter.add("<td>");
		aWriter.add("key <input type=\"text\" id=\"").add(typeKeyInputId).add("\"/>");
		aWriter.add("<br/>");
		aWriter.add("label <input type=\"text\" id=\"").add(typeLabelInputId).add("\"/>");
		aWriter.add("</td>");

		aWriter.add("<td>");
		UIButtonSpecJSAction getType = new UIButtonSpecJSAction(
			UserMessage.createInfo("get"),
			"getTypeValue();");
		aWriter.addButtonJavaScript(getType);
		UIButtonSpecJSAction setType = new UIButtonSpecJSAction(
			UserMessage.createInfo("set"),
			"setTypeValue()");
		aWriter.addButtonJavaScript(setType);
		UIButtonSpecJSAction setTypeNull = new UIButtonSpecJSAction(
			UserMessage.createInfo("set null"),
			"setTypeNull()");
		aWriter.addButtonJavaScript(setTypeNull);
		aWriter.add("</td>");
		aWriter.add("</tr>");

		String typeValueVarName = "typeValue";

		aWriter.addJS("function getTypeValue(){");
		{
			aWriter.addJS("var ").addJS(typeValueVarName).addJS(" = ");
			aWriter.addJS_getNodeValue(Paths._Titles._Type).addJS(";");

			aWriter.addJS("if (").addJS(typeValueVarName).addJS(" === null){");
			{
				aWriter.addJS("document.getElementById(\"").addJS(typeKeyInputId).addJS(
					"\").value = ").addJS(nullLabel).addJS(";");
				aWriter.addJS("document.getElementById(\"").addJS(typeLabelInputId).addJS(
					"\").value = ").addJS(nullLabel).addJS(";");
			}
			aWriter.addJS("} else {");
			{
				aWriter.addJS("document.getElementById(\"").addJS(typeKeyInputId).addJS(
					"\").value = ").addJS(typeValueVarName).addJS(".key;");
				aWriter.addJS("document.getElementById(\"").addJS(typeLabelInputId).addJS(
					"\").value = ").addJS(typeValueVarName).addJS(".label;");
			}
			aWriter.addJS("}");
		}
		aWriter.addJS("}");

		aWriter.addJS("function setTypeValue(){");
		{
			aWriter.addJS("var ").addJS(typeValueVarName).addJS(" = {");
			{
				aWriter.addJS("key: document.getElementById(\"").addJS(typeKeyInputId).addJS(
					"\").value,");
				aWriter.addJS("label: document.getElementById(\"").addJS(typeLabelInputId).addJS(
					"\").value");
			}
			aWriter.addJS("};");

			aWriter.addJS_setNodeValue(typeValueVarName, Paths._Titles._Type);
		}
		aWriter.addJS("}");

		aWriter.addJS("function setTypeNull(){");
		{
			aWriter.addJS_setNodeValue("null", Paths._Titles._Type);
		}
		aWriter.addJS("}");

		//// price

		String priceInputId = "price_accessor";
		aWriter.add("<tr>");
		aWriter.add("<td>");
		aWriter.addLabel(Paths._Titles._Unit_price);
		aWriter.add("</td>");

		aWriter.add("<td>");
		aWriter.add("<input type=\"text\" id=\"").add(priceInputId).add("\"/>");
		aWriter.add("</td>");

		aWriter.add("<td>");
		UIButtonSpecJSAction getPrice = new UIButtonSpecJSAction(
			UserMessage.createInfo("get"),
			"getPriceValue();");
		aWriter.addButtonJavaScript(getPrice);
		UIButtonSpecJSAction setPrice = new UIButtonSpecJSAction(
			UserMessage.createInfo("set"),
			"setPriceValue();");
		aWriter.addButtonJavaScript(setPrice);
		aWriter.add("</td>");
		aWriter.add("</tr>");

		String priceValueVarName = "priceValue";

		aWriter.addJS("function getPriceValue(){");
		{
			aWriter.addJS("var ").addJS(priceValueVarName).addJS(" = ");
			aWriter.addJS_getNodeValue(Paths._Titles._Unit_price).addJS(";");
			aWriter.addJS("document.getElementById(\"")
				.addJS(priceInputId)
				.addJS("\").value = ")
				.addJS(priceValueVarName)
				.addJS(";");
		}
		aWriter.addJS("}");

		aWriter.addJS("function setPriceValue(){");
		{
			aWriter.addJS("var ")
				.addJS(priceValueVarName)
				.addJS(" = document.getElementById(\"")
				.addJS(priceInputId)
				.addJS("\").value;");
			aWriter.addJS_setNodeValue(priceValueVarName, Paths._Titles._Unit_price);
		}
		aWriter.addJS("}");

		//// sales

		String salesInputId = "sales_accessor";
		aWriter.add("<tr>");
		aWriter.add("<td>");
		aWriter.addLabel(Paths._Titles._Total_sales);
		aWriter.add("</td>");

		aWriter.add("<td>");
		aWriter.add("<input type=\"text\" id=\"").add(salesInputId).add("\"/>");
		aWriter.add("</td>");

		aWriter.add("<td>");
		UIButtonSpecJSAction getSales = new UIButtonSpecJSAction(
			UserMessage.createInfo("get"),
			"getSalesValue();");
		aWriter.addButtonJavaScript(getSales);
		UIButtonSpecJSAction setSales = new UIButtonSpecJSAction(
			UserMessage.createInfo("set"),
			"setSalesValue();");
		aWriter.addButtonJavaScript(setSales);
		aWriter.add("</td>");
		aWriter.add("</tr>");

		String salesValueVarName = "salesValue";

		aWriter.addJS("function getSalesValue(){");
		{
			aWriter.addJS("var ").addJS(salesValueVarName).addJS(" = ");
			aWriter.addJS_getNodeValue(Paths._Titles._Total_sales).addJS(";");
			aWriter.addJS("document.getElementById(\"")
				.addJS(salesInputId)
				.addJS("\").value = ")
				.addJS(salesValueVarName)
				.addJS(";");
		}
		aWriter.addJS("}");

		aWriter.addJS("function setSalesValue(){");
		{
			aWriter.addJS("var ")
				.addJS(salesValueVarName)
				.addJS(" = document.getElementById(\"")
				.addJS(salesInputId)
				.addJS("\").value;");
			aWriter.addJS_setNodeValue(salesValueVarName, Paths._Titles._Total_sales);
		}
		aWriter.addJS("}");

		aWriter.add("</table>");

		aWriter.endBorder();
	}
}