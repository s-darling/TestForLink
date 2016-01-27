/*
 * Copyright © Orchestra Networks 2000-2004. All rights reserved.
 */
package com.orchestranetworks.tutorial.constraints;

import java.util.*;

import com.orchestranetworks.instance.*;
import com.orchestranetworks.schema.*;
import com.orchestranetworks.tutorial.module.*;

public class CheckRoyaltyLowRange implements Constraint
{
	String param1;
	int interval;

	public String getParam1()
	{
		return this.param1;
	}

	public void setParam1(String param1)
	{
		this.param1 = param1;
	}

	public void setup(ConstraintContext aContext)
	{
		// check param is present
		if (this.getParam1() == null)
		{
			aContext.addError("param1 is not defined !");
			return;
		}

		// check param is an integer value
		try
		{
			this.interval = Integer.parseInt(this.getParam1());
		}
		catch (Exception e)
		{
			aContext.addError("param1 must be an integer !");
			return;
		}

		// declare dependencies
		aContext.addDependencyToModify(aContext.getSchemaNode().getNode(
			Path.PARENT.add(Paths._Royalties._Hi_range)));
	}

	public void checkOccurrence(Object aValue, ValueContextForValidation aValidationContext)
	{
		Integer lo_range = (Integer) aValue;
		Integer hi_range = (Integer) aValidationContext.getValue(Path.PARENT.add(Paths._Royalties._Hi_range));

		if (hi_range == null)
			return;

		int diff = hi_range.intValue() - lo_range.intValue();
		if (diff > this.interval)
		{
			aValidationContext.addError("The interval between Min and Max must be lower than "
				+ this.interval);
			return;
		}

	}

	public String toUserDocumentation(Locale arg0, ValueContext arg1) throws InvalidSchemaException
	{
		return "Programmatic constraint checking that the interval between Min and Max does not exceed "
			+ this.interval;
	}
}
