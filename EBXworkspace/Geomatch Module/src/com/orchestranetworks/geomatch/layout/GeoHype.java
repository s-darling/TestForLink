package com.orchestranetworks.geomatch.layout;

import com.onwbp.base.text.UserMessage;
import com.onwbp.base.text.UserMessageString;
import com.orchestranetworks.instance.ValueContext;
import com.orchestranetworks.schema.Path;
import com.orchestranetworks.ui.UIBeanEditor;
import com.orchestranetworks.ui.UIButtonSpecJSAction;
import com.orchestranetworks.ui.UIResponseContext;

public class GeoHype extends UIBeanEditor {
	@Override
	public void addForDisplay(UIResponseContext arg0) {
		ValueContext vc = arg0.getValueContext();
		
			Object address = arg0.getValueContext().getValue(Path.SELF);
			System.out.println(address);
			if (address != null) {
				arg0.add(GeoLink.makeLink(address + ""));
				
			}
			else{
				addForEdit(arg0);
			}
		
	}

	@Override
	public void addForEdit(UIResponseContext arg0) {
		arg0.addUIBestMatchingEditor(Path.SELF, "");
	}

}