function EBX_Form() {}

EBX_Form.WorkspaceFormId = "ebx_WorkspaceContentForm";
/* Overriden by UITreeForm if needed */
EBX_Form.initWorkspaceFormTreeTabview = false;
EBX_Form.WorkspaceFormTabviewId = "ebx_WorkspaceFormTabview";
EBX_Form.WorkspaceFormTabContentCSSClass = "ebx_WorkspaceFormTabContent";

EBX_Form.inputWidth = 300; // default value redefined by global javascript constants 

EBX_Form.formIdsDetectionOfLostModificationDisabled = [];

EBX_Form.initWorkspaceFormTreeTask = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_workspace_form, EBX_Loader.states.processing);
	EBX_Form.initWorkspaceFormTree();

	EBX_Loader.changeTaskState(EBX_Loader_taskId_workspace_form, EBX_Loader.states.done);
};
EBX_Form.initWorkspaceFormTree = function() {
	if (EBX_Form.initWorkspaceFormTreeTabview === true) {
		EBX_Form.WorkspaceFormTabview = new YAHOO.widget.TabView(EBX_Form.WorkspaceFormTabviewId);

		EBX_Form.WorkspaceFormTabview.addListener("activeTabChange", EBX_Form.tabSelectedListener);
		EBX_Form.WorkspaceFormTabview.addListener("activeTabChange", EBX_Form.activeTabChangeListenerForLaunchComponentJSCmd);
		EBX_Form.isTabFormReady = true;

		YAHOO.util.Event.addListener(EBX_Form.getWorkspaceFormTabviewTabs(), "scroll", EBX_Form.handleTabviewTabsScroll);
	}

	EBX_Form.initWorkspaceFormTreeComponents();
	EBX_Form.initWorkspaceFormTreeExtensions();

	if (EBX_Form.initWorkspaceFormTreeTabview === true) {
		if (EBX_Form.WorkspaceFormTabview.get("activeIndex") === null) {
			EBX_Form.WorkspaceFormTabview.selectTab(0);
			EBX_Form.activeTabChangeListenerForLaunchComponentJSCmd({
				newValue: EBX_Form.WorkspaceFormTabview.getTab(0)
			});
		} else {
			EBX_Form.activeTabChangeListenerForLaunchComponentJSCmd({
				newValue: EBX_Form.WorkspaceFormTabview.getTab(EBX_Form.WorkspaceFormTabview.get("activeIndex"))
			});
		}

		if (EBX_Form.tabViews[EBX_Form.WorkspaceFormTabviewId] === undefined) {
			EBX_Form.tabViews[EBX_Form.WorkspaceFormTabviewId] = {};
		}

		EBX_Form.tabViews[EBX_Form.WorkspaceFormTabviewId].yuiTabView = EBX_Form.WorkspaceFormTabview;
	}

	EBX_Form.initFocusEvents(EBX_Form.WorkspaceFormId);

	YAHOO.util.Event.addListener(EBX_Form.getFormBody(), "scroll", EBX_Form.displayShadowOnScroll, null);

	EBX_Form.resizeFormBody();
};
EBX_Form.initWorkspaceFormTreeComponents = function() {
// This function must be overridden by the main form in the page (script in body)
};
EBX_Form.initWorkspaceFormTreeExtensions = function() {
// This function must be overridden by the main form in the page (script in body)
};

EBX_Form.scrollShadow = null;
EBX_Form.getScrollShadow = function() {
	if (EBX_Form.scrollShadow === null) {
		EBX_Form.scrollShadow = document.getElementById("ebx_ScrollShadow");
	}
	return EBX_Form.scrollShadow;
};

EBX_Form.displayShadowOnScroll = function() {
	if (EBX_Form.getFormBody().scrollTop > 0) {
		EBX_Form.getScrollShadow().style.display = "block";
	} else {
		EBX_Form.getScrollShadow().style.display = "none";
	}
};

EBX_Form.tabSelectedListener = function(event) {
	if (EBX_Form.isCustomLayout) {
		return;
	}
	var nodeIndex = event.newValue.get("contentEl").id.substr(EBX_Form.tabIdPrefix.length);
	EBX_Form.sendSelectTabNodeIndex(nodeIndex);
};
EBX_Form.yuiDataSourceSelectTab = null;
EBX_Form.sendSelectTabNodeIndex = function(nodeIndex) {
	if (EBX_Form.yuiDataSourceSelectTab === null) {
		EBX_Form.yuiDataSourceSelectTab = new YAHOO.util.XHRDataSource(EBX_Form.selectTabRequest);
	}
	EBX_Form.yuiDataSourceSelectTab.sendRequest(EBX_Form.selectedTabNodeIndexParameter + nodeIndex, null);
};

EBX_Form.WorkspaceFormTabviewTabsId = "ebx_WorkspaceFormTabviewTabs";
EBX_Form.tabViewScrollerId = "ebx_TabScroller";
EBX_Form.tabViewScrollLeftId = "ebx_TabScrollLeft";
EBX_Form.tabViewScrollRightId = "ebx_TabScrollRight";
EBX_Form.WorkspaceFormTabviewTabsEl = null;
EBX_Form.tabViewScrollerEl = null;
EBX_Form.tabViewScrollLeftButton = null;
EBX_Form.tabViewScrollRightButton = null;
EBX_Form.getWorkspaceFormTabviewTabs = function() {
	if (EBX_Form.WorkspaceFormTabviewTabsEl === null) {
		EBX_Form.WorkspaceFormTabviewTabsEl = document.getElementById(EBX_Form.WorkspaceFormTabviewTabsId);
	}
	return EBX_Form.WorkspaceFormTabviewTabsEl;
};
EBX_Form.getTabViewScrollLeft = function() {
	if (EBX_Form.tabViewScrollLeftButton === null) {
		EBX_Form.tabViewScrollLeftButton = document.getElementById(EBX_Form.tabViewScrollLeftId);
	}
	return EBX_Form.tabViewScrollLeftButton;
};
EBX_Form.getTabViewScrollRight = function() {
	if (EBX_Form.tabViewScrollRightButton === null) {
		EBX_Form.tabViewScrollRightButton = document.getElementById(EBX_Form.tabViewScrollRightId);
	}
	return EBX_Form.tabViewScrollRightButton;
};
EBX_Form.getTabViewScroller = function() {
	if (EBX_Form.tabViewScrollerEl === null) {
		EBX_Form.tabViewScrollerEl = document.getElementById(EBX_Form.tabViewScrollerId);
	}
	return EBX_Form.tabViewScrollerEl;
};

EBX_Form.tabViewScrollIntervalTime = 50;
// ms
EBX_Form.tabViewScrollIncrementSlow = 1;
EBX_Form.tabViewScrollIncrementNormal = 10;

EBX_Form.tabViewScrollInterval = null;

EBX_Form.tabViewScrollMouseDownCSSClass = "mousedown";

EBX_Form.tabViewScrollLeftSlow = function() {
	var ul = EBX_Form.getWorkspaceFormTabviewTabs();
	ul.scrollLeft -= EBX_Form.tabViewScrollIncrementSlow;
};
EBX_Form.tabViewScrollRightSlow = function() {
	var ul = EBX_Form.getWorkspaceFormTabviewTabs();
	ul.scrollLeft += EBX_Form.tabViewScrollIncrementSlow;
};

EBX_Form.tabViewScrollLeft = function() {
	var ul = EBX_Form.getWorkspaceFormTabviewTabs();
	ul.scrollLeft -= EBX_Form.tabViewScrollIncrementNormal;
};
EBX_Form.tabViewScrollRight = function() {
	var ul = EBX_Form.getWorkspaceFormTabviewTabs();
	ul.scrollLeft += EBX_Form.tabViewScrollIncrementNormal;
};

EBX_Form.setButtonLeftMouseDownCSS = function() {
	EBXUtils.addCSSClass(EBX_Form.getTabViewScrollLeft(), EBX_Form.tabViewScrollMouseDownCSSClass);
};
EBX_Form.setButtonRightMouseDownCSS = function() {
	EBXUtils.addCSSClass(EBX_Form.getTabViewScrollRight(), EBX_Form.tabViewScrollMouseDownCSSClass);
};
EBX_Form.removeButtonLeftMouseDownCSS = function() {
	EBXUtils.removeCSSClass(EBX_Form.getTabViewScrollLeft(), EBX_Form.tabViewScrollMouseDownCSSClass);
};
EBX_Form.removeButtonRightMouseDownCSS = function() {
	EBXUtils.removeCSSClass(EBX_Form.getTabViewScrollRight(), EBX_Form.tabViewScrollMouseDownCSSClass);
};

EBX_Form.tabViewScrollLeftMouseOver = function() {
	window.clearInterval(EBX_Form.tabViewScrollInterval);

	EBX_Form.tabViewScrollInterval = window.setInterval(EBX_Form.tabViewScrollLeftSlow, EBX_Form.tabViewScrollIntervalTime);
};
EBX_Form.tabViewScrollRightMouseOver = function() {
	window.clearInterval(EBX_Form.tabViewScrollInterval);

	EBX_Form.tabViewScrollInterval = window.setInterval(EBX_Form.tabViewScrollRightSlow, EBX_Form.tabViewScrollIntervalTime);
};

EBX_Form.tabViewScrollLeftMouseDown = function() {
	EBX_Form.setButtonLeftMouseDownCSS();

	EBX_Form.tabViewScrollLeft();

	window.clearInterval(EBX_Form.tabViewScrollInterval);

	EBX_Form.tabViewScrollInterval = window.setInterval(EBX_Form.tabViewScrollLeft, EBX_Form.tabViewScrollIntervalTime);
};
EBX_Form.tabViewScrollRightMouseDown = function() {
	EBX_Form.setButtonRightMouseDownCSS();

	EBX_Form.tabViewScrollRight();

	window.clearInterval(EBX_Form.tabViewScrollInterval);

	EBX_Form.tabViewScrollInterval = window.setInterval(EBX_Form.tabViewScrollRight, EBX_Form.tabViewScrollIntervalTime);
};

EBX_Form.tabViewScrollLeftMouseUp = function() {
	EBX_Form.removeButtonLeftMouseDownCSS();
	EBX_Form.tabViewScrollLeftMouseOver();
};
EBX_Form.tabViewScrollRightMouseUp = function() {
	EBX_Form.removeButtonRightMouseDownCSS();
	EBX_Form.tabViewScrollRightMouseOver();
};

EBX_Form.tabViewScrollLeftMouseOut = function() {
	EBX_Form.removeButtonLeftMouseDownCSS();
	window.clearInterval(EBX_Form.tabViewScrollInterval);
};
EBX_Form.tabViewScrollRightMouseOut = function() {
	EBX_Form.removeButtonRightMouseDownCSS();
	window.clearInterval(EBX_Form.tabViewScrollInterval);
};

EBX_Form.handleTabviewTabsScroll = function(event) {
	EBX_Form.refreshTabViewScrollButtons();
};
EBX_Form.refreshTabViewScrollButtons = function() {
	var ul = EBX_Form.getWorkspaceFormTabviewTabs();
	var tabLeft = EBX_Form.getTabViewScrollLeft();
	var tabRight = EBX_Form.getTabViewScrollRight();

	if (ul.scrollLeft === 0) {
		EBXUtils.addCSSClass(tabLeft, EBX_ButtonUtils.disabledButtonCSSClass);
	} else {
		EBXUtils.removeCSSClass(tabLeft, EBX_ButtonUtils.disabledButtonCSSClass);
	}

	if (ul.scrollLeft === (ul.scrollWidth - ul.clientWidth)) {
		EBXUtils.addCSSClass(tabRight, EBX_ButtonUtils.disabledButtonCSSClass);
	} else {
		EBXUtils.removeCSSClass(tabRight, EBX_ButtonUtils.disabledButtonCSSClass);
	}
};

EBX_Form.refreshTabViewScrollDiv = function() {
	var ul = EBX_Form.getWorkspaceFormTabviewTabs();
	var scroller = EBX_Form.getTabViewScroller();

	// default is none
	scroller.style.display = "";

	if (ul.scrollWidth > ul.clientWidth) {
		scroller.style.display = "block";
		EBX_Form.refreshTabViewScrollButtons();
	}
};

EBX_Form.scrollTabViewMarginAroundTab = 10;
// to view a piece of the sibling tab
EBX_Form.scrollTabViewForSelectedTab = function() {
	var ul = EBX_Form.getWorkspaceFormTabviewTabs();
	var selectedTab = EBXUtils.getFirstDirectChildMatchingCSSClass(ul, "selected");
	EBX_Form.scrollTabViewForTab(selectedTab);
};

EBX_Form.scrollTabViewForTab = function(tabEl) {
	var ul = EBX_Form.getWorkspaceFormTabviewTabs();

	var ulX = YAHOO.util.Dom.getX(ul);
	var selectedTabX = YAHOO.util.Dom.getX(tabEl);

	var cutAtLeft = selectedTabX - EBX_Form.scrollTabViewMarginAroundTab < ulX;
	var cutAtRight = selectedTabX + tabEl.offsetWidth + EBX_Form.scrollTabViewMarginAroundTab > ulX + ul.clientWidth;

	// do not scroll if the tab is entirely displayed
	if (!cutAtLeft && !cutAtRight) {
		return;
	}

	var selectedTabOffsetLeftScroll = tabEl.offsetLeft;
	if (tabEl.offsetParent != ul) {
		selectedTabOffsetLeftScroll -= ul.offsetLeft;
	}

	// 'l' left or 'c' center or 'r' right
	var align;

	// if the tab is cut at left and right at the same time (when the tab is larger than the list)
	if (cutAtLeft && cutAtRight) {
		// align left
		align = 'l';
	} else {
		if (cutAtLeft) {
			// if it is not visible at all
			if (selectedTabX + tabEl.offsetWidth < ulX) {
				// then align center
				align = 'c';
			} else {
				// align left
				align = 'l';
			}
		} else {// cut at right
			// if it is not visible at all
			if (selectedTabX > ulX + ul.clientWidth) {
				// then align center
				align = 'c';
			} else {
				// align right
				align = 'r';
			}
		}
	}

	var targetScrollLeft = 0; // just in case, to init the var
	switch (align) {
		case 'l':
			targetScrollLeft = selectedTabOffsetLeftScroll - EBX_Form.scrollTabViewMarginAroundTab;
			break;

		case 'c':
			targetScrollLeft = selectedTabOffsetLeftScroll - ul.clientWidth / 2 + tabEl.offsetWidth / 2;
			break;

		case 'r':
			targetScrollLeft = selectedTabOffsetLeftScroll - ul.clientWidth + tabEl.offsetWidth + EBX_Form.scrollTabViewMarginAroundTab;
			break;

		default:
	}

	ul.scrollLeft = targetScrollLeft;
};

EBX_Form.initFormBodyAutoHeight = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_workspace_form_bodyautoheight, EBX_Loader.states.processing);

	EBX_LayoutManager.bodyLayout.addListener("resize", EBX_Form.resizeFormBody, null, null);
	EBX_LayoutManager.isWorkspaceFormManageResizeWorkspaceListeners = true;

	// disable WorkspaceContent scrolls (for roll-over panes on form, like calendar)
	EBX_LayoutManager.WorkspaceContentEl.style.overflow = "hidden";

	EBX_Form.resizeFormBody();

	EBX_Loader.changeTaskState(EBX_Loader_taskId_workspace_form_bodyautoheight, EBX_Loader.states.done);
};

EBX_Form.WorkspaceFormBodyEl = null;
EBX_Form.getFormBody = function() {
	var workspaceFormBodyEl = EBX_Form.WorkspaceFormBodyEl;
	if (workspaceFormBodyEl === null) {
		workspaceFormBodyEl = document.getElementById("ebx_WorkspaceFormBody");
		if (workspaceFormBodyEl === null) {
			workspaceFormBodyEl = document.getElementById("ebx_TextInWorkspace");
			if (workspaceFormBodyEl === null) {
				return null;
			} else {
				EBX_Form.WorkspaceFormBodyEl = workspaceFormBodyEl;
			}
		} else {
			EBX_Form.WorkspaceFormBodyEl = workspaceFormBodyEl;
		}
	}
	return workspaceFormBodyEl;
};
EBX_Form.getFormScrollingContainer = function(elementInFormScrollingContainer) {
	var tabContent = EBXUtils.getFirstParentMatchingCSSClass(elementInFormScrollingContainer, EBX_Form.WorkspaceFormTabContentCSSClass);
	if (tabContent !== null) {
		return tabContent;
	}

	if (EBXUtils.hasParentMatchingId(elementInFormScrollingContainer, "ebx_FilterBlockList")) {
		return document.getElementById("ebx_FilterBlockList");
	}

	return EBX_Form.getFormBody();
};

EBX_Form.tabContentPaddingTop = 5;

EBX_Form.resizeFormBody = function(yuiResizeEvent) {
	var workspaceFormBodyEl = EBX_Form.getFormBody();
	if (workspaceFormBodyEl === null) {
		return;
	}

	//var workspaceFormBodyParent = workspaceFormBodyEl.parentNode;

	var takenSpace = 0;
	if (EBX_Form.WorkspaceFormBodyEl === document.getElementById("ebx_TextInWorkspace")) {
		takenSpace = 16;
		// 8 + 8 for margin top & bottom
	}

	// Mantis #5631: In the generic form, the date picker disturbs the placement of the form's bottom bar
	if (document.getElementById("ebx_WorkspaceFormFooter") !== null) {
		takenSpace += document.getElementById("ebx_WorkspaceFormFooter").offsetHeight;
	}
	/*
	 var child = workspaceFormBodyParent.firstChild;
	 if (child.className === EBX_ButtonUtils.hiddenDefaultSubmitButtonCSSClass) {
	 child = child.nextSibling;
	 }

	 do {
	 if (child.nodeType === 1 && child !== workspaceFormBodyEl) {
	 takenSpace += child.offsetHeight;
	 }
	 }
	 while ((child = child.nextSibling));
	 */
	var targetHeight = (EBX_LayoutManager.WorkspaceContentEl.clientHeight - takenSpace);
	if (targetHeight < 0) {
		targetHeight = 0;
	}
	workspaceFormBodyEl.style.height = targetHeight + "px";

	var heightForResizeListener = targetHeight;

	if (EBX_Form.initWorkspaceFormTreeTabview === true) {
		workspaceFormBodyEl.style.overflow = "hidden";
		var workspaceFormTabviewTabsEl = document.getElementById("ebx_WorkspaceFormTabviewTabs");

		var targetTabContentHeight = targetHeight - workspaceFormTabviewTabsEl.offsetHeight;

		heightForResizeListener = targetTabContentHeight - EBX_Form.tabContentPaddingTop;

		var workspaceFormTabviewContentsEl = document.getElementById("ebx_WorkspaceFormTabviewContents");

		var workspaceContentClientWidth = EBX_LayoutManager.WorkspaceContentEl.clientWidth;

		var tabContentEl = EBXUtils.firstElementChild(workspaceFormTabviewContentsEl);
		do {
			tabContentEl.style.height = targetTabContentHeight + "px";
			tabContentEl.style.width = workspaceContentClientWidth + "px";
		} while ((tabContentEl = EBXUtils.nextElementSibling(tabContentEl)) !== null);

		EBX_Form.refreshTabViewScrollDiv();
		EBX_Form.scrollTabViewForSelectedTab();
	}

	var scrollShadow = EBX_Form.getScrollShadow();
	if (scrollShadow !== null) {
		scrollShadow.style.top = workspaceFormBodyEl.offsetTop + "px";
		scrollShadow.style.width = workspaceFormBodyEl.clientWidth + "px";
	}

	var remainingWorkspaceHeight = heightForResizeListener;
	var workspaceFormHeaderEl = EBXUtils.getFirstRecursiveChildMatchingCSSClass(workspaceFormBodyEl, EBX_LayoutManager.WorkspaceFormHeaderCSSClass);
	if (workspaceFormHeaderEl !== null) {
		remainingWorkspaceHeight -= workspaceFormHeaderEl.offsetHeight;
	}

	EBX_LayoutManager.callResizeWorkspaceListeners({
		h: remainingWorkspaceHeight,
		w: EBX_LayoutManager.WorkspaceContentEl.clientWidth
	});
};

EBX_Form.placeFormFooter = function() {
	EBXLogger.log("EBX_Form.placeFormFooter() is deprecated. The placement of the form footer is automatic now.", EBXLogger.info);
};

EBX_Form.confirmMessages = [];
EBX_Form.setConfirmMessage = function(submitButtonId, message) {
	EBX_Form.confirmMessages[submitButtonId] = message;
};

EBX_Form.AskBeforeLeavingModifiedFormCSSFlag = "ebx_AskBeforeLeavingModifiedForm";
EBX_Form.ConfirmSystem = function(p_oEvent) {

	var formConcerned = p_oEvent.target;
	if (!formConcerned) {
		formConcerned = p_oEvent.srcElement;
		// IE only
	}

	if (!EBX_Form.checkCustomConditions(formConcerned)) {
		YAHOO.util.Event.preventDefault(p_oEvent);
		return false;
	}
	// checkTechnicalConditions includes the UIFormSpec.jsFnNameToCallBeforeSubmit
	if (formConcerned.checkTechnicalConditions !== undefined && !formConcerned.checkTechnicalConditions(formConcerned)) {
		YAHOO.util.Event.preventDefault(p_oEvent);
		return false;
	}

	// confirm system is called:
	// - from a submit button when a click or a keyboard validation fires on it
	// - from a field when the ENTER key is pressed on it
	// all form submit buttons are <button> (<input type="button/submit/..."> is deprecated for many internal reasons)

	var message = undefined;

	if (EBX_LayoutManager.isIE) {
		EBX_Form.initSubmitNamesForIE(formConcerned);
	}

	var defaultSubmitButton;
	var lastSubmitFocused = formConcerned.ebx_lastSubmitFocused;
	var messageIsFromDefaultButton = false;
	if (lastSubmitFocused === null || lastSubmitFocused === undefined) {
		if (formConcerned.ebx_defaultSubmitButtonId !== null) {
			defaultSubmitButton = document.getElementById(formConcerned.ebx_defaultSubmitButtonId);
			EBXUtils.addCSSClass(defaultSubmitButton, EBX_ButtonUtils.buttonPushedCSSClass);

			if (EBX_LayoutManager.isIE) {
				EBX_Form.setSubmitValue(formConcerned, defaultSubmitButton.attributes.getNamedItem("value").value, defaultSubmitButton.ebx_name);
			}

			message = EBX_Form.confirmMessages[defaultSubmitButton.id];
			messageIsFromDefaultButton = true;
		}
	} else if (lastSubmitFocused.tagName == "BUTTON") {
		message = EBX_Form.confirmMessages[lastSubmitFocused.id];

		if (EBX_LayoutManager.isIE && lastSubmitFocused.type == "submit") {
			EBX_Form.setSubmitValue(formConcerned, lastSubmitFocused.attributes.getNamedItem("value").value, lastSubmitFocused.ebx_name);
		}

	}

	// FIXME on Webkit, EBX_Form.ConfirmSystem is called twice, the message is asked twice, and the preventDefaultEvent does not work
	if (message !== undefined) {

		var confirmed = window.confirm(message);

		if (!confirmed) {
			if (messageIsFromDefaultButton) {
				defaultSubmitButton = document.getElementById(formConcerned.ebx_defaultSubmitButtonId);
				EBXUtils.removeCSSClass(defaultSubmitButton, EBX_ButtonUtils.buttonPushedCSSClass);
			}

			YAHOO.util.Event.preventDefault(p_oEvent);
			return false;
		}
	}

	// by default, considers that the submit is voluntary
	formConcerned.ebx_isVoluntarySubmit = true;

	var submitButton = null;
	if (lastSubmitFocused === null || lastSubmitFocused === undefined) {
		submitButton = document.getElementById(formConcerned.ebx_defaultSubmitButtonId);
	} else if (lastSubmitFocused.tagName == "BUTTON") {
		submitButton = lastSubmitFocused;
	}

	// see UIButtonSpecSubmit#askBeforeLeavingModifiedForm
	if (EBX_Form.hasBeenModified(formConcerned)) {
		if (submitButton !== null && EBXUtils.matchCSSClass(submitButton, EBX_Form.AskBeforeLeavingModifiedFormCSSFlag)) {
			formConcerned.ebx_isVoluntarySubmit = false;
		}
	}

	if (formConcerned.appendSerializeInActionBeforeSubmit === true) {
		var actionBuf = [];
		actionBuf.push(wbpForm.originalAction);
		actionBuf.push("?");
		actionBuf.push(EBX_Form.serialize(formConcerned));
		if (submitButton !== null) {
			var requestParameterName = submitButton.name;

			// Mantis #14593
			if (requestParameterName === "") {
				requestParameterName = wbpForm.requestParameterName;
			}

			actionBuf.push("&", requestParameterName, "=", submitButton.value);
		}
		formConcerned.action = actionBuf.join("");

		EBX_KeepSessionAliveAjax();
		window.document.body.style.cursor = "wait";
	}

	if (formConcerned.hideOnSubmitId !== undefined) {
		document.getElementById(formConcerned.hideOnSubmitId).style.display = "none";
	}
	if (formConcerned.showOnSubmitId !== undefined) {
		document.getElementById(formConcerned.showOnSubmitId).style.display = "block";
	}

	return true;
};

EBX_Form.setParentFormDiscardModifications = function(element) {
	var parentForm = EBXUtils.getFirstParentMatchingTagName(element, 'FORM');

	if (parentForm === null) {
		return;
	}

	parentForm.ebx_isVoluntarySubmit = true;
};

// <button type="submit"/>...</button> is badly supported by IE6&7, and sometimes by IE8&9 (don't know why)
// only <input type="submit"/> is supported
// see http://msdn.microsoft.com/en-us/library/ms535123 > Community Content
EBX_Form.setSubmitValue = function(form, value, name) {
	// create an hidden field containing the right values
	var hiddenFieldSubmit = document.getElementById("ebx_HiddenFieldSubmit");
	if (hiddenFieldSubmit === null) {
		hiddenFieldSubmit = document.createElement("input");
		hiddenFieldSubmit.id = "ebx_HiddenFieldSubmit";
		hiddenFieldSubmit.type = "hidden";
	}
	form.appendChild(hiddenFieldSubmit);

	hiddenFieldSubmit.name = name;
	hiddenFieldSubmit.value = value;
};

/* This function can be overridden by the form in the page (script in body) */
EBX_Form.checkCustomConditions = function(formEl) {
	return true;
};

EBX_Form.initSubmitNamesForIE = function(form) {

	if (form.ebx_initSubmitForIEDone === true) {
		return;
	}

	var formButtons = form.getElementsByTagName("BUTTON");
	var i = formButtons.length;
	while (i) {
		var button = formButtons[--i];
		if (button.type == "submit") {
			button.ebx_name = button.name;
			button.name = "";
		}
	}
	var hiddenDefaultSubmitButton = EBX_ButtonUtils.getHiddenDefaultSubmitButton(form);
	hiddenDefaultSubmitButton.ebx_name = hiddenDefaultSubmitButton.name;
	hiddenDefaultSubmitButton.name = "";

	form.ebx_initSubmitForIEDone = true;
};

EBX_Form.initFocusTaskId = "EBX_Form_InitFocus";
EBX_Form.formIdsToInitFocus = [];
/**
 * Creates a task executed at the end of treatments
 */
EBX_Form.initFocusEvents = function(formId) {
	if (EBXUtils.arrayContains(EBX_Form.formIdsToInitFocus, formId)) {
		return;
	}

	EBX_Form.formIdsToInitFocus.push(formId);

	// if EBX_Form.formIdsToInitFocus is already defined, don't create an other task
	if (EBX_Form.formIdsToInitFocus.length > 1) {
		return;
	}

	EBX_Loader.addDynamicallyTaskAfterTaskId(EBX_Loader_taskId_destroy_loading_layer, EBX_Form.initFocusTaskId, EBX_Form.initFocusTaskId,
			EBX_Loader.states.onStarting, EBX_Form.initFocusEventsAsTask, EBXUtils.returnTrue);
};

EBX_Form.WorkspaceFormFooterId = "ebx_WorkspaceFormFooter";
EBX_Form.APVElementCSSClass = "ebx_APV";
EBX_Form.initFocusEventsAsTask = function() {
	EBX_Loader.changeTaskState(EBX_Form.initFocusTaskId, EBX_Loader.states.processing);

	var j = EBX_Form.formIdsToInitFocus.length, i, form = null;

	while (j) {
		form = document.getElementById(EBX_Form.formIdsToInitFocus[--j]);
		if (!form) {
			EBX_Loader.changeTaskState(EBX_Form.initFocusTaskId, EBX_Loader.states.done);
			return;
		}

		if (!EBX_LayoutManager.isIE6or7) {
			YAHOO.util.Event.addListener(form.elements, "focus", EBX_Form.focusField);
			YAHOO.util.Event.addListener(form.elements, "blur", EBX_Form.blurField);
			if (YAHOO.env.ua.webkit !== 0) {
				// webkit does not give the focus to a button when it is clicked
				// see http://www.quirksmode.org/dom/events/blurfocus.html#t03
				var formButtons = form.getElementsByTagName("BUTTON");
				i = formButtons.length;
				while (i) {
					var button = formButtons[--i];
					if (button.type == "submit") {
						YAHOO.util.Event.addListener(button, "click", EBX_Form.focusSubmitOnClickForWebkit);
					}
				}
			}
		}

		i = form.elements.length;
		while (i) {
			var element = form.elements[--i];
			if (EBXUtils.matchCSSClass(element, EBX_Form.APVElementCSSClass)) {
				FormPresenter.addAPVElementListener(element);
			}
		}

		form.ebx_lastSubmitFocused = null;
		form.ebx_initialSerialize = EBX_Form.serialize(form);
	}

	// search for the first element to focus
	// if nothing is focused
	if (document.activeElement === document.body && form !== null) {
		var len = form.elements.length;
		var element;
		var elementToFocus = null;
		for (i = 0; i < len; i++) {
			element = form.elements[i];
			// invisible elements have width=0
			if (element.offsetWidth <= 0) {
				continue;
			}
			if (element.disabled === true) {
				continue;
			}
			if (element.tabIndex == "-1") {
				continue;
			}
			if (element.className === EBX_ButtonUtils.hiddenDefaultSubmitButtonCSSClass) {
				continue;
			}

			elementToFocus = element;
			// if the form contains no fields but just a formFooter
			//  (and so the first visible element of the form is inside the formFooter)
			// then focus the default button if any
			if (EBXUtils.hasParentMatchingId(element, EBX_Form.WorkspaceFormFooterId) === true && form.ebx_defaultSubmitButtonId !== undefined) {
				elementToFocus = document.getElementById(form.ebx_defaultSubmitButtonId);
			}

			EBX_Form.focusElementIfStillVisible(elementToFocus);

			// check if the element is focused
			if (elementToFocus !== document.activeElement) {
				continue;
			}

			break;
		}

		// disable the auto-scroll: keep the scroll top after focus (a key hit in a field will automatically scroll)
		if (elementToFocus !== null) {
			EBX_Form.getFormScrollingContainer(elementToFocus).scrollTop = 0;
		}
	}

	EBX_Loader.changeTaskState(EBX_Form.initFocusTaskId, EBX_Loader.states.done);
};
EBX_Form.focusElementIfStillVisible = function(elementToFocus) {

	// case of fieldset (focusable on IE)
	if (elementToFocus.type === undefined) {
		return;
	}

	// invisible elements have width=0
	if (elementToFocus.offsetWidth <= 0) {
		return;
	}

	// if it is hidden, the offsetWidth <= 0 may not work
	// this case occurs when the first focusable element is in an hidden form tab
	try {
		elementToFocus.focus();
	} catch (e) {

	}
};
EBX_Form.focus = function(id) {
	var element = document.getElementById(id);
	if (element !== null) {
		EBX_Form.focusElementIfStillVisible(element);
	}
};

EBX_Form.IgnoreFormCheckCSSClassName = "ebx_IgnoreFormCheck";
EBX_Form.TextareaForHTMLCSSClassName = "ebx_TextareaForHTML";

EBX_Form.serialize = function(form) {
	return EBX_Form.serialize(form, false);
};
/* from "JavaScript for Web Developpers 2nd Edition"
 * by N.C. Zakas
 * editor Wrox
 * page 457
 */
EBX_Form.serialize = function(form, ignoreVoidValues) {
	var parts = [];
	var field = null;

	for ( var i = 0, len = form.elements.length; i < len; i++) {
		field = form.elements[i];

		if (field.name === "" || field.id === "ebx_HiddenFieldSubmit" || EBXUtils.matchCSSClass(field, EBX_Form.IgnoreFormCheckCSSClassName)) {
			continue;
		}

		switch (field.type) {
			case "select-one":
			case "select-multiple":
				for ( var j = 0, optLen = field.options.length; j < optLen; j++) {
					var option = field.options[j];
					if (option.selected) {
						var optValue = "";
						if (option.hasAttribute) {
							optValue = (option.hasAttribute("value") ? option.value : option.text);
						} else {
							optValue = (option.attributes["value"].specified ? option.value : option.text);
						}
						/* if ignoreVoidValues is true and the value equals "", don't add the value */
						if (!ignoreVoidValues || field.value !== "") {
							parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
						}
					}
				}
				break;

			case undefined:
				//fieldset
			case "file":
				//file input
			case "submit":
				//submit button
			case "reset":
				//reset button
			case "button":
				//custom button
				break;

			case "radio":
				//radio button
			case "checkbox":
				//checkbox
				if (!field.checked) {
					break;
				}
				/* falls through */

			case "textarea":
				// for the case of HTML editor:
				// if the initial value parsed by the HTML editor is the same than the current value (parsed),
				// then take the initial value (it is better for detecting form modifications)
				if (EBXUtils.matchCSSClass(field, EBX_Form.TextareaForHTMLCSSClassName)) {
					// is textarea with an HTML editor
					if (EBX_Form.TextareaIdEditor[field.id] !== undefined) {
						// is the HTML editor builded
						var editor = EBX_Form.TextareaIdEditor[field.id];
						if (editor.status == "ready") {
							// is the HTML editor ready

							// If the HTML editor is in source mode,
							//  dataProcessor.toHtml does not work because it uses CKEDITOR.dom.document to resolve the HTML
							//  and CKEDITOR.dom.document is undefined (and is hard to create it correctly -- I tried for hours).
							//  It's normal, because there is no reason to enable the wysiwyg feature and then reduce memory cost.
							// So, it is impossible to convert the initial value to the CKEDITOR HTML parsed version.
							// It does not matter, because the user has enabled the source mode, and then he masters HTML.
							// So it is probabely better to NOT convert the initial value to the CKEDITOR HTML parsed version.

							// If the HTML editor is in wysiwyg mode,
							//  the user is not aware of HTML and parse differencies,
							//  so it is better to compare parsed versions,
							//  because he sees the resolved version only.

							var initialParsedHTML;
							if (editor.mode == "source") {
								// don't parse
								initialParsedHTML = field.value;
							} else {
								// parse to compare
								initialParsedHTML = editor.dataProcessor.toHtml(field.value);
							}

							var currentValue = editor.getData();

							// if HTML value has changed, then use the current parsed version of HTML value
							if (initialParsedHTML != currentValue) {
								parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(currentValue));
								break;
							}
							// else let the algo do its original job (it will uses the initial value field.value)
						}
					}
				}

			default:
				/* if ignoreVoidValues is true and the value equals "", don't add the value */
				if (!ignoreVoidValues || field.value !== "") {
					parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
				}
		}
	}
	return parts.join("&");
};

EBX_Form.hasBeenModified = function(form) {
	if (form.ebx_initialSerialize === undefined) {
		return false;
	}
	return form.ebx_initialSerialize != EBX_Form.serialize(form);
};

EBX_Form.FieldClassName = "ebx_Field";
EBX_Form.FieldFocusedClassName = "ebx_Focused";
EBX_Form.FieldAncestorFocusedClassName = "ebx_FocusedAncestor";

//initialized by UITreeForm.java
EBX_Form.trParentIds = [];

EBX_Form.focusField = function(event) {
	EBX_Form.focusOrBlurField(event, true);
};
EBX_Form.blurField = function(event) {
	EBX_Form.focusOrBlurField(event, false);
};
EBX_Form.focusOrBlurField = function(event, isFocus) {
	var formElementFocused, fieldElement, firstFoundElement, parentIds, i, len;

	formElementFocused = event.target;

	fieldElement = EBXUtils.getFirstParentMatchingCSSClass(formElementFocused, EBX_Form.FieldClassName);
	firstFoundElement = fieldElement;
	while (fieldElement !== null) {
		if (isFocus === true) {
			EBXUtils.addCSSClass(fieldElement, EBX_Form.FieldFocusedClassName);
		} else {
			EBXUtils.removeCSSClass(fieldElement, EBX_Form.FieldFocusedClassName);
		}
		fieldElement = EBXUtils.getFirstParentMatchingCSSClass(fieldElement, EBX_Form.FieldClassName);
	}

	if (firstFoundElement !== null) {
		parentIds = EBX_Form.trParentIds[firstFoundElement.id];
		if (parentIds !== undefined) {
			for (i = 0, len = parentIds.length; i < len; i++) {
				if (isFocus === true) {
					EBXUtils.addCSSClass(document.getElementById(parentIds[i]), EBX_Form.FieldAncestorFocusedClassName);
				} else {
					EBXUtils.removeCSSClass(document.getElementById(parentIds[i]), EBX_Form.FieldAncestorFocusedClassName);
				}
			}
		}
	}
};

EBX_Form.focusSubmitOnClickForWebkit = function(event) {
	var buttonEl = event.target;
	// if the submit button has an icon and if the user clicks on it,
	//  event.target will be the icon, and not the button
	if (buttonEl.tagName != "BUTTON") {
		buttonEl = EBXUtils.getFirstParentMatchingTagName(buttonEl, "BUTTON");
	}
	EBX_Form.focusSubmit(buttonEl);
};

EBX_Form.focusSubmit = function(buttonSubmitEl) {
	buttonSubmitEl.form.ebx_lastSubmitFocused = buttonSubmitEl;
};
EBX_Form.blurSubmit = function(buttonSubmitEl) {
	buttonSubmitEl.form.ebx_lastSubmitFocused = null;
};

EBX_Form.InputClassName = "ebx_Input";
EBX_Form.InputPadding = 5;

EBX_Form.OverwrittenValueClassName = "ebx_OverwrittenValue";

EBX_Form.lastTabViewTaskIdSuffix = 0;
EBX_Form.currentTabViewTaskProcessing = -1;
// Map <tabViewId, { tabIds[], yuiTabView: YUITabView}>
EBX_Form.tabViews = {};
EBX_Form.tabTitleIdPrefix = "ebx_TabTitle_";
EBX_Form.hiddenTabTitleCSSClass = "ebx_HiddenTab";
EBX_Form.initYUITabView = function(tabViewId) {
	var tabView = new YAHOO.widget.TabView(tabViewId);
	if (tabView.get("activeIndex") === null) {
		tabView.selectTab(0);
	}

	// force the redraw of the tab for Webkit (width is not elastic)
	if (YAHOO.env.ua.webkit !== 0) {
		tabView.addListener("activeTabChange", EBX_Form.refreshWidthOfYUITab);
	}

	EBX_Form.activeTabChangeListenerForLaunchComponentJSCmd({
		newValue: tabView.getTab(tabView.get("activeIndex"))
	});

	tabView.addListener("activeTabChange", EBX_Form.activeTabChangeListenerForLaunchComponentJSCmd);

	if (EBX_Form.tabViews[tabViewId] === undefined) {
		EBX_Form.tabViews[tabViewId] = {};
	}

	EBX_Form.tabViews[tabViewId].yuiTabView = tabView;
};
EBX_Form.currentYUITabParentNode = null;
EBX_Form.refreshWidthOfYUITab = function() {
	EBX_Form.currentYUITabParentNode = this._contentParent.parentNode.parentNode;

	EBX_Form.currentYUITabParentNode.style.display = "block";

	window.setTimeout(EBX_Form.restoreStyleDisplayForCurrentYUITabParentNode, 0);
};
EBX_Form.restoreStyleDisplayForCurrentYUITabParentNode = function() {
	if (EBX_Form.currentYUITabParentNode === null) {
		return;
	}

	EBX_Form.currentYUITabParentNode.style.display = "";

	EBX_Form.currentYUITabParentNode = null;
};

EBX_Form.hideTab = function(tabId) {
	var tabTitleEl = document.getElementById(EBX_Form.tabTitleIdPrefix + tabId);

	if (tabTitleEl === null) {
		EBXLogger.log("EBX_Form.hideTab(\"" + tabId + "\"): tab with id=" + tabId + " not found.", EBXLogger.error);
	}

	if (EBXUtils.matchCSSClass(tabTitleEl, "selected")) {
		// TODO CCH select next visible, or previous visible if not found
		// if all hidden: hide the whole pane
	}

	EBXUtils.addCSSClass(tabTitleEl, EBX_Form.hiddenTabTitleCSSClass);
};

EBX_Form.showTab = function(tabId) {
	var tabTitleEl = document.getElementById(EBX_Form.tabTitleIdPrefix + tabId);

	if (tabTitleEl === null) {
		EBXLogger.log("EBX_Form.showTab(\"" + tabId + "\"): tab with id=\"" + tabId + "\" not found.", EBXLogger.error);
	}

	// TODO CCH if tabTitleEl is the only displayed (if the others are hidden), select it

	EBXUtils.removeCSSClass(tabTitleEl, EBX_Form.hiddenTabTitleCSSClass);
};

// array [ object { el , jsCmd } ]
EBX_Form.elsWaitingTabDisplayToLaunchCmd = [];
EBX_Form.launchCmdWhenTabIsDisplayed = function(elementId, jsCmd) {
	var el = document.getElementById(elementId);

	if (el === null) {
		return;
	}

	var navSetEl = EBXUtils.getFirstParentMatchingCSSClass(el, "yui-navset");
	// if the element is in a tab content
	if (navSetEl !== null) {
		// if the tabView is not build yet
		if (EBX_Form.tabViews[navSetEl.id] === undefined || EBX_Form.tabViews[navSetEl.id].yuiTabView === undefined) {
			// the jsCmd must be launched when the tabView will be built
			EBX_Form.elsWaitingTabDisplayToLaunchCmd.push({
				el: el,
				jsCmd: jsCmd
			});
			return;
		}
		// the tabView is built.

		// if the element is hidden in a tab content
		if (EBX_Form.isElementInAnHiddenTabContent(el)) {
			// launch the jsCmd when the tab will be displayed
			EBX_Form.elsWaitingTabDisplayToLaunchCmd.push({
				el: el,
				jsCmd: jsCmd
			});
			return;
		}
		// the element is in a build tab and well visible: let the rest of the function lunching the jsCmd
	}

	// the element is not in a tab: launch jsCmd immediately
	// TODO CCH onContentReady instead?
	window.setTimeout(jsCmd, 0);
};

EBX_Form.createHTMLEditorWhenReady = function(textAreaId) {
	EBX_Form.launchCmdWhenTabIsDisplayed(textAreaId, "EBX_Form.createHTMLEditor(\"" + textAreaId + "\")");
};
EBX_Form.isTabFormReady = false;
EBX_Form.activeTabChangeListenerForLaunchComponentJSCmd = function(event) {
	var contentEl, i, len, objElJscmd;

	contentEl = event.newValue.get("contentEl");

	for (i = 0, len = EBX_Form.elsWaitingTabDisplayToLaunchCmd.length; i < len; i++) {
		objElJscmd = EBX_Form.elsWaitingTabDisplayToLaunchCmd[i];
		// check if element is a child of the tab content
		if (EBXUtils.isChildOf(objElJscmd.el, contentEl)) {
			// check if the element is not hidden in an other sub tabView
			if (EBX_Form.isElementInAnHiddenTabContent(objElJscmd.el) === false) {
				EBX_Form.elsWaitingTabDisplayToLaunchCmd.splice(i, 1);
				i--;
				len--;
				window.setTimeout(objElJscmd.jsCmd, 0);
			}
		}
	}
};
EBX_Form.isElementInAnHiddenTabContent = function(element) {
	var parentYUIHidden = EBXUtils.getFirstParentMatchingCSSClass(element, "yui-hidden");
	if (parentYUIHidden !== null && EBXUtils.matchCSSClass(parentYUIHidden.parentNode, "yui-content") === true
			&& EBXUtils.matchCSSClass(parentYUIHidden.parentNode.parentNode, "yui-navset") === true) {
		return true;
	}
	return false;
};

/* map id -> ckEditor or null if not init */
EBX_Form.APVHTMLEditorIdEditor = [];

/* map id -> ckEditor or undefined if not init */
EBX_Form.TextareaIdEditor = [];
EBX_Form.HTMLEditorWidth = null;
EBX_Form.HTMLEditorHeight = null;
EBX_Form.CKEDITORSizesInitialized = false;

EBX_Form.createHTMLEditor = function(textAreaId) {
	if (EBX_Form.TextareaIdEditor[textAreaId] !== undefined) {
		return;
	}

	// init CKEditor sizes once
	if (EBX_Form.CKEDITORSizesInitialized === false && EBX_Form.HTMLEditorWidth !== null && EBX_Form.HTMLEditorHeight !== null) {
		CKEDITOR.config.width = EBX_Form.HTMLEditorWidth;
		CKEDITOR.config.height = EBX_Form.HTMLEditorHeight;
		EBX_Form.CKEDITORSizesInitialized = true;
	}

	var editor = CKEDITOR.replace(textAreaId);

	EBX_Form.TextareaIdEditor[textAreaId] = editor;

	if (EBX_Form.APVHTMLEditorIdEditor[textAreaId] !== undefined) {
		EBX_Form.APVHTMLEditorIdEditor[textAreaId] = editor;
		editor.on("blur", EBX_Form.stackHTMLEditorForValidation, null, textAreaId);
	}

	// Mantis #11012: [On Chrome] User interface problem after clicking into maximize button in HTML field.
	// When CKEditor turns into the maximized mode, all its ancestors' style is set to
	// position: fixed; z-index: 9995; width: 0px; height: 0px;
	// and CSS classes are removed
	// I don't know why, it's weird, but it works, it's brutal, but effective, except for Chrome who don't refresh the UI
	if (EBX_LayoutManager.browser == "Chrome") {
		editor.on('afterCommandExec', function(event) {
			if (event.data.name == 'maximize') {
				// if CKEditor is maximized
				if (editor.commands.maximize.state === 1) {
					// move the style of the HTML tag, to force Chrome to refresh the UI
					document.body.parentNode.style.position = "static";
				}
				// for the case un-maximized, the style of element is already restored by CKEditor
			}
		});
	}

};

EBX_Form.stackHTMLEditorForValidation = function(ckEventInfo) {
	FormPresenter.stackPathForValidation(FormNodeIndex.fieldsIdPath[ckEventInfo.listenerData]);
	if (EBX_LayoutManager.browser == "Firefox" && EBX_LayoutManager.browserVersion.indexOf("3.6") === 0) {
		// FIXME find why the first blur make the caret dissapear and the controls weird on ckEditor when the user focus it
	}
};
