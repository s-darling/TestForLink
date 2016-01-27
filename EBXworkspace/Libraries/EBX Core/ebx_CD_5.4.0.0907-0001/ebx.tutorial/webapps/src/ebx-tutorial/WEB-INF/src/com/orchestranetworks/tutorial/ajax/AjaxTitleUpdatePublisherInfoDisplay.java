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
public class AjaxTitleUpdatePublisherInfoDisplay extends UIAjaxComponent
{

	public void doAjaxResponse(UIAjaxContext aResponse)
	{
		String newPublisherId = aResponse.getOptionalRequestParameterValue(TitleFormPane.PN_NEWPUBLISHER);
		Adaptation currentDataSet = aResponse.getCurrentDataSet();
		AdaptationTable table = currentDataSet.getTable(Paths._Publishers.getPathInSchema());
		String[] pk = new String[1];
		pk[0] = newPublisherId;
		Adaptation newPublisher = table.lookupAdaptationByPrimaryKey(table.computePrimaryKey(pk));
		JSONStringer jsonStringer = new JSONStringer();
		try
		{
			jsonStringer.object();
			jsonStringer.key(TitleFormPane.ID_PU_ID);
			if (newPublisher == null)
				jsonStringer.value("[Not defined]");
			else
				jsonStringer.value(newPublisher.getString(Paths._Publishers._Pub_id));
			jsonStringer.key(TitleFormPane.ID_PU_NAME);
			if (newPublisher == null)
				jsonStringer.value("[Not defined]");
			else
				jsonStringer.value(newPublisher.getString(Paths._Publishers._Name));
			jsonStringer.key(TitleFormPane.ID_PU_CITY);
			if (newPublisher == null)
				jsonStringer.value("[Not defined]");
			else
				jsonStringer.value(newPublisher.getString(Paths._Publishers._City));
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
