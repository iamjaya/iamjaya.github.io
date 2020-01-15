! function(t) {
    "use strict";
    var y = /^[a-z]+:/,
        d = /[-a-z0-9]+(\.[-a-z0-9])*:\d+/i,
        v = /\/\/(.*?)(?::(.*?))?@/,
        r = /^win/i,
        g = /:$/,
        m = /^\?/,
        q = /^#/,
        w = /(.*\/)/,
        A = /^\/{2,}/,
        e = /'/g,
        o = /%([ef][0-9a-f])%([89ab][0-9a-f])%([89ab][0-9a-f])/gi,
        n = /%([cd][0-9a-f])%([89ab][0-9a-f])/gi,
        i = /%([0-7][0-9a-f])/gi,
        p = /\+/g,
        s = /^\w:$/,
        C = /[^/#?]/;
    var a, I = "undefined" == typeof window && "undefined" != typeof global && "function" == typeof require,
        S = I ? t.require : null,
        b = {
            protocol: "protocol",
            host: "hostname",
            port: "port",
            path: "pathname",
            query: "search",
            hash: "hash"
        },
        j = {
            ftp: 21,
            gopher: 70,
            http: 80,
            https: 443,
            ws: 80,
            wss: 443
        };
    function x() {
        return I ? (a || (a = "file://" + (process.platform.match(r) ? "/" : "") + S("fs").realpathSync(".")), a) : document.location.href
    }
    function h(t, r, e) {
        var o, n, i;
        r || (r = x()), I ? o = S("url").parse(r) : (o = document.createElement("a")).href = r;
        var s, p, a = (p = {
            path: !0,
            query: !0,
            hash: !0
        }, (s = r) && y.test(s) && (p.protocol = !0, p.host = !0, d.test(s) && (p.port = !0), v.test(s) && (p.user = !0, p.pass = !0)), p);
        for (n in i = r.match(v) || [], b) a[n] ? t[n] = o[b[n]] || "" : t[n] = "";
        if (t.protocol = t.protocol.replace(g, ""), t.query = t.query.replace(m, ""), t.hash = z(t.hash.replace(q, "")), t.user = z(i[1] || ""), t.pass = z(i[2] || ""), t.port = j[t.protocol] == t.port || 0 == t.port ? "" : t.port, !a.protocol && C.test(r.charAt(0)) && (t.path = r.split("?")[0].split("#")[0]), !a.protocol && e) {
            var h = new U(x().match(w)[0]),
                u = h.path.split("/"),
                c = t.path.split("/"),
                f = ["protocol", "user", "pass", "host", "port"],
                l = f.length;
            for (u.pop(), n = 0; n < l; n++) t[f[n]] = h[f[n]];
            for (;
                ".." === c[0];) u.pop(), c.shift();
            t.path = ("/" !== r.charAt(0) ? u.join("/") : "") + "/" + c.join("/")
        }
        t.path = t.path.replace(A, "/"), t.paths(t.paths()), t.query = new F(t.query)
    }
    function u(t) {
        return encodeURIComponent(t).replace(e, "%27")
    }
    function z(t) {
        return (t = (t = (t = t.replace(p, " ")).replace(o, function(t, r, e, o) {
            var n = parseInt(r, 16) - 224,
                i = parseInt(e, 16) - 128;
            if (0 === n && i < 32) return t;
            var s = (n << 12) + (i << 6) + (parseInt(o, 16) - 128);
            return 65535 < s ? t : String.fromCharCode(s)
        })).replace(n, function(t, r, e) {
            var o = parseInt(r, 16) - 192;
            if (o < 2) return t;
            var n = parseInt(e, 16) - 128;
            return String.fromCharCode((o << 6) + n)
        })).replace(i, function(t, r) {
            return String.fromCharCode(parseInt(r, 16))
        })
    }
    function F(t) {
        for (var r = t.split("&"), e = 0, o = r.length; e < o; e++) {
            var n = r[e].split("="),
                i = decodeURIComponent(n[0].replace(p, " "));
            if (i) {
                var s = void 0 !== n[1] ? z(n[1]) : null;
                void 0 === this[i] ? this[i] = s : (this[i] instanceof Array || (this[i] = [this[i]]), this[i].push(s))
            }
        }
    }
    function U(t, r) {
        h(this, t, !r)
    }
    F.prototype.toString = function() {
        var t, r, e = "",
            o = u;
        for (t in this) {
            var n = this[t];
            if (!(n instanceof Function || null === n))
                if (n instanceof Array) {
                    var i = n.length;
                    if (i)
                        for (r = 0; r < i; r++) {
                            var s = n[r];
                            e += e ? "&" : "", e += o(t) + (null == s ? "" : "=" + o(s))
                        } else e += (e ? "&" : "") + o(t) + "="
                } else e += e ? "&" : "", e += o(t) + (void 0 === n ? "" : "=" + o(n))
        }
        return e
    }, U.prototype.clearQuery = function() {
        for (var t in this.query) this.query[t] instanceof Function || delete this.query[t];
        return this
    }, U.prototype.queryLength = function() {
        var t = 0;
        for (var r in this.query) this.query[r] instanceof Function || t++;
        return t
    }, U.prototype.isEmptyQuery = function() {
        return 0 === this.queryLength()
    }, U.prototype.paths = function(t) {
        var r, e = "",
            o = 0;
        if (t && t.length && t + "" !== t) {
            for (this.isAbsolute() && (e = "/"), r = t.length; o < r; o++) t[o] = !o && s.test(t[o]) ? t[o] : u(t[o]);
            this.path = e + t.join("/")
        }
        for (o = 0, r = (t = ("/" === this.path.charAt(0) ? this.path.slice(1) : this.path).split("/")).length; o < r; o++) t[o] = z(t[o]);
        return t
    }, U.prototype.encode = u, U.prototype.decode = z, U.prototype.isAbsolute = function() {
        return this.protocol || "/" === this.path.charAt(0)
    }, U.prototype.toString = function() {
        return (this.protocol && this.protocol + "://") + (this.user && u(this.user) + (this.pass && ":" + u(this.pass)) + "@") + (this.host && this.host) + (this.port && ":" + this.port) + (this.path && this.path) + (this.query.toString() && "?" + this.query) + (this.hash && "#" + u(this.hash))
    }, t[t.exports ? "exports" : "Url"] = U
}("undefined" != typeof module && module.exports ? module : window);
