$(document).ready(function() {

    $('#side-menu').metisMenu();


    $("#subemail").click(function() {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var regEmailValue = $("#regemail").val();
        if (!reg.test(regEmailValue)) {
            var textinfo = "<div class='alert alert-warning' role='alert'>邮箱格式不对哦</div>";
            $(".msgbox").append(textinfo);
            return false;
        }
        var params = {
            email: regEmailValue
        };
        $.ajax({
            data: params,
            url: '/admin/regemail',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            beforeSend: function() {},
            success: function(data) {
                if (data.status == 1) {
                    var textinfo = "<div class='alert alert-warning' role='alert'>" + data.content + "</div>";
                    $(".msgbox").append(textinfo);
                } else {
                    var textinfo = "<div class='alert alert-warning' role='alert'>" + data.content + "</div>";
                    $(".msgbox").append(textinfo);
                }
            }
        });
    });
    $("#loginBtnSub").click(function() {
        var name = $('#uname').val();
        var pwd = $('#pwd').val();
        $(".msgbox").empty();
        if (name.length === 0) {
            var textinfo = "<div class='alert alert-warning' role='alert'>账户为空</div>";
            $(".msgbox").append(textinfo);
            $('#name').focus();
            return false;
        }
        if (pwd.length === 0) {
            var textinfo = "<div class='alert alert-warning' role='alert'>密码为空</div>";
            $(".msgbox").append(textinfo);
            $('#pwd').focus();
            return false;
        }
        return true;
    });


    var spanMessage = $("#spanMessage");
    var spic = $("#spic");
    $("#sitepicfile").wrap("<form id='uploadsitepic' action='/admin/sitepicupload' method='post' enctype='multipart/form-data'></form>");
    $("#sitepicfile").change(function() {
        var fileNames = '';
        $.each(this.files, function() {
            fileNames += '<span class="am-badge">' + this.name + '</span> ';
        });
        $('#file-list').html(fileNames);
        $("#uploadsitepic").ajaxSubmit({
            dataType: 'json',
            beforeSend: function() {
                spanMessage.text("正在上传...");
            },
            success: function(msg) {
                if (msg.type == 0) {
                    spanMessage.text("上传失败");
                } else {
                    spanMessage.text("上传成功");
                    spic.val(msg.content);
                }
            },
            error: function() {
                spanMessage.text("上传失败");
            }
        });
    });

    $("#addsite").click(function() {
        var sname = $('#sname').val();
        var sdomain = $('#sdomain').val();
        var sbrief = $('#sbrief').val();
        var spic = $('#spic').val();
        var params = {
            sname: sname,
            sbrief: sbrief,
            sdomain: sdomain,
            spic: spic
        };
        $.ajax({
            data: params,
            url: '/admin/addsite',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            success: function(data) {
                if (0 === data.status) {
                    $("#spanMessage").html("Site增加成功");
                    msgbox({
                        flag: 'success',
                        text: 'Site增加成功',
                        pop: true
                    });
                } else {
                    $("#spanMessage").html("Site增加失败");
                    msgbox({
                        flag: 'warning',
                        text: 'Site增加失败',
                        pop: true
                    });
                }
            },
            error: function() {
                $("#spanMessage").html("ERROR");
                msgbox({
                    flag: 'danger',
                    text: 'ERROR',
                    pop: true
                });
            }
        });
    });

    $("#updatesite").click(function() {
        var snname = $('#snname').val();
        var sndomain = $('#sndomain').val();
        var snbrief = $('#snbrief').val();
        var snpic = $('#snpic').val();
        var params = {
            snname: snname,
            snbrief: snbrief,
            sndomain: sndomain,
            snpic: snpic
        };
        $.ajax({
            data: params,
            url: '/admin/updatesite',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            success: function(data) {
                if (0 === data.status) {
                    $("#spanMessage2").html("Site编辑成功");
                    msgbox({
                        flag: 'success',
                        text: 'Site编辑成功',
                        pop: true
                    });
                } else {
                    $("#spanMessage2").html("Site编辑失败");
                    msgbox({
                        flag: 'warning',
                        text: 'Site增加失败',
                        pop: true
                    });
                }
            },
            error: function() {
                $("#spanMessage2").html("ERROR");
                msgbox({
                    flag: 'danger',
                    text: 'ERROR',
                    pop: true
                });
            }
        });
    });

    $("#sndomain").blur(function() {
        var snameobj = $('#snname');
        var sdomainobj = $('#sndomain');
        var sbriefobj = $('#snbrief');
        var spicobj = $('#snpic');
        var domainName = sdomainobj.val();
        var params = {
            domainname: domainName
        };
        $.ajax({
            data: params,
            url: '/admin/getsite',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            success: function(data) {
                if (0 === data.status) {
                    snameobj.val(data.site.sname);
                    sbriefobj.val(data.site.sbrief);
                    spicobj.val(data.site.spic);
                } else {
                    $("#spanMessage2").html("Site查找失败");
                    msgbox({
                        flag: 'warning',
                        text: 'Site查找失败',
                        pop: true
                    });
                    snameobj.val("");
                    sbriefobj.val("");
                    spicobj.val("");
                }
            },
            error: function() {
                $("#spanMessage2").html("ERROR");
                msgbox({
                    flag: 'danger',
                    text: 'ERROR',
                    pop: true
                });
            }
        });
    });



    $('.articledeletebtn').on('click', function() {
        $('#articleDelModal').modal({
            keyboard: false
        });
        $('#deltid').val($(this).attr('data-id'));
    });

    $('#delarticle-sure-btn').on('click', function() {
        var tid = $('#deltid').val();
        var params = {
            tid: tid
        };
        var notice = $("#notice");
        $.ajax({
            data: params,
            url: '/admin/deletearticle',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: 'get',
            success: function(data) {
                if (data.status === 1) {
                    notice.addClass("alert-success");
                    notice.css("display", "block")
                    $("#" + tid).remove();
                    notice.text("删除成功");
                    return;
                }
                if (data.status === -1) {
                    notice.addClass("alert-error");
                    notice.css("display", "block")
                    notice.text("系统错误");
                    return;
                }
                if (data.status === 0) {
                    notice.addClass("alert-warning");
                    notice.css("display", "block")
                    notice.text("参数错误");
                    return;
                }
            },
            error: function() {
                notice.addClass("alert-error");
                notice.css("display", "block")
                notice.text("参数错误");
                return;
            }
        });
        $('#articleDelModal').modal('hide')
    });

    $('.userbanbtn').on('click', function() {
        $('#userBanModal').modal({
            keyboard: false
        });
        $('#uid').val($(this).attr('data-id'));
    });


    var editor = new Editor();
    editor.render(document.getElementById('postcontent'));

    $("#subarticle").click(function() {
        var contentStr = editor.codemirror.getValue();
        if (contentStr.length == 0) {
            msgbox({
                flag: 'warning',
                text: '输入不能为空',
                pop: true
            });
            return false;
        }
        if (contentStr.length < 10) {
            msgbox({
                flag: 'warning',
                text: '输入不能为空',
                pop: true
            });
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

    var submitinfo = $("#submitinfo");
    var insertbtn = $("#savepic");
    $("#narrowimg").wrap("<form id='uploadpic' action='/admin/picupload' method='post' enctype='multipart/form-data'></form>");
    $("#narrowimg").change(function() {
        $("#uploadpic").ajaxSubmit({
            dataType: 'json',
            beforeSend: function() {
                submitinfo.html('<span class="am-badge">正在上传</span> ');
            },
            success: function(msg) {
                if (msg.status == 0) {
                    submitinfo.html('<span class="am-badge">' + msg.content + '</span> ');
                    $("#smallimg").val(msg.content);
                    $("#disnarrow").attr("src", msg.content);
                } else {
                    submitinfo.html('<span class="am-badge">' + msg.content + '</span> ');

                }
            },
            error: function() {}
        });
    });

});