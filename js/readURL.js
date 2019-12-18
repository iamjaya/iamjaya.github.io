
/**
	responseHTML
	(c) 2007-2008 xul.fr
	Licence Mozilla 1.1
*/


/**
	Searches for body, extracts and return the content
	New version contributed by users
*/


 function loadJSON(json_file_url,callback) {
//console.log(json_file_url);
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', json_file_url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);

            main();
          }
    };
    xobj.send(null);
 }


function createXHR() {
    var request = false;
    try {
        request = new ActiveXObject('Msxml2.XMLHTTP');
        //console.log('Msxml2.XMLHTTP');
    } catch (err2) {
        try {
            request = new ActiveXObject('Microsoft.XMLHTTP');
            //console.log('Microsoft.XMLHTTP');
        } catch (err3) {
            try {
                request = new XMLHttpRequest();
                //console.log('XMLHttpRequest.XMLHTTP');
            } catch (err1) {
                request = false;
            }
        }
    }
    return request;
}

function getBody(content)
{
   test = content.toLowerCase();    // to eliminate case sensitivity
   var x = test.indexOf("<body");
   if(x == -1) return "";

   x = test.indexOf(">", x);
   if(x == -1) return "";

   var y = test.lastIndexOf("</body>");
   if(y == -1) y = test.lastIndexOf("</html>");
   if(y == -1) y = content.length;    // If no HTML then just grab everything till end

   return content.slice(x + 1, y);
}

/**
	Loads a HTML page
	Put the content of the body tag into the current page.
	Arguments:
		url of the other HTML page to load
		id of the tag that has to hold the content
*/

function loadHTML(url, fun, storage, param)
{
	var xhr = createXHR();
	xhr.onreadystatechange=function()
	{
		if(xhr.readyState == 4)
		{


			//if(xhr.status == 200)
			{
				storage.innerHTML = getBody(xhr.responseText);
//alert("loaded");  //  //console.log(storage.innerHTML);
      //  //console.log(url);
				fun(storage, param);
        //console.log(document.getElementById("settings-object"));

          githubEmbed('#settings-object', {
            "owner": "finom",
              "repo": "github-embed",
              "ref": "gh-pages",
            "embed": [{
              "path": "demo.html"
            }, {
              "path": "README.md"
            }]
          });
			}
		}
	};

	xhr.open("GET", url , true);
	xhr.send(null);

}

	/**
		Callback
		Assign directly a tag
	*/


	function processHTML(temp, target)
	{
		target.innerHTML = temp.innerHTML;

	}

	function loadWholePage(url)
	{
		var y = document.getElementById("displayContent");
		var x = document.getElementById("displayContent");
		loadHTML(url, processHTML, x, y);
	}


	/**
		Create responseHTML
		for acces by DOM's methods
	*/

	function processByDOM(responseHTML, target)
	{
		target.innerHTML = "Extracted by id:<br />";

		// does not work with Chrome/Safari
		//var message = responseHTML.getElementsByTagName("div").namedItem("two").innerHTML;
		var message = responseHTML.getElementsByTagName("div").item(1).innerHTML;

		target.innerHTML += message;

		target.innerHTML += "<br />Extracted by name:<br />";

		message = responseHTML.getElementsByTagName("form").item(0);
		target.innerHTML += message.dyn.value;
	}

	function accessByDOM(url)
	{
		//var responseHTML = document.createElement("body");	// Bad for opera
		var responseHTML = document.getElementById("storage");
		var y = document.getElementById("displayed");
		loadHTML(url, processByDOM, responseHTML, y);
	}

function loadArticleGrids(response) {
 // Parse JSON string into object
   var actual_JSON = JSON.parse(response);
   var article_Itmes="";
   actual_JSON.forEach( function(article) {
article_Itmes=article_Itmes+'<a class="grid__item threedbox" href="#" loadurl="'+ article.article_loadURL+'"> <h2 class="title title--preview"> '+article.article_title+'</h2><div class="loader"></div><span class="category">'+article.article_cat+'</span><div class="meta meta--preview"><img class="meta__avatar" width="50px" src="content/'+article.icon+'/icon.png" alt="Node.js"><span class="meta__date"><i class="fa fa-calendar-o"></i> Starting on : '+article.article_start_date+'</span><span class="meta__reading-time"><i class="fa fa-clock-o"></i> Node.js</span></div></a>';
     //console.log(article_Itmes) ;
   }

 );

  document.getElementById('articlesCard').innerHTML=article_Itmes;
}


function loadArticlesByTechName(techName,menuItem,colorOfTech){

  var menu=document.getElementsByClassName('menuItem');

  var i;
for (i = 0; i < menu.length; i++) {
  menu[i].style.color = "black";
  menu[i].style.fontWeight="normal";
  menu[i].style.fontSize="1em";
}
menuItem.style.color = colorOfTech;
menuItem.style.fontWeight="bold";
menuItem.style.fontSize="1.5em";
var pageTitle=   document.getElementById('pageTitle');
 pageTitle.style.backgroundColor=colorOfTech;
if(techName!="data"){

   pageTitle.innerHTML=techName;

  loadJSON('content/'+techName+'/data.json',loadArticleGrids );
 }
  else {

     pageTitle.innerHTML="Home";
    loadJSON('content/data.json',loadArticleGrids );
  }
}

  function init() {
    //console.log("init from readURL");
 loadJSON('content/data.json',loadArticleGrids );
}
init();
