
function IE6CompatibilityCondition()
{
	return navigator.userAgent.match("MSIE 6.") !== null;
}
var specialCSSForIE6Added = false;
function addSpecialCSSForIE6()
{
	if (specialCSSForIE6Added === true) {
		return;
	}

	if (IE6CompatibilityCondition() === false) {
		return;
	}

	/* special CSS */
	var specialStylesheet = document.createElement("LINK");
	specialStylesheet.type = "text/css";
	specialStylesheet.rel = "stylesheet";
	specialStylesheet.href = ie6CompatibilityCSSURL;
	document.getElementsByTagName("HEAD")[0].appendChild(specialStylesheet);

	specialCSSForIE6Added = true;
}

window.onload = addSpecialCSSForIE6;
