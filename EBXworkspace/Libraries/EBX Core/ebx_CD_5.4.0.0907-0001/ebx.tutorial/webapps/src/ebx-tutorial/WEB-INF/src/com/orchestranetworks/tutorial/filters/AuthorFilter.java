/*
 * Copyright © Orchestra Networks 2000-2004. All rights reserved.
 */
package com.orchestranetworks.tutorial.filters;

import java.util.*;

import com.onwbp.adaptation.*;
import com.orchestranetworks.instance.*;
import com.orchestranetworks.schema.*;
import com.orchestranetworks.tutorial.module.*;
import com.orchestranetworks.ui.*;

public class AuthorFilter extends UITableFilter
{
	private String[] selection = DEFAULT_SELECTION;
	private static final String[] DEFAULT_SELECTION = new String[] {};

	private class Author_Filter implements AdaptationFilter
	{
		private final String[] selection;

		public Author_Filter(String[] selection)
		{
			this.selection = selection;
		}

		public boolean accept(Adaptation anAdaptation)
		{
			String[] selection = this.selection;
			if (selection == null || selection.length == 0)
				return true;

			String author = anAdaptation.getString(Path.ROOT.add(Paths._Titles._Au_id));

			if (author == null)
				return false;

			for (int i = 0; i < selection.length; i++)
			{
				String selected = selection[i];

				if (selected.equals(author))
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

		SchemaNode au_idNode = table.getTableOccurrenceRootNode().getNode(
			Paths._Titles.getPathInSchema().add(Paths._Titles._Au_id));

		ValueContext valueContext = aResponse.getValueContext();
		List enumList = au_idNode.getEnumerationList(valueContext);
		if (enumList != null)
		{
			for (int i = 0; i < enumList.size(); i++)
			{
				String id = (String) enumList.get(i);
				String label = au_idNode.displayOccurrence(
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

	public boolean isResetButtonEnabled()
	{
		return this.selection.length > 0;
	}

	public boolean hasFilterToApply()
	{
		return this.selection.length > 0;
	}

	private void setTableFilter(UITableFilterRequestContext aContext)
	{
		if (this.selection.length == 0)
			aContext.setTableFilter(null);
		else
			aContext.setTableFilter(new Author_Filter(this.selection));
	}
}
