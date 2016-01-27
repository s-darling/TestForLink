/** ********* START YUI JSON Ajax Tree ********** */
function EBX_AjaxTreesRegister() {}

EBX_AjaxTreesRegister.ebx_AjaxTrees = [];

EBX_AjaxTreesRegister.buildTrees = function() {
	EBX_Loader.changeTaskState(EBX_Loader_taskId_building_trees, EBX_Loader.states.processing);

	for ( var treeName in EBX_AjaxTreesRegister.ebx_AjaxTrees) {
		EBX_AjaxTreesRegister.ebx_AjaxTrees[treeName].init();
	}

	EBX_Loader.changeTaskState(EBX_Loader_taskId_building_trees, EBX_Loader.states.done);
};

EBX_AjaxTreesRegister.createAndRegisterTree = function(treeName, containerDivID, getExpandURLFn, getCollapseURLFn, isRealignEnabled) {
	if (EBX_AjaxTreesRegister.ebx_AjaxTrees[treeName] !== undefined) {
		return;
	}

	var tree = new EBX_AjaxTree(treeName, containerDivID, getExpandURLFn, getCollapseURLFn, isRealignEnabled);
	EBX_AjaxTreesRegister.ebx_AjaxTrees[treeName] = tree;

	// if the task EBX_AjaxTreesRegister.buildTrees is done, init manually the tree
	if (EBX_Loader.getTaskFromId(EBX_Loader_taskId_building_trees).state === EBX_Loader.states.done) {
		tree.init();
	}
};

function ebx_getAjaxTree(treeName) {
	return EBX_AjaxTreesRegister.ebx_AjaxTrees[treeName];
}

function EBX_AjaxTree(ajaxTreeName, treeContainerDivID, getExpandURLFn, getCollapseURLFn, isRealignEnabled) {
	this.treeName = ajaxTreeName;
	this.containerDivID = treeContainerDivID;
	this.getExpandURLFn = getExpandURLFn;
	this.getCollapseURLFn = getCollapseURLFn;
	this.previousScrollLeft = null;
	this.nodeActionDivs = null;
	this.nodeActionDivsNeedsRefresh = true;
	this.isRealignEnabled = isRealignEnabled;
	this.isTheFirstExpand = true;
	this.waitInitMessage = null;

	this.isCleaningChildrenWhileExpanding = false;

	this.init = function() {
		YAHOO.util.Event.onContentReady(this.containerDivID, this.onContentReady, this, true);
	};

	this.onContentReady = function() {
		this.build(null);
	};

	this.build = function(additionalParameters) {
		this.waitInitMessage = document.createElement("div");
		this.waitInitMessage.innerHTML = initTreePleaseWait;
		this.waitInitMessage.className = "ebx_IconAnimWaitBig ebx_InitTreeWait";

		this.yuiTree = new YAHOO.widget.TreeView(this.containerDivID);

		// disable the yui click event (expand/collapse by a click on the line) to let links doing their business
		this.yuiTree.subscribe("clickEvent", EBXUtils.returnFalse);

		this.yuiTree.subscribe("collapse", this.collapseHandler);
		this.yuiTree.subscribe("expand", this.expandHandler);

		this.yuiTree.render();

		var containerDiv = document.getElementById(this.containerDivID);
		containerDiv.appendChild(this.waitInitMessage);

		if (this.isRealignEnabled) {
			YAHOO.util.Event.addListener(this.yuiTree._el.parentNode, "scroll", this.realignNodeActions, null, this);
		}

		this.expandLine(this.yuiTree.getRoot(), additionalParameters);
	};

	this.removeWaitInitMessage = function() {
		if (this.waitInitMessage === null) {
			return;
		}
		this.waitInitMessage.parentNode.removeChild(this.waitInitMessage);
		this.waitInitMessage = null;
	};

	this.collapseHandler = function(node) {
		var ajaxTree = ebx_getAjaxTree(node.data.ebx_treeName);
		if (ajaxTree === null) {
			return false;// cancel collapse
		}

		if (ajaxTree.isCleaningChildrenWhileExpanding === true) {
			return false;// cancel collapse
		}

		ajaxTree.collapseLine(node);
		return true;// allow collapse
	};

	this.expandHandler = function(node) {
		var ajaxTree = ebx_getAjaxTree(node.data.ebx_treeName);
		if (ajaxTree === null) {
			return false;// cancel expand
		}

		ajaxTree.expandLine(node, null);
		return true;// allow expand
	};

	this.realignNodeActions = function(scrollEvent, forceRealign) {

		var currentScrollLeft = this.yuiTree._el.parentNode.scrollLeft;

		if (forceRealign !== true && this.previousScrollLeft !== null) {
			if (currentScrollLeft == this.previousScrollLeft) {
				return;
			}
		}

		var nodeActionDivs = this.getNodeActionDivs();
		var i = nodeActionDivs.length;
		if (EBX_LayoutManager.isIE6) {
			while (i--) {
				nodeActionDivs[i].style.left = this.yuiTree._el.parentNode.clientWidth + currentScrollLeft - (nodeActionDivs[i].clientWidth) + "px";
				nodeActionDivs[i].style.position = "absolute";
			}
		} else {
			while (i--) {
				nodeActionDivs[i].style.right = -currentScrollLeft + "px";
				nodeActionDivs[i].style.position = "absolute";
			}
		}

		this.previousScrollLeft = currentScrollLeft;
	};

	this.getNodeActionDivs = function() {
		if (this.nodeActionDivsNeedsRefresh) {
			this.computeNodeActionDivs();
		}
		return this.nodeActionDivs;
	};

	this.computeNodeActionDivs = function() {
		this.nodeActionDivs = EBXUtils.getRecursiveChildrenMatchingCSSClass(this.yuiTree._el, "ebx_NodeActions");
		this.nodeActionDivsNeedsRefresh = false;
	};

	this.getYuiTree = function() {
		return this.yuiTree;
	};

	this.expandLine = function(node, additionalParameters) {
		if (!this.getExpandURLFn) {
			return;
		}

		var url = this.getExpandURLFn(node);
		if (url === null) {
			return;
		}

		var ajaxExpander = new EBX_AjaxTreeExpander(node, this);
		ajaxExpander.setExpanding();

		if (additionalParameters !== null) {
			ajaxExpander.onExecute(url + additionalParameters);
		} else {
			ajaxExpander.onExecute(url);
		}
		this.nodeActionDivsNeedsRefresh = true;
	};

	this.collapseLine = function(node) {
		if (!this.getCollapseURLFn) {
			return;
		}

		var url = this.getCollapseURLFn(node);
		if (url === null) {
			return;
		}
		var ajaxExpander = new EBX_AjaxTreeExpander(node, this);
		ajaxExpander.setCollapsing();
		ajaxExpander.onExecute(url);

		return true;
	};

	this.setGetExpandURLFn = function(aFunction) {
		this.getExpandURLFn = aFunction;
	};

	this.setGetCollapseURLFn = function(aFunction) {
		this.getCollapseURLFn = aFunction;
	};

	this.getYUINodeById = function(nodeId) {
		for ( var i in this.yuiTree._nodes) {
			if (this.yuiTree._nodes[i].data.id === nodeId) {
				return this.yuiTree._nodes[i];
			}
		}
		return null;
	};

	this.rebuild = function(additionalParameters) {
		this.yuiTree.destroy();
		this.yuiTree = null;
		this.build(additionalParameters);
	};
}

EBX_AjaxTree.referredNodeCssClass = "ebx_ReferredNode";

function ebx_ajaxTreeExpanderStdFunction(node, fnLoadComplete) {
	if (node === null) {
		return;
	}

	var ajaxTree = ebx_getAjaxTree(node.data.ebx_treeName);
	if (ajaxTree === null) {
		return;
	}

	ajaxTree.expandLine(node, null);
	fnLoadComplete();
}

function ebx_ajaxTreeRebuild(treeName) {
	var ajaxTree = ebx_getAjaxTree(treeName);
	if (ajaxTree === null) {
		return;
	}

	ajaxTree.rebuild(null);
}

function ebx_ajaxTreeReplaceChildren(treeName, lineId, additionalParameters) {
	var ajaxTree = ebx_getAjaxTree(treeName);
	if (ajaxTree === null) {
		return;
	}

	var yuiTree = ajaxTree.getYuiTree();
	var parentLine = yuiTree.getNodeByProperty('id', lineId);
	if (parentLine === null) {
		ajaxTree.rebuild(additionalParameters);
		return;
	}

	if (parentLine.isLeaf) {
		alert('parent line is leaf');
		return;
	}

	yuiTree.removeChildren(parentLine);
	ajaxTree.expandLine(parentLine, additionalParameters);
	parentLine.expanded = true;
}

function ebx_ajaxTreeSetReferred(event, yuiNode) {
	var tableEl = EBXUtils.getFirstParentMatchingTagName(yuiNode.getContentEl(), "TABLE");
	EBXUtils.addCSSClass(tableEl, EBX_AjaxTree.referredNodeCssClass);
}

function ebx_ajaxTreeUnsetReferred(event, yuiNode) {
	var tableEl = EBXUtils.getFirstParentMatchingTagName(yuiNode.getContentEl(), "TABLE");
	EBXUtils.removeCSSClass(tableEl, EBX_AjaxTree.referredNodeCssClass);
}

function ebx_ajaxTreeBindCycleNodeToItsParent(lineId, targetLineId, treeName) {
	var line = ebx_getAjaxTree(treeName).getYUINodeById(lineId);
	var targetLine = ebx_getAjaxTree(treeName).getYUINodeById(targetLineId);

	var tableEl = EBXUtils.getFirstParentMatchingTagName(line.getContentEl(), "TABLE");
	YAHOO.util.Event.addListener(tableEl, "mouseover", ebx_ajaxTreeSetReferred, targetLine);
	YAHOO.util.Event.addListener(tableEl, "mouseout", ebx_ajaxTreeUnsetReferred, targetLine);
}

function EBX_AjaxTreeExpander(node, ajaxTree) {
	this.expandedNode = node;
	this.isCollapsing = false;
	this.ajaxTree = ajaxTree;

	this.onGetExceptedResponseCode = function(callerId) {
		if (this.isCollapsing) {
			return this.responseCodeOK_RequestResponse;
		}

		return this.responseCodeOK_JSONDoc;
	};

	this.onExecuteIfOK = function(responseXML, root) {
		var bodyElement = root.getElementsByTagName('responseBody')[0];
		if (!bodyElement.firstChild) {
			EBXLogger.log("EBX_AjaxTreeExpander.onExecuteIfOK: Error getting responseBody from response: " + this.getResponseText(), EBXLogger.error);
			this.ajaxTree.removeWaitInitMessage();
			return false;
		}

		if (this.isCollapsing) {
			this.ajaxTree.removeWaitInitMessage();
			return true;
		}

		var jsonString = bodyElement.firstChild.data;

		var jsonObj = YAHOO.lang.JSON.parse(jsonString);
		if (!jsonObj) {
			EBXLogger.log("EBX_AjaxTreeExpander.onExecuteIfOK: Error getting JSON from response: " + this.getResponseText(), EBXLogger.error);
			this.ajaxTree.removeWaitInitMessage();
			return false;
		}

		/* sometimes tree is void, so no more actions are to do */
		if (jsonObj.data === undefined && jsonObj[0] === undefined) {
			this.expandedNode.setNodesProperty('isLeaf', true, true);
			/* run node script (also buttons will disappear) */
			if (this.expandedNode.data.ebx_scriptToExecute !== undefined) {
				window.setTimeout(this.expandedNode.data.ebx_scriptToExecute, 0);
			}
			this.ajaxTree.removeWaitInitMessage();
			return true;
		}

		var treeNameAtt = root.attributes.getNamedItem('treeName');
		if (treeNameAtt !== null) {
			var treeName = treeNameAtt.nodeValue;
			if (treeName != this.ajaxTree.treeName) {
				EBXLogger.log('EBX_AjaxTreeExpander.onExecuteIfOK: Received response is not for current tree [' + this.ajaxTree.treeName
						+ '] but for [' + treeName + '].', EBXLogger.error);
				this.ajaxTree.removeWaitInitMessage();
				return false;
			}
		}

		var callerIdAtt = root.attributes.getNamedItem('callerId');
		if (callerIdAtt !== null) {
			var callerId = callerIdAtt.nodeValue;
			if (callerId != this.expandedNode.data.id) {
				EBXLogger.log('EBX_AjaxTreeExpander.onExecuteIfOK: Received response is not for current element [' + this.expandedNode.data.id
						+ '] but for caller [' + callerId + '].', EBXLogger.error);
				this.ajaxTree.removeWaitInitMessage();
				return false;
			}
		}

		// remove children
		this.ajaxTree.isCleaningChildrenWhileExpanding = true;// to prevent collapse event during removeChildren()
		var yuiTree = this.ajaxTree.getYuiTree();
		yuiTree.removeChildren(this.expandedNode);
		this.ajaxTree.isCleaningChildrenWhileExpanding = false;// restore initial state

		if (this.expandedNode.isLeaf) {
			this.expandedNode.setNodesProperty('isLeaf', false, true);
			this.expandedNode.setNodesProperty('expanded', true, true);
		}

		var scriptToExecute = "";
		if (this.expandedNode.data.ebx_scriptToExecute !== undefined) {
			scriptToExecute += this.expandedNode.data.ebx_scriptToExecute;
		}

		if (YAHOO.lang.isArray(jsonObj)) {
			for ( var i = 0, j = jsonObj.length; i < j; i++) {
				scriptToExecute += this.ebx_recursivlyAppendNodesToParent(jsonObj[i], this.expandedNode);
			}
		} else {
			scriptToExecute += this.ebx_recursivlyAppendNodesToParent(jsonObj, this.expandedNode);
		}
		this.expandedNode.refresh();

		/* run embedded script */
		window.setTimeout(scriptToExecute, 0);

		this.expandedNode.showChildren();

		if (this.ajaxTree.isTheFirstExpand) {
			this.focusTheSelectedNode();
			this.ajaxTree.isTheFirstExpand = false;
		}

		if (this.ajaxTree.isRealignEnabled) {
			this.ajaxTree.realignNodeActions(null, true);
		}

		this.ajaxTree.removeWaitInitMessage();

		return true;
	};

	this.ebx_recursivlyAppendNodesToParent = function(jsonNode, parentNode) {
		var hasChildren = jsonNode.children !== undefined && jsonNode.children.length > 0;
		var newNode = new YAHOO.widget.HTMLNode(jsonNode.data, parentNode, hasChildren);

		var scriptToExecute = "";
		if (jsonNode.data.ebx_scriptToExecute !== undefined) {
			scriptToExecute += jsonNode.data.ebx_scriptToExecute;
		}

		if (!hasChildren) {
			newNode.setDynamicLoad(ebx_ajaxTreeExpanderStdFunction, 0);
		} else {
			for ( var i = 0; i < jsonNode.children.length; i++) {
				scriptToExecute += this.ebx_recursivlyAppendNodesToParent(jsonNode.children[i], newNode);
			}
		}
		return scriptToExecute;
	};

	this.focusTheSelectedNode = function() {
		var containerEl = document.getElementById(this.ajaxTree.containerDivID);

		var selectedTableEl = EBXUtils.getFirstRecursiveChildMatchingCSSClass(containerEl, "ebx_Selected");
		if (selectedTableEl === null) {
			return;
		}

		/*
		 var layoutUnitParentEl = EBXUtils.getFirstParentMatchingCSSClass(containerEl, "yui-layout-unit");

		 if (EBXUtils.matchCSSClass(layoutUnitParentEl, "yui-layout-scroll") === false) {
		 return;
		 }

		 var layoutBodyParentEl = EBXUtils.getFirstRecursiveChildMatchingCSSClass(layoutUnitParentEl, "yui-layout-bd");

		 var scrollTop = selectedTableEl.offsetTop - layoutBodyParentEl.offsetHeight / 2 + selectedTableEl.offsetHeight / 2;

		 layoutBodyParentEl.scrollTop = scrollTop;
		 */
		var scrollingPane = EBXUtils.getFirstParentMatchingCSSClass(containerEl, "ebx_ScrollingPane");
		if (scrollingPane === null) {
			var yuiScrollingPaneParent = EBXUtils.getFirstParentMatchingCSSClass(containerEl, "yui-layout-scroll");
			if (yuiScrollingPaneParent === null) {
				return;
			}
			scrollingPane = EBXUtils.getFirstRecursiveChildMatchingCSSClass(yuiScrollingPaneParent, "yui-layout-bd");
			if (scrollingPane === null) {
				return;
			}
		}

		var scrollTop = selectedTableEl.offsetTop - scrollingPane.offsetHeight / 2 + selectedTableEl.offsetHeight / 2;

		scrollingPane.scrollTop = scrollTop;
	};

	this.onExecuteIfKO = function(responseXML) {
		this.ajaxTree.removeWaitInitMessage();
	};

	this.setCollapsing = function() {
		this.isCollapsing = true;
	};

	this.setExpanding = function() {
		this.isCollapsing = false;
	};
}

EBX_AjaxTreeExpander.prototype = new EBX_AbstractAjaxResponseManager();

function ebx_defaultEndLoadingFn() {

}

/** ********* END YUI JSON Ajax Tree ********** */

/** ********* START Specifics implementations ********* */

/** ********** START InstanceContentTree *************** */
function ebx_startNewInstanceContentTree(treeName, containerDivID) {
	var getExpandURLFn = function(node) {
		var url = EBX_Constants.getRequestLink(EBX_Constants.instanceContentTreeExpandEvent);
		if (node !== null) {
			if (node.data.isHriNode !== undefined && node.data.isHriNode === "true") {
				url += "&" + EBX_Constants.hierarchyNodePath + "=" + node.data.id;
			} else {
				url += "&" + EBX_Constants.nodePath + "=";
				if (!node.isRoot()) {
					url += node.data.id;
				}
			}
		}
		return url;
	};

	var getCollapseURLFn = null;
	EBX_AjaxTreesRegister.createAndRegisterTree(treeName, containerDivID, getExpandURLFn, getCollapseURLFn, false);
}

function ebx_navigationTreeReplaceNodeChildrenBy(treeName, parentLineId, selectedNodeIndexInTree) {
	var tree = ebx_getAjaxTree(treeName);
	if (tree === null) {
		return;
	}
	var yuiTree = tree.getYuiTree();
	var parentLine = yuiTree.getNodeByProperty('id', parentLineId);
	if (parentLine === null) {
		return;
	}
	if (!parentLine.isLeaf) {
		yuiTree.removeChildren(parentLine);
	}
	parentLine.setNodesProperty("selectedNodeIndexInTree", selectedNodeIndexInTree);
	if (EBXUtils.matchCSSClass(parentLine, 'ebx_Selected')) {
		EBXUtils.removeCSSClass(parentLine, 'ebx_Selected');
		parentLine.refresh();
		yuiTree.render();
	}
	tree.expandLine(parentLine, null);
	parentLine.expanded = true;
}

/** ********** END InstanceContentTree *************** */

/** ********** START Hierarchy *************** */
function ebx_startNewHierarchyTree(treeName, containerDivID) {
	var getExpandURLFn = function(node) {
		if (node === null || node.data.id === undefined) {
			return EBX_Constants.getRequestLink(EBX_Constants.hierarchyExpandEvent);
		}

		var params = new EBX_Map();
		params.put(EBX_Constants.ajaxTreeLineIndex, node.data.id);

		return EBX_Constants.getRequestLink(EBX_Constants.hierarchyExpandEvent, params);
	};

	var getCollapseURLFn = function(node) {
		if (node === null || node.data.id === undefined) {
			return null;
		}

		var params = new EBX_Map();
		params.put(EBX_Constants.ajaxTreeLineIndex, node.data.id);

		return EBX_Constants.getRequestLink(EBX_Constants.hierarchyCollapseEvent, params);
	};

	EBX_AjaxTreesRegister.createAndRegisterTree(treeName, containerDivID, getExpandURLFn, getCollapseURLFn, true);
}

/** ********** END Hierarchy *************** */

/** ********** START Home tree *************** */
function ebx_startNewHomeTree(treeName, containerDivID) {
	var getExpandURLFn = function(node) {
		if (node === null || node.data.id === undefined) {
			return EBX_Constants.getRequestLink(EBX_Constants.homeTreeExpandEvent);
		}

		var params = new EBX_Map();
		params.put(EBX_Constants.ajaxTreeLineIndex, node.data.id);

		return EBX_Constants.getRequestLink(EBX_Constants.homeTreeExpandEvent, params);
	};

	var getCollapseURLFn = function(node) {
		var params = new EBX_Map();
		params.put(EBX_Constants.ajaxTreeLineIndex, node.data.id);

		return EBX_Constants.getRequestLink(EBX_Constants.homeTreeCollapseEvent, params);
	};

	EBX_AjaxTreesRegister.createAndRegisterTree(treeName, containerDivID, getExpandURLFn, getCollapseURLFn, false);
}

/** ********** END Home tree *************** */

/** ********** START DMA navigation tree *************** */
function ebx_startNewDataModelTree(treeName, containerDivID) {
	var getExpandURLFn = function(node) {
		if (node === null || node.data.id === undefined) {
			return EBX_Constants.getRequestLink(EBX_Constants.dmaTreeExpandEvent);
		}

		var params = new EBX_Map();
		params.put(EBX_Constants.ajaxTreeLineIndex, node.data.id);

		return EBX_Constants.getRequestLink(EBX_Constants.dmaTreeExpandEvent, params);
	};

	var getCollapseURLFn = function(node) {
		var params = new EBX_Map();
		params.put(EBX_Constants.ajaxTreeLineIndex, node.data.id);

		return EBX_Constants.getRequestLink(EBX_Constants.dmaTreeCollapseEvent, params);
	};

	EBX_AjaxTreesRegister.createAndRegisterTree(treeName, containerDivID, getExpandURLFn, getCollapseURLFn, false);
}

/** ********** END DMA tree *************** */

/** ********** START Predicate editor tree *************** */
function ebx_startNewPredicateTree(treeName, containerDivID) {
	var getExpandURLFn = function(node) {
		var params = new EBX_Map();
		params.put(EBX_Constants.ajaxTreeName, this.treeName);
		params.put(EBX_Constants.ajaxTreeContainer, this.containerDivID);

		if (node === null || node.data.id === undefined) {
			return EBX_Constants.getRequestLink(EBX_Constants.predicateTreeExpandEvent, params);
		}

		params.put(EBX_Constants.ajaxTreeLineIndex, node.data.id);

		return EBX_Constants.getRequestLink(EBX_Constants.predicateTreeExpandEvent, params);
	};

	var getCollapseURLFn = null;

	EBX_AjaxTreesRegister.createAndRegisterTree(treeName, containerDivID, getExpandURLFn, getCollapseURLFn, false);
}

/** ********** END Predicate editor tree *************** */

/** ********** START tabular view column configuration tree *************** */
function ebx_startNewTabularViewColumnConfigurator(treeName, containerDivID) {
	var getExpandURLFn = function(node) {
		if (node === null || node.data.id === undefined) {
			return EBX_Constants.getRequestLink(EBX_Constants.tabularViewColumnConfiguratorExpandEvent);
		}

		var params = new EBX_Map();
		params.put(EBX_Constants.ajaxTreeLineIndex, node.data.id);

		return EBX_Constants.getRequestLink(EBX_Constants.tabularViewColumnConfiguratorExpandEvent, params);
	};

	var getCollapseURLFn = function(node) {
		if (node === null || node.data.id === undefined) {
			return null;
		}

		var params = new EBX_Map();
		params.put(EBX_Constants.ajaxTreeLineIndex, node.data.id);

		return EBX_Constants.getRequestLink(EBX_Constants.tabularViewColumnConfiguratorCollapseEvent, params);
	};

	EBX_AjaxTreesRegister.createAndRegisterTree(treeName, containerDivID, getExpandURLFn, getCollapseURLFn, false);
}

/** ********** END tabular view column configuration tree *************** */

/** ********** START hierarchy dimension tree *************** */
function ebx_startNewHierarchyDimensionTree(treeName, containerDivID) {
	var getExpandURLFn = function(node) {
		if (node === null || node.data.id === undefined) {
			return EBX_Constants.getRequestLink(EBX_Constants.dimensionTreeExpand);
		}

		var params = new EBX_Map();
		params.put(EBX_Constants.ajaxTreeLineIndex, node.data.id);

		return EBX_Constants.getRequestLink(EBX_Constants.dimensionTreeExpand, params);
	};

	var getCollapseURLFn = null;

	EBX_AjaxTreesRegister.createAndRegisterTree(treeName, containerDivID, getExpandURLFn, getCollapseURLFn, false);
}

/** ********** END hierarchy dimension tree *************** */

/** ********** START Modal selector tree *************** */

function ebx_displayYUITreeFromMarkup(callerFn, arg, obj) {
	var treeEl = document.getElementById(obj.treeDivId);
	if (treeEl) {
		var tree = new YAHOO.widget.TreeView(treeEl.id);
		tree.subscribe("clickEvent", EBXUtils.returnFalse);
		tree.render();
	}
	if (obj.fn !== undefined) {
		obj.fn.call();
	}
}

function ebx_DisplaySelectorPanelTree() {
	ebx_displayYUITreeFromMarkup(null, null, {
		treeDivId: "ebx_SelectorPanelTree"
	});
}

ebx_SelectorPane = null;
function ebx_getSelectorPanel() {
	if (ebx_SelectorPane === null) {
		ebx_SelectorPane = new YAHOO.widget.Panel("ebx_SelectorPanel", {
			draggable: false,
			visible: false,
			modal: true
		});
		ebx_SelectorPane.innerElement.innerHTML = "<div id=\"ebx_SelectorPanelContent\" class=\"bd\"></div><div class=\"ebx_Knob\"></div>";
		ebx_SelectorPane.render(document.body);
		YAHOO.util.Event.on("ebx_SelectorPanel_mask", "click", function() {
			ebx_SelectorPane.hide();
		});
		EBX_LayoutManager.bodyLayout.addListener("resize", EBX_LayoutManager.autoresizeSelectorPanelTree);
		ebx_SelectorPane.showEvent.subscribe(EBX_LayoutManager.autoresizeSelectorPanelTree, null);
	}
	return ebx_SelectorPane;
}

function ebx_AjaxSelectorObject() {
	this.onExecuteIfOK = function(responseXML, root) {
		var responseBody = root.getElementsByTagName('responseBody')[0];
		var targetName = responseBody.attributes.getNamedItem('targetName').nodeValue;
		var responseContent = responseBody.firstChild.data;
		if (document.getElementById(targetName)) {
			document.getElementById(targetName).innerHTML = responseContent;
			var contextButton = document.getElementById(this.contextButtonId);
			var parentNavigationHeader = EBXUtils.getFirstParentMatchingTagName(contextButton, 'H2');
			var selectorPanel = ebx_getSelectorPanel();
			selectorPanel.cfg.setProperty('context', [ parentNavigationHeader, 'tl', 'bl' ]);
			selectorPanel.show();
			if (EBX_LayoutManager.isHeaderPaneDisplayed() === true) {
				document.getElementById("ebx_SelectorPanel_mask").style.marginTop = "40px";
			} else {
				document.getElementById("ebx_SelectorPanel_mask").style.marginTop = "0";
			}
			ebx_DisplaySelectorPanelTree();
		}
		return true;
	};

	this.onExecuteIfKO = function(responseXML) {
		return;
	};

	this.onGetExceptedResponseCode = function(callerId) {
		return this.responseCodeOK_RequestResponse;
	};

	this.onSetContextButtonId = function(buttonId) {
		// load Selector pane
		ebx_getSelectorPanel();
		this.contextButtonId = buttonId;
	};
}

ebx_AjaxSelectorObject.prototype = new EBX_AbstractAjaxResponseManager();

/** ********** END Modal selector tree *************** */

/** ********** DMA navigation tree ******************* */
function ebx_DMANavigationTree_expandAll(treeName, nodeId) {
	ebx_ajaxTreeReplaceChildren(treeName, nodeId, '&navigationTree_expandAll=true');
}

function ebx_DMANavigationTree_collapseAll(treeName, nodeId) {
	var tree = ebx_getAjaxTree(treeName);
	var yuiTree = tree.getYuiTree();
	var node = yuiTree.getNodeByProperty('id', nodeId);
	ebx_DMANavigationTree_collapseRecursively(node);
}

function ebx_DMANavigationTree_collapseRecursively(node) {
	var hasChildren = node.children !== undefined && node.children.length > 0;
	if (!hasChildren) {
		return;
	} else {
		for ( var i = 0; i < node.children.length; i++) {
			ebx_DMANavigationTree_collapseRecursively(node.children[i]);
		}
	}
	node.collapse();
}
/** ********* END Specifics implementations ********* */
