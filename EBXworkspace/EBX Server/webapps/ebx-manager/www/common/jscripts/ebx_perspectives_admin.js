function EBX_PerspectiveAdmin_OnServiceChange(selection, jsonParameters) {
	var obj = JSON.parse(jsonParameters);

	if (selection == null) {
		document.getElementById(obj.id).innerHTML = "";
		return;
	}

	var ajaxHandler = new EBX_AJAXResponseHandler();

	ajaxHandler.handleAjaxResponseSuccess = function(responseContent) {
		var item = document.getElementById(obj.id);
		if (item == null) {
			document.getElementById(obj.id).innerHTML = "";
		} else {
			document.getElementById(obj.id).innerHTML = responseContent;
		}
	};

	ajaxHandler.handleAjaxResponseFailed = function(responseContent) {
		document.getElementById(obj.id).innerHTML = "";
	};

	var params = "__KEY__=" + encodeURIComponent(selection.key);

	var form = document.forms[EBX_Form.WorkspaceFormId];
	if (form != null) {
		for ( var i = 0; i < form.length; ++i) {
			var elem = form.elements[i];

			if (elem.name.indexOf("__Action_ServiceParameter_") == 0) {
				params += "&" + elem.name + "=" + encodeURIComponent(elem.value);
			}
		}
	}

	ajaxHandler.sendRequest(obj.url + "&" + params);
}

function EBX_PerspectiveAdmin_OnMenuItemTypeChange(selection, rootId) {
	var sectionDisplay = "none";
	var groupOrActionDisplay = "none";
	var actionDisplay = "none";

	if (selection != null) {
		switch (selection.key) {
			case "section":
				sectionDisplay = "";
				break;

			case "group":
				groupOrActionDisplay = "";
				break;

			case "action":
				groupOrActionDisplay = "";
				actionDisplay = "";
				break;
		}
	}

	document.getElementById(rootId + "_HasTopSeparator").style.display = sectionDisplay;
	document.getElementById(rootId + "_Parent").style.display = groupOrActionDisplay;
	document.getElementById(rootId + "_Icon").style.display = groupOrActionDisplay;
	document.getElementById(rootId + "_Action").style.display = actionDisplay;
	document.getElementById(rootId + "_SelectionOnClose").style.display = actionDisplay;
}

function EBX_PerspectiveAdmin_OnMenuItemIconTypeChange(selection, rootId) {
	var cssDisplay = "none";
	var urlDisplay = "none";

	if (selection != null) {
		switch (selection) {
			case "css":
				cssDisplay = "";
				break;

			case "url":
				urlDisplay = "";
				break;
		}
	}

	document.getElementById(rootId + "_css").style.display = cssDisplay;
	document.getElementById(rootId + "_url").style.display = urlDisplay;
}

function EBX_PerspectiveAdmin_LoadSelectorJavascript(url) {
	var scriptId = "EBX_PerspectiveAdmin_SelectorJavascript";

	if (document.getElementById(scriptId) == null) {
		var scriptElement = document.createElement('script');
		scriptElement.setAttribute("type", "text/javascript");
		scriptElement.setAttribute("src", filename);

	}
}

function EBX_PerspectiveAdmin_DisplayIconSelector(iconDisplayId, toggleButtonId, title, iconNamesUrl) {
	var toggleButton = document.getElementById(toggleButtonId);
	toggleButton.style.cursor = "wait";

	var callback = new Object();

	callback.success = function(response) {
		var jsonData = JSON.parse(response.responseText);

		var panel = EBX_PerspectiveAdmin_GetIconSelectorPanel(title, jsonData.iconNames);
		panel.cfg.setProperty('context', [ iconDisplayId, 'tl', 'bl' ]);
		panel.toggleButtonId = toggleButtonId;
		panel.iconDisplayId = iconDisplayId;

		var mask = EBX_PerspectiveAdmin_GetMask();
		document.body.appendChild(mask);
		mask.style.display = "";

		toggleButton.style.cursor = "default";
		panel.show();
	};

	callback.failure = function(response) {
		toggleButton.style.cursor = "default";
		EBX_ButtonUtils.setStateToToggleButton(toggleButton, false);
	};

	callback.cache = true;

	YAHOO.util.Connect.asyncRequest('GET', iconNamesUrl, callback);
}

function EBX_PerspectiveAdmin_HideIconSelector() {
	var panel = EBX_PerspectiveAdmin_GetIconSelectorPanel();

	panel.hide();
	EBX_PerspectiveAdmin_GetMask().style.display = "none";

	if (panel.toggleButtonId != null) {
		var toggleButton = document.getElementById(panel.toggleButtonId);
		EBX_ButtonUtils.setStateToToggleButton(toggleButton, false);
		panel.toggleButtonId = null;
	}
}

function EBX_PerspectiveAdmin_OnIconSelectorItemClick(iconName) {
	var iconClassName = "fa-" + iconName;

	var panel = EBX_PerspectiveAdmin_GetIconSelectorPanel();

	if (panel.iconDisplayId != null) {
		var iconDisplay = document.getElementById(panel.iconDisplayId);

		var className = iconDisplay.className;
		if (className == null) {
			iconDisplay.className = iconClassName;
		} else {
			var classNames = className.split(" ");

			var className = "";
			for ( var index = 0; index < classNames.length; ++index) {
				if (classNames[index].indexOf("fa-") != 0) {
					className += classNames[index];
					className += " ";
				}
			}

			className += iconClassName;
			iconDisplay.className = className;
		}
	}

	document.getElementsByName("__Icon_Reference_Css")[0].value = iconClassName;
	EBX_PerspectiveAdmin_HideIconSelector();
}

function EBX_PerspectiveAdmin_GetIconSelectorPanel(title, iconNames) {
	var panelId = "EBX_PerspectiveAdmin_IconSelector";

	var panel = window[panelId];

	if (iconNames == null) {
		return panel;
	}

	if (panel == null) {
		panel = new YAHOO.widget.Overlay("Ebx_IconSelectorPanel", {
			constraintoviewport: true,
			visible: false,
		});

		panel.render(document.body);
		window[panelId] = panel;
	}

	var content = "<div id='Ebx_IconSelectorPanel_Body' class='ebx_iconSelector ebx_ColoredBorder'>";
	if (title != null) {
		content += "<div class='ebx_iconSelectorHeader'>";
		content += title;
		content += "</div>";
	}
	content += "<div class='ebx_iconSelectorContent'>";

	var maxPos = iconNames.length;

	var pos = 0;
	while (pos < maxPos) {
		for ( var column = 0; (column < 15) && (pos < maxPos); ++column) {
			if (column >= 1) {
				content += "&nbsp;";
			}
			var iconName = iconNames[pos++];
			content += "<span class='ebx_iconSelectorItem fa fa-";
			content += iconName;
			content += "' onclick='EBX_PerspectiveAdmin_OnIconSelectorItemClick(\"" + iconName + "\")'></span>";
		}
		content += "<br/>";
	}
	content += "</div>";
	content += "</div>";
	panel.setBody(content);

	forceCSSReloadForIE8();

	return panel;
}

function EBX_PerspectiveAdmin_GetMask() {
	var maskId = "EBX_PerspectiveAdmin_Mask";

	var mask = document.getElementById(maskId);
	if (mask == null) {
		mask = document.createElement("div");
		mask.id = maskId;
		mask.className = "ebx_PageMask";
		mask.style.display = "none";
		mask.onclick = EBX_PerspectiveAdmin_HideIconSelector;
	}

	return mask;
}

function forceCSSReloadForIE8() {
	if ((YAHOO.env.ua.ie > 0) && (YAHOO.env.ua.ie <= 8)) {
		// This code is required with IE8 to reload CSS :before selectors.

		var head = document.getElementsByTagName('head')[0], style = document.createElement('style');
		style.type = 'text/css';
		style.styleSheet.cssText = ':before,:after{content:none !important';
		head.appendChild(style);
		setTimeout(function() {
			head.removeChild(style);
		}, 0);
	}
}
