/*
 * Copyright Orchestra Networks 2000-2004. All rights reserved.
 */
package com.orchestranetworks.tutorial.filters;

import java.util.*;

import com.onwbp.adaptation.*;
import com.orchestranetworks.instance.*;
import com.orchestranetworks.schema.*;
import com.orchestranetworks.tutorial.module.*;
import com.orchestranetworks.ui.*;

public class PublisherFilter extends UITableFilter
{
	private String[] selection = DEFAULT_SELECTION;
	private static final String[] DEFAULT_SELECTION = new String[] {};

	private class Publisher_Filter implements AdaptationFilter
	{
		private final String[] selection;

		public Publisher_Filter(String[] selection)
		{
			this.selection = selection;
		}

		public boolean accept(Adaptation anAdaptation)
		{
			String[] selection = this.selection;
			if (selection == null || selection.length == 0)
				return true;

			String publisher = anAdaptation.getString(Path.ROOT.add(Paths._Titles._Pub_id));

			if (publisher == null)
				return false;

			for (int i = 0; i < selection.length; i++)
			{
				String selected = selection[i];

				if (selected.equals(publisher))
					return true;
			}
			return false;
		}
	}

	public void addForEdit(UITableFilterResponseContext aResponse)
	{
		aResponse.add("<table border=0 width=\"100%\">");
		aResponse.add("<tr>");
		aResponse.add("<td>");
		aResponse.add("<p class=\"text\">");

		this.addChoices_Type(aResponse);

		aResponse.add("</p>");

		aResponse.add("</td>");
		aResponse.add("</tr>");
		aResponse.add("</table>");
	}

	private void addChoices_Type(UITableFilterResponseContext aResponse)
	{
		List selection = Arrays.asList(this.selection);

		AdaptationTable table = aResponse.getTable();

		SchemaNode pub_idNode = table.getTableOccurrenceRootNode().getNode(
			Paths._Titles.getPathInSchema().add(Paths._Titles._Pub_id));

		ValueContext valueContext = aResponse.getValueContext();
		List enumList = pub_idNode.getEnumerationList(valueContext);
		if (enumList != null)
		{
			for (int i = 0; i < enumList.size(); i++)
			{
				String id = (String) enumList.get(i);
				String label = pub_idNode.displayOccurrence(
					id,
					true,
					valueContext,
					aResponse.getSession().getLocale());

				aResponse.add("<input type=\"checkbox\" name=\"item\" style=\"border: 0;\" value=\"");
				aResponse.add(id);
				aResponse.add("\" ");
				if (selection.contains(id))
					aResponse.add("checked");
				aResponse.add("> ");

				aResponse.addSafeInnerHTML(label);
				aResponse.add("<br>");
			}
		}
	}

	public void handleApply(UITableFilterRequestContext aContext)
	{
		this.selection = aContext.getParameterValues("item");
		if (this.selection == null)
			this.selection = DEFAULT_SELECTION;

		this.setTableFilter(aContext);
	}

	public void handleReset()
	{
		this.selection = DEFAULT_SELECTION;
	}

	public boolean hasFilterToApply()
	{
		return this.selection.length > 0;
	}

	public boolean isResetButtonEnabled()
	{
		return this.selection.length > 0;
	}

	private void setTableFilter(UITableFilterRequestContext aContext)
	{
		if (this.selection.length == 0)
			aContext.setTableFilter(null);
		else
			aContext.setTableFilter(new Publisher_Filter(this.selection));
	}
}
