var tagChanged = '';
var allTags = new Array();
//1-DrawArea,2-DrawLine,3-StopDraw
var drawType = 'StopDraw';

var drawLine = {
	color: '#0000FF',
	width: '3px'
}
var drawLineColor = '#0000FF';
var drawLineWidth = '3px';
function setAvailableTags(){
	tagChanged = '1';
	$.ajax({
		url:basePath + 'SimpleAjaxInvoke?invokeType=6&timestamp=' + new Date().getTime(),
		data:{r:'1'},
		dataType:'text',
		success:function(data){
			var d = $.parseJSON(data);
			var tags = new Array();
			if(d){
				for ( var o in d) {
					tags[o] = d[o].name;
				}
			}
			$( "#input-tags" ).autocomplete( "option", "source", tags );
			allTags = tags;
		},
		error:function(e){
			
		}
	});
}

function tagsInit() {
	$.ajax({
		url:basePath + 'SimpleAjaxInvoke?invokeType=6&timestamp=' + new Date().getTime(),
		data:{},
		dataType:'text',
		success:function(data){
			var d = $.parseJSON(data);
			var tags = new Array();
			if(d){
				for ( var o in d) {
					tags[o] = " "+d[o].name;
				}
			}
			$("#input-tags").autocomplete({
				source : tags,
				close : function(event, ui) {
					var cv = $("#input-tags").val();
					var hasExist = '';
					$("#div-annoation-tags span").each(function(){
						if($(this).text()==cv){
							$(this).addClass("selectedtag");
							hasExist = 1;
						}
					});
					if(hasExist == '' && isInDataList(tags,cv)=='1' ){
						$('<span class="spantags">'
										+ $("#input-tags").val()
										+ '<i class="fa fa-times-circle" onclick="deleteTagA(this);"></i></span>')
								.appendTo($("#div-annoation-tags"));
						
						$("#div-annoation-tags span").each(function(){
							$(this).removeClass("selectedtag");
						});
					}
					$("#input-tags").val("");
				}
			});
		},
		error:function(e){
			
		}
	});
	
}

function isInDataList(d,cv){
	var isIn = '';
	if(tagChanged=='1'){
		tagChanged = '';
		d = allTags;
	}
	for(var o in d){
		if(d[o]==cv){
			isIn = '1';
			break;
		}
	}
	$.ajaxSetup({
        async: true
    });
	return isIn;
}

function deleteTagA(t) {
	$(t).parent().remove();
}

function rvsInit() {
	$.ajax({
		url:basePath + 'SimpleAjaxInvoke?invokeType=9&timestamp=' + new Date().getTime(),
		data:{},
		dataType:'text',
		success:function(data){
			var d = $.parseJSON(data);
			var availableRvs = new Array();
			if(d){
				for ( var o in d) {
					availableRvs[o] = " "+d[o].id;
				}
			}
			$("#input-rvs").autocomplete({
				source : availableRvs,
				close : function(event, ui) {
					var cv = $("#input-rvs").val();
					var hasExist = '';
					$("#div-annoation-rvs span").each(function(){
						if($(this).text()==cv){
							$(this).addClass("selectedtag");
							hasExist = 1;
						}
					});
					if(hasExist=='' && isInDataList(availableRvs,cv)=='1'){
						$('<span class="spanrvs">'
								+ $("#input-rvs").val()
								+ '<i class="fa fa-times-circle" onclick="deleteRvs(this);"></i></span>')
						.appendTo($("#div-annoation-rvs"));
						
						$("#div-annoation-rvs span").each(function(){
							$(this).removeClass("selectedtag");
						});
					}
					$("#input-rvs").val("");
				}
			});
		},
		error:function(e){
			
		}
	});
}

function deleteRvs(t) {
	$(t).parent().remove();
}

$(function() {
	$(".addTag .autoselect").click(function(){
		$( "#input-tags" ).autocomplete( "search", " " );
		$( "#input-tags" ).focus();
	});
	
	$(".addRvs .autoselect").click(function(){
		$( "#input-rvs" ).autocomplete( "search", " " );
		$( "#input-rvs" ).focus();
	});
	
	$("#manageTagsDlg").dialog({
		title : 'Tags',
		autoOpen : false,
		resizable : false,
		height : "auto",
		width : 400,
		modal : false,
		buttons : {
			"Ok" : function() {
				setAvailableTags();
				$(this).dialog("close");
				$("#manageTagsDlg").hide();
			}
		}
	});
	
	$(".toolbar .EditTools.mdx_grp_btn button").click(function(){
		setDrawType(this);
	});
})
var selectedAnnoWhenStopDraw;
var openPageDragable = false;
function setDrawType(obj){
	$(".toolbar .EditTools.mdx_grp_btn button").each(function(){
		$(this).removeClass("btnactive");
	});
	$(obj).addClass("btnactive");
	
	$("#annotationmarker_spacer").hide();
	$("#annotationmarker").hide();
	
	$("#linemarker_spacer").removeClass("hide");
	$("#linemarker").removeClass("hide");
	$("#linemarker_spacer").hide();
	$("#linemarker").hide();
	
	if($(obj).attr("class").indexOf("AddAnnotation")>-1){
		drawType = 'DrawArea';
		
		$("#annotationmarker_spacer").show();
		$("#annotationmarker").show();
		
		disableDragAndResize(selectedAnnoWhenStopDraw);
		selectedAnnoWhenStopDraw = null;
		if(openPageDragable == true){
			$("#viewer").draggable("destroy");
			openPageDragable = false;
		}
	}else if($(obj).attr("class").indexOf("StrikeOut")>-1){
		drawType = 'DrawLine';
		
		$("#linemarker_spacer").show();
		$("#linemarker").show();
		
		disableDragAndResize(selectedAnnoWhenStopDraw);
		selectedAnnoWhenStopDraw = null;
		if(openPageDragable == true){
			$("#viewer").draggable("destroy");
			openPageDragable = false;
		}
	}else if($(obj).attr("class").indexOf("Pan")>-1){
		drawType = 'StopDraw';
		$("#viewer").draggable();
		openPageDragable = true;
		$(".overlayContainer").children().each(function(){
			$(this).click(function(){
				disableDragAndResize(selectedAnnoWhenStopDraw);
				enableDragAndResize(this);
				selectedAnnoWhenStopDraw = $(this);
			});
		});
	}
	currentTime = '0';
}

function enableDragAndResize(obj){
	var objKey = '';
	var allCls = $(obj).attr("class");
	if (allCls && allCls.length > 0) {
		var clsArray = allCls.split(' ');
		for (var i = 0; i < clsArray.length; i++) {
			if (clsArray[i].indexOf('slc_') > -1) {
				objKey = clsArray[i].replace('slc_','');
			}else if(clsArray[i].indexOf('txt_') > -1){
				objKey = clsArray[i].replace('txt_','');
			}else if(clsArray[i].indexOf('lin_') > -1){
				objKey = clsArray[i].replace('lin_','');
			}
		}
	}
	initSelectRightCommonPanel(objKey);
	$(obj).draggable();
    $(obj).resizable({handles: "n, e, s, w, ne, se, sw, nw"});
    $(obj).on( "dragstop", function( event, ui ) {dragStopCallback(obj,objKey);} );
    $(obj).on( "resizestop", function( event, ui ) {resizeStopCallback(obj,objKey);} );
}

function dragStopCallback(obj,objKey){
	console.info(objKey+','+$(obj).css('left')+','+$(obj).css('top'));
	var daxis = {
		x : $(obj).css('left').replace('px',''),
		y : $(obj).css('top').replace('px','')
	};
	var data = {
		key: objKey,
		daxis: daxis,
	};
	updateAnnotion(data);
}

function resizeStopCallback(obj,objKey){
	console.info(objKey+','+$(obj).css('left')+','+$(obj).css('top')+','+$(obj).css('width')+','+$(obj).css('height'));
	var daxis = {
		x : $(obj).css('left').replace('px',''),
		y : $(obj).css('top').replace('px',''),
		w : $(obj).css('width').replace('px',''),
		h : $(obj).css('height').replace('px','')
	};
	var data = {
		key: objKey,
		daxis: daxis,
	};
	updateAnnotion(data);
}

function disableDragAndResize(obj){
	if(obj){
		$(obj).draggable("destroy");
	    $(obj).resizable("destroy");
	}
}

function manageTags() {
	$("#manageTagsDlg .tagslist").empty();
	getTags();
	$("#manageTagsDlg").show();
	$("#manageTagsDlg").dialog("open");
}


function getTags() {
	$.ajax({
		url:basePath + 'SimpleAjaxInvoke?invokeType=6&timestamp=' + new Date().getTime(),
		data:{},
		dataType:'text',
		success:function(data){
			var d = $.parseJSON(data);
			if(d){
				for ( var o in d) {
					getTag(d[o]);
				}
			}
		},
		error:function(e){
			
		}
	});
}

function getTag(tag){
	var tagSpan = "";
	tagSpan='<span onclick="selectTag(this);" id="tag_'+tag.id+'" key="'+tag.id+'">'+tag.name+'<i class="fa fa-times-circle" onclick="deleteTag(this);"></i></span>';
	$(tagSpan).appendTo($("#manageTagsDlg .tagslist"));
}

var lastSelectedTag;
function selectTag(tag){
	if(lastSelectedTag){
		$(lastSelectedTag).removeClass("selectedtag");
	}
	$(tag).addClass("selectedtag");
	lastSelectedTag = tag;
	$(".edit.vv_btn").removeClass("opacity65");
}

function preEidtTag() {
	if (lastSelectedTag) {
		$("#m_taginput").val($(lastSelectedTag).text());
	}
}

function storeTag() {
	var tag = {};
	var tagText = trim($("#m_taginput").val());
	var id = "";
	if (lastSelectedTag) {
		id = $(lastSelectedTag).attr("key");
		$(lastSelectedTag).removeClass("selectedtag");
	}
	if (tagText != '') {
		tag = {
			id : id,
			name : tagText
		};
		$.ajax({
			url:basePath + 'SimpleAjaxInvoke?invokeType=7&timestamp=' + new Date().getTime(),
            dataType: "text",
			data:{j:JSON.stringify(tag)},
			success:function(data){
				var tag = $.parseJSON(data);
				if(tag){
					if(tag=='2'){
						BootstrapDialog.show({
					        title: 'Exist Tag',
					        message: 'The tag has been exist.',
					        buttons: [{
					            label: 'Close',
					            action: function(dialogItself) {
					            	dialogItself.close();
					            }
					        }]
					    });
						return;
					}
					$("#m_taginput").val("");
					if(lastSelectedTag){
						$(lastSelectedTag).html(tag.name+'<i class="fa fa-times-circle" onclick="deleteTag(this);"></i>');
						lastSelectedTag = null;
						$(".edit.vv_btn").addClass("opacity65");
					}else{
						getTag(tag);
					}
				}
			},
			error:function(e){
				
			}
		});
		
	}
}

function clearTag(){
	$("#m_taginput").val("");
	$(".edit.vv_btn").addClass("opacity65");
	lastSelectedTag = null;
}

function deleteTag(tag) {
	BootstrapDialog.show({
        title: 'Delete',
        message: 'Are you sure to delete?',
        buttons: [{
            label: 'Delete',
            cssClass: 'btn-warning',
            action: function(dialogItself) {
            	$.ajax({
        			url:basePath + 'SimpleAjaxInvoke?invokeType=8&timestamp=' + new Date().getTime(),
                    dataType: "text",
        			data:{id:$(tag).parent().attr("key")},
        			success:function(data){
        				if($.parseJSON(data)){
        					lastSelectedTag = null;
        					$(tag).parent().remove();
        	            	dialogItself.close();
        				}
        			},
        			error:function(e){
        				
        			}
        		});
            }
        }, {
            label: 'Close',
            action: function(dialogItself) {
            	dialogItself.close();
            }
        }]
    });
}

function onBackBtn(){
	if(come=='home'){
		window.location.href=basePath+"daMessageAction.do?act=logMessageForPDFAnnotation";
	}
}
