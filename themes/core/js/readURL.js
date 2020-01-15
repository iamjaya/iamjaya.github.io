
var main_Loaded=false;
var article_Content_area = document.getElementById("content");
var article_title_obj;

var mainColor = getConfig('mainColor');
var authorImg = "";
var author_display_name = "";
var authorsFolder = "authors";
var lazyloadImages; // = document.querySelectorAll("img.lazy");
var lazyloadThrottleTimeout;
var scroller = document.querySelector('#scroller');

var article_title = "";
var displayed = false;



var classThreedBox = (getConfig('threeDboxStyle')) ? 'threedbox' : 'no3dbox graycolor';
var figureCaptionBorder_style=(getConfig('figureCaptionBorder'))? 'borderStyle' : 'noBorderFigure';

var UID = {
  _current: 0,
  getNew: function() {
    this._current++;
    return this._current;
  }
};

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



function loadJSON(json_file_url, callback, no_main) {
  ////console.log(json_file_url);
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', json_file_url, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
      if (!!no_main || no_main === '') {} else {
				if(!main_Loaded){
        main();
		//		main_Loaded=true;
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
      {
        storage.innerHTML = getBody(xhr.responseText);
        fun(storage, param);

        var url_array = url.split('/');
        var color_code = url_array[1];
        article_title_obj = document.getElementById("article_title");
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.github-embed-nav-link-shown { color: ' + mainColor + '  !important; }';
        document.getElementsByTagName('head')[0].appendChild(style);
        if (getConfig('displayAuthorInfo')) {
          //console.log("Author Info activated");
          displayAuthorData();
					loadAuthorsInfo(authorID, authorsFolder);


        }


        figureCaptionBorder_ctrl();
addBrowserLook();

        //	//console.log(authorImg);
        document.getElementById('theSidebar').style.pointerEvents = "none";
articleTitleStyle(mainColor);

        contentCB(mainColor);

        // figure block color coding
				figureColorCode(color_code);

        // figure caption color code

				figureCaptionColorCode(color_code);

        //  var codeBlocks = document.getElementById('codeBlocks');
        var codeBlocks_array = document.getElementsByClassName("codeBlock"); // codeBlocks.getAttribute('data').split(",");

        for (j = 0; j < codeBlocks_array.length; j++) {


          var cbID = "codeBlock_" + j;
          //	//console.log(cbID);
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


      }

			lazyLoadImages();
    }
  };

  xhr.open("GET", url, true);
  xhr.send(null);

}

/**
	Callback
	Assign directly a tag
*/
function threeDBoxStyle_activate(){

if(getConfig('threeDboxStyle')){


}

}
function articleTitleStyle(mainColor_final){


	        var topic_title = document.getElementsByClassName('topic_title');

	        var i1;
	        for (i1 = 0; i1 < topic_title.length; i1++) {
	          topic_title[i1].style.color = mainColor_final;
	         //  topic_title[i1].style.borderBottom = "2px solid " + mainColor_final;

	          // classList.add(color_code);
	        }
}
function contentCB(mainColor_final)
{

	        var cb = document.getElementsByTagName('cb');

	        var cb1;

	        for (cb1 = 0; cb1 < cb.length; cb1++) {

	          cb[cb1].style.color = mainColor_final; //.add(color_code);

	        }

}

function figureCaptionColorCode(color_code_final){
	var figcaption = document.getElementsByTagName('figcaption');
	var i3;
	for (i3 = 0; i3 < figcaption.length; i3++) {
		figcaption[i3].classList.add(color_code_final + '_figcaption');
	}
}


function figureColorCode(color_code_final){

	var figure = document.getElementsByClassName('figure');

	var i2;
	for (i2 = 0; i2 < figure.length; i2++) {
		figure[i2].classList.add(color_code_final + '_figure');
	}

}

function figureCaptionBorder_ctrl(){


		var figure = document.getElementsByClassName('figure');

		var i2;
		for (i2 = 0; i2 < figure.length; i2++) {
			classie.add(figure[i2],figureCaptionBorder_style);
		//	figure[i2].classList.add(color_code_final + '_figure');
		}
		var figcaption = document.getElementsByTagName('figcaption');
		var i3;
		for (i3 = 0; i3 < figcaption.length; i3++) {
		//	figcaption[i3].classList.add(color_code_final + '_figcaption');

		classie.add(figcaption[i3],'noBorderFigureCaption');
		}


}
function displayAuthorData() {

  var authorArea = document.createElement('div');
  classie.add(authorArea, 'meta');
  classie.add(authorArea, 'meta--full')
  authorArea.setAttribute("ID", "authorData");
  article_title_obj.after(authorArea);


}


function addBrowserLook(){
	if (getConfig('browserwindow')) {

 	 var browserStyle = document.createElement('div');
 	 browserStyle.setAttribute("class", "browser-look");
 	 browserStyle.setAttribute("id", "title_article_browser_look");

 	 browserStyle.innerHTML = '<span class="control"></span><span class="control"></span><span class="control"></span>';
 	 // Prepend it
 	 article_Content_area.insertBefore(browserStyle, article_Content_area.firstChild);

 	 scroller.addEventListener("scroll", changeBrowserWindowTitle);
  }

}

function changeBrowserWindowTitle() {
  var scrollTop = scroller.scrollTop; //.pageYOffset;
  //var article_title_obj = document.getElementById('article_title');
  //	//console.log("eeee"+scrollTop);
  if (!displayed) {
    if ((article_title_obj.offsetTop < scrollTop)) {

			      article_title = article_title_obj.innerHTML;

      var title_article_browser_look = document.getElementById('title_article_browser_look');

      title_article_browser_look.pseudoStyle("before", "content", "\'" + article_title + "\'");

      displayed = true;
    }
  }
  if (article_title_obj.offsetTop > scrollTop) {

    document.getElementById('title_article_browser_look').pseudoStyle("before", "content", "\' \'");
    displayed = false;

  }


}



function lazyLoadImages(){


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
  //var responseHTML = document.createElement("body");	// Bad for opera
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
  document.getElementById('authorData').innerHTML = authorHTMLInfo;
}

function loadArticleGrids(response) {
  // Parse JSON string into object
  var actual_JSON = JSON.parse(response);
  var article_Itmes = "";
  actual_JSON.forEach(function(article) {
  article_Itmes = article_Itmes + '<div class="grid__item " href="#" authorID="' + article.authorID + '" loadurl="' + article.article_loadURL + '"><div class="'+classThreedBox+'"> <h2 class="title title--preview"> ' + article.article_title + '</h2><div class="loader" ></div><span class="category" style="display:none;">' + article.article_cat + '</span><div class="meta meta--preview"><img class="meta__avatar" width="50px" src="content/' + article.icon + '/icon.png" alt="Node.js"><span class="meta__date" style="display:none;"><i class="fa fa-calendar-o"></i>' + article.article_start_date + '</span><span class="meta__reading-time" style="display:none;"> Node.js | MySQL | Redis Cache | Amazon AWS</span></div></div></div>';

  });

  document.getElementById('articlesCard').innerHTML = article_Itmes;

  var ht = document.getElementsByTagName("ht");
  var ht1;
  for (ht1 = 0; ht1 < ht.length; ht1++) {
    ht[ht1].style.color = mainColor;
  }

  var style_loader = document.getElementById('style_loader');

  style_loader.innerHTML = '.loader::before { background: ' + mainColor + '  !important; }';
  //	document.getElementsByTagName('head')[0].appendChild(style);

}


function loadArticlesByTechName(techName, menuItem, colorOfTech) {
  mainColor = colorOfTech;
  var menu = document.getElementsByClassName('menuItem');

  var i;
  for (i = 0; i < menu.length; i++) {
    menu[i].style.color = "black";
    menu[i].style.fontWeight = "normal";
    menu[i].style.fontSize = "1em";
  }

  menuItem.style.color = colorOfTech;
  menuItem.style.fontWeight = "bold";
  menuItem.style.fontSize = "1.5em";
  var pageTitle = document.getElementById('pageTitle');
  pageTitle.style.backgroundColor = colorOfTech;




  if (techName != "data") {

    pageTitle.innerHTML = techName;

    loadJSON('content/' + techName + '/data.json', loadArticleGrids);

  } else {

    pageTitle.innerHTML = "Home";
    loadJSON('content/data.json', loadArticleGrids);
  }
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}




function init() {


  loadJSON('content/data.json', loadArticleGrids);
}
init();
