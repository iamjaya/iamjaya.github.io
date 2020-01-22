var config = {

  siteTitle:'J@i',
  titleTag:'J@i : Coding, Speach and Write',
  theme:'moon',
  browserwindow: true,
  displayAuthorInfo: true,
  mainColor: "#2fad06",
  threeDboxStyle:false,
  figureCaptionBorder:false,
  multiColor:false,
  fullWindowArticleView:true,
  desktopModel:true,
  //menu:['menuID|Menu Label|categoryColor|Status','menuID2|Menu Label2|categoryColor2|Status2',]
//  menu: ['python','spring','java','atom','nodejs','jmeter']
  menu: ['python|Python|false','spring|Spring|true','java|Java|false','atom|Atom IDE|true','nodejs|Node.js|false','jmeter|JMeter|false','quarkus|Quarkus|true','vertx|Vert.x|true'],
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
vertx:'#782b90'


}

var message = 'amit';
var key= 'abc123XYZ';


var getMenuColor = function(propertyName) {
  return menuColors_config[propertyName];
};


var getConfig = function(propertyName) {
  return config[propertyName];
};



var loadJS ={

mainjs:"",
readURL:"",
gitEmbeded:"",


}
