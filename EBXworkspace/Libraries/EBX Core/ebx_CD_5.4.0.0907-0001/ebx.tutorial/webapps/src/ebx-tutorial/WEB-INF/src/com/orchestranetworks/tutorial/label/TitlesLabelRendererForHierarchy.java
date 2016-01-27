/*
 * Copyright Orchestra Networks 2000-2011. All rights reserved.
 */
package com.orchestranetworks.tutorial.label;

import com.onwbp.adaptation.*;
import com.onwbp.adaptation.perspective.hierarchy.*;
import com.orchestranetworks.ui.*;

/**
 */
public class TitlesLabelRendererForHierarchy implements UILabelRendererForHierarchy
{

	public void displayLabel(UILabelRendererForHierarchyContext context)
	{
		UILabelRendererForHierarchyContextImpl contextForHierarchy = (UILabelRendererForHierarchyContextImpl) context;
		context.setDefaultLinkEnabled(false);
		contextForHierarchy.setDisplayDefaultIcon(false);

		context.add("<img src=\"").add(
			context.getURLForResource("/www/common/images/icons/ebx_infinite.png")).add(
			"\" style=\"border: 0;\"/> ");

		Adaptation record = context.getHierarchyNode().getOccurrence();

		context.add("<a href=\"").add(context.getURLForSelectingCurrentNode()).add("\">");
		context.add("Label Renderer : ").add(context.getLabelFromDefaultPattern());
		context.add("</a>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;");

		UIHttpManagerComponent webComponent = UIHttpManagerComponent.createOnUILabelRendererForHierarchyContext(context);

		Adaptation dataSet = record.getContainer();
		webComponent.select(
			dataSet.getHome().getKey(),
			dataSet.getAdaptationName(),
			record.toXPathExpression());

		contextForHierarchy.addPreviewLink(
			webComponent.getURIWithParameters(),
			"Record outside hierarchy");
	}
}