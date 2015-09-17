(function() {
    ! function(a) {
        return "function" == typeof define && define.amd ? define(["jquery"], a) : a(window.jQuery)
    }(function(a) {
        var b, c, d, e, f, g, h, i, j, k = [].slice;
        d = function() {
            function b(b) {
                this.current_flag = null, this.controllers = {}, this.alias_maps = {}, this.$inputor = a(b), this.iframe = null, this.setIframe(), this.listen()
            }
            return b.prototype.setIframe = function(a) {
                var b;
                if (a) return this.window = a.contentWindow, this.document = a.contentDocument || this.window.document, this.iframe = a, this;
                this.document = this.$inputor[0].ownerDocument, this.window = this.document.defaultView || this.document.parentWindow;
                try {
                    return this.iframe = this.window.frameElement
                } catch (c) {
                    b = c
                }
            }, b.prototype.controller = function(a) {
                var b, c, d, e;
                if (this.alias_maps[a]) c = this.controllers[this.alias_maps[a]];
                else {
                    e = this.controllers;
                    for (d in e)
                        if (b = e[d], d === a) {
                            c = b;
                            break
                        }
                }
                return c ? c : this.controllers[this.current_flag]
            }, b.prototype.set_context_for = function(a) {
                return this.current_flag = a, this
            }, b.prototype.reg = function(a, b) {
                var c, d;
                return c = (d = this.controllers)[a] || (d[a] = new f(this, a)), b.alias && (this.alias_maps[b.alias] = a), c.init(b), this
            }, b.prototype.listen = function() {
                return this.$inputor.on("keyup.atwhoInner", function(a) {
                    return function(b) {
                        return a.on_keyup(b)
                    }
                }(this)).on("keydown.atwhoInner", function(a) {
                    return function(b) {
                        return a.on_keydown(b)
                    }
                }(this)).on("scroll.atwhoInner", function(a) {
                    return function() {
                        var b;
                        return null != (b = a.controller()) ? b.view.hide() : void 0
                    }
                }(this)).on("blur.atwhoInner", function(a) {
                    return function() {
                        var b;
                        return (b = a.controller()) ? b.view.hide(b.get_opt("display_timeout")) : void 0
                    }
                }(this))
            }, b.prototype.shutdown = function() {
                var a, b, c;
                c = this.controllers;
                for (b in c) a = c[b], a.destroy(), delete this.controllers[b];
                return this.$inputor.off(".atwhoInner")
            }, b.prototype.dispatch = function() {
                return a.map(this.controllers, function(a) {
                    return function(b) {
                        var c;
                        return (c = b.get_opt("delay")) ? (clearTimeout(a.delayedCallback), a.delayedCallback = setTimeout(function() {
                            return b.look_up() ? a.set_context_for(b.at) : void 0
                        }, c)) : b.look_up() ? a.set_context_for(b.at) : void 0
                    }
                }(this))
            }, b.prototype.on_keyup = function(b) {
                var c;
                switch (b.keyCode) {
                    case h.ESC:
                        b.preventDefault(), null != (c = this.controller()) && c.view.hide();
                        break;
                    case h.DOWN:
                    case h.UP:
                    case h.CTRL:
                        a.noop();
                        break;
                    case h.P:
                    case h.N:
                        b.ctrlKey || this.dispatch();
                        break;
                    default:
                        this.dispatch()
                }
            }, b.prototype.on_keydown = function(b) {
                var c, d;
                if (c = null != (d = this.controller()) ? d.view : void 0, c && c.visible()) switch (b.keyCode) {
                    case h.ESC:
                        b.preventDefault(), c.hide();
                        break;
                    case h.UP:
                        b.preventDefault(), c.prev();
                        break;
                    case h.DOWN:
                        b.preventDefault(), c.next();
                        break;
                    case h.P:
                        if (!b.ctrlKey) return;
                        b.preventDefault(), c.prev();
                        break;
                    case h.N:
                        if (!b.ctrlKey) return;
                        b.preventDefault(), c.next();
                        break;
                    case h.TAB:
                    case h.ENTER:
                        if (!c.visible()) return;
                        b.preventDefault(), c.choosing = !0, c.choose();
                        break;
                    default:
                        a.noop()
                }
            }, b
        }(), f = function() {
            function c(c, d) {
                this.app = c, this.at = d, this.$inputor = this.app.$inputor, this.id = this.$inputor[0].id || this.uid(), this.setting = null, this.query = null, this.pos = 0, this.cur_rect = null, this.range = null, b.append(this.$el = a("<div id='atwho-ground-" + this.id + "'></div>")), this.model = new i(this), this.view = new j(this)
            }
            return c.prototype.uid = function() {
                return (Math.random().toString(16) + "000000000").substr(2, 8) + (new Date).getTime()
            }, c.prototype.init = function(b) {
                return this.setting = a.extend({}, this.setting || a.fn.atwho["default"], b), this.view.init(), this.model.reload(this.setting.data)
            }, c.prototype.destroy = function() {
                return this.trigger("beforeDestroy"), this.model.destroy(), this.view.destroy(), this.$el.remove()
            }, c.prototype.call_default = function() {
                var b, c, d;
                d = arguments[0], b = 2 <= arguments.length ? k.call(arguments, 1) : [];
                try {
                    return g[d].apply(this, b)
                } catch (e) {
                    return c = e, a.error("" + c + " Or maybe At.js doesn't have function " + d)
                }
            }, c.prototype.trigger = function(a, b) {
                var c, d;
                return null == b && (b = []), b.push(this), c = this.get_opt("alias"), d = c ? "" + a + "-" + c + ".atwho" : "" + a + ".atwho", this.$inputor.trigger(d, b)
            }, c.prototype.callbacks = function(a) {
                return this.get_opt("callbacks")[a] || g[a]
            }, c.prototype.get_opt = function(a) {
                var b;
                try {
                    return this.setting[a]
                } catch (c) {
                    return b = c, null
                }
            }, c.prototype.content = function() {
                return this.$inputor.is("textarea, input") ? this.$inputor.val() : this.$inputor.text()
            }, c.prototype.catch_query = function() {
                var a, b, c, d, e, f;
                return b = this.content(), a = this.$inputor.caret("pos"), f = b.slice(0, a), d = this.callbacks("matcher").call(this, this.at, f, this.get_opt("start_with_space")), "string" == typeof d && d.length <= this.get_opt("max_len", 20) ? (e = a - d.length, c = e + d.length, this.pos = e, d = {
                    text: d,
                    head_pos: e,
                    end_pos: c
                }, this.trigger("matched", [this.at, d.text])) : (d = null, this.view.hide()), this.query = d
            }, c.prototype.rect = function() {
                var a, b;
                if (a = this.$inputor.caret({
                    iframe: this.app.iframe
                }).caret("offset", this.pos - 1)) return "true" === this.$inputor.attr("contentEditable") && (a = this.cur_rect || (this.cur_rect = a) || a), b = this.app.document.selection ? 0 : 2, {
                    left: a.left,
                    top: a.top,
                    bottom: a.top + a.height + b
                }
            }, c.prototype.reset_rect = function() {
                return "true" === this.$inputor.attr("contentEditable") ? this.cur_rect = null : void 0
            }, c.prototype.mark_range = function() {
                return "true" === this.$inputor.attr("contentEditable") && (this.app.window.getSelection && (this.range = this.app.window.getSelection().getRangeAt(0)), this.app.document.selection) ? this.ie8_range = this.app.document.selection.createRange() : void 0
            }, c.prototype.insert_content_for = function(b) {
                var c, d, e;
                return d = b.data("value"), e = this.get_opt("insert_tpl"), this.$inputor.is("textarea, input") || !e ? d : (c = a.extend({}, b.data("item-data"), {
                    "atwho-data-value": d,
                    "atwho-at": this.at
                }), this.callbacks("tpl_eval").call(this, e, c))
            }, c.prototype.insert = function(b, c) {
                var d, e, f, g, h, i, j, k, l, m, n;
                return d = this.$inputor, "true" === d.attr("contentEditable") && (f = "atwho-view-flag atwho-view-flag-" + (this.get_opt("alias") || this.at), g = "" + b + "<span contenteditable='false'>&nbsp;<span>", h = "<span contenteditable='false' class='" + f + "'>" + g + "</span>", e = a(h, this.app.document).data("atwho-data-item", c.data("item-data")), this.app.document.selection && (e = a("<span contenteditable='true'></span>", this.app.document).html(e))), d.is("textarea, input") ? (b = this.get_opt("space_after") ? b + " " : "" + b, l = d.val(), m = l.slice(0, Math.max(this.query.head_pos - this.at.length, 0)), n = "" + m + b + l.slice(this.query.end_pos || 0), d.val(n), d.caret("pos", m.length + b.length)) : (j = this.range) ? (i = j.startOffset - (this.query.end_pos - this.query.head_pos) - this.at.length, j.setStart(j.endContainer, Math.max(i, 0)), j.setEnd(j.endContainer, j.endOffset), j.deleteContents(), j.insertNode(e[0]), j.collapse(!1), k = this.app.window.getSelection(), k.removeAllRanges(), k.addRange(j)) : (j = this.ie8_range) && (j.moveStart("character", this.query.end_pos - this.query.head_pos - this.at.length), j.pasteHTML(g), j.collapse(!1), j.select()), d.is(":focus") || d.focus(), d.change()
            }, c.prototype.render_view = function(a) {
                var b;
                return b = this.get_opt("search_key"), a = this.callbacks("sorter").call(this, this.query.text, a.slice(0, 1001), b), this.view.render(a.slice(0, this.get_opt("limit")))
            }, c.prototype.look_up = function() {
                var b, c;
                if (b = this.catch_query()) return c = function(a) {
                    return a && a.length > 0 ? this.render_view(a) : this.view.hide()
                }, this.model.query(b.text, a.proxy(c, this)), b
            }, c
        }(), i = function() {
            function b(a) {
                this.context = a, this.at = this.context.at, this.storage = this.context.$inputor
            }
            return b.prototype.destroy = function() {
                return this.storage.data(this.at, null)
            }, b.prototype.saved = function() {
                return this.fetch() > 0
            }, b.prototype.query = function(a, b) {
                var c, d, e;
                return c = this.fetch(), d = this.context.get_opt("search_key"), c = this.context.callbacks("filter").call(this.context, a, c, d) || [], e = this.context.callbacks("remote_filter"), c.length > 0 || !e && 0 === c.length ? b(c) : e.call(this.context, a, b)
            }, b.prototype.fetch = function() {
                return this.storage.data(this.at) || []
            }, b.prototype.save = function(a) {
                return this.storage.data(this.at, this.context.callbacks("before_save").call(this.context, a || []))
            }, b.prototype.load = function(a) {
                return !this.saved() && a ? this._load(a) : void 0
            }, b.prototype.reload = function(a) {
                return this._load(a)
            }, b.prototype._load = function(b) {
                return "string" == typeof b ? a.ajax(b, {
                    dataType: "json"
                }).done(function(a) {
                    return function(b) {
                        return a.save(b)
                    }
                }(this)) : this.save(b)
            }, b
        }(), j = function() {
            function b(b) {
                this.context = b, this.$el = a("<div class='atwho-view'><ul class='atwho-view-ul'></ul></div>"), this.timeout_id = null, this.context.$el.append(this.$el), this.bind_event()
            }
            return b.prototype.init = function() {
                var a;
                return a = this.context.get_opt("alias") || this.context.at.charCodeAt(0), this.$el.attr({
                    id: "at-view-" + a
                })
            }, b.prototype.destroy = function() {
                return this.$el.remove()
            }, b.prototype.bind_event = function() {
                var b;
                return b = this.$el.find("ul"), b.on("mouseenter.atwho-view", "li", function(c) {
                    return b.find(".cur").removeClass("cur"), a(c.currentTarget).addClass("cur")
                }).on("click", function(a) {
                    return function(b) {
                        return a.click_event = b, a.choose(), b.preventDefault()
                    }
                }(this))
            }, b.prototype.visible = function() {
                return this.$el.is(":visible")
            }, b.prototype.choose = function() {
                var a, b;
                return (a = this.$el.find(".cur")).length ? (b = this.context.insert_content_for(a), this.context.insert(this.context.callbacks("before_insert").call(this.context, b, a), a), this.context.trigger("inserted", [a, this.click_event]), this.hide()) : void 0
            }, b.prototype.reposition = function(b) {
                var c, d;
                return b.bottom + this.$el.height() - a(window).scrollTop() > a(window).height() && (b.bottom = b.top - this.$el.height()), c = {
                    left: b.left,
                    top: b.bottom
                }, null != (d = this.context.callbacks("before_reposition")) && d.call(this.context, c), this.$el.offset(c), this.context.trigger("reposition", [c])
            }, b.prototype.next = function() {
                var a, b;
                return a = this.$el.find(".cur").removeClass("cur"), b = a.next(), b.length || (b = this.$el.find("li:first")), b.addClass("cur")
            }, b.prototype.prev = function() {
                var a, b;
                return a = this.$el.find(".cur").removeClass("cur"), b = a.prev(), b.length || (b = this.$el.find("li:last")), b.addClass("cur")
            }, b.prototype.show = function() {
                var a;
                return this.choosing ? void(this.choosing = !1) : (this.context.mark_range(), this.visible() || (this.$el.show(), this.context.trigger("shown")), (a = this.context.rect()) ? this.reposition(a) : void 0)
            }, b.prototype.hide = function(a) {
                var b;
                if (this.visible()) return isNaN(a) ? (this.context.reset_rect(), this.$el.hide(), this.context.trigger("hidden", [this.click_event]), this.click_event = void 0) : (b = function(a) {
                    return function() {
                        return a.hide()
                    }
                }(this), clearTimeout(this.timeout_id), this.timeout_id = setTimeout(b, a))
            }, b.prototype.render = function(b) {
                var c, d, e, f, g, h, i;
                if (!(a.isArray(b) && b.length > 0)) return void this.hide();
                for (this.$el.find("ul").empty(), d = this.$el.find("ul"), g = this.context.get_opt("tpl"), h = 0, i = b.length; i > h; h++) e = b[h], e = a.extend({}, e, {
                    "atwho-at": this.context.at
                }), f = this.context.callbacks("tpl_eval").call(this.context, g, e), c = a(this.context.callbacks("highlighter").call(this.context, f, this.context.query.text)), c.data("item-data", e), d.append(c);
                return this.show(), this.context.get_opt("highlight_first") ? d.find("li:first").addClass("cur") : void 0
            }, b
        }(), h = {
            DOWN: 40,
            UP: 38,
            ESC: 27,
            TAB: 9,
            ENTER: 13,
            CTRL: 17,
            P: 80,
            N: 78
        }, g = {
            before_save: function(b) {
                var c, d, e, f;
                if (!a.isArray(b)) return b;
                for (f = [], d = 0, e = b.length; e > d; d++) c = b[d], f.push(a.isPlainObject(c) ? c : {
                    name: c
                });
                return f
            },
            matcher: function(a, b, c) {
                var d, e;
                return a = a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), c && (a = "(?:^|\\s)" + a), e = new RegExp(a + "([A-Za-z0-9_+-]*)$|" + a + "([^\\x00-\\xff]*)$", "gi"), d = e.exec(b), d ? d[2] || d[1] : null
            },
            filter: function(a, b, c) {
                var d, e, f, g;
                for (g = [], e = 0, f = b.length; f > e; e++) d = b[e], ~d[c].toLowerCase().indexOf(a.toLowerCase()) && g.push(d);
                return g
            },
            remote_filter: null,
            sorter: function(a, b, c) {
                var d, e, f, g;
                if (!a) return b;
                for (g = [], e = 0, f = b.length; f > e; e++) d = b[e], d.atwho_order = d[c].toLowerCase().indexOf(a.toLowerCase()), d.atwho_order > -1 && g.push(d);
                return g.sort(function(a, b) {
                    return a.atwho_order - b.atwho_order
                })
            },
            tpl_eval: function(a, b) {
                var c;
                try {
                    return a.replace(/\$\{([^\}]*)\}/g, function(a, c) {
                        return b[c]
                    })
                } catch (d) {
                    return c = d, ""
                }
            },
            highlighter: function(a, b) {
                var c;
                return b ? (c = new RegExp(">\\s*(\\w*?)(" + b.replace("+", "\\+") + ")(\\w*)\\s*<", "ig"), a.replace(c, function(a, b, c, d) {
                    return "> " + b + "<strong>" + c + "</strong>" + d + " <"
                })) : a
            },
            before_insert: function(a) {
                return a
            }
        }, c = {
            load: function(a, b) {
                var c;
                return (c = this.controller(a)) ? c.model.load(b) : void 0
            },
            getInsertedItemsWithIDs: function(b) {
                var c, d, e;
                return (c = this.controller(b)) ? (b && (b = "-" + (c.get_opt("alias") || c.at)), d = [], e = a.map(this.$inputor.find("span.atwho-view-flag" + (b || "")), function(b) {
                    var c;
                    return c = a(b).data("atwho-data-item"), d.indexOf(c.id) > -1 ? void 0 : (c.id && (d.push = c.id), c)
                }), [d, e]) : [null, null]
            },
            getInsertedItems: function(a) {
                return c.getInsertedItemsWithIDs.apply(this, [a])[1]
            },
            getInsertedIDs: function(a) {
                return c.getInsertedItemsWithIDs.apply(this, [a])[0]
            },
            setIframe: function(a) {
                return this.setIframe(a)
            },
            run: function() {
                return this.dispatch()
            },
            destroy: function() {
                return this.shutdown(), this.$inputor.data("atwho", null)
            }
        }, e = {
            init: function(b) {
                var c, e;
                return e = (c = a(this)).data("atwho"), e || c.data("atwho", e = new d(this)), e.reg(b.at, b), this
            }
        }, b = a("<div id='atwho-container'></div>"), a.fn.atwho = function(d) {
            var f, g;
            return g = arguments, a("body").append(b), f = null, this.filter("textarea, input, [contenteditable=true]").each(function() {
                var b;
                return "object" != typeof d && d ? c[d] ? (b = a(this).data("atwho")) ? f = c[d].apply(b, Array.prototype.slice.call(g, 1)) : void 0 : a.error("Method " + d + " does not exist on jQuery.caret") : e.init.apply(this, g)
            }), f || this
        }, a.fn.atwho["default"] = {
            at: void 0,
            alias: void 0,
            space_after: !0,
            data: null,
            tpl: "<li data-value='${atwho-at}${name}'>${name}</li>",
            insert_tpl: "<span>${atwho-data-value}</span>",
            callbacks: g,
            search_key: "name",
            start_with_space: !0,
            highlight_first: !0,
            limit: 5,
            max_len: 20,
            display_timeout: 300,
            delay: null
        }
    })
}).call(this);