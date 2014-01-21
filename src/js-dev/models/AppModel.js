/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 15/01/14
 * Time: 17:45
 * To change this template use File | Settings | File Templates.
 */

/* globals Util:true */
/* globals UserModel:true */
/* globals SongModel:true */
/* globals appModel:true */


var AppModel = (function(){

    var self;

    function AppModel(){
        self = this;

        // EVENT TYPES
        AppModel.DATA_LOADED = "DATA_LOADED";
        AppModel.CURRENT_SONG_CHANGED = "CURRENT_SONG_CHANGED";
        AppModel.ARTIST_INFO_LOADED = "ARTIST_INFO_LOADED";
        AppModel.CURRENT_SONG_INFO_LOADED = "CURRENT_SONG_INFO_LOADED";
        AppModel.NOW_AND_NEXT_LOADED = "NOW_AND_NEXT_LOADED";
        AppModel.PLAYER_STATUS_CHANGED = "PLAYER_STATUS_CHANGED";
        AppModel.NEXT_SONG_CHANGED = "NEXT_SONG_CHANGED";

        this.currentSongIndex = null;
        this.userModel = new UserModel();
        this.isPlaying = true;
        this.currentSong = null;
        this.nextSong = null;
        this.loadingCount = 0;
        this.loadingProgress = 0;
    }


    /*
    ----------------------- API DATA
     */

    AppModel.prototype.fetchPlaylist = function(){
        $.getJSON(Util.api + '/playlist')
            .done(this.getPlaylistHandler);
    };

    AppModel.prototype.getPlaylistHandler = function(data){
        self.playlist = data.list;
        if(self.playlist.length>0){
            self.fetchNowAndNext();
        }
        else{
            console.log("[AppModel] nog geen playlist beschikbaar");
        }
    };

    AppModel.prototype.fetchNowAndNext = function(){
        $.getJSON(Util.api + '/nummer')
            .done(self.fetchNowAndNextHandler);
    };

    AppModel.prototype.fetchNowAndNextHandler = function(data){
        var currentSong = null;
        var nextSong = null;
        self.infoNowAndNextProgress = 0;
        self.loadingCount = 0;
        self.loadingProgress = 0;

        var song = null;
        for(var k=0; k<data.onairs.length; k++){

            song = new SongModel();
            song.title = data.onairs[k].properties[1].value;
            song.artist = data.onairs[k].properties[0].value;
            var startDate = new Date(data.onairs[k].startDate);
            var endDate = new Date(data.onairs[k].endDate);
            song.duration = (endDate.getTime() - startDate.getTime())/1000;
            console.log(song.duration);

            if(data.onairs[k].onairType === "NOW" && data.onairs[k].type ==="SONG")
            {
               currentSong = song;

            }
            else if(data.onairs[k].onairType === "NEXT" && data.onairs[k].type ==="SONG")
            {
               nextSong = song;
            }
        }

        console.log("[AppModel]", currentSong, nextSong);
        // nieuw nummer bij start
        if(currentSong != null && nextSong == null && self.currentSong == null){
            console.log("[AppModel] nieuw now");
            self.currentSong = currentSong;
            self.userModel.songs.push(currentSong);
            self.fetchInfoForSongWithIndex(self.userModel.songs.length - 1, true);
        }
        else if((self.currentSong == null && self.nextSong == null) && (currentSong != null && nextSong != null)){
            console.log("[AppModel] nieuw now & next");
            self.currentSong = currentSong;
            self.userModel.songs.push(currentSong);
            self.fetchInfoForSongWithIndex(self.userModel.songs.length - 1, true);
            self.nextSong = nextSong;
            self.userModel.songs.push(nextSong);
            self.fetchInfoForSongWithIndex(self.userModel.songs.length - 1, false);
        }
        // het huidig nummer is het vorig nummer
        else if(self.nextSong != null && self.nextSong.title === currentSong.title){
            console.log("[AppModel] next wordt now");
            // next nummer in array word huidig nummer
            var currentSongIndex = self.userModel.songs.length - 1;
            self.nextSong = nextSong;
            self.userModel.songs.push(nextSong);
            self.fetchInfoForSongWithIndex(self.userModel.songs.length - 1, false); // fetch next song data
            self.setCurrentSongIndex(currentSongIndex);
        }
        // huidig nummer is gewijzigd
        else if(currentSong != null && self.currentSong.title !== currentSong.title){
            console.log("[AppModel] huidig nummer is gewijzigd");

        }
        // er is al een now song, maar next is nieuw
        else if(self.nextSong == null && nextSong != null){
            console.log("[AppModel] nextSong komt erbij ");
            self.nextSong = nextSong;
            self.userModel.songs.push(nextSong);
            self.fetchInfoForSongWithIndex(self.userModel.songs.length - 1, false);
        }
        else{
            console.log("[AppModel] huidig nummer is ongewijzigd");
        }
    };

    AppModel.prototype.fetchInfoForSongWithIndex = function(songIndex, isCurrentSong){
        self.loadingCount++;
        console.log("[AppModel] fetchInfoForSongWithIndex: "+self.loadingCount);

        var artist = null;
        artist = self.userModel.songs[songIndex].artist;

        if(artist.indexOf('  ')>0){
            artist = artist.substring(0, artist.indexOf('  '));
        }
        if(artist.indexOf(';')>0){
            artist = artist.substring(0, artist.indexOf(';'));
        }

        $.getJSON(Util.api + '/info?artist='+artist, (function(){
            return function(data){
                var artist = null;
                if(data["artist-list"].hasOwnProperty("artist"))
                {
                    if(Array.isArray(data["artist-list"].artist)){
                        artist = data["artist-list"].artist[0];
                    }else{
                        artist = data["artist-list"].artist;
                    }

                    if(artist.hasOwnProperty("life-span")){
                        if(artist["life-span"].hasOwnProperty("begin")){
                           self.userModel.songs[songIndex].period = artist["life-span"].begin.substring(0,4);
                        }
                    }

                    if(artist.hasOwnProperty("area")){
                        self.userModel.songs[songIndex].location = artist.area.name;
                    }else{
                        for(var i=0; i<data["artist-list"].artist.length; i++){
                            if(data["artist-list"].artist[i].hasOwnProperty("area")){
                                self.userModel.songs[songIndex].location = data["artist-list"].artist[i].area.name;
                                break;
                            }
                        }
                    }
                }
                self.fetchLngAndLatForSongWithIndex(songIndex, isCurrentSong);
            };
        })());
    };

    AppModel.prototype.fetchLngAndLatForSongWithIndex = function(index, isCurrentSong){

        console.log(appModel.userModel.songs[index].location);
        $.getJSON("http://maps.googleapis.com/maps/api/geocode/json?address="+
            appModel.userModel.songs[index].location +"&sensor=true",
            function(data){
                appModel.userModel.songs[index].lat = data.results[0].geometry.location.lat;
                appModel.userModel.songs[index].lng = data.results[0].geometry.location.lng;

                if(isCurrentSong){
                    console.log("[AppModel] setCurrentIndex: "+index);
                    self.currentSongIndex = index;
                }

                self.loadingProgress++;
                if(self.loadingProgress >= self.loadingCount){
                    // set local current and next songs when everything is loaded
                    self.currentSong = appModel.userModel.songs[self.currentSongIndex];
                    if(appModel.userModel.songs.length >= self.currentSongIndex + 2){
                        self.nextSong = appModel.userModel.songs[self.currentSongIndex + 1];
                    }
                    //console.log(self.currentSong, self.nextSong);
                    bean.fire(self, AppModel.NOW_AND_NEXT_LOADED);
                }
            }
        );
    };


    /*
     --------------------- LOCAL DATA
     */

    AppModel.prototype.setCurrentSongIndex = function(index){
        if(index !== self.currentSongIndex){
            self.currentSongIndex = index;
            self.currentSong = self.userModel.songs[self.currentSongIndex];
            bean.fire(self,AppModel.CURRENT_SONG_CHANGED);
        }
    };

    AppModel.prototype.addNextSong = function(song){
        if(song !== this.nextSong){
            this.nextSong = song;
            bean.fire(self,AppModel.NEXT_SONG_CHANGED);
            self.getInfoForSongWithIndex(-1, true);
        }
    };

    AppModel.prototype.setIsPlaying = function(status){
        if(status !== this.isPlaying){
            this.isPlaying = status;
            bean.fire(this,AppModel.PLAYER_STATUS_CHANGED);
        }
    };

    return AppModel;

})();


AppModel.NEXT_SONGS_COUNT = 20;