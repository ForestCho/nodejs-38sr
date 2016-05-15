'use strict';

! function(W, D) {


	function msgBox(options) {
		this.options = options; 
		this.gmsgbox = D.createElement("div");
		this.gmsgbox.className = "gmsgbox msgboxout" + (this.options.pop ? ' msgpop' : '');
		this.options.pNode.appendChild(this.gmsgbox);
		this.showMsgBox();

	}
	msgBox.prototype.msgOut = function() {
		var _this = this;
		setTimeout(function() {
			_this.gmsgbox.className = _this.gmsgbox.className.replace(/msgboxin/, 'msgboxout');
		}, _this.options.dur);
		setTimeout(function() {
			_this.options.pNode.removeChild(_this.gmsgbox);
		}, _this.options.dur + 2000);
	}
	msgBox.prototype.msgIn = function() {
		var _this = this;
		setTimeout(function() {
			_this.gmsgbox.className = _this.gmsgbox.className.replace(/msgboxout/, 'msgboxin');
		}, 200);
	}
	msgBox.prototype.showMsgBox = function() {
		this.gmsgbox.className = this.gmsgbox.className + " msgbox_" + this.options.flag;
		this.gmsgbox.innerHTML = this.options.text;
		this.msgIn();
		this.msgOut();
	}

	//{flag:1,text:'',pNode:,duratoin:4000,pop:true}
	function msgbox(options) {
		if (!options) return;
		var text = options.text === undefined ? ' ' : options.text;
		var flag = options.flag === undefined ? 'default' : options.flag;
		var dur = options.dur || 2000;
		var pop = options.pop === undefined ? false : true;
		var pNode = options.pNode === undefined ? D.getElementsByTagName("body")[0] : options.pNode;
		return new msgBox({
			text: text,
			flag: flag,
			pNode: pNode,
			dur: dur,
			pop:pop
		});
	}
	if (typeof define === 'function' && define.amd) {
		define('msgbox', [], function() {
			return msgbox;
		});
	}


	if (typeof module !== 'undefined') {
		module.exports = msgbox;
	} else if (typeof window !== 'undefined') {
		window.msgbox = msgbox;
	}

}(window, document);