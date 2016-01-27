/*
 * Copyright © Orchestra Networks 2000-2004. All rights reserved.
 */
package com.orchestranetworks.tutorial.defaultValues;

import java.math.*;

import com.onwbp.adaptation.*;
import com.orchestranetworks.schema.*;
import com.orchestranetworks.tutorial.module.*;

public class ComputeRoyaltyLowRangeDefaultValue implements ValueFunction
{
	public Object getValue(Adaptation adaptation)
	{
		int lo_range = adaptation.get_int(Paths._Royalties._Lo_range);
		int hi_range = adaptation.get_int(Paths._Royalties._Hi_range);

		int diff = hi_range - lo_range;
		BigDecimal value = diff > 0 ? new BigDecimal(diff * 0.8).setScale(
			2,
			BigDecimal.ROUND_HALF_UP) : new BigDecimal(0);
		return value;
	}

	public void setup(ValueFunctionContext context)
	{
	}
}
