/* START Form node public API */

function FormNode() {}

FormNode.getValue = function(path) {
	// TODO CCH throw an error if formNode is not found
	return FormNodeIndex.getFormNode(path).getValue();
};

FormNode.setValue = function(path, value) {
	// TODO CCH throw an error if formNode is not found
	if (FormNodeIndex.getFormNode(path).setValue(value) === true) {
		FormPresenter.stackPathForValidation(path);
	}
};

/* START Form node public API */

/* START Form node structure */

function FormNodeIndex() {}

/* initialized by UITreeForm */
FormNodeIndex.pathsTree = {};
FormNodeIndex.nodes = {};
FormNodeIndex.fieldsIdPath = [];

FormNodeIndex.TYPE_TAB = 1;
FormNodeIndex.TYPE_NOT_TERMINAL_LINE = 2;
FormNodeIndex.TYPE_TERMINAL_LINE = 3;
FormNodeIndex.TYPE_SUB_TERMINAL_LINE = 4;
FormNodeIndex.TYPE_SUB_TERMINAL_RAW = 5;

FormNodeIndex.SEVERITY_ERROR = {
	cssSuffix: "_error"
};
FormNodeIndex.SEVERITY_WARNING = {
	cssSuffix: "_warn"
};
FormNodeIndex.SEVERITY_INFO = {
	cssSuffix: "_info"
};

FormNodeIndex.getFormNode = function(path) {
	var formNode = FormNodeIndex.nodes[path];
	if (formNode === undefined) {
		EBXLogger.log("The formNode at the path \"" + path + "\" is not defined.", EBXLogger.error);
		return null;
	}

	if (formNode.constructor === Object) {
		switch (formNode.type) {
			case FormNodeIndex.TYPE_TAB:
				formNode = new FormNodeTab(path, formNode);
				break;
			case FormNodeIndex.TYPE_NOT_TERMINAL_LINE:
				formNode = new FormNotTerminalNode(path, formNode);
				break;
			case FormNodeIndex.TYPE_TERMINAL_LINE:
				formNode = new FormTerminalNode(path, formNode);
				break;
			case FormNodeIndex.TYPE_SUB_TERMINAL_LINE:
				formNode = new FormSubTerminalNode(path, formNode);
				break;
			case FormNodeIndex.TYPE_SUB_TERMINAL_RAW:
				formNode = new SubTerminalRawNode(path, formNode);
				break;
			default:
				EBXLogger.log("FormNodeIndex.getFormNode(" + path + "): Unknown node type " + formNode.type, EBXLogger.error);
				return null;
		}
		FormNodeIndex.nodes[path] = formNode;
	}
	return formNode;
};

/* Parent of "foo" is null.
 * Parent of "/" is "/".
 * Parent of "/foo" is "/".
 * Parent of "/foo/" is "/foo".
 * Parent of "/foo/bar" is "/foo".
 * Parent of "/foo/bar[] is "/foo/bar".
 * Parent of "/foo/bar[x] is "/foo/bar".
 * Parent of "/foo/bar] is null.
 * Parent of "/foo/bar[ is "/foo".
 */
FormNodeIndex.getParentPath = function(path) {
	var truncIndex;

	// detect the last ']' for list occurrence
	if (path.substring(path.length, path.length - 1) === "]") {
		truncIndex = path.lastIndexOf("[");
		if (truncIndex < 0) {
			return null;
		}
	} else {
		truncIndex = path.lastIndexOf("/");
		if (truncIndex < 0) {
			return null;
		}
		if (truncIndex === 0) {
			return "/";
		}
	}

	return path.substring(0, truncIndex);
};

/* END Form node structure */

/* START Form nodes */

function FormNodeTab(path, formNode) {
	this.path = path;
	this.tabIndex = formNode.tabIndex;
}

FormNodeTab.prototype = {
	constructor: FormNodeTab,

	remove: function() {
	// TODO CCH
	},

	focus: function() {
	// TODO CCH
	},

	setSeverityFlag: function(severity) {
	// TODO CCH
	}
};

function FormNodeLine() {}

FormNodeLine.getTRElement = function() {
	if (this.trElement === undefined) {
		this.trElement = document.getElementById(this.trElementId);
	}
	return this.trElement;
};

FormNodeLine.getParent = function() {
	if (this.parent === undefined) {
		this.parent = FormNodeIndex.getFormNode(FormNodeIndex.getParentPath(this.path));
	}
	return this.parent;
};

FormNodeLine.setSeverityFlag = function(severity) {
	// disabled for the moment
	return;

	var element = this.getTRElement();

	// FIXME CCH list occurrences (li) does not work for the moment
	if (element !== null) {
		var cssSuffix = "";
		if (severity !== null) {
			cssSuffix = severity.cssSuffix;
		}
		element.className = FormNodeLine.replaceNeutralCssClass(element.className, this.neutralCssClass, cssSuffix);
	}

	// disabled for the moment (problem of siblings with severity & parent refresh)
	//  for this case, it would be a childrenSeverity:map<Node,Severity> for each level
	//   but we have problem of initialisation
	/*
	 if (this.getParent() !== null) {
	 this.getParent().setSeverityFlag(severity);
	 }
	 */
};

FormNodeLine.replaceNeutralCssClass = function(cssClass, neutralCssClass, cssClassSuffixToAdd) {
	var indexNeutralBegin = cssClass.indexOf(neutralCssClass);

	if (indexNeutralBegin < 0) {
		// neutral css class not found
		return cssClass;
	}

	var indexNeutralEnds = cssClass.indexOf(" ", indexNeutralBegin);

	var newCSSClass = [];
	newCSSClass.push(cssClass.substring(0, indexNeutralBegin));
	newCSSClass.push(neutralCssClass, cssClassSuffixToAdd);
	if (indexNeutralEnds > 0) {
		// neutral css class was the last
		newCSSClass.push(cssClass.substring(indexNeutralEnds));
	}

	return newCSSClass.join("");
};

function FormNotTerminalNode(path, formNode) {
	this.path = path;
	this.trElementId = formNode.trId;
	this.neutralCssClass = formNode.neutralCssClass;
}

FormNotTerminalNode.prototype = {
	constructor: FormNotTerminalNode,

	remove: function() {
	// TODO CCH
	},

	focus: function() {
	// TODO CCH
	},

	getTRElement: FormNodeLine.getTRElement,
	getParent: FormNodeLine.getParent,
	setSeverityFlag: FormNodeLine.setSeverityFlag
};

function DecoratedField() {}

DecoratedField.getEditor = function() {
	if (this.editorName === undefined) {
		EBXLogger.log("The editorName for the formNode \"" + this.path + "\" is not defined.", EBXLogger.error);
		this.editorName = "FormNodeEditor_Missing";
	}
	if (this.editor === undefined) {
		this.editor = eval("new " + this.editorName + "(this.getDecoratorElement(), this.editorArgs);");
	}
	return this.editor;
};
DecoratedField.getDecoratorElement = function() {
	if (this.decoratorEl === undefined) {
		this.decoratorEl = document.getElementById(this.decoratorId);
	}
	return this.decoratorEl;
};
DecoratedField.MessageContainerCSSClass = "ebx_MessageContainer";
DecoratedField.getMessageContainer = function() {
	if (this.messageContainer === undefined) {
		var decoratorElement = this.getDecoratorElement();
		this.messageContainer = EBXUtils.getFirstDirectChildMatchingCSSClass(decoratorElement, DecoratedField.MessageContainerCSSClass);
		if (this.messageContainer === null) {
			this.messageContainer = document.createElement("div");
			this.messageContainer.className = DecoratedField.MessageContainerCSSClass;
			decoratorElement.appendChild(this.messageContainer);
		}
	}
	return this.messageContainer;
};

DecoratedField.setMessage = function(message) {
	var messageContainer = this.getMessageContainer();
	var strBuf = [];
	var higherSeverity = null;
	var length, i;
	if (message.errors !== undefined) {
		higherSeverity = FormNodeIndex.SEVERITY_ERROR;
		strBuf.push("<div class=\"ebx_IconError\">");
		length = message.errors.length;
		for (i = 0; i < length; i++) {
			strBuf.push("<div class=\"ebx_Error\">", message.errors[i], "</div>");
		}
		strBuf.push("</div>");
	}
	if (message.warnings !== undefined) {
		if (higherSeverity === null) {
			higherSeverity = FormNodeIndex.SEVERITY_WARNING;
		}
		strBuf.push("<div class=\"ebx_IconWarning\">");
		length = message.warnings.length;
		for (i = 0; i < length; i++) {
			strBuf.push("<div class=\"ebx_Warning\">", message.warnings[i], "</div>");
		}
		strBuf.push("</div>");
	}
	if (message.infos !== undefined) {
		if (higherSeverity === null) {
			higherSeverity = FormNodeIndex.SEVERITY_INFO;
		}
		strBuf.push("<div class=\"ebx_IconInfo\">");
		length = message.infos.length;
		for (i = 0; i < length; i++) {
			strBuf.push("<div class=\"ebx_Info\">", message.infos[i], "</div>");
		}
		strBuf.push("</div>");
	}

	EBX_Loader.onMouseReleasedOnce(DecoratedField.setMessageDeferred, {
		messageContainer: messageContainer,
		content: strBuf.join("")
	});

	return higherSeverity;
};
DecoratedField.setMessageDeferred = function(args) {
	args.messageContainer.innerHTML = args.content;
	// Mantis #7353
	if (EBX_LayoutManager.isIE6or7) {
		if (args.content.length > 0) {
			args.messageContainer.style.display = "block";
		} else {
			args.messageContainer.style.display = "none";
		}
	}
};
DecoratedField.setWaiting = function(isWaiting) {
	/*
	 if (this.isWaiting === undefined) {
	 this.isWaiting = 0;
	 }
	 */
	if (isWaiting === true) {
		FormPresenterStatusIndicator.incrementWaiting();
		/*
		 this.isWaiting++;
		 */
	} else {
		FormPresenterStatusIndicator.decrementWaiting();
		/*
		 this.isWaiting--;
		 */
	}
	/*
	 // just in case...
	 if (this.isWaiting < 0) {
	 this.isWaiting = 0;
	 }

	 this.refreshStatusFlag();
	 */
};
DecoratedField.refreshStatusFlag = function() {
/*
 if (this.statusFlag === undefined) {
 var decoratorElement = this.getDecoratorElement();
 this.statusFlag = EBXUtils.getFirstDirectChildMatchingCSSClass(decoratorElement, "ebx_FieldStatusFlag");
 }

 if (this.isWaiting === 1) {
 EBXUtils.addCSSClass(this.statusFlag, "ebx_FieldStatusFlag_waiting");
 } else if (this.isWaiting === 0) {
 EBXUtils.removeCSSClass(this.statusFlag, "ebx_FieldStatusFlag_waiting");
 }
 */
};

function FormTerminalNode(path, formNode) {
	this.path = path;
	this.trElementId = formNode.trId;
	this.editorName = formNode.editorName;
	this.editorArgs = formNode.editorArgs;
	this.neutralCssClass = formNode.neutralCssClass;
	this.decoratorId = formNode.decoId;
	this.inputName = formNode.inputName;
	// not used for the moment
	/*
	 this.eventBeforeValueChanged = formNode.eventBeforeValueChanged;
	 */
	this.eventAfterValueChanged = formNode.eventAfterValueChanged;
	this.isAPV = formNode.isAPV;
	this.isAjaxValueSynch = formNode.isAjaxValueSynch;
}

FormTerminalNode.prototype = {
	constructor: FormTerminalNode,

	remove: function() {
	// TODO CCH
	},

	focus: function() {
	// TODO CCH
	},

	getValue: function() {
		// TODO CCH complex case
		return this.getEditor().getValue();
	},

	setValue: function(value) {
		// TODO CCH complex case
		return this.getEditor().setValue(value);
	},

	setMandatory: function(isMandatory) {
	// TODO CCH
	},

	serialize: function() {
		// TODO CCH complex case
		return FormPresenter.parameterName + "=" + this.inputName + "&" + this.getEditor().serialize();
	},

	setInherit: function() {
	// TODO CCH
	},

	setOverwrite: function() {
	// TODO CCH
	},

	setMessageSuper: DecoratedField.setMessage,
	setMessage: function(message) {
		var higherSeverity = this.setMessageSuper(message);
		this.setSeverityFlag(higherSeverity);
	},

	getTRElement: FormNodeLine.getTRElement,
	getParent: FormNodeLine.getParent,
	setSeverityFlag: FormNodeLine.setSeverityFlag,

	getEditor: DecoratedField.getEditor,
	getDecoratorElement: DecoratedField.getDecoratorElement,
	getMessageContainer: DecoratedField.getMessageContainer,
	setWaiting: DecoratedField.setWaiting,
	refreshStatusFlag: DecoratedField.refreshStatusFlag
};

function FormSubTerminalNode(path, formNode) {
	this.path = path;
	this.trElementId = formNode.trId;
	this.editorName = formNode.editorName;
	this.editorArgs = formNode.editorArgs;
	this.neutralCssClass = formNode.neutralCssClass;
	this.decoratorId = formNode.decoId;
	this.inputName = formNode.inputName;
	// not used for the moment
	/*
	 this.eventBeforeValueChanged = formNode.eventBeforeValueChanged;
	 */
	this.eventAfterValueChanged = formNode.eventAfterValueChanged;
	this.isAPV = formNode.isAPV;
	this.isAjaxValueSynch = formNode.isAjaxValueSynch;
}

FormSubTerminalNode.prototype = {
	constructor: FormSubTerminalNode,

	remove: function() {
		this.getTRElement().parentNode.removeChild(this.getTRElement());
	},

	focus: function() {
	// TODO CCH
	},

	getValue: function() {
		// TODO CCH complex case
		return this.getEditor().getValue();
	},

	setValue: function(value) {
		// TODO CCH complex case
		return this.getEditor().setValue(value);
	},

	setMandatory: function(isMandatory) {
	// TODO CCH
	},

	serialize: function() {
		// TODO CCH complex case
		return FormPresenter.parameterName + "=" + this.inputName + "&" + this.getEditor().serialize();
	},

	setMessageSuper: DecoratedField.setMessage,
	setMessage: function(message) {
		var higherSeverity = this.setMessageSuper(message);
		this.setSeverityFlag(higherSeverity);
	},

	getTRElement: FormNodeLine.getTRElement,
	getParent: FormNodeLine.getParent,
	setSeverityFlag: FormNodeLine.setSeverityFlag,

	getEditor: DecoratedField.getEditor,
	getDecoratorElement: DecoratedField.getDecoratorElement,
	getMessageContainer: DecoratedField.getMessageContainer,
	setWaiting: DecoratedField.setWaiting,
	refreshStatusFlag: DecoratedField.refreshStatusFlag
};

function SubTerminalRawNode(path, formNode) {
	this.path = path;
	this.editorName = formNode.editorName;
	this.editorArgs = formNode.editorArgs;
	this.decoratorId = formNode.decoId;
	this.inputName = formNode.inputName;
	// not used for the moment
	/*
	 this.eventBeforeValueChanged = formNode.eventBeforeValueChanged;
	 */
	this.eventAfterValueChanged = formNode.eventAfterValueChanged;
	this.isAPV = formNode.isAPV;
	this.isAjaxValueSynch = formNode.isAjaxValueSynch;
}

SubTerminalRawNode.prototype = {
	constructor: FormSubTerminalNode,

	getValue: function() {
		return this.getEditor().getValue();
	},

	setValue: function(value) {
		return this.getEditor().setValue(value);
	},

	setMandatory: function(isMandatory) {
	// TODO CCH
	},

	serialize: function() {
		return FormPresenter.parameterName + "=" + this.inputName + "&" + this.getEditor().serialize();
	},

	getEditor: DecoratedField.getEditor,
	getDecoratorElement: DecoratedField.getDecoratorElement,
	getMessageContainer: DecoratedField.getMessageContainer,
	setMessage: DecoratedField.setMessage,
	setWaiting: DecoratedField.setWaiting,
	refreshStatusFlag: DecoratedField.refreshStatusFlag
};

/* END Form nodes */

/* START Form node editors */

function FormNodeEditor_Missing(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.args = args;
}

FormNodeEditor_Missing.prototype = {
	constructor: FormNodeEditor_Missing,

	setValue: function(value) {
		return false;
	},

	getValue: function() {
		return undefined;
	},

	serialize: function() {
		return "";
	}
};

function FormNodeEditor_TextInput(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.args = args;
}

FormNodeEditor_TextInput.prototype = {
	constructor: FormNodeEditor_TextInput,

	setValue: function(value) {
		this.getInput().value = value;
		return true;
	},

	getValue: function() {
		return this.getInput().value;
	},

	serialize: function() {
		return encodeURIComponent(this.getInput().name) + "=" + encodeURIComponent(this.getInput().value);
	},

	getInput: function() {
		if (this.inputElement === undefined) {
			this.inputElement = EBXUtils.getFirstDirectChildMatchingTagName(this.inputWrapperEl, "input");
		}
		return this.inputElement;
	}
};

function FormNodeEditor_TextArea(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.args = args;
}

FormNodeEditor_TextArea.prototype = {
	constructor: FormNodeEditor_TextArea,

	setValue: function(value) {
		this.getInput().value = value;
		return true;
	},

	getValue: function() {
		return this.getInput().value;
	},

	serialize: function() {
		return encodeURIComponent(this.getInput().name) + "=" + encodeURIComponent(this.getInput().value);
	},

	getInput: function() {
		if (this.inputElement === undefined) {
			this.inputElement = EBXUtils.getFirstRecursiveChildMatchingTagName(this.inputWrapperEl, "textarea");
		}
		return this.inputElement;
	}
};

function FormNodeEditor_HTML(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.id = args;
}

FormNodeEditor_HTML.prototype = {
	constructor: FormNodeEditor_HTML,

	setValue: function(value) {
		// fallback, just in case
		if (EBX_Form.APVHTMLEditorIdEditor[this.id] === undefined || EBX_Form.APVHTMLEditorIdEditor[this.id] === null) {
			this.getTextarea().value = value;
			return true;
		}

		EBX_Form.APVHTMLEditorIdEditor[this.id].setData(value);
		return true;
	},

	getValue: function() {
		// fallback,just in case
		if (EBX_Form.APVHTMLEditorIdEditor[this.id] === undefined || EBX_Form.APVHTMLEditorIdEditor[this.id] === null) {
			return;
			this.getTextarea().value;
		}

		return EBX_Form.APVHTMLEditorIdEditor[this.id].getData();
	},

	serialize: function() {
		return encodeURIComponent(this.getTextarea().name) + "=" + encodeURIComponent(this.getValue());
	},

	getTextarea: function() {
		if (this.textareaElement === undefined) {
			this.textareaElement = EBXUtils.getFirstRecursiveChildMatchingTagName(this.inputWrapperEl, "textarea");
		}
		return this.textareaElement;
	}
};

function FormNodeEditor_RdoBtn(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.lastRdoBtnDeclaredId = args;
}

FormNodeEditor_RdoBtn.prototype = {
	constructor: FormNodeEditor_RdoBtn,

	setValue: function(value) {
		var rdoBtnElements = this.getRdoBtns();
		if (value === null) {
			var i = rdoBtnElements.length;
			while (i--) {
				var rdoBtnElement = rdoBtnElements[i];
				rdoBtnElement.checked = false;
			}
			return true;
		}
		var i = rdoBtnElements.length;
		while (i--) {
			var rdoBtnElement = rdoBtnElements[i];
			if (rdoBtnElement.value == value) {
				rdoBtnElement.checked = true;
				return true;
			}
		}
		return false;
	},

	getValue: function() {
		var rdoBtnElements = this.getRdoBtns();
		var i = rdoBtnElements.length;
		while (i--) {
			var rdoBtnElement = rdoBtnElements[i];
			if (rdoBtnElement.checked) {
				return rdoBtnElement.value;
			}
		}
		return null;
	},

	serialize: function() {
		var rdoBtnElements = this.getRdoBtns();
		var i = rdoBtnElements.length;
		while (i--) {
			var rdoBtnElement = rdoBtnElements[i];
			if (rdoBtnElement.checked) {
				return encodeURIComponent(rdoBtnElement.name) + "=" + encodeURIComponent(rdoBtnElement.value);
			}
		}
		return "";
	},

	getRdoBtns: function() {
		if (this.rdoBtnElements === undefined) {
			var lastDeclaredRdoBtnElement = document.getElementById(this.lastRdoBtnDeclaredId);
			this.rdoBtnElements = lastDeclaredRdoBtnElement.form.elements[lastDeclaredRdoBtnElement.name];

			// if the list of elements is actually an element, put it in a list
			if (this.rdoBtnElements.parentNode !== undefined) {
				this.rdoBtnElements = [ this.rdoBtnElements ];
			}
		}
		return this.rdoBtnElements;
	}
};

function FormNodeEditor_RdoBtnGrp(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.isEmptyButtonEnabled = args;
}

FormNodeEditor_RdoBtnGrp.prototype = {
	constructor: FormNodeEditor_RdoBtnGrp,

	setValue: function(value) {
		var rdoBtnElements = this.getRdoBtns();
		if (value === null) {
			if (this.isEmptyButtonEnabled) {
				EBX_Form.emptyRadioButtonGroup(rdoBtnElements[0].name, false);
			} else {
				var i = rdoBtnElements.length;
				while (i--) {
					var rdoBtnElement = rdoBtnElements[i];
					rdoBtnElement.checked = false;
				}
			}
			return true;
		}
		var i = rdoBtnElements.length;
		while (i--) {
			var rdoBtnElement = rdoBtnElements[i];
			if (rdoBtnElement.value == value) {
				rdoBtnElement.checked = true;
				if (this.isEmptyButtonEnabled) {
					EBX_Form.refreshEmptyButtonFromRadioButton(rdoBtnElement.name, false);
				}
				return true;
			}
		}
		return false;
	},

	getValue: function() {
		var rdoBtnElements = this.getRdoBtns();
		var i = rdoBtnElements.length;
		while (i--) {
			var rdoBtnElement = rdoBtnElements[i];
			if (rdoBtnElement.checked) {
				return rdoBtnElement.value;
			}
		}
		return null;
	},

	serialize: function() {
		var rdoBtnElements = this.getRdoBtns();
		var i = rdoBtnElements.length;
		while (i--) {
			var rdoBtnElement = rdoBtnElements[i];
			if (rdoBtnElement.checked) {
				return encodeURIComponent(rdoBtnElement.name) + "=" + encodeURIComponent(rdoBtnElement.value);
			}
		}
		return "";
	},

	getRdoBtns: function() {
		if (this.rdoBtnElements === undefined) {
			this.rdoBtnElements = [];
			var inputElements = this.inputWrapperEl.getElementsByTagName("INPUT");
			var i = inputElements.length;
			while (i--) {
				var inputElement = inputElements[i];
				if (inputElement.type === "radio") {
					this.rdoBtnElements.push(inputElement);
				}
			}
		}
		return this.rdoBtnElements;
	}
};

function FormNodeEditor_Ckb(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.lastCkbDeclaredId = args;
}

FormNodeEditor_Ckb.prototype = {
	constructor: FormNodeEditor_Ckb,

	setValue: function(value) {
		if (value === null) {
			value = [];
		}
		var ckbsElements = this.getCkbs();
		var i = ckbsElements.length;
		while (i--) {
			var ckbsElement = ckbsElements[i];
			ckbsElement.checked = EBXUtils.arrayContains(value, ckbsElement.value);
		}
		return true;
	},

	getValue: function() {
		var ret = [];

		var ckbsElements = this.getCkbs();
		var i = ckbsElements.length;
		while (i--) {
			var ckbsElement = ckbsElements[i];
			if (ckbsElement.checked) {
				ret.push(ckbsElement.value);
			}
		}

		return ret;
	},

	serialize: function() {
		var ret = [];

		var ckbsElements = this.getCkbs();
		var i = ckbsElements.length;
		while (i--) {
			var ckbsElement = ckbsElements[i];
			if (ckbsElement.checked) {
				ret.push(encodeURIComponent(ckbsElement.name) + "=" + encodeURIComponent(ckbsElement.value));
			}
		}

		return ret.join("&");
	},

	getCkbs: function() {
		if (this.ckbsElements === undefined) {
			var lastDeclaredCkbElement = document.getElementById(this.lastCkbDeclaredId);
			this.ckbsElements = lastDeclaredCkbElement.form.elements[lastDeclaredCkbElement.name];

			// if the list of elements is actually an element, put it in a list
			if (this.ckbsElements.parentNode !== undefined) {
				this.ckbsElements = [ this.ckbsElements ];
			}
		}
		return this.ckbsElements;
	}
};

function FormNodeEditor_CkbGrp(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.ckbGrpParentId = args;
}

FormNodeEditor_CkbGrp.prototype = {
	constructor: FormNodeEditor_CkbGrp,

	setValue: function(value) {
		if (value === null) {
			value = [];
		}
		var ckbsElements = this.getCkbs();
		var i = ckbsElements.length;
		while (i--) {
			var ckbsElement = ckbsElements[i];
			ckbsElement.checked = EBXUtils.arrayContains(value, ckbsElement.value);
		}
		EBX_FormWidgets.checkboxGroupRefreshSelectAll(ckbsElements[0], false);
		return true;
	},

	getValue: function() {
		var ret = [];

		var ckbsElements = this.getCkbs();
		var i = ckbsElements.length;
		while (i--) {
			var ckbsElement = ckbsElements[i];
			if (ckbsElement.checked) {
				ret.push(ckbsElement.value);
			}
		}

		return ret;
	},

	serialize: function() {
		var ret = [];

		var ckbsElements = this.getCkbs();
		var i = ckbsElements.length;
		while (i--) {
			var ckbsElement = ckbsElements[i];
			if (ckbsElement.checked) {
				ret.push(encodeURIComponent(ckbsElement.name) + "=" + encodeURIComponent(ckbsElement.value));
			}
		}

		return ret.join("&");
	},

	getCkbs: function() {
		if (this.ckbsElements === undefined) {
			this.ckbsElements = [];

			var checkboxGroupParentElement = document.getElementById(this.ckbGrpParentId);
			var inputEls = checkboxGroupParentElement.getElementsByTagName("INPUT");

			var selectAllCheckboxContainer = EBXUtils.getFirstRecursiveChildMatchingCSSClass(checkboxGroupParentElement,
					EBX_FormWidgets.checkboxGroupSelectAllCSSClass);

			var selectAllCheckbox;
			if (selectAllCheckboxContainer === null) {
				selectAllCheckbox = null;
			} else {
				selectAllCheckbox = selectAllCheckboxContainer.getElementsByTagName("INPUT")[0];
			}

			var i = inputEls.length;
			while (i--) {
				var inputEl = inputEls[i];
				if (inputEl !== selectAllCheckbox && inputEl.type === "checkbox") {
					this.ckbsElements.push(inputEl);
				}
			}
		}
		return this.ckbsElements;
	}
};

function FormNodeEditor_DateInput(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.args = args;
}

FormNodeEditor_DateInput.InputsDateContainerCSSClass = "ebx_InputsDateContainer";
FormNodeEditor_DateInput.prototype = {
	constructor: FormNodeEditor_DateInput,

	setValue: function(value) {
		if (value === null) {
			EBX_Form.emptyDateInputs(this.args.mainName, false, false);
			return true;
		}

		// try to parse if it is not a date
		if (value.constructor !== Date) {
			value = new Date(value);
		}

		if (isNaN(value.valueOf())) {
			return false;
		}

		EBX_Form.fillTimeDate(this.args.mainName, value, false);
		return true;
	},

	getValue: function() {
		var dateInputsBaseName = this.args.mainName;

		var year, month, day, hours, minutes, seconds, milliseconds;

		year = "";
		var fieldYear = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.year);
		if (fieldYear !== null) {
			year = fieldYear.value;
		}

		month = "";
		var fieldMonth = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.month);
		if (fieldMonth !== null) {
			month = fieldMonth.value;
		}

		day = "";
		var fieldDay = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.day);
		if (fieldDay !== null) {
			day = fieldDay.value;
		}

		hours = "";
		var fieldHour = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.hour);
		if (fieldHour !== null) {
			hours = fieldHour.value;
		}

		minutes = "";
		var fieldMinute = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.minute);
		if (fieldMinute !== null) {
			minutes = fieldMinute.value;
		}

		seconds = "";
		var fieldSecond = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.second);
		if (fieldSecond !== null) {
			seconds = fieldSecond.value;
		}

		milliseconds = "";
		var fieldMilliSecond = document.getElementById(dateInputsBaseName + EBX_Form.dateSuffixes.milliSecond);
		if (fieldMilliSecond !== null) {
			milliseconds = fieldMilliSecond.value;
		}

		if ((year + month + day + hours + minutes + seconds + milliseconds).length === 0) {
			return null;
		}

		return new Date(year, month, day, hours, minutes, seconds, milliseconds);
	},

	serialize: function() {
		var ret = [];

		var inputsDateContainer = EBXUtils.getFirstDirectChildMatchingCSSClass(this.inputWrapperEl,
				FormNodeEditor_DateInput.InputsDateContainerCSSClass);

		var childEl = EBXUtils.firstElementChild(inputsDateContainer);
		do {
			if (childEl.name !== undefined) {
				ret.push(encodeURIComponent(childEl.name) + "=" + encodeURIComponent(childEl.value));
			}
		} while ((childEl = EBXUtils.nextElementSibling(childEl)) !== null);

		return ret.join("&");
	}
};

function FormNodeEditor_FEC(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.args = args;
}

FormNodeEditor_FEC.prototype = {
	constructor: FormNodeEditor_FEC,

	setValue: function(value) {
		var inputEl = this.getInput();

		if (value === null) {
			EBX_Form.emptyFacetEnum(inputEl.id, false);
			return true;
		}

		inputEl.value = value.key;
		this.getLabel().value = value.label;

		EBX_Form.refreshEmptyButtonFromFacetEnumField(inputEl, false);

		return true;
	},

	getValue: function() {
		if (this.getInput().value === ebx_nullValueForFacetEnum) {
			return null;
		}
		return {
			key: this.getInput().value,
			label: this.getLabel().value
		};
	},

	serialize: function() {
		var inputEl = this.getInput();
		return encodeURIComponent(inputEl.name) + "=" + encodeURIComponent(inputEl.value);
	},

	getInput: function() {
		if (this.inputElement === undefined) {
			this.inputElement = EBXUtils.getFirstDirectChildMatchingTagName(this.inputWrapperEl, "input");
		}
		return this.inputElement;
	},

	getLabel: function() {
		if (this.labelElement === undefined) {
			this.labelElement = EBXUtils.nextElementSibling(this.getInput());
		}
		return this.labelElement;
	}
};

function FormNodeEditor_ISS(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.args = args;
}

FormNodeEditor_ISS.prototype = {
	constructor: FormNodeEditor_ISS,

	setValue: function(value) {
		var labelEl = this.getLabel();

		if (value === null || value.key === ebx_nullValueForFacetEnum) {
			// case null

			labelEl.className = "ebx_ValueND";

			if (this.getEmptyButton() !== null) {
				EBXUtils.addCSSClass(this.getEmptyButton(), EBX_FormWidgets.emptyButtonHidden_CSSClass);
			}

			EBX_ISS.mapIdPreviewURL[labelEl.id] = undefined;

			if (this.getPreviewButton() !== null) {
				EBX_ButtonUtils.setButtonDisabled(this.getPreviewButton(), true);
			}

			this.getInput().value = ebx_nullValueForFacetEnum;
			labelEl.value = FacetEnumeration_label_nullValue;

			return true;
		}

		// case not null

		if (value.trusted !== true) {
			// do nothing before the key has not been checked

			var request = [];
			request.push(EBX_ISS.sendingRequest);
			request.push("&", EBX_ISS.requestParam_ajaxComponentIndex, "=", encodeURIComponent(EBX_ISS.mapIdAjaxComponentIndex[labelEl.id]));
			request.push("&", EBX_ISS.requestParam_key, "=", encodeURIComponent(value.key));
			EBX_ISS.dataSource.sendRequest(request.join(""), {
				success: this.receiveSuccess,
				failure: this.receiveFailure,
				scope: this
			});

			return false;
		}

		if (this.getEmptyButton() !== null) {
			labelEl.className = EBX_FormWidgets.inputWithEmptyButton_CSSClass;
			EBXUtils.removeCSSClass(this.getEmptyButton(), EBX_FormWidgets.emptyButtonHidden_CSSClass);
		} else {
			labelEl.className = "";
		}

		if (value.previewURL === undefined || value.previewURL === null) {
			EBX_ISS.mapIdPreviewURL[labelEl.id] = undefined;
		} else {
			EBX_ISS.mapIdPreviewURL[labelEl.id] = value.previewURL;
		}

		if (this.getPreviewButton() !== null) {
			var isPreviewButtonEnabled = (EBX_ISS.mapIdPreviewURL[labelEl.id] !== undefined);
			EBX_ButtonUtils.setButtonDisabled(this.getPreviewButton(), !isPreviewButtonEnabled);
		}

		this.getInput().value = value.key;
		labelEl.value = value.label;

		return true;
	},

	getValue: function() {
		if (this.getInput().value === ebx_nullValueForFacetEnum) {
			return null;
		}
		return {
			key: this.getInput().value,
			label: this.getLabel().value,
			previewURL: EBX_ISS.mapIdPreviewURL[this.getLabel().id]
		};
	},

	serialize: function() {
		var inputEl = this.getInput();
		return encodeURIComponent(inputEl.name) + "=" + encodeURIComponent(inputEl.value);
	},

	getInput: function() {
		if (this.inputElement === undefined) {
			this.inputElement = EBXUtils.getFirstRecursiveChildMatchingTagName(this.inputWrapperEl, "input");
		}
		return this.inputElement;
	},

	getLabel: function() {
		if (this.labelElement === undefined) {
			this.labelElement = EBXUtils.nextElementSibling(this.getInput());
		}
		return this.labelElement;
	},

	getEmptyButton: function() {
		if (this.emptyButton === undefined) {
			this.emptyButton = EBXUtils.getFirstRecursiveChildMatchingCSSClass(this.inputWrapperEl, "ebx_Empty");
		}
		return this.emptyButton;
	},

	getPreviewButton: function() {
		if (this.previewButton === undefined) {
			this.previewButton = EBXUtils.getFirstDirectChildMatchingCSSClass(this.inputWrapperEl, "ebx_Open");
		}
		return this.previewButton;
	},

	receiveSuccess: function(oRequest, oParsedResponse, argument) {
		if (oParsedResponse.results.length !== 0) {
			var value = oParsedResponse.results[0];
			value.trusted = true;
			this.setValue(value);
		}
		FormPresenter.stackElementForValidation(this.getLabel());
	},

	receiveFailure: function(oRequest, oParsedResponse, argument) {
		if (oParsedResponse.status == 401) {
			EBX_Loader.gotoTimeoutPage();
		}
	}
};

function FormNodeEditor_LCB(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.args = args;
}

FormNodeEditor_LCB.prototype = {
	constructor: FormNodeEditor_LCB,

	setValue: function(value) {
		// TODO CCH/SPI
		return false;
	},

	getValue: function() {
		// TODO CCH/SPI
		return "/not implemented yet/";
	},

	serialize: function() {
		// TODO CCH/SPI
		return "";
	},

	getInput: function() {
		if (this.inputElement === undefined) {
			this.inputElement = EBXUtils.getFirstRecursiveChildMatchingTagName(this.inputWrapperEl, "select");
		}
		return this.inputElement;
	}
};

function FormNodeEditor_DropDownBox(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.args = args;
}

FormNodeEditor_DropDownBox.prototype = {
	constructor: FormNodeEditor_DropDownBox,

	setValue: function(value) {
		if (value === null) {
			value = ebx_nullValueForFacetEnum;
		}
		this.getInput().value = value;
		return true;
	},

	getValue: function() {
		var inputEl = this.getInput();
		if (inputEl.value === ebx_nullValueForFacetEnum) {
			return null;
		}
		return inputEl.value;
		/*
		 return {
		 key: inputEl.value,
		 label: selectedOption.text
		 };
		 */
	},

	serialize: function() {
		return encodeURIComponent(this.getInput().name) + "=" + encodeURIComponent(this.getInput().value);
	},

	getInput: function() {
		if (this.inputElement === undefined) {
			this.inputElement = EBXUtils.getFirstDirectChildMatchingTagName(this.inputWrapperEl, "select");
		}
		return this.inputElement;
	}
};

function FormNodeEditor_DropDownBoxMultiple(inputWrapperEl, args) {
	this.inputWrapperEl = inputWrapperEl;
	this.args = args;
}

FormNodeEditor_DropDownBoxMultiple.prototype = {
	constructor: FormNodeEditor_DropDownBoxMultiple,

	setValue: function(value) {
		var i, j, valueItem, option;
		var input = this.getInput();
		var optionEls = input.options;

		// clear selection
		j = optionEls.length;
		while (j--) {
			optionEls[j].selected = false;
		}

		i = value.length;
		while (i--) {
			valueItem = value[i];
			j = optionEls.length;
			while (j--) {
				option = optionEls[j];
				if (option.value == valueItem) {
					option.selected = true;
				}
			}
		}

		EBX_FormWidgets.selectMultipleRefreshSelectAll(input, false);

		return true;
	},

	getValue: function() {
		var ret = [], j, optLen, option, optValue;
		var input = this.getInput();
		for (j = 0, optLen = input.options.length; j < optLen; j++) {
			option = input.options[j];
			if (option.selected) {
				optValue = "";
				if (option.hasAttribute) {
					optValue = (option.hasAttribute("value") ? option.value : option.text);
				} else {
					optValue = (option.attributes["value"].specified ? option.value : option.text);
				}
				ret.push(optValue);
				/*
				 ret.push({
				 key: optValue,
				 label: option.text
				 });
				 */
			}
		}
		return ret;
	},

	serialize: function() {
		var ret = [], j, option, optValue;
		var input = this.getInput();
		for (j = 0, optLen = input.options.length; j < optLen; j++) {
			option = input.options[j];
			if (option.selected) {
				optValue = "";
				if (option.hasAttribute) {
					optValue = (option.hasAttribute("value") ? option.value : option.text);
				} else {
					optValue = (option.attributes["value"].specified ? option.value : option.text);
				}
				ret.push(encodeURIComponent(input.name) + "=" + encodeURIComponent(optValue));
			}
		}
		return ret.join("&");
	},

	getInput: function() {
		if (this.inputElement === undefined) {
			this.inputElement = EBXUtils.getFirstRecursiveChildMatchingTagName(this.inputWrapperEl, "select");
		}
		return this.inputElement;
	}
};

function FormNodeEditor_ReadOnly(inputWrapperEl, value) {
	this.inputWrapperEl = inputWrapperEl;
	this.value = value;
}

FormNodeEditor_ReadOnly.prototype = {
	constructor: FormNodeEditor_ReadOnly,

	setValue: function(value) {
		return false;
	},

	getValue: function() {
		return this.value;
	},

	serialize: function() {
		return "";
	}
};

/* END Form node editors */

/* START Form presenter */

function FormPresenter() {}

FormPresenter.addAPVElementListener = function(element) {
	if (element.tagName == "SELECT") {
		// particular case for <select>: onchange is better than blur
		YAHOO.util.Event.addListener(element, "change", FormPresenter.blurFieldListener, element);
	} else {
		YAHOO.util.Event.addListener(element, "blur", FormPresenter.blurFieldListener, element);
	}
};

FormPresenter.blurFieldListener = function(event, element) {
	FormPresenter.stackElementForValidation(element);
};

FormPresenter.callComponentEvent = function(componentEvent, value) {
	if (componentEvent === undefined) {
		return true;
	}
	try {
		var fn = eval(componentEvent.fn);
		return fn.call(window, value, componentEvent.arg);
	} catch (error) {
		EBX_UserMessageManager.addMessage("JsFunctionCall on widget<br/>Error on calling <i>" + componentEvent.fn + "</i> :<br/><b>" + error.message
				+ "</b>", EBX_UserMessageManager.ERROR);
		return false;
	}
};

/**
 * This method can be used by components to request the validation.
 */
FormPresenter.stackElementForValidation = function(element) {
	var id = element.id;

	var path = FormNodeIndex.fieldsIdPath[id];
	if (path === undefined) {
		return;
	}

	FormPresenter.stackPathForValidation(path);
};
FormPresenter.stackPathForValidation = function(path) {
	var formNode = FormNodeIndex.getFormNode(path);
	if (formNode === null) {
		return;
	}

	if (formNode.isAPV === true) {
		formNode.setWaiting(true);
		FormPresenter.prevalidate(formNode);
		return;
	}

	if (formNode.isAjaxValueSynch === true) {
		formNode.setWaiting(true);
		FormPresenter.setValueSynch(formNode);
		return;
	}

	// not used for the moment
	/*
	 var canSend = FormPresenter.callComponentEvent(formNode.eventBeforeValueChanged, formNode.getValue());
	 if (canSend !== true) {
	 return;
	 }
	 */

	FormPresenter.callComponentEvent(formNode.eventAfterValueChanged, formNode.getValue());
};

/**
 * This method can be used by components to request the update.
 */
FormPresenter.stackElementForUdpate = function(element) {
	var id = element.id;

	var path = FormNodeIndex.fieldsIdPath[id];
	if (path === undefined) {
		return;
	}

	FormPresenter.stackPathForUdpate(path);
};
FormPresenter.stackPathForUdpate = function(path) {
	var formNode = FormNodeIndex.getFormNode(path);
	if (formNode === null) {
		return;
	}

	formNode.setWaiting(true);
	FormPresenter.update(formNode);
};

FormPresenter.dataSource = new YAHOO.util.XHRDataSource();
FormPresenter.dataSource.responseType = YAHOO.util.DataSource.TYPE_TEXT;
FormPresenter.dataSource.connXhrMode = "queueRequests";
FormPresenter.dataSource.connMethodPost = true;
FormPresenter.dataSource.handleResponse = function(oRequest, oRawResponse, oCallback, oCaller, tId) {
	if (oRawResponse.responseText !== "") {
		FormPresenter.receive(YAHOO.lang.JSON.parse(oRawResponse.responseText));
	}
	var formNode = oCallback.argument;
	formNode.setWaiting(false);
	FormPresenter.callComponentEvent(formNode.eventAfterValueChanged, formNode.getValue());
};

// This request only set the user input in the value context if it is valid according to the defined data type.
FormPresenter.setValueSynch = function(formNode) {
	FormPresenter.dataSource.liveData = FormPresenter.setValueSynchRequest;
	var request = formNode.serialize();
	FormPresenter.dataSource.sendRequest(request, {
		failure: FormPresenter.receiveFailure,
		argument: formNode
	});
};

//This request set the user input in the value context if it is valid according to the  
// defined data type and, then check the defined constraints.
FormPresenter.prevalidate = function(formNode) {
	FormPresenter.dataSource.liveData = FormPresenter.prevalidateRequest;
	var request = formNode.serialize();
	FormPresenter.dataSource.sendRequest(request, {
		failure: FormPresenter.receiveFailure,
		argument: formNode
	});
};

// This request ask the up to date value of the given form node to the value context.
FormPresenter.update = function(formNode) {
	FormPresenter.dataSource.liveData = FormPresenter.updateRequest;
	var request = FormPresenter.parameterName + "=" + formNode.inputName;
	FormPresenter.dataSource.sendRequest(request, {
		failure: FormPresenter.receiveFailure,
		argument: formNode
	});
};

FormPresenter.receiveFailure = function(oRequest, oParsedResponse, argument) {
	if (oParsedResponse.status == 401) {
		EBX_Loader.gotoTimeoutPage();
	} else {
		// TODO CCH it could be beautiful to add an iFrame with the result of the page (whole HTML content)
		// oParsedResponse.responseText
		// TODO CCH Filter the response code so that user is not annoyed by error messages which he do not bother.
		// EBX_UserMessageManager.addMessage("Error #" + oParsedResponse.status + ": " + oParsedResponse.statusText, EBX_UserMessageManager.ERROR);
	}
	argument.setWaiting(false);
};

FormPresenter.receive = function(response) {
	if (response.update !== undefined) {
		var update = response.update, i;
		var length = update.length;
		for (i = 0; i < length; i++) {
			var updateItem = update[i];
			var nodePath = updateItem.path;
			var formNode = FormNodeIndex.getFormNode(nodePath);

			// message
			if (updateItem.message !== undefined) {
				formNode.setMessage(updateItem.message);
			} else {
				formNode.setMessage({});
			}

			// value
			if (updateItem.value !== undefined) {
				formNode.setValue(updateItem.value);
			}
		}
	}
};

/* END Form presenter */

/* START Form Presenter Status Indicator */

function FormPresenterStatusIndicator() {}

FormPresenterStatusIndicator.waiting = 0;

FormPresenterStatusIndicator.incrementWaiting = function() {
	var refreshNeeded = false;
	if (FormPresenterStatusIndicator.waiting === 0) {
		refreshNeeded = true;
	}

	FormPresenterStatusIndicator.waiting++;

	if (refreshNeeded) {
		FormPresenterStatusIndicator.refreshContent();
	}
};

FormPresenterStatusIndicator.decrementWaiting = function() {
	var refreshNeeded = false;
	if (FormPresenterStatusIndicator.waiting === 1) {
		refreshNeeded = true;
	}

	FormPresenterStatusIndicator.waiting--;
	// just in case...
	if (FormPresenterStatusIndicator.waiting < 0) {
		FormPresenterStatusIndicator.waiting = 0;
	}

	if (refreshNeeded) {
		FormPresenterStatusIndicator.refreshContent();
		FormPresenterStatusIndicator.callListener();
	}
};

FormPresenterStatusIndicator.isWaiting = function() {
	return FormPresenterStatusIndicator.waiting > 0;
};

FormPresenterStatusIndicator.elementId = "ebx_FormStatusFlag";
FormPresenterStatusIndicator.element = null;
FormPresenterStatusIndicator.elementEnabledCSSClass = "ebx_FormStatusFlagEnabled";

FormPresenterStatusIndicator.refreshContent = function() {
	if (FormPresenterStatusIndicator.element === null) {
		FormPresenterStatusIndicator.element = document.getElementById(FormPresenterStatusIndicator.elementId);
		if (FormPresenterStatusIndicator.element === null) {
			return;
		}
	}

	if (FormPresenterStatusIndicator.isWaiting()) {
		EBXUtils.addCSSClass(FormPresenterStatusIndicator.element, FormPresenterStatusIndicator.elementEnabledCSSClass);
	} else {
		EBXUtils.removeCSSClass(FormPresenterStatusIndicator.element, FormPresenterStatusIndicator.elementEnabledCSSClass);
	}
};

FormPresenterStatusIndicator.listenerToCallOnWaitingEnd = null;

FormPresenterStatusIndicator.setListenerOnWaitingEnd = function(listener) {
	if (FormPresenterStatusIndicator.isWaiting()) {
		FormPresenterStatusIndicator.listenerToCallOnWaitingEnd = listener;
	} else {
		window.setTimeout(listener, 0);
	}
};

FormPresenterStatusIndicator.callListener = function() {
	if (FormPresenterStatusIndicator.listenerToCallOnWaitingEnd !== null) {
		window.setTimeout(FormPresenterStatusIndicator.listenerToCallOnWaitingEnd, 0);
		FormPresenterStatusIndicator.listenerToCallOnWaitingEnd = null;
	}
};

/* END Form Presenter Status Indicator */
