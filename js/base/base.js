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
    // 密码强度
    ZC_GLOBAL.FUN.pwStrength();
    // 底部信息
    var $footer = $(".footer");
    $footer.find("p").empty().html("©2015-" + new Date().getFullYear() + " 站场｜京ICP备09061941号-4｜京公网安备110301000050号");
    if(!$('.pageError').length){     
        $footer.find("p").before('<div class="footlink"><a href="../order_center/index.html">接单广场</a><a href="../aboutus/index.html">关于我们</a><a href="../agreement/index.html">用户协议</a><a href="../help_center/index.html">常见问题</a></div> ');
    }
    else{
        $footer.find("p").before('<div class="footlink"><a href="static/order_center/index.html">接单广场</a><a href="static/aboutus/index.html">关于我们</a><a href="static/agreement/index.html">用户协议</a><a href="static/help_center/index.html">常见问题</a></div> ');
    };
});
/*常用邮箱*/
ZC_GLOBAL.emailType=[
    {
        "name":"@163.com",
        "value":"http://mail.163.com"
    },
    {
        "name":"@126.com",
        "value":"http://mail.126.com"   
    },
    {
        "name":"@sina.com",
        "value":"http://mail.sina.com.cn"   
    },
    {
        "name":"@qq.com",
        "value":"https://mail.qq.com"   
    },
    {
        "name":"@foxmail.com",
        "value":"https://mail.qq.com"   
    },
    {
        "name":"@yahoo.com",
        "value":"https://login.yahoo.com"   
    },
    {
        "name":"@souhu.com",
        "value":"http://mail.sohu.com"  
    },
    {
        "name":"@300.cn",
        "value":"http://webmail.300.cn"
    },
    {
        "name":"@xinnet.com",
        "value":"http://webmail.xinnet.com"
    },
    {
        "name":"@outlook.com",
        "value":"https://login.live.com"
    },
    {
        "name":"@tom.com",
        "value":"http://web.mail.tom.com"
    },
    {
        "name":"@139.com",
        "value":"http://mail.10086.cn"
    },
    {
        "name":"@189.cn",
        "value":"http://webmail30.189.cn"
    },
    {
        "name":"@eyou.com",
        "value":"http://www.eyou.com"
    },
    {
        "name":"@21cn.com",
        "value":"http://mail.21cn.com"
    },
    {
        "name":"@22cn.com",
        "value":"http://mail.21cn.net"
    },
    {
        "name":"@188.com",
        "value":"http://www.188.com"
    },
    {
        "name":"@yeah.net",
        "value":"http://www.yeah.net"
    },
    {
        "name":"@wo.cn",
        "value":"http://mail.wo.cn"
    }
]