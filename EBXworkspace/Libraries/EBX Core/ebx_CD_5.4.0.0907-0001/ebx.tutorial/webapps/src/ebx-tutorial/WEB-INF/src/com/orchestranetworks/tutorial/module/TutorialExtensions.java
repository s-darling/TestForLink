/*
 * Copyright Orchestra Networks 2000-2011. All rights reserved.
 */
package com.orchestranetworks.tutorial.module;

import com.onwbp.adaptation.*;
import com.onwbp.org.apache.axis.utils.*;
import com.orchestranetworks.schema.*;
import com.orchestranetworks.service.*;

/**
 */
public class TutorialExtensions implements SchemaExtensions
{

	public void defineExtensions(SchemaExtensionsContext aContext)
	{
		SchemaNode table = aContext.getSchemaNode().getNode(Paths._Authors.getPathInSchema());

		aContext.setAccessRuleOnOccurrence(table.getPathInAdaptation(), new AccessRule()
		{
			public AccessPermission getPermission(
				Adaptation anOccurrence,
				Session aSession,
				SchemaNode aNode)
			{
				String country = anOccurrence.getString(Paths._Authors._Country);

				if (aSession.isUserInRole(Profile.ADMINISTRATOR))
					return AccessPermission.getReadWrite();

				if (!StringUtils.isEmpty(country))
				{
					if ("France".equalsIgnoreCase(country))
						return AccessPermission.getHidden();
				}

				return AccessPermission.getReadWrite();
			};
		});

	}
}