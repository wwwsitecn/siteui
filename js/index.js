$(function(){
	$.getJSON('data.json',function(data){
		var len = data.list.length;
		$.each(data.list,function(index,value){
			$(".content_left").append("<div class='uiLeft content_fen_"+index+"'></div>");

			$(".content_fen_"+index).load(value.url+" .wrap"," ",function(){
				var $pre=$(".content_fen_"+index+" pre"),
					prelen=$pre.length;
				for(var i=0;i<prelen;i++){
					var innerHtml = html($pre.eq(i).html());
					$pre.eq(i).addClass("prettyprint linenums");
					$pre.eq(i).empty().html(innerHtml);
				};
				if(index==(len-1)){
					prettyPrint();
				};
			});
		});	
	});
	
	// demo
	// zcDialogDemo1
	$("body").delegate("#zcDialogDemo1","click",function(){
		ZC_GLOBAL.FUN.popDialog.show({
			url:"html/demo/zcDialog.html",
			callbackEnd:function($target){
				alert("加载完回调");
				$(".dialogDemo1 .btnYes").click(function(){
					var $thisBtn = $(this);
					$thisBtn.addClass("zcLoading");
					alert("确认执行方法");
					ZC_GLOBAL.FUN.popConfirm.close($(".dialogDemo1"))
				});
			}
		});
	});
	// zcDialogDemo2
	$("body").delegate("#zcDialogDemo2","click",function(){
		ZC_GLOBAL.FUN.popConfirm.show({
            title: "标题",								// 弹框标题
            info:"提示信息",							// 弹框正文
            btnOkText: "是",							// 确定按钮文字
            btnNoText: "否",							// 否定按钮文字
            btnOkTextDisplay: true,						// 是否显示确定按钮
            btnNoTextDisplay: true,						// 是否显示否定按钮
            addClass: "",								// 自定义样式class类
            coverShow:true,								// 是否显示遮罩
            closeCover : true,							// 关闭时是否关闭遮罩
            closeTarget : 1,							//关闭窗口对象 0:全部窗口  1:本身			
			callbackYes:function($target){ 				// 点击确定执行事件
				alert("点击确定执行事件")
				ZC_GLOBAL.FUN.popConfirm.close($target)
			},
			callbackNo:function($target){				// 点击取消执行事件
				alert("点击取消执行事件")
				ZC_GLOBAL.FUN.popConfirm.close($target)
			},
			callbackEnd:function(){						// 窗口弹出后执行事件
				alert("窗口弹出后执行事件")
			}
		});
	});

	$("body").delegate("#zcDemo3","click",function(){
		ZC_GLOBAL.FUN.zcBubbleTip.show({icon:"fa-paperclip",msg:"冒泡提示信息",times:1000});
	});
});
function html(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


// function htmlEncode(str) {
//     var div = document.createElement("div");
//     div.appendChild(document.createTextNode(str));
//     return div.innerHTML;
// }
// function htmlDecode(str) {
//     var div = document.createElement("div");
//     div.innerHTML = str;
//     return div.innerHTML;
// }
