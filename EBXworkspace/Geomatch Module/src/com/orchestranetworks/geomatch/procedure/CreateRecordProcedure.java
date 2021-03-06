package com.orchestranetworks.geomatch.procedure;

import java.util.*;

import com.onwbp.adaptation.*;
import com.orchestranetworks.schema.*;
import com.orchestranetworks.service.*;

public class CreateRecordProcedure implements Procedure
{
	private Adaptation createdRecord;
	private AdaptationTable adaptationTable;
	private Map<Path, Object> pathValueMap;
	private boolean enableAllPrivileges;
	private boolean disableTriggerActivation;

	/**
	 * @deprecated Use {@link execute(AdaptationTable, Map<Path, Object>,
	 *             Session)} instead. The Adaptation parameter is redundant
	 *             because it can be derived from the AdaptationTable.
	 */
	public static Adaptation execute(
		final Adaptation adaptation,
		final AdaptationTable adaptationTable,
		final Map<Path, Object> pathValueMap,
		Session session) throws OperationException
	{
		return CreateRecordProcedure.execute(adaptationTable, pathValueMap, session);
	}

	public static Adaptation execute(
		final AdaptationTable adaptationTable,
		final Map<Path, Object> pathValueMap,
		Session session) throws OperationException
	{
		return CreateRecordProcedure.execute(adaptationTable, pathValueMap, session, true, false);
	}

	/**
	 * @deprecated Use {@link execute(AdaptationTable, Map<Path, Object>,
	 *             Session, boolean, boolean)} instead. The Adaptation parameter
	 *             is redundant because it can be derived from the
	 *             AdaptationTable.
	 */
	public static Adaptation execute(
		final Adaptation adaptation,
		final AdaptationTable adaptationTable,
		final Map<Path, Object> pathValueMap,
		Session session,
		boolean enableAllPrivileges,
		boolean disableTriggerActivation) throws OperationException
	{
		return CreateRecordProcedure.execute(
			adaptationTable,
			pathValueMap,
			session,
			enableAllPrivileges,
			disableTriggerActivation);
	}

	public static Adaptation execute(
		final AdaptationTable adaptationTable,
		final Map<Path, Object> pathValueMap,
		Session session,
		boolean enableAllPrivileges,
		boolean disableTriggerActivation) throws OperationException
	{
		CreateRecordProcedure procedure = new CreateRecordProcedure(adaptationTable, pathValueMap);
		procedure.enableAllPrivileges = enableAllPrivileges;
		procedure.disableTriggerActivation = disableTriggerActivation;
		ProcedureExecutor.executeProcedure(
			procedure,
			session,
			adaptationTable.getContainerAdaptation());
		return procedure.getCreatedRecord();
	}

	public CreateRecordProcedure()
	{
	}

	public CreateRecordProcedure(
		final AdaptationTable adaptationTable,
		final Map<Path, Object> pathValueMap)
	{
		this.adaptationTable = adaptationTable;
		this.pathValueMap = pathValueMap;
	}

	public Adaptation getCreatedRecord()
	{
		return this.createdRecord;
	}

	public void setCreatedRecord(Adaptation createdRecord)
	{
		this.createdRecord = createdRecord;
	}

	public AdaptationTable getAdaptationTable()
	{
		return adaptationTable;
	}

	public void setAdaptationTable(AdaptationTable adaptationTable)
	{
		this.adaptationTable = adaptationTable;
	}

	public Map<Path, Object> getPathValueMap()
	{
		return pathValueMap;
	}

	public void setPathValueMap(Map<Path, Object> pathValueMap)
	{
		this.pathValueMap = pathValueMap;
	}

	public boolean isEnableAllPrivileges()
	{
		return enableAllPrivileges;
	}

	public void setEnableAllPrivileges(boolean enableAllPrivileges)
	{
		this.enableAllPrivileges = enableAllPrivileges;
	}

	public boolean isDisableTriggerActivation()
	{
		return disableTriggerActivation;
	}

	public void setDisableTriggerActivation(boolean disableTriggerActivation)
	{
		this.disableTriggerActivation = disableTriggerActivation;
	}

	@Override
	public void execute(ProcedureContext pContext) throws Exception
	{
		createdRecord = CreateRecordProcedure.execute(
			pContext,
			adaptationTable,
			pathValueMap,
			enableAllPrivileges,
			disableTriggerActivation);
	}

	public static Adaptation execute(
		ProcedureContext pContext,
		AdaptationTable adaptationTable,
		final Map<Path, Object> pathValueMap) throws OperationException
	{
		return CreateRecordProcedure.execute(pContext, adaptationTable, pathValueMap, true, false);
	}

	public static Adaptation execute(
		ProcedureContext pContext,
		AdaptationTable adaptationTable,
		final Map<Path, Object> pathValueMap,
		boolean enableAllPrivileges,
		boolean disableTriggerActivation) throws OperationException
	{
		// Note that even if disableTriggerActivation is true, the
		// handleNewContext will still get called.
		// That is usually the desired behavior, but if that situation arises,
		// this class can be modified to allow for it.
		// We would call pContext.getContext in that case.
		final ValueContextForUpdate vc = pContext.getContextForNewOccurrence(adaptationTable);
		final Set<Path> paths = pathValueMap.keySet();
		for (Path path : paths)
		{
			vc.setValue(pathValueMap.get(path), path);
		}
		if (enableAllPrivileges)
		{
			pContext.setAllPrivileges(true);
		}
		if (disableTriggerActivation)
		{
			pContext.setTriggerActivation(false);
		}
		Adaptation newRecord = pContext.doCreateOccurrence(vc, adaptationTable);
		if (enableAllPrivileges)
		{
			pContext.setAllPrivileges(false);
		}
		if (disableTriggerActivation)
		{
			pContext.setTriggerActivation(true);
		}

		return newRecord;
	}
}
