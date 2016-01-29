package com.orchestranetworks.geomatch.layout;

import com.onwbp.base.text.UserMessage;
import com.orchestranetworks.instance.ValueContext;
import com.orchestranetworks.schema.Path;
import com.orchestranetworks.ui.UIBeanEditor;
import com.orchestranetworks.ui.UIButtonSpecJSAction;
import com.orchestranetworks.ui.UIResponseContext;

/*
 * http://maps.google.com/?q=term
 * where term is the address to be added
 */

public class GeoLink extends UIBeanEditor {
	public static String makeLink(String value) {
		if (value == null || value.equals("null") || value.trim().equals(""))
			return value;
		return new StringBuilder("<a target='_blank' href = '")
				.append("http://maps.google.com/?q=")
				.append(value).append("'> ").append(value).append("</a>")
				.toString();
	}

	public static String getURLForLookUp(String value) {
		return new StringBuilder("http://maps.google.com/?q=")
				.append(value).toString();
	}

	@Override
	public void addForDisplay(UIResponseContext arg0) {
		ValueContext vc = arg0.getValueContext();
		String value = (String) vc.getValue(Path.SELF);
		if (value != null)
			value = value.trim();
		arg0.addUIBestMatchingEditor(Path.SELF, "");
		UserMessage um = UserMessage.createInfo("Get The Link");
		arg0.addButtonJavaScript(new UIButtonSpecJSAction(
				um,
				"window.open('http://maps.google.com/?q='+document.getElementById('_ID').value, '_blank');"));		
	}

	@Override
	public void addForEdit(UIResponseContext arg0) {
		addForDisplay(arg0);
	}

}