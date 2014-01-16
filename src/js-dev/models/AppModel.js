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