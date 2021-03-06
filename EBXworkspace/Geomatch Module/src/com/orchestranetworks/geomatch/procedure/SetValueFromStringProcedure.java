package com.orchestranetworks.geomatch.procedure;

import com.onwbp.adaptation.*;
import com.orchestranetworks.schema.*;
import com.orchestranetworks.service.*;

/**
 */
public final class SetValueFromStringProcedure implements Procedure
{
	private final Adaptation record;
	private Adaptation modifiedRecord;
	private final SchemaNode node;
	private final String value;

	public SetValueFromStringProcedure(
		final Adaptation aRecord,
		final SchemaNode aNode,
		final String aValue)
	{
		this.record = aRecord;
		this.node = aNode;
		this.value = aValue;
	}

	@Override
	public final void execute(ProcedureContext pContext) throws Exception
	{
		final ValueContextForUpdate vcfu = pContext.getContext(record.getAdaptationName());
		Object obj = (value == null) ? null : node.parseXsString(value);
		vcfu.setValue(obj, node.getPathInAdaptation());
		modifiedRecord = pContext.doModifyContent(record, vcfu);
	}

	public Adaptation getModifiedRecord()
	{
		return this.modifiedRecord;
	}
}
