var textAxis = new Array();
var zindex = 1;
function init(){
	$("#toggle-comments").click(function(){
		if($(this).hasClass('fa-toggle-on')){
			$(this).removeClass('fa-toggle-on');
			$(this).addClass('fa-toggle-off');
			$("#content-wrapper").removeClass('pabsolute');
			$("#comment-wrapper").hide();
		}else{
			$(this).removeClass('fa-toggle-off');
			$(this).addClass('fa-toggle-on');
			$("#content-wrapper").addClass('pabsolute');
			$("#comment-wrapper").show();
		}
	});
	
	$("#rotateleft").click(function(){
		$("#viewer .pageContainer").css('rotate', $("#viewer .pageContainer").css('rotate')-90);
	});
	
	$("#rotateright").click(function(){
		$("#viewer .pageContainer").css('rotate', $("#viewer .pageContainer").css('rotate')-270);
	});
	
	$.ajax({
		url:basePath + 'SimpleAjaxInvoke?invokeType=4&timestamp=' + new Date().getTime(),
		data:{id:id,vid:vid},
		dataType:'text',
		success:function(data){
			var d = eval(data);
			if(d>0){
				for(var i=0;i<d;i++){
					addPageContainer(i+1);
					getTextAxis(i + 1);
					loadAnnotations(i + 1);
				}
			}
		},
		error:function(e){
			
		}
	});
	
	
}

function getTextAxis(currentPage){
	$.ajax({
		url:basePath + 'SimpleAjaxInvoke?invokeType=5&timestamp=' + new Date().getTime(),
		data:{id:id,pageNo:currentPage},
		dataType:'text',
		success:function(data){
			var d = eval(data);
			if(d&&d.length>0){
				var textAxisLength = textAxis.length;
				for(var i=0;i<d.length;i++){
					textAxis[textAxisLength + i] = new Array();
					textAxis[textAxisLength + i][0]=d[i].x1;
					textAxis[textAxisLength + i][1]=d[i].y1;
					textAxis[textAxisLength + i][2]=d[i].x2;
					textAxis[textAxisLength + i][3]=d[i].y2;
					textAxis[textAxisLength + i][4]=d[i].word;
				}
			}
			
		},
		error:function(e){
			
		}
	});
}

function loadAnnotations(currentPage){
	$.ajax({
		url:basePath + 'SimpleAjaxInvoke?invokeType=12&timestamp=' + new Date().getTime(),
		data:{id:id,pageNo:currentPage},
		dataType:'text',
		success:function(data){
			var annos = $.parseJSON(data);
			if (annos && annos.length > 0) {
				console.info(annos);
				for(o in annos){
					currentTime = annos[o].key;
					pdiv = annos[o].daxis;
					slcBD = annos[o].gaxis;
					curTarget = $("#pageContainer"+currentPage+" .pdfContainer");
					if (annos[o].type == 'TextAnnotation') {
						createTextAnnotation(annos[o].daxis);
					}else if(annos[o].type == 'GraphicAnnotation') {
						paintAnnotation(slcBD);
						
					}else if( annos[o].type == 'LineAnnotation'){
						drawLine = {
							color: slcBD.c,
							width: slcBD.w
						}
						paintLineAnnotation();
					}
					createRightCommentPanel(annos[o]);
					zindex = zindex + 1;
					setDrawType($(".Pan.mdx_btn"));
				}
				
				if (aid != null) {
					initSelectRightCommonPanel(aid);
				}
				drawLine = {
					color: '#0000FF',
					width: '3px'
				}
			}
			
		},
		error:function(e){
			
		}
	});
}

function addPageContainer(pageIndex){
	var viewerDiv=$("#viewer");      
    var pageDiv=$('<div></div>');        
    pageDiv.attr('id','pageContainer'+pageIndex);            
    pageDiv.addClass('pageContainer crosshairMouseIcon');
	renderPDFPage(pageDiv,pageIndex);
    pageDiv.appendTo(viewerDiv);
}

function renderPDFPage(pageDiv,pageIndex){
    var pdfDiv=$("<div></div>");        
    pdfDiv.attr('class','pdfContainer');
    pdfDiv.css({'background-image':'url(img/pdf/'+id+'/'+vid+'/'+pageIndex+'.png)','background-size':'100% auto','height':'1864px'});
    pdfDiv.appendTo(pageDiv);
    
    var overlayContainer=$('<div></div>');        
    overlayContainer.addClass('overlayContainer');
    overlayContainer.appendTo(pageDiv);
    
    var linkContainer=$('<div></div>');        
    linkContainer.addClass('linkContainer');
    linkContainer.appendTo(pageDiv);
}

function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

function pageTextData(x, y) {
	for (var i = 0; i < textAxis.length; i++) {
		var a = textAxis[i];
		var cx = x / 2.3;
		var cy = y / 2.3;
		if (a[0] < cx && a[2] > cx && a[1] < cy && a[3] > cy) {
			return a;
		}
	}
}