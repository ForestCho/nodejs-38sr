/*! jquery.caret 2014-04-18 */
(function() {
    ! function(a) {
        return "function" == typeof define && define.amd ? define(["jquery"], a) : a(window.jQuery)
    }(function(a) {
        "use strict";
        var b, c, d, e, f, g, h, i, j, k, l;
        return k = "caret", b = function() {
            function b(a) {
                this.$inputor = a, this.domInputor = this.$inputor[0]
            }
            return b.prototype.setPos = function() {
                return this.domInputor
            }, b.prototype.getIEPosition = function() {
                return a.noop()
            }, b.prototype.getPosition = function() {
                return a.noop()
            }, b.prototype.getOldIEPos = function() {
                var a, b;
                return b = h.selection.createRange(), a = h.body.createTextRange(), a.moveToElementText(this.domInputor), a.setEndPoint("EndToEnd", b), a.text.length
            }, b.prototype.getPos = function() {
                var a, b, c;
                return (c = this.range()) ? (a = c.cloneRange(), a.selectNodeContents(this.domInputor), a.setEnd(c.endContainer, c.endOffset), b = a.toString().length, a.detach(), b) : h.selection ? this.getOldIEPos() : void 0
            }, b.prototype.getOldIEOffset = function() {
                var a, b;
                return a = h.selection.createRange().duplicate(), a.moveStart("character", -1), b = a.getBoundingClientRect(), {
                    height: b.bottom - b.top,
                    left: b.left,
                    top: b.top
                }
            }, b.prototype.getOffset = function() {
                var b, c, d, e;
                if (j.getSelection && (d = this.range())) {
                    if (d.endOffset - 1 < 0) return null;
                    b = d.cloneRange(), b.setStart(d.endContainer, d.endOffset - 1), b.setEnd(d.endContainer, d.endOffset), e = b.getBoundingClientRect(), c = {
                        height: e.height,
                        left: e.left + e.width,
                        top: e.top
                    }, b.detach()
                } else h.selection && (c = this.getOldIEOffset());
                return c && !i && (c.top += a(j).scrollTop(), c.left += a(j).scrollLeft()), c
            }, b.prototype.range = function() {
                var a;
                if (j.getSelection) return a = j.getSelection(), a.rangeCount > 0 ? a.getRangeAt(0) : null
            }, b
        }(), c = function() {
            function b(a) {
                this.$inputor = a, this.domInputor = this.$inputor[0]
            }
            return b.prototype.getIEPos = function() {
                var a, b, c, d, e, f, g;
                return b = this.domInputor, f = h.selection.createRange(), e = 0, f && f.parentElement() === b && (d = b.value.replace(/\r\n/g, "\n"), c = d.length, g = b.createTextRange(), g.moveToBookmark(f.getBookmark()), a = b.createTextRange(), a.collapse(!1), e = g.compareEndPoints("StartToEnd", a) > -1 ? c : -g.moveStart("character", -c)), e
            }, b.prototype.getPos = function() {
                return h.selection ? this.getIEPos() : this.domInputor.selectionStart
            }, b.prototype.setPos = function(a) {
                var b, c;
                return b = this.domInputor, h.selection ? (c = b.createTextRange(), c.move("character", a), c.select()) : b.setSelectionRange && b.setSelectionRange(a, a), b
            }, b.prototype.getIEOffset = function(a) {
                var b, c, d, e;
                return c = this.domInputor.createTextRange(), a || (a = this.getPos()), c.move("character", a), d = c.boundingLeft, e = c.boundingTop, b = c.boundingHeight, {
                    left: d,
                    top: e,
                    height: b
                }
            }, b.prototype.getOffset = function(b) {
                var c, d, e;
                return c = this.$inputor, h.selection ? (d = this.getIEOffset(b), d.top += a(j).scrollTop() + c.scrollTop(), d.left += a(j).scrollLeft() + c.scrollLeft(), d) : (d = c.offset(), e = this.getPosition(b), d = {
                    left: d.left + e.left - c.scrollLeft(),
                    top: d.top + e.top - c.scrollTop(),
                    height: e.height
                })
            }, b.prototype.getPosition = function(a) {
                var b, c, e, f, g, h;
                return b = this.$inputor, e = function(a) {
                    return a.replace(/</g, "&lt").replace(/>/g, "&gt").replace(/`/g, "&#96").replace(/"/g, "&quot").replace(/\r\n|\r|\n/g, "<br />")
                }, void 0 === a && (a = this.getPos()), h = b.val().slice(0, a), f = "<span>" + e(h) + "</span>", f += "<span id='caret'>|</span>", g = new d(b), c = g.create(f).rect()
            }, b.prototype.getIEPosition = function(a) {
                var b, c, d, e, f;
                return d = this.getIEOffset(a), c = this.$inputor.offset(), e = d.left - c.left, f = d.top - c.top, b = d.height, {
                    left: e,
                    top: f,
                    height: b
                }
            }, b
        }(), d = function() {
            function b(a) {
                this.$inputor = a
            }
            return b.prototype.css_attr = ["overflowY", "height", "width", "paddingTop", "paddingLeft", "paddingRight", "paddingBottom", "marginTop", "marginLeft", "marginRight", "marginBottom", "fontFamily", "borderStyle", "borderWidth", "wordWrap", "fontSize", "lineHeight", "overflowX", "text-align"], b.prototype.mirrorCss = function() {
                var b, c = this;
                return b = {
                    position: "absolute",
                    left: -9999,
                    top: 0,
                    zIndex: -2e4,
                    "white-space": "pre-wrap"
                }, a.each(this.css_attr, function(a, d) {
                    return b[d] = c.$inputor.css(d)
                }), b
            }, b.prototype.create = function(b) {
                return this.$mirror = a("<div></div>"), this.$mirror.css(this.mirrorCss()), this.$mirror.html(b), this.$inputor.after(this.$mirror), this
            }, b.prototype.rect = function() {
                var a, b, c;
                return a = this.$mirror.find("#caret"), b = a.position(), c = {
                    left: b.left,
                    top: b.top,
                    height: a.height()
                }, this.$mirror.remove(), c
            }, b
        }(), e = {
            contentEditable: function(a) {
                return !(!a[0].contentEditable || "true" !== a[0].contentEditable)
            }
        }, g = {
            pos: function(a) {
                return a || 0 === a ? this.setPos(a) : this.getPos()
            },
            position: function(a) {
                return h.selection ? this.getIEPosition(a) : this.getPosition(a)
            },
            offset: function(b) {
                var c, d;
                return d = this.getOffset(b), i && (c = a(i).offset(), d.top += c.top, d.left += c.left), d
            }
        }, h = null, j = null, i = null, l = function(a) {
            return i = a, j = a.contentWindow, h = a.contentDocument || j.document
        }, f = function(b, c) {
            var d, e;
            if (a.isPlainObject(c) && (e = c.iframe)) return b.data("caret-iframe", e), l(e);
            if (e = b.data("caret-iframe")) return l(e);
            h = b[0].ownerDocument, j = h.defaultView || h.parentWindow;
            try {
                return i = j.frameElement
            } catch (f) {
                d = f
            }
        }, a.fn.caret = function(d) {
            var h;
            return "object" == typeof d ? (f(this, d), this) : g[d] ? (f(this), h = e.contentEditable(this) ? new b(this) : new c(this), g[d].apply(h, Array.prototype.slice.call(arguments, 1))) : a.error("Method " + d + " does not exist on jQuery.caret")
        }, a.fn.caret.EditableCaret = b, a.fn.caret.InputCaret = c, a.fn.caret.Utils = e, a.fn.caret.apis = g
    })
}).call(this);