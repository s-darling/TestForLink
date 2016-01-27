function EBXUtils(){

}

EBXUtils.CSSClassSeparator = " "; /* DO NOT CHANGE : HTML/CSS Standard */
EBXUtils.matchCSSClass = function(element, cssClass){
    if (element.className == null) 
        return false;
    
    var classes = element.className.split(EBXUtils.CSSClassSeparator);
    for (var i = 0; i < classes.length; i++) {
        if (classes[i] == cssClass) 
            return true;
    }
    return false;
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

/**
 * Return true if the CSS Class was find (and so removed)
 */
EBXUtils.removeCSSClass = function(element, cssClass){
    if (element.className == null) 
        return false;
    
    var ret = false;
    var targetClassName = "";
    var firstLoop = true;
    var classes = element.className.split(EBXUtils.CSSClassSeparator);
    for (var i = 0; i < classes.length; i++) {
        if (classes[i] == cssClass) 
            ret = true;
        else 
            targetClassName += (firstLoop ? "" : EBXUtils.CSSClassSeparator) +
            classes[i];
        
        firstLoop = false;
    }
    element.className = targetClassName;
    return ret;
};

EBXUtils.getFirstParentMatchingCSSClass = function(element, cssClass){
    var parent = element.parentNode;
    while (parent != null) {
        if (EBXUtils.matchCSSClass(parent, cssClass)) 
            return parent;
        else 
            parent = parent.parentNode;
    }
    return null;
};

EBXUtils.getRecursiveChildrenMatchingTagName = function(element, tagName){
    var children = new Array();
    
    for (var i = 0; i < element.childNodes.length; i++) {
        EBXUtils.pushRecursiveChildrenMatchingTagName(element.childNodes[i], tagName, children);
    }
    
    return children;
};
EBXUtils.pushRecursiveChildrenMatchingTagName = function(element, tagName, arrayToFill){
    /* some nodes are not elements (but text for example) */
    if (element.tagName != null) 
        if (element.tagName.toLowerCase() == tagName.toLowerCase()) 
            arrayToFill.push(element);
    
    for (var i = 0; i < element.childNodes.length; i++) {
        EBXUtils.pushRecursiveChildrenMatchingTagName(element.childNodes[i], tagName, arrayToFill);
    }
};

EBXUtils.urlParams = null;
EBXUtils.getUrlParams = function(){
    if (EBXUtils.urlParams == null) {
        EBXUtils.urlParams = new Array();
        var paramCouples = location.search.substr(1).split("&");
        var paramCouple;
        for (var i in paramCouples) {
            paramCouple = paramCouples[i].split("=");
            EBXUtils.urlParams[paramCouple[0]] = paramCouple[1];
        }
    }
    return EBXUtils.urlParams;
};

EBXUtils.expandAllParentYUINodes = function(yuiNode){
    var parentNode = yuiNode;
    while (parentNode != null) {
        parentNode.expand();
        parentNode = parentNode.parent;
    }
};

function EBX_Doc(){
}

EBX_Doc.popupName = "ebx_HelpBook";
EBX_Doc.launchPopup = function(url){
    var helpPopUp = window.open(url, EBX_Doc.popupName, "toolbar=yes, menubar=no, location=no, scrollbars=yes, resizable=yes, width=850, height=600");
    
    return helpPopUp;
};
