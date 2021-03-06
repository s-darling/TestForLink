/*
 * Copyright Orchestra Networks 2000-2012. All rights reserved.
 */
package com.orchestranetworks.geomatch.procedure;

import com.onwbp.adaptation.*;
import com.orchestranetworks.service.*;

/**
 */
public class DeleteRecordProcedure implements Procedure {
	private Adaptation adaptation;
	private boolean enableAllPrivileges;
	private boolean disableTriggerActivation;
	private boolean deletingChildren;

	public static void execute(final Adaptation adaptation, Session session)
			throws OperationException {
		DeleteRecordProcedure.execute(adaptation, session, true, false, false);
	}

	public static void execute(final Adaptation adaptation, Session session,
			boolean enableAllPrivileges, boolean disableTriggerActivation,
			boolean deletingChildren) throws OperationException {
		DeleteRecordProcedure procedure = new DeleteRecordProcedure(adaptation);
		procedure.enableAllPrivileges = enableAllPrivileges;
		procedure.disableTriggerActivation = disableTriggerActivation;
		procedure.deletingChildren = deletingChildren;
		ProcedureExecutor.executeProcedure(procedure, session, adaptation);
	}

	public DeleteRecordProcedure() {
	}

	public DeleteRecordProcedure(final Adaptation adaptation) {
		this.adaptation = adaptation;
	}

	public Adaptation getAdaptation() {
		return this.adaptation;
	}

	public void setAdaptation(Adaptation adaptation) {
		this.adaptation = adaptation;
	}

	public boolean isEnableAllPrivileges() {
		return this.enableAllPrivileges;
	}

	public void setEnableAllPrivileges(boolean enableAllPrivileges) {
		this.enableAllPrivileges = enableAllPrivileges;
	}

	public boolean isDisableTriggerActivation() {
		return this.disableTriggerActivation;
	}

	public void setDisableTriggerActivation(boolean disableTriggerActivation) {
		this.disableTriggerActivation = disableTriggerActivation;
	}

	public boolean isDeletingChildren() {
		return this.deletingChildren;
	}

	public void setDeletingChildren(boolean deletingChildren) {
		this.deletingChildren = deletingChildren;
	}

	@Override
	public void execute(ProcedureContext pContext) throws Exception {
		DeleteRecordProcedure
				.execute(pContext, adaptation, enableAllPrivileges,
						disableTriggerActivation, deletingChildren);
	}

	public static void execute(ProcedureContext pContext, Adaptation adaptation)
			throws OperationException {
		DeleteRecordProcedure.execute(pContext, adaptation, true, false, false);
	}

	public static void execute(ProcedureContext pContext,
			Adaptation adaptation, boolean enableAllPrivileges,
			boolean disableTriggerActivation, boolean deletingChildren)
			throws OperationException {
		if (enableAllPrivileges) {
			pContext.setAllPrivileges(true);
		}
		if (disableTriggerActivation) {
			pContext.setTriggerActivation(false);
		}
		pContext.doDelete(adaptation.getAdaptationName(), deletingChildren);
		if (enableAllPrivileges) {
			pContext.setAllPrivileges(false);
		}
		if (disableTriggerActivation) {
			pContext.setTriggerActivation(true);
		}
	}
}
