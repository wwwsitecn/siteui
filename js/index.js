$(function(){
	$.getJSON('data.json',function(data){
		var len = data.list.length;
		$.each(data.list,function(index,value){
			$(".content_left").append("<div class='uiLeft content_fen_"+index+"'></div>");

			$(".content_fen_"+index).load(value.url+" .wrap"," ",function(){
				var $pre=$(".content_fen_"+index+" pre"),
					prelen=$pre.length;
				for(var i=0;i<prelen;i++){
					var innerHtml = $pre.eq(i).html();
					$pre.eq(i).addClass("prettyprint linenums");
					$pre.eq(i).empty().html(htmlEncode(innerHtml));
				};
				if(index==(len-1)){
					prettyPrint();
				};
			});
		});	
	});
	
});

function htmlEncode(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
function htmlDecode(str) {
    var div = document.createElement("div");
    div.innerHTML = str;
    return div.innerHTML;
}
