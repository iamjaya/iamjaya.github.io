var main_Loaded = false;
var article_Content_area = document.getElementById("content");
var article_title_obj;
var mainColor = getConfig('mainColor');
var authorImg = "";
var author_display_name = "";
var authorsFolder = "authors";
var lazyloadImages; // = document.querySelectorAll("img.lazy");
var lazyloadThrottleTimeout;
var scroller = document.querySelector('#scroller');
var fromTab = false;
var article_title = "";
var displayed = false;
var content_sub;
var articleWindow = false;
var article_Itmes = "";
var pageTitle = document.getElementById('pageTitle');
var classThreedBox = (getConfig('threeDboxStyle')) ? 'threedbox' : 'no3dbox graycolor';
var figureCaptionBorder_style = (getConfig('figureCaptionBorder')) ? 'borderStyle' : 'noBorderJSiteBlock';
var mainCtrl;
var isLoadedFromDirect_By_AID = false;
var articleId_current_opened_full_view;
var openedArticles = [];
var tabToolBottom = document.getElementById('tabToolBottom');
var title_preview;
var overlay = document.querySelectorAll('.overlay');
var directLoadByAid = false;
var homeDataLoad = getConfig("homeDataLoad");
var ds; // for stroing descripted catname | status | and url
var shorts_el = getElementById("shorts");
var temp_toc;
var UID = {
    _current: 0,
    getNew: function() {
        this._current++;
        return this._current;
    }
};
var menu = getConfig('menu');
var searchCatQueue = [];
HTMLElement.prototype.pseudoStyle = function(element, prop, value) {
    var _this = this;
    var _sheetId = "pseudoStyles";
    var _head = document.head || document.getElementsByTagName('head')[0];
    var _sheet = document.getElementById(_sheetId) || document.createElement('style');
    _sheet.id = _sheetId;
    var className = "pseudoStyle" + UID.getNew();
    _this.className += " " + className;
    _sheet.innerHTML += "\n." + className + ":" + element + "{" + prop + ":" + value + "}";
    _head.appendChild(_sheet);
    return this;
};
function getSearchQuery(catQueue) {
    for (a = 0; a < catQueue.length; a++) {
        // // console.log(catQueue[a]);
    }
}
function createMainMenu_ctrl() {
    var menus = '<a class="menuItem" id="home" style="color:deeppink;font-weight:bold;font-size:1.5em;" href="javascript:void(0);" onclick="loadArticlesByTechName(\'home\');">Home</a>';
    menu.sort();
    //  // // console.log(menus);
    //<a class="menuItem" href="javascript:void(0);" onclick="loadArticlesByTechName('atom',this,'#dda131')">Atom IDE</a>
    for (var i = 0; i < menu.length; i++) {
        var menuD = menu[i].split('|');
        var menu_displayLabel = menuD[1],
            menuStatus = menuD[2],
            menuID_ctrl = menuD[0];
        if (menuStatus == 'true') {
            menus = menus + '   <a class="menuItem" id="' + menuID_ctrl + '"href="javascript:void(0);" onclick="loadArticlesByTechName(\'' + menuID_ctrl + '\')">' + menu_displayLabel + '</a>';
            searchCatQueue.push(menuID_ctrl);
        }
    }
    document.getElementById('mainMenuID').innerHTML = menus;
    //  // // console.log(menus);
}
function searchArticle(queryString, callback) {
    // // console.log(menu);
    //    getSearchQuery(menu);
    //  // console.log(searchCatQueue);
    var q = [];
    var query_s = searchCatQueue;
    for (var i = 0; i < query_s.length; i++) {
        q.push('SELECT * FROM JSON("content/' + query_s[i] + '/data.json") WHERE article_title LIKE "%' + queryString + '%"')
    }
    //alasql(['SELECT * FROM JSON("content/spring/data.json") WHERE article_title LIKE "%'+ queryString+ '%"',
    //  'SELECT * , ROWNUM() as rn FROM JSON("content/atom/data.json")'
    alasql(q).then(function(res) {
        article_Itmes = "";
        callback(res);
        // // console.log(res);
        mainCtrl = new main();
    });
}
function loadJSON(json_file_url, callback, no_main) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', json_file_url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            article_Itmes = "";
            callback(xobj.responseText);
            if (!!no_main || no_main === '') {} else {
                if (!main_Loaded) {
                    mainCtrl = new main();
                    //      main_Loaded=true;
                }
            }
        }
    };
    xobj.send(null);
}
function createXHR() {
    var request = false;
    try {
        request = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (err2) {
        try {
            request = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (err3) {
            try {
                request = new XMLHttpRequest();
            } catch (err1) {
                request = false;
            }
        }
    }
    return request;
}
function getBody(content) {
    /*  test = content.toLowerCase(); // to eliminate case sensitivity
      var x = test.indexOf("<body");
      if (x == -1) return "";
      x = test.indexOf(">", x);
      if (x == -1) return "";
      var y = test.lastIndexOf("</body>");
      if (y == -1) y = test.lastIndexOf("</html>");
      if (y == -1) y = content.length; // If no HTML then just grab everything till end
      return content.slice(x + 1, y); */
    return content;
}
/**
    Loads a HTML page
    Put the content of the body tag into the current page.
    Arguments:
        url of the other HTML page to load
        id of the tag that has to hold the content
*/
function loadHTML(url, fun, storage, param, authorID) {
    var xhr = createXHR();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            //if(xhr.status == 200)
            if (this.status == 200) {
                loadHTML_ctrl(xhr.responseText, fun, storage, param, authorID);
            } else if (this.status == 404) {
                loadFileNotFoundError(fun, storage, param);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send(null);
}
function loadFileNotFoundError(fun, storage, param) {
    addOverlay();
    var articleFullView = document.createElement('div');
    articleFullView.setAttribute("class", "articleFullView");
    articleFullView.setAttribute("id", articleId_current_opened_full_view);
  //  articleFullView.setAttribute("class", articleId_current_opened_full_view.replace(/=/g, "a")+"jsite");

    var errorMsg = '<figure class="JSiteBlock"><img class="lazy" src="https://res.cloudinary.com/jsite/image/upload/e_blur:829/v1579275577/Jsitescreens/articelTitle_ln9kaa.png" data-src="https://res.cloudinary.com/jsite/image/upload/v1579275577/Jsitescreens/articelTitle_ln9kaa.png" /><Jcaption>Article Main Title Sample</Jcaption></figure>';
    articleFullView.innerHTML = errorMsg;
    storage.insertBefore(articleFullView, storage.firstChild);
    fun(storage, param);
}
function loadHTML_ctrl(responseText, fun, storage, param, authorID) {
    {
        addOverlay();
        var articleFullView = document.createElement('div');
        articleFullView.setAttribute("class", "articleFullView");
        articleFullView.setAttribute("id", articleId_current_opened_full_view);

        // console.log(temp_toc);
         //   articleFullView.setAttribute("class", temp_toc+"jsite");

        if (!chechTabToolItemExistOrNot(articleId_current_opened_full_view) && !directLoadByAid) {
            addToolTab_ctrl();
        }
        if (!isArtcileFullViewLoadedOrNot(articleId_current_opened_full_view)) {
            openedArticles.push(articleId_current_opened_full_view);
            //  // // console.log("exxxxx"+articleId_current_opened_full_view);
            temp_toc=articleId_current_opened_full_view.replace(/=/g, "a");
            classie.add(articleFullView,temp_toc+"jsite");
         
            articleFullView.innerHTML = getBody(responseText);
            storage.insertBefore(articleFullView, storage.firstChild);
            fun(storage, param);
            //  loadColoring();
            var codeBlocks_array = document.getElementsByClassName("codeBlock"); // codeBlocks.getAttribute('data').split(",");
            for (j = 0; j < codeBlocks_array.length; j++) {
                var cbID = "codeBlock_" + j;
                var settings_obj = codeBlocks_array[j]; // document.getElementById(codeBlocks_array[j]);
                settings_obj.setAttribute("id", cbID);
                var owner = settings_obj.getAttribute('owner');
                var repo = settings_obj.getAttribute('repo');
                var ref = settings_obj.getAttribute('ref');
                var embeded = settings_obj.getAttribute('embeded');
                var array_embeded = embeded.split(",");
                var array_embeded_obj = new Array();
                for (i = 0; i < array_embeded.length; i++) {
                    array_embeded_obj[i] = JSON.parse(array_embeded[i]);
                }
                githubEmbed('#' + cbID + '', {
                    "owner": owner,
                    "repo": repo,
                    "ref": ref,
                    "embed": array_embeded_obj
                }); // end of github-embedded
            } // for loop end for code blocks
            lazyLoadImages();
            // console.log(articleId_current_opened_full_view);
if(getConfig('toc')){


  document.querySelector(".toc-link").setAttribute("href","#"+articleId_current_opened_full_view+"-toc");
            toc(  document.getElementById(articleId_current_opened_full_view)); }
        } // after this
        articleWindow = true;
        //var url_array = url.split('/');
        // var color_code = url_array[1];
        hideLoadedArticles_but_view_current_by_article_ID(articleId_current_opened_full_view);
        //  article_title_obj = document.querySelector("#"+articleId_current_opened_full_view+" .title--full");
        //if(!fromTab) {
        if (!getElementById("authorDivID" + articleId_current_opened_full_view)) {
            if (getConfig('displayAuthorInfo')) {
                displayAuthorData();
                loadAuthorsInfo(authorID, authorsFolder);
            }
        }
        addBrowserLook();
        fromTab = false;
        // // console.log("openedArticles");
        // // console.log(openedArticles);
        //  // // console.log(articleId_current_opened_full_view+"tripcore");
        //storage.innerHTML=getBody(xhr.responseText);
    }
}
/**
    Callback
    Assign directly a tag
*/
function threeDBoxStyle_activate() {
    if (getConfig('threeDboxStyle')) {}
}
function matching_b_bo_ctrl(mainColor_final) {
    var matching_b_bo = document.querySelectorAll('.matching_b_bo > p');
    var i1;
    for (i1 = 0; i1 < matching_b_bo.length; i1++) {
        //  // // console.log("mainColor_final");
        //   matching_b_bo[i1].style.backgroundColor = mainColor_final;
        matching_b_bo[i1].style.borderColor = mainColor_final + " !important";
        matching_b_bo[i1].pseudoStyle("before", "background-color", mainColor_final + " !important");
        // classList.add(color_code);
    }
}
function articleTitleStyle(mainColor_final) {
    var topic_title = document.getElementsByClassName('topic_title');
    var i1;
    for (i1 = 0; i1 < topic_title.length; i1++) {
        topic_title[i1].style.color = mainColor_final;
        topic_title[i1].style.borderBottom = "2px solid " + mainColor_final;
        // classList.add(color_code);
    }

    var h33=document.querySelectorAll('h3');
    for (i1 = 0; i1 < h33.length; i1++) {
        h33[i1].style.color = mainColor_final;
        h33[i1].style.borderBottom = "1px solid " + mainColor_final;
        // classList.add(color_code);
    }
}
function styleQuotes(mainColor_final) {
    var quotes = document.getElementsByClassName('quotes');
    var i1;
    for (i1 = 0; i1 < quotes.length; i1++) {
        quotes[i1].style.color = mainColor_final;
        quotes[i1].style.borderLeftColor = mainColor_final;
        // classList.add(color_code);
    }
}
function contentCB(mainColor_final) {
    loadToolTips();
    var cb = document.getElementsByTagName('cb');
    var cb1;
    for (cb1 = 0; cb1 < cb.length; cb1++) {
        cb[cb1].style.color = mainColor_final; //.add(color_code);
    }
}
function figureCaptionColorCode(color_code_final) {
    var figcaption = document.getElementsByTagName('figcaption');
    var i3;
    for (i3 = 0; i3 < figcaption.length; i3++) {
        figcaption[i3].classList.add(color_code_final + '_figcaption');
    }
}
function figureColorCode(color_code_final) {
    var figure = document.getElementsByClassName('figure');
    var i2;
    for (i2 = 0; i2 < figure.length; i2++) {
        figure[i2].classList.add(color_code_final + '_figure');
    }
}
function figureCaptionBorder_ctrl() {
    var JSiteBlock = document.getElementsByClassName('JSiteBlock');
    var i2;
    for (i2 = 0; i2 < JSiteBlock.length; i2++) {
        classie.add(JSiteBlock[i2], figureCaptionBorder_style);
        //  figure[i2].classList.add(color_code_final + '_figure');
    }
    var figcaption = document.getElementsByTagName('Jcaption');
    var i3;
    for (i3 = 0; i3 < figcaption.length; i3++) {
        //  figcaption[i3].classList.add(color_code_final + '_figcaption');
        classie.add(figcaption[i3], 'noBorderJcaption');
    }
}
function displayAuthorData() {
    var authorArea = document.createElement('div');
    classie.add(authorArea, 'meta');
    authorArea.setAttribute("id", "authorDivID" + articleId_current_opened_full_view);
    classie.add(authorArea, 'meta--full')
        //authorArea.setAttribute("ID", "authorData");
    article_title_obj.after(authorArea);
}
function addBrowserLook() {
    if (getConfig('browserwindow')) {
        var browserStyle;
        if (!getElementById('title_article_browser_look')) {
            browserStyle = document.createElement('div');
            browserStyle.setAttribute("class", "browser-look");
            browserStyle.setAttribute("id", "title_article_browser_look");
            // browserStyle.innerHTML = '<span class="control"></span><span class="control"></span><span class="control"></span>';
            // Prepend it
            article_Content_area.insertBefore(browserStyle, article_Content_area.firstChild);
        } else {
            browserStyle = getElementById('title_article_browser_look');
        }
        scroller.addEventListener("scroll", changeBrowserWindowTitle);
    }
}
function changeBrowserWindowTitle() {
    var scrollTop = scroller.scrollTop; //.pageYOffset;
    //var article_title_obj = document.getElementById('article_title');
    if (!displayed) {
        if ((article_title_obj.offsetTop < scrollTop)) {
            article_title = article_title_obj.innerHTML;
            var title_article_browser_look = document.getElementById('title_article_browser_look');
            title_article_browser_look.pseudoStyle("before", "content", "\'" + article_title + "\'");
            displayed = true;
        }
    }
    if (article_title_obj.offsetTop > scrollTop) {
        if (articleWindow) {
            document.getElementById('title_article_browser_look').pseudoStyle("before", "content", "\' \'");
            displayed = false;
        }
    }
}
function lazyLoadImages() {
    lazyloadImages = document.querySelectorAll("img.lazy");
    lazyloadThrottleTimeout;
    scroller.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
}
function lazyload() {
    if (lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
    }
    lazyloadThrottleTimeout = setTimeout(function() {
        var scrollTop = scroller.scrollTop; //.pageYOffset;
        lazyloadImages.forEach(function(img) {
            if (img.offsetTop < (window.innerHeight + scrollTop)) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('lazy-loaded');
            }
        });
        if (lazyloadImages.length == 0) {
            scroller.removeEventListener("scroll", lazyload);
            window.removeEventListener("resize", lazyload);
            window.removeEventListener("orientationChange", lazyload);
        }
    }, 20);
}
function processHTML(temp, target) {
    target.innerHTML = temp.innerHTML;
}
function loadWholePage(url, authorID) {
    var y = document.getElementById("displayContent");
    var x = document.getElementById("displayContent");
    loadHTML(url, processHTML, x, y, authorID);
}
function closeBtnCtrl() {
    mainCtrl.closeAction();
}
function maximizeCtrl() {
    mainCtrl.maxAction();
}
function minimizeCtrl() {
    mainCtrl.minAction();
}
function mimimize_Ctrl(em) {
    mainCtrl.mimimize_Ctrl_descktop(em);
}


function toc(articleID){
  var temp=temp_toc+"jsite";
console.log(temp+"scope toc");
  //var aid = articleID.get(articleId);
  var tocBlock=articleID.querySelector('p');
        var tocresult = initTOC({
            selector: 'h2',
            scope: '.'+temp,
            prefix:articleId_current_opened_full_view
        });
        // console.log(tocresult.innerHTML);
        tocBlock.after(tocresult);
}
/**
    Create responseHTML
    for acces by DOM's methods
*/
function processByDOM(responseHTML, target) {
    target.innerHTML = "Extracted by id:<br />";
    // does not work with Chrome/Safari
    //var message = responseHTML.getElementsByTagName("div").namedItem("two").innerHTML;
    var message = responseHTML.getElementsByTagName("div").item(1).innerHTML;
    target.innerHTML += message;
    target.innerHTML += "<br />Extracted by name:<br />";
    message = responseHTML.getElementsByTagName("form").item(0);
    target.innerHTML += message.dyn.value;
}
function accessByDOM(url, authorID) {
    //var responseHTML = document.createElement("body");    // Bad for opera
    var responseHTML = document.getElementById("storage");
    var y = document.getElementById("displayed");
    loadHTML(url, processByDOM, responseHTML, y, authorID);
}
function loadAuthorsInfo(authorID, authorsFolder) {
    loadJSON(authorsFolder + '/' + authorID + '.json', loadAuthorsInfoDisplayAsHTML, "no_main");
}
function loadAuthorsInfoDisplayAsHTML(response) {
    var author_Itmes = JSON.parse(response);
    author_Itmes.forEach(function(author) {
        authorImg = author.authorImg;
        author_display_name = author.author_display_name;
    });
    var authorHTMLInfo = '<img id="authorImg" class="meta__avatar" src="' + authorImg + ' alt="" /><span id="author_display_name" class="meta__author">' + author_display_name + '</span>';
    document.getElementById("authorDivID" + articleId_current_opened_full_view).innerHTML = authorHTMLInfo;
}
function loadSearchResult(res) {
    //// // console.log(res.toString());
    for (a = 0; a < res.length; a++) {
        //// // console.log(res.length);
        //// // console.log(res[a].length);
        var inn = res[a];
        //// // console.log();
        loadArticleGrids(inn, "search");
    }
}
function isDefinedOrNot_True_False(em) {
    if (typeof em !== 'undefined') {
        return true;
        //// // console.log('a exists!');
        // actual_JSON =response;
    } else {
        //// // console.log(response.length);
        // actual_JSON = JSON.parse(response);
        return false;
    }
}
function isArtcileFullViewLoadedOrNot(articleId) {
    var el = getElementById(articleId);
    if (typeof(el) != 'undefined' && el != null) {
        // exists.
        // // console.log("Exist" + articleId);
        return true;
    } else {
        // // console.log("notExist" + articleId);
        return false;
    }
}
function loadArticleGrids(response, isSearch) {
    //// // console.log(response);
    var actual_JSON;
    // Parse JSON string into object
    if (typeof isSearch !== 'undefined') {
        //// // console.log('a exists!');
        actual_JSON = response;
    } else {
        //// // console.log(response.length);
        actual_JSON = JSON.parse(response);
    }
    //// // console.log(actual_JSON);
    // // // console.log(actual_JSON);
    //// // console.log((actual_JSON.length));
    actual_JSON.forEach(function(article) {
        var articelID_cat_authorinfo = Base64.encode(article.icon + '@jsite@' + article.article_loadURL + '@jsite@' + article.authorID);
        article_Itmes = article_Itmes + '<div id="aid_' + articelID_cat_authorinfo + '"   articleId="' + articelID_cat_authorinfo + '" unid="' + Base64.decode(articelID_cat_authorinfo) + '" class="grid__item fade-in" cat="' + article.icon + '"href="#" authorID="' + article.authorID + '" loadurl="' + article.article_loadURL + '"><div class="' + classThreedBox + '"> <h2 class="title title--preview"> ' + article.article_title + '</h2><div class="loader" ></div><span class="category" style="display:none;">' + article.article_cat + '</span><div class="meta meta--preview"><img class="meta__avatar" width="50px" src="content/' + article.icon + '/icon.png" alt="Node.js"><span class="meta__date" style="display:none;"><i class="fa fa-calendar-o"></i>' + article.article_start_date + '</span><span class="meta__reading-time" style="display:none;"> Node.js | MySQL | Redis Cache | Amazon AWS</span></div></div></div>';
        //  content_sub=
    });
    document.getElementById('articlesCard').innerHTML = article_Itmes;
    var ht = document.querySelectorAll(".container ht");
    var ht1;
    for (ht1 = 0; ht1 < ht.length; ht1++) {
        ht[ht1].style.color = mainColor;
    }
    var style_loader = document.getElementById('style_loader');
    style_loader.innerHTML = '.loader::before { background: ' + mainColor + '  !important; }';
    //  document.getElementsByTagName('head')[0].appendChild(style);
}
function themeStyles(themeName) {
    if (themeName === 'logo') {
        var image = 'url(content/' + content_sub + '/icon.png) no-repeat left';
        //  var style_loader = document.getElementById('style_loader');
        article_title_obj.style.background = image;
    }
}
function addOverlay() {
    for (var i = 0; i < overlay.length; i++) {
        overlay[i].style.display = "block";
    }
}
function removeOverlay() {
    //var e=document.querySelectorAll('.overlay');
    for (var i = 0; i < overlay.length; i++) {
        overlay[i].style.display = "none";
    }
}
function searchArticleCtrl(category_name, menuItem) {
    //mainColor=category_name;
    //menuItem=this;
    //menuChanges(menuItem);
    var q = document.getElementById('searchQuery').value;
    if (q.length > 3) {
        setPageTitle("Search Result");
        searchArticle(q, loadSearchResult);
    }
}
function menuChanges(menuItem) {
    // // console.log(mainColor+"mainColor");
    var menu = document.getElementsByClassName('menuItem');
    var i;
    for (i = 0; i < menu.length; i++) {
        menu[i].style.color = "black";
        menu[i].style.fontWeight = "normal";
        menu[i].style.fontSize = "1em";
    }
    menuItem.style.color = mainColor;
    menuItem.style.fontWeight = "bold";
    menuItem.style.fontSize = "1.5em";
    pageTitle.style.backgroundColor = mainColor;
}
function setPageTitle(ptitle) {
    pageTitle.innerHTML = ptitle;
}
function loadArticlesByTechName(techName) {
    var menuItem = getElementById(techName);
    mainColor = (getConfig('multiColor')) ? getMenuColor(techName) : mainColor;
    if (techName != "home") {
        setPageTitle(menuItem.innerHTML);
        loadJSON('content/' + techName + '/data.json', loadArticleGrids);
    } else {
        mainColor = getConfig('mainColor');
        setPageTitle("Home");
        loadJSON('content/' + homeDataLoad + '/data.json', loadArticleGrids);
    }
    menuChanges(menuItem);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
function getElementById(eid) {
    return document.getElementById(eid);
}
function addJSiteMainName() {
    if (typeof getConfig('siteTitle') !== 'undefined') {
        var jtitle = getConfig('siteTitle');
        if (jtitle.length != 0) {
            getElementById('JSiteMainTitle').innerHTML = jtitle;
        }
    }
}
function getCatFromURL() {}
function getDefinedOrNot(em) {
    if (typeof em != "undefined") {
        return true;
        //// // console.log("defined"+em);
    } else {
        return false;
        //// // console.log("not defined" + em);
    }
}
function getAid_cat_authorID_from_Decode_String(t) {
    var t_i = t.split('@jsite@');
    //// // console.log(t_i.length);
    for (var i = 0; i < t_i.length; i++) {
        // // console.log(t_i[i])
    }
    return t_i;
}
function get_Menu_Item_and_Color_code_from_articleID(aaid) {
    var aaid1 = Base64.decode(aaid);
    ds = getAid_cat_authorID_from_Decode_String(aaid1);
    return {
        menuColor: getMenuColor(ds[0]),
        menuItem: ds[0]
    };
}
function hideLoadedArticles_but_view_current_by_article_ID(idValue) {
    var c = document.querySelectorAll('.articleFullView');
    var mic = get_Menu_Item_and_Color_code_from_articleID(idValue);
    //  mainColor = ;
    mainColor = (getConfig('multiColor')) ? mic['menuColor'] : mainColor;
    loadColoring();
    //  // // console.log("jaya"+mic['menuItem']);
    menuChanges(getElementById(mic['menuItem']));
    //  // // console.log(mainColor);
    //  // // console.log("ccccc"+c.length);
    for (var i = 0; i < c.length; i++) {
        var ce = c[i];
        var aaid = ce.getAttribute("id");
        if (idValue === aaid) {
            // // // console.log("aaid"+aaid);
            article_title_obj = ce.querySelector(".title--full")
                //// // console.log("title   _"+ article_title_obj.innerHTML);
            ce.style.display = "block";
        } else {
            //  // // console.log("Notaaid"+aaid);
            ce.style.display = "none";
        }
    }
    // set back to false
}
function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}
function addToolTab_ctrl() {
    var tabLi = document.createElement('li');
    tabLi.setAttribute('id', 'TabToolID_' + articleId_current_opened_full_view);
    var bLi = document.createElement("b");
    bLi.setAttribute("id", 'tabTool_aid_' + articleId_current_opened_full_view);
    bLi.setAttribute('onclick', "loadByArticleID(\'" + articleId_current_opened_full_view + "\')");
    bLi.setAttribute('class', 'small tabTool');
    bLi.innerHTML = title_preview;
    tabLi.appendChild(bLi);
    tabToolBottom.appendChild(tabLi);
}
function removeToolTab_ctrl(aaid) {
    // // console.log("cccccc_" + aaid);
    removeElement("TabToolID_" + aaid);
}
function chechTabToolItemExistOrNot(aaid) {
    if (getElementById('TabToolID_' + aaid)) {
        return true;
    } else {
        return false;
    }
}
function loadColoring() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.github-embed-nav-link-shown { color: ' + mainColor + '  !important; }';
    document.getElementsByTagName('head')[0].appendChild(style);
    figureCaptionBorder_ctrl();
    matching_b_bo_ctrl(mainColor);
    document.getElementById('theSidebar').style.pointerEvents = "none";
    articleTitleStyle(mainColor);
    styleQuotes(mainColor);
    themeStyles(getConfig('theme'));
    contentCB(mainColor);
    figureColorCode(mainColor);
    figureCaptionColorCode(mainColor);
}
function loadByArticleID(article_id) {
    fromTab = true;
    innerLoadArticleByAID(article_id, "tabTool");
}
function innerLoadArticleByAID(article_id, source) {
    var ar_id, au_id, cat_t;
    var decodedArticleID = Base64.decode(article_id);
    // // console.log(decodedArticleID);
    var t_i = getAid_cat_authorID_from_Decode_String(decodedArticleID);
    cat_t = t_i[0];
    mainColor = (getConfig('multiColor')) ? getMenuColor(cat_t) : mainColor;
    //  mainColor = getMenuColor(cat_t);
    ar_id = t_i[1];
    au_id = t_i[2];
    var item = document.createElement('div');
    item.setAttribute('loadURL', ar_id);
    item.setAttribute('authorID', au_id);
    item.setAttribute('articleId', article_id);
    item.setAttribute('class', source);
    //  mainCtrl=new main();
    mainCtrl.loadArticleByID(item);
}
function addTOShorts_Div(el, tagData) {
    var elm = document.createElement("div");
    elm.setAttribute("id", "short_" + tagData);
    elm.innerHTML = el;
    shorts_el.appendChild(elm);
    // console.log(getElementById("short_" + tagData).innerHTML);
}
function displayTagFrom_shorts_div(tagDesc, shortDesitionation, posi) {
    //  // console.log(short_from_shortsDiv);
    shortDesitionation.innerHTML = shortDesitionation.innerHTML + "<div class='Tooltips'><p class='" + posi + "'>" + tagDesc + "</p></div>";
}
function loadToolTips() {
    // Initialize
    var Tooltips = document.querySelectorAll('cb');
    var toolTipsSourse = "content/" + ds[0] + "/shorts.json";
    // Track all tooltips trigger
    for (var i = 0; i < Tooltips.length; i++) {
        // Event Handler
        Tooltips[i].addEventListener("mouseenter", function(ev) {
            ev.preventDefault();
            this.style.position = "relative";
            var tag = this;
            if (!tag.hasAttribute("short_added")) {
                var tagData = (tag.innerHTML.charAt(0) == '@') ? tag.innerHTML.slice(1) : tag.innerHTML;
                //// // console.log(r[0].tagData);
                var theSidebar_width = document.getElementById("theSidebar").offsetWidth;
                // // console.log("theSidebar_width"+theSidebar_width);
                var leftSide_tag = tag.offsetLeft;
                // // console.log("leftSide_tag"+leftSide_tag);
                var rect = tag.getBoundingClientRect();
                // // console.log(rect.top, rect.right, rect.bottom, rect.left);
                //var rightSide_tag=rect.right
                var posi = (leftSide_tag < 100) ? "OnRight" : "OnTop";
                var short_from_shortsDiv = getElementById("short_" + tagData);
                tag.setAttribute("short_added", "yes");
                if (short_from_shortsDiv) {
                    displayTagFrom_shorts_div(short_from_shortsDiv.innerHTML, tag, posi);
                } else {
                    //// // console.log(ta);
                    alasql(['SELECT ' + tagData + ' as tagData   FROM JSON("' + toolTipsSourse + '")']).then(function(res) {
                        // console.log("ajax activated");
                        var r = res[0];
                        var tagDesc = r[0].tagData;
                        if (tagDesc) {
                            // // console.log(posi);
                            var el = "<div class='Tooltips'><p class='" + posi + "'>" + tagDesc + "</p></div>";
                            //
                            tag.innerHTML = tag.innerHTML + el;
                            addTOShorts_Div(tagDesc, tagData);
                        }
                    });
                }
            } else { //// console.log("short_added"+tag.innerHTML);
            }
        });
        Tooltips[i].addEventListener("mouseleave", function(ev) {
            ev.preventDefault();
            //  this.removeAttribute("style");
            // this.innerHTML = this.innerHTML.replace(/<div[^]*?<\/div>/, '');;
        });
    }
}

 function jump(h){
setTimeout(function(){ removeHash(h); }, 5);
 }
function removeHash(h){
  console.log("hash removed"+h);
		history.replaceState('', document.title, window.location.origin + window.location.pathname + window.location.search);
	}
//
// function getPosition(element){
//         var e = document.getElementById(element);
//         var left = 0;
//         var top = 0;
//
//         do{
//             left += e.offsetLeft;
//             top += e.offsetTop;
//         }while(e = e.offsetParent);
// console.log(top+"top");
//         return [left, top];
//     }
//
//     function jump(id){
//         document.getElementById(id).scrollTo(getPosition(id));
//     }
function init() {
    var referrer = location.origin; // document.referrer;
    //// // console.log("jklmn"+referrer);
    createMainMenu_ctrl();
    addJSiteMainName();
    var u = new Url();
    //// // console.log(u.toString());authorHTMLInfo
    var cat_from_url = u.query.cat;
    //// // console.log(u.query.cat);
    var article_id_from_url = u.query.aid;
    if (getDefinedOrNot(article_id_from_url)) {
        //  loadArticlesByTechName(cat_from_url);
        isLoadedFromDirect_By_AID = true;
        mainCtrl = new main();
        innerLoadArticleByAID(article_id_from_url, 'directURL');
        //main();
        //loadWholePage(ar_id,au_id);
    } else {
        //loadJSON('content/data.json', loadArticleGrids); }
        if (getDefinedOrNot(cat_from_url)) {
            loadArticlesByTechName(cat_from_url);
        } else {
            mainColor = getConfig('mainColor');
            // // console.log(mainColor+"mmmm");
            var menuItem = getElementById("home");
            menuChanges(menuItem);
            loadJSON('content/' + homeDataLoad + '/data.json', loadArticleGrids);
        }
    }
}
init();
