package com.orchestranetworks.geomatch.procedure;

import java.util.*;

import com.onwbp.adaptation.*;
import com.orchestranetworks.schema.*;
import com.orchestranetworks.service.*;

public class ModifyValuesProcedure implements Procedure {
	private Adaptation adaptation;
	private Adaptation modifiedAdaptation;
	private Map<Path, Object> pathValueMap;
	private boolean enableAllPrivileges;
	private boolean disableTriggerActivation;

	public static Adaptation execute(final Adaptation adaptation,
			final Map<Path, Object> pathValueMap, Session session)
			throws OperationException {
		return ModifyValuesProcedure.execute(adaptation, pathValueMap, session,
				true, false);
	}

	public static Adaptation execute(final Adaptation adaptation,
			final Map<Path, Object> pathValueMap, Session session,
			boolean enableAllPrivileges, boolean disableTriggerActivation)
			throws OperationException {
		ModifyValuesProcedure procedure = new ModifyValuesProcedure(adaptation,
				pathValueMap);
		procedure.enableAllPrivileges = enableAllPrivileges;
		procedure.disableTriggerActivation = disableTriggerActivation;
		ProcedureExecutor.executeProcedure(procedure, session, adaptation);
		return procedure.getModifiedAdaptation();
	}

	public ModifyValuesProcedure() {
	}

	public ModifyValuesProcedure(final Adaptation adaptation,
			final Map<Path, Object> pathValueMap) {
		this.adaptation = adaptation;
		this.pathValueMap = pathValueMap;
	}

	public Adaptation getAdaptation() {
		return adaptation;
	}

	public void setAdaptation(Adaptation adaptation) {
		this.adaptation = adaptation;
	}

	public Map<Path, Object> getPathValueMap() {
		return pathValueMap;
	}

	public void setPathValueMap(Map<Path, Object> pathValueMap) {
		this.pathValueMap = pathValueMap;
	}

	public boolean isEnableAllPrivileges() {
		return enableAllPrivileges;
	}

	public void setEnableAllPrivileges(boolean enableAllPrivileges) {
		this.enableAllPrivileges = enableAllPrivileges;
	}

	public boolean isDisableTriggerActivation() {
		return disableTriggerActivation;
	}

	public void setDisableTriggerActivation(boolean disableTriggerActivation) {
		this.disableTriggerActivation = disableTriggerActivation;
	}

	public Adaptation getModifiedAdaptation() {
		return this.modifiedAdaptation;
	}

	public void setModifiedAdaptation(Adaptation modifiedAdaptation) {
		this.modifiedAdaptation = modifiedAdaptation;
	}

	@Override
	public void execute(ProcedureContext pContext) throws Exception {
		modifiedAdaptation = ModifyValuesProcedure.execute(pContext,
				adaptation, pathValueMap, enableAllPrivileges,
				disableTriggerActivation);
	}

	public static Adaptation execute(ProcedureContext pContext,
			Adaptation adaptation, final Map<Path, Object> pathValueMap)
			throws OperationException {
		return ModifyValuesProcedure.execute(pContext, adaptation,
				pathValueMap, true, false);
	}

	public static Adaptation execute(ProcedureContext pContext,
			Adaptation adaptation, final Map<Path, Object> pathValueMap,
			boolean enableAllPrivileges, boolean disableTriggerActivation)
			throws OperationException {

		final ValueContextForUpdate vc = pContext.getContext(adaptation
				.getAdaptationName());
		final Set<Path> paths = pathValueMap.keySet();
		for (Path path : paths) {
			vc.setValue(pathValueMap.get(path), path);
		}
		if (enableAllPrivileges) {
			pContext.setAllPrivileges(true);
		}
		if (disableTriggerActivation) {
			pContext.setTriggerActivation(false);
		}
		Adaptation modifiedAdaptation = pContext
				.doModifyContent(adaptation, vc);
		if (enableAllPrivileges) {
			pContext.setAllPrivileges(false);
		}
		if (disableTriggerActivation) {
			pContext.setTriggerActivation(true);
		}

		return modifiedAdaptation;
	}
}
