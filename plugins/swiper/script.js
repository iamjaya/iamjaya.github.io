! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = t || self).Swiper = e()
}(this, function() {
    "use strict";
    function s(t, e) {
        for (var i = 0; i < e.length; i++) {
            var s = e[i];
            s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
        }
    }
    function e() {
        return (e = Object.assign || function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var s in i) Object.prototype.hasOwnProperty.call(i, s) && (t[s] = i[s])
            }
            return t
        }).apply(this, arguments)
    }
    function h(e, t) {
        void 0 === t && (t = []), Array.isArray(t) || (t = [t]);
        var i = t.filter(function(t) {
            return !new RegExp("\\b" + t + "\\b").test(e.className)
        });
        e.className = e.className + " " + i.join(" ")
    }
    function u(t, e) {
        void 0 === e && (e = []), Array.isArray(e) || (e = [e]), t.className = t.className.replace(new RegExp(e.map(function(t) {
            return "(\\b" + t + "\\b)"
        }).join("|") + "|(\\s+)", "g"), " ")
    }
    return function() {
        function i(t, e) {
            e = i.formatConfig(e), this.index = 0, this.scrolling = !1, this.config = e, this.supportTouch = Boolean("ontouchstart" in window || 0 < window.navigator.maxTouchPoints || 0 < window.navigator.msMaxTouchPoints || window.DocumentTouch && document instanceof DocumentTouch), "string" == typeof t && (t = document.body.querySelector(t)), this.$el = t, this.$el.style.overflow = "hidden", this.$wrapper = t.getElementsByClassName(e.wrapperClass)[0], this.$list = Array.from(t.getElementsByClassName(e.slideClass)), this.formEls = ["INPUT", "SELECT", "OPTION", "TEXTAREA", "BUTTON", "VIDEO"], this.initStatus(), this.update(), this.initPagination(), this.scroll(this.config.initialSlide), this.initWheel()
        }
        i.formatConfig = function(t) {
            return t.pagination && (t.pagination = e({
                clickable: !1,
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active"
            }, t.pagination)), t.mousewheel && (t.mousewheel = e({
                invert: !1,
                sensitivity: 1
            }, t.mousewheel)), e({}, {
                direction: "horizontal",
                touchRatio: 1,
                touchAngle: 45,
                longSwipesRatio: .5,
                initialSlide: 0,
                loop: !1,
                mousewheel: !1,
                pagination: !1,
                passiveListeners: !0,
                resistance: !0,
                resistanceRatio: .85,
                speed: 300,
                longSwipesMs: 300,
                intermittent: 0,
                spaceBetween: 0,
                slidePrevClass: "swiper-slide-prev",
                slideNextClass: "swiper-slide-next",
                slideActiveClass: "swiper-slide-active",
                slideClass: "swiper-slide",
                wrapperClass: "swiper-wrapper",
                touchStartPreventDefault: !0,
                touchStartForcePreventDefault: !1,
                touchMoveStopPropagation: !1
            }, {}, t)
        };
        var t = i.prototype;
        return t.getTransform = function(t) {
                return this.isHorizontal ? "translate3d(" + t + "px, 0, 0)" : "translate3d(0, " + t + "px, 0)"
            }, t.scroll = function(t, e) {
                var i = this;
                if (void 0 === t && (t = 0), void 0 === e && (e = !1), !this.scrolling || e) {
                    var s = this.config,
                        n = this.minIndex,
                        a = this.maxIndex,
                        o = (t = t < n ? n : a < t ? a : t) * this.boxSize;
                    this.scrolling = !0, this.$wrapper.style.transform = this.getTransform(-o);
                    var r = this.$list[t],
                        l = this.$list[t - 1],
                        c = this.$list[t + 1];
                    r && (h(r, s.slideActiveClass), u(r, [s.slidePrevClass, s.slideNextClass])), l && (h(l, s.slidePrevClass), u(l, [s.slideActiveClass, s.slideNextClass])), c && (h(c, s.slideNextClass), u(c, [s.slideActiveClass, s.slidePrevClass])), setTimeout(function() {
                        i.index = t, i.updatePagination()
                    }, this.config.speed), setTimeout(function() {
                        i.scrolling = !1
                    }, this.config.speed + this.config.intermittent)
                }
            }, t.scrollPixel = function(t) {
                this.config.resistance && (0 < t && 0 === this.index ? t = Math.pow(t, this.config.resistanceRatio) : t < 0 && this.index === this.maxIndex && (t = -1 * Math.pow(Math.abs(t), this.config.resistanceRatio)));
                var e = -this.index * this.boxSize;
                this.$wrapper.style.transform = this.getTransform(e + t)
            }, t.initPagination = function() {
                var s = this,
                    n = this.config;
                if (n.pagination) {
                    var t = "string" == typeof n.pagination.el ? document.body.querySelector(n.pagination.el) : n.pagination.el;
                    t.innerHTML = "";
                    var a = [],
                        o = document.createDocumentFragment();
                    this.$pageList = a, this.$list.forEach(function(t, e) {
                        var i = document.createElement("div");
                        e === s.index ? i.className = n.pagination.bulletClass + " " + n.pagination.bulletActiveClass : i.className = "" + n.pagination.bulletClass, a.push(i), o.appendChild(i)
                    }), t.appendChild(o), n.pagination.clickable && t.addEventListener("click", function(t) {
                        if (!s.scrolling) {
                            var e = a.indexOf(t.target);
                            e < 0 || s.scroll(e)
                        }
                    })
                }
            }, t.initStatus = function() {
                this.touchStatus = {
                    touchTracks: [],
                    offset: 0,
                    touchStartTime: 0,
                    isTouchStart: !1,
                    isScrolling: !1,
                    isTouching: !1
                }
            }, t.initWheel = function() {
                function t(t) {
                    var e = o.touchStatus,
                        i = o.config.touchStartPreventDefault && -1 === o.formEls.indexOf(t.target.nodeName) || o.config.touchStartForcePreventDefault;
                    o.$wrapper.style.transition = "none", e.isTouchStart = !0, e.touchStartTime = Date.now(), e.touchTracks.push({
                        x: r ? t.touches[0].pageX : t.pageX,
                        y: r ? t.touches[0].pageY : t.pageY
                    }), i && !o.config.passiveListeners && t.preventDefault()
                }
                function e(t) {
                    var e = o.config,
                        i = o.touchStatus;
                    if (i.isTouchStart && !i.isScrolling) {
                        e.touchMoveStopPropagation && t.stopPropagation();
                        var s = {
                                x: r ? t.touches[0].pageX : t.pageX,
                                y: r ? t.touches[0].pageY : t.pageY
                            },
                            n = {
                                x: s.x - i.touchTracks[i.touchTracks.length - 1].x,
                                y: s.y - i.touchTracks[i.touchTracks.length - 1].y
                            };
                        i.touchTracks.push(s);
                        var a = 180 * Math.atan2(Math.abs(n.y), Math.abs(n.x)) / Math.PI;
                        o.isHorizontal ? a < e.touchAngle || i.isTouching ? (i.isTouching = !0, i.offset += n.x, t.preventDefault()) : i.isScrolling = !0 : 90 - a < e.touchAngle || i.isTouching ? (i.isTouching = !0, i.offset += n.y, t.preventDefault()) : i.isScrolling = !0, o.scrollPixel(i.offset * e.touchRatio)
                    }
                }
                function i() {
                    var t = o.touchStatus,
                        e = Date.now() - t.touchStartTime,
                        i = t.offset * o.config.touchRatio;
                    o.$wrapper.style.transition = "transform ease " + s.speed + "ms", e > o.config.longSwipesMs ? Math.abs(i) >= o.slideSize * o.config.longSwipesRatio ? 0 < i ? o.scroll(o.index - 1, !0) : o.scroll(o.index + 1, !0) : o.scroll(o.index, !0) : 0 < i ? o.scroll(o.index - 1, !0) : i < 0 && o.scroll(o.index + 1, !0), o.initStatus()
                }
                var o = this,
                    s = this.config,
                    r = this.supportTouch;
                if (r ? (this.$el.addEventListener("touchstart", t, {
                        passive: this.config.passiveListeners,
                        capture: !1
                    }, !1), this.$el.addEventListener("touchmove", e), this.$el.addEventListener("touchend", i), this.$el.addEventListener("touchcancel", i)) : (this.$el.addEventListener("mousedown", t), document.addEventListener("mousemove", e), document.addEventListener("mouseup", i)), s.mousewheel) {
                    var n = !1,
                        a = 0,
                        l = !1;
                    this.$el.addEventListener("wheel", function(t) {
                        var e = t.deltaY;
                        (0 < Math.abs(e) - Math.abs(a) || !n) && Math.abs(t.deltaY) >= s.mousewheel.sensitivity && o.scroll(0 < t.deltaY ? o.index - 1 : o.index + 1), a = e, clearInterval(l), n = !0, l = setTimeout(function() {
                            n = !1
                        }, 200), t.preventDefault(), t.stopPropagation()
                    })
                }
            }, t.updatePagination = function() {
                var i = this,
                    s = this.config;
                this.$pageList && this.$pageList.forEach(function(t, e) {
                    e === i.index ? t.className = s.pagination.bulletClass + " " + s.pagination.bulletActiveClass : t.className = "" + s.pagination.bulletClass
                })
            }, t.update = function() {
                var e = this;
                this.slideSize = this.isHorizontal ? this.$el.offsetWidth : this.$el.offsetHeight, this.$list.forEach(function(t) {
                    e.isHorizontal ? (t.style.width = e.slideSize + "px", t.style["margin-right"] = e.config.spaceBetween + "px") : (t.style.height = e.slideSize + "px", t.style["margin-bottom"] = e.config.spaceBetween + "px")
                }), this.$wrapper.style.transition = "transform ease " + this.config.speed + "ms", this.isHorizontal ? this.$wrapper.style.width = this.boxSize * this.$list.length + "px" : this.$wrapper.style.height = this.boxSize * this.$list.length + "px", this.$wrapper.style.display = "flex", this.$wrapper.style["flex-direction"] = this.isHorizontal ? "row" : "column";
                var t = this.index * this.boxSize;
                this.$wrapper.style.transform = this.getTransform(-t)
            },
            function(t, e, i) {
                e && s(t.prototype, e), i && s(t, i)
            }(i, [{
                key: "isHorizontal",
                get: function() {
                    return "horizontal" === this.config.direction
                }
            }, {
                key: "maxIndex",
                get: function() {
                    return this.$list.length - 1
                }
            }, {
                key: "minIndex",
                get: function() {
                    return 0
                }
            }, {
                key: "boxSize",
                get: function() {
                    return this.slideSize + this.config.spaceBetween
                }
            }]), i
    }()
});
