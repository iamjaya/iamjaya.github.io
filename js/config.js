var config = {

  siteTitle:'J@i',
  titleTag:'J@i : Coding, Speach and Write',
  theme:'bold',
  browserwindow: true,
  displayAuthorInfo: true,
  mainColor: "#2fad06",
  threeDboxStyle:false,
  figureCaptionBorder:false,
  multiColor:false,
  fullWindowArticleView:true,
  desktopModel:true,
  toc:true, // this is automatic table of contents
  //menu:['menuID|Menu Label|categoryColor|Status','menuID2|Menu Label2|categoryColor2|Status2',]
//  menu: ['python','spring','java','atom','nodejs','jmeter']
  menu: ['python|Python|false','spring|Spring|true','java|Java|true','atom|Atom IDE|true','nodejs|Node.js|false','jmeter|JMeter|false','quarkus|Quarkus|true','vertx|Vert.x|true','maven|Maven|true'],
//default one is home
  homeDataLoad:"spring"

};

var menuColors_config={

// menuUD='color code'
python:'#1677bd',
spring:'#8bc34b',
java:'#f89820',
atom:'#dda131',
nodejs:'#8fc84f',
jmeter:'#d22128',
quarkus:'skyblue',
vertx:'#782b90',
maven:'gray'


}

var message = 'amit';
var key= 'abc123XYZ';


var getMenuColor = function(propertyName) {
  return menuColors_config[propertyName];
};


var isMobile=function(){

  var isMobileFlag = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		if(isMobileFlag){ console.log("Mobile yes");return true;}else{ console.log("NO mobile");return false;}
}

var getConfig = function(propertyName) {
  return config[propertyName];
};



var loadJS ={

mainjs:"",
readURL:"",
gitEmbeded:"",


}
