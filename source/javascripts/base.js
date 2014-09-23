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

	$("#relatebtn").click(function(){ 
		var followuid = $(this).attr('data_id');  
		var follow = false; 
		if($(this).hasClass("followfri")){
			follow = false;
		}else{
			follow = true;
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
					return ;
				}
				if(data.status === "failed"){
					$("#followerror").remove();
					$("#relatebtn").after("<p id='followerror'>请先登录!!</p>"); 
					$("#followerror").fadeOut(3000);
				}
				if(data.status === "error"){
					$("#followerror").remove();
					$("#relatebtn").after("<p id='followerror'>发生错误!!</p>"); 
					$("#followerror").fadeOut(3000);
				}
			}
		});
	});  


$(".likebtn").click(function(){ 
	var currObj = $(this);
	var tid = currObj.attr('data-tid');  
	var islike = true;  
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
				return ;
			} 
			if(data.status === 1){  
				$("#likeerr").remove();
				currObj.parent().after("<p id='likeerr' style='text-align:center'>请先登录!!</p>"); 
				$("#likeerr").fadeOut(3000);
				return ;
			}
			if(data.status === 2){  
				$("#likeerr").remove();
				currObj.parent().after("<p id='likeerr' style='text-align:center'>已经加过油了!!</p>"); 
				$("#likeerr").fadeOut(3000);
				return ;
			}
			if(data.status === 3){
				$("#likeerr").remove();
				currObj.parent().after("<p id='likeerr' style='text-align:center'>发生错误!!</p>"); 
				$("#likeerr").fadeOut(3000);
				return ;
			}
		}
	});
}); 

$(".deleteitem").click(function(){ 
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
				return ;
			}  
			if(data.status === 3){
				$("#likeerr").remove();
				currObj.parent().after("<p id='likeerr' style='text-align:center'>发生错误!!</p>"); 
				$("#likeerr").fadeOut(3000);
				return ;
			}
		}
	});
}); 

	/*$(".articleitem").mouseover(function(){ 
		$(this).find("div.reply").css({"visibility":"visible"});
	});
	$(".articleitem").mouseout(function(){ 
		$(this).find("div.reply").css({"visibility":"hidden"});
	});*/
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



var replyform = function(tid,rid,ruid,runame){
	var tinput = '<input type="hidden" name="tid" value="'+tid+'">';
	var rinput = '<input type="hidden" name="rid" value="'+rid+'">';
	var ruidinput = '<input type="hidden" name="ruid" value="'+ruid+'">';
	var rnameinput = '<input type="hidden" name="runame" value="'+runame+'">';
	var textarea = '<textarea row="3" name="repstr" class="atreply" id="replytoreply" style="width:80%"></textarea>';
	var btnrep = '<div><button type="submit" class="btn  btn-sm">回复</button>';
	var btncancle = '<button type="button" class="btn replyclose btn-sm" style="margin-left:20px">取消</button></div>';
	var formhead = '<form id="replywrap" action="/reply" method="post">';
	var formtail= '</form>';
	return formhead + textarea + tinput + rinput + ruidinput + rnameinput + btnrep + btncancle + formtail;
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

}) 