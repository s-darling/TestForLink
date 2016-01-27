/*
 * Copyright Orchestra Networks 2000-2011. All rights reserved.
 */
package com.orchestranetworks.tutorial.ajax;

import com.onwbp.adaptation.*;
import com.onwbp.org.json.*;
import com.orchestranetworks.tutorial.editor.*;
import com.orchestranetworks.tutorial.module.*;
import com.orchestranetworks.ui.*;

/**
 */
public class AjaxTitleUpdateAuthorInfoDisplay extends UIAjaxComponent
{

	public void doAjaxResponse(UIAjaxContext aResponse)
	{
		String newAuthorId = aResponse.getOptionalRequestParameterValue(TitleFormPane.PN_NEWAUTHOR);
		Adaptation currentDataSet = aResponse.getCurrentDataSet();
		AdaptationTable table = currentDataSet.getTable(Paths._Authors.getPathInSchema());
		String[] pk = new String[1];
		pk[0] = newAuthorId;
		Adaptation newAuthor = table.lookupAdaptationByPrimaryKey(table.computePrimaryKey(pk));
		JSONStringer jsonStringer = new JSONStringer();
		try
		{
			jsonStringer.object();
			jsonStringer.key(TitleFormPane.ID_AU_ID);
			if (newAuthor == null)
				jsonStringer.value("[Not defined]");
			else
				jsonStringer.value(newAuthor.getString(Paths._Authors._Au_id));
			jsonStringer.key(TitleFormPane.ID_AU_FN);
			if (newAuthor == null)
				jsonStringer.value("[Not defined]");
			else
				jsonStringer.value(newAuthor.getString(Paths._Authors._Firstname));
			jsonStringer.key(TitleFormPane.ID_AU_LN);
			if (newAuthor == null)
				jsonStringer.value("[Not defined]");
			else
				jsonStringer.value(newAuthor.getString(Paths._Authors._Lastname));
			jsonStringer.endObject();
		}
		catch (JSONException ex)
		{
			// TODO Auto-generated catch block
			throw new RuntimeException(ex);
		}
		aResponse.add(jsonStringer.toString());
	}

}
