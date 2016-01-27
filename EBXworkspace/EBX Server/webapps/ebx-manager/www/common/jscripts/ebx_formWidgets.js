function EBX_FormWidgets() {}

/* Map */
EBX_FormWidgets.messages = {};

EBX_FormWidgets.inputWithEmptyButton_CSSClass = "ebx_InputWithEmptyButton";
EBX_FormWidgets.emptyButtonHidden_CSSClass = "ebx_EmptyButtonHidden";
EBX_FormWidgets.inputFocusRedirector_CSSClass = "ebx_InputFocusRedirector";

/** *START Multi Occurrences ** */
function EBX_MultiOccurrences() {}

EBX_MultiOccurrences.occurrenceLineSuffix = "_occurrenceLine";
EBX_MultiOccurrences.addAnOccurrence = function(listId) {
	var newLine = EBX_MultiOccurrences.getNextFreeOccurence(listId);
	if (newLine === null) {
		alert(EBX_FormWidgets.messages.UIComponent_UIMultiOccurrencesEditor_AddOccurrence_Disable);
		return;
	}

	EBX_MultiOccurrences.getLineActionFlag(newLine).value = EBX_MultiOccurrences.ActionInsert;

	newLine.style.display = "";

	var newLineId = newLine.id;
	var webName = newLineId.substring(0, newLineId.length - EBX_MultiOccurrences.occurrenceLineSuffix.length);

	EBX_Form.focus(webName);

	EBX_MultiOccurrences.refreshDisplayAddButton(listId);
};

EBX_MultiOccurrences.getNextFreeOccurence = function(listId) {
	var line = document.getElementById(listId).firstChild;
	// get the first candidate line
	if (line === null) {
		return null;
	}
	do {
		if (!line.id) {
			continue;
		}
		if (!EBX_MultiOccurrences.getLineActionFlag(line)) {
			continue;
		}
		if (EBX_MultiOccurrences.getLineActionFlag(line).value == EBX_MultiOccurrences.ActionCandidate) {
			return line;
		}
	} while ((line = line.nextSibling));

	return null;
};

/**
 * @return an <input type="hidden"/> element which wears the action flag in its
 *         value
 */
EBX_MultiOccurrences.getLineActionFlag = function(line) {
	return document.getElementById(line.id + EBX_MultiOccurrences.ActionFlagSuffix);
};

EBX_MultiOccurrences.refreshDisplayAddButton = function(listId) {
	var addActionDiv = document.getElementById(listId + EBX_MultiOccurrences.addButtonSuffix);
	if (addActionDiv === null) {
		return;
	}

	var maxQty = EBX_MultiOccurrences.getMaxOccurenceAllowed(listId);

	var displayActionDiv = false;

	if (maxQty < 0) {
		displayActionDiv = true;
	} else {
		var currentQty = EBX_MultiOccurrences.countDefinedOccurenceQty(listId);

		// no need to display the add button when the currentQty is equal to maxQty
		if (currentQty < maxQty) {
			displayActionDiv = true;
		}
	}

	addActionDiv.style.display = displayActionDiv ? "" : "none";
};

EBX_MultiOccurrences.MaxOccurencesAllowed = [];
EBX_MultiOccurrences.setMaxOccurenceAllowed = function(listId, maxOccurenceAllowed) {
	EBX_MultiOccurrences.MaxOccurencesAllowed[listId] = maxOccurenceAllowed;
};
EBX_MultiOccurrences.getMaxOccurenceAllowed = function(listId) {
	var ret = EBX_MultiOccurrences.MaxOccurencesAllowed[listId];

	if (!ret) {
		ret = -1;
	}

	return ret;
};

EBX_MultiOccurrences.countDefinedOccurenceQty = function(listId) {
	var list = document.getElementById(listId);
	var line = list.firstChild;
	var qty = 0;

	if (line !== null) {
		do {
			if (!line.id) {
				continue;
			}
			if (!EBX_MultiOccurrences.getLineActionFlag(line)) {
				continue;
			}
			if (EBX_MultiOccurrences.getLineActionFlag(line).value == EBX_MultiOccurrences.ActionCandidate) {
				continue;
			}
			qty++;
		} while ((line = line.nextSibling));
	}

	return qty;
};

EBX_MultiOccurrences.ButtonDeleteSuffix = "_delete";
EBX_MultiOccurrences.LineContentClassName = "ebx_OccurrenceEditorContent";
EBX_MultiOccurrences.LineContentHiddenModeClassName = "ebx_OccurrenceEditorContentHidden";
EBX_MultiOccurrences.deleteLine = function(listId, lineId) {
	var line = document.getElementById(lineId);
	EBXUtils.addCSSClass(EBXUtils.getFirstRecursiveChildMatchingCSSClass(line, EBX_MultiOccurrences.LineContentClassName),
			EBX_MultiOccurrences.LineContentHiddenModeClassName);

	EBX_MultiOccurrences.getLineActionFlag(line).value = EBX_MultiOccurrences.ActionDelete;

	EBX_MultiOccurrences.refreshDisplayAddButton(listId);

	var button = document.getElementById(lineId + EBX_MultiOccurrences.ButtonDeleteSuffix);
	if (button) {
		button.tabindex = 0;
	}
};
EBX_MultiOccurrences.undeleteLine = function(listId, lineId) {
	var line = document.getElementById(lineId);
	EBXUtils.removeCSSClass(EBXUtils.getFirstRecursiveChildMatchingCSSClass(line, EBX_MultiOccurrences.LineContentClassName),
			EBX_MultiOccurrences.LineContentHiddenModeClassName);

	EBX_MultiOccurrences.getLineActionFlag(line).value = EBX_MultiOccurrences.ActionInsert;

	EBX_MultiOccurrences.refreshDisplayAddButton(listId);
	var button = document.getElementById(lineId + EBX_MultiOccurrences.ButtonDeleteSuffix);
	if (button) {
		button.tabindex = -1;
	}
};

/** *END Multi Occurrences ** */

/** *START Complex List ** */

function EBX_ComplexList() {}

EBX_ComplexList.collapsedModeClassName = "ebx_ComplexFieldsCollapsed";

EBX_ComplexList.expand = function(listId) {
	EBXUtils.removeCSSClass(document.getElementById(listId), EBX_ComplexList.collapsedModeClassName);
};

EBX_ComplexList.collapse = function(listId) {
	EBXUtils.addCSSClass(document.getElementById(listId), EBX_ComplexList.collapsedModeClassName);
};

/** *END Complex List ** */

/** *START Localized Block (label description) ** */

function EBX_CollapsibleBlock() {}

EBX_CollapsibleBlock.collapsedModeClassName = "ebx_CollapsibleBlockCollapsed";
// used in ebx_public.js
EBX_CollapsibleBlock.buttonIdSuffix = "_ExpandCollapse";

EBX_CollapsibleBlock.expand = function(collapsibleBlockId) {
	EBXUtils.removeCSSClass(document.getElementById(collapsibleBlockId), EBX_CollapsibleBlock.collapsedModeClassName);
};

EBX_CollapsibleBlock.collapse = function(collapsibleBlockId) {
	EBXUtils.addCSSClass(document.getElementById(collapsibleBlockId), EBX_CollapsibleBlock.collapsedModeClassName);
};

EBX_CollapsibleBlock.setExpanded = function(expandCollapseBlockId, isExpanded) {
	var isCollapsed = EBXUtils.matchCSSClass(document.getElementById(expandCollapseBlockId), EBX_CollapsibleBlock.collapsedModeClassName);

	// if the expandCollapseBlock is in the desired state, return
	if (isExpanded && !isCollapsed) {
		return;
	}
	if (!isExpanded && isCollapsed) {
		return;
	}

	// else, click on the button
	var button = document.getElementById(expandCollapseBlockId + EBX_CollapsibleBlock.buttonIdSuffix);
	button.click();
};

/** *END Localized Block ** */

/** *START Group having children ** */

function EBX_GroupHavingChildren() {}

// initialized by UITreeForm.java
EBX_GroupHavingChildren.trChildrenIds = {};

EBX_GroupHavingChildren.fieldExpandCollapseTDCSSClass = "ebx_FieldExpandCollapse";

EBX_GroupHavingChildren.trProperties = {};

EBX_GroupHavingChildren.expand = function(trId) {
	var trProperties, i, len, child;
	trProperties = EBX_GroupHavingChildren.getTrProperties(trId);
	for (i = 0, len = trProperties.children.length; i < len; i++) {
		child = trProperties.children[i];
		child.style.display = "";
		if (EBX_GroupHavingChildren.hasChildren(child.id) && EBX_GroupHavingChildren.isOpen(child.id)) {
			EBX_GroupHavingChildren.expand(child.id);
		}
	}
};

EBX_GroupHavingChildren.collapse = function(trId) {
	var trProperties, i, len, child;
	trProperties = EBX_GroupHavingChildren.getTrProperties(trId);
	for (i = 0, len = trProperties.children.length; i < len; i++) {
		child = trProperties.children[i];
		if (EBX_GroupHavingChildren.hasChildren(child.id)) {
			EBX_GroupHavingChildren.collapse(child.id);
		}
		child.style.display = "none";
	}
};

EBX_GroupHavingChildren.getTrProperties = function(trId) {
	if (EBX_GroupHavingChildren.trProperties[trId] === undefined) {
		var properties;
		var trEl = document.getElementById(trId);
		if (trEl !== null) {
			properties = {};
			properties.trEl = trEl;
			var tdExpandCollapse = EBXUtils.getFirstDirectChildMatchingCSSClass(trEl, EBX_GroupHavingChildren.fieldExpandCollapseTDCSSClass);
			if (tdExpandCollapse !== null) {
				properties.expandCollapseCkb = EBXUtils.getFirstDirectChildMatchingCSSClass(tdExpandCollapse, "ebx_ToggleButtonCkb");
			} else {
				properties.expandCollapseCkb = null;
			}
			var childrenIds = EBX_GroupHavingChildren.trChildrenIds[trId];
			if (childrenIds !== undefined) {
				var children = [];
				for ( var i = 0, len = childrenIds.length; i < len; i++) {
					children.push(document.getElementById(childrenIds[i]));
				}
				properties.children = children;
			} else {
				properties.children = null;
			}
		} else {
			properties = null;
		}
		EBX_GroupHavingChildren.trProperties[trId] = properties;
	}
	return EBX_GroupHavingChildren.trProperties[trId];
};

EBX_GroupHavingChildren.hasChildren = function(trId) {
	return EBX_GroupHavingChildren.getTrProperties(trId).expandCollapseCkb !== null;
};

EBX_GroupHavingChildren.isOpen = function(trId) {
	if (EBX_GroupHavingChildren.hasChildren(trId) === false) {
		return false;
	}
	return EBX_GroupHavingChildren.getTrProperties(trId).expandCollapseCkb.checked === false;
};

/** *END Group having children ** */

function on_HTML_editorPreview(id, title) {
	if (!id || !document.getElementById(id)) {
		alert(EBX_FormWidgets.messages.Adaptation_Node_Editor_Html_Error);
		return;
	}
	var anHTML_content = "";
	if (document.getElementById(id)) {
		anHTML_content = document.getElementById(id).innerHTML;
	}
	var popUpWin = window.open("about:blank", 'on_editorPreview', 'scrollbars=yes,status=no,toolbar=no,menubar=no,width=620,height=400', true);

	while (anHTML_content.indexOf("&gt;") > -1) {
		anHTML_content = anHTML_content.replace("&gt;", ">");
	}
	;

	while (anHTML_content.indexOf("&lt;") > -1) {
		anHTML_content = anHTML_content.replace("&lt;", "<");
	}
	;

	window.setTimeout(function() {
		popUpWin.document.body.innerHTML = anHTML_content;
	}, 100);
}

/** *START Facet Enumeration ** */
function EBX_FacetEnumeration() {}

EBX_FacetEnumeration.firstPage = "FIRST";
EBX_FacetEnumeration.previousPage = "PREVIOUS";
EBX_FacetEnumeration.nextPage = "NEXT";
EBX_FacetEnumeration.lastPage = "LAST";
EBX_FacetEnumeration.InputFieldDisplaySuffix = "_display";

EBX_FacetEnumeration.onFacetEnum_valueField = null;
EBX_FacetEnumeration.onFacetEnum_displayField = null;

function ebx_DelFacetEnumeration() {
	EBXUtils.closeInternalPopup();

	if (EBX_FacetEnumeration.onFacetEnum_valueField !== null) {
		EBX_Form.refreshEmptyButtonFromFacetEnumField(EBX_FacetEnumeration.onFacetEnum_valueField, true);
		EBX_FacetEnumeration.onFacetEnum_valueField = null;
	}

	if (EBX_FacetEnumeration.onFacetEnum_displayField !== null) {
		EBX_FacetEnumeration.onFacetEnum_displayField.focus();
		EBX_FacetEnumeration.onFacetEnum_displayField = null;
	}
}

function ebx_GetFacetEnumeration(nodePath, valueFieldId, isMultiple, isTableRef, specificPageIndexInFSMHistory) {
	// remove previous tableRef (if any)
	ebx_DelFacetEnumeration();

	EBX_FacetEnumeration.onIsMultiple = isMultiple;

	EBX_FacetEnumeration.onFacetEnum_valueField = document.getElementById(valueFieldId);
	EBX_FacetEnumeration.onFacetEnum_displayField = document.getElementById(valueFieldId + EBX_FacetEnumeration.InputFieldDisplaySuffix);
	EBX_FacetEnumeration.onFacetEnum_isTableRef = isTableRef;

	EBX_FacetEnumeration.onFacetEnumURL_getRows = onFacetEnumURL_getRows_basic + "&$facetEnum_specificPageIndexInFsmHistory="
			+ specificPageIndexInFSMHistory + "&$facetEnum_nodePath=" + nodePath + "&$facetEnum_paginPageIndex=";

	var height = "220";
	if (YAHOO.env.ua.webkit !== 0) {
		height = "230";
	}

	var cmdToCall = "EBXUtils.openInternalPopup(onFacetEnumURL_getGUI, 400, " + height
			+ ", {isDimmed: false,contextElement: EBX_FacetEnumeration.onFacetEnum_displayField});";

	FormPresenterStatusIndicator.setListenerOnWaitingEnd(cmdToCall);
}

function ebx_facetEnumerationTableRef_seeDetails(inputType, valueFieldId, baseURL, formatedPKPName) {
	var formatedPK = null;
	if (inputType == 'advanced') {
		formatedPK = document.getElementById(valueFieldId).value;
	}
	if (inputType == 'dropdown') {
		var select = document.getElementById(valueFieldId);
		formatedPK = select.options[select.selectedIndex].value;
	}

	if (formatedPK == null || formatedPK == ebx_nullValueForFacetEnum) {
		alert(FacetEnumeration_label_alert_selectValue);
		return;
	}

	var finalURL = baseURL + "&" + formatedPKPName + "=" + encodeURIComponent(formatedPK);

	EBXUtils.openInternalPopupLargeSizeHostedClose(finalURL);
}

function ebx_manageKeysForFacetEnumeration(event, nodePath, valueFieldId, isMultiple, isTableRef, specificPageIndexInFSMHistory) {
	if (EBX_Form.isEventToInputText(event) === false) {
		return true;
	}

	ebx_GetFacetEnumeration(nodePath, valueFieldId, isMultiple, isTableRef, specificPageIndexInFSMHistory);

	//return false to ignore current input
	return false;
}

/*
// old code to delete @see UIFECSelectorAfterCreate l.107
EBX_FacetEnumeration.autoSelectNewRecord = function(inputName, labelName, inputValue, labelValue){
var facetEnumInput = parent.document.getElementById(inputName);
var facetEnumLabel = parent.document.getElementById(labelName);
if (facetEnumInput && facetEnumLabel) {
facetEnumInput.value = inputValue;
facetEnumLabel.value = labelValue;
}
parent.EBXUtils.closeInternalPopup();
};
*/
/** *START Facet Enumeration SELECTOR ** */
EBX_FacetEnumeration.selector_valueField = false;
EBX_FacetEnumeration.selector_displayField = false;
EBX_FacetEnumeration.selector_baseURL = false;
EBX_FacetEnumeration.selector_isTableRef = true;

EBX_FacetEnumeration.selector_currentPageIndex = 0;
EBX_FacetEnumeration.selector_isLastPage = false;

EBX_FacetEnumeration.ajaxFacetEnumSelector = function() {
	this.isMultiple = parent.EBX_FacetEnumeration.onIsMultiple;

	this.onExecuteIfOK = function(responseXML, root) {
		var optionsEl = root.getElementsByTagName('options')[0];
		this.updateDropDown(optionsEl);
		EBX_FacetEnumeration.selector_currentPageIndex = parseInt(optionsEl.attributes.getNamedItem('position').nodeValue, 10);
		EBX_FacetEnumeration.selector_isLastPage = eval(optionsEl.attributes.getNamedItem('isLast').nodeValue);

		//Redisplay input fields and hide wait div
		EBX_FacetEnumeration.selector_hideInputFields(false);
		return true;
	};

	this.onExecuteIfKO = function(responseXML) {
		EBX_FacetEnumeration.selector_resetList();
		EBX_FacetEnumeration.selector_hideInputFields(false);
	};

	this.onGetExceptedResponseCode = function(callerId) {
		return this.responseCodeOK_OptionsList;
	};

	this.onManageTimeoutResponse = function() {
		//parent.location.href;
		this.selector_closeFacetEnum();
		EBX_Loader.gotoTimeoutPage();
	};

	this.updateDropDown = function(optionsEl) {
		var recordList = document.getElementById('on_values');

		var newOptions = optionsEl.getElementsByTagName('option');
		// not used
		//		var currentDisplayValue = document.getElementById('on_display').value;

		for ( var i = 0; i < newOptions.length; ++i) {
			var anOption = newOptions[i];
			var isEnabled = anOption.attributes.getNamedItem('isEnabled').nodeValue;
			var value = "";
			if (anOption.getElementsByTagName('value')[0] && anOption.getElementsByTagName('value')[0].firstChild) {
				value = anOption.getElementsByTagName('value')[0].firstChild.data;
			}

			var label = "";
			if (anOption.getElementsByTagName('label')[0] && anOption.getElementsByTagName('label')[0].firstChild) {
				label = anOption.getElementsByTagName('label')[0].firstChild.data;
			}

			var aNewOption = document.createElement('option');
			if (label) {
				aNewOption.text = label;
			} else {
				aNewOption.text = "";
			}

			aNewOption.value = value;

			//Add new option.
			recordList.options.add(aNewOption);

			if (isEnabled == "false") {
				aNewOption.style.background = "#E0E0E0";
				aNewOption.disabled = true;
			} else {
				if (EBX_FacetEnumeration.selector_valueField.value == aNewOption.value) {
					//Current value is highlighted and selected by default.
					aNewOption.style.background = "#FFF4C1";
					aNewOption.selected = true;
				}
			}
		}

		var rawValues = [];

		// Redisplay as HTML in div
		var valuesDiv = document.getElementById('on_valuesDiv');
		var html = "<select style='width: 100%;'";
		if (EBX_LayoutManager.isIPad) {
			html += " onchange='window.setTimeout(\"EBX_FacetEnumeration.selector_submit()\", 0);'";
		} else {
			html += " ondblclick='EBX_FacetEnumeration.selector_submit();'";
		}
		html += " onkeyup='EBX_FacetEnumeration.selector_listKeyUp(event, this);' size='11' id='on_values'>";
		for (i = 0; i < recordList.options.length; i++) {
			anOption = recordList.options[i];

			rawValues[i] = anOption.value;

			html += "<option";
			if (anOption.disabled) {
				html += " disabled";
			}
			if (anOption.selected) {
				html += " selected";
			}
			var style = "";
			if (anOption.style.background) {
				style += " background: " + anOption.style.background + ";";
			}
			if (anOption.value == parent.ebx_nullValueForFacetEnum) {
				style += " color: #777777; font-style: italic;";
			}
			if (style !== "") {
				html += " style=\"" + style + "\"";
			}
			html += " title=\"" + anOption.text + "\"";
			html += ">";
			html += anOption.text;
			html += "</option>";
		}
		html += "</select>";
		valuesDiv.innerHTML = html;
		valuesDiv.ebx_rawValues = rawValues;

		EBXUtils.removeCSSClass(document.getElementById("ebx_FacetEnum_SearchButton"), EBX_ButtonUtils.buttonPushedCSSClass);
	};

	this.getElementsByNameStartingWith = function(inputFieldIdPart) {
		var elements = parent.document.getElementsByTagName("input");
		var matchingElements = [];
		var cmp = 0;
		for ( var i = 0; i < elements.length; i++) {
			if (elements[i].type == "hidden" && elements[i].id.indexOf(inputFieldIdPart, 0) === 0 && elements[i].id.indexOf('action') === -1
					&& elements[i].value !== null && elements[i].value.length > 0) {
				matchingElements[cmp] = elements[i];
				cmp++;
			}
		}
		return matchingElements;
	};

	this.isFieldArrayContainValue = function(array, value) {
		for ( var i = 0; i < array.length; i++) {
			if (array[i].value == value) {
				return true;
			}
		}
		return false;
	};
};
EBX_FacetEnumeration.ajaxFacetEnumSelector.prototype = new EBX_AbstractAjaxResponseManager();

EBX_FacetEnumeration.selector_init = function() {
	var waitDivText = document.getElementById('on_waitDivText');
	waitDivText.innerHTML = parent.FacetEnumeration_label_waitDiv_text;

	document.getElementById("ebx_WorkspaceContent").style.overflow = "visible";

	EBX_FacetEnumeration.selector_valueField = parent.EBX_FacetEnumeration.onFacetEnum_valueField;
	EBX_FacetEnumeration.selector_displayField = parent.EBX_FacetEnumeration.onFacetEnum_displayField;
	EBX_FacetEnumeration.selector_baseURL = parent.EBX_FacetEnumeration.onFacetEnumURL_getRows;
	EBX_FacetEnumeration.selector_isTableRef = parent.EBX_FacetEnumeration.onFacetEnum_isTableRef;
};

EBX_FacetEnumeration.selector_search = function() {
	EBXUtils.addCSSClass(document.getElementById("ebx_FacetEnum_SearchButton"), EBX_ButtonUtils.buttonPushedCSSClass);
	EBX_FacetEnumeration.selector_ajaxCallForSearch(EBX_FacetEnumeration.firstPage);
};

EBX_FacetEnumeration.selector_getRequestURLForSearch = function() {
	var currentDisplayValue = document.getElementById('on_display');
	var buildedUrl = EBX_FacetEnumeration.selector_getRequestURL(EBX_FacetEnumeration.firstPage);
	if (currentDisplayValue) {
		buildedUrl += '&$facetEnum_userInput=' + encodeURIComponent(currentDisplayValue.value);
	}
	return buildedUrl;
};

EBX_FacetEnumeration.selector_getRequestURL = function(page) {
	var buildedUrl = "";

	if (EBX_FacetEnumeration.selector_isTableRef) {
		buildedUrl = EBX_FacetEnumeration.selector_baseURL + page;
	} else {
		if (page === EBX_FacetEnumeration.firstPage) {
			EBX_FacetEnumeration.selector_currentPageIndex = 0;
			buildedUrl = EBX_FacetEnumeration.selector_baseURL + EBX_FacetEnumeration.selector_currentPageIndex;
		}
		if (page === EBX_FacetEnumeration.previousPage) {
			if (EBX_FacetEnumeration.selector_currentPageIndex - 10 <= 0) {
				EBX_FacetEnumeration.selector_currentPageIndex = 0;
			} else {
				EBX_FacetEnumeration.selector_currentPageIndex -= 10;
			}
			buildedUrl = EBX_FacetEnumeration.selector_baseURL + EBX_FacetEnumeration.selector_currentPageIndex;
		}
		if (page === EBX_FacetEnumeration.nextPage) {
			EBX_FacetEnumeration.selector_currentPageIndex += 10;
			buildedUrl = EBX_FacetEnumeration.selector_baseURL + EBX_FacetEnumeration.selector_currentPageIndex;
		}
		if (page === EBX_FacetEnumeration.lastPage) {
			buildedUrl = EBX_FacetEnumeration.selector_baseURL + page;
		}
		// The user input is required for other enumerations.
		var currentDisplayValue = document.getElementById('on_display');
		if (currentDisplayValue) {
			buildedUrl += '&$facetEnum_userInput=' + encodeURIComponent(currentDisplayValue.value);
		}
	}

	return buildedUrl;
};

EBX_FacetEnumeration.selector_selectValue = function() {
	var recordList = document.getElementById('on_values');
	var selectedOption = recordList.options[recordList.selectedIndex];

	if (selectedOption.value == '-') {
		return;
	}
	document.getElementById('on_value').value = selectedOption.value;
	document.getElementById('on_display').value = selectedOption.text;
};

EBX_FacetEnumeration.selector_listKeyUp = function(evenement, refObj) {
	var keyCode = window.event ? evenement.keyCode : evenement.which;
	//return
	if (keyCode == 13) {
		if (refObj.id == 'on_values') {
			EBX_FacetEnumeration.selector_submit();
		}
		if (refObj.id == 'on_display') {
			EBX_FacetEnumeration.selector_search();
		}
	}

	if (refObj.id == 'on_display') {
		//down arrow || up arrow
		if (keyCode == 40 || keyCode == 38) {
			EBX_Form.focus('on_values');
		}
	}
};

EBX_FacetEnumeration.selector_commonKeyUp = function(evenement) {
	var keyCode = window.event ? window.event.keyCode : evenement.which;
	//Escape
	if (keyCode == 27) {
		EBX_FacetEnumeration.selector_closeFacetEnum();
	}
};

EBX_FacetEnumeration.selector_submit = function() {
	var values = document.getElementById('on_values');
	var valuesDiv = document.getElementById('on_valuesDiv');
	var rawValues = valuesDiv.ebx_rawValues;

	if (values.selectedIndex < 0 && values.length > 0) {
		alert(parent.FacetEnumeration_label_alert_selectValue);
		return;
	}
	if (values.length === 0) {
		EBX_FacetEnumeration.selector_closeFacetEnum();
		return;
	}

	var selectedOption = values.options[values.selectedIndex];
	//Can't select a disabled option. Thus return false and reset selected index.
	if (selectedOption.disabled) {
		values.selectedIndex = -1;
		values.selected = false;
		return;
	}

	EBX_FacetEnumeration.selector_displayField.value = selectedOption.text;
	EBX_FacetEnumeration.selector_valueField.value = rawValues[values.selectedIndex];

	// activate onchange event on value field
	if (EBX_FacetEnumeration.selector_valueField.onchange) {
		EBX_FacetEnumeration.selector_valueField.onchange();
	}

	EBX_FacetEnumeration.selector_closeFacetEnum();
};

EBX_FacetEnumeration.selector_closeFacetEnum = function() {
	try {
		EBX_FacetEnumeration.selector_displayField.focus();
	} catch (e) {}
	parent.ebx_DelFacetEnumeration();
};

EBX_FacetEnumeration.selector_resetList = function() {
	var recordList = document.getElementById('on_values');
	for ( var i = recordList.length - 1; i >= 0; i--) {
		var achild = recordList.options[i];
		recordList.removeChild(achild);
	}

	//Hide input fields and display wait div
	EBX_FacetEnumeration.selector_hideInputFields(true);
};

EBX_FacetEnumeration.selector_manageButtons = function() {
	// not used
	//	var valuesDiv = document.getElementById('on_valuesDiv');

	var searchButton = document.getElementById('ebx_FacetEnum_SearchButton');
	var firstPageImgLink = document.getElementById('onFacetEnum_FirstPageIcon');
	var previousPageImgLink = document.getElementById('onFacetEnum_PreviousPageIcon');
	var nextPageImgLink = document.getElementById('onFacetEnum_NextPageIcon');
	var lastPageImgLink = document.getElementById('onFacetEnum_LastPageIcon');

	if (document.getElementById('on_waitDiv').style.display == "none") {
		EBX_FacetEnumeration.selector_manageButton(searchButton, false);
		//We are in first page
		if (parseInt(EBX_FacetEnumeration.selector_currentPageIndex, 10) === 0) {
			EBX_FacetEnumeration.selector_manageButton(firstPageImgLink, true);
			EBX_FacetEnumeration.selector_manageButton(previousPageImgLink, true);
		} else {
			EBX_FacetEnumeration.selector_manageButton(firstPageImgLink, false);
			EBX_FacetEnumeration.selector_manageButton(previousPageImgLink, false);
		}

		if (EBX_FacetEnumeration.selector_isLastPage) {
			EBX_FacetEnumeration.selector_manageButton(nextPageImgLink, true);
			EBX_FacetEnumeration.selector_manageButton(lastPageImgLink, true);
		} else {
			EBX_FacetEnumeration.selector_manageButton(nextPageImgLink, false);
			EBX_FacetEnumeration.selector_manageButton(lastPageImgLink, false);
		}
	} else {
		EBX_FacetEnumeration.selector_manageButton(searchButton, true);
		EBX_FacetEnumeration.selector_manageButton(firstPageImgLink, true);
		EBX_FacetEnumeration.selector_manageButton(previousPageImgLink, true);
		EBX_FacetEnumeration.selector_manageButton(nextPageImgLink, true);
		EBX_FacetEnumeration.selector_manageButton(lastPageImgLink, true);
	}
};

EBX_FacetEnumeration.selector_manageButton = function(button, isDisabled) {
	if (!button) {
		return;
	}
	EBX_ButtonUtils.setButtonDisabled(button, isDisabled);
};

EBX_FacetEnumeration.selector_lastPage = function() {
	EBX_FacetEnumeration.selector_ajaxCall(EBX_FacetEnumeration.lastPage);
};

EBX_FacetEnumeration.selector_nextPage = function() {
	EBX_FacetEnumeration.selector_ajaxCall(EBX_FacetEnumeration.nextPage);
};

EBX_FacetEnumeration.selector_firstPage = function() {
	EBX_FacetEnumeration.selector_ajaxCall(EBX_FacetEnumeration.firstPage);
};

EBX_FacetEnumeration.selector_previousPage = function() {
	EBX_FacetEnumeration.selector_ajaxCall(EBX_FacetEnumeration.previousPage);
};

EBX_FacetEnumeration.selector_ajaxCallForSearch = function() {
	EBX_FacetEnumeration.selector_resetList();
	var ajaxFacetEnumObject = new EBX_FacetEnumeration.ajaxFacetEnumSelector();
	ajaxFacetEnumObject.onExecute(EBX_FacetEnumeration.selector_getRequestURLForSearch());
};

EBX_FacetEnumeration.selector_ajaxCall = function(page) {
	EBX_FacetEnumeration.selector_resetList();
	var ajaxFacetEnumObject = new EBX_FacetEnumeration.ajaxFacetEnumSelector();
	ajaxFacetEnumObject.onExecute(EBX_FacetEnumeration.selector_getRequestURL(page));
};

EBX_FacetEnumeration.selector_initialAjaxCall = function() {
	var recordList = document.getElementById('on_values');
	if (recordList) {
		EBX_FacetEnumeration.selector_ajaxCallForSearch();
	} else {
		setTimeout("EBX_FacetEnumeration.selector_initialAjaxCall()", 200);
	}
};
EBX_FacetEnumeration.focusValuesTaskId = "EBX_FacetEnumeration_focusValuesTask";
EBX_FacetEnumeration.selector_hideInputFields = function(hide) {
	if (hide) {
		document.getElementById("on_valuesDiv").style.display = "none";
		document.getElementById("on_waitDiv").style.display = "";
	} else {
		document.getElementById("on_valuesDiv").style.display = "";
		document.getElementById("on_waitDiv").style.display = "none";
		//        document.getElementById('on_display').focus();
		EBX_Loader.addDynamicallyTaskBeforeTaskId(EBX_Loader_taskId_destroy_loading_layer, EBX_FacetEnumeration.focusValuesTaskId,
				EBX_FacetEnumeration.focusValuesTaskId, EBX_Loader.states.onStarting, EBX_FacetEnumeration.focusValuesTask, EBXUtils.returnTrue);
	}

	EBX_FacetEnumeration.selector_manageButtons();
};
EBX_FacetEnumeration.focusValuesTask = function() {
	EBX_Loader.changeTaskState(EBX_FacetEnumeration.focusValuesTaskId, EBX_Loader.states.processing);

	EBX_Form.focus('on_values');

	EBX_Loader.changeTaskState(EBX_FacetEnumeration.focusValuesTaskId, EBX_Loader.states.done);
};
/** *END Facet Enumeration SELECTOR ** */

/** *END Facet Enumeration ** */

/** *START Incremental Search Selector ** */

function EBX_ISS() {}

/* Constant */
/* feed by UIIncrementalSearchSelectorManagerVC for each ISS added in the page */
EBX_ISS.mapIdPreviewURL = {};
EBX_ISS.mapIdCreateNewURL = {};
EBX_ISS.mapIdAdvancedSelectorURL = {};
EBX_ISS.mapIdPathForNodeIndex = {};
EBX_ISS.mapIdAjaxComponentIndex = {};
EBX_ISS.mapIdIsUsedForJavaScriptSelectionOnly = {};
EBX_ISS.javaScriptSelectionListener = {};
EBX_ISS.isManualSearchMode = {};

/* Constants. Null are initialized at the first display */
// height in px for list border (top and bottom) which launch auto-scroll
EBX_ISS.listScrollPadding = 20;
// rolling delay between key press and request in ms
EBX_ISS.requestDelay = 200;
// initial height in px
EBX_ISS.initialHeight = 150;

EBX_ISS_State = function(className) {
	this.className = className;
};
EBX_ISS_State.ERROR = new EBX_ISS_State("ebx_ISS_list_Error");
EBX_ISS_State.WAITING_INPUT = new EBX_ISS_State("ebx_ISS_list_WaitingInput");
EBX_ISS_State.NORMAL = new EBX_ISS_State("ebx_ISS_list_Normal");
EBX_ISS_State.HAS_NEXT = new EBX_ISS_State("ebx_ISS_list_HasNext");
EBX_ISS_State.NO_RESULT = new EBX_ISS_State("ebx_ISS_list_NoResult");
EBX_ISS_State.LOADING = new EBX_ISS_State("ebx_ISS_list_Loading");
EBX_ISS_State.WAITING_APV = new EBX_ISS_State("ebx_ISS_list_WaitingAPV");

EBX_ISS.containerCSSClass = "ebx_ISS_Container";
EBX_ISS.containerFocusCSSClass = "ebx_ISS_Container_Focus";
EBX_ISS.containerActiveCSSClass = "ebx_ISS_Container_Active";

EBX_ISS.paneId = "ebx_ISS_pane";
EBX_ISS.pane = null;
EBX_ISS.resize = null;
EBX_ISS.scrollMakerCSSClass = "ebx_ISS_scrollMaker";

EBX_ISS.bodyDivId = "ebx_ISS_body";
EBX_ISS.bodyDivEl = null;
EBX_ISS.originalLabelDivId = "ebx_ISS_OriginalLabel";
EBX_ISS.originalLabelDivEl = null;
// Mantis #12657
EBX_ISS.originalLabelEnabled = false;
EBX_ISS.listId = "ebx_ISS_list";
EBX_ISS.listEl = null;
EBX_ISS.errorDivId = "ebx_ISS_Error";
EBX_ISS.errorDivEl = null;
EBX_ISS.waitingInputDivId = "ebx_ISS_WaitingInput";
EBX_ISS.waitingInputDivEl = null;
EBX_ISS.resultsDivId = "ebx_ISS_Results";
EBX_ISS.resultsDivEl = null;
EBX_ISS.hasNextDivId = "ebx_ISS_HasNext";
EBX_ISS.hasNextDivEl = null;
EBX_ISS.noResultDivId = "ebx_ISS_NoResult";
EBX_ISS.noResultDivEl = null;
EBX_ISS.loadingDivId = "ebx_ISS_Loading";
EBX_ISS.loadingDivEl = null;
EBX_ISS.toolbarDivId = "ebx_ISS_Toolbar";
EBX_ISS.toolbarDivEl = null;
EBX_ISS.createButtonId = "ebx_ISS_CreateButton";
EBX_ISS.createButtonEl = null;
EBX_ISS.advancedSelectorButtonId = "ebx_ISS_AdvancedSelectorButton";
EBX_ISS.advancedSelectorButtonEl = null;
EBX_ISS.waitingAPVDivId = "ebx_ISS_WaitingAPV";
EBX_ISS.waitingAPVDivEl = null;

EBX_ISS.itemPrefixId = "ebx_ISS_Item_";

/* Variables depending to the field */
EBX_ISS.currentScrollMaker = null;
EBX_ISS.currentScrollingContainer = null;
EBX_ISS.currentContainerEl = null;
EBX_ISS.currentInputEl = null;
EBX_ISS.currentButtonEl = null;
EBX_ISS.originalInputLabel = null;
EBX_ISS.originalInputCSSClass = null;
EBX_ISS.results = [];
EBX_ISS.highlightedItemIndex = -2;
EBX_ISS.highlightedItemIndexUI = -2;
EBX_ISS.listState = EBX_ISS_State.NORMAL;
EBX_ISS.requestedIndex = 0;
EBX_ISS.isShown = false;
EBX_ISS.preventBlur = false;
EBX_ISS.originalFormScrollTop = null;
EBX_ISS.currentFormScrollTop = null;
EBX_ISS.currentFormExtraHeightBottom = null;
EBX_ISS.additionnalFormHeight = 0;
EBX_ISS.isCurrentManualSearchMode = false;

EBX_ISS.showPane = function() {

	YAHOO.util.Event.addListener(EBX_ISS.currentScrollingContainer, "scroll", EBX_ISS.resetFormScroll, EBX_ISS.currentScrollingContainer.scrollLeft);
	EBX_Loader.setEnterKeyListener(EBX_ISS.selectCurrentHighlight);

	EBX_ISS.pane.show();

	EBXUtils.addCSSClass(EBX_ISS.currentContainerEl, EBX_ISS.containerActiveCSSClass);

	EBX_ISS.isShown = true;

	if (EBX_ISS.isCurrentManualSearchMode === true) {
		EBX_ISS.waitingInputDivEl.innerHTML = EBX_LocalizedMessage.comboBox_pressEnterToSearch;
	} else {
		EBX_ISS.waitingInputDivEl.innerHTML = EBX_LocalizedMessage.comboBox_waitingInput;
	}
};

EBX_ISS.hidePane = function() {

	YAHOO.util.Event.removeListener(EBX_ISS.currentScrollingContainer, "scroll", EBX_ISS.resetFormScroll);
	EBX_Loader.removeEnterKeyListener();

	EBXUtils.removeCSSClass(EBX_ISS.currentContainerEl, EBX_ISS.containerActiveCSSClass);
	EBX_ButtonUtils.setStateToToggleButton(EBX_ISS.currentButtonEl, false);

	EBX_ISS.pane.hide();

	EBX_ISS.currentScrollingContainer.scrollTop = EBX_ISS.originalFormScrollTop;
	EBX_ISS.currentScrollMaker.style.height = "";

	window.clearTimeout(EBX_ISS.currentRequestTimeoutId);

	EBX_ISS.isShown = false;
	EBX_ISS.preventBlur = false;
	EBX_ISS.currentContainerEl = null;
	EBX_ISS.currentInputEl = null;
	EBX_ISS.currentButtonEl = null;
	EBX_ISS.originalInputLabel = null;
	EBX_ISS.originalInputCSSClass = null;
	EBX_ISS.originalFormScrollTop = null;
	EBX_ISS.currentFormScrollTop = null;
	EBX_ISS.currentFormExtraHeightBottom = null;
	EBX_ISS.additionnalFormHeight = 0;
	EBX_ISS.isCurrentManualSearchMode = false;

	EBX_ISS.currentScrollingContainer = null;
	EBX_ISS.currentScrollMaker = null;

	EBX_ISS.results = [];
	EBX_ISS.highlightedItemIndex = -2;
	EBX_ISS.highlightedItemIndexUI = -2;
	EBX_ISS.listState = EBX_ISS_State.NORMAL;
	EBX_ISS.requestedIndex = 0;
};

EBX_ISS.currentRequestTimeoutId = null;

EBX_ISS.reload = function() {
	EBX_ISS.results = [];
	EBX_ISS.highlightedItemIndex = -2;
	EBX_ISS.highlightedItemIndexUI = -2;
	EBX_ISS.listState = EBX_ISS_State.WAITING_INPUT;
	EBX_ISS.requestedIndex = 0;

	EBX_ISS.refreshUIItemsList();

	if (EBX_ISS.isShown === false) {
		EBX_ISS.showPane();
	}

	window.clearTimeout(EBX_ISS.currentRequestTimeoutId);
	if (EBX_ISS.isCurrentManualSearchMode !== true) {
		EBX_ISS.currentRequestTimeoutId = window.setTimeout(EBX_ISS.sendRequest, EBX_ISS.requestDelay);
	}
};

EBX_ISS.revert = function() {
	EBX_ISS.currentInputEl.value = EBX_ISS.originalInputLabel;
	EBX_ISS.currentInputEl.className = EBX_ISS.originalInputCSSClass;
	EBX_ISS.hidePane();
};

EBX_ISS.blurHandler = function(inputEl) {

	EBXUtils.removeCSSClass(EBXUtils.getFirstParentMatchingCSSClass(inputEl, EBX_ISS.containerCSSClass), EBX_ISS.containerFocusCSSClass);

	if (EBX_ISS.currentInputEl !== inputEl) {
		return;
	}

	if (EBX_ISS.preventBlur === true) {
		window.setTimeout("if (EBX_ISS.currentInputEl !== null) EBX_ISS.currentInputEl.focus();", 0);
		return;
	}

	if (EBX_ISS.pane !== null) {
		EBX_ISS.revert();
	}
};

EBX_ISS.focusHandler = function(inputEl) {
	EBXUtils.addCSSClass(EBXUtils.getFirstParentMatchingCSSClass(inputEl, EBX_ISS.containerCSSClass), EBX_ISS.containerFocusCSSClass);
};

EBX_ISS.init = function(inputEl, clearLabel) {
	if (EBX_ISS.currentInputEl === inputEl) {
		return;
	}

	if (EBX_ISS.currentInputEl !== null) {
		EBX_ISS.blurHandler(EBX_ISS.currentInputEl);
	}

	EBX_ISS.currentContainerEl = EBXUtils.getFirstParentMatchingCSSClass(inputEl, EBX_ISS.containerCSSClass);
	EBX_ISS.currentInputEl = inputEl;
	EBX_ISS.currentButtonEl = EBXUtils.getFirstDirectChildMatchingCSSClass(EBX_ISS.currentContainerEl, "ebx_DropDown");
	EBX_ISS.originalInputLabel = inputEl.value;
	EBX_ISS.originalInputCSSClass = inputEl.className;

	EBX_ISS.currentScrollingContainer = EBX_Form.getFormScrollingContainer(EBX_ISS.currentContainerEl);

	EBX_ISS.originalFormScrollTop = EBX_ISS.currentScrollingContainer.scrollTop;
	EBX_ISS.currentFormScrollTop = EBX_ISS.currentScrollingContainer.scrollTop;

	EBX_ISS.isCurrentManualSearchMode = EBX_ISS.isManualSearchMode[EBX_ISS.currentInputEl.id] !== undefined
			&& EBX_ISS.isManualSearchMode[EBX_ISS.currentInputEl.id] === true;

	EBX_ButtonUtils.setStateToToggleButton(EBX_ISS.currentButtonEl, true);
	EBX_ISS.initPane();
	EBX_ISS.initScrollMaker();
	EBX_ISS.currentFormExtraHeightBottom = EBX_ISS.getFormExtraHeightBottom();

	if (clearLabel) {
		inputEl.value = "";
		inputEl.className = "";
	}
};
EBX_ISS.getFormExtraHeightBottom = function() {

	var D = YAHOO.util.Dom;
	var formBodyRegion = D.getRegion(EBX_ISS.currentScrollingContainer);
	var scrollMakerRegion = D.getRegion(EBX_ISS.currentScrollMaker);

	var ret = formBodyRegion.bottom - scrollMakerRegion.bottom;
	if (ret < 0) {
		ret = 0;
	}

	return ret;
};
EBX_ISS.initScrollMaker = function() {
	var scrollMaker = EBXUtils.getFirstDirectChildMatchingCSSClass(EBX_ISS.currentScrollingContainer, EBX_ISS.scrollMakerCSSClass);
	if (scrollMaker === null) {
		scrollMaker = document.createElement("div");
		scrollMaker.className = EBX_ISS.scrollMakerCSSClass;
		EBX_ISS.currentScrollingContainer.appendChild(scrollMaker);
	}
	EBX_ISS.currentScrollMaker = scrollMaker;
};

EBX_ISS.keyPressSearchHandler = function(inputEl, event) {
	if (!EBX_ISS.isAnInterestingKeyEvent(event)) {
		return;
	}

	var clearLabel = true;
	// if the field is defined
	if (EBX_ISS.mapIdIsUsedForJavaScriptSelectionOnly[inputEl.id] !== true
			&& FormNodeIndex.getFormNode(EBX_ISS.mapIdPathForNodeIndex[inputEl.id]).getValue() !== null) {
		clearLabel = false;
	}
	EBX_ISS.init(inputEl, clearLabel);

	// when ENTER is pressed
	if (event.keyCode === 13) {
		if (EBX_ISS.listState === EBX_ISS_State.WAITING_INPUT) {
			window.clearTimeout(EBX_ISS.currentRequestTimeoutId);
			EBX_ISS.sendRequest();
		} else if (EBX_ISS.isShown === false) {
			EBX_ISS.showPane();
			EBX_ISS.sendRequest();
		}
		return;
	}

	// when BOTTOM_ARROW is pressed
	if (event.keyCode === 40) {
		if (EBX_ISS.listState === EBX_ISS_State.WAITING_INPUT) {
			window.clearTimeout(EBX_ISS.currentRequestTimeoutId);
			EBX_ISS.highlightedItemIndex++;
			// avoid highlight index -1 (original value) if original label disabled or JS selection only
			if ((EBX_ISS.originalLabelEnabled === false || EBX_ISS.mapIdIsUsedForJavaScriptSelectionOnly[EBX_ISS.currentInputEl.id] === true)
					&& EBX_ISS.highlightedItemIndex === -1) {
				EBX_ISS.highlightedItemIndex++;
			}
			EBX_ISS.sendRequest();
		} else if (EBX_ISS.isShown === false) {
			EBX_ISS.showPane();
			EBX_ISS.highlightedItemIndex++;
			// avoid highlight index -1 (original value) if original label disabled or JS selection only
			if ((EBX_ISS.originalLabelEnabled === false || EBX_ISS.mapIdIsUsedForJavaScriptSelectionOnly[EBX_ISS.currentInputEl.id] === true)
					&& EBX_ISS.highlightedItemIndex === -1) {
				EBX_ISS.highlightedItemIndex++;
			}
			EBX_ISS.sendRequest();
		} else {
			EBX_ISS.highlightNextItem();
		}
		return;
	}

	// when TOP_ARROW is pressed
	if (event.keyCode === 38) {
		EBX_ISS.highlightPreviousItem();
		return;
	}

	// when ESCAPE is pressed
	if (event.keyCode === 27) {
		EBX_ISS.revert();
		return;
	}

	EBX_ISS.reload();
};

EBX_ISS.launchButtonOnHandler = function(inputId) {
	var inputEl = document.getElementById(inputId);
	inputEl.focus();
	EBX_ISS.init(inputEl, true);
	EBX_ISS.reload();
	window.clearTimeout(EBX_ISS.currentRequestTimeoutId);
	EBX_ISS.sendRequest();
};
EBX_ISS.launchButtonOffHandler = function() {
	EBX_ISS.revert();
};

EBX_ISS.selectCurrentHighlight = function() {
	if (EBX_ISS.highlightedItemIndex < -1) {
		return;
	}
	// -1 is the index of static original item
	if (EBX_ISS.highlightedItemIndex === -1) {
		EBX_ISS.revert();
		return;
	}
	EBX_ISS.selectIndex(EBX_ISS.highlightedItemIndex);
};

EBX_ISS.selectIndex = function(index) {
	var dataItem = EBX_ISS.results[index];

	if (EBX_ISS.mapIdIsUsedForJavaScriptSelectionOnly[EBX_ISS.currentInputEl.id] === true) {
		var currentFormScrollHeight = EBX_ISS.currentScrollingContainer.scrollHeight;

		var javaScriptSelectionListener = EBX_ISS.javaScriptSelectionListener[EBX_ISS.currentInputEl.id];
		if (javaScriptSelectionListener !== undefined) {
			var fn = eval(javaScriptSelectionListener.fn);
			// not safe, but internal for now
			fn.call(window, dataItem, javaScriptSelectionListener.arg);
		}

		var newFormScrollHeight = EBX_ISS.currentScrollingContainer.scrollHeight;
		if (currentFormScrollHeight < newFormScrollHeight) {
			EBX_ISS.originalFormScrollTop += newFormScrollHeight - currentFormScrollHeight;
			// also refresh scrolltop
			EBX_ISS.refreshUIItemsList();
		}

		EBX_ISS.setContext();
	} else {
		EBX_ISS.mapIdPreviewURL[EBX_ISS.currentInputEl.id] = EBX_ISS.results[index].previewURL;

		dataItem.trusted = true;
		FormNodeIndex.getFormNode(EBX_ISS.mapIdPathForNodeIndex[EBX_ISS.currentInputEl.id]).setValue(dataItem);
		FormPresenter.stackElementForValidation(EBX_ISS.currentInputEl);

		EBX_ISS.hidePane();
	}
};

EBX_ISS.highlightIndex = function(index, enableAutoScroll) {
	EBX_ISS.highlightedItemIndex = index;

	EBX_ISS.refreshUIHighlightedItem(enableAutoScroll);
};

EBX_ISS.highlightNextItem = function() {
	var indexMaxBound = EBX_ISS.results.length - 1;
	if (EBX_ISS.listState === EBX_ISS_State.HAS_NEXT) {
		indexMaxBound++;
	}

	if (EBX_ISS.highlightedItemIndex >= indexMaxBound) {
		return;
	}

	EBX_ISS.highlightedItemIndex++;
	// avoid highlight index -1 (original value) if original label disabled or JS selection only
	if ((EBX_ISS.originalLabelEnabled === false || EBX_ISS.mapIdIsUsedForJavaScriptSelectionOnly[EBX_ISS.currentInputEl.id] === true)
			&& EBX_ISS.highlightedItemIndex === -1) {
		EBX_ISS.highlightedItemIndex++;
	}

	EBX_ISS.refreshUIHighlightedItem(true);

	if (EBX_ISS.highlightedItemIndex === EBX_ISS.results.length) {
		EBX_ISS.loadNextPage();
	}
};

EBX_ISS.highlightPreviousItem = function() {
	// -1 is the index of static original item
	if (EBX_ISS.highlightedItemIndex < -1) {
		return;
	}

	EBX_ISS.highlightedItemIndex--;
	// avoid highlight index -1 (original value) if original label disabled or JS selection only
	if ((EBX_ISS.originalLabelEnabled === false || EBX_ISS.mapIdIsUsedForJavaScriptSelectionOnly[EBX_ISS.currentInputEl.id] === true)
			&& EBX_ISS.highlightedItemIndex === -1) {
		EBX_ISS.highlightedItemIndex--;
	}

	EBX_ISS.refreshUIHighlightedItem(true);
};

EBX_ISS.refreshUIHighlightedItem = function(enableAutoScroll) {
	// clear the current highlight
	var elToUnHighlight = null;
	// -1 is the index of static original item
	if (EBX_ISS.highlightedItemIndexUI >= -1) {
		if (EBX_ISS.highlightedItemIndexUI === -1) {
			// -1 is the index of static original item
			elToUnHighlight = EBX_ISS.originalLabelDivEl;
		} else if (EBX_ISS.highlightedItemIndexUI === EBX_ISS.results.length) {
			// unHighlight the magic item "more"
			//elToUnHighlight = EBX_ISS.hasNextDivEl;
		} else {
			var idToHighlight = EBX_ISS.itemPrefixId + EBX_ISS.highlightedItemIndexUI;
			elToUnHighlight = document.getElementById(idToHighlight);
		}
		if (elToUnHighlight !== null) {
			EBXUtils.removeCSSClass(elToUnHighlight, "ebx_Selected");
		}
		// -1 is the index of static original item
		// -2 is the undefined value
		EBX_ISS.highlightedItemIndexUI = -2;
	}

	// apply the highlight

	// -1 is the index of static original item
	if (EBX_ISS.highlightedItemIndex < -1) {
		return;
	}

	var elToHighlight = null;
	if (EBX_ISS.highlightedItemIndex === -1) {
		// -1 is the index of static original item
		elToHighlight = EBX_ISS.originalLabelDivEl;
		enableAutoScroll = false;
	} else if (EBX_ISS.highlightedItemIndex === EBX_ISS.results.length) {
		// highlight the magic item "more"
		//elToHighlight = EBX_ISS.hasNextDivEl;
	} else {
		var idToHighlight = EBX_ISS.itemPrefixId + EBX_ISS.highlightedItemIndex;
		elToHighlight = document.getElementById(idToHighlight);
	}
	if (elToHighlight !== null) {
		EBXUtils.addCSSClass(elToHighlight, "ebx_Selected");

		// auto scroll
		if (enableAutoScroll) {
			var itemOffsetTop = elToHighlight.offsetTop;
			var itemHeight = elToHighlight.offsetHeight;
			var scrollTop = EBX_ISS.listEl.scrollTop;
			var listHeight = EBX_ISS.listEl.clientHeight;
			var isAbove = itemOffsetTop < scrollTop + EBX_ISS.listScrollPadding;
			if (isAbove) {
				EBX_ISS.listEl.scrollTop = itemOffsetTop - EBX_ISS.listScrollPadding;
			} else {
				var isBelow = itemOffsetTop + itemHeight + EBX_ISS.listScrollPadding > scrollTop + listHeight;
				if (isBelow) {
					EBX_ISS.listEl.scrollTop = itemOffsetTop + itemHeight + EBX_ISS.listScrollPadding - listHeight;
				}
			}
		}
	}

	EBX_ISS.highlightedItemIndexUI = EBX_ISS.highlightedItemIndex;
};

EBX_ISS.initPane = function() {

	if (EBX_ISS.pane === null) {
		EBX_ISS.pane = new YAHOO.widget.Overlay(EBX_ISS.paneId, {
			constraintoviewport: true,
			visible: false
		});

		EBX_ISS.pane.render(document.body);

		var paneBodyContent = [];

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.bodyDivId, "\"");
		paneBodyContent.push(" onmouseOver=\"EBX_ISS.preventBlur = true;\"");
		paneBodyContent.push(" onmouseOut=\"EBX_ISS.preventBlur = false;\"");
		paneBodyContent.push(">");

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.originalLabelDivId, "\"");
		paneBodyContent.push(" onclick=\"EBX_ISS.revert();\"");
		paneBodyContent.push(" onmouseover=\"EBX_ISS.highlightIndex(-1, false);\"");
		paneBodyContent.push(">");
		paneBodyContent.push("</div>");

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.listId, "\"");
		paneBodyContent.push(">");

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.errorDivId, "\"");
		paneBodyContent.push(" class=\"", "ebx_Error", " ", "ebx_IconError", "\"");
		paneBodyContent.push(">");
		paneBodyContent.push("</div>");

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.waitingInputDivId, "\"");
		paneBodyContent.push(">");
		paneBodyContent.push(EBX_LocalizedMessage.comboBox_waitingInput);
		paneBodyContent.push("</div>");

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.resultsDivId, "\"");
		paneBodyContent.push(">");
		paneBodyContent.push("</div>");

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.hasNextDivId, "\"");
		paneBodyContent.push(" onmouseover=\"EBX_ISS.loadNextPage();\"");
		paneBodyContent.push(">");
		paneBodyContent.push(EBX_LocalizedMessage.comboBox_more);
		paneBodyContent.push("</div>");

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.noResultDivId, "\"");
		paneBodyContent.push(">");
		paneBodyContent.push(EBX_LocalizedMessage.comboBox_empty);
		paneBodyContent.push("</div>");

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.loadingDivId, "\"");
		paneBodyContent.push(" class=\"", "ebx_IconAnimWait", "\"");
		paneBodyContent.push(">");
		paneBodyContent.push(EBX_LocalizedMessage.comboBox_loading);
		paneBodyContent.push("</div>");

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.waitingAPVDivId, "\"");
		paneBodyContent.push(" class=\"", "ebx_IconAnimWait", "\"");
		paneBodyContent.push(">");
		paneBodyContent.push(EBX_LocalizedMessage.form_waitingForAPV);
		paneBodyContent.push("</div>");

		// end of list
		paneBodyContent.push("</div>");

		paneBodyContent.push("<div");
		paneBodyContent.push(" id=\"", EBX_ISS.toolbarDivId, "\"");
		paneBodyContent.push(">");

		paneBodyContent.push("<button");
		paneBodyContent.push(" type=\"button\"");
		paneBodyContent.push(" id=\"", EBX_ISS.createButtonId, "\"");
		paneBodyContent.push(" class=\"ebx_FlatButtonNoBorder ebx_TextAndIconLeftButton ebx_AddTableRow\"");
		paneBodyContent.push(" onclick=\"EBX_ISS.openCurrentCreate();\"");
		paneBodyContent.push(">");
		paneBodyContent.push("<span class=\"ebx_Icon\"></span>");
		paneBodyContent.push(EBX_LocalizedMessage.comboBox_create);
		paneBodyContent.push("</button>");

		paneBodyContent.push("<button");
		paneBodyContent.push(" type=\"button\"");
		paneBodyContent.push(" id=\"", EBX_ISS.advancedSelectorButtonId, "\"");
		paneBodyContent.push(" class=\"ebx_FlatButtonNoBorder ebx_TextAndIconRightButton ebx_Open\"");
		paneBodyContent.push(" onclick=\"EBX_ISS.openCurrentAdvancedSelector();\"");
		paneBodyContent.push(">");
		paneBodyContent.push(EBX_LocalizedMessage.comboBox_advancedSelector);
		paneBodyContent.push("<span class=\"ebx_Icon\"></span>");
		paneBodyContent.push("</button>");

		paneBodyContent.push("</div>");

		// end of content
		paneBodyContent.push("</div>");

		EBX_ISS.pane.setBody(paneBodyContent.join(""));

		EBX_ISS.listEl = document.getElementById(EBX_ISS.listId);

		EBX_ISS.bodyDivEl = document.getElementById(EBX_ISS.bodyDivId);
		EBX_ISS.originalLabelDivEl = document.getElementById(EBX_ISS.originalLabelDivId);
		EBX_ISS.errorDivEl = document.getElementById(EBX_ISS.errorDivId);
		EBX_ISS.waitingInputDivEl = document.getElementById(EBX_ISS.waitingInputDivId);
		EBX_ISS.resultsDivEl = document.getElementById(EBX_ISS.resultsDivId);
		EBX_ISS.hasNextDivEl = document.getElementById(EBX_ISS.hasNextDivId);
		EBX_ISS.noResultDivEl = document.getElementById(EBX_ISS.noResultDivId);
		EBX_ISS.loadingDivEl = document.getElementById(EBX_ISS.loadingDivId);
		EBX_ISS.waitingAPVDivEl = document.getElementById(EBX_ISS.waitingAPVDivId);
		EBX_ISS.toolbarDivEl = document.getElementById(EBX_ISS.toolbarDivId);
		EBX_ISS.createButtonEl = document.getElementById(EBX_ISS.createButtonId);
		EBX_ISS.advancedSelectorButtonEl = document.getElementById(EBX_ISS.advancedSelectorButtonId);

		EBX_ISS.resize = new YAHOO.util.Resize(EBX_ISS.bodyDivEl, {
			handles: [ "br" ],
			proxy: true,
			ghost: true,
			setSize: false
		});
		EBX_ISS.resize.subscribe("endResize", EBX_ISS.resizeListener, null, false);
		EBX_ISS.resize.subscribe("startResize", EBX_ISS.resetProxyPosition, null, false);
		EBX_ISS.resize.subscribe("proxyResize", EBX_ISS.computeProxyWidth, null, false);
	}

	// + 2 for right border and outline
	var gap = 2;
	var lastIEGap = 0;
	if (YAHOO.env.ua.gecko !== 0) {
		gap++;
	}
	if (YAHOO.env.ua.ie === 9 || YAHOO.env.ua.ie === 10) {
		lastIEGap = -2;
	}
	EBX_ISS.pane.cfg.setProperty("width", EBX_ISS.currentContainerEl.offsetWidth + gap + lastIEGap + "px");
	EBX_ISS.listEl.style.maxHeight = EBX_ISS.initialHeight + "px";
	EBX_ISS.resize.set("minWidth", EBX_ISS.currentContainerEl.offsetWidth + lastIEGap);
	EBX_ISS.resize.set("width", EBX_ISS.currentContainerEl.offsetWidth + lastIEGap);

	EBX_ISS.setContext();

	var originalLabelContent = [];

	EBX_ISS.addItemLabel(originalLabelContent, EBX_ISS.originalInputLabel, EBX_ISS.mapIdPreviewURL[EBX_ISS.currentInputEl.id] !== undefined,
			"EBX_ISS.openCurrentPreview(event);");
	EBX_ISS.originalLabelDivEl.innerHTML = originalLabelContent.join("");

	EBX_ISS.originalLabelDivEl.className = EBX_ISS.originalInputCSSClass;

	if (EBX_ISS.originalLabelEnabled === false || EBX_ISS.mapIdIsUsedForJavaScriptSelectionOnly[EBX_ISS.currentInputEl.id] === true) {
		EBX_ISS.originalLabelDivEl.style.display = "none";
	} else {
		EBX_ISS.originalLabelDivEl.style.display = "";
	}

	var createButtonEnabled = EBX_ISS.mapIdCreateNewURL[EBX_ISS.currentInputEl.id] !== undefined;
	var advancedSelectorButtonEnabled = EBX_ISS.mapIdAdvancedSelectorURL[EBX_ISS.currentInputEl.id] !== undefined;

	if (createButtonEnabled || advancedSelectorButtonEnabled) {
		EBX_ISS.toolbarDivEl.style.display = "block";
	} else {
		EBX_ISS.toolbarDivEl.style.display = "none";
	}

	if (createButtonEnabled === true) {
		EBX_ISS.createButtonEl.style.display = "";
	} else {
		EBX_ISS.createButtonEl.style.display = "none";
	}

	if (advancedSelectorButtonEnabled === true) {
		EBX_ISS.advancedSelectorButtonEl.style.display = "";
	} else {
		EBX_ISS.advancedSelectorButtonEl.style.display = "none";
	}
};

EBX_ISS.setContext = function() {
	// [-1, -1] for left outline and no border bottom to the container
	EBX_ISS.pane.cfg.setProperty("context", [ EBX_ISS.currentInputEl, 'tl', 'bl', null, [ -1, -1 ] ]);
};

EBX_ISS.resetProxyPosition = function(yuiEvent) {
	var proxyEl = EBX_ISS.resize.getProxyEl();
	proxyEl.style.top = "0";
	proxyEl.style.left = "0";

	// compute max bounds

	// compute resizeMaxBounds
	var D = YAHOO.util.Dom;

	var clientRegion = D.getClientRegion();
	var elRegion = D.getRegion(EBX_ISS.bodyDivEl);

	EBX_ISS.resize.set("maxWidth", clientRegion.right - elRegion.left - YAHOO.widget.Overlay.VIEWPORT_OFFSET);
	// - 2 for bottom border
	EBX_ISS.resize.set("maxHeight", clientRegion.bottom - elRegion.top - YAHOO.widget.Overlay.VIEWPORT_OFFSET - 2);
};

EBX_ISS.computeProxyWidth = function(yuiEvent) {
	var proxyEl = EBX_ISS.resize.getProxyEl();
	var gap = 2;
	if (YAHOO.env.ua.gecko !== 0) {
		gap--;
	}
	proxyEl.style.width = yuiEvent.width - gap + "px";
};

EBX_ISS.resizeListener = function(yuiEvent) {
	var availableHeight = yuiEvent.height;
	availableHeight -= EBX_ISS.originalLabelDivEl.offsetHeight;
	availableHeight -= EBX_ISS.toolbarDivEl.offsetHeight;

	// set height
	EBX_ISS.listEl.style.maxHeight = availableHeight + "px";

	// set width
	// + 2 for right border and outline
	var gap = 2;
	if (YAHOO.env.ua.gecko !== 0) {
		gap++;
	}
	EBX_ISS.pane.cfg.setProperty("width", yuiEvent.width + gap + "px");
};

/**
 * It is impossible to prevent the scroll of the form, so the only solution
 * found is to reset scroll positions.
 * http://www.quirksmode.org/dom/events/scroll.html "You cannot prevent the
 * scrolling."
 */
EBX_ISS.resetFormScroll = function(event, scrollLeft) {
	EBX_ISS.currentScrollingContainer.scrollTop = EBX_ISS.currentFormScrollTop;
	EBX_ISS.currentScrollingContainer.scrollLeft = scrollLeft;
};

EBX_ISS.refreshUIItemsList = function() {
	var content = [], resultItem;
	for ( var i = 0, length = EBX_ISS.results.length; i < length; i++) {
		resultItem = EBX_ISS.results[i];

		content.push("<div");
		content.push(" id=\"", EBX_ISS.itemPrefixId, i, "\"");
		content.push(" class=\"ebx_ISS_Item");
		if (resultItem.cssClass !== undefined) {
			content.push(" ", resultItem.cssClass);
		}
		content.push("\"");
		content.push(" onclick=\"EBX_ISS.selectIndex(" + i + ");\"");
		content.push(" onmouseover=\"EBX_ISS.highlightIndex(" + i + ", false);\"");
		content.push(">");

		EBX_ISS.addItemLabel(content, resultItem.labelForDisplay, resultItem.previewURL !== undefined, "EBX_ISS.openPreviewResultIndex(event, " + i
				+ ");");

		content.push("</div>");
	}
	EBX_ISS.resultsDivEl.innerHTML = content.join("");

	var resizeMinHeight = EBX_ISS.listEl.offsetHeight;
	if (resizeMinHeight > EBX_ISS.initialHeight) {
		resizeMinHeight = EBX_ISS.initialHeight;
	}
	EBX_ISS.resize.set("minHeight", resizeMinHeight);

	EBX_ISS.listEl.className = EBX_ISS.listState.className;

	var D = YAHOO.util.Dom;
	var clientRegion = D.getClientRegion();
	var elRegion = D.getRegion(EBX_ISS.pane.element);

	var excessHeight = elRegion.bottom - clientRegion.bottom + YAHOO.widget.Overlay.VIEWPORT_OFFSET;
	if (excessHeight > 0) {
		EBX_ISS.additionnalFormHeight += excessHeight;
	}

	EBX_ISS.currentScrollMaker.style.height = EBX_ISS.currentFormExtraHeightBottom + EBX_ISS.additionnalFormHeight + "px";

	EBX_ISS.currentFormScrollTop = EBX_ISS.originalFormScrollTop + EBX_ISS.additionnalFormHeight;
	EBX_ISS.currentScrollingContainer.scrollTop = EBX_ISS.currentFormScrollTop;
	// [-1, -1] for left outline and no border bottom to the container
	EBX_ISS.pane.align('tl', 'bl', [ -1, -1 ]);

	EBX_ISS.refreshUIHighlightedItem(true);
};

EBX_ISS.addItemLabel = function(bufferArray, labelForDisplay, isPreviewEnabled, onclick) {
	if (isPreviewEnabled) {
		bufferArray.push("<div");
		bufferArray.push(" class=\"ebx_ISS_Item_WithPreview\"");
		bufferArray.push(">");
	}

	if (labelForDisplay.length === 0) {
		labelForDisplay = " ";
	}
	/* if the labelForDisplay is made of spaces only, it must not be collapsed */
	bufferArray.push(labelForDisplay.replace(" ", "&nbsp;"));

	if (isPreviewEnabled) {
		bufferArray.push("</div>");

		bufferArray.push("<button");
		bufferArray.push(" type=\"button\"");
		bufferArray.push(" class=\"ebx_FlatButtonNoBorder ebx_IconButton ebx_Open\"");
		bufferArray.push(" title=\"", EBX_LocalizedMessage._general_preview, "\"");
		bufferArray.push(" onclick=\"", onclick, "\"");
		bufferArray.push(">");
		bufferArray.push("<span class=\"ebx_Icon\"></span>");
		bufferArray.push("</button>");
	}
};

EBX_ISS.dataSource = new YAHOO.util.XHRDataSource();
EBX_ISS.dataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
EBX_ISS.dataSource.responseSchema = {
	resultsList: "items",
	fields: [ {
		key: "key"
	}, {
		key: "label"
	}, {
		key: "labelForDisplay"
	}, {
		key: "cssClass"
	}, {
		key: "previewURL"
	} ],
	metaFields: {
		hasNext: "hasNext",
		nextIndex: "nextIndex"
	}
};

EBX_ISS.loadNextPage = function() {
	EBX_ISS.sendRequest();
};

EBX_ISS.sendRequest = function() {
	if (FormPresenterStatusIndicator.isWaiting()) {
		FormPresenterStatusIndicator.setListenerOnWaitingEnd(EBX_ISS.sendRequest);
		EBX_ISS.listState = EBX_ISS_State.WAITING_APV;
		EBX_ISS.refreshUIItemsList();
		return;
	}

	var request = [];
	request.push(EBX_ISS.sendingRequest);
	request.push("&", EBX_ISS.requestParam_ajaxComponentIndex, "=", encodeURIComponent(EBX_ISS.mapIdAjaxComponentIndex[EBX_ISS.currentInputEl.id]));
	request.push("&", EBX_ISS.requestParam_userInput, "=", encodeURIComponent(EBX_ISS.currentInputEl.value));
	request.push("&", EBX_ISS.requestParam_paginPageIndex, "=", EBX_ISS.requestedIndex);
	EBX_ISS.dataSource.sendRequest(request.join(""), {
		success: EBX_ISS.receiveSuccess,
		failure: EBX_ISS.receiveFailure,
		argument: EBX_ISS.currentInputEl.value
	});

	EBX_ISS.listState = EBX_ISS_State.LOADING;
	EBX_ISS.refreshUIItemsList();
};

EBX_ISS.receiveSuccess = function(oRequest, oParsedResponse, argument) {
	// reject outdated requests
	if (argument !== EBX_ISS.currentInputEl.value) {
		return;
	}

	EBX_ISS.results = EBX_ISS.results.concat(oParsedResponse.results);

	if (oParsedResponse.meta.hasNext) {
		EBX_ISS.listState = EBX_ISS_State.HAS_NEXT;
	} else if (EBX_ISS.results.length === 0) {
		EBX_ISS.listState = EBX_ISS_State.NO_RESULT;
	} else {
		EBX_ISS.listState = EBX_ISS_State.NORMAL;
	}
	EBX_ISS.requestedIndex = oParsedResponse.meta.nextIndex;

	EBX_ISS.refreshUIItemsList();
};

EBX_ISS.receiveFailure = function(oRequest, oParsedResponse, argument) {
	if (EBX_ISS.currentInputEl === null) {
		return;
	}
	// reject outdated requests
	if (argument !== EBX_ISS.currentInputEl.value) {
		return;
	}

	if (oParsedResponse.status == 401) {
		EBX_Loader.gotoTimeoutPage();
	} else {
		// TODO CCH it could be beautiful to add an iFrame with the result of the page (whole HTML content)
		// oParsedResponse.responseText
		// TODO CCH Filter the response code so that user is not annoyed by error messages which he do not bother.
		// EBX_UserMessageManager.addMessage("Error #" + oParsedResponse.status + ": " + oParsedResponse.statusText, EBX_UserMessageManager.ERROR);
		EBX_ISS.errorDivEl.innerHTML = decodeURIComponent(oParsedResponse.statusText);
	}
	EBX_ISS.listState = EBX_ISS_State.ERROR;
	EBX_ISS.refreshUIItemsList();
};

/**
 * Return true if the key pressed is not Alt, Meta or other specials unused
 */
EBX_ISS.isAnInterestingKeyEvent = function(event) {
	// when metaKey is pressed
	if (event.metaKey === 1 || event.keyCode === 91) {
		return false;
	}

	// when contextual menu is pressed
	if (event.keyCode === 93) {
		return false;
	}

	if (event.ctrlKey === 1) {
		// paste action is allowed (86 is key 'v')
		if (event.keyCode !== 86) {
			// both ctrl & alt is allowed
			if (event.altKey === 0) {
				return false;
			}
		}
	} else {
		if (event.altKey === 1) {
			return false;
		}
	}

	// when ctrl is pressed alone
	if (event.keyCode === 17) {
		return false;
	}

	// when alt is pressed alone
	if (event.keyCode === 18) {
		return false;
	}

	// shift key is allowed (upper case)
	//		if (event.shiftKey == 1)
	//		{
	//			return false;
	//		}

	// when shift is pressed alone
	if (event.shiftKey === 1 || event.keyCode === 16) {
		return false;
	}

	// when verr maj is pressed
	if (event.keyCode === 20) {
		return false;
	}

	// when verr num is pressed
	if (event.keyCode === 145) {
		return false;
	}

	// when TAB is pressed
	if (event.keyCode === 9) {
		// disable preventBlur even if the mouse is inside the list area
		EBX_ISS.preventBlur = false;
		return false;
	}

	// when ENTER is pressed
	if (event.keyCode === 13) {
		return EBX_ISS.isCurrentManualSearchMode;
	}

	// when ESCAPE is pressed
	/*
	if (event.keyCode === 27) {
	return false;
	}
	*/
	// when F1 to F12 are pressed
	if (event.keyCode >= 112 && event.keyCode <= 123) {
		return false;
	}
	// when PAUSE is pressed
	if (event.keyCode === 19) {
		return false;
	}
	// when PG_DOWN or PG_UP is pressed
	if (event.keyCode === 34 || event.keyCode === 33) {
		return false;
	}

	// when LEFT_ARROW or RIGHT_ARROW is pressed
	if (event.keyCode === 37 || event.keyCode === 39) {
		return false;
	}
	// when HOME or END is pressed
	if (event.keyCode === 36 || event.keyCode === 35) {
		return false;
	}

	// when TOP_ARROW is pressed while ISS is not shown
	if (event.keyCode === 38 && EBX_ISS.isShown === false) {
		return false;
	}

	// when ESCAPE is pressed while ISS is not shown
	if (event.keyCode === 27 && EBX_ISS.isShown === false) {
		return false;
	}

	return true;
};

EBX_ISS.emptyButtonHandler = function(labelInputId) {
	EBX_ISS.mapIdPreviewURL[labelInputId] = undefined;

	var labelEl = document.getElementById(labelInputId);
	FormNodeIndex.getFormNode(EBX_ISS.mapIdPathForNodeIndex[labelInputId]).setValue(null);
	FormPresenter.stackElementForValidation(labelEl);
	labelEl.focus();
};

EBX_ISS.openPreviewResultIndex = function(event, resultIndex) {
	var previewURL = EBX_ISS.results[resultIndex].previewURL;
	if (previewURL === undefined) {
		return;
	}
	YAHOO.util.Event.stopPropagation(event);
	EBXUtils.openInternalPopupLargeSizeHostedClose(previewURL);
};
EBX_ISS.openCurrentPreview = function(event) {
	var previewURL = EBX_ISS.mapIdPreviewURL[EBX_ISS.currentInputEl.id];
	if (previewURL === undefined) {
		return;
	}
	YAHOO.util.Event.stopPropagation(event);
	EBXUtils.openInternalPopupLargeSizeHostedClose(previewURL);
};
EBX_ISS.openCurrentCreate = function() {
	var createNewURL = EBX_ISS.mapIdCreateNewURL[EBX_ISS.currentInputEl.id];
	if (createNewURL === undefined) {
		return;
	}
	EBXUtils.openInternalPopupLargeSizeHostedClose(createNewURL);
};
EBX_ISS.openCurrentAdvancedSelector = function() {
	var advancedSelectorURL = EBX_ISS.mapIdAdvancedSelectorURL[EBX_ISS.currentInputEl.id];
	if (advancedSelectorURL === undefined) {
		return;
	}
	EBXUtils.openInternalPopupLargeSizeHostedClose(advancedSelectorURL);
};

EBX_ISS.openPreview = function(inputId) {
	var previewURL = EBX_ISS.mapIdPreviewURL[inputId];
	if (previewURL === undefined) {
		return;
	}
	EBXUtils.openInternalPopupLargeSizeHostedClose(previewURL);
};

/** *END Incremental Search Selector ** */

/** START ISS advanced selector */

function EBX_parentISSAdvancedSelectKeyAndClosePopup(issPath, keyValue) {
	parent.FormNode.setValue(issPath, {
		key: keyValue
	});
	parent.EBXUtils.closeInternalPopup();
}

/** END ISS advanced selector */

/** *START List ComboBox ** */

function EBX_LCB() {};

EBX_LCB.previewURLs = [];
EBX_LCB.listId = [];
EBX_LCB.previewButton = [];
EBX_LCB.deleteButton = [];
EBX_LCB.isListHiddenIfEmpty = [];

EBX_LCB.containerCSSClass = "ebx_LCB_Container";
EBX_LCB.displayListCSSClass = "ebx_LCB_DisplayList";
EBX_LCB.stateEmptyCSSClass = "ebx_LCB_StateEmpty";
EBX_LCB.lineActionsCSSClass = "ebx_LCB_LineActions";
EBX_LCB.freshlyAddedCSSClass = "ebx_LCB_FreshlyAdded";

EBX_LCB.previewLine = function(button, valuesSelectId) {
	var itemEl = button.parentNode.parentNode;
	var index = EBXUtils.getIndex(itemEl);

	var previewURLsForThisList = EBX_LCB.previewURLs[valuesSelectId];
	if (previewURLsForThisList === undefined) {
		return;
	}

	var previewURL = previewURLsForThisList[index];
	if (previewURL === undefined) {
		return;
	}

	EBXUtils.openInternalPopupLargeSizeHostedClose(previewURL);
};

EBX_LCB.deleteLine = function(button, valuesSelectId) {
	var itemEl = button.parentNode.parentNode;
	var listEl = itemEl.parentNode;
	var index = EBXUtils.getIndex(itemEl);
	var valuesSelect = document.getElementById(valuesSelectId);
	valuesSelect.remove(index);
	listEl.removeChild(itemEl);
	var previewURLsForThisList = EBX_LCB.previewURLs[valuesSelectId];
	if (previewURLsForThisList !== undefined) {
		previewURLsForThisList.splice(index, 1);
	}

	EBX_LCB.refreshCSSClasses(valuesSelectId, EBXUtils.getFirstParentMatchingCSSClass(listEl, EBX_LCB.containerCSSClass), valuesSelect.length === 0);
};

EBX_LCB.createLine = function(value, valuesSelectId) {
	if (value === null) {
		return;
	}

	var optionToAdd = document.createElement("option");
	optionToAdd.value = value.key;
	optionToAdd.selected = true;
	var valuesSelect = document.getElementById(valuesSelectId);
	valuesSelect.add(optionToAdd, null);

	var itemToAdd = document.createElement("li");
	itemToAdd.className = EBX_LCB.freshlyAddedCSSClass;
	if (value.key === ebx_nullValueForFacetEnum) {
		itemToAdd.className += " ebx_ValueND";
	}

	var itemToAddInnerHTML = [];

	var label = value.labelForDisplay;
	if (label.trim().length === 0) {
		label = "&nbsp;";// to view the line and avoid space collapsing
	}
	itemToAddInnerHTML.push(label);

	itemToAddInnerHTML.push("<div class=\"", EBX_LCB.lineActionsCSSClass, "\">");

	var previewURL = null;
	var previewButton = EBX_LCB.previewButton[valuesSelectId];
	if (previewButton !== undefined && value.previewURL !== undefined) {
		previewURL = value.previewURL;
		itemToAddInnerHTML.push(previewButton);
	}
	var previewURLsForThisList = EBX_LCB.previewURLs[valuesSelectId];
	if (previewURLsForThisList !== undefined) {
		previewURLsForThisList.push(previewURL);
	}

	var deleteButton = EBX_LCB.deleteButton[valuesSelectId];
	if (deleteButton !== undefined) {
		itemToAddInnerHTML.push(deleteButton);
	}
	itemToAddInnerHTML.push("</div>");

	itemToAdd.innerHTML = itemToAddInnerHTML.join("");

	var listEl = document.getElementById(EBX_LCB.listId[valuesSelectId]);
	listEl.appendChild(itemToAdd);

	listEl.parentNode.scrollTop = listEl.parentNode.scrollHeight;

	EBX_LCB.refreshCSSClasses(valuesSelectId, EBXUtils.getFirstParentMatchingCSSClass(listEl, EBX_LCB.containerCSSClass), valuesSelect.length === 0);
};

EBX_LCB.refreshCSSClasses = function(valuesSelectId, containerEl, isEmpty) {

	if (containerEl === null) {
		return;
	}

	if (isEmpty) {
		EBXUtils.addCSSClass(containerEl, EBX_LCB.stateEmptyCSSClass);
	} else {
		EBXUtils.removeCSSClass(containerEl, EBX_LCB.stateEmptyCSSClass);
	}

	if (EBX_LCB.isListHiddenIfEmpty[valuesSelectId] === true) {
		// if this boolean is not specified, EBX_LCB.displayListCSSClass is already set on containerEl
		if (isEmpty) {
			EBXUtils.removeCSSClass(containerEl, EBX_LCB.displayListCSSClass);
		} else {
			EBXUtils.addCSSClass(containerEl, EBX_LCB.displayListCSSClass);
		}
	}

};

/** *END List ComboBox ** */

/** *START Preview Image ** */

EBX_Form.previewPanel = null;
EBX_Form.previewPanelId = "ebx_Form_PreviewPanel";

EBX_Form.previewImage = function(externalResourcePath, webName) {
	var selectElement = document.getElementById(webName);

	if (selectElement.selectedIndex < 0) {
		return;
	}

	if (selectElement.options[selectElement.selectedIndex].value == ebx_nullValueForFacetEnum) {
		return;
	}

	var imageFileName = selectElement.options[selectElement.selectedIndex].text;
	EBX_Form.openPreviewImage(externalResourcePath + imageFileName, imageFileName);
};

EBX_Form.previewImage = function(externalResourcePath, webName) {
	var selectElement = document.getElementById(webName);

	if (selectElement.selectedIndex < 0) {
		return;
	}

	if (selectElement.options[selectElement.selectedIndex].value == ebx_nullValueForFacetEnum) {
		return;
	}

	var imageFileName = selectElement.options[selectElement.selectedIndex].text;
	EBX_Form.openPreviewImage(externalResourcePath + imageFileName, imageFileName);
};

EBX_Form.openPreviewImage = function(imageURL, altText) {
	if (EBX_Form.previewPanel === null) {
		EBX_Form.previewPanel = new YAHOO.widget.Panel(EBX_Form.previewPanelId, {
			close: true,
			draggable: false,
			modal: true,
			fixedCenter: true,
			visible: false
		});
		EBX_Form.previewPanel.render(document.body);
	}

	var previewPanelBodyContent = [];

	previewPanelBodyContent.push("<div id=\"ebx_Form_PreviewPanelScroller\"");
	previewPanelBodyContent.push("style=\"");
	previewPanelBodyContent.push("max-height:", document.body.clientHeight - 65, "px;");
	previewPanelBodyContent.push("max-width:", document.body.clientWidth - 50, "px;");
	previewPanelBodyContent.push("\"");
	previewPanelBodyContent.push(">");

	var extension = imageURL.substring(imageURL.lastIndexOf("."), imageURL.length);

	switch (extension) {
		case ".swf":
			previewPanelBodyContent.push("<embed");
			previewPanelBodyContent.push(" src=\"", imageURL, "\"");
			previewPanelBodyContent.push(" quality=\"best\"/");
			previewPanelBodyContent.push(" onload=\"EBX_Form.previewPanel.show()\"");
			previewPanelBodyContent.push("/>");
			break;

		case ".gif":
		case ".jpg":
		case ".jpeg":
		case ".png":
		case ".bmp":
			previewPanelBodyContent.push("<img");
			previewPanelBodyContent.push(" src=\"", imageURL, "\"");
			previewPanelBodyContent.push(" alt=\"", altText, "\"");
			previewPanelBodyContent.push(" onload=\"EBX_Form.previewPanel.show()\"");
			previewPanelBodyContent.push("/>");
			break;

		default:
			break;
	}

	previewPanelBodyContent.push("</div>");

	EBX_Form.previewPanel.setBody(previewPanelBodyContent.join(""));

	YAHOO.util.Event.addListener(EBX_Form.previewPanelId + "_mask", "click", EBX_Form.closePreviewImage);
};

EBX_Form.closePreviewImage = function() {
	EBX_Form.previewPanel.hide();
};

/** *END Preview Image ** */

EBX_Form.isEventToInputText = function(event) {
	// when metaKey is pressed
	if (event.metaKey === 1) {
		return false;
	}

	if (event.ctrlKey === 1) {
		// paste action is allowed (86 is key 'v')
		if (event.keyCode !== 86) {
			// both ctrl & alt is allowed
			if (event.altKey === 0) {
				return false;
			}
		}
	} else {
		if (event.altKey === 1) {
			return false;
		}
	}

	// shift key is allowed (upper case)
	//		if (event.shiftKey == 1)
	//		{
	//			return false;
	//		}

	// when shift is pressed alone
	if (event.shiftKey === 1 && event.keyCode === 16) {
		return false;
	}

	// when TAB is pressed
	if (event.keyCode === 9) {
		return false;
	}
	// when ENTER is pressed
	if (event.keyCode === 13) {
		return false;
	}
	// when ESCAPE is pressed
	if (event.keyCode === 27) {
		return false;
	}
	// when F1 to F12 are pressed
	if (event.keyCode >= 112 && event.keyCode <= 123) {
		return false;
	}
	// when PAUSE is pressed
	if (event.keyCode === 19) {
		return false;
	}
	// when PG_DOWN or PG_UP is pressed
	if (event.keyCode === 34 || event.keyCode === 33) {
		return false;
	}
	// when HOME or END is pressed
	if (event.keyCode === 36 || event.keyCode === 35) {
		return false;
	}

	return true;
};

/** *START empty, nil and overwrite buttons ** */
/** END empty buttons * */
EBX_Form.EmptySuffix = "_Empty";
/*START empty button for RadioButtonGroup */
EBX_Form.emptyRadioButtonGroup = function(radioButtonGroupName, isUserInput) {
	var radioButtonGroupElements = document.getElementsByName(radioButtonGroupName);
	var firstRadioButton = null;
	for ( var i = 0; i < radioButtonGroupElements.length; i++) {
		radioButtonGroupElements[i].checked = false;
		// IE includes getElementById in getElementsByName
		// so exclude the inputFocusRedirector
		if (firstRadioButton === null && !EBXUtils.matchCSSClass(radioButtonGroupElements[i], EBX_FormWidgets.inputFocusRedirector_CSSClass)) {
			firstRadioButton = radioButtonGroupElements[i];
		}
	}
	EBX_ButtonUtils.setButtonDisabled(document.getElementById(radioButtonGroupName + EBX_Form.EmptySuffix), true);

	if (firstRadioButton !== null) {
		if (isUserInput === true) {
			firstRadioButton.focus();
			FormPresenter.stackElementForValidation(firstRadioButton);
		}
	}
};
EBX_Form.refreshEmptyButtonFromRadioButton = function(radioButtonName, isUserInput) {
	var radioButtonGroupElements = document.getElementsByName(radioButtonName);
	for ( var i = 0; i < radioButtonGroupElements.length; i++) {
		if (radioButtonGroupElements[i].checked === true) {
			EBX_ButtonUtils.setButtonDisabled(document.getElementById(radioButtonName + EBX_Form.EmptySuffix), false);
			if (isUserInput === true) {
				FormPresenter.stackElementForValidation(radioButtonGroupElements[i]);
			}
			return;
		}
	}
	EBX_ButtonUtils.setButtonDisabled(document.getElementById(radioButtonName + EBX_Form.EmptySuffix), true);
	if (isUserInput === true) {
		// is this code still alive? if yes, fix it about IE including getElementById in getElementsByName (inputFocusRedirector having no name)
		FormPresenter.stackElementForValidation(radioButtonGroupElements[0]);
	}
};
/*END empty button for RadioButtonGroup */
/*START empty button for String */
EBX_Form.emptyInputText = function(inputTextId) {
	document.getElementById(inputTextId).value = "";

	var emptyButton = document.getElementById(inputTextId + EBX_Form.EmptySuffix);
	if (emptyButton) {
		EBX_ButtonUtils.setButtonDisabled(emptyButton, true);
	}

	EBX_Form.focus(inputTextId);
};
EBX_Form.whenStringInputIsKeyPressedOrChange = function(inputTextEl) {
	// let moment to the browser to set new value
	setTimeout("EBX_Form.refreshEmptyButtonFromField('" + inputTextEl.id + "');", 50);
};
EBX_Form.refreshEmptyButtonFromField = function(inputTextId) {
	var emptyButton = document.getElementById(inputTextId + EBX_Form.EmptySuffix);
	if (!emptyButton) {
		return;
	}

	if (document.getElementById(inputTextId).value === "") {
		EBX_ButtonUtils.setButtonDisabled(emptyButton, true);
	} else {
		EBX_ButtonUtils.setButtonDisabled(emptyButton, false);
	}
};
/*END empty button for String */
/*START empty button for Date */
EBX_Form.dateSuffixes = function() {};

EBX_Form.emptyDateInputs = function(dateInputsBaseName, enableValidation) {
	var dateInputsContainerEl = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.DateInputs);

	var firstDateField = null;
	for ( var i = 0; i < dateInputsContainerEl.childNodes.length; i++) {
		if (dateInputsContainerEl.childNodes[i].nodeType === 1 && dateInputsContainerEl.childNodes[i].tagName === "INPUT"
				&& dateInputsContainerEl.childNodes[i].type === "text") {
			dateInputsContainerEl.childNodes[i].value = "";
			if (firstDateField === null) {
				firstDateField = dateInputsContainerEl.childNodes[i];
			}
		}
	}
	EBX_ButtonUtils.setButtonDisabled(document.getElementById(dateInputsBaseName + EBX_Form.EmptySuffix), true);
	if (firstDateField !== null) {
		if (enableValidation === true) {
			firstDateField.focus();
			FormPresenter.stackElementForValidation(firstDateField);
		}
	}
};
EBX_Form.whenDateInputIsKeyPressedOrChange = function(dateInputsBaseName) {
	// let a moment to the browser to set new value
	// inputting value is already listen by the default system
	setTimeout("EBX_Form.refreshEmptyButtonFromDateField('" + dateInputsBaseName + "', false);", 50);
};
EBX_Form.refreshEmptyButtonFromDateField = function(dateInputsBaseName, enableValidation) {
	var dateInputsContainerEl = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.DateInputs);

	if (enableValidation === true) {
		var firstInput = EBXUtils.getFirstRecursiveChildMatchingTagName(dateInputsContainerEl, "input");
		if (firstInput !== null) {
			FormPresenter.stackElementForValidation(firstInput);
		}
	}

	if (!document.getElementById(dateInputsBaseName + EBX_Form.EmptySuffix)) {
		return;
	}

	for ( var i = 0; i < dateInputsContainerEl.childNodes.length; i++) {
		if (dateInputsContainerEl.childNodes[i].nodeType === 1 && dateInputsContainerEl.childNodes[i].tagName === "INPUT"
				&& dateInputsContainerEl.childNodes[i].type === "text" && dateInputsContainerEl.childNodes[i].value !== "") {
			EBX_ButtonUtils.setButtonDisabled(document.getElementById(dateInputsBaseName + EBX_Form.EmptySuffix), false);
			return;
		}
	}
	EBX_ButtonUtils.setButtonDisabled(document.getElementById(dateInputsBaseName + EBX_Form.EmptySuffix), true);
};

EBX_Form.dateFieldBlur = function(dateInputsBaseName, dateField) {
	var dateInputsContainerEl = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.DateInputs);

	dateInputsContainerEl.validationTimeout = window.setTimeout(function() {
		FormPresenter.stackElementForValidation(dateField);
	}, 100);
};
EBX_Form.dateFieldFocus = function(dateInputsBaseName) {
	var dateInputsContainerEl = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.DateInputs);
	if (dateInputsContainerEl.validationTimeout !== undefined) {
		window.clearTimeout(dateInputsContainerEl.validationTimeout);
		dateInputsContainerEl.validationTimeout = undefined;
	}
};

/*END empty button for Date */
/*START empty button for FacetEnum */
EBX_Form.emptyFacetEnum = function(fieldId, isUserInput) {
	var fieldEl = document.getElementById(fieldId);
	fieldEl.value = ebx_nullValueForFacetEnum;

	document.getElementById(fieldId + EBX_FacetEnumeration.InputFieldDisplaySuffix).value = FacetEnumeration_label_nullValue;

	var emptyButton = document.getElementById(fieldId + EBX_Form.EmptySuffix);
	if (emptyButton !== null) {
		EBX_ButtonUtils.setButtonDisabled(emptyButton, true);
	}

	if (isUserInput === true) {
		EBX_Form.focus(fieldId + EBX_FacetEnumeration.InputFieldDisplaySuffix);
		FormPresenter.stackElementForValidation(fieldEl);
	}
};
EBX_Form.refreshEmptyButtonFromFacetEnumField = function(fieldEl, isUserInput) {

	if (isUserInput === true) {
		FormPresenter.stackElementForValidation(fieldEl);
	}

	var emptyButton = document.getElementById(fieldEl.id + EBX_Form.EmptySuffix);
	if (emptyButton === null) {
		return;
	}
	if (fieldEl.value == ebx_nullValueForFacetEnum) {
		EBX_ButtonUtils.setButtonDisabled(emptyButton, true);
	} else {
		EBX_ButtonUtils.setButtonDisabled(emptyButton, false);
	}
};
/*END empty button for FacetEnum */
/*START empty button for PasswordUIBean */
EBX_Form.passwordUIBeanConfirmSuffix = "_passwordConfirm";
EBX_Form.passwordUIBeanConfirmZoneSuffix = "_passwordConfirmZone";
EBX_Form.emptyPasswordUIBean = function(firstPasswordFieldId) {
	document.getElementById(firstPasswordFieldId).value = "";
	document.getElementById(firstPasswordFieldId + EBX_Form.passwordUIBeanConfirmSuffix).value = "";
	document.getElementById(firstPasswordFieldId + EBX_Form.passwordUIBeanConfirmZoneSuffix).style.display = "";

	if (document.getElementById(firstPasswordFieldId + EBX_Form.EmptySuffix) !== null) {
		EBX_ButtonUtils.setButtonDisabled(document.getElementById(firstPasswordFieldId + EBX_Form.EmptySuffix), true);
	}

	EBX_Form.focus(firstPasswordFieldId);
};
EBX_Form.whenPasswordUIBeanInputIsKeyPressedOrChange = function(firstPasswordFieldId) {
	// let a moment to the browser to set new value
	setTimeout("EBX_Form.refreshEmptyButtonFromPasswordUIBeanField('" + firstPasswordFieldId + "');", 50);
};
EBX_Form.refreshEmptyButtonFromPasswordUIBeanField = function(firstPasswordFieldId) {
	var confirmZone = document.getElementById(firstPasswordFieldId + EBX_Form.passwordUIBeanConfirmZoneSuffix);
	// if the user input is a re-set, the confirm zone is not displayed
	if (confirmZone.offsetWidth === 0) {
		EBX_Form.emptyPasswordUIBean(firstPasswordFieldId);
		return;
	}

	if (document.getElementById(firstPasswordFieldId + EBX_Form.EmptySuffix) !== null) {
		if (document.getElementById(firstPasswordFieldId).value === ""
				&& document.getElementById(firstPasswordFieldId + EBX_Form.passwordUIBeanConfirmSuffix).value === "") {
			EBX_ButtonUtils.setButtonDisabled(document.getElementById(firstPasswordFieldId + EBX_Form.EmptySuffix), true);
		} else {
			EBX_ButtonUtils.setButtonDisabled(document.getElementById(firstPasswordFieldId + EBX_Form.EmptySuffix), false);
		}
	}
};
/*END empty button for PasswordUIBean */
/** END empty buttons * */

EBX_Form.focusInputField = function(webName) {

	var el = document.getElementById(webName);

	if (el === null) {
		return;
	}

	EBX_Form.focusElementIfStillVisible(el);

	// TODO CCH
	// if null : redirect on the null button
	// else if an element is find with webName, focus it
	// else focus the first visible input in the ebx_InputFieldWrapper
};

/** START nil buttons * */

EBX_Form.NilClassName = "ebx_Nil";
EBX_Form.NullSuffix = "_isNull";

EBX_Form.isNil = function(fieldWrapperId) {
	return EBXUtils.matchCSSClass(EBXUtils
			.getFirstParentMatchingCSSClass(document.getElementById(fieldWrapperId), EBX_Form.OverwrittenValueClassName), EBX_Form.NilClassName);
};
/*START nil button for String */
EBX_Form.setStringNullOn = function(webName) {
	var form = document.getElementById(EBX_Form.WorkspaceFormId);
	var inputTextEl = form[webName];

	inputTextEl.oldValue = inputTextEl.value;

	EBX_Form.emptyInputText(inputTextEl.id);
	inputTextEl.readOnly = true;

	EBXUtils.addCSSClass(EBXUtils.getFirstParentMatchingCSSClass(inputTextEl, EBX_Form.OverwrittenValueClassName), EBX_Form.NilClassName);

	inputTextEl.value = "";

	var button = document.getElementById(webName + EBX_Form.NullSuffix);
	if (button) {
		button.tabindex = "0";
	}
};
EBX_Form.setStringNullOff = function(webName) {
	var form = document.getElementById(EBX_Form.WorkspaceFormId);
	var inputTextEl = form[webName];

	inputTextEl.readOnly = false;

	EBXUtils.removeCSSClass(EBXUtils.getFirstParentMatchingCSSClass(inputTextEl, EBX_Form.OverwrittenValueClassName), EBX_Form.NilClassName);

	if (inputTextEl.oldValue) {
		inputTextEl.value = inputTextEl.oldValue;
	} else {
		inputTextEl.value = "";
	}
	EBX_Form.refreshEmptyButtonFromField(webName);

	var button = document.getElementById(webName + EBX_Form.NullSuffix);
	if (button) {
		button.tabindex = "-1";
	}

	inputTextEl.focus();
};
/*END nil button for String */
/*START nil button for Complex or List */
EBX_Form.setComplexOrListNullOn = function(webName) {
	EBXUtils.addCSSClass(EBXUtils.getFirstParentMatchingCSSClass(document.getElementById(webName + EBX_Form.InputFieldWrapperSuffix),
			EBX_Form.OverwrittenValueClassName), EBX_Form.NilClassName);

	var button = document.getElementById(webName + EBX_Form.NullSuffix);
	if (button) {
		button.tabindex = "0";
	}
};
EBX_Form.setComplexOrListNullOff = function(webName) {
	EBXUtils.removeCSSClass(EBXUtils.getFirstParentMatchingCSSClass(document.getElementById(webName + EBX_Form.InputFieldWrapperSuffix),
			EBX_Form.OverwrittenValueClassName), EBX_Form.NilClassName);

	var button = document.getElementById(webName + EBX_Form.NullSuffix);
	if (button) {
		button.tabindex = "-1";
	}

	EBX_Form.focusInputField(webName);
};
/*END nil button for Complex or List */
/** END nil buttons * */

/** START inherit button * */
EBX_Form.InheritedClassName = "ebx_Inherited";

EBX_Form.setInheritedOn = function(webName) {
	EBXUtils.addCSSClass(EBXUtils.getFirstParentMatchingCSSClass(document.getElementById(webName + EBX_Form.InputFieldWrapperSuffix),
			EBX_Form.InputClassName), EBX_Form.InheritedClassName);
};
EBX_Form.setInheritedOff = function(webName) {
	EBXUtils.removeCSSClass(EBXUtils.getFirstParentMatchingCSSClass(document.getElementById(webName + EBX_Form.InputFieldWrapperSuffix),
			EBX_Form.InputClassName), EBX_Form.InheritedClassName);

	EBX_Form.focusInputField(webName);
};
/** START inherit button * */

/** *END empty, nil and overwrite buttons ** */

/* ** START Calendar ** */

EBX_Form.calendar = null;
EBX_Form.calendarConfig = {
	close: true
};

EBX_Form.calendarPanel = null;
EBX_Form.calendarPanelId = "ebx_Form_CalendarPanel";

EBX_Form.calendarMaskId = "ebx_Form_CalendarMask";
EBX_Form.calendarMask = null;
EBX_Form.getCalendarMask = function() {
	if (EBX_Form.calendarMask === null) {
		EBX_Form.calendarMask = document.createElement("div");
		EBX_Form.calendarMask.id = EBX_Form.calendarMaskId;
		EBX_Form.calendarMask.style.display = "none";

		YAHOO.util.Event.addListener(EBX_Form.calendarMask, "click", EBX_Form.hideCalendarPanel);
	}

	return EBX_Form.calendarMask;
};

EBX_Form.openXPathCalendarHelper = function(inputFieldId) {
	onHideShowTreeHelper(null, null);

	var inputField = document.getElementById(inputFieldId);

	if (EBX_Form.calendarPanel === null) {
		EBX_Form.calendarPanel = new YAHOO.widget.Overlay(EBX_Form.calendarPanelId, {
			constraintoviewport: true,
			visible: false,
			draggable: true,
			effect: {
				effect: YAHOO.widget.ContainerEffect.FADE,
				duration: 0.2
			}
		});
		EBX_Form.calendarPanel.render(inputField.form);
	}

	if (EBX_Form.calendar === null) {
		EBX_Form.calendar = new YAHOO.widget.Calendar(EBX_Form.calendarPanel.element, {
			close: true,
			draggable: true
		});
	}

	var today = new Date();
	var dateToSelect = today.getMonth() + 1;

	dateToSelect += "/";
	var pagedate = dateToSelect;

	dateToSelect += today.getDate();
	dateToSelect += "/";

	dateToSelect += today.getFullYear();
	pagedate += today.getFullYear();

	EBX_Form.calendar.selectEvent.unsubscribe(EBX_Form.calendarXPathSelectionHandler);
	EBX_Form.calendar.selectEvent.unsubscribe(EBX_Form.calendarSelectionHandler);

	EBX_Form.calendar.select(dateToSelect);
	EBX_Form.calendar.cfg.setProperty("pagedate", pagedate);
	EBX_Form.calendar.selectEvent.subscribe(EBX_Form.calendarXPathSelectionHandler, inputField);
	EBX_Form.calendar.hideEvent.subscribe(EBX_Form.hideCalendarPanel);
	EBX_Form.calendar.render();
	EBX_Form.calendar.show();

	EBX_Form.calendarPanel.cfg.setProperty('context', [ inputField, 'tl', 'bl' ]);

	EBX_Form.showCalendarPanel();
};

EBX_Form.calendarXPathSelectionHandler = function(type, args, inputField) {
	var dates = args[0];
	var date = dates[0];
	var year = date[0];
	var month = date[1];
	var day = date[2];
	EBX_Form.insertTextAtCursorPosition(inputField, "'" + year + "-" + month + "-" + day + "'");

	EBX_Form.hideCalendarPanel();
};

EBX_Form.openCalendar = function(yearFieldId, monthFieldId, dayFieldId, dateInputsBaseName) {
	var fieldsObj = {
		yearField: document.getElementById(yearFieldId),
		monthField: document.getElementById(monthFieldId),
		dayField: document.getElementById(dayFieldId),
		dateInputsBaseName: dateInputsBaseName
	};

	if (EBX_Form.calendarPanel === null) {
		EBX_Form.calendarPanel = new YAHOO.widget.Overlay(EBX_Form.calendarPanelId, {
			constraintoviewport: true,
			visible: false
		});
		EBX_Form.calendarPanel.render(fieldsObj.yearField.form);
	}

	if (EBX_Form.calendar === null) {
		EBX_Form.calendar = new YAHOO.widget.Calendar(EBX_Form.calendarPanel.element, EBX_Form.calendarConfig);
		EBX_Form.calendar.Style.CSS_NAV_LEFT = "ebx_FlatButton ebx_IconButton ebx_PagingPrevious";
		EBX_Form.calendar.Style.CSS_NAV = "ebx_FlatButton";
		EBX_Form.calendar.Style.CSS_NAV_RIGHT = "ebx_FlatButton ebx_IconButton ebx_PagingNext";

		EBX_Form.calendar.renderNavEvent.subscribe(function() {
			document.getElementById(EBX_Form.calendarPanelId + "_nav_cancel").className = "ebx_Button";
			document.getElementById(EBX_Form.calendarPanelId + "_nav_cancel").parentNode.className = "";
			document.getElementById(EBX_Form.calendarPanelId + "_nav_submit").className = "ebx_Button ebx_DefaultButton";
			document.getElementById(EBX_Form.calendarPanelId + "_nav_submit").parentNode.className = "";
		});

		EBX_Form.calendar.renderEvent.subscribe(EBX_Form.setCalendarPaginButtonsStyle);
	}

	var today = new Date();
	var dateToSelect = "";
	/* month/day/year */
	var monthValue = parseInt(fieldsObj.monthField.value, 10);
	if (isNaN(monthValue)) {
		dateToSelect += today.getMonth() + 1;
	} else {
		dateToSelect += monthValue;
	}

	dateToSelect += "/";
	var pagedate = dateToSelect;
	/* month/year */
	var dayValue = parseInt(fieldsObj.dayField.value, 10);
	if (isNaN(dayValue)) {
		dateToSelect += today.getDate();
	} else {
		dateToSelect += dayValue;
	}

	dateToSelect += "/";

	var yearValue = parseInt(fieldsObj.yearField.value, 10);
	if (isNaN(yearValue)) {
		dateToSelect += today.getFullYear();
		pagedate += today.getFullYear();
	} else {
		dateToSelect += yearValue;
		pagedate += yearValue;
	}

	EBX_Form.calendar.selectEvent.unsubscribe(EBX_Form.calendarSelectionHandler);
	EBX_Form.calendar.selectEvent.unsubscribe(EBX_Form.calendarXPathSelectionHandler);

	EBX_Form.calendar.select(dateToSelect);
	EBX_Form.calendar.cfg.setProperty("pagedate", pagedate);

	EBX_Form.calendar.selectEvent.subscribe(EBX_Form.calendarSelectionHandler, fieldsObj);
	EBX_Form.calendar.hideEvent.subscribe(EBX_Form.hideCalendarPanel);

	EBX_Form.calendar.render();
	EBX_Form.calendar.show();

	EBX_Form.calendarPanel.cfg.setProperty('context', [ dateInputsBaseName + EBX_Form.dateSuffixes.DateInputs, 'tl', 'bl' ]);

	EBX_Form.showCalendarPanel();
};

EBX_Form.setCalendarPaginButtonsStyle = function() {
	EBX_Form.calendar.linkLeft.title = EBX_Form.calendar.linkLeft.innerHTML;
	EBX_Form.calendar.linkLeft.innerHTML = "<span class=\"ebx_Icon\"></span>";

	EBX_Form.calendar.linkRight.title = EBX_Form.calendar.linkRight.innerHTML;
	EBX_Form.calendar.linkRight.innerHTML = "<span class=\"ebx_Icon\"></span>";
};

EBX_Form.calendarSelectionHandler = function(type, args, fieldsObj) {
	var dates = args[0];
	var date = dates[0];
	var year = date[0], month = date[1], day = date[2];

	fieldsObj.yearField.value = year;
	fieldsObj.monthField.value = month;
	fieldsObj.dayField.value = day;

	EBX_Form.refreshEmptyButtonFromDateField(fieldsObj.dateInputsBaseName, true);

	EBX_Form.hideCalendarPanel();
};
EBX_Form.showCalendarPanel = function() {
	EBX_Form.calendarPanel.show();

	var calendarMask = EBX_Form.getCalendarMask();

	EBX_Form.calendarPanel.element.parentNode.appendChild(calendarMask);
	calendarMask.style.display = "";
};
EBX_Form.hideCalendarPanel = function() {
	EBX_Form.calendarPanel.hide();

	var calendarMask = EBX_Form.getCalendarMask();
	calendarMask.style.display = "none";
};

EBX_Form.fillTimeDateWithNow = function(dateInputsBaseName) {
	EBX_Form.fillTimeDate(dateInputsBaseName, new Date(), true);
};
EBX_Form.fillTimeDate = function(dateInputsBaseName, date, enableValidation) {
	var fieldYear = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.year);
	if (fieldYear) {
		fieldYear.value = date.getFullYear();
	}

	// fill-a-zero-before was disabled for day and month #4609

	var fieldMonth = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.month);
	if (fieldMonth) {
		fieldMonth.value = /*(date.getMonth() < 9 ? "0" : "") + */(date.getMonth() + 1);
	}

	var fieldDay = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.day);
	if (fieldDay) {
		fieldDay.value = /*(date.getDate() < 10 ? "0" : "") + */
		date.getDate();
	}

	var fieldHour = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.hour);
	if (fieldHour) {
		fieldHour.value = (date.getHours() < 10 ? "0" : "") + date.getHours();
	}

	var fieldMinute = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.minute);
	if (fieldMinute) {
		fieldMinute.value = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
	}

	var fieldSecond = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.second);
	if (fieldSecond) {
		fieldSecond.value = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
	}

	var fieldMilliSecond = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.milliSecond);
	if (fieldMilliSecond) {
		fieldMilliSecond.value = (date.getMilliseconds() < 10 ? "00" : date.getMilliseconds() < 100 ? "0" : "") + date.getMilliseconds();
	}

	EBX_Form.refreshEmptyButtonFromDateField(dateInputsBaseName, enableValidation);
};

/** *END Calendar ** */

/** * START Text utils ** */
EBX_Form.insertTextAtCursorPosition = function(targetObject, text) {
	var scrollPos = targetObject.scrollTop;
	if (YAHOO.env.ua.ie) {
		targetObject.focus();
		document.selection.createRange().text = text;
	} else {
		// Others
		var startPosition = targetObject.selectionStart;
		var endPosition = targetObject.selectionEnd;
		targetObject.value = targetObject.value.substring(0, startPosition) + text + targetObject.value.substring(endPosition);
		targetObject.setSelectionRange(startPosition + text.length, startPosition + text.length);
	}
	targetObject.scrollTop = scrollPos;
};
/** * END Text Utils ** */

function ebx_dataSpaceSelector(inputId, inputLabelId, buttonId, getHomeURL) {
	this.inputId = inputId;
	this.inputLabelId = inputLabelId;
	this.buttonId = buttonId;
	this.getHomeURL = getHomeURL;

	this.pane = new YAHOO.widget.Panel("ebx_dataSpacePanel", {
		visible: false,
		draggable: false,
		close: true,
		constraintoviewport: true
	});

	this.ebx_Show = function() {
		this.onExecute(this.getHomeURL);
	};

	this.ebx_Hide = function() {
		this.pane.hide();
	};

	this.ebx_setToggleButtonOff = function() {
		var button = document.getElementById(this.buttonId);
		if (button === null) {
			EBXLogger.log("ebx_dataSpaceSelector.ebx_setToggleButtonOff: Can not find button " + this.buttonId, EBXLogger.error);
			return;
		}
		EBX_ButtonUtils.setStateToToggleButton(button, false);
	};
	this.pane.hideEvent.subscribe(this.ebx_setToggleButtonOff, null, this);

	this.ebx_recursivlyAppendNodeToParent = function(jsonNode, parentNode) {
		var hasChildren = jsonNode.children && jsonNode.children.length > 0;
		var newNode = new YAHOO.widget.HTMLNode(jsonNode.data, parentNode, hasChildren);

		var scriptToExecute = "";
		var localScriptToExecute = jsonNode.data.ebx_scriptToExecute;
		if (localScriptToExecute !== null && localScriptToExecute !== undefined) {
			EBXLogger.log("ebx_dataSpaceSelector.ebx_recursivlyAppendNodeToParent: [" + this.inputId + "] found script to execute: "
					+ localScriptToExecute, EBXLogger.info);
			scriptToExecute += localScriptToExecute;
		}

		if (hasChildren) {
			for ( var i = 0; i < jsonNode.children.length; i++) {
				scriptToExecute += this.ebx_recursivlyAppendNodeToParent(jsonNode.children[i], newNode);
			}
		}
		return scriptToExecute;
	};

	this.ebx_setValue = function(value, label) {
		var inputEl = document.getElementById(this.inputId);
		if (inputEl === null) {
			EBXLogger.log("ebx_dataSpaceSelector.ebx_setValue: Can not find" + this.inputId, EBXLogger.error);
			return;
		}

		var labelEl = document.getElementById(this.inputLabelId);
		if (labelEl === null) {
			EBXLogger.log("ebx_dataSpaceSelector.ebx_setValue: Can not find" + this.inputLabelId, EBXLogger.error);
			return;
		}
		inputEl.value = value;
		labelEl.value = label;
		this.ebx_Hide();
	};

	this.onGetExceptedResponseCode = function(callerId) {
		return this.responseCodeOK_JSONDoc;
	};

	this.onExecuteIfOK = function(responseXML, root) {
		var bodyElement = root.getElementsByTagName('responseBody')[0];
		if (!bodyElement.firstChild) {
			EBXLogger
					.log("ebx_dataSpaceSelector.onExecuteIfOK: Error getting responseBody from response: " + this.getResponseText(), EBXLogger.error);
			return false;
		}

		var jsonString = bodyElement.firstChild.data;

		var jsonObj = YAHOO.lang.JSON.parse(jsonString);
		if (!jsonObj) {
			EBXLogger.log("ebx_dataSpaceSelector.onExecuteIfOK: Error getting JSON from response: " + this.getResponseText(), EBXLogger.error);
			return false;
		}

		var treeNameAtt = root.attributes.getNamedItem('treeName');
		if (treeNameAtt !== null) {
			var treeName = treeNameAtt.nodeValue;
			if (treeName != this.inputId) {
				EBXLogger.log('ebx_dataSpaceSelector.onExecuteIfOK: Received response is not for current tree [' + this.inputId + '] but for ['
						+ treeName + '].', EBXLogger.error);
				return false;
			}
		}

		EBXLogger.log("ebx_dataSpaceSelector.onExecuteIfOK: searching for " + this.inputLabelId, EBXLogger.info);
		var labelEl = document.getElementById(this.inputLabelId);
		if (labelEl === null) {
			EBXLogger.log("ebx_dataSpaceSelector.onExecuteIfOK: Can not find" + this.inputLabelId, EBXLogger.error);
			return;
		}

		this.pane
				.setBody("<div id=\"ebx_dataSpaceSelectorContent\" style=\"background-color: white; width: 320px; height: 320px; overflow: auto;\"></div>");
		var bodyEl = document.body;
		this.pane.render(bodyEl);
		this.pane.cfg.setProperty('context', [ labelEl, 'tl', 'bl' ]);
		this.pane.show();
		var tree = new YAHOO.widget.TreeView("ebx_dataSpaceSelectorContent");
		tree.subscribe("clickEvent", EBXUtils.returnFalse);

		var rootNode = tree.getRoot();
		var scriptToExecute = "";

		if (YAHOO.lang.isArray(jsonObj)) {
			for ( var i = 0, j = jsonObj.length; i < j; i++) {
				scriptToExecute += this.ebx_recursivlyAppendNodeToParent(jsonObj[i], rootNode);
			}
		} else {
			scriptToExecute += this.ebx_recursivlyAppendNodeToParent(jsonObj, rootNode);
		}

		/* run embedded script */
		window.setTimeout(scriptToExecute, 0);

		tree.render();
		var button = document.getElementById(this.buttonId);
		if (button === null) {
			EBXLogger.log("ebx_dataSpaceSelector.onExecuteIfOK: Can not find button " + this.buttonId, EBXLogger.error);
			return;
		}
		EBX_ButtonUtils.setStateToToggleButton(button, true);
	};

	this.onExecuteIfKO = function(responseXML) {};
};

ebx_dataSpaceSelector.prototype = new EBX_AbstractAjaxResponseManager();

/** *START Hierarchy popup ** */

/**
 * Opens a popup to view (and edit) the data for the clicked node.
 */
ebx_OpenHRINodeInPopup = function(popupUrl) {
	var popupHriNode = window.open(popupUrl, 'EditHriNode', 'width=800,height=600,scrollbars=yes,resizable=yes,menu=no,dependent=yes,status=yes');
	popupHriNode.window.focus();
};
/** *END Hierarchy popup ** */

/** *START Data Services ** */

function EBX_DataServices() {}

EBX_DataServices.onSelectAll = function(tableElementId, selectAllId) {
	var tableElement = document.getElementById(tableElementId);
	var isChecked = document.getElementById(selectAllId).checked;

	var allInputs = tableElement.getElementsByTagName('INPUT');
	var length = allInputs.length;
	for ( var i = 0; i < length; i++) {
		var anyInput = allInputs[i];
		if (anyInput.type === "checkbox") {
			anyInput.checked = isChecked;
		}
	}
};

EBX_DataServices.onSelectRow = function(selectRowClass, rowOperationsClass, selectRowId, selectAllId, tableElementId) {
	var tableElement = document.getElementById(tableElementId);
	var selectRowInput = document.getElementById(selectRowId);

	//select all operation for row
	{
		var operationInputs = EBXUtils.getRecursiveChildrenMatchingCSSClass(tableElement, rowOperationsClass);
		for ( var i = 0; i < operationInputs.length; i++) {
			var operationInput = operationInputs[i];
			if (operationInput.type === "checkbox") {
				operationInput.checked = selectRowInput.checked;
			}
		}
	}

	//check if all rows are selected
	EBX_DataServices.checkAllRowSelected(selectRowClass, selectAllId, tableElement);
};

EBX_DataServices.onSelectOperation = function(rowOperationsClass, selectRowClass, selectRowInputId, selectAllId, tableElementId) {
	var tableElement = document.getElementById(tableElementId);
	var selectRowInput = document.getElementById(selectRowInputId);

	var operationInputs = EBXUtils.getRecursiveChildrenMatchingCSSClass(tableElement, rowOperationsClass);
	var isAllSelected = true;
	for ( var i = 0; i < operationInputs.length; i++) {
		if (!operationInputs[i].checked) {
			isAllSelected = false;
		}
	}

	if (isAllSelected) {
		selectRowInput.checked = true;
	} else {
		selectRowInput.checked = false;
	}

	//check if all rows are selected
	EBX_DataServices.checkAllRowSelected(selectRowClass, selectAllId, tableElement);
};

EBX_DataServices.checkAllRowSelected = function(selectRowClass, selectAllId, tableElement) {
	var isAllFirstColumnSelected = true;
	{
		var selectRowInputs = EBXUtils.getRecursiveChildrenMatchingCSSClass(tableElement, selectRowClass);
		for ( var i = 0; i < selectRowInputs.length; i++) {
			if (!selectRowInputs[i].checked) {
				isAllFirstColumnSelected = false;
			}
		}
	}

	var selectAllInput = document.getElementById(selectAllId);
	if (isAllFirstColumnSelected) {
		selectAllInput.checked = true;
	} else {
		selectAllInput.checked = false;
	}
};
/** *END Data Services ** */

/** *START Checkbox group selection ** */
EBX_FormWidgets.checkboxGroupCSSClass = "ebx_CheckboxGroup";
EBX_FormWidgets.checkboxGroupSelectAllCSSClass = "ebx_CheckboxGroupSelectAll";
EBX_FormWidgets.checkboxGroupSelectAll = function(checkboxAllEl) {
	var checkboxGroupParentElement = EBXUtils.getFirstParentMatchingCSSClass(checkboxAllEl, EBX_FormWidgets.checkboxGroupCSSClass);
	var inputEls = checkboxGroupParentElement.getElementsByTagName("INPUT");

	var checked = checkboxAllEl.checked;
	var i = inputEls.length;
	while (i--) {
		var inputEl = inputEls[i];
		if (inputEl.type === "checkbox") {
			inputEl.checked = checked;
		}
	}

	FormPresenter.stackElementForValidation(checkboxGroupParentElement);
};
EBX_FormWidgets.checkboxGroupRefreshSelectAll = function(checkboxEl, isUserInput) {
	var checkboxGroupParentElement = EBXUtils.getFirstParentMatchingCSSClass(checkboxEl, EBX_FormWidgets.checkboxGroupCSSClass);
	var inputEls = checkboxGroupParentElement.getElementsByTagName("INPUT");

	var selectAllCheckboxContainer = EBXUtils.getFirstRecursiveChildMatchingCSSClass(checkboxGroupParentElement,
			EBX_FormWidgets.checkboxGroupSelectAllCSSClass);

	if (selectAllCheckboxContainer === null) {
		if (isUserInput === true) {
			FormPresenter.stackElementForValidation(checkboxGroupParentElement);
		}
		return;
	}

	var selectAllCheckbox = selectAllCheckboxContainer.getElementsByTagName("INPUT")[0];

	var allAreChecked = true;

	var i = inputEls.length;
	while (i--) {
		var inputEl = inputEls[i];
		if (inputEl !== selectAllCheckbox && inputEl.type === "checkbox" && inputEl.checked === false) {
			allAreChecked = false;
			break;
		}
	}

	selectAllCheckbox.checked = allAreChecked;

	if (isUserInput === true) {
		FormPresenter.stackElementForValidation(checkboxGroupParentElement);
	}
};
/** *END Checkbox group selection ** */

/** *START Select multiple selection ** */
EBX_FormWidgets.selectMultipleCSSClass = "ebx_SelectMultiple";
EBX_FormWidgets.selectMultipleSelectAllCSSClass = "ebx_SelectMultipleSelectAll";
EBX_FormWidgets.selectMultipleSelectAll = function(checkboxAllEl) {
	var selectMultipleParentElement = EBXUtils.getFirstParentMatchingCSSClass(checkboxAllEl, EBX_FormWidgets.selectMultipleCSSClass);
	var optionEls = selectMultipleParentElement.getElementsByTagName("SELECT")[0].options;

	var checked = checkboxAllEl.checked;
	var i = optionEls.length;
	while (i--) {
		optionEls[i].selected = checked;
	}

	FormPresenter.stackElementForValidation(selectMultipleParentElement);
};
EBX_FormWidgets.selectMultipleRefreshSelectAll = function(optionOrSelectEl, isUserInput) {
	var selectMultipleParentElement = EBXUtils.getFirstParentMatchingCSSClass(optionOrSelectEl, EBX_FormWidgets.selectMultipleCSSClass);
	var optionEls = selectMultipleParentElement.getElementsByTagName("SELECT")[0].options;

	var selectAllCheckboxContainer = EBXUtils.getFirstRecursiveChildMatchingCSSClass(selectMultipleParentElement,
			EBX_FormWidgets.selectMultipleSelectAllCSSClass);

	if (selectAllCheckboxContainer === null) {
		return;
	}

	var selectAllCheckbox = selectAllCheckboxContainer.getElementsByTagName("INPUT")[0];

	var allAreSelected = true;

	var i = optionEls.length;
	while (i--) {
		var optionEl = optionEls[i];
		if (optionEl.selected === false) {
			allAreSelected = false;
			break;
		}
	}

	selectAllCheckbox.checked = allAreSelected;

	if (isUserInput === true) {
		FormPresenter.stackElementForValidation(selectMultipleParentElement);
	}
};
/** *END Select multiple selection ** */

/** *START UDA type selector ** */

EBX_FormWidgets.udaClassesByKeyByContainerId = {};

EBX_FormWidgets.udaSelectListener = function(value, containerId) {
	var containerEl = document.getElementById(containerId);

	var cssClass = null;
	if (value !== null) {
		cssClass = EBX_FormWidgets.udaClassesByKeyByContainerId[containerId][value.key];
	}

	var child = containerEl.firstChild;
	if (child === null) {
		return null;
	}
	do {
		if (EBXUtils.matchCSSClass(child, cssClass)) {
			child.style.display = "";
		} else {
			child.style.display = "none";
		}
	} while ((child = child.nextSibling));
};
/** *END UDA type selector ** */

/** * START Association Node ** */
function EBX_AssociationNode() {}

EBX_AssociationNode.dataSourceAssociationNodeActionsResponseSchema = {
	resultsList: "messages",
	fields: [ {
		key: "message"
	}, {
		key: "severity"
	} ]
};
EBX_AssociationNode.dataSourceAssociationNodeActions = new YAHOO.util.XHRDataSource();
EBX_AssociationNode.dataSourceAssociationNodeActions.responseType = YAHOO.util.DataSource.TYPE_JSON;
EBX_AssociationNode.dataSourceAssociationNodeActions.responseSchema = EBX_AssociationNode.dataSourceAssociationNodeActionsResponseSchema;

EBX_AssociationNode.dataSourceAssociationNodeDuplicateResponseSchema = {
	resultsList: "url"
};
EBX_AssociationNode.dataSourceAssociationNodeDuplicate = new YAHOO.util.XHRDataSource();
EBX_AssociationNode.dataSourceAssociationNodeDuplicate.responseType = YAHOO.util.DataSource.TYPE_JSON;
EBX_AssociationNode.dataSourceAssociationNodeDuplicate.responseSchema = EBX_AssociationNode.dataSourceAssociationNodeDuplicateResponseSchema;

EBX_AssociationNode.sendRequest = function(requestURL, tableName) {

	EBX_Table.AjaxTableRegister[tableName].setState(EBX_Table_State.LOADING);

	EBX_AssociationNode.dataSourceAssociationNodeActions.sendRequest(requestURL, {
		success: EBX_AssociationNode.actionSuccess,
		failure: EBX_AssociationNode.actionFailure,
		argument: {
			tableName: tableName
		}
	});
};

EBX_AssociationNode.sendDuplicateRequest = function(requestURL, tableName) {

	EBX_Table.AjaxTableRegister[tableName].setState(EBX_Table_State.LOADING);

	EBX_AssociationNode.dataSourceAssociationNodeDuplicate.sendRequest(requestURL, {
		success: EBX_AssociationNode.duplicateSuccess,
		failure: EBX_AssociationNode.actionFailure,
		argument: {
			tableName: tableName
		}
	});
};

EBX_AssociationNode.actionSuccess = function(oRequest, oParsedResponse, argument) {
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
	EBX_Table.refreshCurrentPage(argument.tableName);
};

EBX_AssociationNode.duplicateSuccess = function(oRequest, oParsedResponse, argument) {
	var url = oParsedResponse.results;
	if (url !== undefined) {
		EBXUtils.openInternalPopupLargeSizeHostedClose(url);
	}
	EBX_Table.AjaxTableRegister[argument.tableName].setState(EBX_Table_State.NORMAL);
};

EBX_AssociationNode.actionFailure = function(oRequest, oParsedResponse, argument) {
	// case of builder.sendError(...)
	EBX_Table.AjaxTableRegister[argument.tableName].setState(EBX_Table_State.ERROR);
};

/** * END Association Node ** */
