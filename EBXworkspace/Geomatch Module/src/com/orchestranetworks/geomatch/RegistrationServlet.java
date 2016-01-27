package com.orchestranetworks.geomatch;

import javax.servlet.*;
import javax.servlet.http.*;
import com.onwbp.base.repository.*;

@SuppressWarnings("serial")
public class RegistrationServlet extends HttpServlet {
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		ModulesRegister.registerWebApp(this, config);
	}

	public void destroy() {
		ModulesRegister.unregisterWebApp(this, this.getServletConfig());
	}
}