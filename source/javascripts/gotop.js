// JavaScript Document
function goTopEx(){
        var TopObj=document.getElementById("goTopBtn"); 
        function getScrollTop(){
                return document.documentElement.scrollTop|document.body.scrollTop;
            }
        function setScrollTop(value){
                document.documentElement.scrollTop=value;
                document.body.scrollTop=value;
            }    
        window.onscroll=function(){getScrollTop()>60?TopObj.style.display="":TopObj.style.display="none";}
        TopObj.onclick=function(){
            var goTop=setInterval(scrollMove,10);
            function scrollMove(){
                    setScrollTop(getScrollTop()/1.1);
                    if(getScrollTop()<1)clearInterval(goTop);
                }
        } 
}
 