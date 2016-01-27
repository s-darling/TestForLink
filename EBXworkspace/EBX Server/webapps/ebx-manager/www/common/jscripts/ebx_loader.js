function EBX_Loader() {}

EBX_Loader.loadPage = function() {
	ebx_SetLoaderStarted();

	EBX_Loader.checkTasksConditions();
	/*
	 EBX_Loader.manageTasksToExecuteDisplaying();
	 */
	/*
	 EBX_Loader.initProgressBar();
	 */
	EBX_Loader.scheduler();
};
YAHOO.util.Event.onDOMReady(EBX_Loader.loadPage);

ebx_SetLoaderPending();

/* the first task (loading HTML) is always done */
EBX_Loader.currentTaskIndexLaunched = 0;
EBX_Loader.scheduler = function() {
	var currentTask = EBX_Loader.tasksToExecute[EBX_Loader.currentTaskIndexLaunched];

	if (currentTask === undefined) {
		if (EBXUtils.chronoStart !== undefined) {
			EBXUtils.chronoStop = new Date();
			document.title += " (" + (EBXUtils.chronoStop - EBXUtils.chronoStart) + " ms)";
			var parentWindow = window.parent;
			// parentWindow can be null in the case of cross-domain iframes
			while (parentWindow !== null && parentWindow !== parentWindow.parent) {
				parentWindow = parentWindow.parent;
			}
			if (parentWindow !== null && EBX_LayoutManager.isEmbedded()) {
				parentWindow.document.title += " (+ " + (EBXUtils.chronoStop - EBXUtils.chronoStart) + " ms for iFrame)";
			}
		}

		ebx_SetLoaderFinished();

		return;
	}

	if (currentTask.state === EBX_Loader.states.done) {
		// go to next task
		EBX_Loader.currentTaskIndexLaunched++;

		EBX_Loader.scheduler();
	} else if (currentTask.state === EBX_Loader.states.onStarting) {
		/*
		 EBX_Loader.progressBar.set("value", EBX_Loader.currentTaskIndexLaunched + 1);
		 */
		window.setTimeout(currentTask.bind, 0);
	} else if (currentTask.state === EBX_Loader.states.processing) {
		// nothing to do
	}
};

EBX_Loader.tasks = [];

EBX_Loader.getTaskFromId = function(taskId) {
	var tasks_length = EBX_Loader.tasks.length;
	for ( var i = 0; i < tasks_length; i++) {
		if (EBX_Loader.tasks[i].id === taskId) {
			return EBX_Loader.tasks[i];
		}
	}
	return null;
};
EBX_Loader.getIndexFromId = function(taskId) {
	var tasks_length = EBX_Loader.tasks.length;
	for ( var i = 0; i < tasks_length; i++) {
		if (EBX_Loader.tasks[i].id === taskId) {
			return i;
		}
	}
	return -1;
};

EBX_Loader.changeTaskState = function(taskId, newState) {
	var task = EBX_Loader.getTaskFromId(taskId);
	if (task === null) {
		EBXLogger.log("EBX_Loader.changeTaskState: unknown task with id='" + taskId + "'. Loading next tasks aborted.", EBXLogger.error);
		return;
	}

	task.state = newState;

	EBX_Loader.scheduler();
	/*
	 EBX_Loader.refreshLoadingLayer();
	 */
};

EBX_Loader.taskLineClassName = "ebx_TaskLine";
EBX_Loader.currentTaskClassName = "ebx_CurrentTask";
EBX_Loader.refreshLoadingLayer = function() {
	var task;
	var taskLine;
	var tasksToExecute_length = EBX_Loader.tasksToExecute.length;
	for ( var i = 0; i < tasksToExecute_length; i++) {
		task = EBX_Loader.tasksToExecute[i];

		if (task.messageId === null || !YAHOO.util.Dom.inDocument(task.messageId)) {
			continue;
		}

		taskLine = document.getElementById(task.messageId);

		taskLine.className = EBX_Loader.taskLineClassName;

		if (i === EBX_Loader.currentTaskIndexLaunched) {
			EBXUtils.addCSSClass(taskLine, EBX_Loader.currentTaskClassName);
		}

		EBXUtils.addCSSClass(taskLine, task.state.className);
	}
};

EBX_Loader.tasksToExecute = [];
EBX_Loader.tasksToNotExecute = [];
EBX_Loader.checkTasksConditions = function() {
	EBX_Loader.tasksToExecute = [];
	EBX_Loader.tasksToNotExecute = [];
	var tasks_length = EBX_Loader.tasks.length;
	var task;
	for ( var i = 0; i < tasks_length; i++) {
		task = EBX_Loader.tasks[i];
		if (task.condition.call()) {
			EBX_Loader.tasksToExecute.push(task);
		} else {
			EBX_Loader.tasksToNotExecute.push(task);
		}
	}
};
EBX_Loader.manageTasksToExecuteDisplaying = function() {
	var tasksToExecute_length = EBX_Loader.tasksToExecute.length;
	for ( var i = 0; i < tasksToExecute_length; i++) {
		if (EBX_Loader.tasksToExecute[i].messageId !== null && YAHOO.util.Dom.inDocument(EBX_Loader.tasksToExecute[i].messageId)) {
			document.getElementById(EBX_Loader.tasksToExecute[i].messageId).style.display = "block";
		}
	}

	var tasksToNotExecute_length = EBX_Loader.tasksToNotExecute.length;
	for (i = 0; i < tasksToNotExecute_length; i++) {
		if (EBX_Loader.tasksToNotExecute[i].messageId !== null && YAHOO.util.Dom.inDocument(EBX_Loader.tasksToNotExecute[i].messageId)) {
			document.getElementById(EBX_Loader.tasksToNotExecute[i].messageId).style.display = "none";
		}
	}
};

EBX_Loader.isIE = function() {
	return YAHOO.env.ua.ie !== 0;
};
/*
 * IE does not support the DOM movings for a <select>: the selection is loss
 * see http://support.microsoft.com/kb/829907
 */
EBX_Loader.SaveFieldsStateForIE = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_save_fields_state_for_ie, EBX_Loader.states.processing);

	var selectEls = document.getElementsByTagName("SELECT");
	var i = selectEls.length;
	while (i--) {
		var selectEl = selectEls[i];
		if (selectEl.multiple === true) {
			var j = selectEl.options.length;
			while (j--) {
				var optionEl = selectEl.options[j];
				optionEl.ebx_Selected = optionEl.selected;
			}
		} else {
			selectEl.ebx_SelectedIndex = selectEl.selectedIndex;
		}
	}

	var inputEls = document.getElementsByTagName("INPUT");
	i = inputEls.length;
	while (i--) {
		var inputEl = inputEls[i];
		if (inputEl.type !== "password") {
			continue;
		}
		inputEl.ebx_Value = inputEl.value;
	}

	EBX_Loader.changeTaskState(EBX_Loader_taskId_save_fields_state_for_ie, EBX_Loader.states.done);
};
EBX_Loader.RestoreFieldsStateForIE = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_restore_fields_state_for_ie, EBX_Loader.states.processing);

	var selectEls = document.getElementsByTagName("SELECT");
	var i = selectEls.length;
	while (i--) {
		var selectEl = selectEls[i];
		if (selectEl.multiple === true) {
			var j = selectEl.options.length;
			while (j--) {
				var optionEl = selectEl.options[j];
				optionEl.selected = optionEl.ebx_Selected;
			}
		} else {
			selectEl.selectedIndex = selectEl.ebx_SelectedIndex;
		}
	}

	var inputEls = document.getElementsByTagName("INPUT");
	i = inputEls.length;
	while (i--) {
		var inputEl = inputEls[i];
		if (inputEl.type !== "password") {
			continue;
		}
		inputEl.value = inputEl.ebx_Value;
	}

	EBX_Loader.changeTaskState(EBX_Loader_taskId_restore_fields_state_for_ie, EBX_Loader.states.done);
};

EBX_Loader.PageScriptId = "ebx_PageScript";
EBX_Loader.PageScriptExtensionId = "ebx_PageScriptExtension";
EBX_Loader.isPageScriptPresent = function() {
	return document.getElementById(EBX_Loader.PageScriptId) !== null || document.getElementById(EBX_Loader.PageScriptExtensionId) !== null;
};
EBX_Loader.loadPageScript = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_page_script, EBX_Loader.states.processing);

	var pageScriptText = document.getElementById(EBX_Loader.PageScriptId);
	if (pageScriptText !== null) {
		var pageScriptEl = document.createElement("script");
		pageScriptEl.type = "text/javascript";

		pageScriptEl.text = pageScriptText.innerHTML;

		pageScriptText.parentNode.removeChild(pageScriptText);

		document.body.appendChild(pageScriptEl);
	}

	EBX_Loader.changeTaskState(EBX_Loader_taskId_page_script, EBX_Loader.states.done);
};
EBX_Loader.isPageScriptExtensionPresent = function() {
	return document.getElementById(EBX_Loader.PageScriptExtensionId) !== null;
};
EBX_Loader.loadPageScriptExtension = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_page_script_extension, EBX_Loader.states.processing);

	var pageScriptExtensionText = document.getElementById(EBX_Loader.PageScriptExtensionId);
	if (pageScriptExtensionText !== null) {
		var pageScriptExtensionEl = document.createElement("script");
		pageScriptExtensionEl.type = "text/javascript";

		pageScriptExtensionEl.text = pageScriptExtensionText.innerHTML;

		pageScriptExtensionText.parentNode.removeChild(pageScriptExtensionText);

		document.body.appendChild(pageScriptExtensionEl);
	}

	EBX_Loader.changeTaskState(EBX_Loader_taskId_page_script_extension, EBX_Loader.states.done);
};

/*
 EBX_Loader.progressBar = null;
 EBX_Loader.initProgressBar = function(){
 EBX_Loader.progressBar = new YAHOO.widget.ProgressBar({
 width: "300px",
 anim: true,
 maxValue: EBX_Loader.tasksToExecute.length - 2
 });
 EBX_Loader.progressBar.render(document.getElementById("ebx_LoadingProgressBar"));
 EBX_Loader.progressBar.set("value", 1);
 };
 */
EBX_Loader.loadingLayerId = "ebx_LoadingLayer";
EBX_Loader.destroyLoadingLayer = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_destroy_loading_layer, EBX_Loader.states.processing);

	/*
	 EBX_Loader.progressBar.destroy();
	 */
	var loadingLayer = document.getElementById(EBX_Loader.loadingLayerId);
	loadingLayer.parentNode.removeChild(loadingLayer);

	EBX_Loader.changeTaskState(EBX_Loader_taskId_destroy_loading_layer, EBX_Loader.states.done);
};

EBX_Loader.states = function() {};
EBX_Loader.states.onStarting = {
	className: "ebx_State_OnStarting"
};
EBX_Loader.states.processing = {
	className: "ebx_State_Processing"
};
EBX_Loader.states.done = {
	className: "ebx_State_Done"
};

EBX_Loader.initTasks = function() {
	/* the first task (loading HTML) is always done */
	EBX_Loader.addTask(EBX_Loader_taskId_raw_data, "ebx_Loader_RawData", EBX_Loader.states.done, null, EBXUtils.returnTrue);

	EBX_Loader.addTask(EBX_Loader_taskId_save_url_for_doc_search, "ebx_Loader_SaveBaseURLForDocSearchInCookie", EBX_Loader.states.onStarting,
			EBX_LayoutManager.saveBaseURLForDocSearchInCookie, EBXUtils.returnTrue);

	EBX_Loader.addTask(EBX_Loader_taskId_save_fields_state_for_ie, "ebx_Save_Fields_State_For_IE", EBX_Loader.states.onStarting,
			EBX_Loader.SaveFieldsStateForIE, EBX_Loader.isIE);

	EBX_Loader.addTask(EBX_Loader_taskId_page_script, "ebx_Loader_PageScript", EBX_Loader.states.onStarting, EBX_Loader.loadPageScript,
			EBX_Loader.isPageScriptPresent);

	EBX_Loader.addTask(EBX_Loader_taskId_layout, "ebx_Loader_Layout", EBX_Loader.states.onStarting, EBX_LayoutManager.renderBodyLayout,
			EBX_LayoutManager.renderBodyLayoutCondition);

	EBX_Loader.addTask(EBX_Loader_taskId_layout_workspace, "ebx_Loader_Layout_Workspace", EBX_Loader.states.onStarting,
			EBX_LayoutManager.renderWorkspaceLayout, EBX_LayoutManager.renderWorkspaceLayoutCondition);

	EBX_Loader.addTask(EBX_Loader_taskId_restore_fields_state_for_ie, "ebx_Restore_Fields_State_For_IE", EBX_Loader.states.onStarting,
			EBX_Loader.RestoreFieldsStateForIE, EBX_Loader.isIE);

	EBX_Loader.addTask(EBX_Loader_taskId_ie6_compatibility, "ebx_Loader_IE6Compatibility", EBX_Loader.states.onStarting,
			EBX_LayoutManager.IE6Compatibility, EBX_LayoutManager.IE6CompatibilityCondition);

	EBX_Loader.addTask(EBX_Loader_taskId_building_trees, "ebx_Loader_building_trees", EBX_Loader.states.onStarting, EBX_AjaxTreesRegister.buildTrees,
			EBXUtils.returnTrue);

	EBX_Loader.addTask(EBX_Loader_taskId_destroy_loading_layer, "ebx_Loader_DestroyLoadingLayer", EBX_Loader.states.onStarting,
			EBX_Loader.destroyLoadingLayer, EBXUtils.returnTrue);

	EBX_Loader.addTask("IFrames", "ebx_Loader_IFrames", EBX_Loader.states.onStarting, EBX_LayoutManager.initIFrames, EBXUtils.returnTrue);

	EBX_Loader.addTask(EBX_Loader_taskId_page_script_extension, "ebx_Loader_PageScriptExtension", EBX_Loader.states.onStarting,
			EBX_Loader.loadPageScriptExtension, EBX_Loader.isPageScriptExtensionPresent);

	EBX_Loader.addTask(EBX_Loader_taskId_init_resize_workspace_listeners, "ebx_Loader_InitResizeWorkspaceListeners", EBX_Loader.states.onStarting,
			EBX_LayoutManager.initResizeWorkspaceListeners, EBXUtils.returnTrue);

	EBX_Loader.addTask("ShowMessages", "ebx_Loader_ShowMessages", EBX_Loader.states.onStarting, EBX_UserMessageManager.showMessagesAtStart,
			EBXUtils.returnTrue);

};

EBX_Loader.addTask = function(id, messageId, state, bind, condition) {
	EBX_Loader.tasks.push({
		id: id,
		messageId: messageId,
		state: state,
		bind: bind,
		condition: condition
	});
};
/*
 EBX_Loader.addTaskBeforeTaskId = function(taskId, id, messageId, state, bind, condition){
 EBX_Loader.addOTaskBeforeTaskId(taskId, {
 id: id,
 messageId: messageId,
 state: state,
 bind: bind,
 condition: condition
 });
 };
 */
EBX_Loader.addOTaskBeforeTaskId = function(taskId, oTask) {
	var index = EBX_Loader.getIndexFromId(taskId);
	EBX_Loader.addTaskAtIndex(index, oTask);
};

EBX_Loader.addTaskAfterTaskId = function(taskId, id, messageId, state, bind, condition) {
	EBX_Loader.addOTaskAfterTaskId(taskId, {
		id: id,
		messageId: messageId,
		state: state,
		bind: bind,
		condition: condition
	});
};
EBX_Loader.addOTaskAfterTaskId = function(taskId, oTask) {
	var index = EBX_Loader.getIndexFromId(taskId) + 1;
	EBX_Loader.addTaskAtIndex(index, oTask);
};

EBX_Loader.addTaskAtIndex = function(index, oTask) {
	EBX_Loader.tasks.splice(index, 0, oTask);
};

EBX_Loader.getIndexFromIdAmongTasksToExecute = function(taskId) {
	var tasksToExecute_length = EBX_Loader.tasksToExecute.length;
	for ( var i = 0; i < tasksToExecute_length; i++) {
		if (EBX_Loader.tasksToExecute[i].id === taskId) {
			return i;
		}
	}
	return -1;
};
/* Add a task while loader is running.
 * Not secured:
 * - the task may not be executed
 * - else, the condition will not be checked
 */
EBX_Loader.addDynamicallyTaskBeforeTaskId = function(taskId, id, messageId, state, bind, condition) {
	var oTask = {
		id: id,
		messageId: messageId,
		state: state,
		bind: bind,
		condition: condition
	};

	// anyway, add the task in the original list
	EBX_Loader.addOTaskBeforeTaskId(taskId, oTask);

	// if the execution has already started, add it in the running list
	if (EBX_Loader.tasksToExecute.length !== 0) {
		var index = EBX_Loader.getIndexFromIdAmongTasksToExecute(taskId);
		EBX_Loader.tasksToExecute.splice(index, 0, oTask);
	}
};
/* Add a task while loader is running.
 * Not secured:
 * - the task may not be executed
 * - else, the condition will not be checked
 */
EBX_Loader.addDynamicallyTaskAfterTaskId = function(taskId, id, messageId, state, bind, condition) {
	var oTask = {
		id: id,
		messageId: messageId,
		state: state,
		bind: bind,
		condition: condition
	};

	// anyway, add the task in the original list
	EBX_Loader.addOTaskAfterTaskId(taskId, oTask);

	// if the execution has already started, add it in the running list
	if (EBX_Loader.tasksToExecute.length !== 0) {
		var index = EBX_Loader.getIndexFromIdAmongTasksToExecute(taskId) + 1;
		if (index === 0) {
			index = EBX_Loader.tasksToExecute.length;
		}
		EBX_Loader.tasksToExecute.splice(index, 0, oTask);
	}
};
/* Add a task while loader is running.
 * Not secured:
 * - the task may not be executed
 * - else, the condition will not be checked
 *
 * The taskIdArray is browsed, and the first existing taskId is taken into account.
 */
EBX_Loader.addDynamicallyTaskAfterTaskIdArrayPriority = function(taskIdArray, id, messageId, state, bind, condition) {
	var taskIdArrayLength = taskIdArray.length;
	for ( var i = 0; i < taskIdArrayLength; i++) {
		if (EBX_Loader.getIndexFromIdAmongTasksToExecute(taskIdArray[i]) > -1) {
			EBX_Loader.addDynamicallyTaskAfterTaskId(taskIdArray[i], id, messageId, state, bind, condition);
			return;
		}
	}
};

EBX_Loader.jsCmdsToExecuteAtTheEndOfLoading = null;
EBX_Loader.executeJSCmdAtTheEndOfLoading = function(jsCmd) {
	if (EBX_Loader.jsCmdsToExecuteAtTheEndOfLoading === null) {
		EBX_Loader.jsCmdsToExecuteAtTheEndOfLoading = [];

		var lastTask = EBX_Loader.tasksToExecute[EBX_Loader.tasksToExecute.length - 1];
		EBX_Loader.addDynamicallyTaskAfterTaskId(lastTask.id, "ExecuteJSCmdAtTheEndOfLoading", "ebx_Loader_ExecuteJSCmdAtTheEndOfLoading",
				EBX_Loader.states.onStarting, EBX_Loader.executeJSCmds, EBXUtils.returnTrue);
	}

	EBX_Loader.jsCmdsToExecuteAtTheEndOfLoading.push(jsCmd);
};
EBX_Loader.executeJSCmds = function() {
	var jsCmd = EBX_Loader.jsCmdsToExecuteAtTheEndOfLoading.shift();
	while (jsCmd !== undefined) {
		window.setTimeout(jsCmd, 0);
		jsCmd = EBX_Loader.jsCmdsToExecuteAtTheEndOfLoading.shift();
	}
};

EBX_Loader.initTasks();

EBX_Loader.gotoTimeoutPage = function() {
	window.location.href = EBX_Constants.getRequestLink(ebx_timeoutEvent);
};

EBX_Loader.urlLogout = null;
EBX_Loader.actionClosePopup = null;

EBX_Loader.enterKeyListener = null;
EBX_Loader.setEnterKeyListener = function(fn) {
	EBX_Loader.enterKeyListener = fn;
};
EBX_Loader.removeEnterKeyListener = function() {
	EBX_Loader.enterKeyListener = null;
};

EBX_Loader.escapeKeyListener = null;
EBX_Loader.setEscapeKeyListener = function(fn) {
	EBX_Loader.escapeKeyListener = fn;
};
EBX_Loader.removeEscapeKeyListener = function() {
	EBX_Loader.escapeKeyListener = null;
};

// close this window (internal popup) when Escape button is pressed
try {
	if (parent.EBXUtils !== undefined) {
		EBX_Loader.setEscapeKeyListener(parent.EBXUtils.closeInternalPopup);
	}
} catch (error) {
	// nothing to do: EBX is inside an third party iFrame
}

document.onkeypress = function(event) {
	// IE case
	if (event === undefined) {
		event = window.event;
	}
	if (EBX_Loader.enterKeyListener !== null && event.keyCode === 13) {
		EBX_Loader.enterKeyListener.call();
		return false;
	}
	if (EBX_Loader.escapeKeyListener !== null && event.keyCode === 27) {
		EBX_Loader.escapeKeyListener.call();
		return false;
	}
};

EBX_Loader.isMouseDown = false;
EBX_Loader.onMouseReleasedStack = [];
EBX_Loader.onMouseReleasedOnce = function(fn, arg, scope) {
	if (EBX_Loader.isMouseDown) {
		EBX_Loader.onMouseReleasedStack.push({
			fn: fn,
			scope: scope,
			arg: arg
		});
	} else {
		fn.call(scope, arg);
	}
};
document.onmousedown = function() {
	EBX_Loader.isMouseDown = true;
};
document.onmouseup = function() {
	EBX_Loader.isMouseDown = false;

	var action = EBX_Loader.onMouseReleasedStack.shift();
	while (action !== undefined) {
		action.fn.call(action.scope, action.arg);
		action = EBX_Loader.onMouseReleasedStack.shift();
	}
};

EBX_Loader.onbeforeunload = function() {
	var formId = EBX_Form.WorkspaceFormId;

	if (EBXUtils.arrayContains(EBX_Form.formIdsDetectionOfLostModificationDisabled, formId)) {
		return;
	}

	var form = document.getElementById(formId);

	/* do not search for forms in sub-session, because the iFrame will raise the onbeforeunload itself
	 if (form === null) {
	 form = EBXUtils.getElementByIdInSubSessionIFrameRecursively(formId);
	 }
	 */

	if (form !== null) {
		if (form.ebx_isVoluntarySubmit === undefined) {
			form.ebx_isVoluntarySubmit = false;
		}

		if (form.ebx_isVoluntarySubmit === false && EBX_Form.hasBeenModified(form)) {
			form.ebx_isVoluntarySubmit = false;

			var workspaceHeader = document.getElementById("ebx_WorkspaceHeader");
			var workspaceHeaderH2 = EBXUtils.getFirstDirectChildMatchingTagName(workspaceHeader, "h2");
			var workspaceTitle = "";
			if (workspaceHeaderH2 !== null) {
				if (workspaceHeaderH2.textContent !== undefined) {
					workspaceTitle = workspaceHeaderH2.textContent;
				} else if (workspaceHeaderH2.innerText !== undefined) {
					// for IE6-7-8 and other non-compatible
					workspaceTitle = workspaceHeaderH2.innerText;
				}
			}

			if (workspaceTitle == "") {
				return EBX_LocalizedMessage.confirmLosingFormModifications;
			}

			return EBX_LocalizedMessage.confirmLosingFormModificationsTitle.replace("{0}", workspaceTitle);
		}
		form.ebx_isVoluntarySubmit = false;
	}
};

window.onbeforeunload = EBX_Loader.onbeforeunload;
