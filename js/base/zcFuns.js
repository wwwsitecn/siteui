ZC_GLOBAL={};
ZC_GLOBAL.FUN = {};
ZC_GLOBAL.FUN.getData = function(params) {
    var defaults = {
        url: "",
        contentType : "",
        dataType:"json",
        param:"",
        callBackSuccess: function () {},
        //callBackFail: function () {},
        relogin:false
    };
    $.extend(defaults, params);

    if (defaults.contentType == "json") {
        var contentType = "application/json; charset=utf-8";
    } else if (defaults.contentType == "multipart") {
        var contentType = "multipart/form-data";
    } else {
        var contentType = "application/x-www-form-urlencoded; charset=UTF-8";
    };

    $.ajax({
        type: "POST",
        url: defaults.url,
        dataType: defaults.dataType,
        data: defaults.param,
        contentType: contentType,
        success: function (msg) {
            if (msg.status == -1) {
                if (!defaults.relogin) {
                    // ZC_GLOBAL.FUN.zcBubbleTip.show({
                    //     msg: "登录超时",
                    //     icon: "icon-warnning-02",
                    //     coverShow: false,
                    //     times: 1000
                    // });
                    setTimeout(function () {
                        location.href = "pageLogin.html?url=" + encodeURIComponent(window.location.href);
                    }, 1000);
                } else {
                    if (typeof defaults.relogin == "function") {
                        defaults.relogin(msg);
                    }
                }
            } else {
                if (defaults.callBackSuccess && typeof defaults.callBackSuccess == "function") {
                    defaults.callBackSuccess(msg);
                }
            };
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //console.log(XMLHttpRequest);
            //console.log(textStatus);
            //console.log(errorThrown);
            
            if (defaults.callBackFail && typeof defaults.callBackFail == "function") {
                defaults.callBackFail(XMLHttpRequest, textStatus, errorThrown);
            } else {
                ZC_GLOBAL.FUN.zcBubbleTip.show({
                    msg: "站场出现小问题，请稍后再试",
                    icon: "<i class='icon icon-cross'>&#xe620;</i>",
                    coverShow: false,
                    times: 1500
                });
            }
        }
    });
};
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

    $("body").delegate(params.targetStr+" input","click",function(e){    
        $(this)[0].type = "password"
    });
    $("body").delegate(params.targetStr+" input","focus",function(e){    
        var $this = $(this),
            idx = $this.attr("data-idx"),
            _thisi = $this.siblings("span.clear").find('i'),
            $cur = $this.siblings("span.clear").find('.cur');
        if($this.attr('data-busy') === '0'){ 
            //在第一个密码框中添加光标样式
            $cur.css('display','block');
            _thisi.eq(idx).addClass("active");
            $this.attr('data-busy','1');
            $this.parent().removeClass("error");
            params.callbackFocus();
        };
    });
    //change时去除输入框的高亮，用户再次输入密码时需再次点击
    $("body").delegate(params.targetStr+" input","change",function(e){
        var $this = $(this),
            idx = $this.attr("data-idx"),
            _thisi = $this.siblings("span.clear").find('i'),
            $cur = $this.siblings("span.clear").find('.cur');
        $cur.css('display','none');
        _thisi.eq(idx).removeClass("active");
        $this.attr('data-busy','0');
    });
    $("body").delegate(params.targetStr+" input","focusout",function(e){
        var $this = $(this),
            idx = $this.attr("data-idx"),
            _thisi = $this.siblings("span.clear").find('i'),
            $cur = $this.siblings("span.clear").find('.cur');
        $cur.css('display','none');
        _thisi.eq(idx).removeClass("active");                  
        $this.attr('data-busy','0');
        params.callbackBlur();
    });

    //使用keyup事件，绑定键盘上的数字按键和backspace按键
    $("body").delegate(params.targetStr+" input","keyup",function(e){
        var $this = $(this),
            _thisi = $this.siblings("span.clear").find('i'),
            $cur = $this.siblings("span.clear").find('.cur');
        var  e = (e) ? e : window.event;    
        //键盘上的数字键按下才可以输入
        if(e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)){
            k = $this.val().length;//输入框里面的密码长度
            l = 6;//6
            console.log(k)
            for(;l--;){
                //输入到第几个密码框，第几个密码框就显示高亮和光标（在输入框内有2个数字密码，第三个密码框要显示高亮和光标，之前的显示黑点后面的显示空白，输入和删除都一样）
                if(l === k){
                    console.log(_thisi.eq(l).length)
                    _thisi.eq(l).addClass("active");
                    _thisi.eq(l).find('b').css('display','none');
                    
                }else{
                    _thisi.eq(l).removeClass("active");
                    _thisi.eq(l).find('b').css('display', l < k ? 'block' : 'none');
                };             
            
                if(k === 6){
                    $this.attr("data-idx",5);
                    $this.blur();
                    params.callbackEnd();
                }else{
                    $this.attr("data-idx",k);
                    $cur.css('left',k*38+'px');
                };
            };
            params.callbackDel();
        }else{
            //输入其他字符，直接清空
            var _val = $this.val();
            $this.val(_val.replace(/\D/g,''));            
        };
    }); 
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
            ZC_GLOBAL.FUN.popDialog.close($(this).closest(".zcPopBox"),$(this));
        });
        //禁止滚动方法所用 WinScrollEvent
        ZC_GLOBAL.winScrollTop = $(document).scrollTop();
    },
    close: function ($target,$clickTarget) {
        var $popBox = $(".zcPopBox"),
            $popCover = $(".zcPopCover"),
            closeCover = $target.attr("data-closecover");
            closeTarget = $target.attr("data-closetarget");
        if(typeof $clickTarget!="undefined" && ($clickTarget.hasClass("btnClose") || $clickTarget.hasClass("btnNo") )){
            $popBox.remove();
            $popCover.hide();
        }else{
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
            btnCloseDisplay: true,
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
        if(params.btnCloseDisplay){
            popBox += '        <a class="btnClose" href="javascript:">×</a>';
        };
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
            coverShow: false,
            times:1000
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
        pop += params.icon;
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
            $(".zcBubbleTip:not(.disabled)").remove();
            // default callback
            if (params.callback && typeof params.callback == "function") {
                params.callback($pop);
            }
        },params.times)
    }
};

ZC_GLOBAL.FUN.getVeriCode = {
    get:function(param){
        var params = {
            url:"",
            param:"",
            $target : ""
        };
        $.extend(params, param);
        params.$target.addClass("zcLoading");
        ZC_GLOBAL.FUN.getData({
            url: params.url,
            param:params.param,
            callBackSuccess: function (msg) {
                var status = msg.status,
                    data = msg.data;
                if (status == 0) {
                    params.$target.addClass("disabled");
                    params.$target.siblings("input").removeAttr("disabled");
                    ZC_GLOBAL.FUN.getVeriCode.timedown({$target:params.$target});
                } else {
                    ZC_GLOBAL.FUN.zcBubbleTip.show({msg: "加载异常", icon: "<i class='icon icon-cross'>&#xe620;</i>", times: 500, coverShow: false});
                };
                params.$target.removeClass("zcLoading");
            }
        });
    },
    timedown: function (param) {
        var params = {
            seconds: 60,
            $target : ""
        };
        $.extend(params, param);
        var countdown = params.seconds,
            $this = params.$target;

        if (countdown == 0) {
            ZC_GLOBAL.FUN.getVeriCode.clear($this,params.callbackEnd)
        } else {
            if(!$this.attr("data-timesid")){
                $this.attr("data-timesid",("td_" + new Date().getTime()) );
            }
            $this.find(".text").text(countdown + "秒");
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
                ZC_GLOBAL.FUN.getVeriCode.timedown(param)
            }, 1000);
        }
    },
    clear: function ($target) {
        $target.removeClass("disabled");
        $target.find(".text").text("重新获取");
        clearTimeout(window[$target.attr("data-timesid")]);
    }
};
/* zcCheckTel */
ZC_GLOBAL.FUN.checkTel=function(tel) {
    var reg = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/);
    return reg;
};
/* zcCheckMail */
ZC_GLOBAL.FUN.checkMail=function(mail) {
    var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    return reg.test(mail);
}
/* 获取地址栏参数值 */
ZC_GLOBAL.FUN.getUrlParam=function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return "";
}
//判断值是否为空,空(false)不为空(true)
ZC_GLOBAL.FUN.isNull = function(val) {
    var exp = val;
    return exp == null || typeof(exp) == "undefined" || $.trim(exp).length == 0 || $.trim(exp) == "";
}
// 密码强度
ZC_GLOBAL.FUN.pwStrength ={
    init:function(){
        $("body").delegate(".zcPassword","keyup",function(){
            var $this = $(this),
                $strengthMap = $this.siblings(".zcPwStrength"),
                val = $this.val();
            ZC_GLOBAL.FUN.pwStrength.check($this,$strengthMap,val)
        });
    },
    check:function($this,$strengthMap,val){
        var lv = 0, x = 0, y = 0, z = 0;
        if (val.match(/[A-Za-z]/g)) {
            x = 1;
        }
        if (val.match(/[0-9]/g)) {
            y = 1;
        }
        if (val.match(/[^A-Za-z0-9]/g)) {
            z = 1;
        };
        lv = x + y + z;
        $this.attr("data-lv", lv);
        if (val.length < 6) {
            lv = 0;
            $strengthMap.hide();
        }

        if (lv == 1) {
            console.log(lv)
            $strengthMap.hide();
            return false;
        }
        if (val.length >= 6 && val.length <= 10 && lv == 2) {
            $strengthMap.css("display","inline-block");
            $strengthMap.removeAttr("class").addClass("zcPwStrength strengthLv1");
            $this.removeClass("error").siblings(".verifyMsg").find(".msg").hide();
            return true;
        }
        if (val.length > 10 && val.length <= 20 && lv == 2) {
            $strengthMap.css("display","inline-block");
            $strengthMap.removeAttr("class").addClass("zcPwStrength strengthLv2");
            $this.removeClass("error").siblings(".verifyMsg").find(".msg").hide();
            return true;
        }
        if (val.length >= 6 && val.length <= 20 && lv == 3) {
            $strengthMap.css("display","inline-block");
            $strengthMap.removeAttr("class").addClass("zcPwStrength strengthLv3");
            $this.removeClass("error").siblings(".verifyMsg").find(".msg").hide();
            return true;
        }
    }
};


// 固定电话正则
ZC_GLOBAL.FUN.regularFixedTel=function(tel) {
    var reg =tel.match(/^0\d{2,3}-?\d{7,8}$/);
    return reg;
};
// 查找数字
ZC_GLOBAL.FUN.checkNumber=function(str) {
    var pattern = new RegExp(/\d+/);
    var reg = pattern.test(str);
    console.log(reg)
    return reg;
};
// 查找汉字
ZC_GLOBAL.FUN.checkChinese=function(str) {
    var pattern = new RegExp("[\u4e00-\u9fa5]");
    var reg = pattern.test(str);
    console.log(reg)
    return reg;
};
// 查找字母
ZC_GLOBAL.FUN.checkEnglish=function(str) {
    var pattern = new RegExp("[A-Za-z]");
    var reg = pattern.test(str);
    console.log(reg)
    return reg;
};
// 查找字符
ZC_GLOBAL.FUN.checkSpecialChar=function(str) {
    var pattern = new RegExp("[`~!@#$^&*()_=|':;,\\[\\]\\+\\%\\-.<>/?~！￥……（）—{}【】‘；：”“。，、？]");
    var reg = pattern.test(str);
    console.log(reg)
    return reg;
};
// 身份证校验
ZC_GLOBAL.FUN.checkCardId=function(socialNo) {
    if (socialNo == "") {
        //alert("输入身份证号码不能为空!");
        return (false);
    }
    //if (socialNo.length != 15 && socialNo.length != 18)
    if (socialNo.length != 18) {
        //alert("输入身份证号码格式不正确!");
        return (false);
    }

    var area = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };

    if (area[parseInt(socialNo.substr(0, 2))] == null) {
        //alert("身份证号码不正确(地区非法)!");
        return (false);
    }

    if (socialNo.length == 15) {
        pattern = /^\d{15}$/;
        if (pattern.exec(socialNo) == null) {
            //alert("15位身份证号码必须为数字！");
            return (false);
        }
        var birth = parseInt("19" + socialNo.substr(6, 2));
        var month = socialNo.substr(8, 2);
        var day = parseInt(socialNo.substr(10, 2));
        switch (month) {
            case '01':
            case '03':
            case '05':
            case '07':
            case '08':
            case '10':
            case '12':
                if (day > 31) {
                    //alert('输入身份证号码不格式正确!');
                    return false;
                }
                break;
            case '04':
            case '06':
            case '09':
            case '11':
                if (day > 30) {
                    //alert('输入身份证号码不格式正确!');
                    return false;
                }
                break;
            case '02':
                if ((birth % 4 == 0 && birth % 100 != 0) || birth % 400 == 0) {
                    if (day > 29) {
                        //alert('输入身份证号码不格式正确!');
                        return false;
                    }
                } else {
                    if (day > 28) {
                        //alert('输入身份证号码不格式正确!');
                        return false;
                    }
                }
                break;
            default:
                //alert('输入身份证号码不格式正确!');
                return false;
        }
        var nowYear = new Date().getYear();
        if (nowYear - parseInt(birth) < 15 || nowYear - parseInt(birth) > 100) {
            //alert('输入身份证号码不格式正确!');
            return false;
        }
        return (true);
    }

    var Wi = new Array(
        7, 9, 10, 5, 8, 4, 2, 1, 6,
        3, 7, 9, 10, 5, 8, 4, 2, 1
    );
    var lSum = 0;
    var nNum = 0;
    var nCheckSum = 0;

    for (i = 0; i < 17; ++i) {


        if (socialNo.charAt(i) < '0' || socialNo.charAt(i) > '9') {
            //alert("输入身份证号码格式不正确!");
            return (false);
        }
        else {
            nNum = socialNo.charAt(i) - '0';
        }
        lSum += nNum * Wi[i];
    }


    if (socialNo.charAt(17) == 'X' || socialNo.charAt(17) == 'x') {
        lSum += 10 * Wi[17];
    }
    else if (socialNo.charAt(17) < '0' || socialNo.charAt(17) > '9') {
        //alert("输入身份证号码格式不正确!");
        return (false);
    }
    else {
        lSum += ( socialNo.charAt(17) - '0' ) * Wi[17];
    }


    if ((lSum % 11) == 1) {
        return true;
    }
    else {
        //alert("输入身份证号码格式不正确!");
        return (false);
    }

};

ZC_GLOBAL.FUN.checkBlank=function(str) {
    if (str.indexOf(" ") == -1) {
        return false;
    } else {
        return true;
    };
};
// 银行卡校验
ZC_GLOBAL.FUN.checkBankNum=function(bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1);//取出最后一位（与luhm进行比较）

    var first15Num = bankno.substr(0, bankno.length - 1);//前15或18位
    var newArr = [];
    for (var i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = [];  //奇数位*2的积 <9
    var arrJiShu2 = []; //奇数位*2的积 >9

    var arrOuShu = [];  //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) {//奇数位
            if (parseInt(newArr[j]) * 2 < 9)
                arrJiShu.push(parseInt(newArr[j]) * 2);
            else
                arrJiShu2.push(parseInt(newArr[j]) * 2);
        }
        else //偶数位
            arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = [];//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = [];//奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算Luhm值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhm = 10 - k;

    if (lastNum == luhm) {

        return true;
    }
    else {

        return false;
    }

}
// 长度计算，中文一个字符长度，英文0.5个字符长度
ZC_GLOBAL.FUN.cnlength = function (val) {
    return val.replace(/[^\x00-\xff]/g, 'xx').length / 2.0
};


ZC_GLOBAL.FUN.zcSelect=function(param){
    $("body").delegate(".zcSelect:not(.disabled)","click",function(event){
        //alert("sdfsdf")
        var $this = $(this),
            types = $(this).attr('data-type'),
            $selected = $this.find('.selected');
            thisWidth = $this.width(); /* radio:单选;checkbox:复选*/
        if($selected.text() != ''){
            $this.find('.selectLabel').html($selected.text()).removeClass('defaultColor');
            $this.find('.inputSelect').val($selected.attr('selectid'));
        }else{
            //$this.find('.selectLabel').html('请选择').addClass('defaultColor');
            $this.find('.inputSelect').val('');
        };

        var ul = $this.find('ul');
        //alert(ul.is(":visible"))
        if(!ul.is(":visible")){
            $(".zcSelect ul").hide();
            //console.log("show")
            ul.show();
        }else{
            $(".zcSelect ul").hide();
            //console.log("hide")
            ul.hide();
        };              
        //event.stopPropagation();    //  阻止事件冒泡   
    });
    $("body").delegate('.zcSelect ul',"click",function(event){
        event.stopPropagation();
    });
    $("body").delegate('.zcSelect li:not(.disabled)',"click",function(event){
        var txt,value;
        var $this = $(this),
            $zcSelect = $this.closest(".zcSelect"),
            types = $zcSelect.attr('data-type');
        if(types == 'radio'){
            txt = $this.text();
            $this.addClass('selected').siblings('li').removeClass('selected');
            $zcSelect.find('.selectLabel').html(txt);
            value = $this.attr('selectid');
            $zcSelect.find('.inputSelect').attr('value',value);
            $zcSelect.find('ul').hide();
            if(value != '0'){
                $zcSelect.removeClass("error").find('.selectLabel').removeClass('defaultColor');
            }else{
                $zcSelect.find('.selectLabel').addClass('defaultColor');
            }
        }else{
            var tLst = '',
                valLst = '';
            $this.removeClass('selected');
            $zcSelect.find('input[type="checkbox"]:checked').each(function(){
                txt = $this.parent().text();
                value = $this.parents('li').attr('selectid');
                $this.parents('li').addClass('selected');
                tLst += txt + ',';
                valLst += value +',';
            });
            $zcSelect.find('.selectLabel').html(tLst);
            $zcSelect.find('.inputSelect').attr('value',valLst);
            if(value != '0'){
                $zcSelect.removeClass("error").find('.selectLabel').removeClass('defaultColor');
            }else{
                $zcSelect.find('.selectLabel').addClass('defaultColor');
            }
        };
        event.stopPropagation();
    });
    $(document).click(function(e){
        var $target = $(e.target);
        if( !(($target.hasClass("zcSelect") || $target.closest(".zcSelect").length)) ){
            $(".zcSelect ul").hide();
        };
        e.stopPropagation();
    });
};
// 问题栏目 点击 预览大图
ZC_GLOBAL.FUN.zcImgPreview=function(data, idx, appendTarget, callback) {
    var len = data.length,
        html = "";
    if (!$("#zcImgPreview").length) {
        html += '<div class="zcImgPreview" id="zcImgPreview">';
        html += '            <div class="hd">';
        html += '                <ul class="list">';
        html += '                </ul>';
        html += '                <span class="pageState"></span>';
        html += '            </div> ';
        html += '    <span class="close">×</span>';
        html += '    <a href="javascript:;" class="btn prev"><</a>';
        html += '    <div class="bd">';
        html += '        <ul class="list">';
        html += '        </ul>';
        html += '    </div>';
        html += '    <a href="javascript:;" class="btn next">></a>';
        html += '</div>';

        if (typeof appendTarget == "undefined") {
            $("body").append(html);
        } else {
            $(appendTarget).eq(0).append(html);
        };
        if (callback && typeof callback == "function") {
            callback();
        };
    };
    html = "";
    for (var i = 0; i < len; i++) {
        html += '<li class="imgWrap"><span data-x="0" data-y="0" class="drag"><img draggable="false" src="' + data[i] + '" /><div class="imgcover"></div></span></li>';
    };
    $("#zcImgPreview").find(".bd .list").empty().html(html);
    $("html,body").addClass("overflowHidden");
    $("#zcImgPreview").find(".bd,.imgWrap").width($(window).width()).height($(window).height()).css("line-height", $(window).height() + "px");
    $("#zcImgPreview").slide({
        titCell: ".hd ul li",
        mainCell: ".bd .list",
        autoPage: false,
        defaultIndex: idx,
        effect: "left",
        scroll: 1,
        vis: 1,
        pnLoop: false,
        trigger: "click"
    });
    $("#zcImgPreview").fadeIn(200);
    $("#zcImgPreview").find(".close").click(function () {
        $("#zcImgPreview").fadeOut(200);
        setTimeout(function () {
            $("html,body").removeClass("overflowHidden");
        }, 100);
        setTimeout(function () {
            $("#zcImgPreview").remove();
        }, 200);
    });
    // 鼠标mousedown
    $("#zcImgPreview").delegate(".drag","mousedown",function(e){
        var $this = $(this),
            dom= $this.parent().get(0);
        $this.addClass("cursorMouseKeydown");
        // $this.attr("data-move",false);
        $this.attr("data-down",true);
        $this.attr("data-x",e.clientX);
        $this.attr("data-y",e.clientY);
        $this.attr("data-top",dom.scrollTop);
        $this.attr("data-left",dom.scrollLeft);
        console.log("data-x="+e.clientX+"data-y="+e.clientY+"data-top="+dom.scrollTop+"data-left="+dom.scrollLeft)
    });
    // 鼠标mouseup
    $("#zcImgPreview").delegate(".drag","mouseup",function(e){
        var $this = $(this);
        $this.removeClass("cursorMouseKeydown").attr("data-down",false);
        e && e.preventDefault();
    });
    // 鼠标mousemove
    $("#zcImgPreview").delegate(".drag","mousemove",function(e){
        e && e.preventDefault();

        var $this = $(this);
        if( $this.attr("data-down")=="true" ){
            var x = $this.attr("data-x") - e.clientX,
                y = $this.attr("data-y") - e.clientY,
                dom = $this.parent().get(0);
            dom.scrollLeft = (parseInt($this.attr("data-left")) + x);
            dom.scrollTop = (parseInt($this.attr("data-top")) + y);
        }
    });
};
// 文本/域字数限制
ZC_GLOBAL.FUN.inputLimitFun=function(){
    $("body").delegate(".zcInputLimit input,.zcInputLimit textarea", "focusin keyup", function (e) {
        var $thisInput = $(this),
            minsize =  $thisInput.attr("data-minsize"),
            maxsize =  $thisInput.attr("data-maxsize"),
            maxsizecan = $thisInput.attr("data-maxsizecan"),
            $output = $thisInput.siblings(".outputInfo");
        
        if( e.type == "focusin"){
            // var len = $thisInput.val().length;
            // $output.find("i").text(len);
            // if( (len < minsize && len!=0) || len > maxsize ){
            //     $output.addClass("error");
            //     $thisInput.addClass("error");
            // };
            $output.removeClass("error");
        }else if(e.type == "keyup" ){
            var val = $thisInput.val(),
                len = val.length;
            // 可以超出
            if( typeof maxsizecan!="undefined" && maxsizecan=="true" ){
                if( len < minsize || len > maxsize ){
                    $output.addClass("error");
                    $thisInput.addClass("error");
                }else{
                    $output.removeClass("error");
                    $thisInput.removeClass("error");
                }
            }else{
                if( len < minsize && len!=0 ){
                    $output.addClass("error");
                    $thisInput.addClass("error");
                }else if( len >= minsize ){
                    $output.removeClass("error");
                    $thisInput.removeClass("error");
                    if( len > maxsize ){
                        var trimmedtext=val.substring(0, maxsize);
                        $thisInput.val(trimmedtext);
                    }
                };
            };
            $output.find("i").text($thisInput.val().length);
        };
    });
};
// 获取json 对象 长度
ZC_GLOBAL.FUN.getJsonLen=function(jsonObj) {
    var Length = 0;
    for (var item in jsonObj) {
        Length++;
    }
    return Length;
};
// 日期选择
ZC_GLOBAL.FUN.zcDateSelect={
    // 属性设置
    option:function(param){
        var params = {};
        $.extend(params, param);
        // 最大年
        if(typeof params.maxY!="undefined"){
            $(params.target).attr("data-maxy",params.maxY);
        }else{
            $(params.target).removeAttr("data-maxy");
        };
        // 最大月
        if(typeof params.maxM!="undefined"){
            $(params.target).attr("data-maxm",params.maxM);
        }else{
            $(params.target).removeAttr("data-maxm");
        };
        // 最小年
        if(typeof params.minY!="undefined"){
            $(params.target).attr("data-miny",params.minY);
        }else{
            $(params.target).removeAttr("data-miny");
        };
        // 最小月
        if(typeof params.minM!="undefined"){
            $(params.target).attr("data-minm",params.minM);
        }else{
            $(params.target).removeAttr("data-minm");
        }; 
    },
    show:function(param){
        var params = {
                onClose: function(){}
            };
        // extend param
        $.extend(params, param);
        // 目标点击事件
        $(params.target).click(function(event){
            var $this = $(this),
                x =  $this.offset().left,
                y =  $this.offset().top,
                w = $this.outerWidth(),
                h = $this.outerHeight(),
                dataY = $this.attr("data-y"),
                dataM = $this.attr("data-m"),
                dataMaxY = $this.attr("data-maxy"),
                dataMaxM = $this.attr("data-maxm"),
                dataMinY = $this.attr("data-miny"),
                dataMinM = $this.attr("data-minm"),
                html = "";

            if(!$this.attr("data-timesid")){
                $(".zcDateSelect").remove();
                $this.attr("data-timesid",("td_" + new Date().getTime()) );
            }else{
                if( $(".zcDateSelect").length && $(".zcDateSelect").attr("id")!=$this.attr("data-timesid") ){
                    $(".zcDateSelect").remove();
                };
            };
            html+='<div id="'+$this.attr("data-timesid")+'" data-y="'+dataY+'" data-m="'+dataM+'" class="zcDateSelect" style="left:'+x+'px;top:'+(y+h)+'px">';
            html+='    <div class="year">';
            html+='        <div class="yearWrap">';
            // 存在 最大日期 || 最小日期
            if(typeof dataMaxY!="undefined" || typeof dataMinY!="undefined"){
                if( typeof dataMaxY!="undefined" ){
                    for( var i=1980; i<=parseInt(dataMaxY); i++ ){
                        // 已选年份
                        if( typeof dataY!="undefined" ){
                            //console.log($(params.target).attr("data-y")+"---"+i)
                            if(dataY==i){
                                html+='            <span class="on" data-y="'+i+'">'+i+'</span>';
                            }else{
                                html+='            <span data-y="'+i+'">'+i+'</span>';
                            };
                        }else{
                            html+='            <span data-y="'+i+'">'+i+'</span>';
                        };
                    };
                };
                if( typeof dataMinY!="undefined" ){
                    for( var i=parseInt(dataMinY); i<=(new Date).getFullYear(); i++ ){
                        // 已选年份
                        if( typeof dataY!="undefined" ){
                            //console.log($(params.target).attr("data-y")+"---"+i)
                            if(dataY==i){
                                html+='            <span class="on" data-y="'+i+'">'+i+'</span>';
                            }else{
                                html+='            <span data-y="'+i+'">'+i+'</span>';
                            };
                        }else{
                            html+='            <span data-y="'+i+'">'+i+'</span>';
                        };
                    };
                };            
            }else{// 不存在 日期限制
                for( var i=1980; i<=(new Date).getFullYear(); i++ ){
                    // 已选年份
                    if(dataY==i){
                        html+='            <span class="on" data-y="'+i+'">'+i+'</span>';
                    }else{
                        html+='            <span data-y="'+i+'">'+i+'</span>';
                    };
                };
            };
            
            html+='        </div>';
            html+='    </div>';
            html+='    <div class="month clear">';
            html+='        <span data-m="01">1月</span>';
            html+='        <span data-m="02">2月</span>';
            html+='        <span data-m="03">3月</span>';
            html+='        <span data-m="04">4月</span>';
            html+='        <span data-m="05">5月</span>';
            html+='        <span data-m="06">6月</span>';
            html+='        <span data-m="07">7月</span>';
            html+='        <span data-m="08">8月</span>';
            html+='        <span data-m="09">9月</span>';
            html+='        <span data-m="10">10月</span>';
            html+='        <span data-m="11">11月</span>';
            html+='        <span data-m="12">12月</span>';
            html+='    </div>';
            html+='    <div class="tool clear">';
            html+='        <span class="today">今天</span>';
            html+='        <span class="close">关闭</span>';
            html+='    </div>';
            html+='</div>';

            $("body").append(html);

            var $datePop = $("[id='"+$this.attr("data-timesid")+"']"),
                $target = $("[data-timesid='"+$datePop.attr("id")+"']");
            if( typeof $target.attr("data-maxy")!="undefined" ){
                if( typeof dataY !="undefined" && dataY == $target.attr("data-maxy") ){
                    for( var i=(parseInt($target.attr("data-maxm"))+1);i<=12;i++  ){
                        $datePop.find("[data-m='"+(i.toString().length==1?("0"+i.toString()):i)+"']").addClass("disabled");
                    };
                }else{
                    $datePop.find(".month span").removeClass("disabled");
                };
            };
            if( typeof $target.attr("data-miny")!="undefined" ){
                if( (typeof dataY !="undefined" && dataY == $target.attr("data-miny")) || ($target.attr("data-miny")==(new Date).getFullYear()) ){
                    for( var i=1;i<parseInt($target.attr("data-minm"));i++  ){
                        $datePop.find("[data-m='"+(i.toString().length==1?("0"+i.toString()):i)+"']").addClass("disabled");
                    };
                }else{
                    $datePop.find(".month span").removeClass("disabled");
                };
            };

            // 年份点击事件
            $datePop.find(".year span").click(function(event){
                var $this = $(this),
                    $parent = $this.closest(".zcDateSelect"),
                    year = $parent.attr("data-y"),
                    month = $parent.attr("data-m"),
                    $target = $("[data-timesid='"+$parent.attr("id")+"']");

                if( typeof $target.attr("data-maxy")!="undefined" ){
                    if( $this.attr("data-y") == $target.attr("data-maxy") ){
                        for( var i=(parseInt($target.attr("data-maxm"))+1);i<=12;i++  ){
                            $datePop.find("[data-m='"+(i.toString().length==1?("0"+i.toString()):i)+"']").addClass("disabled");
                        };
                    }else{
                        $datePop.find(".month span").removeClass("disabled");
                    };
                };
                if( typeof $target.attr("data-miny")!="undefined" ){
                    if( $this.attr("data-y") == $target.attr("data-miny") ){
                        for( var i=1;i<parseInt($target.attr("data-minm"));i++  ){
                            $datePop.find("[data-m='"+(i.toString().length==1?("0"+i.toString()):i)+"']").addClass("disabled");
                        };
                    }else{
                        $datePop.find(".month span").removeClass("disabled");
                    };
                };
                $this.addClass("on").siblings().removeClass("on");
                $parent.attr("data-y",$this.attr("data-y"));
                event.stopPropagation();
            });
            // 月份点击事件
            $datePop.find(".month span").click(function(event){
                var $this = $(this),
                    $parent = $this.closest(".zcDateSelect"),
                    year = $parent.attr("data-y"),
                    month = $parent.attr("data-m");
                if(!$this.hasClass("disabled")){
                    $this.addClass("on").siblings().removeClass("on");
                    $parent.attr("data-m",$this.attr("data-m"));
                    if( year!="undefined" ){
                        $("input[data-timesid='"+$parent.attr("id")+"']").attr({"data-y":$parent.attr("data-y"),"data-m":$parent.attr("data-m")}).val( $parent.attr("data-y")+"-"+$parent.attr("data-m") );
                        params.onClose({dataY:$parent.attr("data-y"),dataM:$parent.attr("data-m")});
                        $(".zcDateSelect").remove();
                    };
                };
                event.stopPropagation();
            });
            // 今天点击事件
            $datePop.find(".today").click(function(event){
                var $this = $(this),
                    $parent = $this.closest(".zcDateSelect"),
                    date=new Date;
                $("input[data-timesid='"+$parent.attr("id")+"']").attr({"data-y":date.getFullYear(),"data-m":(date.getMonth()+1)}).val( date.getFullYear()+"-"+((date.getMonth()+1).toString().length==1?("0"+(date.getMonth()+1)):(date.getMonth()+1)) );
                params.onClose({dataY:date.getFullYear(),dataM:(date.getMonth()+1)});
                $(".zcDateSelect").remove();
                event.stopPropagation();
            });
            // 关闭点击事件
            $datePop.find(".close").click(function(event){
                $(".zcDateSelect").remove();
                event.stopPropagation();
            });
            $("body").click(function(e){
                if( $(".zcDateSelect").length ){
                    if( !$(e.target).closest(".zcDateSelect").length ){
                        if( typeof $(e.target).attr("data-timesid")=="undefined" || $(".zcDateSelect").attr("id")!=$(e.target).attr("data-timesid") ){
                            $(".zcDateSelect").remove();
                        };
                    };
                };
            });
            event.stopPropagation();
        });
    }
};
//目标市场
ZC_GLOBAL.FUN.zcCountry=function(params){
    var defaults = {
        zcselect1: "",
        dataNum:""
    };
    $.extend(defaults, params);
    //  点击所有元素都隐藏 box
    $(document).click(function(){
        $(defaults.zcselect1+".box").hide();

    });
    //点击box  不隐藏
    $(defaults.zcSelect1+".box").on('click',function(event){
        event.stopPropagation();
    })
    //点击文本框 让box显示
    $(defaults.zcSelect1).click(function(event){
        event.stopPropagation();
        if(!$(this).hasClass('disabled')){
            $(defaults.zcSelect1).find('.box').show();
        }
        
    });
    //点击每个LI  添加进去
    $(defaults.zcselect1+".uls li").on('click',function(){
        if(!$(this).hasClass("disabled")){
            if($(defaults.zcselect1 +".targetCont").find('li').length==defaults.dataNum){
                ZC_GLOBAL.FUN.zcBubbleTip.show({icon:"<i class='icon icon-cross'>&#xe620;</i>",msg:"最多添加10个",times:1000});
            }else{
                $(this).addClass("disabled")
                $(this).addClass('on');
                $(defaults.zcselect1+' .targetCont').append($(this).clone().append("<i class='removeBtn icon icon-cross'>&#xe620;</i>").removeClass("on").removeClass("disabled"));
            }
        }
    })
    //点击×号
    $(defaults.zcselect1+".targetCont").on('click','.removeBtn',function(event){
        event.stopPropagation();
        $(this).parents('li').remove();
        var newClass=$(this).parents('li').attr("class");
        $(defaults.zcselect1+'.box').find("."+newClass+"").removeClass('on');
        $(defaults.zcselect1+'.box').find("."+newClass+"").removeClass('disabled')
    })
    //点击添加按钮
    $(defaults.zcselect1 +"h1 .addBtn").on('click',function(){
        var val=$(this).siblings('.addInput').val();
        if($(defaults.zcselect1 +".targetCont").find('li').length==defaults.dataNum){
             ZC_GLOBAL.FUN.zcBubbleTip.show({icon:"<i class='icon icon-cross'>&#xe620;</i>",msg:"不能再添加了",times:1000});
        }
        else{
            if(val.length == 0){
                ZC_GLOBAL.FUN.zcBubbleTip.show({icon:"<i class='icon icon-cross'>&#xe620;</i>",msg:"不能为空",times:1000});
            }else if(val.length < 1){
                ZC_GLOBAL.FUN.zcBubbleTip.show({icon:"<i class='icon icon-cross'>&#xe620;</i>",msg:"最少添加一个字",times:1000});
            }else if(val.length > 10){
                ZC_GLOBAL.FUN.zcBubbleTip.show({icon:"<i class='icon icon-cross'>&#xe620;</i>",msg:"最多添加10个字",times:1000});
            }
            else{
                var newObj=$("<li data-val="+val+">"+val+"<i class='removeBtn icon icon-cross'>&#xe620;<i></li>");
                $(defaults.zcselect1+".targetCont").append(newObj);
            }
        }
    })
};
// 判断 日期 是否 是今天
ZC_GLOBAL.FUN.isToday=function(date) {
    var today = new Date().toLocaleDateString();
    var date = new Date(date).toLocaleDateString();
    return today == date;
};
// 获取日期的星期
ZC_GLOBAL.FUN.getWeekText=function(date){
    var weekText = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
    //alert(new Date('2016-02-03').getDay());
    return weekText[new Date(date).getDay() - 1];
};
// 聊天记录至底部
ZC_GLOBAL.FUN.scrollToBottom=function(){
    try {
        var $dtRecords = $('.dt-records');
        var scrollBottom = $dtRecords[0].scrollHeight;
        $dtRecords.animate({scrollTop: scrollBottom}, 500);
    } catch (e) {
        e.message;
    }
};
//判断是否为JSON对象
ZC_GLOBAL.FUN.isJson=function(obj){
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
};
// 浏览器版本提示
ZC_GLOBAL.FUN.browserVerIE = function(obj){
    var useragent = window.navigator.userAgent.toLowerCase();
    var msie10 = $.browser.msie && /msie 10\.0/i.test(useragent);
    var msie9 = $.browser.msie && /msie 9\.0/i.test(useragent); 
    var msie8 = $.browser.msie && /msie 8\.0/i.test(useragent);
    var msie7 = $.browser.msie && /msie 7\.0/i.test(useragent);
    var msie6 = !msie8 && !msie7 && $.browser.msie && /msie 6\.0/i.test(useragent);
    return {
        msie10:msie10,
        msie9:msie9,
        msie8:msie8,
        msie7:msie7,
        msie6:msie6
    }
};
