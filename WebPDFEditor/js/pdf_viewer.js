var startX = 0;
var startY = 0;
var drawD;
var currentTime;
var w = 0;
var h = 0;
var selectedText;
var curTarget;
var pdiv;
var curTSlcBD;
var curGSlcBD;
var commentColor;
var isMouseUp = false;
var oneTimeDraw = {
	start: false,
	drawing: false,
	stop: false
};

var lastSelectedCommentKey;

function eventAdaptor() {
	$("#content-wrapper").delegate(
			'.pageContainer',
			'click mouseover mouseout mousedown mousemove mouseup',
			function(e) {
				setCursorIcon(e);
				mouseStickHandler(e);
				if(drawType == 'StopDraw'){
					if($(e.target).hasClass("selectbox") || $(e.target).hasClass("textbox") ){
						//move(e);
						return;
					}
				}
				if (e.type == 'mouseover') {

				} else if (e.type == 'mouseout') {

				} else if (e.type == 'click') {
					isMouseUp = false;
				} else if (e.type == 'mousedown' && oneTimeDraw.start == false) {
					if (drawType == 'DrawArea' || drawType == 'DrawLine') {
						if (lastSelectedCommentKey) {
							onRemoveBeSelectedReightCommentPanel();
						}
						startX = e.pageX - $(e.target).offset().left;
						startY = e.pageY - $(e.target).offset().top;
						currentTime = new Date().getTime();
						curTarget = e.target;

						oneTimeDraw.start = true;
						if (selectedText && selectedText[4]
								&& selectedText[4].length > 0) {
							oneTimeDraw.drawing = true;
							oneTimeDraw.stop = true;
							showPopup('TextAnnotation', selectedText);
							selectedText = '';
						}
					}else if(drawType == 'StopDraw'){
						
					}
				}  else if (e.type == 'mousemove' && oneTimeDraw.start == true ) {
					if (drawType == 'DrawArea' || drawType == 'DrawLine') {
						var x = e.pageX - $(e.target).offset().left;
						var y = e.pageY - $(e.target).offset().top;
						w = x - startX;
						h = y - startY;
						//if(w>=0&&h>=0){
							pdiv = {
								x : startX,
								y : startY,
								w : w,
								h : h
							};
							if(drawType == 'DrawLine'){
								paintLineAnnotation();
							}else if(drawType == 'DrawArea'){
								removeAnnotation(".slc_" + currentTime);
								drawD = createGraphicAnnoation(pdiv);
								curTarget = e.target;
								$(drawD)
										.appendTo(
												$(curTarget).parent().children(
														".overlayContainer"));
								paintAnnotation(curGSlcBD);
							}
						//}
						oneTimeDraw.drawing = true;
					}else if(drawType == 'StopDraw'){
						
					}
				}
				if ( e.type == 'mouseup' && oneTimeDraw.drawing == true ) {
					isMouseUp = false;
					if (drawType == 'DrawArea' || drawType == 'DrawLine') {
						if (w < 20 || h < 10) {
							//removeAnnotation(".slc_" + currentTime);
						}
						var divRec = {
								x:startX,
								y:startY,
								w:w,
								h:h
						}
						oneTimeDraw.stop = true;
						if(drawType == 'DrawArea'){
							showPopup('GraphicAnnotation',divRec);
						}else if(drawType == 'DrawLine'){
							showPopup('LineAnnotation',divRec);
						}
					}else if(drawType == 'StopDraw'){
						
					}
				}
			});
}

function mouseStickHandler(e){
	if(e.type == 'mouseup'){
		isMouseUp = true;
	}
}
var isMouseDown = false;
var dstartX = 0.0;
var dstartY = 0.0;
function move(e,o){
	if(e.type=='mousedown'){
		isMouseDown = true;
		dstartX = e.pageX - $(e.target).offset().left;
		dstartY = e.pageY - $(e.target).offset().top;
	}
	$(e.target).mousemove(function(){
		if(isMouseDown == true){
			var dx = e.pageX - $(e.target).offset().left;
			var dy = e.pageY - $(e.target).offset().top;
			var w = dx - dstartX;
			var h = dy - dstartY;
			moveAnnotation(e,w,h);
		}
	});
	if(e.type=='mouseup'){
		isMouseDown = false;
	}
}

function moveAnnotation(e, w, h){
	if(isMouseDown){
		var offsetx = parseFloat($(e.target).css("left").replace("px","")) + parseFloat(w);
		$(e.target).css("left",offsetx + "px");
		var offsety = parseFloat($(e.target).css("top").replace("px","")) + parseFloat(h);
		$(e.target).css("top",offsety + "px");
	}
}

function hasDrawGraghicCompleted(){
	if (oneTimeDraw.start == true && oneTimeDraw.drawing == true
			&& oneTimeDraw.stop == true) {
		return true;
	}
	return false;
}

function showPopup(type,data) {
	if (hasDrawGraghicCompleted() == false) {
		return;
	}
	oneTimeDraw = {
		start : false,
		drawing : false,
		stop : false
	};
	var title = "";
	
	if(type=='GraphicAnnotation'){
		$("#annotationDlg .borderPicker.vv_grp_btn").show();
		$("#annotationDlg .textStyle.vv_grp_btn").hide();
		$("#annotationDlg .LineSubTools.mdx_toolbar").hide();
		
		title="Graphic Annotation";
	}else if(type=='TextAnnotation'){
		$("#annotationDlg  .borderPicker.vv_grp_btn").hide();
		$("#annotationDlg  .textStyle.vv_grp_btn").show();
		$("#annotationDlg .LineSubTools.mdx_toolbar").hide();
		
		title=data[4];
		var x = data[0] * 2.3;
		var y = data[1] * 2.3;
		var w = data[2] * 2.3 - x;
		var h = data[3] * 2.3 - y;
		pdiv = {
			x : x,
			y : y,
			w : w,
			h : h
		};
		createTextAnnotation(pdiv);
		
		if (curTSlcBD && curTSlcBD.t) {
			setStyleValue2TextAnnotation(curTSlcBD.t);
		}
	}else if(type=='LineAnnotation'){
		$("#annotationDlg .borderPicker.vv_grp_btn").hide();
		$("#annotationDlg .textStyle.vv_grp_btn").hide();
		$("#annotationDlg .LineSubTools.mdx_toolbar").show();
		
		title="Line Annotation";
	}
	$("#annotationDlg").show();
	$("#annotationDlg").dialog({
		title : title,
		resizable : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons : {
			"Save" : function() {
				$(this).dialog("close");
				storeAnnotion(type,title);
				$("#annotationDlg").hide();
			},
			"Cancel" : function() {
				$(this).dialog("close");
				cancelAnnotion(type,currentTime);
				$("#annotationDlg").hide();
			}
		}
	});

}

function storeAnnotion(type,title){
	if(!curGSlcBD){
		curGSlcBD = {p : '-31px -27px',t : 'B',c : '#FF0000',w : '2px'};
	}
	var tagsText = '';
	$("#div-annoation-tags span").each(function(){
		tagsText += trim($(this).text())+"^";
	});
	if(tagsText.indexOf("^")>-1){
		tagsText = tagsText.substring(0,tagsText.length-1);
	}
	var rvsText = '';
	$("#div-annoation-rvs span").each(function(){
		rvsText += trim($(this).text())+"^";
	});
	if(rvsText.indexOf("^")>-1){
		rvsText = rvsText.substring(0,rvsText.length-1);
	}
	var comment = {
		title: trim($("#input-annoation-title").val()).length>0?$("#input-annoation-title").val():title,
		content: $("#textarea-annoation-comment").val(),
		tags: tagsText,
		visibleLevel: '2',
		rvs: rvsText
	}
	if(!curTSlcBD){
		curTSlcBD = {};
	}
	if(type=='TextAnnotation'){
		curTSlcBD.p = $("span.text.vv_pick_indicator.vv_icon_highlight").css('background-position');
		curTSlcBD.t = 'hightlight';
	}
	if (!commentColor) {
		commentColor = 'rgb(255,0,0)';
	}
	var dcurGSlcBD = {};
	var dcurTSlcBD = {};
	if(type=='GraphicAnnotation'){
		dcurGSlcBD = curGSlcBD;
	}else if(type=='TextAnnotation'){
		dcurTSlcBD = curTSlcBD
	}else if(type=='LineAnnotation'){
		dcurGSlcBD = {
			c : drawLine.color,
			w : drawLine.width,
			p : '',
			t : ''
		}
	}
	var docId = id;
	var versionId = vid;
	var pageNo = $(curTarget).parent().attr("id").replace('pageContainer','');
	var data = {
		docId: docId,
		versionId: versionId,
		pageNo: pageNo,
		key: currentTime,
		type: type,
		color: commentColor,
		daxis: pdiv,
		gaxis: dcurGSlcBD,
		taxis: dcurTSlcBD,
		comment:comment
	};
	console.info(JSON.stringify(data));
	
	$.ajax({
		url:basePath + 'SimpleAjaxInvoke?invokeType=10&timestamp=' + new Date().getTime(),
        dataType: "text",
		data:{j:JSON.stringify(data)},
		success:function(data){
			var anno = $.parseJSON(data);
			createRightCommentPanel(anno);
			$("#input-annoation-title").val("");
			$("#textarea-annoation-comment").val("");
			$("#div-annoation-tags").empty();
			$("#div-annoation-rvs").empty();
			
			zindex = zindex + 1;
		},
		error:function(e){
			
		}
	});
}

function updateAnnotion(data){
	$.ajax({
		url:basePath + 'SimpleAjaxInvoke?invokeType=13&timestamp=' + new Date().getTime(),
        dataType: "text",
		data:{j:JSON.stringify(data)},
		success:function(data){
			console.info("Update Sucessful!");
		},
		error:function(e){
			
		}
	});
}

function removeAnnoation(o){
	var key = $(o).attr("key");
	
	$.ajax({
		url:basePath + 'SimpleAjaxInvoke?invokeType=11&timestamp=' + new Date().getTime(),
        dataType: "text",
		data:{key:key},
		success:function(data){
			var d = $.parseJSON(data);
			if(d){
				var pp = $(o).parent().parent();
				$(pp).remove();
				
				var tp = $(o).attr("dt");
				cancelAnnotion(tp, key);
				
				var ppp = $("#comment-wrapper .comment-list");
				if($(ppp).html()&&trim($(ppp).html()).length>0){
					return;
				}
				
				var noCommentPanel = '';
				noCommentPanel += '<div class="comment-list-container nocomments">';
				noCommentPanel += '		<div class="comment-list-item">No comments</div>';
				noCommentPanel += '</div>';
				
				$(noCommentPanel).appendTo($("#comment-wrapper .comment-list"));
			}
		},
		error:function(e){
			
		}
	});
}

function createRightCommentPanel(data){
	var noComment = $(".comment-list-container.nocomments");
	if(noComment){
		$(noComment).remove();
	}
	var imgPositation = '';
	if (data.type == 'TextAnnotation') {
		imgPositation = data.taxis.p;
	}else if(data.type == 'GraphicAnnotation') {
		imgPositation = data.gaxis.p;
	}
	var panel = '';
	panel += '<div class="right-annotation-main" id="'+data.key+'" onclick="onSelectRightCommentPanel(this)">';
	panel += '	<div class="annotation-title">';
	panel += '		<span class="title-img" style="background-position: '+imgPositation+';"></span>';
	panel += '		<span class="title-text">('+data.comment.title+')</span>';
	panel += '		<span class="title-close fa fa-times-circle" key="'+data.key+'" dt="'+data.type+'" onclick="removeAnnoation(this);"></span>';
	panel += '	</div>';
	panel += '	<div class="annotation-content">'+data.comment.content+'';
	panel += '	</div>';
	panel += '	<div class="annotation-footer">';
	panel += '		<span class="footer-s1">'+data.creator+'</span>';
	panel += '		<span class="footer-s2">'+data.createDate+'</span>';
	panel += '	</div>';
	panel += '</div>';
	
	$(panel).appendTo($("#comment-wrapper .comment-list"));
	
	$("#"+data.key).css('border-color',data.color);
	$("#"+data.key+" .annotation-title").css('background',data.color);
	
	if(data.type=='TextAnnotation'){
		$("#"+data.key+" .annotation-title .title-img").css('background-image','url("./img/annotate-sprite.png")');
	}
}

function cancelAnnotion(type,key){
	if(type=='GraphicAnnotation'){
		removeAnnotation(".slc_" + key);
	}else if(type=='TextAnnotation'){
		removeAnnotation(".txt_" + key);
	}else if(type=='LineAnnotation'){
		removeAnnotation(".lin_" + key);
	}
}

function annoationEventReg() {
	$(".vv_dropdown_menu.vv_color_menu li > span").click(function() {
		var color = $(this).css("background-color");
		$(".color.vv_color_swatch").css('background-color', color);
		$(".addComment.form_group textarea").css('background-color', color);
		$(".txt_" + currentTime).css('background-color', color);
		
		commentColor = color;
	});

	$(".vv_dropdown_menu.vv_border_menu li > span").click(function() {
		var p = $(this).css("background-position");
		$(".border.vv_pick_indicator").css('background-position', p);
		var d = {
			
		};
		var slcBD = selectBorderData(p);
		paintAnnotation(slcBD);
	});
	
	$(".textStyle.vv_grp_btn ul li > a").click(function() {
		setTextAnnotationStyle( $(this) );
	});
	
}

function lineEventReg() {
	$(".mdx_dropdown_menu.mdx_color_menu li a > span").click(function() {
		var color = $(this).css("background-color");
		$(".LineColor .mdx_color_swatch").css('background-color', color);
		drawLine.color = color;
		paintLineAnnotation();
	});

	$(".mdx_line_selector .mdx_dropdown_menu li").click(function() {
		var hs = $(this).find("a span").css("height");
		$(".mdx_line_selector .mdx_btn.mdx_dropdown_toggle .SelectedLineThickness").css('height', hs);
		$(".mdx_line_selector .mdx_dropdown_menu .mdx_selected").remove();
		$(this).find("a").append('<span class="mdx_selected fa fa-check"></span>');
		drawLine.width = hs;
		
		paintLineAnnotation();
	});
}
function paintLineAnnotation(){
	if(currentTime=='0'){
		return;
	}
	removeAnnotation(".lin_" + currentTime );
	var cdiv = createDrawLineAnnoation(pdiv);
	$(cdiv)
			.appendTo(
					$(curTarget).parent().children(
							".overlayContainer"));
}
function paintAnnotation(slcBD){
	if (!slcBD||slcBD&&!slcBD.t||currentTime=='0')
		return;
	if(slcBD.t=='A'){
		removeAnnotation(".slc_" + currentTime );
		var cdiv = createLineAnnotation(pdiv,slcBD);
		$(cdiv)
		.appendTo(
				$(curTarget).parent().children(
						".overlayContainer"));
		$(".selectbox.slc_" + currentTime ).css('border-width','0px');
	}else if(slcBD.t=='B'){
		removeAnnotation(".slc_" + currentTime);
		var cdiv = createGraphicAnnoation(pdiv,slcBD);
		$(cdiv)
				.appendTo(
						$(curTarget).parent().children(
								".overlayContainer"));
	}else if(slcBD.t=='C'){
		removeAnnotation(".slc_" + currentTime);
		var cdiv = createEllipseAnnoation(pdiv,slcBD);
		$(cdiv)
				.appendTo(
						$(curTarget).parent().children(
								".overlayContainer"));
		$(".selectbox.slc_" + currentTime ).css('border-width','0px');
	}
}

function createDrawLineAnnoation(p){
	if(currentTime=='0'){
		return;
	}
	var lineDiv = '';
	lineDiv += '<div class="selectbox lin_'+currentTime+'" style="z-index:'+zindex+';border-width: 0px;left:'+p.x+'px;top:'+p.y+'px;width:'+p.w+'px;height:'+p.h+'px;">';
	
	var x=p.x,y=p.y,a=p.w,b=p.h;  
    for (var i = 0; i < a; i++) {  
        var x1=i,  
            y1=(b/a)*i;  
        var div = '<div style="left:'+x1+'px;top:'+y1+'px;width:'+drawLine.width+';height:'+drawLine.width+';background:'+drawLine.color+';position:absolute;"></div>';
        lineDiv += div;
    };  
    lineDiv += '</div>';
    
    return lineDiv;
}

function createEllipseAnnoation(p,slcBD){
	if(currentTime=='0'){
		return;
	}
	var ellipseDiv = '';
	ellipseDiv += '<div class="selectbox slc_'+currentTime+'" style="z-index:'+zindex+';left:'+p.x+'px;top:'+p.y+'px;width:'+p.w+'px;height:'+p.h+'px;">';
	
	var x=p.x,y=p.y,a=p.w/2,b=p.h/2,du=360;  
    for (var i = 0; i < du; i++) {  
        var hudu=(Math.PI/180)*i,  
            x1=a*Math.sin(hudu)+a,  
            y1=b*Math.cos(hudu)+b;  
        var div = '<div style="left:'+x1+'px;top:'+y1+'px;width:'+slcBD.w+';height:'+slcBD.w+';background:'+slcBD.c+';position:absolute;"></div>';
        ellipseDiv += div;
    };  
    ellipseDiv += '</div>';
    
    return ellipseDiv;
}

function selectBorderData(p){
	var retD = {};
	
	var array = new Array();
	var d = {};
	d = {p : '-5px -5px',t : 'A',c : '#000000',w : ''};
	array[0] = d;
	d = {p : '-56px -5px',t : 'A',c : '#FF0000',w : ''};
	array[1] = d;
	d = {p : '-83px -5px',t : 'A',c : '#00FF00',w : ''};
	array[2] = d;
	d = {p : '-109px -5px',t : 'A',c : '#0000FF',w : ''};
	array[3] = d;
	d = {p : '-161px -5px',t : 'A',c : '#FF00FF',w : ''};
	array[4] = d;
	d = {p : '-135px -5px',t : 'A',c : '#00FFFF',w : ''};
	array[5] = d;
	
	d = {p : '-5px -27px',t : 'B',c : '#000000',w : '2px'};
	array[6] = d;
	d = {p : '-31px -27px',t : 'B',c : '#FF0000',w : '2px'};
	array[7] = d;
	d = {p : '-57px -27px',t : 'B',c : '#00FF00',w : '2px'};
	array[8] = d;
	d = {p : '-83px -27px',t : 'B',c : '#0000FF',w : '2px'};
	array[9] = d;
	d = {p : '-135px -27px',t : 'B',c : '#FF00FF',w : '2px'};
	array[10] = d;
	d = {p : '-161px -27px',t : 'B',c : '#00FFFF',w : '2px'};
	array[11] = d;
	
	d = {p : '-5px -51px',t : 'B',c : '#000000',w : '5px'};
	array[12] = d;
	d = {p : '-31px -51px',t : 'B',c : '#FF0000',w : '5px'};
	array[13] = d;
	d = {p : '-57px -51px',t : 'B',c : '#00FF00',w : '5px'};
	array[14] = d;
	d = {p : '-83px -51px',t : 'B',c : '#0000FF',w : '5px'};
	array[15] = d;
	d = {p : '-135px -51px',t : 'B',c : '#FF00FF',w : '5px'};
	array[16] = d;
	d = {p : '-161px -51px',t : 'B',c : '#00FFFF',w : '5px'};
	array[17] = d;
	
	d = {p : '-5px -75px',t : 'C',c : '#000000',w : '5px'};
	array[18] = d;
	d = {p : '-31px -75px',t : 'C',c : '#FF0000',w : '5px'};
	array[19] = d;
	d = {p : '-57px -75px',t : 'C',c : '#00FF00',w : '5px'};
	array[20] = d;
	d = {p : '-83px -75px',t : 'C',c : '#0000FF',w : '5px'};
	array[21] = d;
	d = {p : '-135px -75px',t : 'C',c : '#FF00FF',w : '5px'};
	array[22] = d;
	d = {p : '-161px -75px',t : 'C',c : '#00FFFF',w : '5px'};
	array[23] = d;
	
	d = {p : '-5px -99px',t : 'C',c : '#000000',w : '2px'};
	array[24] = d;
	d = {p : '-31px -99px',t : 'C',c : '#FF0000',w : '2px'};
	array[25] = d;
	d = {p : '-57px -99px',t : 'C',c : '#00FF00',w : '2px'};
	array[26] = d;
	d = {p : '-83px -99px',t : 'C',c : '#0000FF',w : '2px'};
	array[27] = d;
	d = {p : '-135px -99px',t : 'C',c : '#FF00FF',w : '2px'};
	array[28] = d;
	d = {p : '-161px -99px',t : 'C',c : '#00FFFF',w : '2px'};
	array[29] = d;
	
	curGSlcBD = array[7];
	for(var i=0;i<array.length;i++){
		if(array[i].p==p){
			console.info(array[i]);
			retD = array[i];
			curGSlcBD = retD;
		}
	}
	return retD;
}

function setStyleValue2TextAnnotation(o){
	var p = '';
	if(o=='hightlight'){
		$(".txt_" + currentTime).css({'background-color':$("span.color.vv_color_swatch").css('background-color')});
		$(".txt_" + currentTime).css({'border-left':'0px solid red'});
		$(".txt_" + currentTime).css({'border-bottom':'3px solid red'});
		$(".txt_" + currentTime+" .strike").remove();
		
		p = '0 -260px';
	}else if(o=='insert'){
		$(".txt_" + currentTime+" .strike").remove();
		$(".txt_" + currentTime).css({'background-color':'transparent'});
		$(".txt_" + currentTime).css({'border-left':'4px solid red'});
		$(".txt_" + currentTime).css({'border-bottom':'1px solid red'});
		
		p = '0 -278px';
	}else if(o=='strike'){
		$(".txt_" + currentTime+" .strike").remove();
		$(".txt_" + currentTime).css({'background-color':'transparent'});
		$(".txt_" + currentTime).css({'border-left':'0px solid red'});
		$(".txt_" + currentTime).css({'border-bottom':'0px solid red'});
		$("<div class='"+o+"' style='height:"+$(".txt_" + currentTime).height()/2+"px'></div>").appendTo($(".txt_" + currentTime));
		
		p = '0 -300px';
	}else if(o=='revise'){
		$(".txt_" + currentTime+" .strike").remove();
		$(".txt_" + currentTime).css({'background-color':'#80ff80'});
		$(".txt_" + currentTime).css({'border-left':'0px solid red'});
		$(".txt_" + currentTime).css({'border-bottom':'2px dashed #008000'});
		
		p = '0 -317px';		
	}else if(o=='external'){
		$(".txt_" + currentTime+" .strike").remove();
		$(".txt_" + currentTime).css({'background-color':'#3a9bdc'});
		$(".txt_" + currentTime).css({'border-left':'0px solid red'});
		$(".txt_" + currentTime).css({'border-bottom':'0px dashed #008000'});
		
		p = '0 -220px';
	}else{
		p = '0 -317px';
	}
	return p;
}

function setTextAnnotationStyle(s){
	var o = $(s).attr("opt");
	var p = setStyleValue2TextAnnotation(o);
	$("span.text.vv_pick_indicator.vv_icon_highlight").css('background-position',p);
	if (!curTSlcBD) {
		curTSlcBD = {};
	}
	curTSlcBD.p = p;
	curTSlcBD.t = o;
}

function createGraphicAnnoation(p,slcBD){
	var borderStr = '';
	if(slcBD&&slcBD.w){
		borderStr = 'border-width: '+slcBD.w+'; border-color: '+slcBD.c+';';
	}else if(curGSlcBD&&curGSlcBD.w){
		borderStr = 'border-width: '+curGSlcBD.w+'; border-color: '+curGSlcBD.c+';';
	}
	var graphicDiv = '';
	graphicDiv += '<div class="selectbox slc_'+currentTime+'" style="z-index:'+zindex+';left:'+p.x+'px;top:'+p.y+'px;width:'+p.w+'px;height:'+p.h+'px;'+borderStr+'">';
	graphicDiv += '</div>';
	return graphicDiv;
}

function createTextAnnotation(p){
	var textDiv = '';
	textDiv += '<div class="textbox txt_'+currentTime+'" style="z-index:'+zindex+';left:'+p.x+'px;top:'+p.y+'px;width:'+p.w+'px;height:'+p.h+'px;">';
	textDiv += '</div>';
	
	$(textDiv)
	.appendTo(
			$(curTarget).parent().children(
					".overlayContainer"));
}

function createLineAnnotation(p,slcBD){
	var arrowIconL = '';
	var arrowIconT = '';
	
	var dotIconL = '';
	var dotIconT = '';
	if(slcBD.c=='#000000'){
		arrowIconL = '-252';
		arrowIconT = '-36';
		
		dotIconL = "-581";
		dotIconT = "-41";
	}else if(slcBD.c=='#FF0000'){
		arrowIconL = "-252";
		arrowIconT = "-108";
		
		dotIconL = "-581";
		dotIconT = "-113";
	}else if(slcBD.c=='#00FF00'){
		arrowIconL = "-252";
		arrowIconT = "0";
		
		dotIconL = "-581";
		dotIconT = "-5";
	}else if(slcBD.c=='#0000FF'){
		arrowIconL = "-252";
		arrowIconT = "-180";
		
		dotIconL = "-581";
		dotIconT = "-185";
	}else if(slcBD.c=='#00FFFF'){
		arrowIconL = "-252";
		arrowIconT = "-216";
		
		dotIconL = "-581";
		dotIconT = "-221";
	}else if(slcBD.c=='#FF00FF'){
		arrowIconL = "-252";
		arrowIconT = "-252";
		
		dotIconL = "-581";
		dotIconT = "-257";
	}
	
	var lineDiv = '';
	lineDiv += '<div class="selectbox slc_'+currentTime+'" style="z-index:'+zindex+';left:'+p.x+'px;top:'+p.y+'px;width:'+p.w+'px;height:'+p.h+'px;">';
	lineDiv += '	<div style="position: absolute; overflow: hidden; width: 36px; height: 36px; left: -2px; top: -18px;">';
	if(p.w>20&&p.h>20){
		lineDiv += '		<img class="tx_" src="./img/arrows.png" style="padding: 0px; margin: 0px; border: none; position: absolute; left: '+arrowIconL+'px; top: '+arrowIconT+'px; background-color: transparent;">';
	}
	lineDiv += '	</div>';
	lineDiv += '	<div style="position: absolute; width: 1px; height: 1px; right: 0px; bottom: 0px;">';
	lineDiv += '		<div style="position: absolute; left: -4px; top: -4px; width: 10px; height: 10px; overflow: hidden;">';
	if(p.w>20&&p.h>20){
		lineDiv += '			<img class="tx_" src="./img/arrows.png" style="padding: 0px; margin: 0px; border: none; position: absolute; left: '+dotIconL+'px; top: '+dotIconT+'px; background-color: transparent;">';
	}
	lineDiv += '		</div>';
	lineDiv += '	</div>';
	lineDiv += '	<div style="position: absolute; top: 11px; right: 0px; bottom: 0px; left: 28px; border-width: 1px 1px 0px 0px; border-style: solid; border-color: '+slcBD.c+';">';
	lineDiv += '		<div class="vv_pagemark_highlight" style="min-height: 5px; top: -7px; left: -7px; right: -7px; bottom: -7px; border-width: 6px 6px 0px 0px;"></div>';
	lineDiv += '	</div>';
	lineDiv += '</div>';

	return lineDiv;
}

function removeAnnotation(cls){
	$(cls).remove();
}

function setCursorIcon(e){
	var cursor = "";
	if (drawType == 'DrawArea') {
		var textArray = pageTextData((e.pageX - $(e.target).offset().left),
				(e.pageY - $(e.target).offset().top));
		cursor = "crosshairMouseIcon";
		if(textArray&&textArray.length>0){
			selectedText = textArray;
			cursor = "textMouseIcon";
		}else{
			selectedText = '';
		}
	}else if(drawType == 'DrawLine'){
		cursor = 'lineMouseIcon';
	}else if(drawType == 'StopDraw'){
		cursor =  'pointerMouseIcon';
		if($(e.target).hasClass("selectbox") || $(e.target).hasClass("textbox")){
			cursor = "moveMouseIcon";
		}
	}
	var parentAllCls = $($(e.target).parent()).attr("class");
	if (parentAllCls && parentAllCls.length > 0) {
		var clsArray = parentAllCls.split(' ');
		for (var i = 0; i < clsArray.length; i++) {
			if (clsArray[i].indexOf('MouseIcon') > -1) {
				$($(e.target).parent()).removeClass(clsArray[i]);
			}
		}
		$($(e.target).parent()).addClass(cursor);
	}
}

function initSelectRightCommonPanel(key){
	onSelectRightCommentPanel($(".comment-list > #"+key));
}

function onSelectRightCommentPanel(o){
	if(lastSelectedCommentKey){
		onRemoveBeSelectedReightCommentPanel();
	}
	var key = $(o).attr("id");
	$(o).addClass("select-comment-panel");
	
    scrollToDiv($("#content-wrapper"),$(".slc_"+key));
	$(".slc_"+key).addClass("select-comment-panel");
	
	scrollToDiv($("#content-wrapper"),$(".txt_"+key));
	$(".txt_"+key).addClass("select-comment-panel");
	
	lastSelectedCommentKey = key;
}

function scrollToDiv(container,scrollTo){
	if(scrollTo&&scrollTo.offset()){
		$(container).animate({scrollTop: scrollTo.offset().top - $(container).offset().top + $(container).scrollTop() - 100});
	}
}

function onRemoveBeSelectedReightCommentPanel(){
	$("#"+lastSelectedCommentKey).removeClass("select-comment-panel");
	$(".slc_"+lastSelectedCommentKey).removeClass("select-comment-panel");
	$(".txt_"+lastSelectedCommentKey).removeClass("select-comment-panel");
}


