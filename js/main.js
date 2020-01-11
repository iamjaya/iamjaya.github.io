function main() {
  //function() {
//console.log("initiated");
var h=0;
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
main.initEvents=initEvents;


  function initEvents() {
    [].slice.call(gridItems).forEach(function(item, pos) {
      // grid item click event
      item.addEventListener('click', function(ev) {
        ev.preventDefault();
        if (isAnimating || current === pos) {
          return false;
        }
        isAnimating = true;
        // index of current item
        ////console.log(pos);
        //  pos=0; // added by jai
        current = pos;
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

  function loadContent(item) {
    // add expanding element/placeholder
    var dummy = document.createElement('div');
    dummy.className = 'placeholder';

    // set the width/heigth and position
    dummy.style.WebkitTransform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth / gridItemsContainer.offsetWidth + ',' + item.offsetHeight / getViewport('y') + ',1)';
    dummy.style.transform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth / gridItemsContainer.offsetWidth + ',' + item.offsetHeight / getViewport('y') + ',1)';

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

                    closeCtrl.addEventListener('click', function() {
                      // hide content
                      //console.log("by close button");
                      hideContent();
                    });
      // disallow scroll
      window.addEventListener('scroll', noscroll);
    }, 25);

    onEndTransition(dummy, function() {
      ////console.log(item.getAttribute("loadURL"))
      var loadURL = item.getAttribute("loadURL");
      var authorID=item.getAttribute("authorID");

    var shorcuts = document.getElementById("shorcuts");
    shorcuts.style.display="block";
    shorcuts.style.background=mainColor;
    shorcuts.pseudoStyle("after","border-left-color",mainColor);

      loadWholePage(loadURL,authorID);


    //  loadAuthorsInfo(authorID, "authors");
      // add transition class
      classie.remove(dummy, 'placeholder--trans-in');
      classie.add(dummy, 'placeholder--trans-out');
      // position the content container
      contentItemsContainer.style.top = scrollY() + 'px';
      // show the main content container
      classie.add(contentItemsContainer, 'content--show');
      // show content item:
      // old one 	classie.add(contentItems[current], 'content__item--show');

      classie.add(contentItems[0], 'content__item--show');




      //  var script = (document.createElement('script'));
      // script.text = ' ////console.log(document.getElementById("#settings-object")); ////console.log("test123");	githubEmbed("#settings-object", {	"owner": "finom",	"repo": "github-embed",	"ref": "gh-pages","embed": [{ "path": "demo.html"	}, {	"path": "README.md"	}] });';
      //document.body.appendChild(script);
      // show close control
      classie.add(closeCtrl, 'close-button--show');
      // sets overflow hidden to the body and allows the switch to the content scroll
      classie.addClass(bodyEl, 'noscroll');

      isAnimating = false;
    });
  }



  function removeElement(elementId) {
      // Removes an element from the document
      var element = document.getElementById(elementId);
      element.parentNode.removeChild(element);
  }

  function hideContent() {
    //var h=0;
    h++;
    //console.log("h"+h);
    // old one 	var gridItem = gridItems[current], contentItem = contentItems[current];
    document.getElementById('theSidebar').style.pointerEvents="unset";
    document.getElementById('shorcuts').style.display="none";

    var gridItem = gridItems[current],
      contentItem = contentItems[0];

    classie.remove(contentItem, 'content__item--show');
    classie.remove(contentItemsContainer, 'content--show');
    classie.remove(closeCtrl, 'close-button--show');
    classie.remove(bodyEl, 'view-single');

    setTimeout(function() {
      var dummy = gridItemsContainer.querySelector('.placeholder');

      classie.removeClass(bodyEl, 'noscroll');

      dummy.style.WebkitTransform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth / gridItemsContainer.offsetWidth + ',' + gridItem.offsetHeight / getViewport('y') + ',1)';
      dummy.style.transform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth / gridItemsContainer.offsetWidth + ',' + gridItem.offsetHeight / getViewport('y') + ',1)';

      onEndTransition(dummy, function() {
        // reset content scroll..
        contentItem.parentNode.scrollTop = 0;
        gridItemsContainer.removeChild(dummy);
        if(getConfig('browserwindow')){
          contentItemsContainer.removeChild(document.getElementById('title_article_browser_look'));
        // alert("deleted"+h);

        }
        classie.remove(gridItem, 'grid__item--loading');
        classie.remove(gridItem, 'grid__item--animate');
        lockScroll = false;


       closeCtrl.removeEventListener('click',hideContent);
        window.removeEventListener('scroll', noscroll);
      });

      // reset current
      current = -1;
    }, 25);
  }

  function noscroll() {
    if (!lockScroll) {
      lockScroll = true;
      xscroll = scrollX();
      yscroll = scrollY();
    }
    window.scrollTo(xscroll, yscroll);
  }

  init();

  // }
}
