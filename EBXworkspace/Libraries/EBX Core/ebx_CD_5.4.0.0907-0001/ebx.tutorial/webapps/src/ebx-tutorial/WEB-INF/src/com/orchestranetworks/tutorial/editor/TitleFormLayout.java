/*
 * Copyright Orchestra Networks 2000-2010. All rights reserved.
 */
package com.orchestranetworks.tutorial.editor;

import com.onwbp.base.text.*;
import com.orchestranetworks.ui.*;
import com.orchestranetworks.ui.form.*;

public class TitleFormLayout extends UIForm
{
	public void defineBody(UIFormBody aBody, UIFormContext aContext)
	{
		aBody.setContent(new TitleFormPane());
	}

	public void defineHeader(UIFormHeader aHeader, UIFormContext aContext)
	{
		if (aContext.isCreatingRecord())
			aHeader.setTitle(new UIFormLabelSpec("Create a new book"));
	}

	public void defineBottomBar(UIFormBottomBar aBottomBar, UIFormContext aContext)
	{
		if (aContext.isCreatingRecord())
			aBottomBar.setRevertButtonDisplayable(false);

		if (aContext.isCreatingRecord())
			aBottomBar.setSubmitButtonLabel(UserMessage.createInfo("Create"));
		else
			aBottomBar.setSubmitButtonLabel(UserMessage.createInfo("Save"));

		if (!aContext.isCreatingRecord())
			aBottomBar.setSubmitAndCloseButtonLabel(UserMessage.createInfo("Save and close"));
		else
			aBottomBar.setSubmitAndCloseButtonDisplayable(false);
	}
}