function getPreviewURL(url) {
	url = url.trim();
	if (url.length > 0){
		try {
			window.open(resolvePreviewURL(url), null, "height=400,width=400,status=yes,toolbar=no,menubar=no,resizable=yes,scrollbars=yes,location=no");			
		}
		catch(ex)
		{
			alert(ex.message);
		}
	}
}

function resolvePreviewURL(url) {
	if (url.indexOf("/") == 0) {
		return url;
	}
	if (url.indexOf(".") == 0) {
		return url;
	}
	if (url.indexOf("://") > 0) {
		return url;
	}
	if (url.indexOf(":\\") > 0) {
		return url;
	}

	return "http://" + url;
}

/**
 * ************************************ Functions for UDA
 * **************************************
 */
function onUdaHandleSearch(aName, array_string, array_boolean, array_decimal, array_dateTime, array_time, array_date, array_anyURI, array_Name,
		array_int, array_text, array_html, array_email, array_locale, array_password) {
	for ( var i = 0; i < array_string.length; i++) {
		if (aName == array_string[i]) {
			return "string";
		}
	}
	for ( var i = 0; i < array_boolean.length; i++) {
		if (aName == array_boolean[i]) {
			return "boolean";
		}
	}
	for ( var i = 0; i < array_decimal.length; i++) {
		if (aName == array_decimal[i]) {
			return "decimal";
		}
	}
	for ( var i = 0; i < array_dateTime.length; i++) {
		if (aName == array_dateTime[i]) {
			return "dateTime";
		}
	}
	for ( var i = 0; i < array_time.length; i++) {
		if (aName == array_time[i]) {
			return "time";
		}
	}
	for ( var i = 0; i < array_date.length; i++) {
		if (aName == array_date[i]) {
			return "date";
		}
	}
	for ( var i = 0; i < array_anyURI.length; i++) {
		if (aName == array_anyURI[i]) {
			return "anyURI";
		}
	}
	for ( var i = 0; i < array_Name.length; i++) {
		if (aName == array_Name[i]) {
			return "Name";
		}
	}
	for ( var i = 0; i < array_int.length; i++) {
		if (aName == array_int[i]) {
			return "int";
		}
	}
	for ( var i = 0; i < array_html.length; i++) {
		if (aName == array_html[i]) {
			return "html";
		}
	}
	for ( var i = 0; i < array_email.length; i++) {
		if (aName == array_email[i]) {
			return "email";
		}
	}
	for ( var i = 0; i < array_locale.length; i++) {
		if (aName == array_locale[i]) {
			return "locale";
		}
	}
	for ( var i = 0; i < array_password.length; i++) {
		if (aName == array_password[i]) {
			return "password";
		}
	}
	for ( var i = 0; i < array_text.length; i++) {
		if (aName == array_text[i]) {
			return "text";
		}
	}
	// Un known type
	alert(getUdaUnknownTypeError(aName));
	return null;
}

function onUdaHandle(aSelect, idTable, string, aBoolean, decimal, dateTime, time, date, anyURI, Name, anInt, text, html, email, locale, password) {
	var udaType = aSelect.value;
	var udaTable = document.getElementById("onUdaTable_" + idTable);
	var typeName = onUdaHandleSearch(udaType, string, aBoolean, decimal, dateTime, time, date, anyURI, Name, anInt, text, html, email, locale,
			password);

	if (typeName == null) {
		return;
	}

	var udaValueRowId = "onUdaType_" + typeName + "_" + idTable;
	var rows = udaTable.rows;

	for ( var i = 1; i < rows.length; i++) {
		var aRow = rows[i];
		aRow.style.display = (aRow.id == udaValueRowId ? "" : "none");
	}
}

/**
 * ****************************************** Table sort criteria
 * *****************************************
 */
var onAllSortableFields = new Array();
var onSortedFields = new Array();

var onSortOrderAscendingLabel;
var onSortOrderDescendingLabel;
var onSortOrderAscendingKey;
var onSortOrderDescendingKey;
var onMoveUpImgId;
var onMoveDownImgId;

var onParameterName;

function onTableSortCriterion(nodePath, nodeLabel, sortOrder) {
	this.onNodePath = nodePath;
	this.onNodeLabel = nodeLabel;
	this.onSortOrder = sortOrder;

	this.isSortedAscending = function() {
		if (this.onSortOrder == onSortOrderAscendingKey) {
			return true;
		}
		return false;
	};
}

function onClearSelect(selectToClear) {
	for ( var i = selectToClear.length - 1; i >= 0; i--) {
		var achild = selectToClear.options[i];
		selectToClear.removeChild(achild);
	}
}

function onPopulateSortedList() {
	var sortedList = document.getElementById('onSortedList');
	if (!sortedList) {
		return;
	}

	var selectedIndex = sortedList.selectedIndex;
	onClearSelect(sortedList);

	for ( var i = 0; i < onSortedFields.length; i++) {
		var aCriterion = onSortedFields[i];
		var newOption = document.createElement('option');
		newOption.value = aCriterion.onNodePath;
		if (aCriterion.isSortedAscending()){newOption.text = aCriterion.onNodeLabel + ' ( ' + onSortOrderAscendingLabel + ' )';} else {newOption.text = aCriterion.onNodeLabel + ' ( ' + onSortOrderDescendingLabel + ' )';}
		sortedList.options.add(newOption);
	}
	sortedList.selectedIndex = selectedIndex;

	onDisplayMoveButtons();
}

function onIsSorted(nodePath) {
	return this.onGetCriterionForPath(nodePath) != null;
}

function onGetCriterionForPath(aPath) {
	for ( var i = 0; i < onSortedFields.length; i++) {
		var aCriterion = onSortedFields[i];
		if (aCriterion.onNodePath == aPath) {
			return aCriterion;
		}
	}
	return null;
}

function onPopulateSortableList() {
	var sortableList = document.getElementById('onSortableList');
	if (!sortableList) {
		return;
	}
	onClearSelect(sortableList);

	for ( var i = 0; i < onAllSortableFields.length; i++) {
		var aField = onAllSortableFields[i];
		if (onIsSorted(aField[0])) {
			continue;
		}
		var newOption = document.createElement('option');
		newOption.value = aField[0];
		newOption.text = aField[1];
		sortableList.options.add(newOption);
	}
}

function onAddCriterion() {
	var sortableList = document.getElementById('onSortableList');
	if (sortableList.selectedIndex == -1) {
		return;
	}

	var nodeToAdd = sortableList.options[sortableList.selectedIndex];
	onSortedFields[onSortedFields.length] = new onTableSortCriterion(nodeToAdd.value, nodeToAdd.innerHTML, onSortOrderAscendingKey);
	onDisplaySorted();
	onUpdateResult();
}

function onRemoveSelectedCriterion() {
	var sortedList = document.getElementById('onSortedList');
	if (sortedList.selectedIndex == -1) {
		return;
	}

	var nodeToRemove = sortedList.options[sortedList.selectedIndex];
	onSortedFields.splice(sortedList.selectedIndex, 1);
	sortedList.removeChild(nodeToRemove);
	onDisplayMoveButtons();

	onUpdateResult();
}

function onSortAscending() {
	var sortedList = document.getElementById('onSortedList');
	if (sortedList.selectedIndex == -1) {
		return;
	}

	var optionToUpdate = sortedList.options[sortedList.selectedIndex];
	var criterion = this.onGetCriterionForPath(optionToUpdate.value);
	if (!criterion) {
		return;
	}
	criterion.onSortOrder = onSortOrderAscendingKey;
	this.onDisplaySorted();

	onUpdateResult();
}

function onSortDescending() {
	var sortedList = document.getElementById('onSortedList');
	if (sortedList.selectedIndex == -1) {
		return;
	}

	var optionToUpdate = sortedList.options[sortedList.selectedIndex];
	var criterion = this.onGetCriterionForPath(optionToUpdate.value);
	if (!criterion) {
		return;
	}
	criterion.onSortOrder = onSortOrderDescendingKey;
	this.onDisplaySorted();

	onUpdateResult();
}

function onMoveSelectedUp() {
	var sortedList = document.getElementById('onSortedList');
	var currentIndex = sortedList.selectedIndex;
	if (currentIndex == -1) {
		return;
	}

	if (currentIndex == 0) {
		return;
	}

	var criterionToMoveUp = onSortedFields[currentIndex];
	var criterionToMoveDown = onSortedFields[currentIndex - 1];

	var part1 = onSortedFields.slice(0, currentIndex - 1);
	part1.push(criterionToMoveUp);
	part1.push(criterionToMoveDown);
	var part2 = onSortedFields.slice(currentIndex + 1);

	onSortedFields = part1.concat(part2);
	onDisplaySorted();
	sortedList.selectedIndex = currentIndex - 1;
	onDisplayMoveButtons();

	onUpdateResult();
}

function onMoveSelectedDown() {
	var sortedList = document.getElementById('onSortedList');
	var currentIndex = sortedList.selectedIndex;
	if (currentIndex == -1) {
		return;
	}

	if (currentIndex == sortedList.options.length - 1) {
		return;
	}

	var criterionToMoveDown = onSortedFields[currentIndex];
	var criterionToMoveUp = onSortedFields[currentIndex + 1];

	var part1 = onSortedFields.slice(0, currentIndex);
	part1.push(criterionToMoveUp);
	part1.push(criterionToMoveDown);
	var part2 = onSortedFields.slice(currentIndex + 2);

	onSortedFields = part1.concat(part2);
	onDisplaySorted();
	sortedList.selectedIndex = currentIndex + 1;
	onDisplayMoveButtons();

	onUpdateResult();
}

function onDisplaySortable() {
	var sortable = document.getElementById('onSortable');
	var sorted = document.getElementById('onSorted');
	onPopulateSortableList();
	sortable.style.display = '';
	sorted.style.display = 'none';
}

function onDisplayMoveButtons() {
	if (onSortedFields.length <= 1) {
		EBX_ButtonUtils.setButtonDisabled(document.getElementById(onMoveUpImgId), true);
		EBX_ButtonUtils.setButtonDisabled(document.getElementById(onMoveDownImgId), true);
		return;
	}

	var sortedList = document.getElementById('onSortedList');

	if (sortedList.selectedIndex == -1) {
		EBX_ButtonUtils.setButtonDisabled(document.getElementById(onMoveUpImgId), true);
		EBX_ButtonUtils.setButtonDisabled(document.getElementById(onMoveDownImgId), true);
		return;
	}

	if (sortedList.selectedIndex == 0) {
		EBX_ButtonUtils.setButtonDisabled(document.getElementById(onMoveUpImgId), true);
		EBX_ButtonUtils.setButtonDisabled(document.getElementById(onMoveDownImgId), false);
		return;
	}

	if (sortedList.selectedIndex == sortedList.options.length - 1) {
		EBX_ButtonUtils.setButtonDisabled(document.getElementById(onMoveUpImgId), false);
		EBX_ButtonUtils.setButtonDisabled(document.getElementById(onMoveDownImgId), true);
		return;
	}

	EBX_ButtonUtils.setButtonDisabled(document.getElementById(onMoveUpImgId), false);
	EBX_ButtonUtils.setButtonDisabled(document.getElementById(onMoveDownImgId), false);
}

function onUpdateResult() {
	var resultInputField = document.getElementById(onParameterName);
	var newResult = "";
	for ( var i = 0; i < onSortedFields.length; i++) {
		newResult += onSortedFields[i].onNodePath + ":" + onSortedFields[i].onSortOrder;
		if (i != onSortedFields.length - 1){newResult += ";";}
	}
	resultInputField.value = newResult;
	return newResult;
}

function onDisplaySorted() {
	var sortable = document.getElementById('onSortable');
	var sorted = document.getElementById('onSorted');
	onPopulateSortedList();
	sortable.style.display = 'none';
	sorted.style.display = '';
}

/**
 * ****************************************** Table sort criteria
 * *****************************************
 */

//START *************************** Table Actions ********************************/
function ebx_tableActionMenuExecute(actionURL, tableName, nbOccurrencesRequired, aConfirmationMessage, isJSAction) {
	if (nbOccurrencesRequired != 0) {
		var nbSelectedRecord;
		var table = EBX_Table.AjaxTableRegister[tableName];
		if (table == null) {
			nbSelectedRecord = onNbSelectedRecord;
		} else {
			nbSelectedRecord = table.currentResponse.meta.selectedNumber;
		}

		if (nbOccurrencesRequired < 0) {
			if (nbSelectedRecord <= 0) {
				alert(ebx_table_action_error_qty_oneOrMore);
				return;
			}
		} else if (nbOccurrencesRequired > 0) {
			if (nbSelectedRecord != nbOccurrencesRequired) {
				if (nbOccurrencesRequired == 1){alert(ebx_table_action_error_qty_onlyOne);} else {alert(nbOccurrencesRequired + ' ' + ebx_table_action_error_qty_number);}
				return;
			}
		}
	}
	if (aConfirmationMessage == null || confirm(aConfirmationMessage)) {
		if (isJSAction){eval(actionURL);} else {window.location = actionURL;}
	}
}

//END *************************** Table Actions ********************************/