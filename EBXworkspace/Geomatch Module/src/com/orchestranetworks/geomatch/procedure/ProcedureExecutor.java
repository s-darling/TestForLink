/*
 * Copyright Orchestra Networks 2000-2012. All rights reserved.
 */
package com.orchestranetworks.geomatch.procedure;

import com.onwbp.adaptation.*;
import com.orchestranetworks.service.*;

/**
 */
public class ProcedureExecutor {
	public static void executeProcedure(final Procedure procedure,
			final Session session, final Adaptation adaptation)
			throws OperationException {
		AdaptationHome dataSpace = adaptation.isSchemaInstance() ? adaptation
				.getHome() : adaptation.getContainer().getHome();
		executeProcedure(procedure, session, dataSpace);
	}

	public static void executeProcedure(final Procedure procedure,
			final Session session, final AdaptationHome dataSpace)
			throws OperationException {
		executeProcedure(procedure, session, dataSpace, null);
	}

	public static void executeProcedure(final Procedure procedure,
			final Session session, final AdaptationHome dataSpace,
			final String trackingInfo) throws OperationException {
		String oldTrackingInfo = session.getTrackingInfo();
		ProgrammaticService svc = ProgrammaticService.createForSession(session,
				dataSpace);
		if (trackingInfo != null) {
			svc.setSessionTrackingInfo(trackingInfo);
		}
		OperationException ex;
		try {
			ProcedureResult procResult = svc.execute(procedure);
			ex = procResult.getException();
		} finally {
			if (trackingInfo != null) {
				svc.setSessionTrackingInfo(oldTrackingInfo);
			}
		}
		if (ex != null) {
			throw ex;
		}
	}

	private ProcedureExecutor() {
	}
}
