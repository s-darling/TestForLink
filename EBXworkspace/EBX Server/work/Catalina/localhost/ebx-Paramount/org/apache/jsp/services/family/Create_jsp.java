/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.42
 * Generated at: 2015-09-24 18:09:43 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.services.family;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.paramount.ebx.service.product.CreateProduct;
import java.io.Writer;
import com.orchestranetworks.service.ServiceContext;
import com.onwbp.adaptation.Adaptation;

public final class Create_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final javax.servlet.jsp.JspFactory _jspxFactory =
          javax.servlet.jsp.JspFactory.getDefaultFactory();

  private static java.util.Map<java.lang.String,java.lang.Long> _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public java.util.Map<java.lang.String,java.lang.Long> getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
  }

  public void _jspDestroy() {
  }

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
        throws java.io.IOException, javax.servlet.ServletException {

    final javax.servlet.jsp.PageContext pageContext;
    javax.servlet.http.HttpSession session = null;
    final javax.servlet.ServletContext application;
    final javax.servlet.ServletConfig config;
    javax.servlet.jsp.JspWriter out = null;
    final java.lang.Object page = this;
    javax.servlet.jsp.JspWriter _jspx_out = null;
    javax.servlet.jsp.PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");

// 	CreateProduct launcher = new CreateProduct(request, response);

// 	out.print("<script>parent.document.location.href='"
// 			+ launcher.getRedirection() + "';</script>");
    Writer writer = response.getWriter();
    String label = "";
    String description = "";
    ServiceContext sContext = ServiceContext.getServiceContext(request);
    if (sContext.getCurrentAdaptation() != null
            && sContext.getCurrentAdaptation().isTableOccurrence()) {
        label = "Create Product: "
                + sContext.getCurrentAdaptation().getLabel(
                sContext.getLocale());
        description = "New product for family: " + sContext.getCurrentAdaptation().getLabel(
                sContext.getLocale());
    } else {
        if (!sContext.getSelectedOccurrences().isEmpty()
                && ((Adaptation) sContext.getSelectedOccurrences().get(
                0)).isTableOccurrence()) {
            label = "Create Product: "
                    + ((Adaptation) sContext.getSelectedOccurrences()
                    .get(0)).getLabel(sContext.getLocale());
            description = "New product for family: " + ((Adaptation) sContext.getSelectedOccurrences()
                    .get(0)).getLabel(sContext.getLocale());
        } else {
// 				label = "New Product. Please set a clear label for your workflow";
// 				description = "Please enter description";
        }
    }
    writer.write("<form id=\"form\" action=\"" + sContext.getURLForIncludingResource("/CreateFamily")
            + "\" method=\"post\">");
    writer.write("<div>");
    writer.write("<div style=\"padding:20px;width:320px\">");
    writer.write("<label><b>Workflow Label</b></label>");
    writer.write("<input " + (label != null ? "value=\"" + label + "\" " : "")
            + "type=\"text\" id=\"label\" name=\"label\" size=\"60\" autofocus=\"autofocus\" required=\"required\"/>");
    writer.write("<br/>");
    writer.write("<br/>");
    writer.write("<label align=\"left\"><b>Description</b> (Optional)</label>");
    writer.write("<textarea id=\"description\" name=\"description\" style=\"width:100%;height:100px\">" + description + "</textarea>");
    writer.write("<br><br>");
    writer.write("<div  align=\"center\">");
    writer.write("<button type=\"submit\" class=\"ebx_Button\">Continue</button>");
    writer.write("<button type=\"button\" class=\"ebx_Button\" onclick=\"parent.document.location.href='"
            + sContext.getURLForEndingService() + "';\">Cancel</button>");
    writer.write("</div>");
    writer.write("</div>");
    writer.write("</div>");
    writer.write("</form>");

      out.write("\r\n");
      out.write("\r\n");
    } catch (java.lang.Throwable t) {
      if (!(t instanceof javax.servlet.jsp.SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}