function EBX_Table() {}

EBX_Table_State = function(className) {
	this.className = className;
};
EBX_Table_State.NORMAL = new EBX_Table_State("tvStateNormal");
EBX_Table_State.EMPTY = new EBX_Table_State("tvStateEmpty");
EBX_Table_State.ERROR = new EBX_Table_State("tvStateError");
EBX_Table_State.LOADING = new EBX_Table_State("tvStateLoading");
EBX_Table_State.LOGOUT = new EBX_Table_State("tvStateLogout");

EBX_Table.messages = {};
EBX_Table.constants = {};

EBX_Table.AjaxTableRegister = [];

EBX_Table.workspaceTableMarginLeft = 15;
EBX_Table.workspaceTableWithFilterPaneMarginLeft = 5;

EBX_Table.minWidth = 200;
EBX_Table.minHeight = 50;

EBX_Table.heightBelowTableIsSmall = 100;

EBX_Table.lineMinHeight = 23;
EBX_Table.mainContainerMinWidth = 100;

EBX_Table.securityTimeoutForHideResizeBar = 1000;

EBX_Table.syncScrollLockDuration = 10;

EBX_Table.statusColumnWidth = 25;

/* 10(padding-left) + 10(padding-right) + 1(border-right) */
EBX_Table.minWidthColumn = 21;

EBX_Table.minWidthIssueGap = null;
EBX_Table.initBrowsersGaps = function() {
	if (EBX_Table.minWidthIssueGap !== null) {
		return;
	}
	EBX_Table.minWidthIssueGap = 0;
	/* see https://bugzilla.mozilla.org/show_bug.cgi?id=308801 */
	if (EBX_LayoutManager.browser.toLowerCase() === "firefox" && EBX_LayoutManager.browserMajorVersion < 17) {
		EBX_Table.minWidthIssueGap = -EBX_Table.minWidthColumn;
	}
};

EBX_Table.compiledStateIndexInResultLine = 0;
EBX_Table.keyIndexInResultLine = 1;
EBX_Table.formattedPKIndexInResultLine = 2;
EBX_Table.firstColumnContentIndexInResultLine = 3;

EBX_Table.compiledRowStateIndexSelected = 0;
EBX_Table.compiledRowStateIndexSeverity = 1;
EBX_Table.compiledRowStateIndexInheritance = 2;

EBX_Table.compiledRowStateSelected = "1";

EBX_Table.inheritCellFlagValue = 1;

EBX_Table.maxIntPowerForBitwiseOperation = 31;

EBX_Table.createAndRegisterTable = function(ajaxTableName, tableColumnDefs, config) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] !== undefined) {
		return;
	}

	var table = new EBX_Table.ebx_ajaxTable(ajaxTableName, tableColumnDefs, config);

	table.init();

	EBX_Table.AjaxTableRegister[ajaxTableName] = table;
};

EBX_Table.formWorkspaceResizeListenerEnabled = false;
EBX_Table.tablesListeningWorkspaceResize = [];
EBX_Table.tablesNeedToBeSmallWithOthersToComputeWidthListeningWorkspaceResize = [];
EBX_Table.enableFormWorkspaceResizeListener = function(ajaxTable, isNeedToBeSmallWithOthersToComputeWidth) {

	// plug the main table WorkspaceResizeListener once
	if (EBX_Table.formWorkspaceResizeListenerEnabled === false) {
		EBX_LayoutManager.resizeWorkspaceListeners.push(EBX_Table.formWorkspaceResizeListener);
		EBX_Table.formWorkspaceResizeListenerEnabled = true;
	}

	if (isNeedToBeSmallWithOthersToComputeWidth === true) {
		EBX_Table.tablesNeedToBeSmallWithOthersToComputeWidthListeningWorkspaceResize.push(ajaxTable);
	} else {
		EBX_Table.tablesListeningWorkspaceResize.push(ajaxTable);
	}

	// if the size has already been computed
	if (EBX_LayoutManager.lastWorkspaceSizeComputed !== null) {
		// even for the tables which NeedToBeSmallWithOthersToComputeWidth, the first resize does not need to be small
		ajaxTable.formWorkspaceResizeListener(EBX_LayoutManager.lastWorkspaceSizeComputed);
	}
	// else the workspace will raise the resize listener at least once
};
EBX_Table.formWorkspaceResizeListener = function(size) {
	var i;
	for (i = EBX_Table.tablesListeningWorkspaceResize.length - 1; i >= 0; i--) {
		EBX_Table.tablesListeningWorkspaceResize[i].formWorkspaceResizeListener(size);
	}

	/// be small
	for (i = EBX_Table.tablesNeedToBeSmallWithOthersToComputeWidthListeningWorkspaceResize.length - 1; i >= 0; i--) {
		EBX_Table.tablesNeedToBeSmallWithOthersToComputeWidthListeningWorkspaceResize[i].prepareTableToAutoWidth();
	}
	// compute available width and resize
	for (i = EBX_Table.tablesNeedToBeSmallWithOthersToComputeWidthListeningWorkspaceResize.length - 1; i >= 0; i--) {
		EBX_Table.tablesNeedToBeSmallWithOthersToComputeWidthListeningWorkspaceResize[i].formWorkspaceResizeListener(size);
	}
};

EBX_Table.initDisplay = function(ajaxTableName) {
	EBX_Table.AjaxTableRegister[ajaxTableName].initDisplay();
};

EBX_Table.resize = function(ajaxTableName, width, height) {
	EBX_Table.AjaxTableRegister[ajaxTableName].resize(width, height);
};

EBX_Table.fillRemainingLinesAndLaunchSynchronizeRemainingLines = function(ajaxTableName) {
	EBX_Table.AjaxTableRegister[ajaxTableName].fillRemainingLinesAndLaunchSynchronizeRemainingLines();
};
EBX_Table.synchronizeVisibleLinesHeightAndLaunchFillRemainingLines = function(ajaxTableName) {
	EBX_Table.AjaxTableRegister[ajaxTableName].synchronizeVisibleLinesHeightAndLaunchFillRemainingLines();
};
EBX_Table.synchronizeRemainingLinesHeight = function(ajaxTableName) {
	EBX_Table.AjaxTableRegister[ajaxTableName].synchronizeRemainingLinesHeight();
};
EBX_Table.hideResizeBar = function(ajaxTableName) {
	EBX_Table.AjaxTableRegister[ajaxTableName].hideResizeBar();
};
EBX_Table.clearSyncScrollFlags = function(ajaxTableName) {
	EBX_Table.AjaxTableRegister[ajaxTableName].lastSyncScrollWasFromMain = false;
	EBX_Table.AjaxTableRegister[ajaxTableName].lastSyncScrollWasFromFixed = false;
};

EBX_Table.buttonOpenRegister = [];
EBX_Table.registerOpenButton = function(ajaxTableName, openButtonId) {
	if (EBX_Table.buttonOpenRegister[ajaxTableName] === undefined) {
		EBX_Table.buttonOpenRegister[ajaxTableName] = [];
	}
	EBX_Table.buttonOpenRegister[ajaxTableName].push(openButtonId);
};

EBX_Table.buttonFirstRegister = [];
EBX_Table.registerFirstButton = function(ajaxTableName, firstButtonId) {
	if (EBX_Table.buttonFirstRegister[ajaxTableName] === undefined) {
		EBX_Table.buttonFirstRegister[ajaxTableName] = [];
	}
	EBX_Table.buttonFirstRegister[ajaxTableName].push(firstButtonId);
};

EBX_Table.buttonPreviousRegister = [];
EBX_Table.registerPreviousButton = function(ajaxTableName, previousButtonId) {
	if (EBX_Table.buttonPreviousRegister[ajaxTableName] === undefined) {
		EBX_Table.buttonPreviousRegister[ajaxTableName] = [];
	}
	EBX_Table.buttonPreviousRegister[ajaxTableName].push(previousButtonId);
};

EBX_Table.buttonNextRegister = [];
EBX_Table.registerNextButton = function(ajaxTableName, nextButtonId) {
	if (EBX_Table.buttonNextRegister[ajaxTableName] === undefined) {
		EBX_Table.buttonNextRegister[ajaxTableName] = [];
	}
	EBX_Table.buttonNextRegister[ajaxTableName].push(nextButtonId);
};

EBX_Table.buttonLastRegister = [];
EBX_Table.registerLastButton = function(ajaxTableName, lastButtonId) {
	if (EBX_Table.buttonLastRegister[ajaxTableName] === undefined) {
		EBX_Table.buttonLastRegister[ajaxTableName] = [];
	}
	EBX_Table.buttonLastRegister[ajaxTableName].push(lastButtonId);
};

EBX_Table.pageReportRegister = [];
EBX_Table.registerPageReport = function(ajaxTableName, pageReportId) {
	if (EBX_Table.pageReportRegister[ajaxTableName] === undefined) {
		EBX_Table.pageReportRegister[ajaxTableName] = [];
	}
	EBX_Table.pageReportRegister[ajaxTableName].push(pageReportId);
};

EBX_Table.selectReportRegister = [];
EBX_Table.registerSelectReport = function(ajaxTableName, selectReportId) {
	if (EBX_Table.selectReportRegister[ajaxTableName] === undefined) {
		EBX_Table.selectReportRegister[ajaxTableName] = [];
	}
	EBX_Table.selectReportRegister[ajaxTableName].push(selectReportId);
};

/**
 * Ready to be public API
 */
EBX_Table.gotoFirstPage = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.gotoFirstPage: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	EBX_Table.AjaxTableRegister[ajaxTableName].gotoFirstPage();
};

/**
 * Ready to be public API
 */
EBX_Table.gotoPreviousPage = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.gotoPreviousPage: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	EBX_Table.AjaxTableRegister[ajaxTableName].gotoPreviousPage();
};

/**
 * Ready to be public API
 */
EBX_Table.gotoNextPage = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.gotoNextPage: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	EBX_Table.AjaxTableRegister[ajaxTableName].gotoNextPage();
};

/**
 * Ready to be public API
 */
EBX_Table.gotoLastPage = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.gotoLastPage: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	EBX_Table.AjaxTableRegister[ajaxTableName].gotoLastPage();
};

EBX_Table.selectCurrentPage = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.selectCurrentPage: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	EBX_Table.AjaxTableRegister[ajaxTableName].selectCurrentPage();
};

EBX_Table.selectAllRecords = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.selectAllRecords: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	EBX_Table.AjaxTableRegister[ajaxTableName].selectAllRecords();
};

EBX_Table.unselectAllRecords = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.unselectAllRecords: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	EBX_Table.AjaxTableRegister[ajaxTableName].unselectAllRecords();
};

EBX_Table.openCurrentFocusedRecord = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.openCurrentFocusedRecord: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	EBX_Table.AjaxTableRegister[ajaxTableName].openCurrentFocusedRecord();
};

EBX_Table.setNewPageSize = function(ajaxTableName, newPageSize, buttonID, optionIndex) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.selectCurrentPage: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	EBX_Table.AjaxTableRegister[ajaxTableName].sendRequestSetTablePageSize(newPageSize, buttonID, optionIndex);
};
/**
 * Ready to be public API
 */
EBX_Table.refreshCurrentPage = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.refreshCurrentPage: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	EBX_Table.AjaxTableRegister[ajaxTableName].refreshCurrentPage();
};

/**
 * Ready to be public API
 */
EBX_Table.getSelectedRecordsNumber = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.getSelectedRecordsNumber: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	return EBX_Table.AjaxTableRegister[ajaxTableName].currentResponse.meta.selectedNumber;
};

/**
 * Ready to be public API
 */
EBX_Table.hasPreviousPage = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.hasPreviousPage: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	return EBX_Table.AjaxTableRegister[ajaxTableName].currentResponse.meta.hasPreviousPage;
};

/**
 * Ready to be public API
 */
EBX_Table.hasNextPage = function(ajaxTableName) {
	if (EBX_Table.AjaxTableRegister[ajaxTableName] === undefined) {
		EBXLogger.log("EBX_Table.hasNextPage: Table with name \"" + ajaxTableName + "\" is not registered.", EBXLogger.error);
		return;
	}

	return EBX_Table.AjaxTableRegister[ajaxTableName].currentResponse.meta.hasNextPage;
};

EBX_Table.CLASS_WAITING_ROW_FOR_SELECTION = "ebx_WaitingForSelection";
EBX_Table.CLASS_WAITING_CURRENT_PAGE_FOR_SELECTION = "ebx_WaitingForSelection";

EBX_Table.dataSourceFetchResponseSchema = {
	resultsList: "records",
	metaFields: {
		hasNextPage: "hasNextPage",
		hasPreviousPage: "hasPreviousPage",
		pageReport: "pageReport",
		selectedNumber: "selectedNumber",
		scriptToExecute: "scriptToExecute",
		sortState: "sortState",
		highestSeverity: "highestSeverity",
		currentTablePageId: "currentTablePageId"
	}
};

EBX_Table.dataSourceSetTablePageSizeResponseSchema = {
	resultsList: "messages",
	fields: [ {
		key: "message"
	}, {
		key: "severity"
	} ]
};

EBX_Table.dataSourceSetInheritedResponseSchema = {
	resultsList: "messages",
	fields: [ {
		key: "message"
	}, {
		key: "severity"
	} ]
};

EBX_Table.dataSourceSelectionResponseSchema = {
	resultsList: "rowsToUpdate",
	metaFields: {
		selectedNumber: "selectedNumber"
	}
};

/* When the table is loaded, state normal, but not yet ready:
 * the line height sync is running and the cell's JS from server is not yet invoked */
EBX_Table.almostReadyCSSClass = "tvAlmostReady";

EBX_Table.sortFlagCSSClass = "ebx_SortFlag";
EBX_Table.sortFlagAscCSSClass = "ebx_SortFlagAsc";
EBX_Table.sortFlagDescCSSClass = "ebx_SortFlagDesc";
EBX_Table.sortNumberCSSClass = "ebx_SortNumber";

EBX_Table.ebx_ajaxTable = function(ajaxTableName, tableColumnDefs, config) {
	this.tableName = ajaxTableName;
	this.containerId = ajaxTableName + "_container";
	this.headerContainerId = ajaxTableName + "_headerContainer";
	this.headerFixedContainerId = ajaxTableName + "_headerFixedContainer";
	this.headerMainContainerWrapperId = ajaxTableName + "_headerMainContainerWrapper";
	this.headerMainContainerId = ajaxTableName + "_headerMainContainer";
	this.fixedScrollerWrapperId = ajaxTableName + "_fixedScrollerWrapper";
	this.fixedScrollerId = ajaxTableName + "_fixedScroller";
	this.mainScrollerId = ajaxTableName + "_mainScroller";
	this.selectCurrentPageId = ajaxTableName + "_selectCurrentPage";
	this.columnDefs = tableColumnDefs;
	this.isSelectColumnEnabled = config.isSelectColumnEnabled === true;
	this.isOpenRecordEnabled = config.isOpenRecordEnabled === true;
	this.isOpenRecordSimpleClick = config.isOpenRecordSimpleClick === true;
	this.isWorkspaceTable = config.isWorkspaceTable === true;
	this.containerCSSClasses = config.containerCSSClasses;
	this.isOpenInPopup = config.isOpenInPopup === true;
	this.openInPopupURL = config.openInPopupURL;

	this.state = EBX_Table_State.LOADING;

	this.lastLineSelectedIndex = null;

	this.linesHeightsSum = 0;

	this.currentRowFocusedIndex = null;

	this.isTableInit = false;
	this.functionsToCallWhenTableIsInit = [];

	this.isTableReady = false;
	this.functionsToCallWhenTableIsReady = [];

	this.sizeToUseWhenTableIsInit = null;

	this.isAutoHeight = false;

	this.init = function() {
		EBX_Table.initBrowsersGaps();

		this.dataSourceFetch = new YAHOO.util.XHRDataSource(EBX_Table.constants.fetchRequest);
		this.dataSourceFetch.responseType = YAHOO.util.DataSource.TYPE_JSON;
		this.dataSourceFetch.responseSchema = EBX_Table.dataSourceFetchResponseSchema;

		this.dataSourceSetTablePageSize = new YAHOO.util.XHRDataSource(EBX_Table.constants.setTablePageSizeRequest);
		this.dataSourceSetTablePageSize.responseType = YAHOO.util.DataSource.TYPE_JSON;
		this.dataSourceSetTablePageSize.responseSchema = EBX_Table.dataSourceSetTablePageSizeResponseSchema;

		this.dataSourceSetInherited = new YAHOO.util.XHRDataSource(EBX_Table.constants.rowInheritRequest);
		this.dataSourceSetInherited.responseType = YAHOO.util.DataSource.TYPE_JSON;
		this.dataSourceSetInherited.responseSchema = EBX_Table.dataSourceSetInheritedResponseSchema;

		this.dataSourceSetOverwritten = new YAHOO.util.XHRDataSource(EBX_Table.constants.rowOverwriteRequest);
		this.dataSourceSetOverwritten.responseType = YAHOO.util.DataSource.TYPE_JSON;
		this.dataSourceSetOverwritten.responseSchema = EBX_Table.dataSourceSetInheritedResponseSchema;

		this.dataSourceSetOcculted = new YAHOO.util.XHRDataSource(EBX_Table.constants.rowDeleteRequest);
		this.dataSourceSetOcculted.responseType = YAHOO.util.DataSource.TYPE_JSON;
		this.dataSourceSetOcculted.responseSchema = EBX_Table.dataSourceSetInheritedResponseSchema;

		if (this.isWorkspaceTable === true) {
			YAHOO.util.Event.onContentReady(this.containerId, this.initDisplay, this, true);
		} else {
			EBX_Form.launchCmdWhenTabIsDisplayed(this.containerId, "EBX_Table.initDisplay(\"" + this.tableName + "\")");
		}

		if (this.isSelectColumnEnabled === true) {
			this.dataSourceSelectRows = new YAHOO.util.XHRDataSource(EBX_Table.constants.rowsSelectionRequest);
			this.dataSourceSelectRows.responseType = YAHOO.util.DataSource.TYPE_JSON;
			this.dataSourceSelectRows.responseSchema = EBX_Table.dataSourceSelectionResponseSchema;

			this.dataSourceUnselectRows = new YAHOO.util.XHRDataSource(EBX_Table.constants.rowsUnselectionRequest);
			this.dataSourceUnselectRows.responseType = YAHOO.util.DataSource.TYPE_JSON;
			this.dataSourceUnselectRows.responseSchema = EBX_Table.dataSourceSelectionResponseSchema;
		}

		this.dataSourceSetColumnWidth = new YAHOO.util.XHRDataSource(EBX_Table.constants.setColumnWidthRequest);
		this.dataSourceInitAllColumnWidths = new YAHOO.util.XHRDataSource(EBX_Table.constants.initAllColumnWidthsRequest);
	};

	this.initDisplay = function() {
		// first priority: launch the first request
		this.isTableReady = false;
		this.setState(EBX_Table_State.LOADING);
		this.dataSourceFetch.sendRequest(EBX_Table.constants.tableNameParameter + this.tableName, this.getCallbackFetchObject());

		this.hScrollHeight = EBXUtils.getHScrollHeight();
		this.vScrollWidth = EBXUtils.getVScrollWidth();

		this.initContainer();
		this.initInternalElements();

		this.initPluggedComponents();

		this.initColumns();

		this.initTablesStructures();

		this.resizeContainers();

		this.addListeners();

		this.endTableInit();
	};

	this.initContainer = function() {
		this.container = document.getElementById(this.containerId);
		this.isYUIResize = false;
		if (this.isWorkspaceTable === true) {
			var centerLayoutUnitSizes = EBX_LayoutManager.workspaceLayout.getUnitByPosition(EBX_LayoutManager.workspaceUnits.center.position)
					.getSizes();

			var filterPaneLayout = EBX_LayoutManager.workspaceLayout.getUnitByPosition(EBX_LayoutManager.workspaceUnits.filters.position);
			var isFilterPanePresent = false;
			if (filterPaneLayout !== false) {
				isFilterPanePresent = filterPaneLayout.getSizes().body.w !== 0;
			}

			this.containerWidth = centerLayoutUnitSizes.body.w;
			if (isFilterPanePresent === false) {
				this.containerWidth -= EBX_Table.workspaceTableMarginLeft;
			} else {
				this.containerWidth -= EBX_Table.workspaceTableWithFilterPaneMarginLeft;
			}

			// +1 to avoid seeing bottom border
			this.containerHeight = centerLayoutUnitSizes.body.h + 1;

			this.container.style.width = this.containerWidth + "px";
			this.container.style.height = this.containerHeight + "px";
		} else {
			this.isWidgetFullSizeTab = this.isAssociationNodeAloneInWorkspaceTabContent(this.container);

			if (this.isWidgetFullSizeTab === true) {
				// listen to window resize sync to the available width and height inside tab

				this.containerWidth = this.container.offsetWidth;
				this.containerHeight = this.container.offsetHeight;

				EBX_Table.enableFormWorkspaceResizeListener(this, false);
			} else {
				//				this.isWidgetAvailableWidthAutoHeight = EBXUtils.getFirstParentMatchingCSSClass(this.container, EBX_Form.FieldClassName) !== null;

				// FIXME default mode for now
				// coming soon: the widget mode with initial width and height (just add a flag mode in config params)
				this.isWidgetAvailableWidthAutoHeight = true;

				if (this.isWidgetAvailableWidthAutoHeight === true) {
					// listen to window resize sync to the available width of super container and resizable height

					this.containerWidth = this.container.offsetWidth;
					this.containerHeight = this.container.offsetHeight;

					this.isAutoHeight = true;

					EBX_Table.enableFormWorkspaceResizeListener(this, true);
				} else {
					// alone table
					this.containerWidth = this.container.offsetWidth;
					this.containerHeight = this.container.offsetHeight;

					this.yui_resize = new YAHOO.util.Resize(this.container, {
						handles: [ "br" ],
						proxy: true,
						ghost: true,
						setSize: false
					});

					this.yui_resize.getProxyEl().className += " tvContainerResizeProxy";

					this.yui_resize.set("minWidth", EBX_Table.minWidth);
					this.yui_resize.set("minHeight", EBX_Table.minHeight);

					this.yui_resize.subscribe("endResize", this.endResizeListener, null, this);

					this.isYUIResize = true;
				}
			}
		}
	};

	this.isAssociationNodeAloneInWorkspaceTabContent = function() {
		var isAssociationTable;

		isAssociationTable = EBXUtils.matchCSSClass(this.container.parentNode, "ebx_AssociationNodeTable");

		if (isAssociationTable === false) {
			return false;
		}

		var workspaceTabContentEl = EBXUtils.getFirstParentMatchingCSSClass(this.container, EBX_Form.WorkspaceFormTabContentCSSClass);

		if (workspaceTabContentEl === null) {
			return false;
		}

		// TODO these 2 following detections are not sure, but I did'nt find better for now
		//  I hope we could detect this easier, server-side, and be in config params

		// case of standard form
		var isAtFirstLevelInWorkspaceTabInStandardForm = this.container.parentNode.parentNode.parentNode.parentNode.parentNode === workspaceTabContentEl
				&& EBXUtils.matchCSSClass(this.container.parentNode.parentNode.parentNode, EBX_Form.InputClassName);

		// case of widget in CustomForm
		var isAtFirstLevelInWorkspaceTabInCustomForm = this.container.parentNode.parentNode.parentNode === workspaceTabContentEl;

		return (isAtFirstLevelInWorkspaceTabInStandardForm || isAtFirstLevelInWorkspaceTabInCustomForm);
	};

	this.initInternalElements = function() {
		var i, len;

		this.headerContainer = document.getElementById(this.headerContainerId);
		this.headerFixedContainer = document.getElementById(this.headerFixedContainerId);
		this.headerMainContainerWrapper = document.getElementById(this.headerMainContainerWrapperId);
		this.headerMainContainer = document.getElementById(this.headerMainContainerId);
		this.fixedScrollerWrapper = document.getElementById(this.fixedScrollerWrapperId);
		this.fixedScroller = document.getElementById(this.fixedScrollerId);
		this.mainScroller = document.getElementById(this.mainScrollerId);

		this.headerFixed = this.headerFixedContainer.firstChild;
		this.headerMain = this.headerMainContainer.firstChild;

		this.headerHeight = this.headerContainer.offsetHeight;

		// remove the ebx_BaselineAlignerCellHeader (the last cell)

		var headerFixedCellsHTMLCollection = this.headerFixed.rows[0].cells;
		this.headerFixedCells = [];
		for (i = 0, len = headerFixedCellsHTMLCollection.length - 1; i < len; i++) {
			this.headerFixedCells.push(headerFixedCellsHTMLCollection[i]);
		}

		var headerMainCellsHTMLCollection = this.headerMain.rows[0].cells;
		this.headerMainCells = [];
		for (i = 0, len = headerMainCellsHTMLCollection.length - 1; i < len; i++) {
			this.headerMainCells.push(headerMainCellsHTMLCollection[i]);
		}

		if (this.isSelectColumnEnabled === true) {
			this.checkboxSelectCurrentPage = document.getElementById(this.selectCurrentPageId);
		}

		this.messageContainer = EBXUtils.getFirstDirectChildMatchingCSSClass(this.container, "tvMessageContainer");
		this.messageEmpty = EBXUtils.getFirstDirectChildMatchingCSSClass(this.container, "tvMessageEmpty");
	};

	this.initPluggedComponents = function() {
		var i;
		this.pageReports = [];
		if (EBX_Table.pageReportRegister[this.tableName] !== undefined) {
			var pageReportsDef = EBX_Table.pageReportRegister[this.tableName];
			for (i = pageReportsDef.length - 1; i >= 0; i--) {
				this.pageReports.push(document.getElementById(pageReportsDef[i]));
			}
		}
		this.selectReports = [];
		if (EBX_Table.selectReportRegister[this.tableName] !== undefined) {
			var selectReportsDef = EBX_Table.selectReportRegister[this.tableName];
			for (i = selectReportsDef.length - 1; i >= 0; i--) {
				this.selectReports.push({
					number: document.getElementById(selectReportsDef[i] + EBX_Table.constants.suffixSelectionNumber),
					labelOne: document.getElementById(selectReportsDef[i] + EBX_Table.constants.suffixSelectionLabelOne),
					labelMany: document.getElementById(selectReportsDef[i] + EBX_Table.constants.suffixSelectionLabelMany)
				});
			}
		}
		this.buttonsOpen = [];
		if (EBX_Table.buttonOpenRegister[this.tableName] !== undefined) {
			var buttonsOpenDef = EBX_Table.buttonOpenRegister[this.tableName];
			for (i = buttonsOpenDef.length - 1; i >= 0; i--) {
				this.buttonsOpen.push(document.getElementById(buttonsOpenDef[i]));
			}
		}
		this.buttonsFirst = [];
		if (EBX_Table.buttonFirstRegister[this.tableName] !== undefined) {
			var buttonsFirstDef = EBX_Table.buttonFirstRegister[this.tableName];
			for (i = buttonsFirstDef.length - 1; i >= 0; i--) {
				this.buttonsFirst.push(document.getElementById(buttonsFirstDef[i]));
			}
		}
		this.buttonsPrevious = [];
		if (EBX_Table.buttonPreviousRegister[this.tableName] !== undefined) {
			var buttonsPreviousDef = EBX_Table.buttonPreviousRegister[this.tableName];
			for (i = buttonsPreviousDef.length - 1; i >= 0; i--) {
				this.buttonsPrevious.push(document.getElementById(buttonsPreviousDef[i]));
			}
		}
		this.buttonsNext = [];
		if (EBX_Table.buttonNextRegister[this.tableName] !== undefined) {
			var buttonsNextDef = EBX_Table.buttonNextRegister[this.tableName];
			for (i = buttonsNextDef.length - 1; i >= 0; i--) {
				this.buttonsNext.push(document.getElementById(buttonsNextDef[i]));
			}
		}
		this.buttonsLast = [];
		if (EBX_Table.buttonLastRegister[this.tableName] !== undefined) {
			var buttonsLastDef = EBX_Table.buttonLastRegister[this.tableName];
			for (i = buttonsLastDef.length - 1; i >= 0; i--) {
				this.buttonsLast.push(document.getElementById(buttonsLastDef[i]));
			}
		}
	};

	this.initColumns = function() {
		var i, mainColumnsWidth, colIndex, colIndexInDataTable, cellWidth, resizeKnobDivEl, headerCells;

		this.initColumnDefsByKey();

		this.isInheritanceColumnDisplayed = this.columnDefsByKey["tvColInheritance"] !== undefined
				&& this.columnDefsByKey["tvColInheritance"].width !== 0;

		this.headerFixed.style.tableLayout = "auto";
		this.headerMain.style.tableLayout = "auto";

		if (YAHOO.env.ua.webkit !== 0) {
			EBXUtils.addCSSClass(this.headerFixed, "tvTableLayoutAutoForWebkit");
			EBXUtils.addCSSClass(this.headerMain, "tvTableLayoutAutoForWebkit");
		}

		// remove left border
		this.fixedColumnsWidth = -1;
		mainColumnsWidth = 0;

		this.nbFixedColumns = this.headerFixedCells.length;
		this.nbMainColumns = this.headerMainCells.length;

		colIndex = 0;
		colIndexInDataTable = 0;

		this.isAutoWidthNeeded = false;

		for (i = 0; i < this.nbFixedColumns; i++, colIndex++) {
			if (this.columnDefs[colIndex].width === undefined) {
				cellWidth = this.headerFixedCells[i].offsetWidth;
				if (cellWidth < 0) {
					cellWidth = 0;
				}
				this.columnDefs[colIndex].headerWidth = cellWidth;

				this.fixedColumnsWidth += this.columnDefs[colIndex].headerWidth;

				this.isAutoWidthNeeded = true;
			} else if (this.columnDefs[colIndex].width !== 0) {
				this.fixedColumnsWidth += this.columnDefs[colIndex].width;
			}
			this.columnDefs[colIndex].cumulativeWidth = this.fixedColumnsWidth;

			if (this.columnDefs[colIndex].resizeable === true) {
				if (EBX_LayoutManager.isIPad === true) {
					YAHOO.util.Event.addListener(this.headerFixedCells[i], "gesturestart", this.gestureStartResizeColumnListener, colIndex, this);
					YAHOO.util.Event.addListener(this.headerFixedCells[i], "gesturechange", this.gestureChangeResizeColumnListener, colIndex, this);
					YAHOO.util.Event.addListener(this.headerFixedCells[i], "gestureend", this.gestureEndResizeColumnListener, colIndex, this);
				} else {
					resizeKnobDivEl = document.createElement("div");
					resizeKnobDivEl.className = "ebx_ColumnResizeKnob";
					resizeKnobDivEl.style.left = this.fixedColumnsWidth + "px";
					if (i === this.nbFixedColumns - 1) {
						this.headerFixedContainer.parentNode.appendChild(resizeKnobDivEl);
					} else {
						this.headerFixedContainer.appendChild(resizeKnobDivEl);
					}
					this.columnDefs[colIndex].resizeKnob = resizeKnobDivEl;
					YAHOO.util.Event.addListener(resizeKnobDivEl, "mouseover", this.mouseOverResizeKnobListener, colIndex, this);
					YAHOO.util.Event.addListener(resizeKnobDivEl, "mouseout", this.mouseOutResizeKnobListener, null, this);
				}
			}

			if (this.columnDefs[colIndex].width !== 0) {
				this.columnDefs[colIndex].colIndexInDataTable = colIndexInDataTable;
				colIndexInDataTable++;
			} else {
				this.columnDefs[colIndex].colIndexInDataTable = undefined;
			}
			this.columnDefs[colIndex].colIndexInHeader = i;
		}
		colIndexInDataTable = 0;
		for (i = 0, len = this.headerMainCells.length; i < len; i++, colIndex++) {
			if (this.columnDefs[colIndex].width === undefined) {
				cellWidth = this.headerMainCells[i].offsetWidth;
				if (cellWidth < 0) {
					cellWidth = 0;
				}
				this.columnDefs[colIndex].headerWidth = cellWidth;

				mainColumnsWidth += this.columnDefs[colIndex].headerWidth;

				this.isAutoWidthNeeded = true;
			} else if (this.columnDefs[colIndex].width !== 0) {
				mainColumnsWidth += this.columnDefs[colIndex].width;
			}
			this.columnDefs[colIndex].cumulativeWidth = mainColumnsWidth;

			if (this.columnDefs[colIndex].resizeable === true) {
				if (EBX_LayoutManager.isIPad === true) {
					YAHOO.util.Event.addListener(this.headerMainCells[i], "gesturestart", this.gestureStartResizeColumnListener, colIndex, this);
					YAHOO.util.Event.addListener(this.headerMainCells[i], "gesturechange", this.gestureChangeResizeColumnListener, colIndex, this);
					YAHOO.util.Event.addListener(this.headerMainCells[i], "gestureend", this.gestureEndResizeColumnListener, colIndex, this);
				} else {
					resizeKnobDivEl = document.createElement("div");
					resizeKnobDivEl.className = "ebx_ColumnResizeKnob";
					resizeKnobDivEl.style.left = mainColumnsWidth + "px";
					this.headerMainContainer.appendChild(resizeKnobDivEl);
					this.columnDefs[colIndex].resizeKnob = resizeKnobDivEl;
					YAHOO.util.Event.addListener(resizeKnobDivEl, "mouseover", this.mouseOverResizeKnobListener, colIndex, this);
					YAHOO.util.Event.addListener(resizeKnobDivEl, "mouseout", this.mouseOutResizeKnobListener, null, this);
				}
			}

			if (this.columnDefs[colIndex].width !== 0) {
				this.columnDefs[colIndex].colIndexInDataTable = colIndexInDataTable;
				colIndexInDataTable++;
			} else {
				this.columnDefs[colIndex].colIndexInDataTable = undefined;
			}
			this.columnDefs[colIndex].colIndexInHeader = i;
		}

		this.headerFixed.style.tableLayout = "";
		this.headerMain.style.tableLayout = "";

		if (YAHOO.env.ua.webkit !== 0) {
			EBXUtils.removeCSSClass(this.headerFixed, "tvTableLayoutAutoForWebkit");
			EBXUtils.removeCSSClass(this.headerMain, "tvTableLayoutAutoForWebkit");
		}

		//// apply widths

		colIndex = 0;

		// header fixed
		headerCells = this.headerFixedCells;
		for (i = 0, len = headerCells.length; i < len; i++, colIndex++) {
			// disabled column: display none in header // not present in data cells
			if (this.columnDefs[colIndex].width !== 0) {
				if (this.columnDefs[colIndex].width !== undefined) {
					headerCells[i].style.width = this.columnDefs[colIndex].width + "px";
				} else {
					headerCells[i].style.width = this.columnDefs[colIndex].headerWidth + "px";
				}
			}
		}

		// header main
		headerCells = this.headerMainCells;
		for (i = 0, len = headerCells.length; i < len; i++, colIndex++) {
			if (this.columnDefs[colIndex].width !== 0) {
				if (this.columnDefs[colIndex].width !== undefined) {
					headerCells[i].style.width = this.columnDefs[colIndex].width + "px";
				} else {
					headerCells[i].style.width = this.columnDefs[colIndex].headerWidth + "px";
				}
			}
		}

		if (this.fixedColumnsWidth + EBX_Table.mainContainerMinWidth > this.containerWidth) {
			this.fixedColumnsWidth = this.containerWidth - EBX_Table.mainContainerMinWidth;
		}

		// -1 is possible, because of the left border
		if (this.fixedColumnsWidth === -1) {
			this.headerFixedContainer.style.width = "0";
		} else {
			this.headerFixedContainer.style.width = this.fixedColumnsWidth + "px";
		}

		this.headerMainContainerWrapper.style.width = (this.containerWidth - this.fixedColumnsWidth) + "px";

		this.headerMainContainer.style.width = (this.containerWidth - this.fixedColumnsWidth) + "px";

		// -1 is possible, because of the left border
		if (this.fixedColumnsWidth === -1) {
			this.fixedScrollerWrapper.style.width = "0";
		} else {
			this.fixedScrollerWrapper.style.width = this.fixedColumnsWidth + "px";
		}

		// 50 = approx the biggest vertical scrollbar width possible
		// to avoid seeing the vertical scrollbar while loading the
		//  first visible lines, before the real resize of fixedScroller in this.resizeContainers()
		this.fixedScroller.style.width = this.fixedColumnsWidth + 50 + "px";

		this.mainScroller.style.width = (this.containerWidth - this.fixedColumnsWidth) + "px";

		this.mainScrollerHeight = this.containerHeight - this.headerHeight;
		this.fixedScrollerWrapper.style.height = this.mainScrollerHeight + "px";
		this.fixedScroller.style.height = this.mainScrollerHeight + "px";
		this.mainScroller.style.height = this.mainScrollerHeight + "px";
	};

	this.initColumnDefsByKey = function() {
		this.columnDefsByKey = {};

		for ( var i = 0, len = this.columnDefs.length; i < len; i++) {
			this.columnDefsByKey[this.columnDefs[i].key] = this.columnDefs[i];
		}
	};

	this.initTablesStructures = function() {
		this.fixedTable = document.createElement("table");
		this.fixedTable.className = "tvFixed";
		this.fixedTable.appendChild(document.createElement("tbody"));
		this.fixedScroller.appendChild(this.fixedTable);

		this.fixedScrollMaker = document.createElement("div");
		this.fixedScrollMaker.className = "tvScrollMaker";
		this.fixedScroller.appendChild(this.fixedScrollMaker);

		this.mainTable = document.createElement("table");
		this.mainTable.className = "tvMain";
		this.mainTable.appendChild(document.createElement("tbody"));
		this.mainScroller.appendChild(this.mainTable);

		this.mainScrollMaker = document.createElement("div");
		this.mainScrollMaker.className = "tvScrollMaker";
		this.mainScroller.appendChild(this.mainScrollMaker);

		this.isTableEmpty = true;
	};

	this.addListeners = function() {
		if (this.isWorkspaceTable === true) {
			EBX_LayoutManager.workspaceLayout.addListener("resize", this.resizeFromYUILayout, null, this);
		}

		YAHOO.util.Event.addListener(this.headerFixed, "click", this.clickOnHeaderTableListener, null, this);
		YAHOO.util.Event.addListener(this.headerMain, "click", this.clickOnHeaderTableListener, null, this);

		YAHOO.util.Event.addListener(this.fixedScroller, "scroll", this.synchronizeScrollFromFixed, null, this);
		YAHOO.util.Event.addListener(this.mainScroller, "scroll", this.synchronizeScrolls, null, this);

		YAHOO.util.Event.addListener(this.fixedTable, "click", this.clickOnFixedTableListener, null, this);
		YAHOO.util.Event.addListener(this.mainTable, "click", this.clickOnMainTableListener, null, this);

		if (this.isOpenRecordEnabled === true) {
			YAHOO.util.Event.addListener(this.fixedTable, "dblclick", this.openRecordFromLine, this.fixedTable, this);
			YAHOO.util.Event.addListener(this.mainTable, "dblclick", this.openRecordFromLine, this.mainTable, this);
		}
	};

	this.endTableInit = function() {
		var fnArgObj;

		while (this.functionsToCallWhenTableIsInit.length > 0) {
			fnArgObj = this.functionsToCallWhenTableIsInit.shift();
			fnArgObj.fn.call(this, fnArgObj.arg);
		}

		this.isTableInit = true;
	};

	this.callFunctionWhenTableIsInit = function(fn, arg) {
		if (this.isTableInit === true) {
			fn.call(this, arg);
			return;
		}

		this.functionsToCallWhenTableIsInit.push({
			fn: fn,
			arg: arg
		});
	};

	this.gotoFirstPage = function() {
		this.gotoPage(EBX_Table.constants.firstPageParamValue);
	};
	this.gotoPreviousPage = function() {
		this.gotoPage(EBX_Table.constants.prevPageParamValue);
	};
	this.gotoNextPage = function() {
		this.gotoPage(EBX_Table.constants.nextPageParamValue);
	};
	this.gotoLastPage = function() {
		this.gotoPage(EBX_Table.constants.lastPageParamValue);
	};
	this.gotoPage = function(pageCode) {
		this.isTableReady = false;
		this.setState(EBX_Table_State.LOADING);
		this.dataSourceFetch.sendRequest(EBX_Table.constants.tableNameParameter + this.tableName + EBX_Table.constants.paginationCommandParameter
				+ pageCode, this.getCallbackFetchObject());
	};

	this.refreshCurrentPage = function() {
		this.isTableReady = false;
		this.setState(EBX_Table_State.LOADING);
		this.dataSourceFetch.sendRequest(EBX_Table.constants.tableNameParameter + this.tableName, this.getCallbackFetchObject());
	};

	this.getCallbackFetchObject = function() {
		return {
			success: this.callbackFetchSuccess,
			failure: this.callbackFetchFailure,
			scope: this
		};
	};

	this.callbackFetchSuccess = function(oRequest, oParsedResponse, argument) {
		// IE8 is too long, so wait for the end of init to call the fetch success
		this.callFunctionWhenTableIsInit(this.callbackFetchSuccessWhenInitIsDone, oParsedResponse);
	};

	this.callbackFetchSuccessWhenInitIsDone = function(oParsedResponse) {
		this.currentResponse = oParsedResponse;
		this.currentResponseResultsByKey = null;
		this.currentRowsProperties = [];
		this.lastLineSelectedIndex = null;
		this.currentRowFocusedIndex = null;

		this.updateSelectReport();
		this.updatePageSelectionCheckbox();
		this.updatePageReport();
		this.updatePagingButtonsState();
		this.updateSortFlags();
		this.updateSeverityColumn();
		this.updateFocusedLine();

		// empty tables
		this.fixedTable.removeChild(this.fixedTable.firstChild);
		this.fixedTable.appendChild(document.createElement("tbody"));

		this.mainTable.removeChild(this.mainTable.firstChild);
		this.mainTable.appendChild(document.createElement("tbody"));

		if (this.currentResponse.results.length === 0) {
			this.isTableEmpty = true;
			this.linesHeightsSum = 0;
			this.isTableReady = true;
			this.setState(EBX_Table_State.EMPTY);

			if (this.isAutoHeight === true) {
				this.resizeAutoHeight();
			} else {
				// resize anyway (if the table has just been empty)
				this.resizeContainers();
			}

			return;
		}

		this.isTableEmpty = false;

		// init this.recIndexStop
		this.fillVisibleLines();

		this.setState(EBX_Table_State.NORMAL);

		window.setTimeout("EBX_Table.synchronizeVisibleLinesHeightAndLaunchFillRemainingLines(\"" + this.tableName + "\")", 10);
	};

	this.updatePageReport = function() {
		for ( var i = this.pageReports.length - 1; i >= 0; i--) {
			this.pageReports[i].innerHTML = this.currentResponse.meta.pageReport;
		}
	};

	this.updateSelectReport = function() {
		for ( var i = this.selectReports.length - 1; i >= 0; i--) {
			if (this.currentResponse.meta.selectedNumber === 0) {
				this.selectReports[i].number.innerHTML = "";
				this.selectReports[i].labelOne.style.display = "none";
				this.selectReports[i].labelMany.style.display = "none";
			} else {
				this.selectReports[i].number.innerHTML = this.currentResponse.meta.selectedNumber;

				if (this.currentResponse.meta.selectedNumber > 1) {
					this.selectReports[i].labelOne.style.display = "none";
					this.selectReports[i].labelMany.style.display = "inline";
				} else {
					this.selectReports[i].labelOne.style.display = "inline";
					this.selectReports[i].labelMany.style.display = "none";
				}
			}
		}
	};

	this.updatePagingButtonsState = function() {
		var i;
		var hasPreviousPage = this.currentResponse.meta.hasPreviousPage;
		var hasNextPage = this.currentResponse.meta.hasNextPage;

		for (i = this.buttonsFirst.length - 1; i >= 0; i--) {
			EBX_ButtonUtils.setButtonDisabled(this.buttonsFirst[i], !hasPreviousPage);
		}

		for (i = this.buttonsPrevious.length - 1; i >= 0; i--) {
			EBX_ButtonUtils.setButtonDisabled(this.buttonsPrevious[i], !hasPreviousPage);
		}

		for (i = this.buttonsNext.length - 1; i >= 0; i--) {
			EBX_ButtonUtils.setButtonDisabled(this.buttonsNext[i], !hasNextPage);
		}

		for (i = this.buttonsLast.length - 1; i >= 0; i--) {
			EBX_ButtonUtils.setButtonDisabled(this.buttonsLast[i], !hasNextPage);
		}
	};

	this.updateSortFlags = function() {
		var i, colIndex, colMask, cell, sortStateOrders, sortNumberByColumn, sortNumber, sortDirection;

		sortStateOrders = this.currentResponse.meta.sortState[0];

		sortNumberByColumn = [];
		for (i = 0, len = sortStateOrders.length; i < len; i++) {
			sortNumberByColumn[sortStateOrders[i]] = i + 1;
		}

		sortState = this.currentResponse.meta.sortState;

		colIndex = 0;
		for (i = this.columnDefsByKey["tvColSeverity"].colIndexInHeader + 1, len = this.nbFixedColumns; i < len; i++, colIndex++) {
			cell = this.headerFixedCells[i];
			sortNumber = sortNumberByColumn[colIndex];
			if (sortNumber === undefined) {
				sortDirection = null;
				sortNumber = null;
			} else {
				colMask = Math.pow(2, colIndex % EBX_Table.maxIntPowerForBitwiseOperation);
				sortDirection = colMask === (sortState[Math.floor(colIndex / EBX_Table.maxIntPowerForBitwiseOperation) + 1] & colMask);
			}
			this.updateSortFlag(cell, sortNumber, sortDirection);
		}
		for (i = 0, len = this.headerMainCells.length; i < len; i++, colIndex++) {
			cell = this.headerMainCells[i];
			sortNumber = sortNumberByColumn[colIndex];
			if (sortNumber === undefined) {
				sortDirection = null;
				sortNumber = null;
			} else {
				colMask = Math.pow(2, colIndex % EBX_Table.maxIntPowerForBitwiseOperation);
				sortDirection = colMask === (sortState[Math.floor(colIndex / EBX_Table.maxIntPowerForBitwiseOperation) + 1] & colMask);
			}
			this.updateSortFlag(cell, sortNumber, sortDirection);
		}
	};
	this.updateSortFlag = function(tdEl, sortNumber, sortDirection) {
		var sortFlagEl, sortNumberEl;

		sortFlagEl = EBXUtils.getFirstDirectChildMatchingCSSClass(tdEl, EBX_Table.sortFlagCSSClass);

		if (sortFlagEl === null) {
			return;
		}

		if (sortDirection === true) {
			sortFlagEl.className = EBX_Table.sortFlagCSSClass + " " + EBX_Table.sortFlagAscCSSClass;
			tdEl.title = EBX_Table.messages.table_sortdesc;
		} else if (sortDirection === false) {
			sortFlagEl.className = EBX_Table.sortFlagCSSClass + " " + EBX_Table.sortFlagDescCSSClass;
			tdEl.title = EBX_Table.messages.table_sortasc;
		} else {
			sortFlagEl.className = EBX_Table.sortFlagCSSClass;
			tdEl.title = EBX_Table.messages.table_sortasc;
		}

		sortNumberEl = EBXUtils.getFirstDirectChildMatchingCSSClass(sortFlagEl, EBX_Table.sortNumberCSSClass);

		if (sortNumber !== null) {
			sortNumberEl.innerHTML = sortNumber;
		} else {
			sortNumberEl.innerHTML = "";
		}
	};

	this.updateSeverityColumn = function() {
		this.setSeverityColumnDisplayed(this.currentResponse.meta.highestSeverity !== undefined);
		// TODO CCH grey version for header?
		// disabled for now
		// this.headerFixedCells[this.columnDefsByKey["tvColSeverity"].colIndexInHeader].className = this.getSeverityCellClassNameFromSeverityFlag(this.currentResponse.meta.highestSeverity);
	};

	this.appendLines = function(recIndexStart) {
		var tBodyFixed, tBodyMain, records, recIndex, record, firstRow, recordCellIndex, recordCellLen, recordCellValue, trFixed, trMain, tdEl, bufHTMLtd, cellStyle;

		records = this.currentResponse.results;

		firstRow = recIndexStart === 0;

		tBodyFixed = this.fixedTable.firstChild;
		tBodyMain = this.mainTable.firstChild;

		for (recIndex = recIndexStart; recIndex < this.recIndexStop; recIndex++) {
			record = records[recIndex];

			this.currentRowsProperties[recIndex] = {};

			trFixed = document.createElement("tr");
			trMain = document.createElement("tr");

			if (recIndex % 2 === 0) {
				trFixed.className = "tvEven";
				trMain.className = "tvEven";
			} else {
				trFixed.className = "tvOdd";
				trMain.className = "tvOdd";
			}

			// cell select
			if (this.isSelectColumnEnabled === true) {
				tdEl = document.createElement("td");
				if (firstRow === true) {
					tdEl.style.width = this.columnDefsByKey["tvColSelect"].width + "px";
				}
				if (this.isInheritanceColumnDisplayed === true || this.isSeverityColumnDisplayed === true) {
					tdEl.style.borderRight = "none";
				}
				tdEl.className = "tvSelectCell";
				bufHTMLtd = [];
				bufHTMLtd.push("<input type=\"checkbox\"");
				if (record[EBX_Table.compiledStateIndexInResultLine].charAt(EBX_Table.compiledRowStateIndexSelected) === EBX_Table.compiledRowStateSelected) {
					bufHTMLtd.push(" checked=\"checked\"");
					trFixed.className += " tv_SelectedRow";
					trMain.className += " tv_SelectedRow";
				}
				bufHTMLtd.push("/>");
				tdEl.innerHTML = bufHTMLtd.join("");
				trFixed.appendChild(tdEl);
			}

			// cell inheritance
			if (this.isInheritanceColumnDisplayed === true) {
				this.currentRowsProperties[recIndex].inheritanceState = this.parseInheritanceState(record[EBX_Table.compiledStateIndexInResultLine]
						.charAt(EBX_Table.compiledRowStateIndexInheritance));

				trFixed.className += " " + this.getInheritanceLineCSSClass(this.currentRowsProperties[recIndex].inheritanceState);
				trMain.className += " " + this.getInheritanceLineCSSClass(this.currentRowsProperties[recIndex].inheritanceState);

				tdEl = document.createElement("td");
				if (firstRow === true) {
					tdEl.style.width = this.columnDefsByKey["tvColInheritance"].width + "px";
				}
				if (this.isSeverityColumnDisplayed === true) {
					tdEl.style.borderRight = "none";
				}
				tdEl.className = "tvInheritanceCell";
				tdEl.innerHTML = this.getInheritanceComponent(this.currentRowsProperties[recIndex].inheritanceState);
				trFixed.appendChild(tdEl);
			}

			// cell severity
			if (this.isSeverityColumnDisplayed === true) {
				tdEl = document.createElement("td");
				if (firstRow === true) {
					tdEl.style.width = this.columnDefsByKey["tvColSeverity"].width + "px";
				}
				tdEl.className = this.getSeverityCellClassNameFromSeverityFlag(record[EBX_Table.compiledStateIndexInResultLine]
						.charAt(EBX_Table.compiledRowStateIndexSeverity));
				// if the cell is completely empty, the line height is bugged
				tdEl.innerHTML = "&nbsp;";
				trFixed.appendChild(tdEl);
			}

			colIndexInHeader = this.columnDefsByKey["tvColSeverity"].colIndexInHeader + 1;

			for (recordCellIndex = EBX_Table.firstColumnContentIndexInResultLine, recordCellLen = record.length; recordCellIndex < recordCellLen; recordCellIndex++, colIndexInHeader++) {
				tdEl = document.createElement("td");
				if (firstRow === true) {
					if (this.columnDefs[colIndexInHeader].width !== undefined) {
						tdEl.style.width = this.columnDefs[colIndexInHeader].width + "px";
					} else {
						// the column width is not set, so take the header width as minWidth to prepare the auto-sizing
						tdEl.style.minWidth = this.columnDefs[colIndexInHeader].headerWidth + EBX_Table.minWidthIssueGap + "px";
					}
				}
				recordCellValue = record[recordCellIndex];
				if (recordCellValue instanceof Array) {
					if (YAHOO.lang.trim(recordCellValue[0]) === "") {
						// if the cell is completely empty or made of spaces, the line height is bugged
						tdEl.innerHTML = "&nbsp;";
					} else {
						tdEl.innerHTML = recordCellValue[0];
					}

					cellStyle = {};
					cellStyle.backgroundImage = [];
					cellStyle.backgroundRepeat = [];
					cellStyle.backgroundPosition = [];

					if (recordCellValue[1] === EBX_Table.inheritCellFlagValue) {
						tdEl.title = EBX_Table.messages.table_inheritedCellValue_title;
						cellStyle.backgroundImage.push("url(" + EBX_Table.constants.inheritCellFlagURL + ")");
						cellStyle.backgroundRepeat.push("no-repeat");
						cellStyle.backgroundPosition.push("0 0");
					}

					if (recordCellValue[2] !== undefined) {
						// can be empty string
						tdEl.style.backgroundColor = recordCellValue[2];
						if (recordCellValue[3] !== undefined) {
							cellStyle.backgroundImage.push("url(" + recordCellValue[3] + ")");
							if (recordCellValue[4] !== undefined) {
								cellStyle.backgroundRepeat.push(recordCellValue[4]);
								if (recordCellValue[5] !== undefined) {
									cellStyle.backgroundPosition.push(recordCellValue[5]);
								}
							}
						}
					}

					if (cellStyle.backgroundImage.length !== 0) {
						if (EBX_LayoutManager.isIE8 === true) {
							tdEl.style.backgroundImage = cellStyle.backgroundImage[0];
							if (cellStyle.backgroundRepeat[0] !== undefined) {
								tdEl.style.backgroundRepeat = cellStyle.backgroundRepeat[0];
							}
							if (cellStyle.backgroundPosition[0] !== undefined) {
								tdEl.style.backgroundPosition = cellStyle.backgroundPosition[0];
							}
						} else {
							tdEl.style.backgroundImage = cellStyle.backgroundImage.join(", ");
							tdEl.style.backgroundRepeat = cellStyle.backgroundRepeat.join(", ");
							tdEl.style.backgroundPosition = cellStyle.backgroundPosition.join(", ");
						}
					}

				} else if (YAHOO.lang.trim(recordCellValue) === "") {
					// if the cell is completely empty or made of spaces, the line height is bugged
					tdEl.innerHTML = "&nbsp;";
				} else {
					tdEl.innerHTML = recordCellValue;
				}
				if (colIndexInHeader >= this.nbFixedColumns) {
					trMain.appendChild(tdEl);
				} else {
					trFixed.appendChild(tdEl);
				}
			}

			tdEl.className = "tv_td_lastVisible";

			// append baseline controllers
			tdEl = document.createElement("td");
			tdEl.style.visibility = "hidden";
			tdEl.style.paddingLeft = "0";
			tdEl.style.paddingRight = "0";
			tdEl.innerHTML = "<span>&nbsp;</span>";
			trFixed.appendChild(tdEl);
			tdEl = document.createElement("td");
			tdEl.style.visibility = "hidden";
			tdEl.style.paddingLeft = "0";
			tdEl.style.paddingRight = "0";
			tdEl.innerHTML = "<span>&nbsp;</span>";
			trMain.appendChild(tdEl);

			tBodyFixed.appendChild(trFixed);
			tBodyMain.appendChild(trMain);

			firstRow = false;
		}
	};

	this.parseInheritanceState = function(inheritFlag) {
		var intResult = parseInt(inheritFlag, 36);

		// if is not in the right bounds
		if (!(intResult >= 0 && intResult < 36)) {
			return null;
		}

		var ret = {};

		ret.canOverwrite = intResult >= 20;
		if (ret.canOverwrite === true) {
			intResult -= 20;
		}

		ret.canDelete = intResult >= 10;
		if (ret.canDelete === true) {
			intResult -= 10;
		}

		ret.mode = intResult;

		return ret;
	};

	this.getInheritanceLineCSSClass = function(inheritanceState) {
		if (inheritanceState.mode === 1) {
			// mode root
			return "tvLineRoot";
		}

		if (inheritanceState.mode === 4 || inheritanceState.mode === 5) {
			// mode occulting or occulting orphan
			return "tvLineOcculting";
		}
	};

	this.getInheritanceComponent = function(inheritanceState) {
		if (inheritanceState.mode === 1) {
			// mode root
			// nothing to do (style on whole line)
		} else if (inheritanceState.mode === 2) {
			// mode inherit
			if (inheritanceState.canOverwrite) {
				// button inherit -> overwriting
				inheritanceState.confirmMessage = EBX_Table.messages.table_inheritance_overwrite_confirm;
				inheritanceState.dataSource = this.dataSourceSetOverwritten;
				inheritanceState.isOpeningRecord = true;
				return EBX_Table.constants.overwriteButtonHTML;
			} else {
				// icon inherit
				return EBX_Table.constants.inheritFlagHTML;
			}
		} else if (inheritanceState.mode === 3) {
			// mode overwriting
			if (inheritanceState.canDelete) {
				// button overwriting -> inherit
				inheritanceState.confirmMessage = EBX_Table.messages.table_inheritance_inherit_confirm;
				inheritanceState.dataSource = this.dataSourceSetInherited;
				inheritanceState.isOpeningRecord = false;
				return EBX_Table.constants.inheritButtonHTML;
			} else {
				// icon overwriting
				return EBX_Table.constants.overwritingFlagHTML;
			}
		} else if (inheritanceState.mode === 4) {
			// mode occulting
			if (inheritanceState.canDelete) {
				// button inherit
				inheritanceState.confirmMessage = EBX_Table.messages.table_inheritance_inherit_confirm;
				inheritanceState.dataSource = this.dataSourceSetInherited;
				inheritanceState.isOpeningRecord = false;
				return EBX_Table.constants.inheritButtonHTML;
			} else {
				// nothing to do (style on whole line)
			}
		} else if (inheritanceState.mode === 5) {
			// mode occulting orphan
			if (inheritanceState.canDelete) {
				// button delete
				inheritanceState.confirmMessage = EBX_Table.messages.table_deleteRecord_confirm;
				inheritanceState.dataSource = this.dataSourceSetOcculted;
				inheritanceState.isOpeningRecord = false;
				return EBX_Table.constants.deleteButtonHTML;
			} else {
				// nothing to do (style on whole line)
			}
		}

		return "&nbsp;";
	};

	this.getSeverityCellClassNameFromSeverityFlag = function(severityFlag) {
		if (severityFlag === "E") {
			return "tvSeverityCell ebx_IconError";
		} else if (severityFlag === "W") {
			return "tvSeverityCell ebx_IconWarning";
		} else if (severityFlag === "I") {
			return "tvSeverityCell ebx_IconInfo";
		}
		return "tvSeverityCell";
	};

	this.fillVisibleLines = function() {
		var visibleLineNumber;

		this.recIndexStop = this.currentResponse.results.length;

		visibleLineNumber = Math.ceil(this.mainScrollerHeight / EBX_Table.lineMinHeight);

		if (visibleLineNumber < this.recIndexStop) {
			this.recIndexStop = visibleLineNumber;
		}

		this.appendLines(0);
	};

	/* Used only when table is not empty, the first time the table is filled */
	this.initUndefinedColWidths = function() {
		var headerCells, cellsOfFirstRow, headerCellIndex, len, colIndex, cumulativeCellWidth;

		//// collect widths

		this.headerFixed.style.tableLayout = "auto";
		this.headerMain.style.tableLayout = "auto";
		this.fixedTable.style.tableLayout = "auto";
		this.mainTable.style.tableLayout = "auto";

		if (YAHOO.env.ua.webkit !== 0) {
			EBXUtils.addCSSClass(this.headerFixed, "tvTableLayoutAutoForWebkit");
			EBXUtils.addCSSClass(this.headerMain, "tvTableLayoutAutoForWebkit");
			EBXUtils.addCSSClass(this.fixedTable, "tvTableLayoutAutoForWebkit");
			EBXUtils.addCSSClass(this.mainTable, "tvTableLayoutAutoForWebkit");
		}

		colIndex = 0;

		// remove left border
		cumulativeCellWidth = -1;

		// table fixed
		headerCells = this.headerFixedCells;
		cellsOfFirstRow = this.fixedTable.rows[0].cells;
		for (headerCellIndex = 0, len = headerCells.length; headerCellIndex < len; headerCellIndex++, colIndex++) {
			if (this.columnDefs[colIndex].width === undefined) {
				this.columnDefs[colIndex].width = cellsOfFirstRow[this.columnDefs[colIndex].colIndexInDataTable].offsetWidth;
				if (this.columnDefs[colIndex].width > EBX_Table.constants.maxAutoWidthAtInit) {
					this.columnDefs[colIndex].width = EBX_Table.constants.maxAutoWidthAtInit;
				}
			}
			cumulativeCellWidth += this.columnDefs[colIndex].width;
			this.columnDefs[colIndex].cumulativeWidth = cumulativeCellWidth;
		}

		cumulativeCellWidth = 0;

		// table main
		headerCells = this.headerMainCells;
		cellsOfFirstRow = this.mainTable.rows[0].cells;
		for (headerCellIndex = 0, len = headerCells.length; headerCellIndex < len; headerCellIndex++, colIndex++) {
			if (this.columnDefs[colIndex].width === undefined) {
				this.columnDefs[colIndex].width = cellsOfFirstRow[this.columnDefs[colIndex].colIndexInDataTable].offsetWidth;
				if (this.columnDefs[colIndex].width > EBX_Table.constants.maxAutoWidthAtInit) {
					this.columnDefs[colIndex].width = EBX_Table.constants.maxAutoWidthAtInit;
				}
			}
			cumulativeCellWidth += this.columnDefs[colIndex].width;
			this.columnDefs[colIndex].cumulativeWidth = cumulativeCellWidth;
		}

		this.headerFixed.style.tableLayout = "";
		this.headerMain.style.tableLayout = "";
		this.fixedTable.style.tableLayout = "";
		this.mainTable.style.tableLayout = "";

		if (YAHOO.env.ua.webkit !== 0) {
			EBXUtils.removeCSSClass(this.headerFixed, "tvTableLayoutAutoForWebkit");
			EBXUtils.removeCSSClass(this.headerMain, "tvTableLayoutAutoForWebkit");
			EBXUtils.removeCSSClass(this.fixedTable, "tvTableLayoutAutoForWebkit");
			EBXUtils.removeCSSClass(this.mainTable, "tvTableLayoutAutoForWebkit");
		}

		this.sendInitAllColumnWidths();

		//// apply widths

		colIndex = 0;

		// table fixed
		headerCells = this.headerFixedCells;
		cellsOfFirstRow = this.fixedTable.rows[0].cells;
		for (headerCellIndex = 0, len = headerCells.length; headerCellIndex < len; headerCellIndex++, colIndex++) {
			if (this.columnDefs[colIndex].width !== 0) {
				headerCells[headerCellIndex].style.width = this.columnDefs[colIndex].width + "px";
				cellsOfFirstRow[this.columnDefs[colIndex].colIndexInDataTable].style.width = this.columnDefs[colIndex].width + "px";
				cellsOfFirstRow[this.columnDefs[colIndex].colIndexInDataTable].style.minWidth = "";
				this.alignResizeKnob(colIndex);
			}
		}

		// table main
		headerCells = this.headerMainCells;
		cellsOfFirstRow = this.mainTable.rows[0].cells;
		for (headerCellIndex = 0, len = headerCells.length; headerCellIndex < len; headerCellIndex++, colIndex++) {
			if (this.columnDefs[colIndex].width !== 0) {
				headerCells[headerCellIndex].style.width = this.columnDefs[colIndex].width + "px";
				cellsOfFirstRow[this.columnDefs[colIndex].colIndexInDataTable].style.width = this.columnDefs[colIndex].width + "px";
				cellsOfFirstRow[this.columnDefs[colIndex].colIndexInDataTable].style.minWidth = "";
				this.alignResizeKnob(colIndex);
			}
		}

		this.isAutoWidthNeeded = true;
	};

	this.alignResizeKnob = function(colIndex) {
		if (this.columnDefs[colIndex].resizeKnob === undefined) {
			return;
		}
		if (colIndex === this.nbFixedColumns - 1) {
			this.columnDefs[colIndex].resizeKnob.style.left = this.fixedColumnsWidth + "px";
		} else {
			this.columnDefs[colIndex].resizeKnob.style.left = this.columnDefs[colIndex].cumulativeWidth + "px";
		}
	};

	this.fillRemainingLinesAndLaunchSynchronizeRemainingLines = function() {
		var recIndexStart, continueAppend;

		recIndexStart = this.recIndexStop;

		this.recIndexStop = recIndexStart + 5;

		continueAppend = true;

		if (this.recIndexStop > this.currentResponse.results.length) {
			this.recIndexStop = this.currentResponse.results.length;
			continueAppend = false;
		}

		this.appendLines(recIndexStart);

		if (continueAppend) {
			window.setTimeout("EBX_Table.fillRemainingLinesAndLaunchSynchronizeRemainingLines(\"" + this.tableName + "\")", 10);
		} else {
			window.setTimeout("EBX_Table.synchronizeRemainingLinesHeight(\"" + this.tableName + "\")", 10);
		}
	};

	this.synchronizeVisibleLinesHeightAndLaunchFillRemainingLines = function() {
		var fixedRows, mainRows, rowNb, i = 0, rowFixed, rowMain, lastFixedCellIndex, lastMainCellIndex, offsetTopFixed, offsetTopMain, heightRowFixed, heightRowMain;
		fixedRows = this.fixedTable.rows;
		mainRows = this.mainTable.rows;
		rowNb = mainRows.length;

		this.linesHeightsSum = 0;

		if (rowNb !== 0) {
			lastFixedCellIndex = fixedRows[0].cells.length - 1;
			lastMainCellIndex = mainRows[0].cells.length - 1;

			for (; i < rowNb; i++) {
				rowFixed = fixedRows[i];
				rowMain = mainRows[i];

				// synchronize baselines
				offsetTopFixed = rowFixed.cells[lastFixedCellIndex].firstChild.offsetTop;
				offsetTopMain = rowMain.cells[lastMainCellIndex].firstChild.offsetTop;
				if (offsetTopFixed !== offsetTopMain) {
					if (offsetTopFixed < offsetTopMain) {
						rowFixed.cells[lastFixedCellIndex].style.paddingTop = offsetTopMain + "px";
						this.currentRowsProperties[i].offsetTop = offsetTopMain;
					} else {
						rowMain.cells[lastMainCellIndex].style.paddingTop = offsetTopFixed + "px";
						this.currentRowsProperties[i].offsetTop = offsetTopFixed;
					}
				} else {
					this.currentRowsProperties[i].offsetTop = offsetTopMain;
				}
				// severity icon
				if (this.isSeverityColumnDisplayed === true) {
					rowFixed.cells[this.columnDefsByKey["tvColSeverity"].colIndexInDataTable].style.backgroundPosition = "center "
							+ this.currentRowsProperties[i].offsetTop + "px";
				}

				// synchronize heights
				heightRowFixed = rowFixed.offsetHeight;
				heightRowMain = rowMain.offsetHeight;
				if (heightRowFixed > heightRowMain) {
					rowFixed.style.height = heightRowFixed + "px";
					rowMain.style.height = heightRowFixed + "px";
					this.currentRowsProperties[i].height = heightRowFixed;
					this.linesHeightsSum += heightRowFixed;
				} else {
					rowFixed.style.height = heightRowMain + "px";
					rowMain.style.height = heightRowMain + "px";
					this.currentRowsProperties[i].height = heightRowMain;
					this.linesHeightsSum += heightRowMain;
				}
				this.currentRowsProperties[i].cumulativeHeight = this.linesHeightsSum;
				if (this.linesHeightsSum > this.mainScrollerHeight) {
					break;
				}
			}
		}

		this.synchronizeLinesHeightStoppedIndex = i;

		if (this.isAutoWidthNeeded) {
			this.initUndefinedColWidths();
		}

		this.resizeContainers();

		window.setTimeout("EBX_Table.fillRemainingLinesAndLaunchSynchronizeRemainingLines(\"" + this.tableName + "\")", 10);
	};

	this.synchronizeRemainingLinesHeight = function() {
		var fixedRows, mainRows, rowNb, i, rowFixed, rowMain, lastFixedCellIndex, lastMainCellIndex, offsetTopFixed, offsetTopMain, heightRowFixed, heightRowMain, loopCount;
		fixedRows = this.fixedTable.rows;
		mainRows = this.mainTable.rows;
		rowNb = mainRows.length;

		i = this.synchronizeLinesHeightStoppedIndex + 1;
		loopCount = 1;

		if (rowNb !== 0) {
			lastFixedCellIndex = fixedRows[0].cells.length - 1;
			lastMainCellIndex = mainRows[0].cells.length - 1;

			for (; i < rowNb; i++, loopCount++) {
				rowFixed = fixedRows[i];
				rowMain = mainRows[i];

				// synchronize baselines
				offsetTopFixed = rowFixed.cells[lastFixedCellIndex].firstChild.offsetTop;
				offsetTopMain = rowMain.cells[lastMainCellIndex].firstChild.offsetTop;
				if (offsetTopFixed !== offsetTopMain) {
					if (offsetTopFixed < offsetTopMain) {
						rowFixed.cells[lastFixedCellIndex].style.paddingTop = offsetTopMain + "px";
						this.currentRowsProperties[i].offsetTop = offsetTopMain;
					} else {
						rowMain.cells[lastMainCellIndex].style.paddingTop = offsetTopFixed + "px";
						this.currentRowsProperties[i].offsetTop = offsetTopFixed;
					}
				} else {
					this.currentRowsProperties[i].offsetTop = offsetTopMain;
				}
				// severity icon
				if (this.isSeverityColumnDisplayed === true) {
					rowFixed.cells[this.columnDefsByKey["tvColSeverity"].colIndexInDataTable].style.backgroundPosition = "center "
							+ this.currentRowsProperties[i].offsetTop + "px";
				}

				// synchronize heights
				heightRowFixed = rowFixed.offsetHeight;
				heightRowMain = rowMain.offsetHeight;
				if (heightRowFixed > heightRowMain) {
					rowFixed.style.height = heightRowFixed + "px";
					rowMain.style.height = heightRowFixed + "px";
					this.currentRowsProperties[i].height = heightRowFixed;
					this.linesHeightsSum += heightRowFixed;
				} else {
					rowFixed.style.height = heightRowMain + "px";
					rowMain.style.height = heightRowMain + "px";
					this.currentRowsProperties[i].height = heightRowMain;
					this.linesHeightsSum += heightRowMain;
				}
				this.currentRowsProperties[i].cumulativeHeight = this.linesHeightsSum;
				if (loopCount > 5) {
					break;
				}
			}
		}

		if (i < rowNb - 1) {
			this.synchronizeLinesHeightStoppedIndex = i;
			window.setTimeout("EBX_Table.synchronizeRemainingLinesHeight(\"" + this.tableName + "\")", 0);
		} else {
			this.synchronizeLinesCompleted();
		}
	};

	this.synchronizeLinesCompleted = function() {
		// IE8 does not support CSS :last-child
		if (EBX_LayoutManager.isIE8 === true) {
			this.fixedTable.firstChild.lastChild.className += " ie8_last-child";
			this.mainTable.firstChild.lastChild.className += " ie8_last-child";
		}

		if (this.isAutoHeight === true) {
			this.resizeAutoHeight();
		}

		var fnArgObj;
		while (this.functionsToCallWhenTableIsReady.length > 0) {
			fnArgObj = this.functionsToCallWhenTableIsReady.shift();
			fnArgObj.fn.call(this, fnArgObj.arg);
		}

		this.isTableReady = true;
		this.refreshContainerCSSClasses();

		// execute script from current response
		window.setTimeout(this.currentResponse.meta.scriptToExecute, 0);
	};

	this.callFunctionWhenTableIsReady = function(fn, arg) {
		if (this.isTableReady === true) {
			fn.call(this, arg);
			return;
		}

		this.functionsToCallWhenTableIsReady.push({
			fn: fn,
			arg: arg
		});
	};

	this.resizeFromYUILayout = function(yuiResizeEvent) {
		var height = yuiResizeEvent.sizes.center.h;
		var width = yuiResizeEvent.sizes.center.w;

		// is filter pane is not present (left width 0)
		if (yuiResizeEvent.sizes.left.w === 0) {
			width -= EBX_Table.workspaceTableMarginLeft;
		} else {
			width -= EBX_Table.workspaceTableWithFilterPaneMarginLeft;
		}

		this.resize(width, height);
	};

	this.formWorkspaceResizeListener = function(size) {
		// overwrite the last sizeToUseWhenTableIsInit, to use only the last (current)
		this.sizeToUseWhenTableIsInit = size;
		this.callFunctionWhenTableIsInit(this.resizeWhenTableIsInit, null);
	};

	this.resizeWhenTableIsInit = function() {
		// execute this function only if a sizeToUseWhenTableIsInit is available
		// so, the function is executed once, until the sizeToUseWhenTableIsInit is refuel
		if (this.sizeToUseWhenTableIsInit === null) {
			return;
		}

		if (this.isWidgetFullSizeTab === true) {
			this.resizeFromAssociationNodeFullTab(this.sizeToUseWhenTableIsInit);
			return;
		}

		if (this.isWidgetAvailableWidthAutoHeight === true) {
			var targetHeight = this.containerHeight;
			if (this.isAutoHeight === true) {
				targetHeight = this.getAutoHeight();
			}
			this.resizeFromSuperContainerAvailableWidth(targetHeight);
			return;
		}

		// clear sizeToUseWhenTableIsInit
		this.sizeToUseWhenTableIsInit = null;
	};

	this.resizeFromAssociationNodeFullTab = function(size) {
		if (this.associationNodeTableToolbar === undefined) {
			this.associationNodeTableToolbar = EBXUtils.getFirstDirectChildMatchingCSSClass(this.container.parentNode,
					"ebx_AssociationNodeTableToolbar");
			this.container.parentNode.style.paddingLeft = EBX_Form.tabContentPaddingTop + "px";
		}
		var targetWidth = size.w;
		targetWidth -= EBX_Form.tabContentPaddingTop * 2; // padding left and right

		var targetHeight = size.h;
		targetHeight -= this.associationNodeTableToolbar.offsetHeight;
		targetHeight -= EBX_Form.tabContentPaddingTop; // padding bottom

		this.resize(targetWidth, targetHeight);
	};

	this.getAutoHeight = function() {
		var targetHeight = this.headerHeight;
		if (this.getState() === EBX_Table_State.NORMAL) {
			targetHeight += this.linesHeightsSum;
		}
		if (this.mainScrollerHasHScroll === true || this.fixedColumnsHasHScroll == true) {
			targetHeight += this.hScrollHeight;
		}
		return targetHeight;
	};

	this.resizeAutoHeight = function() {
		this.resize(this.containerWidth, this.getAutoHeight());
	};

	this.prepareTableToAutoWidth = function() {
		var targetHeight = this.containerHeight;
		if (this.isAutoHeight === true) {
			targetHeight = this.getAutoHeight();
		}
		// to avoid influence on form width
		// 0 will take the minimum width
		this.resize(0, targetHeight);
	};

	this.resizeFromSuperContainerAvailableWidth = function(targetHeight) {
		if (this.superContainerToFillWidth === undefined) {
			// superContainer/ebx_FieldDecorator/ebx_AssociationNodeTable/tvContainer
			this.superContainerToFillWidth = this.container.parentNode.parentNode.parentNode;
			// is ebx_Input in standard case (if table is in a form line)
			this.isInAFormLineInput = EBXUtils.getFirstParentMatchingCSSClass(this.container, EBX_Form.InputClassName) === this.superContainerToFillWidth;
		}

		var availableWidth = this.superContainerToFillWidth.clientWidth;
		if (this.isInAFormLineInput === true) {
			availableWidth -= EBX_Form.InputPadding * 2;

			// prepare the space at the right of the table in case if the form grows (and vertical scrollbar appear) caused by another component (including auto height)
			// do only that for a table in a form line at the first level
			var formScrollingContainer = EBX_Form.getFormScrollingContainer(this.superContainerToFillWidth);
			// TODO find a more secure way to detect isFormLineAtFirstLevel?
			// this.superContainerToFillWidth = td.ebx_Input < tr.ebx_Field < tbody < table.ebx_FieldList < div = formScrollingContainer
			var isFormLineAtFirstLevel = this.superContainerToFillWidth.parentNode.parentNode.parentNode.parentNode === formScrollingContainer;
			if (isFormLineAtFirstLevel === true) {
				// prepare the space only if the form has not vertical scrollbar yet
				var isScrollingContainerHasVScroll = formScrollingContainer.scrollHeight > formScrollingContainer.clientHeight;
				if (isScrollingContainerHasVScroll === false) {
					// remove form (or another container) vertical scrollbar width, just in case another component grows the form (or another container) and cause a vertical scrollbar
					availableWidth -= this.vScrollWidth;
				}
			}
		}

		this.resize(availableWidth, targetHeight);
	};

	this.endResizeListener = function(yuiEvent) {
		this.resize(yuiEvent.width + 2, yuiEvent.height + 2);
	};

	this.resize = function(width, height) {
		if (width < EBX_Table.minWidth) {
			width = EBX_Table.minWidth;
		}
		if (height < EBX_Table.minHeight) {
			height = EBX_Table.minHeight;
		}
		this.container.style.width = width + "px";
		this.container.style.height = height + "px";
		this.containerWidth = width;
		this.containerHeight = height;
		this.mainScrollerHeight = this.containerHeight - this.headerHeight;
		this.fixedScrollerWrapper.style.height = this.mainScrollerHeight + "px";
		this.mainScroller.style.height = this.mainScrollerHeight + "px";
		this.resizeContainers();
	};

	this.resizeContainers = function() {
		var headerHeightGap, fixedContainersGap, scrollbarWidth, scrollbarHeight, mainContainersWidth, mainScrollerHasHScrollIfNoVScroll, fixedColumnsHasHScrollIfNoVScroll, fixedColumnsCumulativeWidth, mainColumnsCumulativeWidth;

		this.fixedColumnsWidth = this.columnDefs[this.nbFixedColumns - 1].cumulativeWidth;
		fixedColumnsHasHScrollIfNoVScroll = false;
		this.fixedScrollerMaxScrollLeft = 0;
		if (this.fixedColumnsWidth + EBX_Table.mainContainerMinWidth > this.containerWidth) {
			this.fixedColumnsWidth = this.containerWidth - EBX_Table.mainContainerMinWidth;
			this.fixedScrollerMaxScrollLeft = this.columnDefs[this.nbFixedColumns - 1].cumulativeWidth - this.fixedColumnsWidth;
			fixedColumnsHasHScrollIfNoVScroll = true;
		}
		mainContainersWidth = this.containerWidth - this.fixedColumnsWidth;

		mainScrollerHasHScrollIfNoVScroll = this.columnDefs[this.columnDefs.length - 1].cumulativeWidth >= mainContainersWidth;

		scrollbarHeight = 0;
		if (mainScrollerHasHScrollIfNoVScroll === true) {
			scrollbarHeight = this.hScrollHeight;
		}

		this.mainScrollerHasVScroll = this.linesHeightsSum > this.mainScrollerHeight - scrollbarHeight;

		scrollbarWidth = 0;
		if (this.mainScrollerHasVScroll === true) {
			scrollbarWidth = this.vScrollWidth;
		}

		this.fixedColumnsHasHScroll = fixedColumnsHasHScrollIfNoVScroll;
		if (this.mainScrollerHasVScroll === true && fixedColumnsHasHScrollIfNoVScroll === false) {
			fixedColumnsHasHScroll = this.fixedColumnsWidth + EBX_Table.mainContainerMinWidth > this.containerWidth - scrollbarWidth;
		}

		this.mainScrollerHasHScroll = mainScrollerHasHScrollIfNoVScroll;
		if (this.mainScrollerHasVScroll === true && mainScrollerHasHScrollIfNoVScroll === false) {
			this.mainScrollerHasHScroll = this.columnDefs[this.columnDefs.length - 1].cumulativeWidth >= mainContainersWidth - scrollbarWidth;
			if (this.mainScrollerHasHScroll === true) {
				scrollbarHeight = this.hScrollHeight;
			}

			this.mainScrollerHasVScroll = this.linesHeightsSum > this.mainScrollerHeight - scrollbarHeight;
		}

		// synchronize header heights
		// borderTop
		headerHeightGap = 0;
		if (this.mainScrollerHasHScroll === true || this.fixedColumnsHasHScroll == true || this.mainScrollerHasVScroll === true) {
			// no borderTop
			headerHeightGap = -1;
		}
		this.headerFixedContainer.style.height = this.headerHeight + headerHeightGap + "px";
		this.headerMainContainerWrapper.style.height = this.headerHeight + headerHeightGap + "px";
		this.headerMainContainer.style.height = this.headerHeight + headerHeightGap + "px";
		this.headerFixedCells[0].style.height = this.headerHeight + headerHeightGap + "px";
		this.headerMainCells[0].style.height = this.headerHeight + headerHeightGap + "px";

		if (this.fixedColumnsHasHScroll === true) {
			this.fixedScroller.style.height = this.mainScrollerHeight + "px";
			this.fixedScroller.style.overflowX = "scroll";
		} else {
			this.fixedScroller.style.height = this.mainScrollerHeight - scrollbarHeight + "px";
			this.fixedScroller.style.overflowX = "hidden";
		}

		if (YAHOO.env.ua.webkit !== 0) {
			if (this.mainScrollerHasVScroll === true || this.fixedColumnsHasHScroll === true) {
				// default is auto
				this.fixedScroller.style.overflow = "";
			} else {
				this.fixedScroller.style.overflow = "hidden";
			}

			if (this.mainScrollerHasVScroll === true || this.mainScrollerHasHScroll === true) {
				// default is auto
				this.mainScroller.style.overflow = "";
			} else {
				this.mainScroller.style.overflow = "hidden";
			}
		}

		fixedContainersGap = 0;
		if (this.mainScrollerHasHScroll === true || this.fixedColumnsHasHScroll == true || this.mainScrollerHasVScroll === true) {
			// container have left and right borders: remove 2px
			mainContainersWidth -= 2;
			// for compensate left-margin: -1px
			fixedContainersGap = 1;
		} else {
			// left borders for first column: add 1px
			this.fixedColumnsWidth++;
			mainContainersWidth--;
		}

		// -1 is possible, because of the left border
		if (this.fixedColumnsWidth + fixedContainersGap === -1) {
			this.headerFixedContainer.style.width = "0";
		} else {
			this.headerFixedContainer.style.width = this.fixedColumnsWidth + fixedContainersGap + "px";
		}

		this.headerMainContainerWrapper.style.width = mainContainersWidth + "px";

		// -1 is possible, because of the left border
		if (this.fixedColumnsWidth === -1) {
			this.fixedScrollerWrapper.style.width = "0";
		} else {
			this.fixedScrollerWrapper.style.width = this.fixedColumnsWidth + "px";
		}

		// -1 is possible, because of the left border
		if (this.fixedColumnsWidth + fixedContainersGap + scrollbarWidth === -1) {
			this.fixedScroller.style.width = "0";
		} else {
			this.fixedScroller.style.width = this.fixedColumnsWidth + fixedContainersGap + scrollbarWidth + "px";
		}

		this.mainScroller.style.width = mainContainersWidth + "px";

		this.headerMainContainer.style.width = mainContainersWidth - scrollbarWidth + "px";

		if (this.isTableEmpty === true) {
			fixedColumnsCumulativeWidth = this.columnDefs[this.nbFixedColumns - 1].cumulativeWidth;
			if (fixedColumnsCumulativeWidth < 0) {
				// sometimes fixedColumnsCumulativeWidth = -1
				fixedColumnsCumulativeWidth = 0;
			}
			mainColumnsCumulativeWidth = this.columnDefs[this.columnDefs.length - 1].cumulativeWidth;
			if (mainColumnsCumulativeWidth < 0) {
				mainColumnsCumulativeWidth = 0;
			}
			this.fixedScrollMaker.style.width = fixedColumnsCumulativeWidth + fixedContainersGap + "px";
			this.mainScrollMaker.style.width = mainColumnsCumulativeWidth + "px";
		}

		// messageContainer and messageEmpty

		if (this.containerHeight < EBX_Table.heightBelowTableIsSmall) {
			// smallHeight mode
			this.messageContainer.style.paddingTop = "0";
		} else {
			this.messageContainer.style.paddingTop = this.headerHeight + "px";
		}
		this.messageEmpty.style.marginTop = this.headerHeight + "px";
		if (this.mainScrollerHasHScroll === true || this.fixedColumnsHasHScroll == true || this.mainScrollerHasVScroll === true) {
			this.messageContainer.style.width = this.containerWidth + "px";
			this.messageContainer.style.height = this.headerHeight + this.mainScrollerHeight + "px";
			this.messageEmpty.style.width = this.containerWidth + "px";
		} else {
			this.messageContainer.style.width = this.fixedColumnsWidth + this.columnDefs[this.columnDefs.length - 1].cumulativeWidth + "px";
			this.messageContainer.style.height = this.headerHeight + this.linesHeightsSum + "px";
			this.messageEmpty.style.width = this.fixedColumnsWidth + this.columnDefs[this.columnDefs.length - 1].cumulativeWidth + "px";
		}

		this.refreshContainerCSSClasses();

		// ensure the display of separator or last column fixed knob
		this.alignResizeKnob(this.nbFixedColumns - 1);

		this.synchronizeScrollFromFixed();
		EBX_Table.clearSyncScrollFlags(this.tableName);
		this.synchronizeScrolls();
	};

	this.synchronizeScrollFromFixed = function(arg) {
		if (EBX_LayoutManager.browser !== "Chrome" && this.lastSyncScrollWasFromMain === true) {
			return;
		}

		this.lastSyncScrollWasFromFixed = true;

		this.headerFixedContainer.scrollLeft = this.fixedScroller.scrollLeft;
		this.mainScroller.scrollTop = this.fixedScroller.scrollTop;

		if (this.fixedScroller.scrollLeft === this.fixedScrollerMaxScrollLeft) {
			EBXUtils.removeCSSClass(this.container, "tvContainerFixedHScrollLastBorderNotVisible");
		} else {
			EBXUtils.addCSSClass(this.container, "tvContainerFixedHScrollLastBorderNotVisible");
		}

		if (EBX_LayoutManager.browser !== "Chrome") {
			window.clearTimeout(this.clearSyncScrollTimeout);
			this.clearSyncScrollTimeout = window.setTimeout("EBX_Table.clearSyncScrollFlags(\"" + this.tableName + "\")",
					EBX_Table.syncScrollLockDuration);
		}
	};

	this.synchronizeScrolls = function(arg) {
		if (EBX_LayoutManager.browser !== "Chrome" && this.lastSyncScrollWasFromFixed === true) {
			return;
		}

		this.lastSyncScrollWasFromMain = true;

		this.headerMainContainer.scrollLeft = this.mainScroller.scrollLeft;
		this.fixedScroller.scrollTop = this.mainScroller.scrollTop;

		if (EBX_LayoutManager.browser !== "Chrome") {
			window.clearTimeout(this.clearSyncScrollTimeout);
			this.clearSyncScrollTimeout = window.setTimeout("EBX_Table.clearSyncScrollFlags(\"" + this.tableName + "\")",
					EBX_Table.syncScrollLockDuration);
		}
	};

	this.setState = function(state) {
		this.state = state;
		this.refreshContainerCSSClasses();
	};

	this.getState = function() {
		return this.state;
	};

	this.refreshContainerCSSClasses = function() {
		if (this.container === undefined) {
			return;
		}

		var cssClasses = [];

		if (this.isTableEmpty === true) {
			cssClasses.push("tvEmptyTable");
		}

		if (this.fixedColumnsHasHScroll === true) {
			cssClasses.push("tvContainerFixedHScroll");
		}

		if (this.mainScrollerHasHScroll === true) {
			cssClasses.push("tvContainerHScroll");
		}

		if (this.mainScrollerHasVScroll === true) {
			cssClasses.push("tvContainerVScroll");
		}

		// -1 is possible, because of the left border
		if (this.fixedColumnsWidth === 0 || this.fixedColumnsWidth === -1) {
			cssClasses.push("tvContainerNoFixedColumn");
		}

		if (this.isYUIResize === true) {
			cssClasses.push("yui-resize");
		}

		if (this.containerHeight < EBX_Table.heightBelowTableIsSmall) {
			cssClasses.push("tvSmallHeight");
		}

		cssClasses.push(this.state.className);

		if (this.isTableReady === false && this.state === EBX_Table_State.NORMAL) {
			cssClasses.push(EBX_Table.almostReadyCSSClass);
		}

		this.container.className = this.containerCSSClasses + " " + cssClasses.join(" ");
	};

	this.callbackFetchFailure = function(oRequest, oParsedResponse, argument) {

		if (oParsedResponse.status == 401) {
			this.setState(EBX_Table_State.LOGOUT);
			EBX_Loader.gotoTimeoutPage();
			return;
		}

		this.isTableReady = true;
		this.setState(EBX_Table_State.ERROR);
	};

	this.openRecordFromLine = function(event, listenedTableEl) {
		var trEl = event.target;
		if (EBX_LayoutManager.isIE) {
			trEl = event.srcElement;
		}

		// cancel word selection under mouse when double click
		EBXUtils.clearSelection();

		do {
			trEl = EBXUtils.getFirstParentMatchingTagName(trEl, "TR");
		} while (trEl.parentNode.parentNode !== listenedTableEl);

		this.openRecordIndex(trEl.rowIndex);
	};

	this.openCurrentFocusedRecord = function() {
		if (this.currentRowFocusedIndex !== null) {
			this.openRecordIndex(this.currentRowFocusedIndex);
		}
	};

	this.openRecordIndex = function(recordIndex) {
		this.currentRowFocusedIndex = recordIndex;
		this.updateFocusedLine();
		if (this.isOpenInPopup === true) {
			EBXUtils.openInternalPopupLargeSizeHostedClose(this.openInPopupURL
					+ this.currentResponse.results[recordIndex][EBX_Table.keyIndexInResultLine]);
		} else {
			this.container.style.cursor = "wait";
			window.location = EBX_Table.constants.rowEditFormRequest + this.currentResponse.results[recordIndex][EBX_Table.keyIndexInResultLine];
		}
	};

	this.clickOnFixedTableListener = function(event) {
		var targetEl = event.target;
		if (EBX_LayoutManager.isIE) {
			targetEl = event.srcElement;
		}

		if (this.isSelectColumnEnabled === true) {
			if (targetEl.tagName !== undefined && targetEl.tagName === "INPUT" && targetEl.type === "checkbox") {
				// this.fixedScroller > table > tbody > tr > td.tvSelectCell > input[type=checkbox]
				var tdEl = targetEl.parentNode;
				if (tdEl.className === "tvSelectCell" && tdEl.parentNode.parentNode.parentNode.parentNode === this.fixedScroller) {
					if (event.shiftKey === true && this.lastLineSelectedIndex !== null) {
						this.selectRowsFromLastToCheckBox(targetEl);
					} else {
						this.selectRowFromCheckBox(targetEl);
					}
					return;
				}
			}
		}

		if (this.isInheritanceColumnDisplayed) {
			var buttonEl = null;

			if (targetEl.tagName !== undefined && targetEl.tagName === "BUTTON") {
				buttonEl = targetEl;
			} else {
				// the targetEl can also be inside the button (for example the icon)
				buttonEl = EBXUtils.getFirstParentMatchingTagName(targetEl, "BUTTON");
			}

			if (buttonEl !== null) {
				// this.fixedScroller > table > tbody > tr > td.tvInheritanceCell > button
				var tdEl = buttonEl.parentNode;
				if (tdEl.className === "tvInheritanceCell" && tdEl.parentNode.parentNode.parentNode.parentNode === this.fixedScroller) {
					this.focusLineIndex(tdEl.parentNode.rowIndex);
					this.clickOnInheritanceButton(tdEl.parentNode.rowIndex);
					return;
				}
			}
		}

		if (this.isOpenRecordSimpleClick === true) {
			var trEl = targetEl;
			do {
				trEl = EBXUtils.getFirstParentMatchingTagName(trEl, "TR");
			} while (trEl.parentNode.parentNode !== this.fixedTable);

			this.focusLineIndex(trEl.rowIndex);
		}
	};

	this.clickOnMainTableListener = function(event) {
		var targetEl = event.target;
		if (EBX_LayoutManager.isIE) {
			targetEl = event.srcElement;
		}

		if (this.isOpenRecordSimpleClick === true) {
			var trEl = targetEl;
			do {
				trEl = EBXUtils.getFirstParentMatchingTagName(trEl, "TR");
			} while (trEl.parentNode.parentNode !== this.mainTable);

			this.focusLineIndex(trEl.rowIndex);
		}
	};

	this.focusLineIndex = function(lineIndex) {
		// TODO send focused line to server if mouse click

		// toggle focus
		if (this.currentRowFocusedIndex === lineIndex) {
			this.currentRowFocusedIndex = null;
		} else {
			this.currentRowFocusedIndex = lineIndex;
		}

		this.updateFocusedLine();
	};

	this.selectRowFromCheckBox = function(checkboxEl) {
		if (this.isSelectColumnEnabled === false) {
			return;
		}
		var recordIndex = checkboxEl.parentNode.parentNode.rowIndex;

		this.lastLineSelectedIndex = recordIndex;

		this.sendRequestSelectRowInterval(recordIndex, recordIndex, checkboxEl);
	};

	this.selectRowsFromLastToCheckBox = function(checkboxEl) {
		if (this.isSelectColumnEnabled === false) {
			return;
		}
		var lastIndex, currentIndex;

		lastIndex = this.lastLineSelectedIndex;
		currentIndex = checkboxEl.parentNode.parentNode.rowIndex;

		this.lastLineSelectedIndex = currentIndex;

		if (lastIndex < currentIndex) {
			this.sendRequestSelectRowInterval(lastIndex, currentIndex, checkboxEl);
		} else {
			this.sendRequestSelectRowInterval(currentIndex, lastIndex, checkboxEl);
		}
	};

	this.selectCurrentPage = function() {
		if (this.isSelectColumnEnabled === false) {
			return;
		}

		this.lastLineSelectedIndex = null;

		this.sendRequestSelectRowInterval(0, this.currentResponse.results.length - 1, this.checkboxSelectCurrentPage);
	};

	this.selectAllRecords = function() {
		if (this.isSelectColumnEnabled === false) {
			return;
		}

		this.sendRequestSelectAllRows(true);
	};

	this.unselectAllRecords = function() {
		if (this.isSelectColumnEnabled === false) {
			return;
		}

		this.sendRequestSelectAllRows(false);
	};

	this.sendRequestSelectRowInterval = function(fromIndex, toIndex, checkboxClicked) {
		if (this.isSelectColumnEnabled === false) {
			return;
		}
		var parameterBuf;

		parameterBuf = [];

		parameterBuf.push(EBX_Table.constants.tableNameParameter, this.tableName);

		parameterBuf.push(EBX_Table.constants.currentPageIdAjaxParameter, this.currentResponse.meta.currentTablePageId);

		parameterBuf.push(EBX_Table.constants.selectRowFromIndexAjaxParameter, fromIndex);
		parameterBuf.push(EBX_Table.constants.selectRowToIndexAjaxParameter, toIndex);

		if (checkboxClicked.checked) {
			this.dataSourceSelectRows.sendRequest(parameterBuf.join(""), this.getCallbackRowsSelectionObject(checkboxClicked));
		} else {
			this.dataSourceUnselectRows.sendRequest(parameterBuf.join(""), this.getCallbackRowsSelectionObject(checkboxClicked));
		}

		if (checkboxClicked !== this.checkboxSelectCurrentPage) {
			checkboxClicked.parentNode.style.backgroundPosition = "center "
					+ this.currentRowsProperties[checkboxClicked.parentNode.parentNode.rowIndex].offsetTop + "px";
		}

		EBXUtils.addCSSClass(checkboxClicked.parentNode, EBX_Table.CLASS_WAITING_ROW_FOR_SELECTION);
	};

	this.sendRequestSelectAllRows = function(isSelecting) {
		if (this.isSelectColumnEnabled === false) {
			return;
		}
		var parameterBuf;

		parameterBuf = [];

		parameterBuf.push(EBX_Table.constants.tableNameParameter, this.tableName);

		parameterBuf.push(EBX_Table.constants.currentPageIdAjaxParameter, this.currentResponse.meta.currentTablePageId);

		parameterBuf.push(EBX_Table.constants.selectRowFromIndexAjaxParameter, 0);
		parameterBuf.push(EBX_Table.constants.selectRowToIndexAjaxParameter, this.currentResponse.results.length - 1);
		parameterBuf.push(EBX_Table.constants.selectAllRowsAjaxParameter, true);

		var checkboxClicked = this.checkboxSelectCurrentPage;

		if (isSelecting) {
			this.dataSourceSelectRows.sendRequest(parameterBuf.join(""), this.getCallbackRowsSelectionObject(checkboxClicked));
		} else {
			this.dataSourceUnselectRows.sendRequest(parameterBuf.join(""), this.getCallbackRowsSelectionObject(checkboxClicked));
		}

		this.isTableReady = false;
		this.setState(EBX_Table_State.LOADING);
	};

	this.getCallbackRowsSelectionObject = function(checkboxClicked) {
		return {
			success: this.callbackRowsSelectionSuccess,
			failure: this.callbackRowsSelectionFailure,
			scope: this,
			argument: {
				checkboxClicked: checkboxClicked
			}
		};
	};

	this.callbackRowsSelectionSuccess = function(oRequest, oParsedResponse, argument) {
		var currentRowsByKey, responseRows, i, len, key, responseRow, currentRow;

		currentRowsByKey = this.getCurrentResponseResultsByKey();

		responseRows = oParsedResponse.results;

		// update current rows
		for (i = 0, len = responseRows.length; i < len; i++) {
			responseRow = responseRows[i];
			key = responseRow[EBX_Table.keyIndexInResultLine];
			currentRow = currentRowsByKey[key];
			if (currentRow !== undefined) {
				currentRow[EBX_Table.compiledStateIndexInResultLine] = responseRow[EBX_Table.compiledStateIndexInResultLine];
			}
		}

		if (EBX_Table_State.NORMAL !== this.getState()) {
			this.isTableReady = true;
			this.setState(EBX_Table_State.NORMAL);
		}

		this.currentResponse.meta.selectedNumber = oParsedResponse.meta.selectedNumber;

		this.callFunctionWhenTableIsReady(this.endRowsSelectionSuccess, argument.checkboxClicked.parentNode);
	};

	this.endRowsSelectionSuccess = function(selectTdEl) {
		this.updateSelectReport();
		this.updateLinesSelectionCheckbox();
		this.updatePageSelectionCheckbox();

		// TODO CCH refresh severity status?

		EBXUtils.removeCSSClass(selectTdEl, EBX_Table.CLASS_WAITING_ROW_FOR_SELECTION);
	};

	this.callbackRowsSelectionFailure = function(oRequest, oParsedResponse, argument) {

		if (oParsedResponse.status == 401) {
			this.setState(EBX_Table_State.LOGOUT);
			EBX_Loader.gotoTimeoutPage();
			return;
		}

		// Conflict: Wrong table page id
		if (oParsedResponse.status == 409) {
			EBX_UserMessageManager.addMessage(EBX_Table.messages.table_warning_select_pageChanged, EBX_UserMessageManager.WARNING);
		}

		if (EBX_Table_State.NORMAL !== this.getState()) {
			this.isTableReady = true;
			this.setState(EBX_Table_State.NORMAL);
		}

		this.callFunctionWhenTableIsReady(this.endRowsSelectionFailure, argument.checkboxClicked.parentNode);
	};

	this.endRowsSelectionFailure = function(selectTdEl) {
		this.updateLinesSelectionCheckbox();
		this.updatePageSelectionCheckbox();

		EBXUtils.removeCSSClass(selectTdEl, EBX_Table.CLASS_WAITING_ROW_FOR_SELECTION);
	};

	this.sendRequestSetTablePageSize = function(newPageSize, buttonID, optionIndex) {
		var parameterBuf;

		parameterBuf = [];

		parameterBuf.push(EBX_Table.constants.tableNameParameter, this.tableName);

		parameterBuf.push(EBX_Table.constants.tablePageSize, newPageSize);

		this.dataSourceSetTablePageSize.sendRequest(parameterBuf.join(""), this.getCallbackSetTablePageSizeObject(buttonID, optionIndex));

		this.isTableReady = false;
		this.setState(EBX_Table_State.LOADING);
	};

	this.getCallbackSetTablePageSizeObject = function(buttonID, optionIndex) {
		return {
			success: this.callbackSetTablePageSizeSuccess,
			failure: this.callbackSetTablePageSizeFailure,
			scope: this,
			argument: {
				buttonID: buttonID,
				optionIndex: optionIndex
			}
		};
	};

	this.callbackSetTablePageSizeSuccess = function(oRequest, oParsedResponse, argument) {
		var messages = oParsedResponse.results;
		if (messages !== undefined) {
			for ( var i = 0; i < messages.length; i++) {
				var message = messages[i].message;
				var severity = messages[i].severity;
				if (severity === undefined) {
					severity = EBX_UserMessageManager.INFO;
				}
				EBX_UserMessageManager.addMessage(message, severity);
			}
		}
		this.refreshCurrentPage();

		var menuItems = EBX_ButtonUtils.menuButtonsMenu[argument.buttonID];
		menuItems = menuItems[0];

		for ( var i = 0; i < menuItems.length; i++) {
			if (i === argument.optionIndex) {
				menuItems[i].checked = true;
			} else {
				menuItems[i].checked = false;
			}
		}
	};

	this.callbackSetTablePageSizeFailure = function(oRequest, oParsedResponse, argument) {

		if (oParsedResponse.status == 401) {
			this.setState(EBX_Table_State.LOGOUT);
			EBX_Loader.gotoTimeoutPage();
			return;
		}

		if (EBX_Table_State.NORMAL !== this.getState()) {
			this.isTableReady = true;
			this.setState(EBX_Table_State.NORMAL);
		}
	};

	this.updateLinesSelectionCheckbox = function() {
		if (this.isSelectColumnEnabled === false) {
			return;
		}
		var fixedRows, mainRows, i, len, isSelected;

		fixedRows = this.fixedTable.rows;
		mainRows = this.mainTable.rows;

		for (i = 0, len = this.currentResponse.results.length; i < len; i++) {
			isSelected = this.currentResponse.results[i][EBX_Table.compiledStateIndexInResultLine].charAt(EBX_Table.compiledRowStateIndexSelected) === EBX_Table.compiledRowStateSelected;
			this.getSelectCheckbox(fixedRows[i]).checked = isSelected;
			if (isSelected === true) {
				EBXUtils.addCSSClass(fixedRows[i], "tv_SelectedRow");
				EBXUtils.addCSSClass(mainRows[i], "tv_SelectedRow");
			} else {
				EBXUtils.removeCSSClass(fixedRows[i], "tv_SelectedRow");
				EBXUtils.removeCSSClass(mainRows[i], "tv_SelectedRow");
			}
		}
	};

	this.getSelectCheckbox = function(tableRowEl) {
		if (this.currentRowsProperties[tableRowEl.rowIndex].selectCheckbox === undefined) {
			this.currentRowsProperties[tableRowEl.rowIndex].selectCheckbox = EBXUtils.getFirstDirectChildMatchingTagName(tableRowEl.firstChild,
					"input");
		}
		return this.currentRowsProperties[tableRowEl.rowIndex].selectCheckbox;
	};

	this.updatePageSelectionCheckbox = function() {
		if (this.isSelectColumnEnabled === false) {
			return;
		}
		if (this.checkboxSelectCurrentPage === null) {
			return;
		}

		if (this.currentResponse.results === undefined || this.currentResponse.results.length === 0) {
			this.checkboxSelectCurrentPage.checked = false;
			this.checkboxSelectCurrentPage.disabled = true;
		} else {
			this.checkboxSelectCurrentPage.checked = this.pageSelectionCheckboxChecked();
			this.checkboxSelectCurrentPage.disabled = false;
		}
	};
	// returns true only if all records are selected
	this.pageSelectionCheckboxChecked = function() {
		if (this.isSelectColumnEnabled === false) {
			return false;
		}
		var i, len;

		for (i = 0, len = this.currentResponse.results.length; i < len; i++) {
			if (this.currentResponse.results[i][EBX_Table.compiledStateIndexInResultLine].charAt(EBX_Table.compiledRowStateIndexSelected) !== EBX_Table.compiledRowStateSelected) {
				return false;
			}
		}
		return true;
	};

	this.getCurrentResponseResultsByKey = function() {
		if (this.currentResponseResultsByKey === null) {
			this.currentResponseResultsByKey = [];
			var results = this.currentResponse.results;
			for ( var i = 0, len = results.length; i < len; i++) {
				this.currentResponseResultsByKey[results[i][EBX_Table.keyIndexInResultLine]] = results[i];
			}
		}
		return this.currentResponseResultsByKey;
	};

	this.clickOnInheritanceButton = function(recordIndex) {
		var inheritanceState = this.currentRowsProperties[recordIndex].inheritanceState;

		if (inheritanceState.dataSource === undefined) {
			return;
		}

		if (inheritanceState.dataSource !== undefined) {
			if (confirm(inheritanceState.confirmMessage) === false) {
				return;
			}
		}

		this.currentRowFocusedIndex = recordIndex;
		this.updateFocusedLine();
		this.sendRequestChangeInheritanceState(inheritanceState, recordIndex);
	};

	this.sendRequestChangeInheritanceState = function(inheritanceState, recordIndex) {

		var record = this.currentResponse.results[recordIndex][EBX_Table.keyIndexInResultLine];
		var parameterBuf;

		parameterBuf = [];
		parameterBuf.push(EBX_Table.constants.tableNameParameter, this.tableName);

		parameterBuf.push(EBX_Table.constants.rowSelectionParameter, record);

		inheritanceState.dataSource.sendRequest(parameterBuf.join(""), this.getCallbackChangeInheritanceState(recordIndex, inheritanceState));
	};

	this.getCallbackChangeInheritanceState = function(recordIndex, inheritanceState) {
		return {
			success: this.callbackChangeInheritanceStateSuccess,
			failure: this.callbackChangeInheritanceStateFailure,
			scope: this,
			argument: {
				recordIndex: recordIndex,
				inheritanceState: inheritanceState
			}
		};
	};

	this.callbackChangeInheritanceStateSuccess = function(oRequest, oParsedResponse, argument) {
		var messages = oParsedResponse.results;
		if (messages !== undefined) {
			for ( var i = 0; i < messages.length; i++) {
				var message = messages[i].message;
				var severity = messages[i].severity;
				if (severity === undefined) {
					severity = EBX_UserMessageManager.INFO;
				}
				EBX_UserMessageManager.addMessage(message, severity);
			}
		}

		if (argument.inheritanceState.isOpeningRecord === true) {
			this.openRecordIndex(argument.recordIndex);
			return;
		}

		this.refreshCurrentPage();
	};

	this.callbackChangeInheritanceStateFailure = function(oRequest, oParsedResponse, argument) {

		if (oParsedResponse.status == 401) {
			this.setState(EBX_Table_State.LOGOUT);
			EBX_Loader.gotoTimeoutPage();
			return;
		}
	};

	this.updateFocusedLine = function() {
		var focusFlag = this.getFocusFlag(), i;

		// TODO store focus in response

		if (this.currentRowFocusedIndex === null) {
			focusFlag.style.display = "none";
			if (this.isOpenRecordSimpleClick === true) {
				for (i = this.buttonsOpen.length - 1; i >= 0; i--) {
					EBXUtils.removeCSSClass(this.buttonsOpen[i], "ebx_OpenRecordEnabled");
				}
			}
			return;
		}

		if (this.isOpenRecordSimpleClick === true) {
			for (i = this.buttonsOpen.length - 1; i >= 0; i--) {
				EBXUtils.addCSSClass(this.buttonsOpen[i], "ebx_OpenRecordEnabled");
			}
		}

		// if the user focuses a row which is not synchronized yet, the height (and cumulativeHeight) is unknown
		if (this.currentRowsProperties[this.currentRowFocusedIndex].height === undefined) {
			// try to focus later, when the table is ready (and lines synced)
			this.callFunctionWhenTableIsReady(this.updateFocusedLine);
			return;
		}

		focusFlag.style.display = "";

		focusFlag.style.height = this.currentRowsProperties[this.currentRowFocusedIndex].height + "px";

		if (this.currentRowFocusedIndex > 0) {
			focusFlag.style.top = this.currentRowsProperties[this.currentRowFocusedIndex - 1].cumulativeHeight + "px";
		} else {
			focusFlag.style.top = 0 + "px";
		}
	};

	this.getFocusFlag = function() {
		if (this.focusFlag === undefined) {
			this.focusFlag = document.createElement("div");
			this.focusFlag.className = "tvFocusFlag";
		}
		if (this.fixedColumnsWidth <= 0) {
			this.mainScroller.appendChild(this.focusFlag);
		} else {
			this.fixedScroller.appendChild(this.focusFlag);
		}
		return this.focusFlag;
	};

	this.clickOnHeaderTableListener = function(event) {
		var targetEl = event.target;
		if (EBX_LayoutManager.isIE) {
			targetEl = event.srcElement;
		}
		var thEl = targetEl;
		if (thEl.tagName !== "TH") {
			thEl = EBXUtils.getFirstParentMatchingTagName(thEl, "TH");
		}

		if (thEl !== null) {
			var colIndex = thEl.cellIndex;
			// this.headerFixed/headerMain > tbody > tr > th
			if (thEl.parentNode.parentNode.parentNode === this.headerMain) {
				colIndex += this.nbFixedColumns;
			}

			if (this.columnDefs[colIndex].sortable === true) {
				// avoid select and inheritance and validation cells
				var indexOfFirstDataColumn = this.columnDefsByKey["tvColSeverity"].colIndexInHeader + 1;
				this.sortColumn(colIndex - indexOfFirstDataColumn);
			}
		}
	};

	this.sortColumn = function(columnIndex) {
		this.isTableReady = false;
		this.setState(EBX_Table_State.LOADING);
		this.dataSourceFetch.sendRequest(EBX_Table.constants.tableNameParameter + this.tableName + EBX_Table.constants.sortColumnIndexParameter
				+ columnIndex, this.getCallbackFetchObject());
	};

	this.getResizeColumnBar = function() {
		if (this.resizeColumnBar === undefined) {
			this.resizeColumnBar = document.createElement("div");
			this.resizeColumnBar.className = "ebx_ResizeColumnBar";
			this.container.appendChild(this.resizeColumnBar);
			YAHOO.util.Event.addListener(this.resizeColumnBar, "mouseout", this.mouseOutResizeBarListener, null, this);
			YAHOO.util.Event.addListener(this.resizeColumnBar, "mousedown", this.mouseDownResizeBarListener, null, this);
			YAHOO.util.Event.addListener(this.resizeColumnBar, "mouseup", this.mouseUpResizeBarListener, null, this);
			YAHOO.util.Event.addListener(this.resizeColumnBar, "dblclick", this.autoResizeColumn, null, this);
			this.resizeColumnBarDD = new YAHOO.util.DD(this.resizeColumnBar);
			this.resizeColumnBarDD.subscribe("startDragEvent", this.startDragResizeBarListener, null, this);
			this.resizeColumnBarDD.subscribe("dragEvent", this.dragResizeBarListener, null, this);
			this.resizeColumnBarDD.subscribe("endDragEvent", this.endDragResizeBarListener, null, this);
		}
		return this.resizeColumnBar;
	};

	this.mouseOverResizeKnobListener = function(event, colIndex) {
		if (this.isDraggingResizeBar === true) {
			return;
		}

		var resizeColumnBar = this.getResizeColumnBar();

		var left = this.columnDefs[colIndex].cumulativeWidth;
		if (colIndex >= this.nbFixedColumns) {
			// add fixed column width
			left += this.fixedColumnsWidth;
			// substract left scroll main
			left -= this.mainScroller.scrollLeft;

			// if no scrolls
			if (this.mainScrollerHasHScroll === false && this.fixedColumnsHasHScroll === false && this.mainScrollerHasVScroll === false) {
				left--;
			}
		} else {
			// substract left scroll fixed
			left -= this.fixedScroller.scrollLeft;
		}

		var resizeColumnBarHeight = this.containerHeight;
		if (this.mainScrollerHasHScroll === true || this.fixedColumnsHasHScroll === true) {
			/* 1 for top border */
			resizeColumnBarHeight -= this.hScrollHeight + 1;
		} else if (this.mainScrollerHasHScroll === false) {
			// if no scrolls : fits the table height only, not container
			resizeColumnBarHeight = this.headerHeight + this.linesHeightsSum;
		}

		resizeColumnBar.style.height = resizeColumnBarHeight + "px";
		resizeColumnBar.style.left = left + "px";
		resizeColumnBar.style.display = "block";

		this.currentColIndexResize = colIndex;

		if (this.columnDefs[this.currentColIndexResize].width !== undefined) {
			this.colWidthBeforeResize = this.columnDefs[this.currentColIndexResize].width;
		} else {
			this.colWidthBeforeResize = this.columnDefs[this.currentColIndexResize].headerWidth;
		}

		this.resizeBarMinLeft = left - this.colWidthBeforeResize + EBX_Table.minWidthColumn;

		this.startingResizeOffsetLeft = resizeColumnBar.offsetLeft;
	};

	this.mouseOutResizeKnobListener = function(event, colIndex) {
		if (document.elementFromPoint(event.clientX, event.clientY) === this.getResizeColumnBar()) {
			return;
		}
		if (this.isMouseDownOnResizeBar === true) {
			return;
		}
		this.hideResizeBar();
	};

	this.hideResizeBar = function() {
		if (this.isDraggingResizeBar === true) {
			return;
		}
		this.getResizeColumnBar().style.display = "none";
		this.isMouseDownOnResizeBar = false;
	};

	this.mouseDownResizeBarListener = function(event) {
		this.isMouseDownOnResizeBar = true;
	};

	this.mouseUpResizeBarListener = function(event) {
		if (this.isDraggingResizeBar === true) {
			return;
		}
		this.isMouseDownOnResizeBar = false;
	};

	this.mouseOutResizeBarListener = function(event) {
		if (this.isMouseDownOnResizeBar === true) {
			return;
		}
		this.hideResizeBar();
	};

	this.startDragResizeBarListener = function(dragCoords) {
		this.isDraggingResizeBar = true;
	};

	this.dragResizeBarListener = function(event) {
		this.resizeColumnBar.style.top = 0;

		var offsetLeft = this.resizeColumnBar.offsetLeft;
		if (offsetLeft < this.resizeBarMinLeft) {
			this.resizeColumnBar.style.left = this.resizeBarMinLeft + "px";
			offsetLeft = this.resizeColumnBar.offsetLeft;
		}
		/* // real-time resize
		 var delta = offsetLeft - this.startingResizeOffsetLeft;
		 this.setColumnWidth(this.currentColIndexResize, this.colWidthBeforeResize + delta);
		 */
	};

	this.endDragResizeBarListener = function(event) {
		if (this.isDraggingResizeBar === false) {
			return;
		}
		this.isDraggingResizeBar = false;
		var delta = this.resizeColumnBar.offsetLeft - this.startingResizeOffsetLeft;
		this.hideResizeBar();
		if (this.setColumnWidth(this.currentColIndexResize, this.colWidthBeforeResize + delta) === true) {
			this.sendColumnWidth(this.currentColIndexResize);
		}
	};

	this.autoResizeColumn = function(event) {
		var headerTable, dataTable, colIndexHeader, colIndexTable, width, tdWidth;

		this.hideResizeBar();

		if (this.currentColIndexResize < this.nbFixedColumns) {
			headerTable = this.headerFixed;
			dataTable = this.fixedTable;
			colIndexHeader = this.currentColIndexResize;
		} else {
			headerTable = this.headerMain;
			dataTable = this.mainTable;
			colIndexHeader = this.currentColIndexResize - this.nbFixedColumns;
		}
		colIndexTable = this.columnDefs[this.currentColIndexResize].colIndexInDataTable;

		// remove width of th and td
		headerTable.rows[0].cells[colIndexHeader].style.width = "";
		if (this.isTableEmpty === false) {
			dataTable.rows[0].cells[colIndexTable].style.width = "";
		}

		// set table layout to auto
		headerTable.style.tableLayout = "auto";
		if (this.isTableEmpty === false) {
			dataTable.style.tableLayout = "auto";
		}
		if (YAHOO.env.ua.webkit !== 0) {
			EBXUtils.addCSSClass(headerTable, "tvTableLayoutAutoForWebkit");
			if (this.isTableEmpty === false) {
				EBXUtils.addCSSClass(dataTable, "tvTableLayoutAutoForWebkit");
			}
		}

		// get th width
		width = headerTable.rows[0].cells[colIndexHeader].offsetWidth;

		if (this.isTableEmpty === false) {
			// get td width
			tdWidth = dataTable.rows[0].cells[colIndexTable].offsetWidth;

			// choose the biggest
			if (width < tdWidth) {
				width = tdWidth;
			}
		}

		// reset table layout to manual
		headerTable.style.tableLayout = "";
		if (this.isTableEmpty === false) {
			dataTable.style.tableLayout = "";
		}
		if (YAHOO.env.ua.webkit !== 0) {
			EBXUtils.removeCSSClass(headerTable, "tvTableLayoutAutoForWebkit");
			if (this.isTableEmpty === false) {
				EBXUtils.removeCSSClass(dataTable, "tvTableLayoutAutoForWebkit");
			}
		}

		if (this.setColumnWidth(this.currentColIndexResize, width) === true) {
			this.sendColumnWidth(this.currentColIndexResize);
		}
	};

	this.setSeverityColumnDisplayed = function(isDisplayed) {
		if (isDisplayed !== true && isDisplayed !== false) {
			return;
		}
		if (isDisplayed === true && this.columnDefsByKey["tvColSeverity"].width === EBX_Table.statusColumnWidth) {
			return;
		}
		if (isDisplayed === false && this.columnDefsByKey["tvColSeverity"].width === 0) {
			return;
		}

		var diff, i, indexInDataTableGap;

		if (isDisplayed === true) {
			this.columnDefsByKey["tvColSeverity"].width = EBX_Table.statusColumnWidth;
			this.columnDefsByKey["tvColSeverity"].colIndexInDataTable = this.columnDefsByKey["tvColSeverity"].colIndexInHeader;
			diff = EBX_Table.statusColumnWidth;
			indexInDataTableGap = 1;
			this.headerFixedCells[this.columnDefsByKey["tvColSeverity"].colIndexInHeader].style.display = "";

			// disable border-right
			if (this.isSelectColumnEnabled === true && this.isInheritanceColumnDisplayed === false) {
				this.headerFixedCells[this.columnDefsByKey["tvColSelect"].colIndexInHeader].style.borderRight = "none";
			} else if (this.isInheritanceColumnDisplayed === true) {
				this.headerFixedCells[this.columnDefsByKey["tvColInheritance"].colIndexInHeader].style.borderRight = "none";
			}

			// set first th visible = severity
			if (this.isSelectColumnEnabled === false && this.isInheritanceColumnDisplayed === false) {
				EBXUtils.addCSSClass(this.headerFixedCells[this.columnDefsByKey["tvColSeverity"].colIndexInHeader], "tv_thFixed_firstVisible");
				if (this.columnDefsByKey["tvColSeverity"].colIndexInHeader + 1 < this.nbFixedColumns) {
					EBXUtils.removeCSSClass(this.headerFixedCells[this.columnDefsByKey["tvColSeverity"].colIndexInHeader + 1],
							"tv_thFixed_firstVisible");
				}
			}
		} else {
			this.columnDefsByKey["tvColSeverity"].width = 0;
			this.columnDefsByKey["tvColSeverity"].colIndexInDataTable = undefined;
			diff = -EBX_Table.statusColumnWidth;
			indexInDataTableGap = -1;
			this.headerFixedCells[this.columnDefsByKey["tvColSeverity"].colIndexInHeader].style.display = "none";

			// restore border-right
			if (this.isSelectColumnEnabled === true && this.isInheritanceColumnDisplayed === false) {
				this.headerFixedCells[this.columnDefsByKey["tvColSelect"].colIndexInHeader].style.borderRight = "";
			} else if (this.isInheritanceColumnDisplayed === true) {
				this.headerFixedCells[this.columnDefsByKey["tvColInheritance"].colIndexInHeader].style.borderRight = "";
			}

			// set first th visible = 1st data th fixed
			if (this.isSelectColumnEnabled === false && this.isInheritanceColumnDisplayed === false) {
				EBXUtils.removeCSSClass(this.headerFixedCells[this.columnDefsByKey["tvColSeverity"].colIndexInHeader], "tv_thFixed_firstVisible");
				if (this.columnDefsByKey["tvColSeverity"].colIndexInHeader + 1 < this.nbFixedColumns) {
					EBXUtils
							.addCSSClass(this.headerFixedCells[this.columnDefsByKey["tvColSeverity"].colIndexInHeader + 1], "tv_thFixed_firstVisible");
				}
			}
		}

		this.columnDefsByKey["tvColSeverity"].cumulativeWidth += diff;

		this.isSeverityColumnDisplayed = isDisplayed;

		for (i = this.columnDefsByKey["tvColSeverity"].colIndexInHeader + 1; i < this.nbFixedColumns; i++) {
			this.columnDefs[i].cumulativeWidth += diff;
			this.columnDefs[i].colIndexInDataTable += indexInDataTableGap;
			this.alignResizeKnob(i);
		}

		this.resizeContainers();
	};

	this.getResizeColumnBarTablet = function() {
		if (this.resizeColumnBarTablet === undefined) {
			this.resizeColumnBarTablet = document.createElement("div");
			this.resizeColumnBarTablet.className = "ebx_ResizeColumnBar";
			this.container.appendChild(this.resizeColumnBarTablet);
		}
		return this.resizeColumnBarTablet;
	};

	this.gestureStartResizeColumnListener = function(event, colIndex) {
		if (!EBX_LayoutManager.getGestureResizePermission(EBX_LayoutManager.tableColumnResizeId)) {
			return;
		}

		if (this.currentColIndexResize === undefined || this.currentColIndexResize === null) {
			this.currentColIndexResize = colIndex;
		} else {
			return;
		}

		event.preventDefault();

		var left = this.columnDefs[colIndex].cumulativeWidth;
		if (colIndex >= this.nbFixedColumns) {
			// add fixed column width
			left += this.fixedColumnsWidth;
			// substract left scroll main
			left -= this.mainScroller.scrollLeft;

			// if no scrolls
			if (this.mainScrollerHasHScroll === false && this.fixedColumnsHasHScroll === false && this.mainScrollerHasVScroll === false) {
				left--;
			}
		} else {
			// substract left scroll fixed
			left -= this.fixedScroller.scrollLeft;
		}

		var resizeColumnBar = this.getResizeColumnBarTablet();

		var resizeColumnBarHeight = this.containerHeight;
		if (this.mainScrollerHasHScroll === true || this.fixedColumnsHasHScroll === true) {
			/* 1 for top border */
			resizeColumnBarHeight -= this.hScrollHeight + 1;
		} else if (this.mainScrollerHasHScroll === false) {
			// if no scrolls : fits the table height only, not container
			resizeColumnBarHeight = this.headerHeight + this.linesHeightsSum;
		}

		resizeColumnBar.style.height = resizeColumnBarHeight + "px";
		resizeColumnBar.style.left = left + "px";
		resizeColumnBar.style.display = "block";

		if (this.columnDefs[this.currentColIndexResize].width !== undefined) {
			this.colWidthBeforeResize = this.columnDefs[this.currentColIndexResize].width;
		} else {
			this.colWidthBeforeResize = this.columnDefs[this.currentColIndexResize].headerWidth;
		}

		this.columnOffsetLeft = left - this.colWidthBeforeResize;

		this.startingResizeOffsetLeft = resizeColumnBar.offsetLeft;
	};

	this.gestureChangeResizeColumnListener = function(event, colIndex) {
		if (!EBX_LayoutManager.isCurrentGestureResize(EBX_LayoutManager.tableColumnResizeId)) {
			return;
		}

		if (this.currentColIndexResize !== colIndex) {
			return;
		}

		event.preventDefault();

		var offsetLeft = this.columnOffsetLeft + this.colWidthBeforeResize * event.scale;

		if (offsetLeft < this.columnOffsetLeft + EBX_Table.minWidthColumn) {
			offsetLeft = this.columnOffsetLeft + EBX_Table.minWidthColumn;
		}

		this.getResizeColumnBarTablet().style.left = offsetLeft + "px";
	};

	this.gestureEndResizeColumnListener = function(event, colIndex) {
		if (!EBX_LayoutManager.isCurrentGestureResize(EBX_LayoutManager.tableColumnResizeId)) {
			return;
		}

		if (this.currentColIndexResize !== colIndex) {
			return;
		}

		event.preventDefault();

		this.getResizeColumnBarTablet().style.display = "none";

		var colWidth = this.colWidthBeforeResize * event.scale;
		if (colWidth < EBX_Table.minWidthColumn) {
			colWidth = EBX_Table.minWidthColumn;
		}

		if (this.setColumnWidth(this.currentColIndexResize, colWidth) === true) {
			this.sendColumnWidth(this.currentColIndexResize);
		}

		this.currentColIndexResize = null;

		EBX_LayoutManager.releaseCurrentGestureResize();
	};

	this.setColumnWidth = function(colIndex, width) {
		var diff, i, stop, previousWidth;

		if (width < EBX_Table.minWidthColumn) {
			return false;
		}

		if (this.columnDefs[this.currentColIndexResize].width !== undefined) {
			previousWidth = this.columnDefs[this.currentColIndexResize].width;
		} else {
			previousWidth = this.columnDefs[this.currentColIndexResize].headerWidth;
		}

		diff = width - previousWidth;

		this.columnDefs[colIndex].width = width;

		if (colIndex < this.nbFixedColumns) {
			stop = this.nbFixedColumns;
		} else {
			stop = this.columnDefs.length;
		}

		for (i = colIndex; i < stop; i++) {
			this.columnDefs[i].cumulativeWidth += diff;
			this.alignResizeKnob(i);
		}

		if (colIndex < this.nbFixedColumns) {
			this.headerFixedCells[colIndex].style.width = width + "px";
			if (this.fixedTable.rows[0] !== undefined) {
				this.fixedTable.rows[0].cells[this.columnDefs[colIndex].colIndexInDataTable].style.width = width + "px";
			}
		} else {
			this.headerMainCells[colIndex - this.nbFixedColumns].style.width = width + "px";
			if (this.mainTable.rows[0] !== undefined) {
				this.mainTable.rows[0].cells[this.columnDefs[colIndex].colIndexInDataTable].style.width = width + "px";
			}
		}

		this.resizeContainers();

		return true;
	};

	this.sendColumnWidth = function(colIndex) {
		var width = this.columnDefs[colIndex].width;
		width = Math.round(width);
		this.dataSourceSetColumnWidth.sendRequest(EBX_Table.constants.tableNameParameter + this.tableName
				+ EBX_Table.constants.columnKeyForWidthParameter + this.columnDefs[colIndex].key + EBX_Table.constants.widthForColumnParameter
				+ width, null);
	};

	this.sendInitAllColumnWidths = function() {
		var i, len, widths;

		widths = [];
		// avoid select and inheritance and validation cells
		for (i = this.columnDefsByKey["tvColSeverity"].colIndexInHeader + 1, len = this.columnDefs.length; i < len; i++) {
			widths.push(Math.round(this.columnDefs[i].width));
		}

		this.dataSourceInitAllColumnWidths.sendRequest(EBX_Table.constants.tableNameParameter + this.tableName
				+ EBX_Table.constants.widthsForColumnsParameter + widths.join(","), null);
	};

};
