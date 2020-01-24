(function(window) {
    'use strict';
    var extendObj = function(src, target) {
        for (var prop in target) {
            if (target.hasOwnProperty(prop) && target[prop]) {
                src[prop] = target[prop];
            }
        }
        return src;
    };
    var getHeaders = function(selector, scope) {
        var ret = [];

        var target = document.querySelectorAll(scope);

        Array.prototype.forEach.call(target, function(elem) {

// console.log(elem.innerHTML);
            var elems = elem.querySelectorAll(selector);
            ret = ret.concat(Array.prototype.slice.call(elems))
        });
        return ret;
    };
    var getLevel = function(header) {
        if (typeof header !== 'string') {
            return 0;
        }
        var decs = header.match(/\d/g);
        return decs ? Math.min.apply(null, decs) : 1;
    };
    var createList = function(wrapper, count) {
        while (count--) {
            var ol = document.createElement('ol');
            ol.setAttribute('class',"toc");

            wrapper.appendChild(ol);
            wrapper = ol;

        }
        return wrapper;
    };
    var setInsertPosition = function(currentWrapper, offset) {
        if (offset < 0) {
            return setInsertPosition(currentWrapper.parentElement, offset + 1);
        }
        if (offset > 0) {
            return createList(currentWrapper, offset);
        }
        return currentWrapper.parentElement;
    };
    var setAttrs = function(overwrite, prefix) {
        return function(src, target, index) {
            var content = src.textContent;
            var pre = prefix + '-' + index;
            //var flagSrc = document.createElement('spam');

            target.textContent = src.textContent;
            var id = overwrite ? pre : (src.id || pre);
            id = encodeURIComponent(id);
          //  flagSrc.setAttribute("id",id);
          //  src.before(flagSrc, src);

            src.id = id;
            target.href = '#' + id;  // uncomment for normal execution
            target.setAttribute("onclick",'jump(\''+id+'\')');
        }
    };
    var buildTOC = function(options) {
        var selector = options.selector;
        var scope = options.scope;
        var ret = document.createElement('ol');
        ret.setAttribute("class","toc");
        ret.setAttribute("id","toc");

        var wrapper = ret;

        var _setAttrs = setAttrs(options.overwrite, options.prefix);
        getHeaders(selector, scope).reduce(function(prev, cur, index) {
            var currentLevel = getLevel(cur.tagName);
            var offset = currentLevel - prev;
            var pos = setInsertPosition(wrapper, offset) || ret;
            var li = document.createElement('li');
            var a = document.createElement('a');
            _setAttrs(cur, a, index);
            pos.appendChild(li).appendChild(a);
            wrapper = li;
            return currentLevel;
        }, getLevel(selector));
        return ret;
    };
    var initTOC = function(options) {
        var defaultOpts = {
            selector: 'h1, h2, h3, h4, h5, h6',
            scope: 'body',
            overwrite: true,
            prefix: 'toc'
        };
        options = extendObj(defaultOpts, options);
        var selector = options.selector;
        if (typeof selector !== 'string') {
            throw new TypeError('selector must be a string');
        }
         if (!selector.match(/^(?:h[1-6],?\s*)*$/g)) {
             throw new TypeError('selector must contains only h1-6')
         }
         var currentHash = location.hash;
        if (currentHash) {
            // fix hash
            setTimeout(function() {
                location.hash = '';
                location.hash = currentHash;
            }, 0);
        }
        return buildTOC(options);
    };
    if (typeof define === 'function' && define.amd) {
        define('toc', [], function() {
            return initTOC;
        });
    } else {
        window.initTOC = initTOC;
    }
}(window));
