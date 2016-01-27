function EBX_LayoutManager() {}

EBX_LayoutManager.isIE6 = navigator.userAgent.match("MSIE 6.") !== null;
EBX_LayoutManager.isIE6or7 = EBX_LayoutManager.isIE6 || navigator.userAgent.match("MSIE 7.") !== null;
EBX_LayoutManager.isIE6or7or8 = EBX_LayoutManager.isIE6or7 || navigator.userAgent.match("MSIE 8.") !== null;
EBX_LayoutManager.isIE8 = navigator.userAgent.match("MSIE 8.") !== null;
EBX_LayoutManager.isIE = navigator.userAgent.match("MSIE ") !== null;
EBX_LayoutManager.isIPad = navigator.userAgent.match("iPad") !== null;

/* see http://stackoverflow.com/questions/5916900/detect-version-of-browser */
EBX_LayoutManager.browser = (function() {
	var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
		return 'IE';
	}
	M = M[2] ? [ M[1], M[2] ] : [ navigator.appName, navigator.appVersion, '-?' ];
	if ((tem = ua.match(/version\/([\.\d]+)/i)) != null) {
		M[2] = tem[1];
	}
	return M[0];
})();
EBX_LayoutManager.browserVersion = (function() {
	var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
		return (tem[1] || '');
	}
	M = M[2] ? [ M[1], M[2] ] : [ navigator.appName, navigator.appVersion, '-?' ];
	if ((tem = ua.match(/version\/([\.\d]+)/i)) != null) {
		M[2] = tem[1];
	}
	return M[1];
})();
EBX_LayoutManager.browserMajorVersion = (function() {
	return new Number(EBX_LayoutManager.browserVersion.split(".")[0]).valueOf();
})();

EBX_LayoutManager.doesBrowserSupportsCSSTransitions = (function() {
	switch (EBX_LayoutManager.browser) {
		case "Chrome":
			return true;

		case "Firefox":
			return EBX_LayoutManager.browserVersion >= 4;

		case "MSIE":
		case "IE":
			return EBX_LayoutManager.browserVersion >= 10;

			// not supported/tested browser, but works in theory

		case "Safari":
			return true;

		case "Opera":
			return EBX_LayoutManager.browserVersion >= 10.5;

		default:
			return false; // unknown browser, sure it was not tested
	}
})();

EBX_LayoutManager.IE6CompatibilityCondition = function() {
	return EBX_LayoutManager.isIE6;
};
EBX_LayoutManager.IE6Compatibility = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_ie6_compatibility, EBX_Loader.states.processing);

	EBX_LayoutManager.additionnalJSForIE6();

	EBX_Loader.changeTaskState(EBX_Loader_taskId_ie6_compatibility, EBX_Loader.states.done);
};

EBX_LayoutManager.removeNoScript = function() {
	var noStyleEl = document.getElementById("ebx_Noscript");
	noStyleEl.parentNode.removeChild(noStyleEl);
};
YAHOO.util.Event.onDOMReady(EBX_LayoutManager.removeNoScript);

EBX_LayoutManager.additionnalJSForIE6 = function() {
	/*
	 // CSS bug for #ebx_WorkspaceContent (does not support position:absolute + 0px on each edge)
	 if (EBX_LayoutManager.workspaceLayout) {
	 // add listener as first listener
	 var s = new YAHOO.util.Subscriber(EBX_LayoutManager.autoresizeWorkspaceContentForIE6, null, false);
	 EBX_LayoutManager.workspaceLayout.__yui_events.resize.subscribers.unshift(s);
	 //	EBX_LayoutManager.workspaceLayout.addListener("resize", EBX_LayoutManager.autoresizeWorkspaceContentForIE6);
	 EBX_LayoutManager.workspaceLayout.resize(true);
	 }
	 */
	if (EBX_LayoutManager.isNavigationPresent(window)) {
		EBX_LayoutManager.bodyLayout.addListener("resize", EBX_LayoutManager.resizeNavigationWidthForIE6);
		EBX_LayoutManager.bodyLayout.resize(true);
	}
};

/* bp stands for basis point */
EBX_LayoutManager.convertNavWidthToPx = function(valueInBP) {
	return Math.round(valueInBP * YAHOO.util.Dom.getViewportWidth() / 10000);
};
EBX_LayoutManager.convertNavWidthToBP = function(valueInPx) {
	return EBX_LayoutManager.convertNavWidthToBPWindowWidth(valueInPx, YAHOO.util.Dom.getViewportWidth());
};
EBX_LayoutManager.convertNavWidthToBPWindowWidth = function(valueInPx, windowWidth) {
	return Math.round(valueInPx * 10000 / windowWidth);
};

/*
 EBX_LayoutManager.autoresizeWorkspaceContentForIE6 = function(){
 var workspaceContent = document.getElementById(EBX_LayoutManager.workspaceUnits.content.body);

 workspaceContent.style.height = workspaceContent.parentNode.clientHeight + "px";
 workspaceContent.style.width = workspaceContent.parentNode.clientWidth + "px";
 };
 */
EBX_LayoutManager.autoresizeSelectorPanelForIE6 = function() {
	var selectorPanel = document.getElementById("ebx_SelectorPanel_c");

	selectorPanel.style.height = (document.getElementsByTagName("BODY")[0].clientHeight - selectorPanel.offsetTop - 10) + "px";
};
EBX_LayoutManager.autoresizeSelectorPanelTree = function() {
	if (EBX_LayoutManager.isIE6) {
		EBX_LayoutManager.autoresizeSelectorPanelForIE6();
	}

	var selectorPanelContent = document.getElementById("ebx_SelectorPanelContent");
	var selectorPanelTree = document.getElementById("ebx_SelectorPanelTree");
	var selectorPanelWaiting = document.getElementById("ebx_SelectorPanelWaiting");

	if (selectorPanelContent === null || selectorPanelTree === null) {
		return;
	}

	var availableHeight = selectorPanelContent.clientHeight;

	var child = EBXUtils.firstElementChild(selectorPanelContent);
	do {
		if (child !== selectorPanelTree && child !== selectorPanelWaiting) {
			availableHeight -= child.offsetHeight;
		}
	} while ((child = EBXUtils.nextElementSibling(child)) !== null);

	/* 5(paddingTop) + 5(paddingBottom) */
	selectorPanelTree.style.height = (availableHeight - 10) + "px";
};
EBX_LayoutManager.resizeNavigationWidthForIE6 = function(yuiResizeEvent) {
	var navigationContentEl = EBX_LayoutManager.NavigationContentEl;
	if (navigationContentEl === null) {
		navigationContentEl = document.getElementById("ebx_NavigationContent");
		if (navigationContentEl === null) {
			return;
		} else {
			EBX_LayoutManager.NavigationContentEl = navigationContentEl;
		}
	}

	/* 4 = 1(border-left) + 1(border-right) + 2(I don't know) */
	navigationContentEl.style.width = (yuiResizeEvent.sizes.left.w - 4) + "px";
};

EBX_LayoutManager.limboId = "ebx_Limbo";
EBX_LayoutManager.getLimbo = function() {
	var limbo = document.getElementById(EBX_LayoutManager.limboId);
	if (limbo === null) {
		limbo = document.createElement("div");
		limbo.id = EBX_LayoutManager.limboId;
		limbo.style.display = "none";

		document.getElementsByTagName("body")[0].appendChild(limbo);
	}
	return limbo;
};

EBX_LayoutManager.currentGestureResizeId = null;

EBX_LayoutManager.tableColumnResizeId = "tableColumn";
EBX_LayoutManager.navigationResizeId = "navigation";
EBX_LayoutManager.filterResizeId = "filter";

EBX_LayoutManager.getGestureResizePermission = function(gestureResizeId) {
	if (EBX_LayoutManager.currentGestureResizeId === null) {
		EBX_LayoutManager.currentGestureResizeId = gestureResizeId;
	}
	return EBX_LayoutManager.currentGestureResizeId === gestureResizeId;
};
EBX_LayoutManager.isCurrentGestureResize = function(gestureResizeId) {
	return EBX_LayoutManager.currentGestureResizeId === gestureResizeId;
};
EBX_LayoutManager.releaseCurrentGestureResize = function() {
	EBX_LayoutManager.currentGestureResizeId = null;
};

YAHOO.widget.Overlay.VIEWPORT_OFFSET = 10;

EBX_LayoutManager.bodyUnits = function() {};
EBX_LayoutManager.bodyUnits.workspace = {
	position: 'center',
	body: 'ebx_Workspace',
	gutter: 0
};
EBX_LayoutManager.bodyUnits.navigation = {
	position: 'left',
	width: 300,
	minWidth: 0,
	body: 'ebx_Navigation',
	gutter: 0,
	resize: true,
	useShim: true,
	collapseSize: 0,
	animate: false
/*,
 animate : true,
 easing : YAHOO.util.Easing.backBoth*/
};
EBX_LayoutManager.bodyUnits.header = {
	position: 'top',
	/* height is computed by the method EBX_LayoutManager.renderBodyLayout to adapt its content */
	height: 40, /* logo height */
	body: "ebx_Header",
	collapseSize: 0,
	gutter: 0,
	animate: false,
	scroll: null
};

EBX_LayoutManager.workspaceUnits = function() {};
EBX_LayoutManager.workspaceUnits.center = {
	position: 'center',
	body: 'ebx_WorkspaceContentArea',
	id: 'ebx_WorkspaceContentAreaUnit',
	scroll: true,
	gutter: 0
};
EBX_LayoutManager.workspaceUnits.filters = {
	position: 'left',
	width: 250,
	minWidth: 100,
	maxWidth: 500,
	body: 'ebx_WorkspaceFilter',
	id: 'ebx_WorkspaceFilterUnit',
	resize: true,
	gutter: '0 6px 0 0',
	collapseSize: -6,
	animate: false,
	scroll: null
};

EBX_LayoutManager.appLogoID = "ebx_AppLogo";
EBX_LayoutManager.userBlocID = "ebx_UserBloc";
EBX_LayoutManager.isCloseButtonPresent = false;
// overwrote by UIHeaderDisplay
EBX_LayoutManager.closeButtonID = "ebx_Close";
EBX_LayoutManager.renderBodyLayoutCondition = function() {
	return YAHOO.util.Dom.inDocument(EBX_LayoutManager.bodyUnits.workspace.body);
};

EBX_LayoutManager.isHeaderPresent = function(currentWindow) {
	return currentWindow.YAHOO.util.Dom.inDocument(EBX_LayoutManager.bodyUnits.header.body);
};
EBX_LayoutManager.isNavigationPresent = function(currentWindow) {
	return currentWindow.YAHOO.util.Dom.inDocument(EBX_LayoutManager.bodyUnits.navigation.body);
};

EBX_LayoutManager.renderBodyLayout = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_layout, EBX_Loader.states.processing);

	var arrayUnits = [];

	arrayUnits.push(EBX_LayoutManager.bodyUnits.workspace);

	var navigationIsHere = false;
	if (EBX_LayoutManager.isNavigationPresent(window) && !EBX_LayoutManager.isNavigationInitCollapsed) {
		arrayUnits.push(EBX_LayoutManager.bodyUnits.navigation);
		navigationIsHere = true;
	}

	if (EBX_LayoutManager.isHeaderPresent(window)) {
		if (!EBX_LayoutManager.isHeaderInitCollapsed) {
			arrayUnits.push(EBX_LayoutManager.bodyUnits.header);
		}
	}

	EBX_LayoutManager.bodyLayout = new YAHOO.widget.Layout({
		units: arrayUnits
	});

	EBX_LayoutManager.bodyLayout.addListener("resize", EBX_LayoutManager.resizeWorkspace);

	if (navigationIsHere) {
		EBX_LayoutManager.bodyLayout.addListener("resize", EBX_LayoutManager.resizeNavigation);
	}

	EBX_LayoutManager.bodyLayout.addListener("render", EBX_LayoutManager.onRenderBodyLayout);
	EBX_LayoutManager.bodyLayout.addListener("beforeResize", EBX_LayoutManager.onBeforeResizeBodyLayout);
	EBX_LayoutManager.bodyLayout.render();

	if (navigationIsHere) {
		var navigationResizeKnob = null;
		try {
			navigationResizeKnob = EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position)._resize._handles.r;
		} catch (e) {}
		if (navigationResizeKnob !== null) {
			YAHOO.util.Event.addListener(navigationResizeKnob, "dblclick", EBX_LayoutManager.resetNavigationPane);
		}
	}
};
EBX_LayoutManager.onRenderBodyLayout = function() {

	EBX_Loader.changeTaskState(EBX_Loader_taskId_layout, EBX_Loader.states.done);

	EBX_LayoutManager.delayResizeBodyLayout = !EBX_LayoutManager.isEmbedded();

	EBX_LayoutManager.applyNavigationResizeController();
};
EBX_LayoutManager.previousResizeBodyLayoutTimeout = null;
EBX_LayoutManager.delayResizeBodyLayout = false;
// in ms
EBX_LayoutManager.bodyLayoutResizeDelay = 200;
EBX_LayoutManager.onBeforeResizeBodyLayout = function() {
	if (!EBX_LayoutManager.delayResizeBodyLayout) {
		return true;
	}

	if (EBX_LayoutManager.previousResizeBodyLayoutTimeout !== null) {
		window.clearTimeout(EBX_LayoutManager.previousResizeBodyLayoutTimeout);
	}
	EBX_LayoutManager.previousResizeBodyLayoutTimeout = window
			.setTimeout(EBX_LayoutManager.resizeBodyLayout, EBX_LayoutManager.bodyLayoutResizeDelay);
	return false;
};
EBX_LayoutManager.resizeBodyLayout = function() {
	EBX_LayoutManager.delayResizeBodyLayout = false;
	EBX_LayoutManager.bodyLayout.resize();
	EBX_LayoutManager.delayResizeBodyLayout = true;
};

EBX_LayoutManager.navigationPaneMaxLimit = 100;
EBX_LayoutManager.WorkspaceContentEl = null;
EBX_LayoutManager.WorkspaceContentAsLayoutCSSClass = "ebx_WorkspaceContentAsLayout";
EBX_LayoutManager.WorkspaceFormHeaderCSSClass = "ebx_WorkspaceFormHeader";
EBX_LayoutManager.resizeWorkspace = function(yuiResizeEvent) {
	var workspaceContentEl = EBX_LayoutManager.WorkspaceContentEl;
	if (workspaceContentEl === null) {
		workspaceContentEl = document.getElementById("ebx_WorkspaceContent");
		if (workspaceContentEl === null) {
			return;
		} else {
			EBX_LayoutManager.WorkspaceContentEl = workspaceContentEl;
		}
	}

	var workspaceContentParent = workspaceContentEl.parentNode;

	var takenSpace = 0;

	var child = workspaceContentParent.firstChild;
	do {
		if (child.nodeType === 1 && child !== workspaceContentEl && child.id !== EBX_LayoutManager.navigationExpandKnobId) {
			takenSpace += child.offsetHeight;
		}
	} while ((child = child.nextSibling));

	var workspaceContentTargetHeight = yuiResizeEvent.sizes.center.h - takenSpace;
	if (workspaceContentTargetHeight >= 0) {
		workspaceContentEl.style.height = workspaceContentTargetHeight + "px";
	}

	if (EBX_LayoutManager.isWorkspaceFormManageResizeWorkspaceListeners === false) {
		var remainingWorkspaceHeight = workspaceContentTargetHeight;
		var workspaceFormHeaderEl = EBXUtils
				.getFirstRecursiveChildMatchingCSSClass(workspaceContentEl, EBX_LayoutManager.WorkspaceFormHeaderCSSClass);
		if (workspaceFormHeaderEl !== null) {
			remainingWorkspaceHeight -= workspaceFormHeaderEl.offsetHeight;
		}
		EBX_LayoutManager.callResizeWorkspaceListeners({
			h: remainingWorkspaceHeight,
			w: yuiResizeEvent.sizes.center.w
		});
	}

	// case of DMA
	if (EBX_LayoutManager.bodyUnits.navigation.maxWidth === undefined && YAHOO.util.Dom.inDocument(EBX_LayoutManager.bodyUnits.navigation.body)) {
		var navigationUnit = EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position);
		if (navigationUnit !== false) {
			navigationUnit.set('maxWidth', YAHOO.util.Dom.getViewportWidth() - EBX_LayoutManager.navigationPaneMaxLimit);
		}
	}
};

EBX_LayoutManager.isWorkspaceFormManageResizeWorkspaceListeners = false;
EBX_LayoutManager.resizeWorkspaceListeners = [];

EBX_LayoutManager.initResizeWorkspaceListeners = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_init_resize_workspace_listeners, EBX_Loader.states.processing);

	if (EBX_LayoutManager.resizeWorkspaceListeners.length !== 0) {
		EBX_LayoutManager.bodyLayout.resize();
	}

	EBX_Loader.changeTaskState(EBX_Loader_taskId_init_resize_workspace_listeners, EBX_Loader.states.done);
};

EBX_LayoutManager.lastWorkspaceSizeComputed = null;
EBX_LayoutManager.callResizeWorkspaceListeners = function(size) {
	var i, len, fnName, fn;
	EBX_LayoutManager.lastWorkspaceSizeComputed = size;

	for (i = 0, len = EBX_LayoutManager.resizeWorkspaceListeners.length; i < len; i++) {
		fnName = EBX_LayoutManager.resizeWorkspaceListeners[i];
		try {
			fn = eval(fnName);
			fn.call(window, size);
		} catch (error) {
			EBX_UserMessageManager.addMessage(
					"ResizeWorkspaceListener<br/>Error on calling <i>" + fnName + "</i> :<br/><b>" + error.message + "</b>",
					EBX_UserMessageManager.ERROR);
			return false;
		}
	}
};

EBX_LayoutManager.renderWorkspaceLayoutCondition = function() {
	return YAHOO.util.Dom.inDocument(EBX_LayoutManager.workspaceUnits.center.body)
			&& EBXUtils.matchCSSClass(document.getElementById(EBX_LayoutManager.workspaceUnits.center.body), "ebx_renderWorkspaceLayout");
};
EBX_LayoutManager.renderWorkspaceLayout = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_layout_workspace, EBX_Loader.states.processing);

	var arrayUnits = [ EBX_LayoutManager.workspaceUnits.center ];

	if (YAHOO.util.Dom.inDocument(EBX_LayoutManager.workspaceUnits.filters.body)) {
		arrayUnits.push(EBX_LayoutManager.workspaceUnits.filters);
	}

	EBX_LayoutManager.workspaceLayout = new YAHOO.widget.Layout("ebx_WorkspaceContent", {
		parent: EBX_LayoutManager.bodyLayout,
		units: arrayUnits
	});

	EBX_LayoutManager.workspaceLayout.addListener("render", EBX_LayoutManager.onRenderWorkspaceLayout);

	EBX_LayoutManager.workspaceLayout.render();
};
EBX_LayoutManager.onRenderWorkspaceLayout = function() {

	if (YAHOO.util.Dom.inDocument(EBX_LayoutManager.workspaceUnits.filters.body)) {
		EBX_LayoutManager.workspaceLayout.addListener("resize", EBX_LayoutManager.resizeFilterBlockList);
		EBX_LayoutManager.workspaceLayout.addListener("resize", EBX_LayoutManager.saveFilterSize);
		if (EBX_LayoutManager.isIPad === true) {
			EBX_LayoutManager.applyFilterResizeControllerForIpad();
		}
	}

	EBX_Loader.changeTaskState(EBX_Loader_taskId_layout_workspace, EBX_Loader.states.done);

};

EBX_LayoutManager.FilterBlockListEl = null;
EBX_LayoutManager.filterPaneTitleCssClass = "ebx_FilterPaneTitle";
EBX_LayoutManager.resizeFilterBlockList = function(yuiResizeEvent) {
	var filterBlockListEl = EBX_LayoutManager.FilterBlockListEl;
	if (filterBlockListEl === null) {
		filterBlockListEl = document.getElementById("ebx_FilterBlockList");
		if (filterBlockListEl === null) {
			return;
		} else {
			EBX_LayoutManager.FilterBlockListEl = filterBlockListEl;
		}
	}

	var workspaceFilter = filterBlockListEl.parentNode;
	var filterPaneTitleElement = EBXUtils.getFirstDirectChildMatchingCSSClass(workspaceFilter, EBX_LayoutManager.filterPaneTitleCssClass);

	var takenSpace = 0;

	if (filterPaneTitleElement !== null) {
		takenSpace = filterPaneTitleElement.offsetHeight - 1;
	}

	/* 1(border-top) */
	filterBlockListEl.style.height = (yuiResizeEvent.sizes.left.h - takenSpace - 1) + "px";
};
EBX_LayoutManager.applyFilterResizeControllerForIpad = function() {
	var filterUnit = EBX_LayoutManager.workspaceLayout.getUnitByPosition(EBX_LayoutManager.workspaceUnits.filters.position);
	// if filter unit has not been found
	if (filterUnit === false) {
		return;
	}
	if (EBX_LayoutManager.isIPad === false) {
		return;
	}

	YAHOO.util.Event.addListener(filterUnit.body, "gesturestart", EBX_LayoutManager.gestureStartResizeFilterListener, filterUnit, null);
	YAHOO.util.Event.addListener(filterUnit.body, "gesturechange", EBX_LayoutManager.gestureChangeResizeFilterListener, filterUnit, null);
	YAHOO.util.Event.addListener(filterUnit.body, "gestureend", EBX_LayoutManager.gestureEndResizeFilterListener, filterUnit, null);
};
EBX_LayoutManager.gestureStartResizeFilterListener = function(event, filterUnit) {
	if (!EBX_LayoutManager.getGestureResizePermission(EBX_LayoutManager.filterResizeId)) {
		return;
	}

	event.preventDefault();

	var filterResize = filterUnit._resize;
	var proxy = filterResize._proxy;

	filterResize.ebx_originalWidth = filterUnit.get('width');

	// init and display proxy
	proxy.style.zIndex = 1000;
	proxy.style.height = filterUnit.get('height') + "px";
	proxy.style.top = filterUnit.get('top') + "px";
	proxy.style.left = filterUnit.get('left') + "px";
	proxy.style.width = (filterResize.ebx_originalWidth * event.scale) + "px";
	proxy.style.visibility = "visible";
};
EBX_LayoutManager.gestureChangeResizeFilterListener = function(event, filterUnit) {
	if (!EBX_LayoutManager.isCurrentGestureResize(EBX_LayoutManager.filterResizeId)) {
		return;
	}

	event.preventDefault();

	var filterResize = filterUnit._resize;
	var proxy = filterResize._proxy;

	var width = (filterResize.ebx_originalWidth * event.scale);

	filterResize.ebx_mustBeCollapsed = false;

	if (width > EBX_LayoutManager.workspaceUnits.filters.maxWidth) {
		/* maxWidth */
		width = EBX_LayoutManager.workspaceUnits.filters.maxWidth;
	} else if (width < EBX_LayoutManager.workspaceUnits.filters.minWidth) {
		/* minWidth */
		width = EBX_LayoutManager.workspaceUnits.filters.minWidth;
	}

	proxy.style.width = width + "px";
};
EBX_LayoutManager.gestureEndResizeFilterListener = function(event, filterUnit) {
	if (!EBX_LayoutManager.isCurrentGestureResize(EBX_LayoutManager.filterResizeId)) {
		return;
	}

	event.preventDefault();

	var filterResize = filterUnit._resize;
	var proxy = filterResize._proxy;

	var width = (filterResize.ebx_originalWidth * event.scale);

	if (width > EBX_LayoutManager.workspaceUnits.filters.maxWidth) {
		/* maxWidth */
		width = EBX_LayoutManager.workspaceUnits.filters.maxWidth;
	} else if (width < EBX_LayoutManager.workspaceUnits.filters.minWidth) {
		/* minWidth */
		width = EBX_LayoutManager.workspaceUnits.filters.minWidth;
	}

	filterUnit.set('width', width);

	// hide proxy
	proxy.style.visibility = "hidden";
	proxy.style.zIndex = -1;

	EBX_LayoutManager.releaseCurrentGestureResize();
};

EBX_LayoutManager.navigationPanePerspective = false;
EBX_LayoutManager.navigationPaneMinWidth = 100;
EBX_LayoutManager.navigationPaneCollapseLimit = 70;
EBX_LayoutManager.navigationPaneReducedWidth = 40;
EBX_LayoutManager.navigationPaneReducedCollapseLimit = 20;
EBX_LayoutManager.navigationProxyCollapsedCSSClass = "ebx_NavigationProxyCollapsed";
EBX_LayoutManager.applyNavigationResizeController = function() {
	var navUnit = EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position);
	// if navigation unit has not been found
	if (navUnit === false) {
		return;
	}

	if (navUnit.ebx_ResizeControllerInstalled === true) {
		return;
	}

	if (EBX_LayoutManager.isIPad === true) {
		YAHOO.util.Event.addListener(navUnit.body, "gesturestart", EBX_LayoutManager.gestureStartResizeNavigationListener, navUnit, null);
		YAHOO.util.Event.addListener(navUnit.body, "gesturechange", EBX_LayoutManager.gestureChangeResizeNavigationListener, navUnit, null);
		YAHOO.util.Event.addListener(navUnit.body, "gestureend", EBX_LayoutManager.gestureEndResizeNavigationListener, navUnit, null);
	} else {
		var navResize = navUnit._resize;
		var proxy = navResize._proxy;

		// add small icon element in proxy handle
		var handle = EBXUtils.getFirstDirectChildMatchingCSSClass(proxy, "yui-layout-handle-r");
		var smallIcon = document.createElement("div");
		smallIcon.className = "ebx_SmallIcon";
		handle.appendChild(smallIcon);

		navResize.on("startResize", function(args) {

			navResize.ebx_originalWidth = navUnit.get('width');

		}, null, true);

		navResize.on("proxyResize", function(event) {
			navResize.ebx_mustBeCollapsed = false;
			navResize.ebx_setToMin = false;
			navResize.ebx_setToReduced = false;
			var panelWidth = event.width;

			if (EBX_LayoutManager.navigationPanePerspective === true) {
				if (panelWidth < EBX_LayoutManager.navigationPaneReducedCollapseLimit) {
					/* limit for collapsing, with an 'elastic' impression */
					panelWidth = EBX_LayoutManager.navigationPaneMinWidth;
					navResize.ebx_mustBeCollapsed = true;
				} else if (panelWidth < EBX_LayoutManager.navigationPaneCollapseLimit) {
					/* limit for collapsing, with an 'elastic' impression */
					panelWidth = EBX_LayoutManager.navigationPaneReducedWidth;
					navResize.ebx_setToReduced = true;
				} else if (panelWidth < EBX_LayoutManager.navigationPaneMinWidth) {
					/* artificial minWidth */
					panelWidth = EBX_LayoutManager.navigationPaneMinWidth;
					navResize.ebx_setToMin = true;
				}
			} else {
				if (panelWidth < EBX_LayoutManager.navigationPaneCollapseLimit) {
					/* limit for collapsing, with an 'elastic' impression */
					panelWidth = EBX_LayoutManager.navigationPaneMinWidth;
					navResize.ebx_mustBeCollapsed = true;
				} else if (panelWidth < EBX_LayoutManager.navigationPaneMinWidth) {
					/* artificial minWidth */
					panelWidth = EBX_LayoutManager.navigationPaneMinWidth;
					navResize.ebx_setToMin = true;
				}
			}

			if (navResize.ebx_mustBeCollapsed === true) {
				EBXUtils.addCSSClass(proxy, EBX_LayoutManager.navigationProxyCollapsedCSSClass);
			} else if (EBXUtils.matchCSSClass(proxy, EBX_LayoutManager.navigationProxyCollapsedCSSClass)) {
				EBXUtils.removeCSSClass(proxy, EBX_LayoutManager.navigationProxyCollapsedCSSClass);
			}

			proxy.style.width = panelWidth + "px";
		}, null, true);

		navResize.on("endResize", function(args) {
			if (navResize.ebx_mustBeCollapsed === true) {
				navUnit.set('width', navResize.ebx_originalWidth);
				EBX_LayoutManager.collapseNavigationPane();
			} else if (navResize.ebx_setToReduced === true) {
				navUnit.set('width', EBX_LayoutManager.navigationPaneReducedWidth);
			} else if (navResize.ebx_setToMin === true) {
				navUnit.set('width', EBX_LayoutManager.navigationPaneMinWidth);
			}
		}, null, true);
	}

	if (EBX_LayoutManager.navigationPanePerspective === true) {
		EBX_Perspective.initScrollController();
	}

	navUnit.ebx_ResizeControllerInstalled = true;
};
EBX_LayoutManager.gestureStartResizeNavigationListener = function(event, navUnit) {
	if (!EBX_LayoutManager.getGestureResizePermission(EBX_LayoutManager.navigationResizeId)) {
		return;
	}

	event.preventDefault();

	var navResize = navUnit._resize;
	var proxy = navResize._proxy;

	navResize.ebx_originalWidth = navUnit.get('width');
	navResize.ebx_maxWidth = YAHOO.util.Dom.getViewportWidth() - EBX_LayoutManager.navigationPaneMaxLimit;

	// init and display proxy
	proxy.style.zIndex = 1000;
	proxy.style.height = navUnit.get('height') + "px";
	proxy.style.top = navUnit.get('top') + "px";
	proxy.style.left = navUnit.get('left') + "px";
	proxy.style.width = (navResize.ebx_originalWidth * event.scale) + "px";
	proxy.style.visibility = "visible";
};
EBX_LayoutManager.gestureChangeResizeNavigationListener = function(event, navUnit) {
	if (!EBX_LayoutManager.isCurrentGestureResize(EBX_LayoutManager.navigationResizeId)) {
		return;
	}

	event.preventDefault();

	var navResize = navUnit._resize;
	var proxy = navResize._proxy;

	var width = (navResize.ebx_originalWidth * event.scale);

	navResize.ebx_mustBeCollapsed = false;

	if (width > navResize.ebx_maxWidth) {
		/* maxWidth */
		width = navResize.ebx_maxWidth;
	} else if (width < EBX_LayoutManager.navigationPaneCollapseLimit) {
		/* limit for collapsing, with an 'elastic' impression */
		width = EBX_LayoutManager.navigationPaneMinWidth;
		navResize.ebx_mustBeCollapsed = true;
	} else if (width < EBX_LayoutManager.navigationPaneMinWidth) {
		/* minWidth */
		width = EBX_LayoutManager.navigationPaneMinWidth;
	}

	if (navResize.ebx_mustBeCollapsed === true) {
		EBXUtils.addCSSClass(proxy, EBX_LayoutManager.navigationProxyCollapsedCSSClass);
	} else if (EBXUtils.matchCSSClass(proxy, EBX_LayoutManager.navigationProxyCollapsedCSSClass)) {
		EBXUtils.removeCSSClass(proxy, EBX_LayoutManager.navigationProxyCollapsedCSSClass);
	}

	proxy.style.width = width + "px";
};
EBX_LayoutManager.gestureEndResizeNavigationListener = function(event, navUnit) {
	if (!EBX_LayoutManager.isCurrentGestureResize(EBX_LayoutManager.navigationResizeId)) {
		return;
	}

	event.preventDefault();

	var navResize = navUnit._resize;
	var proxy = navResize._proxy;

	var width = (navResize.ebx_originalWidth * event.scale);

	if (width > navResize.ebx_maxWidth) {
		/* maxWidth */
		width = navResize.ebx_maxWidth;
	} else if (width < EBX_LayoutManager.navigationPaneCollapseLimit) {
		/* limit for collapsing, with an 'elastic' impression */
		width = EBX_LayoutManager.navigationPaneMinWidth;
		navResize.ebx_mustBeCollapsed = true;
	} else if (width < EBX_LayoutManager.navigationPaneMinWidth) {
		/* minWidth */
		width = EBX_LayoutManager.navigationPaneMinWidth;
	}

	if (navResize.ebx_mustBeCollapsed === true) {
		navUnit.set('width', navResize.ebx_originalWidth);
		EBX_LayoutManager.collapseNavigationPane();
	} else {
		navUnit.set('width', width);
	}

	// hide proxy
	proxy.style.visibility = "hidden";
	proxy.style.zIndex = -1;

	EBX_LayoutManager.releaseCurrentGestureResize();
};

EBX_LayoutManager.expandNavigationPane = function() {
	if (EBX_LayoutManager.isNavigationPresent(window)) {
		if (EBX_LayoutManager.isNavigationInitCollapsed) {
			EBX_LayoutManager.bodyLayout.addListener("resize", EBX_LayoutManager.resizeNavigation);
			EBX_LayoutManager.bodyLayout.addUnit(EBX_LayoutManager.bodyUnits.navigation);
			var navigationResizeKnob = null;
			try {
				navigationResizeKnob = EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position)._resize._handles.r;
			} catch (e) {}
			if (navigationResizeKnob !== null) {
				YAHOO.util.Event.addListener(navigationResizeKnob, "dblclick", EBX_LayoutManager.resetNavigationPane);
			}
			EBX_LayoutManager.applyNavigationResizeController();
			EBX_LayoutManager.isNavigationInitCollapsed = false;
		} else {
			EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position).expand();
		}
		EBX_LayoutManager.showFloatingNavigationHeaderTitles();
		EBX_LayoutManager.hideNavigationExpandKnob();
		EBX_LayoutManager.sendLayoutMode();
	}
};
EBX_LayoutManager.collapseNavigationPane = function() {
	if (EBX_LayoutManager.isNavigationPresent(window) && !EBX_LayoutManager.isNavigationInitCollapsed) {
		EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position).collapse();
		EBX_LayoutManager.hideFloatingNavigationHeaderTitles();
		EBX_LayoutManager.showNavigationExpandKnob();
		EBX_LayoutManager.sendLayoutMode();
	}
};

EBX_LayoutManager.navigationExpandKnobId = "ebx_NavigationExpandKnob";
EBX_LayoutManager.navigationExpandKnobDisplayedCSSClass = "ebx_NavigationExpandKnobDisplayed";
EBX_LayoutManager.navigationExpandKnob = null;
EBX_LayoutManager.getNavigationExpandKnob = function() {
	if (EBX_LayoutManager.navigationExpandKnob === null) {
		EBX_LayoutManager.navigationExpandKnob = document.getElementById(EBX_LayoutManager.navigationExpandKnobId);
	}
	return EBX_LayoutManager.navigationExpandKnob;
};
EBX_LayoutManager.showNavigationExpandKnob = function() {
	var navigationExpandKnob = EBX_LayoutManager.getNavigationExpandKnob();
	if (navigationExpandKnob === null) {
		return;
	}
	EBXUtils.addCSSClass(navigationExpandKnob, EBX_LayoutManager.navigationExpandKnobDisplayedCSSClass);
};
EBX_LayoutManager.hideNavigationExpandKnob = function() {
	var navigationExpandKnob = EBX_LayoutManager.getNavigationExpandKnob();
	if (navigationExpandKnob === null) {
		return;
	}
	EBXUtils.removeCSSClass(navigationExpandKnob, EBX_LayoutManager.navigationExpandKnobDisplayedCSSClass);
};

EBX_LayoutManager.isNavigationPaneDisplayed = function() {
	var navigationUnit = EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position);
	// not present
	if (navigationUnit === false) {
		return false;
	}
	return navigationUnit.get("width") !== 0;
};

EBX_LayoutManager.resetNavigationPane = function(yuiEvent) {
	var navUnit = EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position);
	navUnit.set('width', EBX_LayoutManager.bodyUnits.navigation.defaultWidth);
};

EBX_LayoutManager.NavigationContentEl = null;
EBX_LayoutManager.resizeNavigation = function(yuiResizeEvent) {

	EBX_LayoutManager.controlAndSaveNavigationSize();

	var navigationContentEl = EBX_LayoutManager.NavigationContentEl;
	if (navigationContentEl === null) {
		navigationContentEl = document.getElementById("ebx_NavigationContent");
		if (navigationContentEl === null) {
			return;
		} else {
			EBX_LayoutManager.NavigationContentEl = navigationContentEl;
		}
	}

	var navigationContentParent = navigationContentEl.parentNode;

	var takenSpace = 0;

	var child = navigationContentParent.firstChild;
	do {
		if (child.nodeType === 1 && child !== navigationContentEl) {
			takenSpace += child.offsetHeight;
		}
	} while ((child = child.nextSibling));

	var targetNavigationHeight = (yuiResizeEvent.sizes.left.h - takenSpace);

	navigationContentEl.style.height = targetNavigationHeight + "px";

	if (EBX_LayoutManager.navigationPanePerspective === true) {
		navigationContentEl.style.width = yuiResizeEvent.sizes.left.w + EBXUtils.getVScrollWidth() + "px";
	}

	EBX_LayoutManager.refreshFloatingNavigationHeaderTitlesContexts();
};

EBX_LayoutManager.headerExpandKnobId = "ebx_HeaderExpandKnob";
EBX_LayoutManager.headerExpandKnobDisplayedCSSClass = "ebx_HeaderExpandKnobDisplayed";
EBX_LayoutManager.headerExpandKnob = null;
EBX_LayoutManager.getHeaderExpandKnob = function() {
	if (EBX_LayoutManager.headerExpandKnob === null) {
		EBX_LayoutManager.headerExpandKnob = document.getElementById(EBX_LayoutManager.headerExpandKnobId);
	}
	return EBX_LayoutManager.headerExpandKnob;
};
EBX_LayoutManager.showHeaderExpandKnob = function() {
	var headerExpandKnob = EBX_LayoutManager.getHeaderExpandKnob();
	if (headerExpandKnob === null) {
		return;
	}
	EBXUtils.addCSSClass(headerExpandKnob, EBX_LayoutManager.headerExpandKnobDisplayedCSSClass);
};
EBX_LayoutManager.hideHeaderExpandKnob = function() {
	var headerExpandKnob = EBX_LayoutManager.getHeaderExpandKnob();
	if (headerExpandKnob === null) {
		return;
	}
	EBXUtils.removeCSSClass(headerExpandKnob, EBX_LayoutManager.headerExpandKnobDisplayedCSSClass);
};

EBX_LayoutManager.expandHeaderPane = function() {
	if (EBX_LayoutManager.isHeaderPresent(window)) {
		if (EBX_LayoutManager.isHeaderInitCollapsed) {
			EBX_LayoutManager.bodyLayout.addUnit(EBX_LayoutManager.bodyUnits.header);
			EBX_LayoutManager.isHeaderInitCollapsed = false;
		} else {
			EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.header.position).expand();
		}
		EBX_LayoutManager.hideHeaderExpandKnob();
		EBX_LayoutManager.sendLayoutMode();
	}
};
EBX_LayoutManager.collapseHeaderPane = function() {
	if (EBX_LayoutManager.isHeaderPresent(window) && !EBX_LayoutManager.isHeaderInitCollapsed) {
		EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.header.position).collapse();
		EBX_LayoutManager.showHeaderExpandKnob();
		EBX_LayoutManager.sendLayoutMode();
	}
};

EBX_LayoutManager.isHeaderPaneDisplayed = function() {
	var headerUnit = EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.header.position);
	// not present
	if (headerUnit === false) {
		return false;
	}
	return headerUnit.get("height") !== 0;
};

/**
 * Fill with EBX_LayoutManager.iFramesToInit.push( an object with attributes
 * iframeID and iframeURL );
 */
EBX_LayoutManager.iFramesToInit = [];
EBX_LayoutManager.initIFrames = function() {
	EBX_Loader.changeTaskState("IFrames", EBX_Loader.states.processing);

	for ( var i = 0; i < EBX_LayoutManager.iFramesToInit.length; i++) {
		var frameObj = EBX_LayoutManager.iFramesToInit[i];
		var urlToSet = frameObj.iframeURL;

		// if the url begins with http or https
		if (urlToSet.substr(0, 4) == "http") {
			//			urlToSet = urlToSet;
		} else if (urlToSet.substr(0, 1) == "/") {
			urlToSet = location.protocol + "//" + location.host + urlToSet;
		} else {
			// others.. ("./", "../", autre) => TODO CCH
			//			urlToSet = urlToSet;
		}

		document.getElementById(frameObj.iframeID).src = urlToSet;
	}

	EBX_Loader.changeTaskState("IFrames", EBX_Loader.states.done);
};

/* XXX CCH layout selector disabled, see UIWorkspaceDisplay
 EBX_LayoutManager.setLayoutMode = function(layoutModeFlag) {
 var ebxTopWindow = EBX_LayoutManager.getFirstParentSelectableLayoutWindowLZ();

 if (layoutModeFlag.indexOf("H") > -1) {
 ebxTopWindow.EBX_LayoutManager.expandHeaderPane();
 } else {
 ebxTopWindow.EBX_LayoutManager.collapseHeaderPane();
 }

 if (layoutModeFlag.indexOf("N") > -1) {
 ebxTopWindow.EBX_LayoutManager.expandNavigationPane();
 } else {
 ebxTopWindow.EBX_LayoutManager.collapseNavigationPane();
 }

 EBX_LayoutManager.sendLayoutMode(layoutModeFlag);
 };
 */

EBX_LayoutManager.saveScreenLayoutYUIDataSource = null;
EBX_LayoutManager.sendLayoutMode = function() {
	if (EBX_LayoutManager.saveScreenLayoutYUIDataSource === null) {
		EBX_LayoutManager.saveScreenLayoutYUIDataSource = new YAHOO.util.XHRDataSource(EBX_LayoutManager.screenLayoutRequest);
	}

	var layoutModeFlag = "";

	if (EBX_LayoutManager.isHeaderPaneDisplayed()) {
		layoutModeFlag += "H";
	}

	if (EBX_LayoutManager.isNavigationPaneDisplayed()) {
		layoutModeFlag += "N";
	}

	layoutModeFlag += "W";

	EBX_LayoutManager.saveScreenLayoutYUIDataSource.sendRequest(EBX_LayoutManager.layoutModeParameter + layoutModeFlag, null);
};

EBX_LayoutManager.saveNavigationSizeYUIDataSourceLZ = null;
EBX_LayoutManager.previousNavigationWidth = null;
EBX_LayoutManager.previousWindowWidth = YAHOO.util.Dom.getViewportWidth();
EBX_LayoutManager.controlAndSaveNavigationSize = function() {
	if (EBX_LayoutManager.previousNavigationWidth === null) {
		EBX_LayoutManager.previousNavigationWidth = EBX_LayoutManager.bodyUnits.navigation.width;
	}

	var navigationWidth = EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position).get('width');
	navigationWidth = Math.round(navigationWidth);

	var windowWidth = YAHOO.util.Dom.getViewportWidth();

	// if collapsed
	if (navigationWidth <= 0) {
		// just in case
		EBX_LayoutManager.previousWindowWidth = windowWidth;
		return;
	}

	// case of resizing the window to below the navigation width
	if (navigationWidth > windowWidth - 100) {
		navigationWidth = windowWidth - 100;
		EBX_LayoutManager.previousWindowWidth = windowWidth;

		// will call this function again
		EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position).set('width', navigationWidth);
		return;
	}

	// case of resizing the window width: resize the navigation pane proportionally
	if (EBX_Perspective.isNavigationPaneReduced === false && EBX_LayoutManager.previousNavigationWidth === navigationWidth
			&& EBX_LayoutManager.previousWindowWidth !== windowWidth) {
		var previousNavigationWidthBP = EBX_LayoutManager.convertNavWidthToBPWindowWidth(navigationWidth, EBX_LayoutManager.previousWindowWidth);
		navigationWidth = EBX_LayoutManager.convertNavWidthToPx(previousNavigationWidthBP);

		// lower limit is EBX_LayoutManager.navigationPaneMinWidth
		// except EBX_LayoutManager.navigationPaneReducedWidth
		if (navigationWidth < EBX_LayoutManager.navigationPaneMinWidth && navigationWidth !== EBX_LayoutManager.navigationPaneReducedWidth) {
			navigationWidth = EBX_LayoutManager.navigationPaneMinWidth;
		}

		EBX_LayoutManager.previousWindowWidth = windowWidth;

		// prevent saving
		EBX_LayoutManager.previousNavigationWidth = navigationWidth;

		// will call this function again
		EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position).set('width', navigationWidth);
		return;
	}

	var navigationWidthBP = EBX_LayoutManager.convertNavWidthToBP(navigationWidth);

	if (EBX_LayoutManager.previousNavigationWidth !== navigationWidth) {
		if (EBX_LayoutManager.saveNavigationSizeYUIDataSourceLZ === null) {
			EBX_LayoutManager.saveNavigationSizeYUIDataSourceLZ = new YAHOO.util.XHRDataSource(EBX_LayoutManager.navigatorWidthRequest);
		}

		// save navigation width or reduced
		var saveWidthURLParameters = "";

		if (EBX_LayoutManager.navigationPanePerspective === true) {
			if (navigationWidth === EBX_LayoutManager.navigationPaneReducedWidth) {
				EBX_Perspective.navigationPaneWidthBeforeReduced = EBX_LayoutManager.previousNavigationWidth;
				// don't save the current width, because if the user wants to de-reduce the panel, he must retrieve his previous pane width
				saveWidthURLParameters += EBX_LayoutManager.reducedParameter + "true";
			} else {
				saveWidthURLParameters += EBX_LayoutManager.widthParameter + navigationWidthBP;
				saveWidthURLParameters += EBX_LayoutManager.reducedParameter + "false";
			}
		} else {
			saveWidthURLParameters += EBX_LayoutManager.widthParameter + navigationWidthBP;
		}

		EBX_LayoutManager.saveNavigationSizeYUIDataSourceLZ.sendRequest(saveWidthURLParameters, null);
		EBX_LayoutManager.previousNavigationWidth = navigationWidth;
	}

	EBX_LayoutManager.processNavigationPanePerspective(navigationWidth);

	EBX_LayoutManager.fitFloatingNavigationHeaderTitlesToNavPaneNoAnimation();
};

EBX_LayoutManager.navigationPanePerspectiveReducedCSSClass = "ebx_NavigationPanePerspectiveReduced";
EBX_LayoutManager.perspectiveAvoidAnimationsOnLoadingCSSClass = "ebx_PerspectiveAvoidAnimationsOnLoading";
EBX_LayoutManager.perspectiveAvoidAnimationsOnLoadingRemoved = false;

EBX_LayoutManager.processNavigationPanePerspective = function(navigationWidth) {

	if (EBX_LayoutManager.navigationPanePerspective !== true) {
		return;
	}

	var previousState = EBX_Perspective.isNavigationPaneReduced;

	if (navigationWidth === EBX_LayoutManager.navigationPaneReducedWidth) {
		EBXUtils.addCSSClass(document.body, EBX_LayoutManager.navigationPanePerspectiveReducedCSSClass);
		EBX_Perspective.isNavigationPaneReduced = true;
	} else {
		EBXUtils.removeCSSClass(document.body, EBX_LayoutManager.navigationPanePerspectiveReducedCSSClass);
		EBX_Perspective.isNavigationPaneReduced = false;
	}

	EBX_Perspective.refreshNavigationPane(previousState);

	if (EBX_LayoutManager.perspectiveAvoidAnimationsOnLoadingRemoved === false) {
		window.setTimeout(function() {
			EBXUtils.removeCSSClass(document.body, EBX_LayoutManager.perspectiveAvoidAnimationsOnLoadingCSSClass);
		}, 50);
		EBX_LayoutManager.perspectiveAvoidAnimationsOnLoadingRemoved = true;
	}
};

/** START navigation floating titles * */
EBX_LayoutManager.navigationHeaderTitleId = "ebx_NavigationHeaderTitle";
EBX_LayoutManager.navigationHeaderTitle = null;
EBX_LayoutManager.floatingNavigationHeaderTitleEnabled = false;

EBX_LayoutManager.navigationSubHeaderTitleId = "ebx_NavigationSubHeaderTitle";
EBX_LayoutManager.navigationSubHeaderTitle = null;
EBX_LayoutManager.floatingNavigationSubHeaderTitleEnabled = false;

EBX_LayoutManager.displayFloatingNavigationHeaderTitle = function(isSubHeader) {
	var navigationHeaderTitle;
	if (isSubHeader === true) {
		if (EBX_LayoutManager.navigationSubHeaderTitle === null) {
			EBX_LayoutManager.navigationSubHeaderTitle = document.getElementById(EBX_LayoutManager.navigationSubHeaderTitleId);
		}
		navigationHeaderTitle = EBX_LayoutManager.navigationSubHeaderTitle;
	} else {
		if (EBX_LayoutManager.navigationHeaderTitle === null) {
			EBX_LayoutManager.navigationHeaderTitle = document.getElementById(EBX_LayoutManager.navigationHeaderTitleId);
		}
		navigationHeaderTitle = EBX_LayoutManager.navigationHeaderTitle;
	}

	var navigationHeaderTitleChild = navigationHeaderTitle.firstChild;

	if (navigationHeaderTitleChild.clientWidth == navigationHeaderTitleChild.scrollWidth) {
		return;
	}

	// this operation must be done once
	navigationHeaderTitle.onmouseover = null;

	if (isSubHeader === true) {
		EBX_LayoutManager.floatingNavigationSubHeaderTitleEnabled = true;
	} else {
		EBX_LayoutManager.floatingNavigationHeaderTitleEnabled = true;
	}

	// fix the height before removing its child
	navigationHeaderTitle.style.height = navigationHeaderTitle.offsetHeight + "px";

	var overlay = EBX_LayoutManager.getFloatingNavigationHeaderTitle(isSubHeader);

	overlay.setBody(navigationHeaderTitleChild);

	EBX_LayoutManager.fitFloatingNavigationHeaderTitleToNavPaneNoAnimation(isSubHeader);

	overlay.show();

	EBX_LayoutManager.setFloatingNavigationHeaderTitleToAutoWidth(undefined, isSubHeader);

	YAHOO.util.Event.addListener(overlay.element, "mouseover", EBX_LayoutManager.setFloatingNavigationHeaderTitleToAutoWidth, isSubHeader, null);
	YAHOO.util.Event.addListener(overlay.element, "mouseout", EBX_LayoutManager.fitFloatingNavigationHeaderTitleToNavPane, isSubHeader, null);
};
EBX_LayoutManager.FloatingNavHeaderNoAnimationWidthCSSClass = "ebx_WidthNotAnimated";
EBX_LayoutManager.fitFloatingNavigationHeaderTitleToNavPaneNoAnimation = function(isSubHeader) {
	if (isSubHeader === true) {
		if (EBX_LayoutManager.floatingNavigationSubHeaderTitleEnabled === false) {
			return;
		}
	} else {
		if (EBX_LayoutManager.floatingNavigationHeaderTitleEnabled === false) {
			return;
		}
	}
	var floatingTitle = EBX_LayoutManager.getFloatingNavigationHeaderTitle(isSubHeader).element;
	EBXUtils.addCSSClass(floatingTitle, EBX_LayoutManager.FloatingNavHeaderNoAnimationWidthCSSClass);
	EBX_LayoutManager.fitFloatingNavigationHeaderTitleToNavPane(undefined, isSubHeader);
	EBXUtils.removeCSSClass(floatingTitle, EBX_LayoutManager.FloatingNavHeaderNoAnimationWidthCSSClass);
};
EBX_LayoutManager.fitFloatingNavigationHeaderTitleToNavPane = function(event, isSubHeader) {
	var floatingTitle = EBX_LayoutManager.getFloatingNavigationHeaderTitle(isSubHeader).element;

	// if the mouse is always on the element (mouse out called when rolling on children)
	if (event !== undefined) {

		var elementUnderMouse = document.elementFromPoint(event.clientX, event.clientY);

		if (elementUnderMouse !== null && EBXUtils.isChildOf(elementUnderMouse, floatingTitle)) {
			return;
		}
	}

	floatingTitle.style.width = EBX_LayoutManager.getNavigationWidth() + "px";
};

EBX_LayoutManager.setFloatingNavigationHeaderTitleToAutoWidth = function(event, isSubHeader) {
	var floatingTitle = EBX_LayoutManager.getFloatingNavigationHeaderTitle(isSubHeader).element;
	//FIXME CCH /* for test */
	if (EBX_LayoutManager.navigationPanePerspective === true) {
		floatingTitle.style.width = floatingTitle.scrollWidth + 15 + "px";/* padding-right */
		return;
	}
	floatingTitle.style.width = floatingTitle.scrollWidth + "px";
};

EBX_LayoutManager.floatingNavigationHeaderTitleId = "ebx_FloatingNavigationHeaderTitle";
EBX_LayoutManager.floatingNavigationHeaderTitle = null;

EBX_LayoutManager.floatingNavigationSubHeaderTitleId = "ebx_FloatingNavigationSubHeaderTitle";
EBX_LayoutManager.floatingNavigationSubHeaderTitle = null;

EBX_LayoutManager.getFloatingNavigationHeaderTitle = function(isSubHeader) {
	/* zIndex 10 to be covered by the menu for menu buttons, which is 20 */
	if (isSubHeader === true) {
		if (EBX_LayoutManager.floatingNavigationSubHeaderTitle === null) {
			EBX_LayoutManager.floatingNavigationSubHeaderTitle = new YAHOO.widget.Overlay(EBX_LayoutManager.floatingNavigationSubHeaderTitleId, {
				visible: false,
				context: [ EBX_LayoutManager.navigationSubHeaderTitle, "tl", "tl" ],
				zIndex: 10
			});
			EBX_LayoutManager.floatingNavigationSubHeaderTitle.render(document.body);
		}
		return EBX_LayoutManager.floatingNavigationSubHeaderTitle;
	} else {
		if (EBX_LayoutManager.floatingNavigationHeaderTitle === null) {
			EBX_LayoutManager.floatingNavigationHeaderTitle = new YAHOO.widget.Overlay(EBX_LayoutManager.floatingNavigationHeaderTitleId, {
				visible: false,
				context: [ EBX_LayoutManager.navigationHeaderTitle, "tl", "tl" ],
				zIndex: 10
			});
			EBX_LayoutManager.floatingNavigationHeaderTitle.render(document.body);
		}
		return EBX_LayoutManager.floatingNavigationHeaderTitle;
	}
};

/*START external controls */
EBX_LayoutManager.fitFloatingNavigationHeaderTitlesToNavPaneNoAnimation = function() {
	EBX_LayoutManager.fitFloatingNavigationHeaderTitleToNavPaneNoAnimation();
	EBX_LayoutManager.fitFloatingNavigationHeaderTitleToNavPaneNoAnimation(true);
};

EBX_LayoutManager.refreshFloatingNavigationHeaderTitlesContexts = function() {
	if (EBX_LayoutManager.floatingNavigationHeaderTitle !== null) {
		EBX_LayoutManager.floatingNavigationHeaderTitle.cfg.setProperty("context", [ EBX_LayoutManager.navigationHeaderTitle, "tl", "tl" ]);
	}
	if (EBX_LayoutManager.floatingNavigationSubHeaderTitle !== null) {
		EBX_LayoutManager.floatingNavigationSubHeaderTitle.cfg.setProperty("context", [ EBX_LayoutManager.navigationSubHeaderTitle, "tl", "tl" ]);
	}
};

EBX_LayoutManager.hideFloatingNavigationHeaderTitles = function() {
	if (EBX_LayoutManager.floatingNavigationHeaderTitle !== null) {
		EBX_LayoutManager.floatingNavigationHeaderTitle.hide();
	}
	if (EBX_LayoutManager.floatingNavigationSubHeaderTitle !== null) {
		EBX_LayoutManager.floatingNavigationSubHeaderTitle.hide();
	}
};
EBX_LayoutManager.showFloatingNavigationHeaderTitles = function() {
	if (EBX_LayoutManager.floatingNavigationHeaderTitle !== null) {
		EBX_LayoutManager.floatingNavigationHeaderTitle.show();
	}
	if (EBX_LayoutManager.floatingNavigationSubHeaderTitle !== null) {
		EBX_LayoutManager.floatingNavigationSubHeaderTitle.show();
	}
	EBX_LayoutManager.refreshFloatingNavigationHeaderTitlesContexts();
};
/*END external controls */
/** END navigation floating titles * */

/* START Title Breadcrumb */
EBX_LayoutManager.cornerToolsId = "ebx_WorkspaceCornerTools";
EBX_LayoutManager.titleBreadcrumbId = "ebx_TitleBreadcrumb";
EBX_LayoutManager.titleBreadcrumbScrollId = "ebx_TitleBreadcrumbScroll";

EBX_LayoutManager.titleBreadcrumbNoScrollCSSClass = "ebx_TitleBreadcrumbNoScroll";
EBX_LayoutManager.titleBreadcrumbScrollStopLeftCSSClass = "ebx_TitleBreadcrumbScrollStopLeft";
EBX_LayoutManager.titleBreadcrumbScrollStopRightCSSClass = "ebx_TitleBreadcrumbScrollStopRight";

EBX_LayoutManager.cornerToolsEl = null;
EBX_LayoutManager.titleBreadcrumbEl = null;
EBX_LayoutManager.titleBreadcrumbScrollEl = null;

EBX_LayoutManager.titleBreadcrumbMaxScroll = 0;

EBX_LayoutManager.initTitleBreadcrumb = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_title_breadcrumb, EBX_Loader.states.processing);

	EBX_LayoutManager.cornerToolsEl = document.getElementById(EBX_LayoutManager.cornerToolsId);
	EBX_LayoutManager.titleBreadcrumbEl = document.getElementById(EBX_LayoutManager.titleBreadcrumbId);
	EBX_LayoutManager.titleBreadcrumbScrollEl = document.getElementById(EBX_LayoutManager.titleBreadcrumbScrollId);

	EBX_LayoutManager.bodyLayout.addListener("resize", EBX_LayoutManager.resizeTitleBreadcrumb);
	EBX_LayoutManager.resizeTitleBreadcrumb();

	new YAHOO.util.Scroll(EBX_LayoutManager.titleBreadcrumbEl, {
		scroll: {
			to: [ EBX_LayoutManager.titleBreadcrumbMaxScroll, 0 ]
		}
	}, EBX_LayoutManager.breadcrumbScrollInitialAnimationDuration / 1000, YAHOO.util.Easing.easeBoth).animate();

	YAHOO.util.Event.addListener(EBX_LayoutManager.titleBreadcrumbEl, "scroll", EBX_LayoutManager.titleBreadcrumbScrollListener, null, this);

	EBX_Loader.changeTaskState(EBX_Loader_taskId_title_breadcrumb, EBX_Loader.states.done);
};

EBX_LayoutManager.resizeTitleBreadcrumb = function() {
	EBX_LayoutManager.titleBreadcrumbEl.style.width = EBX_LayoutManager.cornerToolsEl.offsetLeft + "px";

	EBX_LayoutManager.titleBreadcrumbMaxScroll = EBX_LayoutManager.titleBreadcrumbEl.scrollWidth - EBX_LayoutManager.titleBreadcrumbEl.clientWidth;

	if (EBX_LayoutManager.titleBreadcrumbMaxScroll === 0) {
		EBX_LayoutManager.titleBreadcrumbScrollEl.style.display = "none";
		EBXUtils.addCSSClass(EBX_LayoutManager.titleBreadcrumbEl, EBX_LayoutManager.titleBreadcrumbNoScrollCSSClass);
	} else {
		EBX_LayoutManager.titleBreadcrumbScrollEl.style.display = "";
		EBXUtils.removeCSSClass(EBX_LayoutManager.titleBreadcrumbEl, EBX_LayoutManager.titleBreadcrumbNoScrollCSSClass);
	}
};

EBX_LayoutManager.titleBreadcrumbScrollListener = function() {
	var titleBreadcrumbScrollCSSClass = "";

	var breadcrumbScrollLeft = EBX_LayoutManager.titleBreadcrumbEl.scrollLeft;

	if (breadcrumbScrollLeft === 0) {
		titleBreadcrumbScrollCSSClass = EBX_LayoutManager.titleBreadcrumbScrollStopLeftCSSClass;
	} else if (breadcrumbScrollLeft === EBX_LayoutManager.titleBreadcrumbMaxScroll) {
		titleBreadcrumbScrollCSSClass = EBX_LayoutManager.titleBreadcrumbScrollStopRightCSSClass;
	}

	EBX_LayoutManager.titleBreadcrumbScrollEl.className = titleBreadcrumbScrollCSSClass;
};

EBX_LayoutManager.breadcrumbScrollInitialAnimationDuration = 500;//ms

EBX_LayoutManager.breadcrumbScrollAmount = 100;//px

/* When the user hold a scroll button.
 * The scroll is done once, then a delay, then repeated scrolls. */
EBX_LayoutManager.delayToLaunchRepeatedScrolling = 400;//ms

EBX_LayoutManager.breadcrumbScrollAnimationDuration = 100;//ms
EBX_LayoutManager.delayForRepeatedScrolling = 100;//ms

EBX_LayoutManager.scrollTimeout = null;
EBX_LayoutManager.scrollInterval = null;

EBX_LayoutManager.breadcrumbScrollLeftMouseDown = function() {
	window.setTimeout(EBX_LayoutManager.breadcrumbScrollLeft, 0);
	EBX_LayoutManager.scrollTimeout = window.setTimeout(EBX_LayoutManager.breadcrumbLaunchScrollLeftInterval,
			EBX_LayoutManager.delayToLaunchRepeatedScrolling);
};
EBX_LayoutManager.breadcrumbLaunchScrollLeftInterval = function() {
	EBX_LayoutManager.scrollInterval = window.setInterval(EBX_LayoutManager.breadcrumbScrollLeft, EBX_LayoutManager.delayForRepeatedScrolling);
};
EBX_LayoutManager.breadcrumbScrollLeftMouseUp = function() {
	window.clearTimeout(EBX_LayoutManager.scrollTimeout);
	window.clearInterval(EBX_LayoutManager.scrollInterval);
};
EBX_LayoutManager.breadcrumbScrollLeftMouseOut = function() {
	window.clearTimeout(EBX_LayoutManager.scrollTimeout);
	window.clearInterval(EBX_LayoutManager.scrollInterval);
};
EBX_LayoutManager.breadcrumbScrollLeft = function() {
	var targetScrollLeft = EBX_LayoutManager.titleBreadcrumbEl.scrollLeft - EBX_LayoutManager.breadcrumbScrollAmount;

	if (targetScrollLeft < 0) {
		targetScrollLeft = 0;
	}

	new YAHOO.util.Scroll(EBX_LayoutManager.titleBreadcrumbEl, {
		scroll: {
			to: [ targetScrollLeft, 0 ]
		}
	}, EBX_LayoutManager.breadcrumbScrollAnimationDuration / 1000).animate();
};

EBX_LayoutManager.breadcrumbScrollRightMouseDown = function() {
	window.setTimeout(EBX_LayoutManager.breadcrumbScrollRight, 0);
	EBX_LayoutManager.scrollTimeout = window.setTimeout(EBX_LayoutManager.breadcrumbLaunchScrollRightInterval,
			EBX_LayoutManager.delayToLaunchRepeatedScrolling);
};
EBX_LayoutManager.breadcrumbLaunchScrollRightInterval = function() {
	EBX_LayoutManager.scrollInterval = window.setInterval(EBX_LayoutManager.breadcrumbScrollRight, EBX_LayoutManager.delayForRepeatedScrolling);
};
EBX_LayoutManager.breadcrumbScrollRightMouseUp = function() {
	window.clearTimeout(EBX_LayoutManager.scrollTimeout);
	window.clearInterval(EBX_LayoutManager.scrollInterval);
};
EBX_LayoutManager.breadcrumbScrollRightMouseOut = function() {
	window.clearTimeout(EBX_LayoutManager.scrollTimeout);
	window.clearInterval(EBX_LayoutManager.scrollInterval);
};
EBX_LayoutManager.breadcrumbScrollRight = function() {
	var targetScrollLeft = EBX_LayoutManager.titleBreadcrumbEl.scrollLeft + EBX_LayoutManager.breadcrumbScrollAmount;

	if (targetScrollLeft > EBX_LayoutManager.titleBreadcrumbMaxScroll) {
		targetScrollLeft = EBX_LayoutManager.titleBreadcrumbMaxScroll;
	}

	new YAHOO.util.Scroll(EBX_LayoutManager.titleBreadcrumbEl, {
		scroll: {
			to: [ targetScrollLeft, 0 ]
		}
	}, EBX_LayoutManager.breadcrumbScrollAnimationDuration / 1000, YAHOO.util.Easing.easeBoth).animate();
};

EBX_LayoutManager.breadcrumbItemClickOnLink = function(breadcrumbItemEl, event) {
	var targetEl = event.target;
	if (EBX_LayoutManager.isIE) {
		targetEl = event.srcElement;
	}

	if (targetEl.tagName.toLowerCase() == "a") {
		return;
	}

	if (EBXUtils.getFirstParentMatchingTagName(targetEl, "a") !== null) {
		return;
	}

	var linkChild = EBXUtils.getFirstRecursiveChildMatchingTagName(breadcrumbItemEl, "a");
	if (linkChild !== null) {
		linkChild.focus();
		window.location.href = linkChild.href;
	}
};

/* END Title Breadcrumb */

EBX_LayoutManager.getNavigationWidth = function() {
	if (EBX_LayoutManager.previousNavigationWidth === null) {
		EBX_LayoutManager.previousNavigationWidth = EBX_LayoutManager.bodyUnits.navigation.width;
	}

	return EBX_LayoutManager.previousNavigationWidth;
};

EBX_LayoutManager.baseURLForDocSearchCookieName = "ebx_BaseURLForDocSearch";
EBX_LayoutManager.saveBaseURLForDocSearchInCookie = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_save_url_for_doc_search, EBX_Loader.states.processing);

	YAHOO.util.Cookie.set(EBX_LayoutManager.baseURLForDocSearchCookieName, EBX_Constants.baseURLForDocSearch, {
		path: "/"
	});

	EBX_Loader.changeTaskState(EBX_Loader_taskId_save_url_for_doc_search, EBX_Loader.states.done);
};

EBX_LayoutManager.isEBXBody = function(document) {
	var bodyEl = document.body;

	var classes = bodyEl.className.split(EBXUtils.CSSClassSeparator);
	for ( var i = 0; i < classes.length; i++) {
		if (classes[i].indexOf('ebx_') != -1) {
			return true;
		}
	}

	return false;
};

window.ebx_LayoutManager_isEmbeddedValue = null;
EBX_LayoutManager.isEmbedded = function() {
	if (window.ebx_LayoutManager_isEmbeddedValue === null) {
		// parent.document causes a security exception when EBX is embedded in a iFrame with a different domain name
		// see Mantis #3686
		try {
			if (parent && parent.document != document) {
				window.ebx_LayoutManager_isEmbeddedValue = EBX_LayoutManager.isEBXBody(parent.document);
			} else {
				window.ebx_LayoutManager_isEmbeddedValue = false;
			}
		} catch (e) {
			window.ebx_LayoutManager_isEmbeddedValue = false;
		}
	}
	return window.ebx_LayoutManager_isEmbeddedValue;
};

EBX_LayoutManager.SelectableLayoutLZ = null;
EBX_LayoutManager.getFirstParentSelectableLayoutWindowLZ = function() {
	if (EBX_LayoutManager.SelectableLayoutLZ !== null) {
		return EBX_LayoutManager.SelectableLayoutLZ;
	} else {
		return EBX_LayoutManager.getFirstParentSelectableLayoutWindowOf(window);
	}
};
EBX_LayoutManager.getFirstParentSelectableLayoutWindowOf = function(windowToCheck) {
	if (EBX_LayoutManager.isHeaderPresent(windowToCheck) || EBX_LayoutManager.isNavigationPresent(windowToCheck)) {
		return windowToCheck;
	} else {
		return EBX_LayoutManager.getFirstParentSelectableLayoutWindowOf(windowToCheck.parent);
	}
};

EBX_LayoutManager.isPopUp = function() {
	try {
		if (window.opener && window != window.opener) {
			return EBX_LayoutManager.isEBXBody(window.opener.document);
		}
	} catch (err) {}

	return false;
};

EBX_LayoutManager.ViewportSizeNormal = "1024";
EBX_LayoutManager.ViewportSizeBig = "900";
EBX_LayoutManager.ViewportSizeBigger = "800";

EBX_LayoutManager.getViewportMetaEl = function() {
	var viewport = document.querySelector("meta[name=viewport]");
	if (viewport === null) {
		viewport = document.createElement("meta");
		viewport.setAttribute("name", "viewport");
		document.getElementsByTagName("head")[0].appendChild(viewport);
	}
	return viewport;
};
EBX_LayoutManager.setViewportSizeNormal = function() {
	EBX_LayoutManager.setViewportSize(EBX_LayoutManager.ViewportSizeNormal, true);
};
EBX_LayoutManager.setViewportSizeBig = function() {
	EBX_LayoutManager.setViewportSize(EBX_LayoutManager.ViewportSizeBig, true);
};
EBX_LayoutManager.setViewportSizeBigger = function() {
	EBX_LayoutManager.setViewportSize(EBX_LayoutManager.ViewportSizeBigger, true);
};

EBX_LayoutManager.setViewportMenuItemChecked = function(viewportSize) {
	var menuItems = EBX_ButtonUtils.menuButtonsMenu["ebx_SizeMenuButton"];

	if (menuItems === undefined) {
		window.setTimeout("EBX_LayoutManager.setViewportMenuItemChecked(" + viewportSize + ")", 500);
		return;
	}

	var viewportSizeIndex;
	switch (viewportSize) {
		case EBX_LayoutManager.ViewportSizeNormal:
			viewportSizeIndex = 0;
			break;
		case EBX_LayoutManager.ViewportSizeBig:
			viewportSizeIndex = 1;
			break;
		case EBX_LayoutManager.ViewportSizeBigger:
			viewportSizeIndex = 2;
			break;
		default:
			viewportSizeIndex = -1;
	}

	for ( var i = 0; i < menuItems.length; i++) {
		if (i === viewportSizeIndex) {
			menuItems[i].checked = true;
		} else {
			menuItems[i].checked = false;
		}
	}
};

EBX_LayoutManager.setViewportSize = function(viewportSize, storeInCookie) {
	EBX_LayoutManager.getViewportMetaEl().setAttribute("content", "width=" + viewportSize);
	if (storeInCookie) {
		EBX_LayoutManager.saveViewportSizeInCookie(viewportSize);
	}
	EBX_LayoutManager.setViewportMenuItemChecked(viewportSize);
};

EBX_LayoutManager.saveViewportSizeInCookie = function(viewportSize) {
	YAHOO.util.Cookie.set("ebx_ViewportSize", viewportSize, {
		path: "/"
	});
};

EBX_LayoutManager.setViewportSizeFromCookie = function() {
	var viewportSize = YAHOO.util.Cookie.get("ebx_ViewportSize");

	if (viewportSize === null) {
		EBX_LayoutManager.setViewportSizeNormal();
		return;
	}

	EBX_LayoutManager.setViewportSize(viewportSize, false);
};

EBX_LayoutManager.setWorkspaceTitle = function(workspaceTitle) {
	var workspaceTitleEl = EBXUtils.getFirstDirectChildMatchingTagName(document.getElementById("ebx_WorkspaceHeader"), "h2");
	if (workspaceTitleEl === null) {
		return;
	}
	workspaceTitleEl.innerHTML = workspaceTitle;
};

EBX_LayoutManager.enableContextSensitiveHelpButton = function(url) {
	var contextualDocWrapperEl = document.getElementById("ebx_ContextualDocWrapper");
	if (contextualDocWrapperEl === null) {
		return;
	}
	contextualDocWrapperEl.style.display = "";
	EBX_ButtonUtils.jsButtonsCmds["ebx_ContextualDoc"] = "EBX_Doc.launchPopup(\"" + url + "\")";
};

/* START UI test automation API */

/**
 * Turns true when the loader has started.
 */
var ebx_loaderStarted = false;

function ebx_SetLoaderStarted() {
	ebx_loaderStarted = true;
}

/**
 * Store the number of current and sub iFrames ebx_loader pending
 */
var ebx_loaderPending = 0;

function ebx_SetLoaderPending() {
	if (!EBX_LayoutManager.isUIAutoTestModeEnabled) {
		return;
	}
	ebx_loaderPending++;
	if (EBX_LayoutManager.isEmbedded()) {
		try {
			window.parent.ebx_SetLoaderPending();
		} catch (e) {}
	}
}

function ebx_SetLoaderFinished() {
	if (!EBX_LayoutManager.isUIAutoTestModeEnabled) {
		return;
	}
	ebx_loaderPending--;
	if (EBX_LayoutManager.isEmbedded()) {
		try {
			window.parent.ebx_SetLoaderFinished();
			window.parent.ebx_SetSubLoaderFinished();
		} catch (e) {}
	}
}

/*
 * Store the number of iFrames pending
 * Increased when an EBX iFrame is built
 * Decreased when the sub ebx_loader is finished
 */
var ebx_framePending = 0;

function ebx_SetFramePending() {
	if (!EBX_LayoutManager.isUIAutoTestModeEnabled) {
		return;
	}
	ebx_framePending++;
	if (EBX_LayoutManager.isEmbedded()) {
		try {
			window.parent.ebx_SetFramePending();
		} catch (e) {}
	}
}

function ebx_SetSubLoaderFinished() {
	if (!EBX_LayoutManager.isUIAutoTestModeEnabled) {
		return;
	}
	ebx_framePending--;
	if (EBX_LayoutManager.isEmbedded()) {
		try {
			window.parent.ebx_SetSubLoaderFinished();
		} catch (e) {}
	}
}

/*
 * Increase when an AJAX request is sent.
 * Decrease when an AJAX request is received.
 */
var ebx_ajax_requestPending = 0;

/**
 * Number of successful AJAX requests received.
 */
var ebx_ajax_responseOK = 0;
/**
 * Number of unsuccessful AJAX requests received.
 */
var ebx_ajax_responseKO = 0;

function ebx_LoadingSupervisor_AJAXRequestSent() {
	if (!EBX_LayoutManager.isUIAutoTestModeEnabled) {
		return;
	}
	if (EBX_LayoutManager.isEmbedded()) {
		try {
			window.parent.ebx_LoadingSupervisor_AJAXRequestSent();
		} catch (e) {}
		return;
	}
	ebx_ajax_requestPending++;
}

function ebx_LoadingSupervisor_AJAXResponseOK() {
	if (!EBX_LayoutManager.isUIAutoTestModeEnabled) {
		return;
	}
	if (EBX_LayoutManager.isEmbedded()) {
		try {
			window.parent.ebx_LoadingSupervisor_AJAXResponseOK();
		} catch (e) {}
		return;
	}
	ebx_ajax_requestPending--;
	ebx_ajax_responseOK++;
}

function ebx_LoadingSupervisor_AJAXResponseKO() {
	if (!EBX_LayoutManager.isUIAutoTestModeEnabled) {
		return;
	}
	if (EBX_LayoutManager.isEmbedded()) {
		try {
			window.parent.ebx_LoadingSupervisor_AJAXResponseKO();
		} catch (e) {}
		return;
	}
	ebx_ajax_requestPending--;
	ebx_ajax_responseKO++;
}

function ebx_hasAJAXRequestPending() {
	return ebx_ajax_requestPending !== 0;
}

function ebx_hasAJAXResponseInError() {
	return ebx_ajax_responseKO !== 0;
}

function ebx_hasLoaderPending() {
	if (!ebx_loaderStarted) {
		return true;
	}
	return ebx_loaderPending !== 0;
}

function ebx_hasFramePending() {
	return ebx_framePending !== 0;
}

function ebx_isFullPageLoadedIncludingAJAXandIFrame() {
	return !ebx_hasLoaderPending() && !ebx_hasAJAXRequestPending() && !ebx_hasFramePending();
}

/* END UI test automation API */
