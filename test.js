var urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;  
var url=urlReg.exec("https://cnodejs.org/topic/545aee5a3e1f39344c5b3b3e");  
console.log(url[0]);