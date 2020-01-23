function main() {
    //function() {
    //console.log("initiated");
    var h = 0;
    var bodyEl = document.body,
        docElem = window.document.documentElement,
        support = {
            transitions: Modernizr.csstransitions
        },
        // transition end event name
        transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        onEndTransition = function(el, callback) {
            var onEndCallbackFn = function(ev) {
                if (support.transitions) {
                    if (ev.target != this) return;
                    this.removeEventListener(transEndEventName, onEndCallbackFn);
                }
                if (callback && typeof callback === 'function') {
                    callback.call(this);
                }
            };
            if (support.transitions) {
                el.addEventListener(transEndEventName, onEndCallbackFn);
            } else {
                onEndCallbackFn();
            }
        },
        gridEl = document.getElementById('theGrid'),
        sidebarEl = document.getElementById('theSidebar'),
        gridItemsContainer = gridEl.querySelector('section.grid'),
        contentItemsContainer = gridEl.querySelector('section.content'),
        gridItems = gridItemsContainer.querySelectorAll('.grid__item'),
        contentItems = contentItemsContainer.querySelectorAll('.content__item'),
        closeCtrl = contentItemsContainer.querySelector('.close-button'),
        maxCtrl = contentItemsContainer.querySelector('.max-button'),
        minCtrl = contentItemsContainer.querySelector('.min-button'),
        current = -1,
        lockScroll = false,
        xscroll, yscroll,
        isAnimating = false,
        menuCtrl = document.getElementById('menu-toggle'),
        menuCloseCtrl = sidebarEl.querySelector('.close-button');
    /**
     * gets the viewport width and height
     * based on http://responsejs.com/labs/dimensions/
     */
    function getViewport(axis) {
        var client, inner;
        if (axis === 'x') {
            client = docElem['clientWidth'];
            inner = window['innerWidth'];
        } else if (axis === 'y') {
            client = docElem['clientHeight'];
            inner = window['innerHeight'];
        }
        return client < inner ? inner : client;
    }
    function scrollX() {
        return window.pageXOffset || docElem.scrollLeft;
    }
    function scrollY() {
        return window.pageYOffset || docElem.scrollTop;
    }
    function init() {
        initEvents();
    }
    main.initEvents = initEvents;
    function initEvents() {
        //  console.log("TOTAL GRID ITEMS:"+gridItems.length);
        // console.log("Initials Cuttent at the time of initialization"+current);
        [].slice.call(gridItems).forEach(function(item, pos) {
            // grid item click event
            item.addEventListener('click', function(ev) {
                ev.preventDefault();
                // if (isAnimating || current === pos) {
                //   return false;
                // }
                isAnimating = true;
                // index of current item
                ////console.log(pos);
                //  pos=0; // added by jai
                //  console.log("From initEvent Methods******");
                // console.log("CUttrent start after clicking ithe item:"+current);
                // console.log("possition:"+pos);
                current = pos;
                // console.log("Current values assigned with pos" + current);
                // simulate loading time..
                classie.add(item, 'grid__item--loading');
                setTimeout(function() {
                    classie.add(item, 'grid__item--animate');
                    // reveal/load content after the last element animates out (todo: wait for the last transition to finish)
                    setTimeout(function() {
                        loadContent(item);
                    }, 500);
                }, 1000);
            });
        });
        // keyboard esc - hide content
        document.addEventListener('keydown', function(ev) {
            if (!isAnimating && current !== -1) {
                var keyCode = ev.keyCode || ev.which;
                if (keyCode === 27) {
                    ev.preventDefault();
                    if ("activeElement" in document)
                        document.activeElement.blur();
                    hideContent();
                    //console.log("by esc button");
                }
            }
        });
        //closeCtrl.addEventListener('click', function() {
        // hide content
        //console.log("by close button");
        //    console.log("from add event lister **************************************");
        //    console.log(current+"before closing current value");
        //  hideContent();
        //  closeCtrl.removeEventListener('click',hideContent);
        // });
        // hamburger menu button (mobile) and close cross
        menuCtrl.addEventListener('click', function() {
            if (!classie.has(sidebarEl, 'sidebar--open')) {
                classie.add(sidebarEl, 'sidebar--open');
            }
        });
        menuCloseCtrl.addEventListener('click', function() {
            if (classie.has(sidebarEl, 'sidebar--open')) {
                classie.remove(sidebarEl, 'sidebar--open');
            }
        });
    }
    //
    // function loadURLDirect(itemURL){
    //
    // // item.addEventListener('click', function(ev) {
    //   //  ev.preventDefault();
    //
    //     if (isAnimating || current === pos) {
    //       return false;
    //     }
    //     isAnimating = true;
    //     // index of current item
    //     ////console.log(pos);
    //     //  pos=0; // added by jai
    //     current = pos;
    //     // simulate loading time..
    //     classie.add(itemURL, 'grid__item--loading');
    //     setTimeout(function() {
    //       classie.add(item, 'grid__item--animate');
    //
    //       // reveal/load content after the last element animates out (todo: wait for the last transition to finish)
    //       setTimeout(function() {
    //         loadContent(itemURL);
    //       }, 500);
    //     }, 1000);
    // //  });
    // //});
    //
    //
    // // hamburger menu button (mobile) and close cross
    // menuCtrl.addEventListener('click', function() {
    //   if (!classie.has(sidebarEl, 'sidebar--open')) {
    //     classie.add(sidebarEl, 'sidebar--open');
    //   }
    // });
    //
    // menuCloseCtrl.addEventListener('click', function() {
    //   if (classie.has(sidebarEl, 'sidebar--open')) {
    //     classie.remove(sidebarEl, 'sidebar--open');
    //   }
    // });
    //
    // }
    function loadContent(item, loadByID) {
        h++;
        console.log("ghghghg" + h);
        //   if(getConfig('fullWindowArticleView')){
        //   classie.add(gridEl,"wiseSection");
        // }
        directLoadByAid = false;
        if (isDefinedOrNot_True_False(loadByID)) {
            //    console.log("yes defiened by article id");
            directLoadByAid = true;
        } else {
            //console.log("not defiened by article id");
        }
        // add expanding element/placeholder
        var dummy = document.createElement('div');
        dummy.className = 'placeholder';
        // set the width/heigth and position
        if (!directLoadByAid) {
            dummy.style.WebkitTransform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth / gridItemsContainer.offsetWidth + ',' + item.offsetHeight / getViewport('y') + ',1)';
            dummy.style.transform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth / gridItemsContainer.offsetWidth + ',' + item.offsetHeight / getViewport('y') + ',1)';
        }
        // add transition class
        classie.add(dummy, 'placeholder--trans-in');
        // insert it after all the grid items
        gridItemsContainer.appendChild(dummy);
        // body overlay
        classie.add(bodyEl, 'view-single');
        setTimeout(function() {
            // expands the placeholder
            dummy.style.WebkitTransform = 'translate3d(-5px, ' + (scrollY() - 5) + 'px, 0px)';
            dummy.style.transform = 'translate3d(-5px, ' + (scrollY() - 5) + 'px, 0px)';
            // ading event to close button
            // disallow scroll
            window.addEventListener('scroll', noscroll);
        }, 25);
        onEndTransition(dummy, function() {
            ////console.log(item.getAttribute("loadURL"))
            var loadURL = item.getAttribute("loadURL");
            var authorID = item.getAttribute("authorID");
            articleId_current_opened_full_view = item.getAttribute("articleId");
            //  isArtcileFullViewLoadedOrNot(articleId_current_opened_full_view);
            //var i

/*
            var shorcuts = document.getElementById("shorcuts");
            shorcuts.style.display = "block";
            shorcuts.style.background = mainColor;
            shorcuts.pseudoStyle("after", "border-left-color", mainColor); */
            content_sub = item.getAttribute("cat");
            loadWholePage(loadURL, authorID);
            //  loadAuthorsInfo(authorID, "authors");
            // add transition class
            classie.remove(dummy, 'placeholder--trans-in');
            classie.add(dummy, 'placeholder--trans-out');
            // position the content container
            contentItemsContainer.style.top = scrollY() + 'px';
            // show the main content container
            classie.add(contentItemsContainer, 'content--show');
            // show content item:
            // old one  classie.add(contentItems[current], 'content__item--show');
            var currentContentSection = getElementById(articleId_current_opened_full_view);
            classie.add(getElementById('displayContent'), 'content__item--show');
            //  var script = (document.createElement('script'));
            // script.text = ' ////console.log(document.getElementById("#settings-object")); ////console.log("test123");    githubEmbed("#settings-object", {   "owner": "finom",   "repo": "github-embed", "ref": "gh-pages","embed": [{ "path": "demo.html"   }, {    "path": "README.md" }] });';
            //document.body.appendChild(script);
            // show close control
            classie.add(closeCtrl, 'close-button--show');
            if (classie.has(item, 'grid__item')) {
                title_preview = item.querySelector(".title--preview").innerHTML;
                console.log("title_preview" + title_preview);
                classie.add(closeCtrl, 'fromGrid');
                classie.remove(closeCtrl, 'fromTabTool');
                classie.remove(closeCtrl, 'fromDirectURL');
            } else if (classie.has(item, 'tabTool')) {
                classie.remove(closeCtrl, 'fromGrid');
                classie.add(closeCtrl, 'fromTabTool');
                classie.remove(closeCtrl, 'fromDirectURL');
            } else {
                classie.remove(closeCtrl, 'fromGrid');
                classie.remove(closeCtrl, 'fromTabTool');
                classie.add(closeCtrl, 'fromDirectURL');
            }
            if (getConfig('fullWindowArticleView')) {
                classie.add(maxCtrl, 'close-button--show');
                if (getConfig('desktopModel')) {
                    classie.add(minCtrl, 'close-button--show');
                    minCtrl.setAttribute("id", "minimize_id_" + articleId_current_opened_full_view);
                    minCtrl.setAttribute("article_id", articleId_current_opened_full_view);
                }
            }
            // sets overflow hidden to the body and allows the switch to the content scroll
            classie.addClass(bodyEl, 'noscroll');
            isAnimating = false;
        });
    }
    function hideContent() {

//
//       if(history.pushState) {
//     history.pushState(null, null, null);
// }
// else {
//     location.hash = 'http://127.0.0.1:3000/';
// }
        removeOverlay();
        openedArticles.splice(openedArticles.indexOf(articleId_current_opened_full_view), 1);
        //  console.log("Enterinto HIde Method");
        //  console.log("::::::::::::::::::::::::");
        //  if(articleWindow){
        articleWindow = false;
        //  console.log(articleWindow+"closed");
        //var h=0;
        //  h++;
        //console.log("h"+h);
        // old one  var gridItem = gridItems[current], contentItem = contentItems[current];
        document.getElementById('theSidebar').style.pointerEvents = "unset";
    //    document.getElementById('shorcuts').style.display = "none";
        var flag = "aid_";
        var cuttentCloseClassFrom = "fromGrid";
        if (classie.has(closeCtrl, 'fromTabTool')) {
            flag = "tabTool_aid_";
            cuttentCloseClassFrom = "fromTabTool";
        }
        var gridItem = getElementById(flag + articleId_current_opened_full_view); // gridItems[current],
        console.log(flag + articleId_current_opened_full_view + "asdfasdf");
        console.log(gridItem.getAttribute("id"));
        contentItem = getElementById(articleId_current_opened_full_view); //contentItems[0];
        contentItem.style.display = "none";
        //console.log(current+"current");
        //console.log("_____________________________________");
        classie.remove(gridEl, "wiseSection");
        classie.remove(contentItem, 'content__item--show');
        classie.remove(contentItemsContainer, 'content--show');
        classie.remove(closeCtrl, 'close-button--show');
        classie.remove(closeCtrl, cuttentCloseClassFrom);
        classie.remove(maxCtrl, 'close-button--show');
        classie.remove(minCtrl, 'close-button--show');
        classie.remove(bodyEl, 'view-single');
        setTimeout(function() {
            var dummy = gridItemsContainer.querySelector('.placeholder');
            classie.removeClass(bodyEl, 'noscroll');
            dummy.style.WebkitTransform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth / gridItemsContainer.offsetWidth + ',' + gridItem.offsetHeight / getViewport('y') + ',1)';
            dummy.style.transform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth / gridItemsContainer.offsetWidth + ',' + gridItem.offsetHeight / getViewport('y') + ',1)';
            onEndTransition(dummy, function() {
                // reset content scroll..
                contentItem.parentNode.scrollTop = 0;
                if (dummy) {
                    //  console.log(dummy.getAttribute('style'));
                    gridItemsContainer.removeChild(dummy);
                }
                if (getConfig('browserwindow')) {
                    contentItemsContainer.removeChild(document.getElementById('title_article_browser_look'));
                }
                classie.remove(gridItem, 'grid__item--loading');
                classie.remove(gridItem, 'grid__item--animate');
                lockScroll = false;
                closeCtrl.removeEventListener('click', hideContent);
                window.removeEventListener('scroll', noscroll);
            });
            // reset current
            current = -1;
        }, 25);
        // }
        //console.log("new openedArticles");
        //console.log(openedArticles);
        //mainCtrl="";
    }
    function noscroll() {
        if (!lockScroll) {
            lockScroll = true;
            xscroll = scrollX();
            yscroll = scrollY();
        }
        window.scrollTo(xscroll, yscroll);
    }
    this.mimimize_Ctrl_descktop = function(em) {
        hideContent();
        classie.remove(gridEl, "wideSection");
        maxCtrl.innerHTML = '<img src="images/icons/max.png"/>';
        maxCtrl.setAttribute('title', "maximize");
        maxCtrl.setAttribute('onClick', 'maximizeCtrl()');
    }
    this.maxAction = function() {
        if (getConfig('fullWindowArticleView')) {
            classie.add(gridEl, "wideSection");
        }
        maxCtrl.innerHTML = '<img src="images/icons/min.png"/>';
        maxCtrl.setAttribute('title', "mini screen");
        maxCtrl.setAttribute('onClick', 'minimizeCtrl()');
    }
    this.minAction = function() {
        if (getConfig('fullWindowArticleView')) {
            classie.remove(gridEl, "wideSection");
            classie.add(gridEl, "miniSection");
        }
        maxCtrl.innerHTML = '<img src="images/icons/max.png"/>';
        maxCtrl.setAttribute('title', "maximize");
        maxCtrl.setAttribute('onClick', 'maximizeCtrl()');
    }
    this.closeAction = function() {
        classie.remove(gridEl, "wideSection");
        maxCtrl.innerHTML = '<img src="images/icons/max.png"/>';
        maxCtrl.setAttribute('title', "maximize");
        maxCtrl.setAttribute('onClick', 'maximizeCtrl()');
        if (isLoadedFromDirect_By_AID) {
            var referrer = location.origin; // document.referrer;
            //  console.log("jklmn"+referrer);
            window.location = referrer;
        } else {
            hideContent();
        }
        removeToolTab_ctrl(articleId_current_opened_full_view);
    };
    this.loadArticleByID = function(item) {
        //console.log("Initiated loadArticleByID");
        //console.log("ima jai" + item.getAttribute('loadURL'));
        loadContent(item, "yesdirectLoadByAID");
    };
    this.initiateMain = function() {
            init();
        }
        //var closeAction=
    init();
    // }
}
