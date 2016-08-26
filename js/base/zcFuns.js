ZC_GLOBAL={};
ZC_GLOBAL.FUN = {};
ZC_GLOBAL.FUN.zcCheckbox=function(){
    $("body").delegate(".zcCheckbox input","click",function(){
        var $this = $(this);
        if($this.is(":checked")){
            $this.siblings("i").removeClass("unchecked").addClass("icon icon-checkbox");
        }else{
            $this.siblings("i").removeClass("icon icon-checkbox").addClass("unchecked");
        }
    });
};
ZC_GLOBAL.FUN.zcPayPassword=function(param){
    var params = {
        targetStr: ".zcPayPassword",
        callbackFocus: function () {},
        callbackBlur: function () {},
        callbackDel: function () {},
        callbackEnd: function () {}        
    };
    $.extend(params, param);
    $("body").delegate(params.targetStr+" .pw","keypress keyup click focusout",function(e){
        var $this = $(this),
            $parent = $this.closest(".zcPayPassword"),
            $input = $parent.find("input"),
            val = $input.val(),
            idx = $this.index(),
            passWord = [];
        var e = e || window.event;
        e.preventDefault();
        if(e.type == 'keypress'){
            if ($(e.target).text().length == 0 && idx < 6 && val.length<6 && e.keyCode != 8 ) {
                var k = String.fromCharCode(e.charCode);
                if (/\d/.test(k)) {
                    $this.text("●").addClass('true');
                    if (idx != 5) {
                        $parent.find(".pw").eq(idx).attr('contenteditable', false);
                        $parent.find(".pw").eq(idx+1).attr('contenteditable', true);
                        $parent.find(".pw").eq(idx+1).focus();
                    }else{
                        params.callbackEnd();
                        //$parent.find(".pw").eq(idx).attr('contenteditable', false).focus();
                    }

                    $input.val(val+k);
                    console.log($input.val())
                };
            };
        }else if(e.type == 'keyup'){
            if(e.keyCode == 8){
                if (idx > 0 ){
                    if($this.text().length){
                        $parent.find(".pw").eq(idx).attr('contenteditable', true).addClass("true").text("").focus();
                    }else{
                        $parent.find(".pw").eq(idx).attr('contenteditable', false);
                        $parent.find(".pw").eq(idx-1).attr('contenteditable', true).removeClass("true").text("").focus();
                    }
                }else if(idx==0){
                    $parent.find(".pw").eq(idx).attr('contenteditable', true).removeClass("true").text("").focus();
                }
                $input.val(val.substring(0,val.length-1));
                params.callbackDel();
                
            }else{
                console.log( e.keyCode )
                if ( !((e.keyCode >= 48 && e.keyCode <= 57) || 
                    (e.keyCode >= 96 && e.keyCode <= 105) || 
                    (e.keyCode >= 37 && e.keyCode <= 40) || 
                    (e.keyCode >= 112 && e.keyCode <= 123) || 
                    (e.keyCode >= 8 && e.keyCode <= 46) ||
                    (e.keyCode >= 170 && e.keyCode <= 180) || 
                    e.keyCode == 108 || e.keyCode == 144 || e.keyCode == 145 || e.keyCode == 92 ||e.keyCode == 93
                ) ) {
                    $this.text("");
                    if(val.length==6){
                        $input.val(val.substring(0,val.length-1))
                    }
                }else if(e.keyCode == 93 || e.keyCode == 92){
                    e.preventDefault();
                }
            }
        }else if(e.type == 'click'){
            if(val.length==6){
                $parent.find(".pw").eq(5).focus();
            }
            params.callbackFocus();
        }else if(e.type == 'focusout'){
            params.callbackBlur();
        };
        e.stopPropagation();
    });
};
ZC_GLOBAL.FUN.getVerificationCode=function(param) {
    var params = {
        seconds: 60,
        $target : "",
        callbackEnd: function () {}        
    };
    $.extend(params, param);
    var countdown = params.seconds,
        $this = params.$target;

    if (countdown == 0) {
        $this.removeClass("disabled");
        $this.text("重新获取");
        params.callback($this);
        clearTimeout(window[$this.attr("data-timesid")]);
    } else {
        if(!$this.attr("data-timesid")){
            $this.attr("data-timesid",("td_" + new Date().getTime()) );
        }
        $this.text(countdown + "秒");
        if ($this.siblings(".smsVeriCode").attr("disabled") == "disabled") {
            $this.siblings(".smsVeriCode").removeAttr("disabled");
        };
        countdown--;
        var param = {
            seconds: countdown,
            $target : $this,
            callbackEnd: params.callbackEnd       
        };
        window[$this.attr("data-timesid")] = setTimeout(function () {
            ZC_GLOBAL.FUN.getVerificationCode(param)
        }, 1000);
    }
};
ZC_GLOBAL.FUN.zcTimeOutDown=function(param) {
    var params = {
        seconds: 60,
        $target : "",
        textAfter: "",
        textBefore: "",
        callbackEnd: function () {}        
    };
    $.extend(params, param);

    if (params.seconds == 0) {
        params.callbackEnd();
        clearTimeout(window[params.$target.attr("data-timesid")]);
    } else {
        if(!params.$target.attr("data-timesid")){
            params.$target.attr("data-timesid",("td_" + new Date().getTime()) );
        }
        params.$target.text(params.textBefore+params.seconds+params.textAfter)
        params.seconds--;
        var param = {
            seconds: params.seconds,
            $target : params.$target,
            textAfter: params.textAfter,
            textBefore: params.textBefore,
            callbackEnd: params.callbackEnd       
        };
        window[params.$target.attr("data-timesid")]=setTimeout(function () {
            ZC_GLOBAL.FUN.zcTimeOutDown(param)
        }, 1000);
    }
};
/**
 * dialog信息弹框
 *
 * @param {object}      param               参数对象
 * @param {string}      param.url           页面地址
 * @param {string}      param.data          参数数据
 * @param {boolean}     param.coverShow     是否关闭遮罩层
 * @param {num}         param.closeTarget   关闭对象
 * @param {boolean}     param.closeCover    是否关闭遮罩层
 * @param {function}    param.callback      打开后回调方法
 *
 */
ZC_GLOBAL.FUN.popDialog = {
    show: function (param) {
        // default param
        var params = {
            url : "",
            data : "",
            coverShow : true,
            closeTarget : 1,//0:全部窗口  1:本身
            closeCover : true,
            callbackEnd : function () {}
        };
        // extend param
        $.extend(params, param);
        // create relate dom
        var $body = $("body"),
            $popBox = $('<div class="zcPopBox"></div>'),
            $popCover = $body.find(".zcPopCover");
        
        if( params.coverShow ){
            if (!$popCover.length) {
                var $popCover = $('<div class="zcPopCover" style="display: none"></div>');
                $body.append($popCover).append($popBox);
            } else {
                $body.append($popBox);
            }
        }else{
            $body.append($popBox);
        };
        $popBox.attr({"id":("dialog" + new Date().getTime()),"data-closetarget":params.closeTarget,"data-closecover":params.closeCover});
        $popBox.load(params.url, params.data, params.callbackEnd);
        if( params.coverShow ){
            $popCover.show();
        };
        $popBox.show();
        $popBox.delegate('.btnClose,.btnNo',"click",function () {
            ZC_GLOBAL.FUN.popDialog.close($(this).closest(".zcPopBox"));
        });
        //禁止滚动方法所用 WinScrollEvent
        ZC_GLOBAL.winScrollTop = $(document).scrollTop();
    },
    close: function ($target) {
        var $popBox = $(".zcPopBox"),
            $popCover = $(".zcPopCover"),
            closeCover = $target.attr("data-closecover");
            closeTarget = $target.attr("data-closetarget");

        if(closeTarget==1){
            if($popBox.length==1){
                $target.remove();            
                if(closeCover=="true"){
                    $popCover.hide();
                };
            }else if( $target.length>1 ){
                $target.remove();
                $popCover.hide();
            }else if($popBox.length>1 && $target.length==1){
                $target.remove();
                if(closeCover=="true"){
                    $popCover.hide();
                };
            };
        }else{
            $popBox.remove();
            $popCover.hide();
        };
    }
};
/**
 * 模拟原生confirm信息弹框
 *
 * @param {object}   param                  参数对象
 * @param {string}   param.title            标题文字
 * @param {string}   param.info             说明文字
 * @param {boolean}  param.btnOkText        确定按钮文字
 * @param {boolean}  param.btnNoText        否定按钮文字
 * @param {string}   param.addClass         自定义样式类
 * @param {boolean}  param.coverShow        显示遮罩
 * @param {boolean}  param.closeCover       关闭遮罩
 * @param {num}      param.closeTarget      弹框关闭对象
 * @param {function} param.callbackYes      确定触发后回调方法
 * @param {function} param.callbackNo       否定触发后回调方法
 * @param {function} param.callbackEnd      弹框显示后回调方法
 *
 */
ZC_GLOBAL.FUN.popConfirm = {
    show: function (param) {
        // default param
        var params = {
            title: "提示",
            info: "",
            btnOkText: "是",
            btnNoText: "否",
            btnOkTextDisplay: true,
            btnNoTextDisplay: true,
            addClass: "",
            coverShow:true,
            closeCover : true,
            closeTarget : 1,//0:全部窗口  1:本身
            callbackYes:function(){},
            callbackNo:function(){},
            callbackEnd:function(){}
        };
        // extend param
        $.extend(params, param);
        // create relate dom
        var $body = $("body"),
            $popCover = $body.find(".zcPopCover"),
            popBox = "";
        popBox += '<div class="zcPopBox">';
        popBox += '    <div class="zcDialog zcDialogConfirm ' + params.addClass + '">';
        popBox += '        <a class="btnClose" href="javascript:">×</a>';
        popBox += '        <h2 class="dialogT">' + params.title + '</h2>';
        popBox += '        <div class="dialogC">';
        popBox += '            <div class="info">' + params.info + '</div>';
        popBox += '        </div>';
        popBox += '        <div class="dialogB">';
        popBox += '            <div class="cont">';
        if (params.btnOkTextDisplay) {
            popBox += '                <a href="javascript:;" class="zcBtn btnBlue btnYes"><span class="text">' + params.btnOkText + '</span><span class="ing"></span></a>';
        };
        if (params.btnNoTextDisplay) {
            popBox += '                <a href="javascript:;" class="zcBtn btnWhite btnNo">' + params.btnNoText + '</a>';
        }
        popBox += '            </div>';
        popBox += '        </div>';
        popBox += '    </div>';                                           
        popBox += '</div>';
        $popBox = $(popBox);
        
        $popBox.attr({"id":("confirm" + new Date().getTime()),"data-closetarget":params.closeTarget,"data-closecover":params.closeCover});

        if( params.coverShow ){
            if (!$popCover.length) {
                var $popCover = $('<div class="zcPopCover" style="display: none"></div>');
                $body.append($popCover).append($popBox);
            } else {
                $body.append($popBox);
            };
        }else{
            $body.append($popBox);
        };
        if( params.coverShow ){
            $popCover.show();
        };
        $popBox.show();
        // "btnYes" click event
        $popBox.delegate(".btnYes","click",function () {
            $(this).addClass("zcLoading");
            params.callbackYes( $(this).closest(".zcPopBox") );
        });
        // "popNo" click event
        $popBox.delegate(".btnNo","click",function () {
            params.callbackNo($(this).closest(".zcPopBox"));
        });
        // "popClose" click event
        $popBox.delegate(".btnClose","click",function () {
            ZC_GLOBAL.FUN.popConfirm.close($(this).closest(".zcPopBox"));
        });
        // callbackEnd
        params.callbackEnd($popBox);
        ZC_GLOBAL.winScrollTop = $(document).scrollTop();//禁止滚动方法所用 WinScrollEvent
    },
    close: function ($target) {
        var $popBox = $(".zcPopBox"),
            $popCover = $(".zcPopCover"),
            closeCover = $target.attr("data-closecover");
            closeTarget = $target.attr("data-closetarget");

        if(closeTarget==1){
            if($popBox.length==1){
                $target.remove();            
                if(closeCover=="true"){
                    $popCover.hide();
                };
            }else if( $target.length>1 ){
                $target.remove();
                $popCover.hide();
            }else if($popBox.length>1 && $target.length==1){
                $target.remove();
                if(closeCover=="true"){
                    $popCover.hide();
                };
            };
        }else{
            $popBox.remove();
            $popCover.hide();
        };
    }
};

/**
 * 冒泡提示信息
 *
 * @param {object}   param          参数对象
 * @param {string}   param.msg      提示信息文字
 * @param {string}   param.icon     显示的icon图标“class”名称
 * @param {number}   param.times    自动关闭时间
 * @param {function} param.callback 关闭后执行的回调方法
 *
 */
ZC_GLOBAL.FUN.zcBubbleTip = {
    show: function (param) {
        // default param
        var params = {
            icon:"",
            msg:"",
            coverShow: false
        };
        $.extend(params, param);
        if (!params.msg) {
            return false;
        }
        // create relate dom
        var $body = $("body"),
            $popCover = $body.find(".zcPopCover"),
            pop="";
        pop += '    <div class="zcBubbleTip">';
        pop += '      <i class="icon ' + params.icon + '"></i>';
        pop += '      <span class="text">' + params.msg + '</span>';
        pop += '    </div>';
        $pop = $(pop);

        if (params.coverShow) {
            if (!$popCover.length) {
                var $popCover = $('<div class="zcPopCover"></div>');
                $body.append($popCover);
            }
        };
        $body.append($pop);

        $pop.css({"margin-top":"-"+($pop.height()/2)+"px","margin-left":"-"+($pop.width()/2)+"px"}).css("display","inline-block");
        ZC_GLOBAL.winScrollTop = $(document).scrollTop();//禁止滚动方法所用 WinScrollEvent
        // close event
        ZC_GLOBAL.FUN.zcBubbleTip.close(params);
    },
    close: function (params) {
        setTimeout(function(){
            $(".zcBubbleTip").remove();
        },params.times)
    }
};