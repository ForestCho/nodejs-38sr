$(document).ready(function(){

	var names = $('.username_text').map(function(idx,obj){
		return $(obj).text().trim();
	}).toArray(); 
	names = _.uniq(names);
	var at_config = {
		at: "@",
		data: names, 
		show_the_at: true
	}  
	$inputor = $('.atreply').atwho(at_config); 

	var body = $("body");
	body.after("<div id='gmsgbox' class='fade_trans msgboxout'></div>"); 


	var gmxgbox = $("#gmsgbox"); 
	function showMsgBox(flag,text){
		if(flag == true){			
			gmxgbox.addClass("msgbox_success"); 
		}else{
			gmxgbox.addClass("msgbox_error"); 
		} 
		gmxgbox.text(text);  		
		msgin();
		setTimeout(msgout,1500) 	
	}	

	function msgout(){ 
		gmxgbox.removeClass('msgboxin');
		gmxgbox.addClass('msgboxout');
		gmxgbox.removeClass('msgbox_success');
		gmxgbox.removeClass('msgbox_error');
	}
	function msgin(){
		gmxgbox.removeClass('msgboxout');
		gmxgbox.addClass('msgboxin');
	}
 
 	$("#searchtitle").click(function(){
 		var url = $("#url").val(); 
 		var title = $("#pub_link_brief"); 
 		if(url.length == 0){
			showMsgBox(false,"输入不能为空");
			return false;
 		} 
  		if(url.indexOf("http") < 0){ 			
			showMsgBox(false,"链接地址不合法");
			return false;
 		}		
		var params = {url:url};  
		$.ajax({
			data: params,
			url: '/getlinktitle',
			dataType: 'json',
			cache: false,
			timeout: 5000,
			type: 'get',       
			beforeSend:function(){
          	  $(".loading").css('display', 'inline-block'); //显示 
        	},
			success: function(data){
            	$(".loading").css('display', 'none'); //显示  
				if(data.status === 0 ){  
					title.val(data.title);
					return false;
				} 
				if(data.status === 1 ){   
					title.val("");
					showMsgBox(false,data.title);
   				    title.attr('placeholder',data.title) 
					return false;
				}     
			}
		});
		return false;
 	});


	$("#sublink").click(function(){
 		var url = $("#url").val();  
 		var title = $("#pub_link_brief"); 
 		if(url.length == 0){
			showMsgBox(false,"输入不能为空");
			return false;
 		} 
  		if(title.length == 0){ 			
			showMsgBox(false,"链接简介是不是空的呀？");
			return false;
 		}		
		return true;
 	});

	$("#subarticle").click(function(){
 		var contentStr = $("#post_body").val();   
 		if(contentStr.length == 0){
			showMsgBox(false,"输入不能为空");
			return false;
 		}
 		 if(contentStr.length <  10){
			showMsgBox(false,"输入不能为空");
			return false;
 		}  	  	
		return true;
 	});

	$("#relatebtn").click(function(){ 
		var followuid = $(this).attr('data_id');  
		var follow = false;  
		if($(this).hasClass("followfri")){
			follow = true;
		}else{
			follow = false;
		}
		var params = {followuid:followuid,follow:follow}; 
		$.ajax({
			data: params,
			url: '/newrelation',
			dataType: 'json',
			cache: false,
			timeout: 5000,
			type: 'get',
			success: function(data){
				if(data.status === 'success'){
					if($("#relatebtn").hasClass("followfri")){
						$("#relatebtn").text("取消关注-");
					}else{
						$("#relatebtn").text("关注此人+");						
					}
					$("#relatebtn").toggleClass("unfollowfri"); 
					$("#relatebtn").toggleClass("followfri"); 
					showMsgBox(true,"操作成功!!"); 
					return ;
				}
				if(data.status === "failed"){ 
					showMsgBox(false,"请先登录!!");
				}
				if(data.status === "error"){ 
					showMsgBox(false,"发生错误!!"); 
				}
			}
		});
	});  



	$(".likebtn,.unlikebtn").click(function(){ 
		var currObj = $(this);
		var tid = currObj.attr('data-tid');  
		var islike = true;   
		var text = '表过态'; 
		if(currObj.attr('title') === "赞"){
			islike = true; 
		}else{
			islike = false; 
		}
		var params = {tid:tid,islike:islike}; 
		$.ajax({
			data: params,
			url: '/like',
			dataType: 'json',
			cache: false,
			timeout: 5000,
			type: 'get',
			success: function(data){
				if(data.status === 0 ){
					var numlike = (currObj.children('span').text() === '')?0:currObj.children('span').text();
					currObj.children('span').text(numlike -(-1));	
					showMsgBox(true,"操作成功!!");	 
					return ;
				} 
				if(data.status === 1){    
					showMsgBox(false,"请先登录!!");		 
					return ;
				}
				if(data.status === 2){ 
					showMsgBox(false,"已经"+text+"了!!");	  
					return ;
				}
				if(data.status === 3){ 
					showMsgBox(false,"发生错误!!");
					return ;
				}
			}
		});
	}); 
 
	$(".deleteitem").click(function(){ 
		if(confirm("你确定提交吗？")) {  
			var currObj = $(this);
			var tid = currObj.attr('data-tid');   
			var params = {tid:tid};  
			$.ajax({
				data: params,
				url: '/deletearticle',
				dataType: 'json',
				cache: false,
				timeout: 5000,
				type: 'get',
				success: function(data){
					if(data.status === 0 ){
					 	currObj.parentsUntil('.user_near_article').remove();
					 	gmxgbox.addClass("msgbox_success"); 
						gmxgbox.text("删除成功!!");  		
						gmxgbox.removeClass("msgboxout");
						gmxgbox.addClass("msgboxin");	
						setTimeout(msgout,1500)
						return ;
					}  
					if(data.status === 3){
						$("#likeerr").remove();
						gmxgbox.addClass("msgbox_success"); 
						gmxgbox.text("发生错误!!");  		
						gmxgbox.removeClass("msgboxout");
						gmxgbox.addClass("msgboxin");	
						setTimeout(msgout,1500) 
						return ;
					}
				}
			});
		}
	}); 

	function fucCheckLength(strTemp) { 
		var i,sum;
		sum=0;
		for(i=0;i<strTemp.length;i++) { 
			if ((strTemp.charCodeAt(i)>=0) && (strTemp.charCodeAt(i)<=255)) {
				sum=sum+1;
			}else {
				sum=sum+2;
			}
		}
		return sum; 
	}

	$("#regBtnSub").click(function(){ 
		var email=$('#email').val(),
		name=$('#uname').val(),
		pwd=$('#pwd').val(),
		pwdagain=$('#pwdagain').val(), 
		reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/; 
		$(".msgbox").empty(); 
		if(!reg.test(email)){
			var textinfo="<div class='alertsty' role='alert'>邮箱格式不正确,请重新输入</div>";
			$(".msgbox").append(textinfo);
			$('#email').focus();
			return false;
		} 
		if(fucCheckLength(name) < 6){
			var textinfo="<div class='alertsty' role='alert'>账户最少超过6个字符哦</div>";
			$(".msgbox").append(textinfo);
			$('#name').focus();
			return false;
		}
		if(fucCheckLength(pwd) < 6){
			var textinfo="<div class='alertsty' role='alert'>密码过于简单..</div>";
			$(".msgbox").append(textinfo);
			$('#pwd').focus();
			return false;
		}
		if(pwd != pwdagain){
			var textinfo="<div class='alertsty' role='alert'>两次输入不一样</div>";
			$(".msgbox").append(textinfo);
			$('#pwdagain').focus();
			return false;
		}  
		return true;
	});

	$("#loginBtnSub").click(function(){ 
		var	name=$('#uname').val();
		var pwd=$('#pwd').val();  
		$(".msgbox").empty();   
		if(name.length === 0){
			var textinfo="<div class='alertsty' role='alert'>账户为空</div>";
			$(".msgbox").append(textinfo);
			$('#name').focus();
			return false;
		}
		if(pwd.length === 0){
			var textinfo="<div class='alertsty' role='alert'>密码为空</div>";
			$(".msgbox").append(textinfo);
			$('#pwd').focus();
			return false;
		} 
		return true;
	});


	$("#tab_share_on").click(function(){
		$("#tab_link").removeClass("tab_on");
		$("#tab_link").addClass("tab_off");
		$("#tab_share").removeClass("tab_off");
		$("#tab_share").addClass("tab_on");
		$(this).addClass("share_tab_active");
		$("#tab_link_on").removeClass("share_tab_active");
	});

	$("#tab_link_on").click(function(){
		$("#tab_share").removeClass("tab_on");
		$("#tab_share").addClass("tab_off");
		$("#tab_link").removeClass("tab_off");
		$("#tab_link").addClass("tab_on");
		$(this).addClass("share_tab_active");
		$("#tab_share_on").removeClass("share_tab_active");
	});

	var replyform = function(tid,rid,ruid,runame){
		var tinput = '<input type="hidden" name="tid" value="'+tid+'">';
		var rinput = '<input type="hidden" name="rid" value="'+rid+'">';
		var ruidinput = '<input type="hidden" name="ruid" value="'+ruid+'">';
		var rnameinput = '<input type="hidden" name="runame" value="'+runame+'">';
		var textarea = '<textarea row="3" name="repstr" class="atreply" id="replytoreply" style="width:100%"></textarea>';
		var btnrep = '<div class="inputopt"><button type="submit" class="btn  btn-sm">回复</button></div>';
		var formhead = '<form id="replywrap" class="navbar-form" action="/reply" method="post">';
		var formtail= '</form>';
		return formhead + textarea + tinput + rinput + ruidinput + rnameinput + btnrep + formtail;
	}

	$(".replyat").click(function(){
		$("#replywrap").remove();
		var tid = $(this).attr("data-tid");
		var rid = $(this).attr("data-rid");
		var ruid = $(this).attr("data-ruid");
		var runame = $(this).attr("data-runame");
		var replyformstr = replyform(tid,rid,ruid,runame);
		$(this).parent().parent().parent().children('.reply_content').after(replyformstr);	
		$('#replytoreply').focus();	
		$('#replytoreply').val('@'+runame+' ');
		return false;
	});

	$("#add_label").click(function(){
		$("#add_label").css("display","none")
		$("#label_input").css("display","block")
	});
	$("#add_title").click(function(){
		$("#add_title").css("display","none")
		$("#title_input").css("display","block")
	});


	$(".leftwrap").delegate(".replyclose","click",function(){
		$("#replywrap").remove(); 	
		return false;		
	}); 

	$('textarea.atreply').keydown(function(event) {
		if (event.keyCode == 13 && (event.ctrlKey || event.metaKey)) {
			event.preventDefault()
			$(this).closest('form').submit()
		}
	}); 

	$('textarea.atreply').live("focus",function() { 
		$(this).css("height","80px");
		$(this).parent().find(".inputopt").css("display","inline-block");
	});  
	$('textarea.atreply').live("blur",function() { 
		var replyContent = $(this).val();
		if(replyContent.length == 0){
			$(this).css("height","30px");
			$(this).parent().find(".inputopt").css("display","none");			
		}
	}); 

	$("#subarticle").click(function(){
		var replyContent = $("textarea.atreply").val();
		if(replyContent.length == 0){
			showMsgBox(false,"cccc");
			return false;
		}
		return true;
	}); 

}) 