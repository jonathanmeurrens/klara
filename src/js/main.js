(function(){

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:30
 * To change this template use File | Settings | File Templates.
 */

/* globals Util:true */

var Dot = (function(){

    function Dot(){

    }

    return Dot;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:30
 * To change this template use File | Settings | File Templates.
 */

/* globals google:true */
/* globals appModel:true */
/* globals AppModel:true */

var MyMap = (function(){

    var self;

    function MyMap(){
        self = this;
        bean.on(appModel, "DATA_LOADED", function(){
            self.draw();
        });
    }

    MyMap.prototype.draw = function(){
        for(var i=0; i<AppModel.NEXT_SONGS_COUNT; i++){
            console.log(appModel.playlist[i].coordinates);
            /*$.getJSON("http://maps.googleapis.com/maps/api/geocode/json?address="+
                appModel.playlist[i].location +"&sensor=true",
                geocodeHandler);*/
        }
        var mapOptions = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 8
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
    };

    function geocodeHandler(data){
        console.log(data);
    }

    return MyMap;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 15/01/14
 * Time: 17:45
 * To change this template use File | Settings | File Templates.
 */

/* globals Util:true */

var AppModel = (function(){

    var self;

    function AppModel(){
        self = this;
        this.playlist = "test";
        this.dataProgress = 0;
    }

    AppModel.prototype.getPlaylist = function(){
        $.getJSON(Util.api + '/playlist')
            .done(this.getPlaylistHandler);
    };

    AppModel.prototype.getPlaylistHandler = function(data){
        self.playlist = data.list;
        if(self.playlist.length>0){
            self.getInfoForPlaylist();
        }
        else{
            console.log("[AppModel] nog geen playlist beschikbaar");
        }
    };

    AppModel.prototype.getInfoForPlaylist = function(){
        this.counter = 0;
        this.interval = setInterval(function(){
            if(self.counter >= AppModel.NEXT_SONGS_COUNT){
                clearInterval(self.interval);
                self.counter = 0;
                return;
            }
            $.getJSON(Util.api + '/info?artist='+self.playlist[self.counter].artist, (function(){
                var song_index = self.counter;
                self.counter++;
                return function(data){
                    self.getInfoHandler(data, song_index);
                };
            })());
        },100);
    };

    AppModel.prototype.getInfoHandler = function(data, song_index){
        var artist = null;
        if(Array.isArray(data["artist-list"].artist)){
            artist = data["artist-list"].artist[0];
        }else{
            artist = data["artist-list"].artist;
        }
        if(artist.hasOwnProperty("area")){
            self.playlist[song_index].location = artist.area.name;
            $.getJSON("http://maps.googleapis.com/maps/api/geocode/json?address="+
                self.playlist[song_index].location +"&sensor=true",
                (function(){
                    var index = song_index;
                    return function(data){
                        self.playlist[index].coordinates = {'long':data.results[0].geometry.location.lng,
                            'lat':data.results[0].geometry.location.lat};
                        //console.log(self.playlist[index].coordinates);
                    };
                })());
        }
        this.dataProgress++;
        if(this.dataProgress === AppModel.NEXT_SONGS_COUNT){
            //self.getLongAndLatForPlaylist(self.playlist);
            bean.fire(self,"DATA_LOADED");
        }
    };

   /* AppModel.prototype.getLongAndLatForPlaylist = function(playlist){
        var locationsQuery = "";
        for(var i=0; i<AppModel.NEXT_SONGS_COUNT; i++){
            if(playlist[i].location){
                locationsQuery += "&location=" + playlist[i].location;
                console.log("[AppModel] "+playlist[i].location);
            }
        }
        console.log(locationsQuery);
    };*/

   /* AppModel.prototype.getLongAndLatForPlayListHandler = function(data){
        console.log(data);
    };*/

    return AppModel;

})();


AppModel.NEXT_SONGS_COUNT = 5;

var Util = (function(){

    function Util(){

    }

    Util.api = "http://localhost:8888/devine/MAV/klara/api";
    Util.appKey = "Fmjtd%7Cluur29u8n9%2C20%3Do5-908x9u";

    return Util;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:02
 * To change this template use File | Settings | File Templates.
 */

/* globals Util:true */
/* globals $jit:true */
/* globals AppModel:true */
/* globals MyMap:true */

var appModel;

var App = (function(){

    function App($sourceElement){
        _.bindAll(this); // this altijd slaat op deze klasse
        /*this.$sourceElement = $sourceElement;*/

        appModel = new AppModel();
        appModel.getPlaylist();

        this.map = new MyMap();
    }

    return App;
})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 17:37
 * To change this template use File | Settings | File Templates.
 */

/* globals App:true */

var app = new App($("#container"));
//app.init();



})();