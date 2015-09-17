<div class="articleitem" ng-repeat="article in articlelist">
	<div class="photowrap"><a class="userlink show-pop-async" data-uid=<%= article._creator.uid %> href="/user/<%= article._creator.name %>"><img src=<%= article._creator.photo %>></a></div>
	<div style="margin-left:55px;">
		<div>
			<a class="title" id=<%= article.tid %> href="/user/<%= article._creator.name %>"><%= article._creator.name %></a>
			<%
			if(article.location){
			%>
			在
			<span class="sitetext"><%- article.location %></span>
			<%}%>
			<% if(article.classify === 0){%>
			<span>说</span>
			<% if(article.title &&article.title.length > 0 ){%>
			<p class="item_title"><a href="/article/<%= article.tid %>"><%= article.title %></a></p>
			<%}%>
			<div class="msg_content"><%- article.newcontent %> </div>
			<%}else{%>
			<span>分享来自
				<%if(article._sid){%>
				<a href="#" class="sitetext" data-toggle="tooltip" data-placement="right" title="<%=article._sid.sbrief %>"><%=article._sid.sname %></a>
				<%}else{%>
				net
				<%}%>
				
			的快链</span>
			<%if(article._sid){%>
			<img class="sitepic" src="<%=article._sid.spic %>">
			<%}%>
			<p class="item_title"><a href="/redirect?url=<%= article.title %>" target="_blank"><%= article.content %><i class="fa fa-external-link"></i></a></p>
			<%}%>
		</div>
		<div class="msg_date"><i class="fa fa-clock-o"></i><%= article.convertdate  %>
			<div class="operwrap btn-group">
				<a class="viewbtn btn" data-tid="<%= article.tid %>" title="查看"><span><%= (article.view_count>0)?article.view_count:'' %></span><i class="fa fa-eye"></i></a>
				<a class="likebtn  btn" data-tid="<%= article.tid %>" title="赞"><span><%= (article.like_count>0)?article.like_count:'' %></span><i class="fa fa-chevron-up"></i></a>
				<a class="unlikebtn btn" data-tid="<%= article.tid %>" title="踩"><span><%= (article.unlike_count>0)?article.unlike_count:'' %></span><i class="fa fa-chevron-down"></i></a>
				<a class="replybtn btn" href="/article/<%= article.tid %>" title="吐糟"><%= (article.reply_count>0)?article.reply_count:'' %><i class="fa fa-comments"></i></a>
			</div>
		</div>
	</div>
	<div class="clearfix"></div>
</div>