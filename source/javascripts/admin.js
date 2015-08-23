$(document).ready(function(){ 
 	$("#addsite").click(function(){		
			var sname=$('#sname').val();
			var sdomain=$('#sdomain').val();
			var sbrief=$('#sbrief').val();
			var spic=$('#spic').val();
			var params = {sname:sname,sbrief:sbrief,sdomain:sdomain,spic:spic};
			$.ajax({
				data: params,
				url: '/addsite',
				dataType: 'json',
				cache: false,
				timeout: 5000,
				type: 'get',
				success: function(data){
					if(0 === data.status) { 
						$("#spanMessage").html("Site增加成功");
					} else {
						$("#spanMessage").html("Site增加失败");
					} 
				},
				error: function(){
						$("#spanMessage").html("ERROR");
				}
			});
		});
 	$("#updatesite").click(function(){		 
			var snname=$('#snname').val();
			var sndomain=$('#sndomain').val();
			var snbrief=$('#snbrief').val();
			var snpic=$('#snpic').val();
			var params = {snname:snname,snbrief:snbrief,sndomain:sndomain,snpic:snpic};
			$.ajax({
				data: params,
				url: '/updatesite',
				dataType: 'json',
				cache: false,
				timeout: 5000,
				type: 'get',
				success: function(data){
					if(0 === data.status) { 
						$("#spanMessage2").html("Site编辑成功");
					} else {
						$("#spanMessage2").html("Site编辑失败");
					} 
				},
				error: function(){
						$("#spanMessage2").html("ERROR");
				}
			});
		});
 	$("#sndomain").blur(function(){ 		
			var snameobj = $('#snname');
			var sdomainobj = $('#sndomain');
			var sbriefobj = $('#snbrief');
			var spicobj = $('#snpic');
			var domainName = sdomainobj.val();
			var params = {domainname:domainName};	
			$.ajax({
				data: params,
				url: '/getsite',
				dataType: 'json',
				cache: false,
				timeout: 5000,
				type: 'get',
				success: function(data){
					if(0 === data.status) {  
						snameobj.val(data.site.sname);
						sbriefobj.val(data.site.sbrief);
						spicobj.val(data.site.spic);
					} else {
						$("#spanMessage2").html("Site查找失败");
						snameobj.val("");
						sbriefobj.val("");
						spicobj.val("");
					} 
				},
				error: function(){
						$("#spanMessage2").html("ERROR");
				}
			});
 	});
}) 