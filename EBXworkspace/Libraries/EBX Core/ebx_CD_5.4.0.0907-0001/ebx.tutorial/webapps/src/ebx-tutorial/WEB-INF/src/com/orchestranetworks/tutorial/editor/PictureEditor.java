/*
 * Copyright Orchestra Networks 2000-2006. All rights reserved.
 */
package com.orchestranetworks.tutorial.editor;

import com.orchestranetworks.schema.*;
import com.orchestranetworks.ui.*;

public class PictureEditor extends UIBeanEditor
{
	public void addForDisplay(UIResponseContext uiContext)
	{
		Object imageValue = uiContext.getValue();

		if (imageValue == null)
			return;

		String imagePath = uiContext.displayOccurrence(imageValue, true);

		String url = uiContext.getURLForResource(
			ResourceType.IMAGE,
			imagePath,
			uiContext.getLocale());

		uiContext.add("<img src=\"").add(url).add("\">");
	}

	public void addForEdit(UIResponseContext uiContext)
	{
		uiContext.addUIBestMatchingEditor(Path.SELF, "");
	}
}
