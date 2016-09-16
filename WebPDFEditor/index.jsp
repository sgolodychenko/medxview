<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/";
	
	String id = request.getParameter("id");
	String vid = request.getParameter("vid");
	String aid = request.getParameter("aid");
	String come = request.getParameter("c");
	
%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>PDFJSAnnotate</title>
  <link rel="stylesheet" type="text/css" href="<%=basePath %>WebPDFEditor/css/font-awesome.css" />
  <link rel="stylesheet" type="text/css" href="<%=basePath %>WebPDFEditor/css/bootstrap.min.css" />
  <link rel="stylesheet" type="text/css" href="<%=basePath %>WebPDFEditor/css/jquery-ui.css" />
  <link rel="stylesheet" type="text/css" href="<%=basePath %>WebPDFEditor/css/bootstrap-dialog.min.css" />
  <link rel="stylesheet" type="text/css" href="<%=basePath %>WebPDFEditor/css/index.css" />
  <link rel="stylesheet" type="text/css" href="<%=basePath %>WebPDFEditor/css/toolbar.css" />
  <link rel="stylesheet" type="text/css" href="<%=basePath %>WebPDFEditor/css/pdf_viewer.css"/>

  
	
</head>
<body>
  <div class="toolbar">
    <%
    	if(come!=null&&come.equals("home")){
    		%>
		  	<button id="backBtn" class="cursor" type="button" title="Back" onclick="onBackBtn();" data-tooltype="cursor"><i class="fa fa-backward"></i></button>
		  	<div class="spacer"></div>
    		<%	
    	}
    %>
    <div class="mdx_annotation_container">
	    <div class="EditTools mdx_grp_btn">
			<button class="AddAnnotation mdx_btn active" type="button" opt="any" title="Select text or area for note, or click on area for sticky note"><span class="mdx_btn_icon mdx_icon_add_annotate"></span></button>
			<button class="StrikeOut mdx_btn active" type="button" opt="free" title="Draw line"><span class="mdx_btn_icon mdx_icon_strike_out"></span></button>
			<button class="Pan mdx_btn active btnactive" type="button" opt="pan" title="Grab and pan"><span class="mdx_btn_icon mdx_icon_pan"></span></button>
		</div>
	</div>
    <div id="annotationmarker_spacer" class="spacer"></div>
    <div id="annotationmarker" class="vv_notepad">
    	<div class="vv_notepad_content">
  			<%@ include file="toolbar_annomarker.jsp" %>
  		</div>
    </div>
    <div id="linemarker_spacer" class="spacer hide"></div>
    <div id="linemarker" class="mdx_annotation_container hide">
	    <div class="mdx_toolbar_container">
			<%@ include file="toolbar_linemarker.jsp" %>
		</div>
	</div>
    <div class="spacer"></div>
	<a href="javascript:void(0);" id="rotateleft" class="rotate-ccw" title="Rotate Clockwise Left">⟲</a>
    <a href="javascript:void(0);" id="rotateright" class="rotate-cw" title="Rotate Clockwise Right">⟳</a>
	<div class="spacer"></div>
	<i id="toggle-comments" class="fa fa-toggle-on" title="Toggle Comments Panel"></i>
  </div>
  <div id="content-wrapper" class="pabsolute">
    <div id="viewer" class="pdfViewer"></div>
  </div>
  <div id="comment-wrapper">
    <h4>Comments</h4>
	<div class="comment-list">
		<div class="comment-list-container nocomments">
		  <div class="comment-list-item">No comments</div>
		</div>
	</div>
  </div>
  <div id="annotationDlg" class="vv_notepad" style="display:none;">
  		<div class="vv_notepad_content">
		    <%@ include file="toolbar_annomarker.jsp" %>
		    <%@ include file="toolbar_linemarker.jsp" %>
		    <!-- end of menu buttons-->
		    <div class="externalLink form_group" style="display:none">
				<span class="form_label">Add external link</span>
		        <div class="input-group">
		            <span class="icon-external-link"></span>
		            <input type="text" placeholder="Add external link" value="">
		        </div>
			</div>
		    <div class="imageTitle form_group">
				<span class="form_label">Note title</span>
		        <div class="input-group">
		            <input type="text" id="input-annoation-title" placeholder="(image annotation)" value="">
		        </div>
			</div>
			<div class="addComment form_group">
				<span class="form_label">Comment</span>
		        <textarea id="textarea-annoation-comment" rows="4" style="background-color: #ffb0e2"></textarea>
			</div>
			<div class="addTag form_group">
				<span class="form_label">Tags<i class="fa fa-cog" title="Manage tags" onclick="manageTags()"></i></span>
		        <div id="div-annoation-tags" class="divtags"></div>
		        <div class="input-group">
		         	<input id="input-tags" class="inputtags"/><i class="autoselect fa fa-sort-desc"></i>
		        </div>
			</div>
			<div class="addRvs form_group">
				<span class="form_label">Reviewer</span>
		        <div id="div-annoation-rvs" class="divrvs"></div>
		        <div class="input-group">
		         	<input id="input-rvs" class="inputrvs"/><i class="autoselect fa fa-sort-desc"></i>
		        </div>
			</div>
		</div>
  </div>
  <div id="manageTagsDlg" class="vv_notepad" style="display:none;">
   	<div class="addComment form_group">
		<div class="tagslist"></div>
	</div>
	<div class="addTag form_group">
        <div class="input-group">
         	<input id="m_taginput" class="inputtags"/>
        </div>
        <div class="vv_tags_btn">
	        <button onclick="preEidtTag();" class="edit vv_btn opacity65">Edit</button>
	        <button onclick="clearTag();" class="clear vv_btn">Clear</button>
	        <button onclick="storeTag();" class="add vv_btn">Add </button>
   	 	</div>
	</div>
  </div>
  <script src="<%=basePath %>WebPDFEditor/js/jquery-1.8.2.min.js"></script>
  <script src="<%=basePath %>WebPDFEditor/js/jquery.rotate.js"></script>
  <script src="<%=basePath %>WebPDFEditor/js/bootstrap.min.js"></script>
  <script src="<%=basePath %>WebPDFEditor/js/jquery-ui.js"></script>
  <script src="<%=basePath %>WebPDFEditor/js/bootstrap-dialog.min.js"></script>
  <script src="<%=basePath %>WebPDFEditor/js/index.js"></script>
  <script src="<%=basePath %>WebPDFEditor/js/base.js"></script>
  <script src="<%=basePath %>WebPDFEditor/js/pdf_viewer.js"></script>
  
  
  <script>
  	var id = '<%=id%>';
  	var vid = '<%=vid%>';
  	var basePath = '<%=basePath%>';
  	var aid = '<%=aid%>';
  	var come = '<%=come%>';
  	$(function(){
  		eventAdaptor();
  		annoationEventReg();
  		lineEventReg();
  	});
	$(window).load(function(){
		init();
		tagsInit();
		rvsInit();
		//alert(js_getDPI());
	});
	function js_getDPI() {
	    var arrDPI = new Array();
	    if (window.screen.logicalXDPI != undefined) {
	        arrDPI[0] = window.screen.logicalXDPI;
	        arrDPI[1] = window.screen.logicalYDPI;
	    }
	    else {
	        var tmpNode = document.createElement("DIV");
	        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
	        document.body.appendChild(tmpNode);
	        arrDPI[0] = parseInt(tmpNode.offsetWidth);
	        arrDPI[1] = parseInt(tmpNode.offsetHeight);
	        tmpNode.parentNode.removeChild(tmpNode);    
	    }
	    return arrDPI;
	}
  </script>
</body>
</html>


