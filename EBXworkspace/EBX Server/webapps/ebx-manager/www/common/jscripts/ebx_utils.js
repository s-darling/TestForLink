/** START EBXUtils * */

// this is just for IE8; it can be removed when IE8 will no more be supported
// piece of code found on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/gm, '');
	};
}

function EBXUtils() {

}

EBXUtils.arrayContains = function(array, item) {
	var array_length = array.length;
	for ( var i = 0; i < array_length; i++) {
		if (array[i] === item) {
			return true;
		}
	}
	return false;
};

EBXUtils.indexOf = function(array, item) {
	var array_length = array.length;
	for ( var i = 0; i < array_length; i++) {
		if (array[i] === item) {
			return i;
		}
	}
	return -1;
};

EBXUtils.childElementCount = function(element) {
	if (EBX_LayoutManager.isIE8 === false) {
		return element.childElementCount;
	}

	var child = EBXUtils.firstElementChild(element);
	if (child === null) {
		return 0;
	}
	var i = 1;

	while ((child = EBXUtils.nextElementSibling(child)) !== null) {
		i++;
	}
	return i;
};

/* DO NOT CHANGE : HTML/CSS Standard */
EBXUtils.CSSClassSeparator = " ";

EBXUtils.matchCSSClass = function(element, cssClass) {
	if (element.className === undefined || element.className === null) {
		return false;
	}

	return EBXUtils.arrayContains(element.className.split(EBXUtils.CSSClassSeparator), cssClass);
};

EBXUtils.addCSSClass = function(element, cssClass) {
	if (element.className === undefined || element.className === null) {
		return false;
	}

	if (!EBXUtils.matchCSSClass(element, cssClass)) {
		if (element.className !== "") {
			element.className += EBXUtils.CSSClassSeparator;
		}
		element.className += cssClass;
	}

	return true;
};

EBXUtils.removeCSSClass = function(element, cssClass) {
	if (element.className === undefined || element.className === null) {
		return false;
	}
	if (cssClass === undefined || cssClass === null || cssClass === "") {
		return false;
	}
	if (!EBXUtils.matchCSSClass(element, cssClass)) {
		return true;
	}

	element.className = EBXUtils.getCSSClassWithOneRemoved(element.className, cssClass);

	return true;
};
EBXUtils.getCSSClassWithOneRemoved = function(className, cssClassToRemove) {
	var ret = "";

	var classes = className.split(EBXUtils.CSSClassSeparator);
	var classes_length = classes.length;
	for ( var i = 0; i < classes_length; i++) {
		if (classes[i] !== "" && classes[i] !== cssClassToRemove) {
			if (i !== 0) {
				ret += EBXUtils.CSSClassSeparator;
			}
			ret += classes[i];
		}
	}

	return ret;
};

EBXUtils.getFirstDirectChildMatchingCSSClass = function(element, cssClass) {
	var child = element.firstChild;
	if (child === null) {
		return null;
	}
	do {
		if (EBXUtils.matchCSSClass(child, cssClass)) {
			return child;
		}
	} while ((child = child.nextSibling));

	return null;
};
EBXUtils.getFirstRecursiveChildMatchingCSSClass = function(element, cssClass) {
	var findAmongDirectChildren = EBXUtils.getFirstDirectChildMatchingCSSClass(element, cssClass);

	if (findAmongDirectChildren !== null) {
		return findAmongDirectChildren;
	}

	var child = element.firstChild;
	if (child === null) {
		return null;
	}
	do {
		findAmongDirectChildren = EBXUtils.getFirstRecursiveChildMatchingCSSClass(child, cssClass);
		if (findAmongDirectChildren !== null) {
			return findAmongDirectChildren;
		}
	} while ((child = child.nextSibling));

	return null;
};
EBXUtils.getRecursiveChildrenMatchingCSSClass = function(element, cssClass) {
	var children = [];

	var child = element.firstChild;
	if (child !== null) {
		do {
			EBXUtils.pushRecursiveChildrenMatchingCSSClass(child, cssClass, children);
		} while ((child = child.nextSibling));
	}

	return children;
};
EBXUtils.pushRecursiveChildrenMatchingCSSClass = function(element, cssClass, arrayToFill) {
	if (EBXUtils.matchCSSClass(element, cssClass)) {
		arrayToFill.push(element);
	}

	var child = element.firstChild;
	if (child === null) {
		return;
	}
	do {
		EBXUtils.pushRecursiveChildrenMatchingCSSClass(child, cssClass, arrayToFill);
	} while ((child = child.nextSibling));
};

/**
 * Browse recursively to find the children. When a child is found, rewind
 * recursion (and don't browse its children).
 */
EBXUtils.getRecursiveChildrenMatchingCSSClassDepth1 = function(element, cssClass) {
	var children = [];

	var child = element.firstChild;
	if (child !== null) {
		do {
			EBXUtils.pushRecursiveChildrenMatchingCSSClassDepth1(child, cssClass, children);
		} while ((child = child.nextSibling));
	}

	return children;
};
EBXUtils.pushRecursiveChildrenMatchingCSSClassDepth1 = function(element, cssClass, arrayToFill) {
	if (EBXUtils.matchCSSClass(element, cssClass)) {
		arrayToFill.push(element);
		return;
	}

	var child = element.firstChild;
	if (child === null) {
		return;
	}
	do {
		EBXUtils.pushRecursiveChildrenMatchingCSSClassDepth1(child, cssClass, arrayToFill);
	} while ((child = child.nextSibling));
};

EBXUtils.getFirstParentMatchingCSSClass = function(element, cssClass) {
	var parent = element.parentNode;
	while (parent !== null) {
		if (EBXUtils.matchCSSClass(parent, cssClass)) {
			return parent;
		} else {
			parent = parent.parentNode;
		}
	}
	return null;
};
EBXUtils.getFirstParentMatchingTagName = function(element, tagName) {
	var parent = element.parentNode;
	while (parent !== null) {
		if (parent.tagName !== undefined && parent.tagName.toLowerCase() == tagName.toLowerCase()) {
			return parent;
		} else {
			parent = parent.parentNode;
		}
	}
	return null;
};
EBXUtils.hasParentMatchingId = function(element, id) {
	var parent = element.parentNode;
	while (parent !== null) {
		if (parent.id === id) {
			return true;
		} else {
			parent = parent.parentNode;
		}
	}
	return false;
};

EBXUtils.getFirstDirectChildMatchingTagName = function(element, tagName) {
	var child = element.firstChild;
	if (child === null) {
		return null;
	}
	do {
		/* some nodes are not elements (but text for example) */
		if (child.tagName !== undefined) {
			if (child.tagName.toLowerCase() == tagName.toLowerCase()) {
				return child;
			}
		}
	} while ((child = child.nextSibling));

	return null;
};
EBXUtils.getFirstRecursiveChildMatchingTagName = function(element, tagName) {
	var findAmongDirectChildren = EBXUtils.getFirstDirectChildMatchingTagName(element, tagName);

	if (findAmongDirectChildren !== null) {
		return findAmongDirectChildren;
	}

	var child = element.firstChild;
	if (child === null) {
		return null;
	}
	do {
		findAmongDirectChildren = EBXUtils.getFirstRecursiveChildMatchingTagName(child, tagName);
		if (findAmongDirectChildren !== null) {
			return findAmongDirectChildren;
		}
	} while ((child = child.nextSibling));

	return null;
};

EBXUtils.nextElementSibling = function(element) {
	while (element.nextSibling !== null) {
		if (element.nextSibling.nodeType === 1) {
			return element.nextSibling;
		}
		element = element.nextSibling;
	}
	return null;
};

EBXUtils.firstElementChild = function(element) {
	if (element.firstChild === null) {
		return null;
	}
	if (element.firstChild.nodeType === 1) {
		return element.firstChild;
	}
	element = element.firstChild;
	while (element.nextSibling !== null) {
		if (element.nextSibling.nodeType === 1) {
			return element.nextSibling;
		}
		element = element.nextSibling;
	}
	return null;
};

EBXUtils.getIndex = function(element) {
	var ret = 0;
	var child = EBXUtils.firstElementChild(element.parentNode);
	do {
		if (child === element) {
			return ret;
		}
		ret++;
	} while ((child = EBXUtils.nextElementSibling(child)) !== null);
	return -1;
};

EBXUtils.isFullyDisplayed = function(element) {
	var elementRegion = YAHOO.util.Dom.getRegion(element);

	var topRightElement = document.elementFromPoint(elementRegion.right - 1, elementRegion.top + 1);
	if (topRightElement === null || (topRightElement !== element && !EBXUtils.isChildOf(topRightElement, element))) {
		return false;
	}
	/* is it really useful to test all 4 points? the diagonal is enough in most of cases...?
	 var bottomRightElement = document.elementFromPoint(elementRegion.right - 1, elementRegion.bottom - 1);
	 if (bottomRightElement === null || (bottomRightElement !== element && !EBXUtils.isChildOf(bottomRightElement, element))) {
	 return false;
	 }
	 */
	var bottomLeftElement = document.elementFromPoint(elementRegion.left + 1, elementRegion.bottom - 1);
	if (bottomLeftElement === null || (bottomLeftElement !== element && !EBXUtils.isChildOf(bottomLeftElement, element))) {
		return false;
	}
	/*
	 var topLeftElement = document.elementFromPoint(elementRegion.left + 1, elementRegion.top + 1);
	 if (topLeftElement === null || (topLeftElement !== element && !EBXUtils.isChildOf(topLeftElement, element))) {
	 return false;
	 }
	 */
	return true;
};

EBXUtils.isChildOf = function(child, element) {
	var parent = child.parentNode;
	while (parent !== null) {
		if (parent === element) {
			return true;
		} else {
			parent = parent.parentNode;
		}
	}
	return false;
};

EBXUtils.getIFrameContentDocumentOrNull = function(iFrameEl) {
	try {
		if (EBX_LayoutManager.isIE6or7) {
			return iFrameEl.contentWindow.document;
		} else {
			return iFrameEl.contentDocument;
		}
	} catch (e) {
		return null;
	}
};

EBXUtils.getElementByIdInSubSessionIFrameRecursively = function(id) {
	var documentEl = document;
	var element = null;
	while (element === null) {
		if (documentEl.getElementById("ebx_SubSessioniFrame") === null) {
			return null;
		}
		documentEl = EBXUtils.getIFrameContentDocumentOrNull(documentEl.getElementById("ebx_SubSessioniFrame"));
		if (documentEl === null) {
			// iframeDocument null is the case of unreachable iframe document for security reasons
			return null;
		}
		element = documentEl.getElementById(id);
	}
	return element;
};

EBXUtils.removeLast = function(str, strToRemove) {
	return str.substring(0, str.lastIndexOf(strToRemove));
};

EBXUtils.hScrollHeight = null;
EBXUtils.vScrollWidth = null;

EBXUtils.getHScrollHeight = function() {
	if (EBXUtils.hScrollHeight === null) {
		EBXUtils.initScrollSizes();
	}
	return EBXUtils.hScrollHeight;
};
EBXUtils.getVScrollWidth = function() {
	if (EBXUtils.vScrollWidth === null) {
		EBXUtils.initScrollSizes();
	}
	return EBXUtils.vScrollWidth;
};

EBXUtils.initScrollSizes = function() {
	var containerEl = document.createElement("div");
	containerEl.style.position = "fixed";
	containerEl.style.top = "0";
	containerEl.style.left = "200%";
	containerEl.style.width = "100px";
	containerEl.style.height = "100px";
	containerEl.style.overflow = "auto";

	var contentEl = document.createElement("div");
	contentEl.style.width = "200px";
	contentEl.style.height = "200px";

	containerEl.appendChild(contentEl);

	document.body.appendChild(containerEl);

	EBXUtils.hScrollHeight = 100 - containerEl.clientHeight;
	EBXUtils.vScrollWidth = 100 - containerEl.clientWidth;

	document.body.removeChild(containerEl);
};

EBXUtils.getOffsetParentPositionAbsolute = function(element) {
	/* create a div gauge */
	var gauge = document.createElement("div");
	gauge.style.position = "absolute";
	gauge.style.visibility = "hidden";
	gauge.innerHTML = "gauge";

	element.parentNode.appendChild(gauge);

	var ret = gauge.offsetParent;

	/* destroy div gauge */
	gauge.parentNode.removeChild(gauge);

	return ret;
};
EBXUtils.getOffsetTopPositionAbsolute = function(element) {
	var offsetParentPositionAbsolute = EBXUtils.getOffsetParentPositionAbsolute(element);
	return EBXUtils.getOffsetTopRelativeToContainer(element, offsetParentPositionAbsolute);
};
EBXUtils.getOffsetLeftPositionAbsolute = function(element) {
	var offsetParentPositionAbsolute = EBXUtils.getOffsetParentPositionAbsolute(element);
	return EBXUtils.getOffsetLeftRelativeToContainer(element, offsetParentPositionAbsolute);
};
EBXUtils.getOffsetTopRelativeToContainer = function(element, elementContainer) {
	var ret = element.offsetTop;
	var tmpOffsetParent = element.offsetParent;
	while (tmpOffsetParent !== undefined && tmpOffsetParent != elementContainer) {
		ret += tmpOffsetParent.offsetTop;
		tmpOffsetParent = tmpOffsetParent.offsetParent;
	}

	return ret;
};
EBXUtils.getOffsetLeftRelativeToContainer = function(element, elementContainer) {
	var ret = element.offsetLeft;
	var tmpOffsetParent = element.offsetParent;
	while (tmpOffsetParent !== null && tmpOffsetParent != elementContainer) {
		ret += tmpOffsetParent.offsetLeft;
		tmpOffsetParent = tmpOffsetParent.offsetParent;
	}

	return ret;
};

EBXUtils.returnTrue = function() {
	return true;
};
EBXUtils.returnFalse = function() {
	return false;
};

EBXUtils.clearSelection = function() {
	if (document.selection && document.selection.empty) {
		document.selection.empty();
	} else if (window.getSelection) {
		var sel = window.getSelection();
		sel.removeAllRanges();
	}
};

EBXUtils.launchRequestInParentFrame = function(requestURL) {
	if (!EBX_LayoutManager.isEmbedded()) {
		window.location.href = requestURL;
		return;
	}

	window.parent.location.href = requestURL;
};
/** END EBXUtils * */

/** START EBXLogger * */

function EBXLogger() {

}

EBXLogger.error = YAHOO.widget.Logger.categories[2];
EBXLogger.warn = YAHOO.widget.Logger.categories[1];
EBXLogger.info = YAHOO.widget.Logger.categories[0];

EBXLogger.serverSeverity = [];
EBXLogger.serverSeverity[EBXLogger.error] = "E";
EBXLogger.serverSeverity[EBXLogger.warn] = "W";
EBXLogger.serverSeverity[EBXLogger.info] = "I";

EBXLogger.LoggerWriter = new YAHOO.widget.LogWriter("EBXLogger");
EBXLogger.LogReader = false;

EBXLogger.init = function() {
	if (EBX_LayoutManager.isEmbedded()) {
		return;
	}
	EBXLogger.LogReader = new YAHOO.widget.LogReader();
	EBXLogger.LogReader.verboseOutput = false;
	EBXLogger.LogReader.hideSource("LogReader");
	EBXLogger.LogReader.hideSource("global");
	EBXLogger.LogReader.hide();
};

EBXLogger.show = function() {
	if (!EBXLogger.LogReader) {
		return;
	}

	EBXLogger.LogReader.show();
};
EBXLogger.hide = function() {
	if (!EBXLogger.LogReader) {
		return;
	}

	EBXLogger.LogReader.hide();
};

/**
 * @param message
 *            the message to log
 * @param level
 *            EBXLogger.error or EBXLogger.warn or EBXLogger.info
 */
EBXLogger.log = function(message, level) {
	EBXLogger.LoggerWriter.log(message, level);
	EBXLogger.sendLogToServer(message, level);
};

EBXLogger.sendLogToServer = function(message, level) {
	if (EBXLogger.logThisLevel(level)) {
		var url = EBX_Constants.getRequestLink(EBX_Constants.ajaxLogEvent);

		var data = EBX_Constants.ajaxLogSeverity + "=" + EBXLogger.serverSeverity[level];
		data += "&";
		data += EBX_Constants.ajaxLogMsg + "=" + encodeURIComponent(message);

		YAHOO.util.Connect.asyncRequest('POST', url, {}, data);
	}
};
EBXLogger.sendLogToServerLevel = EBXLogger.error;
EBXLogger.logThisLevel = function(level) {
	if (EBXLogger.sendLogToServerLevel === undefined) {
		return false;
	}

	if (EBXLogger.sendLogToServerLevel === EBXLogger.info) {
		if (level == EBXLogger.info || level == EBXLogger.warn || level == EBXLogger.error) {
			return true;
		}
	}

	if (EBXLogger.sendLogToServerLevel === EBXLogger.warn) {
		if (level == EBXLogger.warn || level == EBXLogger.error) {
			return true;
		}
	}

	if (EBXLogger.sendLogToServerLevel === EBXLogger.error) {
		if (level == EBXLogger.error) {
			return true;
		}
	}

	return false;
};

YAHOO.util.Event.onDOMReady(EBXLogger.init);

/** END EBXLogger * */

function EBXDebugTools() {

}

EBXDebugTools.init = function() {
	YAHOO.util.Event.addListener(document.body, "dblclick", EBXDebugTools.dblclickOnBody, null, null);
};

EBXDebugTools.dblclickOnBody = function(event) {
	if (event.clientX < 10 && event.clientY < 10 && event.altKey === true && event.ctrlKey === true && event.shiftKey === true) {
		EBXDebugTools.promptToolsList();
	}
};

EBXDebugTools.toolList = [];

EBXDebugTools.promptToolsList = function() {
	var text, i, len, tool, code;

	text = [];
	text.push("Debug tools:");

	// build the list of tools
	for (i = 0, len = EBXDebugTools.toolList.length; i < len; i++) {
		tool = EBXDebugTools.toolList[i];
		text.push((i + 1) + ". " + tool[0]);
	}

	code = prompt(text.join("\n"));

	// cancel button
	if (code === null) {
		return;
	}

	tool = EBXDebugTools.toolList[code - 1];
	if (tool !== undefined) {
		tool[1].call();
		return;
	}

	// other hidden cases
	switch (code) {
		case "Something else":
			alert("There is no easter egg here.\nIt's a professional web application.");
			break;

		default:
			alert("Sorry, unknown code.");
	}
};

/*START HorizontalRuler */
EBXDebugTools.horizontalRulerEl = null;
EBXDebugTools.showHorizontalRuler = function() {
	if (EBXDebugTools.horizontalRulerEl === null) {
		EBXDebugTools.horizontalRulerEl = document.createElement("div");
		EBXDebugTools.horizontalRulerEl.style.position = "fixed";
		EBXDebugTools.horizontalRulerEl.style.borderTop = "1px solid black";
		EBXDebugTools.horizontalRulerEl.style.borderBottom = "1px solid black";
		EBXDebugTools.horizontalRulerEl.style.opacity = "0.3";
		EBXDebugTools.horizontalRulerEl.style.height = "1px";
		EBXDebugTools.horizontalRulerEl.style.left = "0";
		EBXDebugTools.horizontalRulerEl.style.width = "100%";
		document.body.appendChild(EBXDebugTools.horizontalRulerEl);
	}

	EBXDebugTools.horizontalRulerEl.style.display = "";

	YAHOO.util.Event.addListener(document.body, "mousemove", EBXDebugTools.horizontalRulerFollowMouse, null, null);
	EBX_Loader.setEscapeKeyListener(EBXDebugTools.hideHorizontalRuler);
};
EBXDebugTools.horizontalRulerFollowMouse = function(event) {
	EBXDebugTools.horizontalRulerEl.style.top = event.clientY - 10 + "px";
};
EBXDebugTools.hideHorizontalRuler = function() {
	EBXDebugTools.horizontalRulerEl.style.display = "none";
	YAHOO.util.Event.removeListener(document.body, "mousemove", EBXDebugTools.horizontalRulerFollowMouse);
	EBX_Loader.removeEscapeKeyListener();
};

EBXDebugTools.toolList.push([ "Horizontal ruler", EBXDebugTools.showHorizontalRuler ]);
/*END HorizontalRuler */

/*START VerticalRuler */
EBXDebugTools.verticalRulerEl = null;
EBXDebugTools.showVerticalRuler = function() {
	if (EBXDebugTools.verticalRulerEl === null) {
		EBXDebugTools.verticalRulerEl = document.createElement("div");
		EBXDebugTools.verticalRulerEl.style.position = "fixed";
		EBXDebugTools.verticalRulerEl.style.borderLeft = "1px solid black";
		EBXDebugTools.verticalRulerEl.style.borderRight = "1px solid black";
		EBXDebugTools.verticalRulerEl.style.opacity = "0.3";
		EBXDebugTools.verticalRulerEl.style.width = "1px";
		EBXDebugTools.verticalRulerEl.style.top = "0";
		EBXDebugTools.verticalRulerEl.style.height = "100%";
		document.body.appendChild(EBXDebugTools.verticalRulerEl);
	}

	EBXDebugTools.verticalRulerEl.style.display = "";

	YAHOO.util.Event.addListener(document.body, "mousemove", EBXDebugTools.verticalRulerFollowMouse, null, null);
	EBX_Loader.setEscapeKeyListener(EBXDebugTools.hideVerticalRuler);
};
EBXDebugTools.verticalRulerFollowMouse = function(event) {
	EBXDebugTools.verticalRulerEl.style.left = event.clientX - 10 + "px";
};
EBXDebugTools.hideVerticalRuler = function() {
	EBXDebugTools.verticalRulerEl.style.display = "none";
	YAHOO.util.Event.removeListener(document.body, "mousemove", EBXDebugTools.verticalRulerFollowMouse);
	EBX_Loader.removeEscapeKeyListener();
};

EBXDebugTools.toolList.push([ "Vertical ruler", EBXDebugTools.showVerticalRuler ]);
/*END VerticalRuler */

/** START debug tools * */

YAHOO.util.Event.onDOMReady(EBXDebugTools.init);
/** END debug tools * */

/** START Constants * */
function EBX_Constants() {

}

EBX_Constants.getRequestLink = function(eventName, parameterMap) {
	var requestLink = EBX_Constants.baseURLForRequest + eventName;

	if (parameterMap !== undefined) {
		var map = parameterMap.getMap();
		for ( var key in map) {
			requestLink += "&" + key + "=" + map[key];
		}
	}
	return requestLink;
};
/** END Constants * */

/** START Map * */

function EBX_Map() {
	this.map = [];

	this.put = function(key, val) {
		this.map[key] = val;
	};

	this.get = function(key) {
		return this.map[key];
	};

	this.getMap = function() {
		return this.map;
	};

	this.isKeyExists = function(key) {
		return this.map[key] !== undefined;
	};
}

/** END Map * */

EBXUtils.invisibleMaskClassName = "ebx_InvisibleMask";
EBXUtils.interactivMaskClassName = "ebx_InteractivMask";

EBXUtils.internalPopupId = "ebx_InternalPopup";
EBXUtils.currentInternalPopup = null;

EBXUtils.isInternalPopup_CloseCallIsMadeByParent = false;
EBXUtils.isInternalPopup_WaitingForChildToCloseMyself = false;

EBXUtils.closeInternalPopupReturnState_OK_closed = 1;
EBXUtils.closeInternalPopupReturnState_KO_blockedByUser = 2;
EBXUtils.closeInternalPopupReturnState_KO_waitingForPageReload = 3;

EBXUtils.openInternalPopup = function(url, width, height, options) {

	var isCentered = true;
	var isDimmed = true;
	var isResizable = true;
	var isCloseButtonDisplayed = true;
	var contextElement = null;

	if (options !== undefined) {

		if (options.contextElement !== undefined) {
			contextElement = options.contextElement;
		}

		// having a context element causes isCenter turned to off
		if (options.isCentered === false || contextElement !== null) {
			isCentered = false;
		}

		// having a isCenter turned to off causes isResizable turned to off
		// because the resize feature is a special-dynamic-mirror-resize-amazing-behavior
		if (options.isResizable === false || isCentered === false) {
			isResizable = false;
		}

		if (options.isDimmed === false) {
			isDimmed = false;
		}

		if (options.isCloseButtonDisplayed === false) {
			isCloseButtonDisplayed = false;
		}
	}

	var constrainToViewport = true, x = null, y = null;
	var setInteractiveMask = false;

	// if one of width or height is not correct, the default value is the Large Size
	if (isNaN(parseInt(width)) || isNaN(parseInt(height))) {
		// large size special configuration
		isResizable = false;
		constrainToViewport = false;
		setInteractiveMask = true;
		isCentered = false;

		var bounds = EBXUtils.getBoundsOfInternalPopupToFitWindow();

		x = bounds.x;
		y = bounds.y;
		width = bounds.width;
		height = bounds.height;

		YAHOO.util.Event.addListener(window, "resize", EBXUtils.autoResizeInternalPopupToFitWindowWithDelay);
	}

	EBXUtils.currentInternalPopup = new YAHOO.widget.Panel(EBXUtils.internalPopupId, {
		visible: false,
		draggable: false,
		fixedcenter: isCentered,
		modal: true,
		close: isCloseButtonDisplayed,
		constraintoviewport: constrainToViewport,
		width: width + "px",
		height: height + "px",
		x: x,
		y: y
	});

	EBXUtils.currentInternalPopup._doClose = function(e) {
		var iframeEl = document.getElementById(this.ebx_iframeId);

		// ask to child iframe to close its internal popup before
		var closeReturnState = null;
		try {
			iframeEl.contentWindow.EBXUtils.isInternalPopup_CloseCallIsMadeByParent = true;
			closeReturnState = iframeEl.contentWindow.EBXUtils.closeInternalPopup();
		} catch (e) {
			closeReturnState = EBXUtils.closeInternalPopupReturnState_OK_closed;
		}
		if (closeReturnState !== EBXUtils.closeInternalPopupReturnState_OK_closed) {
			if (closeReturnState === EBXUtils.closeInternalPopupReturnState_KO_waitingForPageReload) {
				// recursive relay
				EBXUtils.isInternalPopup_WaitingForChildToCloseMyself = true;
			}
			return closeReturnState;
		}

		// check unload before changing the src or destroy the iframe
		var unLoadResult = undefined;
		try {
			unLoadResult = iframeEl.contentWindow.EBX_Loader.onbeforeunload();
		} catch (e) {}
		if (unLoadResult !== undefined) {
			if (confirm(unLoadResult + "\n" + EBX_LocalizedMessage.confirmLine2Popup) === false) {
				return EBXUtils.closeInternalPopupReturnState_KO_blockedByUser;
			}
		}

		// no modifications, or the user wants to discard them
		// so delete the onbeforeunload before unload the iframe
		try {
			iframeEl.contentWindow.onbeforeunload = undefined;
		} catch (e) {}

		// if the iframe has a actionClosePopup, call it
		var actionClosePopup = null;
		try {
			actionClosePopup = iframeEl.contentWindow.EBX_Loader.actionClosePopup;
		} catch (e) {}
		if (actionClosePopup !== null) {
			iframeEl.contentWindow.setTimeout(actionClosePopup, 0);
			// page reload will call parent.EBXUtils.closeInternalPopup() when it will be ready
			// in this case, the current window have an internal popup shall close itself
			// by calling parent.EBXUtils.closeInternalPopup()
			EBXUtils.isInternalPopup_WaitingForChildToCloseMyself = true;
			return EBXUtils.closeInternalPopupReturnState_KO_waitingForPageReload;
		}

		// if the iframe has a urlLogout, navigate on it
		var urlLogout = null;
		try {
			urlLogout = iframeEl.contentWindow.EBX_Loader.urlLogout;
		} catch (e) {}
		if (urlLogout !== null) {
			iframeEl.src = urlLogout;
			// page reload will call parent.EBXUtils.closeInternalPopup() when it will be ready
			// in this case, the current window have an internal popup shall close itself
			// by calling parent.EBXUtils.closeInternalPopup()
			EBXUtils.isInternalPopup_WaitingForChildToCloseMyself = true;
			return EBXUtils.closeInternalPopupReturnState_KO_waitingForPageReload;
		}

		if (e !== undefined) {
			YAHOO.util.Event.preventDefault(e);
		}
		if (EBX_LayoutManager.isIE6) {
			YAHOO.util.Event.removeListener(document.body, "click", EBXUtils.closeInternalPopup);
		}
		YAHOO.util.Event.removeListener(window, "resize", EBXUtils.autoResizeInternalPopupToFitWindowWithDelay);
		this.destroy();

		if (EBXUtils.isInternalPopup_WaitingForChildToCloseMyself === true && EBXUtils.isInternalPopup_CloseCallIsMadeByParent === true) {
			// case when the close of current window was waiting for the refresh of child (or myself)
			parent.EBXUtils.closeInternalPopup();

			// reset value (useful for top window)
			EBXUtils.isInternalPopup_WaitingForChildToCloseMyself = false;
			EBXUtils.isInternalPopup_CloseCallIsMadeByParent = false;
		}

		return EBXUtils.closeInternalPopupReturnState_OK_closed;
	};

	var iframeId = EBXUtils.internalPopupId + "_frame";

	var tmpInnerHTML = [];
	tmpInnerHTML.push("<iframe");
	tmpInnerHTML.push(" id='", iframeId, "'");
	tmpInnerHTML.push(" src='", url, "'");
	tmpInnerHTML.push(" width='100%'");
	tmpInnerHTML.push(" height='100%'");
	tmpInnerHTML.push(" align='middle'");
	tmpInnerHTML.push(" scrolling='auto'");
	tmpInnerHTML.push(" frameborder='0'>");
	tmpInnerHTML.push("</iframe>");
	EBXUtils.currentInternalPopup.setBody(tmpInnerHTML.join(""));

	EBXUtils.currentInternalPopup.ebx_iframeId = iframeId;

	EBXUtils.currentInternalPopup.render(document.body);
	if (contextElement !== null) {
		EBXUtils.currentInternalPopup.cfg.setProperty('context', [ contextElement, 'tl', 'bl' ]);
	}
	EBXUtils.currentInternalPopup.show();

	var mask = document.getElementById(EBXUtils.internalPopupId + "_mask");

	if (isDimmed === false) {
		EBXUtils.addCSSClass(mask, EBXUtils.invisibleMaskClassName);
	}
	if (setInteractiveMask === true) {
		EBXUtils.addCSSClass(mask, EBXUtils.interactivMaskClassName);
	}

	// close when click on back
	YAHOO.util.Event.addListener(mask, "click", EBXUtils.closeInternalPopup, null, null);
	if (EBX_LayoutManager.isIE6) {
		YAHOO.util.Event.addListener(document.body, "click", EBXUtils.closeInternalPopup, null, null);
	}
	mask.title = EBX_LocalizedMessage.innerPopup_returnToThisScreen;

	if (isResizable === true) {
		var resize = new YAHOO.util.Resize(EBXUtils.internalPopupId, {
			handles: [ "br" ],
			useShim: true,
			minHeight: 100,
			minWidth: 200,
			proxy: true
		});
		resize.originalHeight = height;
		resize.originalWidth = width;
		resize.originalLeft = EBXUtils.currentInternalPopup.element.offsetLeft;
		resize.originalTop = EBXUtils.currentInternalPopup.element.offsetTop;

		resize.on("startResize", function(args) {

			var D = YAHOO.util.Dom;

			var clientRegion = D.getClientRegion();
			var elRegion = D.getRegion(this.element);

			resize.set("maxWidth", clientRegion.right - elRegion.left - YAHOO.widget.Overlay.VIEWPORT_OFFSET);
			resize.set("maxHeight", clientRegion.bottom - elRegion.top - YAHOO.widget.Overlay.VIEWPORT_OFFSET);

			resize.set("minWidth", clientRegion.width / 2 - elRegion.left + 100);
			resize.set("minHeight", clientRegion.height / 2 - elRegion.top + 50);
		}, EBXUtils.currentInternalPopup, true);

		resize.on("proxyResize", function(args) {
			var proxy = resize._proxy;
			var panelHeight = args.height;
			var panelWidth = args.width;

			var heightDiff = panelHeight - resize.originalHeight;
			var widthDiff = panelWidth - resize.originalWidth;

			var targetHeight = resize.originalHeight + heightDiff * 2;
			var targetLeft = resize.originalLeft - widthDiff;
			var targetWidth = resize.originalWidth + widthDiff * 2;
			var targetTop = resize.originalTop - heightDiff;

			proxy.style.left = targetLeft + "px";
			proxy.style.top = targetTop + "px";
			proxy.style.width = targetWidth + "px";
			proxy.style.height = targetHeight + "px";
		}, null, true);

		resize.on("endResize", function(args) {
			var panelHeight = args.height;
			var panelWidth = args.width;

			var heightDiff = panelHeight - resize.originalHeight;
			var widthDiff = panelWidth - resize.originalWidth;

			var targetHeight = resize.originalHeight + heightDiff * 2;
			var targetWidth = resize.originalWidth + widthDiff * 2;

			this.cfg.setProperty("height", targetHeight + "px");
			this.cfg.setProperty("width", targetWidth + "px");
			this.moveTo(resize.originalLeft - widthDiff, resize.originalTop - heightDiff);

			args.target.originalHeight = targetHeight;
			args.target.originalWidth = targetWidth;
			args.target.originalLeft = resize.originalLeft - widthDiff;
			args.target.originalTop = resize.originalTop - heightDiff;
		}, EBXUtils.currentInternalPopup, true);
	}
};

EBXUtils.previousResizeInternalPopupTimeout = null;
EBXUtils.InternalPopupResizeDelay = null;
EBXUtils.autoResizeInternalPopupToFitWindowWithDelay = function() {
	if (!EBX_LayoutManager.delayResizeBodyLayout) {
		EBXUtils.autoResizeInternalPopupToFitWindow();
		return;
	}
	if (EBXUtils.InternalPopupResizeDelay === null) {
		EBXUtils.InternalPopupResizeDelay = EBX_LayoutManager.bodyLayoutResizeDelay + 50;
	}

	if (EBXUtils.previousResizeInternalPopupTimeout !== null) {
		window.clearTimeout(EBXUtils.previousResizeInternalPopupTimeout);
	}
	EBXUtils.previousResizeInternalPopupTimeout = window.setTimeout(EBXUtils.autoResizeInternalPopupToFitWindow, EBXUtils.InternalPopupResizeDelay);
};

EBXUtils.autoResizeInternalPopupToFitWindow = function() {
	if (EBXUtils.currentInternalPopup === null || EBXUtils.currentInternalPopup.cfg === null) {
		return;
	}

	var bounds = EBXUtils.getBoundsOfInternalPopupToFitWindow();

	EBXUtils.currentInternalPopup.cfg.setProperty("height", bounds.height + "px");
	EBXUtils.currentInternalPopup.cfg.setProperty("width", bounds.width + "px");
};

EBXUtils.getBoundsOfInternalPopupToFitWindow = function() {
	var bounds = {};

	if (EBX_LayoutManager.isEmbedded()) {
		var workspaceHeader = document.getElementById("ebx_WorkspaceHeader");
		var workspaceHeaderH2 = EBXUtils.getFirstDirectChildMatchingTagName(workspaceHeader, "h2");

		var workspaceHeaderH2Height;
		if (workspaceHeaderH2 !== null) {
			workspaceHeaderH2Height = workspaceHeaderH2.offsetHeight;
		} else {
			// if the title does not exist, set an approximation of H2 usual height
			workspaceHeaderH2Height = 48;
		}

		bounds.width = parseInt(document.body.offsetWidth);
		bounds.height = parseInt(document.body.offsetHeight - workspaceHeaderH2Height);
		bounds.x = 0;
		bounds.y = workspaceHeaderH2Height;
	} else {
		bounds.width = parseInt(document.body.offsetWidth - 20);
		bounds.height = parseInt(document.body.offsetHeight - 50);
		bounds.x = 10;
		bounds.y = 40;
	}

	return bounds;
};

EBXUtils.closeInternalPopup = function() {
	if (EBXUtils.currentInternalPopup !== null && EBXUtils.currentInternalPopup.body !== null) {
		return EBXUtils.currentInternalPopup._doClose();
	}
	return EBXUtils.closeInternalPopupReturnState_OK_closed;
};

EBXUtils.openInternalPopupExportResult = function(url) {
	EBXUtils.openInternalPopup(url, 400, 200, {
		isCloseButtonDisplayed: false
	});
};
EBXUtils.openInternalPopupMediumSize = function(url) {
	EBXUtils.openInternalPopup(url, 600, 350);
};
EBXUtils.openInternalPopupLargeSize = function(url) {
	EBXUtils.openInternalPopup(url, null, null);
};
EBXUtils.openInternalPopupLargeSizeHostedClose = function(url) {
	EBXUtils.openInternalPopup(url, null, null, {
		isCloseButtonDisplayed: false
	});
};
