$(function(){
    // input focus event
    $("body").delegate(".zcInput,.zcTextarea","focusin",function(e){
        var e = e || window.event,
            $this = $(this);
        e.preventDefault();
        if(e.type == 'focusin'){
            $this.removeClass("error").siblings(".verifyMsg").find(".msg").text("");
        };
    });
    // 获取校验码 input event
    $("body").delegate(".zcSmsVeriCode input","focusin focusout",function(e){
        var e = e || window.event,
            $this = $(this);
        e.preventDefault();
        if(e.type == 'focusin'){
            $this.siblings(".zcTips").show();
        }else if(e.type == 'focusout'){
            $this.siblings(".zcTips").hide();
        }
    });    
});