require.config({
    shim: {
        'bootstrap': ['jquery'],
        'jqueryform': ['jquery'],
        'jqueryatwho': ['jquery'],
        'jqueryjcrop': ['jquery'],
        'jquerymigrate': ['jquery'],
        'zoom': ['jquery'],
        'popover': ['jquery']
    },
    paths: {
        jquery: './lib/jquery.min',
        jqueryform: './lib/jquery.form.min',
        jquerycaret: './lib/jquery.caret.min',
        jqueryjcrop: './lib/jquery.jcrop.min',
        jquerymigrate: './lib/jquery.migrate.min',
        bootstrap: './lib/bootstrap.min',
        underscore: './lib/underscore.min',
        jqueryatwho: './lib/jquery.atwho.min',
        editor: './lib/editor.min',
        pretty: './lib/pretty.min',
        popover: './lib/jquery.webui.popover.min',
        zoom: './lib/zoom.min'
    }
}),
define("domop", function() {
    return {
        hasClass: function(obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },
        addClass: function(obj, cls) {
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;
        },
        removeClass: function(obj, cls) {
            if (this.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        },
        toggleClass: function(obj, cls) {
            if (this.hasClass(obj, cls)) {
                this.removeClass(obj, cls);
            } else {
                this.addClass(obj, cls);
            }
        }
    }
}),

define("msgbox", ["domop"], function(domop) {
    var body = document.getElementsByTagName("body")[0];
    var gmxgbox = document.createElement("div");
    domop.addClass(gmxgbox, "fade_trans");
    domop.addClass(gmxgbox, "msgboxout");
    gmxgbox.setAttribute("id", "gmsgbox");
    body.insertBefore(gmxgbox, body.childNodes[0]);

    function msgout() {
        domop.removeClass(gmxgbox, 'msgboxin');
        domop.addClass(gmxgbox, "msgboxout");
        domop.removeClass(gmxgbox, 'msgbox_success');
        domop.removeClass(gmxgbox, 'msgbox_error');
    }

    function msgin() {
        domop.removeClass(gmxgbox, 'msgboxout');
        domop.addClass(gmxgbox, "msgboxin");
    }
    return {
        showMsgBox: function(flag, text) {
            if (flag == true) {
                domop.addClass(gmxgbox, "msgbox_success");
            } else {
                domop.addClass(gmxgbox, "msgbox_error");
            }
            gmxgbox.innerHTML = text;
            msgin();
            setTimeout(msgout, 1500)
        }
    }
}),

define("index", ["msgbox", "jquery","popover", "zoom"], function(msgbox, $, popover, zoom) {
    $('.articleitem').hover(
        function() {
            $(this).find('.otherinfowrap').css("opacity", "1");
        },
        function() {
            $(this).find('.otherinfowrap').css("opacity", "0.8");
        }
    );
    $(".likebtn,.unlikebtn").click(function() {
        var currObj = $(this);
        var tid = currObj.attr('data-tid');
        var islike = true;
        var text = '表过态';
        if (currObj.attr('title') === "赞") {
            islike = true;
        } else {
            islike = false;
        }
        var params = {
            tid: tid,
            islike: islike
        };
        $.ajax({
            data: params,
            url: '/like',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            success: function(data) {
                if (data.status === 0) {
                    var numlike = (currObj.children('span').text() === '') ? 0 : currObj.children('span').text();
                    currObj.children('span').text(numlike - (-1));
                    msgbox.showMsgBox(true, "操作成功!!");
                    return;
                }
                if (data.status === 1) {
                    msgbox.showMsgBox(false, "请先登录!!");
                    return;
                }
                if (data.status === 2) {
                    msgbox.showMsgBox(false, "已经" + text + "了!!");
                    return;
                }
                if (data.status === 3) {
                    msgbox.showMsgBox(false, "发生错误!!");
                    return;
                }
            }
        });
    }); 
  
    (function() {
        var settings = {
            trigger: 'hover', 
            content: '',//<p>This is webui popover demo.</p><p>just enjoy it and have fun !</p>',
            width: 250,
            multi: true,
            closeable: true,
            style: '',
            padding: false
        };

        function initPopover() {
            var
                asyncSettings = {
                    width: 'auto',
                    height: 'auto',
                    closeable: true,
                    padding: false,
                    cache: false,
                    url: '/userinfo/',
                    type: 'async',
                    content: function(data) {
                        title = "ccc";
                        var html = '<ul class="list-group">';
                        if(data.self == true){
                            html += '<li class="list-group-item"><i class="fa fa-user"></i>'+data.name + '</li>';
                        }else{
                            if(data.isfollow == false){
                                html += '<li class="list-group-item"><i class="fa fa-user"></i>'+data.name + '<a class="guanzhu" data_id='+data.uid+'>关注</a></li>';
                            }else{
                                html += '<li class="list-group-item"><i class="fa fa-user"></i>'+data.name + '<a class="quxiaoguanzhu" data_id='+data.uid+'>取消</a></li>';
                            } 
                        }
                        html += '<li class="list-group-item"><i class="fa fa-calendar"></i>' + data.cometime + '</li>';
                        html += '<li class="list-group-item"><i class="fa fa-leaf"></i>' + data.articlenum + '</li>';
                        html += '</ul>';
                        return html;
                    }
                };
            $('a.show-pop-async').webuiPopover('destroy').webuiPopover($.extend({}, settings, asyncSettings));

            $('a.show-pop-event').each(function(i, item) {
                var ename = $(item).text() + '.webui.popover';
                $(item).webuiPopover('destroy').webuiPopover(settings)
                    .on(ename, function(e) {
                        var log = ename + ' is trigged!';
                        if (console) {
                            console.log(log);
                        }
                        $('#eventLogs').text($('#eventLogs').text() + '\n' + log);
                    });
            }); 
        }
        initPopover();

    })();

      function relationAjax(params,_obj){ 
        $.ajax({
            data: params,
            url: '/newrelation',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            success: function(data) {
                if (data.status === 'success') {      
                    if(params.follow){
                        _obj.removeClass("guanzhu");
                        _obj.addClass("quxiaoguanzhu"); 
                        _obj.text("取消");
                    }else{
                        _obj.removeClass("quxiaoguanzhu");
                        _obj.addClass("guanzhu"); 
                        _obj.text("关注"); 
                    }
                    msgbox.showMsgBox(true, "操作成功!!");
                    return;
                }
                if (data.status === "failed") {
                    msgbox.showMsgBox(false, "请先登录!!");
                }
                if (data.status === "error") {
                    msgbox.showMsgBox(false, "发生错误!!");
                }
            }
        });
    } 
    $(document).on('click','.guanzhu',function() { 
            var followuid = $(this).attr('data_id'); 
            var params = {
                followuid: followuid,
                follow: true
            };
            var _obj = $(this);
            _obj.text("...");
            relationAjax(params,_obj);
    });  
    $(document).on('click','.quxiaoguanzhu',function() { 
            var followuid = $(this).attr('data_id'); 
            var params = {
                followuid: followuid,
                follow: false
            };
            var _obj = $(this);
            _obj.text("...");
            relationAjax(params,_obj);
    });  

}),
define("reglog", ["msgbox", "jquery"], function(msgbox, $) {
    function fucCheckLength(strTemp) {
        var i, sum;
        sum = 0;
        for (i = 0; i < strTemp.length; i++) {
            if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255)) {
                sum = sum + 1;
            } else {
                sum = sum + 2;
            }
        }
        return sum;
    }

    $("#regBtnSub").click(function() {
        var email = $('#email').val(),
            name = $('#uname').val(),
            pwd = $('#pwd').val(),
            pwdagain = $('#pwdagain').val(),
            reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var regAccount = /^[\u4E00-\u9FA5\uf900-\ufa2d\w]{4,16}$/;
        $(".msgbox").empty();
        if (!reg.test(email)) {
            var textinfo = "<div class='alertsty' role='alert'>邮箱格式不正确,请重新输入</div>";
            $(".msgbox").append(textinfo);
            $('#email').focus();
            return false;
        }
        if (fucCheckLength(name) < 4) {
            var textinfo = "<div class='alertsty' role='alert'>账户最少超过4个字符哦</div>";
            $(".msgbox").append(textinfo);
            $('#name').focus();
            return false;
        }
        if (!regAccount.test(name)) {
            var textinfo = "<div class='alertsty' role='alert'>账号只能是4-16位的汉字，字符或者下划线</div>";
            $(".msgbox").append(textinfo);
            $('#name').focus();
            return false;
        }
        if (fucCheckLength(pwd) < 6) {
            var textinfo = "<div class='alertsty' role='alert'>密码过于简单..</div>";
            $(".msgbox").append(textinfo);
            $('#pwd').focus();
            return false;
        }
        if (pwd != pwdagain) {
            var textinfo = "<div class='alertsty' role='alert'>两次输入不一样</div>";
            $(".msgbox").append(textinfo);
            $('#pwdagain').focus();
            return false;
        }
        return true;
    });

    $("#loginBtnSub").click(function() {
        var name = $('#uname').val();
        var pwd = $('#pwd').val();
        $(".msgbox").empty();
        if (name.length === 0) {
            var textinfo = "<div class='alertsty' role='alert'>账户为空</div>";
            $(".msgbox").append(textinfo);
            $('#name').focus();
            return false;
        }
        if (pwd.length === 0) {
            var textinfo = "<div class='alertsty' role='alert'>密码为空</div>";
            $(".msgbox").append(textinfo);
            $('#pwd').focus();
            return false;
        }
        return true;
    });

    $("#getpwdbtn").click(function(){
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var regEmailValue = $("#email").val();
        var noticeMsg = $("#noticemsg");
        if (!reg.test(regEmailValue)) {
            var textinfo = "<div class='alertsty' role='alert'>邮箱格式不正确</div>";
            $(".msgbox").append(textinfo);
            $('#email').focus();
            return false;
        }
        return true;
    });
}),
define("pub", ["msgbox", "jquery", "bootstrap", "editor"], function(msgbox, $, bootstrap, editor) {
    var editor = new Editor();
    route = route || "";
    if (route == "pub") {
        editor.render(document.getElementById('postcontent'));
    }

    $("#add_title").click(function() {
        $("#add_title").css("display", "none")
        $("#title_input").css("display", "block")
    });
    $("#tab_share_on").click(function() {
        $("#tab_link").removeClass("tab_on");
        $("#tab_link").addClass("tab_off");
        $("#tab_share").removeClass("tab_off");
        $("#tab_share").addClass("tab_on");
        $(this).addClass("share_tab_active");
        $("#tab_link_on").removeClass("share_tab_active");
    });

    $("#tab_link_on").click(function() {
        $("#tab_share").removeClass("tab_on");
        $("#tab_share").addClass("tab_off");
        $("#tab_link").removeClass("tab_off");
        $("#tab_link").addClass("tab_on");
        $(this).addClass("share_tab_active");
        $("#tab_share_on").removeClass("share_tab_active");
    });
    $("#searchtitle").click(function() {
        var url = $("#url").val();
        var title = $("#pub_link_brief");
        if (url.length == 0) {
            msgbox.showMsgBox(false, "输入不能为空");
            return false;
        }
        if (url.indexOf("http") < 0) {
            msgbox.showMsgBox(false, "链接地址不合法");
            return false;
        }
        var params = {
            url: url
        };
        $.ajax({
            data: params,
            url: '/getlinktitle',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            beforeSend: function() {
                $(".loading").css('display', 'inline-block'); //显示 
            },
            success: function(data) {
                $(".loading").css('display', 'none'); //显示  
                if (data.status === 0) {
                    title.val(data.title);
                    return false;
                }
                if (data.status === 1) {
                    title.val("");
                    msgbox.showMsgBox(false, data.title);
                    title.attr('placeholder', data.title)
                    return false;
                }
            }
        });
        return false;
    });
    $("#sublink").click(function() {
        var url = $("#url").val();
        var title = $("#pub_link_brief").val();
        if (url.length == 0) {
            msgbox.showMsgBox(false, "输入不能为空");
            return false;
        }
        if (title.length == 0) {
            msgbox.showMsgBox(false, "链接简介是不是空的呀？");
            return false;
        }
        return true;
    });

    $("#subarticle").click(function() {
        var contentStr = editor.codemirror.getValue();
        if (contentStr.length == 0) {
            msgbox.showMsgBox(false, "输入不能为空");
            return false;
        }
        if (contentStr.length < 10) {
            msgbox.showMsgBox(false, "输入不能为空");
            return false;
        }
        return true;
    });
    $("#link").change(function() {
        if ($("#link").val().length > 0) {
            $("#insertlinkbtn").show();
        } else {
            $("#insertlinkbtn").hide();
        }
    });
    $("#insertlinkbtn").click(function() {
        var linkmodal = $("#linkmodal");
        var linkname = $("#linkname").val();
        var link = $("#link").val();
        editor.codemirror.replaceSelection("[" + linkname + "](" + link + ")");
        linkmodal.modal('hide');
    });
    $("#savepic").click(function() {
        var imagemodal = $("#imagemodal");
        var imgurl = $("#submitinfo").text();
        var i = imgurl.lastIndexOf('/');
        var l = imgurl.length;
        var imgname = imgurl.substring(i > 0 ? (i + 1) : 0, l > 0 ? l : 0);
        editor.codemirror.replaceSelection("![" + imgname + "](" + imgurl + ")");
        imagemodal.modal('hide');
    });
    var submitinfo = $(".submitinfo");
    var insertbtn = $("#savepic");
    $("#choose").wrap("<form id='uploadpic' action='/picupload' method='post' enctype='multipart/form-data'></form>");
    $("#choose").change(function() {
        $("#uploadpic").ajaxSubmit({
            dataType: 'json',
            beforeSend: function() {
                submitinfo.text("正在上传...");
                insertbtn.hide();
            },
            success: function(msg) {
                if (msg.type == 0) {
                    submitinfo.text(msg.content);
                } else {
                    submitinfo.text(msg.content);
                    insertbtn.show();
                }
            },
            error: function() {
                insertbtn.hide();
            }
        });
    });

}),
define("user", ["msgbox", "jquery"], function(msgbox, $) {
    $(".deleteitem").click(function() {
        if (confirm("你确定提交吗？")) {
            var currObj = $(this);
            var tid = currObj.attr('data-tid');
            var params = {
                tid: tid
            };
            $.ajax({
                data: params,
                url: '/deletearticle',
                dataType: 'json',
                cache: false,
                timeout: 5000,
                type: 'get',
                success: function(data) {
                    if (data.status === 0) {
                        currObj.parentsUntil('.user_near_article').remove();
                        msgbox.showMsgBox(true, "删除成功!!");
                        return;
                    }
                    if (data.status === 3) {
                        $("#likeerr").remove();
                        msgbox.showMsgBox(false, "发生错误!!");
                        return;
                    }
                }
            });
        }
    });
}),
define("set", ["jquery", "jqueryjcrop"], function($, jqueryjcrop) {
    //初始化一个剪裁大小，左上角坐标(100,100)，右下角为(200,200)
    $("#xuwanting").Jcrop({
        setSelect: [0, 0, 64, 64], //setSelect是Jcrop插件内部已定义的运动方法       
        aspectRatio: 1,
        onChange: showPreview,
        allowSelect: false
    });
    //简单的事件处理程序，响应自onChange,onSelect事件，按照上面的Jcrop调用
    function showPreview(coords) {
        if (parseInt(coords.w) > 0) {
            //计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
            var rx = $("#preview_box").width() / coords.w;
            var ry = $("#preview_box").height() / coords.h;
            //通过比例值控制图片的样式与显示
            $("#crop_preview").css({
                width: Math.round(rx * $("#xuwanting").width()) + "px", //预览图片宽度为计算比例值与原图片宽度的乘积
                height: Math.round(ry * $("#xuwanting").height()) + "px", //预览图片高度为计算比例值与原图片高度的乘积
                marginLeft: "-" + Math.round(rx * coords.x) + "px",
                marginTop: "-" + Math.round(ry * coords.y) + "px"
            });
            $("#coords").val(coords.x + '_' + coords.y + '_' + coords.w + '_' + coords.h);
        }
    };

}),
define("article", ["msgbox", "jquery", "jquerymigrate", "jquerycaret", "underscore", "jqueryatwho","pretty"], function(msgbox, $, jquerymigrate, jquerycaret, _, jqueryatwho,pretty) {
    $(".detail_content pre").addClass("prettyprint ");
    $(".detail_content pre").addClass("linenums ");
    prettyPrint(); 
    
    var names = $('.username_text').map(function(idx, obj) {
        return $(obj).text().trim();
    }).toArray();
    names = _.uniq(names);
    var at_config = {
        at: "@",
        data: names,
        show_the_at: true
    };
    $inputor = $('.atreply').atwho(at_config);
    $("#relatebtn").click(function() {
        var followuid = $(this).attr('data_id');
        var follow = false;
        if ($(this).hasClass("followfri")) {
            follow = true;
        } else {
            follow = false;
        }
        var params = {
            followuid: followuid,
            follow: follow
        };
        $.ajax({
            data: params,
            url: '/newrelation',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            success: function(data) {
                if (data.status === 'success') {
                    if ($("#relatebtn").hasClass("followfri")) {
                        $("#relatebtn").html("<i class='fa fa-minus'></i>  取消关注");
                    } else {
                        $("#relatebtn").html("<i class='fa fa-plus'></i>   关注此人");
                    }
                    $("#relatebtn").toggleClass("unfollowfri");
                    $("#relatebtn").toggleClass("followfri");
                    msgbox.showMsgBox(true, "操作成功!!");
                    return;
                }
                if (data.status === "failed") {
                    msgbox.showMsgBox(false, "请先登录!!");
                }
                if (data.status === "error") {
                    msgbox.showMsgBox(false, "发生错误!!");
                }
            }
        });
    });
    var replyform = function(tid, rid, ruid, runame) {
        var tinput = '<input type="hidden" name="tid" value="' + tid + '">';
        var rinput = '<input type="hidden" name="rid" value="' + rid + '">';
        var ruidinput = '<input type="hidden" name="ruid" value="' + ruid + '">';
        var rnameinput = '<input type="hidden" name="runame" value="' + runame + '">';
        var textarea = '<textarea row="3" name="repstr" class="atreply" id="replytoreply" style="width:100%;resize: vertical;"></textarea>';
        var btnrep = '<div class="inputopt"><button type="submit" class="btn  btn-sm">回复</button></div>';
        var formhead = '<form id="replywrap" class="navbar-form" action="/reply" method="post">';
        var formtail = '</form>';
        return formhead + textarea + tinput + rinput + ruidinput + rnameinput + btnrep + formtail;
    }

    $(".replyat").click(function() {
        $("#replywrap").remove();
        var tid = $(this).attr("data-tid");
        var rid = $(this).attr("data-rid");
        var ruid = $(this).attr("data-ruid");
        var runame = $(this).attr("data-runame");
        var replyformstr = replyform(tid, rid, ruid, runame);
        $(this).parent().parent().parent().children('.reply_content').after(replyformstr);
        $('#replytoreply').focus();
        $('#replytoreply').val('@' + runame + ' ');
        return false;
    });
    $('textarea.atreply').keydown(function(event) {
        if (event.keyCode == 13 && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
            $(this).closest('form').submit()
        }
    });

    $('textarea.atreply').live("focus", function() {
        $(this).css("height", "80px");
        $(this).parent().find(".inputopt").css("display", "inline-block");
    });
    $('textarea.atreply').live("blur", function() {
        var replyContent = $(this).val();
        if (replyContent.length == 0) {
            $(this).css("height", "30px");
            $(this).parent().find(".inputopt").css("display", "none");
        }
    });
    $('.reply_msg_item').hover(
        function() {
            $(this).find('.opt').css("opacity", "1");
        },
        function() {
            $(this).find('.opt').css("opacity", "0.6");
        }
    );

}),
define("common", ["domop", "jquery", "bootstrap"], function(domop, $, bootstrap) {
    $("#regbtn").click(function(){  
        $('#regmodal').modal('show');
        $("body").css('padding-right','0px');
    });
    $("#loginbtn").click(function(){ 
        $('#loginmodal').modal('show');
        $("body").css('padding-right','0px');
    });
    $("#gotologin").click(function(){        
        $('#regmodal').modal('hide');
        $('#loginmodal').modal('show');
        $("body").css('padding-right','0px');
    });
    $("#gotoreg").click(function() {
        $('#loginmodal').modal('hide');
        $('#regmodal').modal('show');
        $("body").css('padding-right','0px');
    });
    $("#imagemodalbtn").click(function(){ 
        $('#imagemodal').modal('show');
        $("body").css('padding-right','0px');
    });
    $("#linkmodalbtn").click(function(){ 
        $('#linkmodal').modal('show');
        $("body").css('padding-right','0px');
    });
    $("#nosiginin-login").click(function(){ 
        $('#loginmodal').modal('show');
        $("body").css('padding-right','0px');
    });
    $(".replylink").click(function(){ 
        $('#loginmodal').modal('show');
        $("body").css('padding-right','0px');
    });
    $("#nosiginin-reg").click(function(){ 
        $('#regmodal').modal('show');
        $("body").css('padding-right','0px');
    });

    $('#uname').blur(function() { 
        var input = $(this);
        var name = input.val();
        var params = {
            name: name
        };
        $.ajax({
            data: params,
            url: '/getphoto',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            beforeSend: function() {},
            success: function(data) {
                if (data.status == 1) {
                    input.css("background-image","url("+data.photo+")"); 
                }else{
                    input.css("background-image","url(../images/y_accountbg.png)");

                } 
            }
        });
    });
    $("#sublogin").click(function() {
        var uname = $("#uname").val();
        var pwd = $("pwd").val();
        var noticeMsg = $("#noticemsg1");
        if (uname.length == 0) {
            noticeMsg.html("账号格式有误");
            return false;
        }
        if (pwd.length == 0) {
            noticeMsg.html("密码输入不对");
            return false;
        }
        return true;
    });

    $("#subemail").click(function() {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var regEmailValue = $("#regemail").val();
        var noticeMsg = $("#noticemsg");
        if (!reg.test(regEmailValue)) {
            noticeMsg.html("邮箱格式不对哦");
            return false;
        }
        var params = {
            email: regEmailValue
        };
        $.ajax({
            data: params,
            url: '/regemail',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            beforeSend: function() {},
            success: function(data) {
                if (data.status == 1) {
                    noticeMsg.html(data.content);
                } else {
                    noticeMsg.html(data.content);
                }
            }
        });
    });

    $("[data-toggle='tooltip']").tooltip();

    var closeFlag = false;
    $("#optionaccess").on("mouseenter",function(){
        $("#optionaccesslist").css("display","block"); 
        $(this).parent().addClass("open");
        closeFlag = false;
    });
    $("#optionaccess").on("mouseleave",function(){
        closeFlag = true;
        setTimeout(function(){
            if(closeFlag)
            {                 
                $("#optionaccess").parent().removeClass("open");
                $("#optionaccesslist").css("display","none"); 
            }
        },500);        
    });
     $("#optionaccesslist").on("mouseenter",function(){  
        closeFlag = false;
    });

    $("#optionaccesslist").on("mouseleave",function(){ 
        closeFlag = true;
        setTimeout(function(){  
            if(closeFlag)
            {                 
                $("#optionaccess").parent().removeClass("open");
                $("#optionaccesslist").css("display","none"); 
            }
        },500);        
    });
    //到顶部效果
    var TopObj = document.getElementById("gotopbtn");

    function setScrollTop(value) {
        document.documentElement.scrollTop = value;
        document.body.scrollTop = value;
    }


    TopObj.onclick = function() {
        var goTop = setInterval(scrollMove, 10);

        function scrollMove() {
            setScrollTop(getScrollTop() / 1.1);
            if (getScrollTop() < 1) {
                clearInterval(goTop);
            }
        }
    }

    //顶部导航栏效果
    window.onscroll = function() {
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        var body = document.getElementsByTagName("body")[0];
        var navigate = document.getElementById("navigate");
        if (t >= 130) {
            domop.addClass(body, "headon");
        } else {
            domop.removeClass(body, "headon");
        }

        getScrollTop() > 130 ? TopObj.style.bottom = "80px" : TopObj.style.bottom = "-45px";
    }

    function getScrollTop() {
        return document.documentElement.scrollTop | document.body.scrollTop;
    }

    //搜索框效果
    var btnsearch = document.getElementsByClassName("btn-search")[0];
    var btnclose = document.getElementsByClassName("btn-close")[0];
    var headsearch = document.getElementsByClassName("headsearch")[0];
    var formsearch = document.getElementsByClassName("form-search")[0];
    var inputsearch = document.getElementsByClassName("search-ipt")[0];
    btnsearch.onclick = function() {
        var y = $('.search-btn-wrap').offset().left;
        var x = $('.search-btn-wrap').offset().top;  
        var height = $('.search-btn-wrap').height();       
        $(formsearch).css("left",(y+32-270)+"px");
        $(formsearch).css("top",(height)+"px");
        domop.addClass(headsearch, "active");
        inputsearch.focus();
    };
    btnclose.onclick = function() {
        domop.removeClass(headsearch, "active");
    };
    inputsearch.onblur = function() {
        domop.removeClass(headsearch, "active");
    };
}), 
 
require(["jquery", "bootstrap", "jqueryform", "jquerycaret", "underscore", "jquerymigrate", "jqueryatwho", "index", "article", "pub", "reglog", "user", "set", "common"],
    function($, bootstrap, jqueryform, jquerycaret, _, jquerymigrate, jqueryatwho, index, article, pub, reglog, user, set, common) {

    });