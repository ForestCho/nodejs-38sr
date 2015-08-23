$(document).ready(function(){
	//触发首页网站信息的提示
	$(function () {
		$("[data-toggle='tooltip']").tooltip();
	    var options = {
	        animation: true,
	        trigger: 'focus' //触发tooltip的事件
	    }
	    $('.atip').tooltip(options);
	});

	$('.articleitem').hover(
		function(){
			$(this).find('.operwrap').css("opacity","1");  
		},
		function(){
			$(this).find('.operwrap').css("opacity","0.5");  
		}
	);

	//导航栏中搜索的效果
	var btnsearch = $(".btn-search"); 
	var btnclose = $(".btn-close"); 
	var formsearch = $(".form-search");
	var inputsearch = $("[name=searchstr]");
	btnsearch.click(function(){ 
		formsearch.addClass("active");
		inputsearch.focus();
	});
	btnclose.click(function(){
		formsearch.removeClass("active");
	});
	inputsearch.blur(function(){
		formsearch.removeClass("active");		
	}); 
})


	// JavaScript Document
	function goTopEx(){
	        var TopObj = document.getElementById("gotopbtn"); 
	        function getScrollTop(){
	                return document.documentElement.scrollTop|document.body.scrollTop;
	            }
	        function setScrollTop(value){
	                document.documentElement.scrollTop = value;
	                document.body.scrollTop = value;
	            }    
	        window.onscroll = function(){
	            getScrollTop()>60?TopObj.style.bottom = "80px":TopObj.style.bottom = "-45px";
	        }
	        TopObj.onclick = function(){
	            var goTop = setInterval(scrollMove,10);
	            function scrollMove(){
	                    setScrollTop(getScrollTop()/1.1);
	                    if(getScrollTop()<1){
	                        clearInterval(goTop);
	                    }
	                }
	        } 
	}
	$(window).scroll(function(){
	    var t = document.documentElement.scrollTop || document.body.scrollTop;
	    var navigate = document.getElementById("navigate" );
	    if( t >= 70){
	        navigate.style.cssText = "opacity: 0.9";
	    }else{
	        navigate.style.cssText = "opacity: 1";
	    }  
	});