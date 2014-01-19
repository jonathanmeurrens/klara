/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 15/01/14
 * Time: 17:45
 * To change this template use File | Settings | File Templates.
 */

/* globals Util:true */
/* globals UserModel:true */


var AppModel = (function(){

    var self;

    function AppModel(){
        self = this;

        // EVENT TYPES
        AppModel.DATA_LOADED = "DATA_LOADED";
        AppModel.CURRENT_SONG_CHANGED = "CURRENT_SONG_CHANGED";
        AppModel.ARTIST_INFO_LOADED = "ARTIST_INFO_LOADED";
        AppModel.CURRENT_SONG_INFO_LOADED = "CURRENT_SONG_INFO_LOADED";
        //AppModel.CURRENT_SCREEN_TYPE_CHANGED = "CURRENT_SCREEN_TYPE_CHANGED";

        this.playlist = [];
        this.currentSongIndex = 0;
        this.userModel = new UserModel();
        //this.currentScreenType = "";

        this.dataProgress = 0;
    }


    /*
    ----------------------- API DATA
     */

    AppModel.prototype.getPlaylist = function(){
        $.getJSON(Util.api + '/playlist')
            .done(this.getPlaylistHandler);
    };

    AppModel.prototype.getPlaylistHandler = function(data){
        self.playlist = data.list;
        if(self.playlist.length>0){
            bean.fire(self,AppModel.DATA_LOADED);
            self.getCurrentSong();
        }
        else{
            console.log("[AppModel] nog geen playlist beschikbaar");
        }
    };

    /*AppModel.prototype.getInfoForPlaylist = function(){
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
                console.log(song_index, self.counter);
                return function(data){
                    self.getInfoHandler(data, song_index);
                };
            })());
        },100);
    };*/

    /*AppModel.prototype.getInfoHandler = function(data, song_index){
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
                        console.log("[AppModel] index coordinates"+index);
                    };
                })());
        }
        this.dataProgress++;
        if(this.dataProgress === AppModel.NEXT_SONGS_COUNT){
            //self.getLongAndLatForPlaylist(self.playlist);
            bean.fire(self,"DATA_LOADED");
        }
    };*/


    AppModel.prototype.getCurrentSong = function(){
        $.getJSON(Util.api + '/nummer')
            .done(this.getCurrentSongHandler);
    };

    AppModel.prototype.getCurrentSongHandler = function(data){
        console.log(data);
        for(var i=0; i<data.onairs.length; i++){
            if(data.onairs[i].onairType === "PREVIOUS" && data.onairs[i].type ==="SONG"){
                for(var j=0; j<self.playlist.length; j++){
                    if(self.playlist[j].title === data.onairs[i].properties[1].value){
                        self.setCurrentSongIndex(j);
                    }
                }
            }
        }
    };

    AppModel.prototype.getInfoForSongCurrentSong = function(){
        console.log(self.playlist[self.currentSongIndex]);
        var artist = self.playlist[self.currentSongIndex].artist;
        console.log(artist);
        if(artist.indexOf('  ')>0){
            artist = artist.substring(0, artist.indexOf('  '));
        }
        if(artist.indexOf(';')>0){
            artist = artist.substring(0, artist.indexOf(';'));
        }
        console.log(artist);
        $.getJSON(Util.api + '/info?artist='+artist, (function(){
            var index = self.currentSongIndex;
            return function(data){
                var artist = null;
                console.log(data);
                if(data["artist-list"].hasOwnProperty("artist"))
                {
                    if(Array.isArray(data["artist-list"].artist)){
                        artist = data["artist-list"].artist[0];
                    }else{
                        artist = data["artist-list"].artist;
                    }

                    if(artist.hasOwnProperty("life-span")){
                        if(artist["life-span"].hasOwnProperty("begin")){
                            self.playlist[index].period = artist["life-span"].begin.substring(0,4);
                        }else{
                            self.playlist[index].period = 2014;
                        }
                    }else{
                        self.playlist[index].period = 2014;
                    }
                    console.log(self.playlist[index].period);

                    if(artist.hasOwnProperty("area")){
                        self.playlist[index].location = artist.area.name;
                    }else{
                        for(var i=0; i<data["artist-list"].artist.length; i++){
                            if(data["artist-list"].artist[i].hasOwnProperty("area")){
                                self.playlist[index].location = data["artist-list"].artist[i].area.name;
                                break;
                            }
                        }
                    }
                }
                bean.fire(self, AppModel.CURRENT_SONG_INFO_LOADED);
            };
        })());
    };


    /*
     --------------------- LOCAL DATA
     */

    /*AppModel.prototype.setUserProgress = function(progress){
        this.userModel.progress = progress;
        bean.fire(self,AppModel.USER_PROGRESS_CHANGED);
    };*/

    AppModel.prototype.setCurrentSongIndex = function(index){
        self.currentSongIndex = index;
        bean.fire(self,AppModel.CURRENT_SONG_CHANGED);
        self.getInfoForSongCurrentSong();

        //this.userModel.setProgress(this.userModel.progress + 50);
    };

   /* AppModel.prototype.setCurrentScreenType = function(screenType){
        this.currentScreenType = screenType;
        bean.fire(self,AppModel.CURRENT_SCREEN_TYPE_CHANGED);
    };*/

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


AppModel.NEXT_SONGS_COUNT = 20;