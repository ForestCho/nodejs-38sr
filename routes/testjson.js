/*
 * GET about page.
 */

 exports.index = function (req, res) { 
 		var articlelist = {"data":[{"id":1,"author":'ccccadscd',"intro_words":'cc,aa',"comment_count":11,"item":'cccc','createtime':'cccc','from':'caosl','title':'cccc','intro':'ccc','pic':'http://srpic.b0.upaiyun.com/cimg/1419497857457_QQ%E5%9B%BE%E7%89%8720141225165654.jpg'}
 							,{"id":1,"author":'ccccadscd',"intro_words":'cc,aa',"comment_count":11,"item":'cdsfdsccc','createtime':'cccc','from':'caosl','title':'cccc','intro':'ccc','pic':'http://srpic.b0.upaiyun.com/cimg/1419488429021_vt4y1u9s.jpg'}
 		]};
 		res.json(articlelist); 
  }; 

  