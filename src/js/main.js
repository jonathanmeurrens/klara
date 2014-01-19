(function(){

var Button = (function(){

    var self;

    function Button(button_type){

        self = this;

        this.view = new createjs.Container();

        var url = 'assets/buttons/' + button_type.toLowerCase()+".png";

        this.width = 50;
        this.height = 50;

        if(button_type === Button.FACEBOOK || button_type === Button.TWITTER){
            this.width = 23;
            this.height = 23;
        }

        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        this.btn = new createjs.Bitmap(url);
        this.view.addChild(this.btn);
        this.btn.regX = this.width/2;
        this.btn.regY = this.height/2;

        this.btn.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.07, scaleY:1.07},  100);
        });
        this.btn.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });

        this.view.cursor = 'pointer';
        this.btn.scaleX = 0.7;
        this.btn.scaleY = 0.7;
        createjs.Tween.get(this.btn).to({scaleX:1, scaleY:1},  1400, createjs.Ease.elasticOut);
    }

    return Button;

})();

// BUTTON TYPES
Button.FACEBOOK = "FACEBOOK";
Button.TWITTER = "TWITTER";

/* globals gameData:true  */

var CampaignScreen = (function(){

    var self;

    function CampaignScreen(){
        self = this;
        this.view = new createjs.Container();
        var text = new createjs.Text("CAMPAIGN SCREEN","22px Arial", "#000000");
        text.x = stage.canvas.width/2 - 120;
        text.y = stage.canvas.height/2 - 15;
        this.view.addChild(text);
    }

    return CampaignScreen;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:30
 * To change this template use File | Settings | File Templates.
 */

/* globals Util:true */
/* globals DotInfo:true */
/* globals appModel:true */

var Dot = (function(){

    function Dot(songIndex){
        //_.bindAll(this);

        // EVENT TYPES
        Dot.CLICKED = "CLICKED";

        this.songIndex = songIndex;

        this.view = new createjs.Container();
        this.circle = new createjs.Shape();
        this.circle.mouseEnabled = true;
        this.circle.graphics.beginFill("#000").drawCircle(0, 0, 1.5);
        this.view.x = stage.canvas.width / 2;
        this.view.y = stage.canvas.height / 2;
        this.view.addChild(this.circle);
        this.view.mouseEnabled = true;
        this.view.alpha = 0;

        this.circle.addEventListener("click",$.proxy( function(){
            var event = new createjs.Event(Dot.CLICKED, true);
            event.songIndex =  this.songIndex;
            this.view.dispatchEvent(event);
        }, this ));
    }

    Dot.prototype.randomPosition = function(){
        var marge = 0;
        /*var toX = marge + (Math.random() * (stage.canvas.width - (marge * 2)));
        var toY = marge + (Math.random() * (stage.canvas.height - (marge * 2)));*/
        var toX = this.songIndex * 100;
        var toY = stage.canvas.height/2 - 100 + Math.random() * 100;
        var speed = 3000 + Math.random() * 3000;
        this.circle.scaleX = this.circle.scaleY = 1;
        createjs.Tween.get(this.view).to({x:toX, y:toY, alpha:1}, speed, createjs.Ease.elasticOut);
    };

    Dot.prototype.centerPosition = function(){
        var toX = stage.canvas.width / 2;
        var toY = stage.canvas.height / 2;
        var speed = 3000 + Math.random() * 3000;
        createjs.Tween.get(this.view).to({x:toX, y:toY}, speed, createjs.Ease.elasticOut);

        this.circle.scaleX = this.circle.scaleY = 2.5;
    };

    Dot.prototype.showInfoView = function(){
        if(this.dotInfo == null){
            this.dotInfo = new DotInfo(appModel.playlist[this.songIndex]);
            this.view.addChild(this.dotInfo.view);
            console.log("[Dot] show dot info");
        }
    };

    Dot.prototype.hideInfoView = function(){
        if(this.dotInfo != null){
            this.view.removeChild(this.dotInfo.view);
            this.dotInfo = null;
            console.log("[Dot] hide dot info");
        }
    };

    function tick(e){

    }

    return Dot;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 18/01/14
 * Time: 10:06
 * To change this template use File | Settings | File Templates.
 */

/* globals Button:true */
/* globals postOnFacebook:true */

var DotInfo = (function(){

    function DotInfo(songInfo){

        this.view = new createjs.Container();
        this.backgroundShape = new createjs.Shape();
        this.backgroundShape.graphics.beginFill("#000");
        this.backgroundShape.graphics.setStrokeStyle(2);
        this.backgroundShape.graphics.lineTo(0,0);
        this.backgroundShape.graphics.lineTo(50,-100);
        this.backgroundShape.graphics.lineTo(150,-100);
        this.backgroundShape.graphics.lineTo(150,-40);
        this.backgroundShape.graphics.endFill();
        this.backgroundShape.graphics.closePath();
        this.view.addChild(this.backgroundShape);

        this.titleTxt = new createjs.Text(songInfo.title,"14px Arial", "#f5f5f5");
        this.titleTxt.y = -94;
        this.titleTxt.x = 55;
        this.titleTxt.mask = this.backgroundShape;
        this.view.addChild(this.titleTxt);

        this.artistTxt = new createjs.Text(songInfo.artist,"11px Arial", "#D5C502");
        this.artistTxt.y = -72;
        this.artistTxt.x = 43;
        this.artistTxt.mask = this.backgroundShape;
        this.view.addChild(this.artistTxt);

        var fbButton = new Button(Button.FACEBOOK);
        this.view.addChild(fbButton.view);
        fbButton.view.x = 40;
        fbButton.view.y = 40;
        fbButton.view.addEventListener("click", function(e){
            console.log("[DotInfo] clicked on Facebook");
            postOnFacebook(200);
        });

        var twButton = new Button(Button.TWITTER);
        this.view.addChild(twButton.view);
        twButton.view.x = -20;
        twButton.view.y = -25;
        twButton.view.addEventListener("click", function(e){
            console.log("[DotInfo] clicked on Twitter");
        });

        console.log(this.titleTxt.getBounds().width);

        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function tick(e){
        this.titleTxt.x -= 1;
        if(this.titleTxt.x < - (this.titleTxt.getBounds().width - 45)){
            this.titleTxt.x = this.titleTxt.getBounds().width + 55;
        }
    }

    return DotInfo;

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
/* globals Dot:true */
/* globals Util:true */
/* globals MarkerWithLabel:true */

var MyMap = (function(){

    var self;

    function MyMap(){
        self = this;

        this.dots = [];
        this.view = new createjs.Container();

        this.lines = new createjs.Graphics();
        var linesShape = new createjs.Shape(this.lines);
        this.view.addChild(linesShape);

        this.progressLine = new createjs.Graphics();
        this.progressLineShape = new createjs.Shape(this.progressLine);
        this.view.addChild(this.progressLineShape);

        bean.on(appModel, AppModel.DATA_LOADED, function(){
            self.draw();
        });
        bean.on(appModel, AppModel.CURRENT_SONG_CHANGED, function(){
            centerDotWithIndex(appModel.currentSongIndex);
        });
        bean.on(appModel, AppModel.CURRENT_SONG_INFO_LOADED, function(){
            centerMapAndShowInfoForDotWithIndex(appModel.currentSongIndex);
        });

        $(this.view).on('tick', $.proxy( tick, this ));
    }

    MyMap.prototype.draw = function(){
        for(var i=0; i<AppModel.NEXT_SONGS_COUNT; i++){
            var dot = new Dot(i);
            this.view.addChild(dot.view);
            this.dots.push(dot);
            dot.view.addEventListener(Dot.CLICKED, dotClickedHandler);
        }

        //var bgColor = "#f1f0ed";

        var styles = [

            {
                featureType: "all",
                elementType: "all",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [
                    {color: "#eeeeee"},
                    { visibility: "on" }
                ]
            },{
                featureType: "landscape",
                elementType: "geometry",
                stylers: [
                    {"color": "#FFFFFF"},
                    { visibility: "on" }
                ]
            },/*{
                featureType: "landscape.man_made",
                elementType: "geometry.fill",
                stylers: [
                    { visibility: "simplified" }
                ]
            },{
                featureType: "landscape.natural",
                elementType: "geometry",
                stylers: [
                    {"color": bgColor},
                    { visibility: "on" }
                ]
            },{
                featureType: "landscape.natural.landcover",
                elementType: "geometry.fill",
                stylers: [
                    {color: "#FFFFFF"},
                    {weight: "0.1"},
                    { visibility: "on" }
                ]
            },*/{
                featureType: "landscape.natural",
                elementType: "geometry.fill",
                stylers: [
                    {"color": "#FFFFFF"},
                    { visibility: "on" }
                ]
            }

        ];

        this.mapOptions = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 8,
            mapTypeId: google.maps.StyledMapType.TERRAIN,
            panControl: false,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            overviewMapControl: false
        };
        this.map = new google.maps.Map(document.getElementById("map-canvas"),
            this.mapOptions);
        this.map.setOptions({styles: styles});

        addCapitalMarkersOnMap();
    };

    function addCapitalMarkersOnMap(){
        $.getJSON("assets/countries.json", function(data){
            for(var i=0; i<data.length; i++){
                var marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(data[i].latlng[0],data[i].latlng[1]),
                    draggable: true,
                    map: self.map,
                    labelContent: data[i].capital,
                    labelAnchor: new google.maps.Point(22, 0),
                    labelClass: "labels" // the CSS class for the label
                    /*labelStyle: {opacity: 0.75}*/
                });
                marker.setIcon("assets/pixel_trans.gif");
            }
        });
    }

    function centerDotWithIndex(index){
        console.log("[MyMap] current dot " + self.dots[index]);
        self.dots[index].centerPosition();

        for(var i=0; i<self.dots.length; i++){
            if(i !== index){
                self.dots[i].randomPosition();
            }
        }
    }

    function centerMapAndShowInfoForDotWithIndex(index){

        for(var i=0; i<self.dots.length; i++){
            self.dots[i].hideInfoView();
        }

        self.dots[index].showInfoView();

        $.getJSON("http://maps.googleapis.com/maps/api/geocode/json?address="+
            appModel.playlist[index].location +"&sensor=true",
            function(data){
                var location = new google.maps.LatLng(
                    data.results[0].geometry.location.lat,
                    data.results[0].geometry.location.lng
                );
                self.map.panTo(location);
                self.map.setZoom(6);
            }
        );
    }

    function dotClickedHandler(event){
        console.log("[MyMap] dot: "+event.songIndex);
        console.log(appModel.playlist[event.songIndex]);
        appModel.setCurrentSongIndex(event.songIndex);
    }

    function tick(e){
        this.lines.clear();
        this.lines.setStrokeStyle(0.3);
        this.lines.beginStroke(createjs.Graphics.getRGB(180,180,180));
        for(var i = 0; i < this.dots.length - 1; i++){
            this.lines.moveTo(this.dots[i].view.x, this.dots[i].view.y);
            this.lines.lineTo(this.dots[i+1].view.x, this.dots[i+1].view.y);
        }

        /*this.progressLine.clear();
        this.progressLine.setStrokeStyle(2);
        this.progressLine.beginStroke(createjs.Graphics.getRGB(180,180,180));
        this.progressLine.moveTo(this.dots[appModel.currentSongIndex].view.x, this.dots[appModel.currentSongIndex].view.y);
        this.progressLine.lineTo(this.dots[appModel.currentSongIndex+1].view.x, this.dots[appModel.currentSongIndex+1].view.y);
        this.progressLineShape.regX = this.dots[appModel.currentSongIndex].view.x;
        this.progressLineShape.regY = this.dots[appModel.currentSongIndex].view.y;
        this.progressLineShape.scaleX = this.progressLineShape.scaleY = 0.5;*/
        /*if(appModel.currentSongIndex > 0){
            console.log(calculateAngleFrom(this.dots[appModel.currentSongIndex].view.x, this.dots[appModel.currentSongIndex].view.y,
                this.dots[appModel.currentSongIndex + 1].view.x, this.dots[appModel.currentSongIndex + 1].view.y));
        }*/
    }

    function calculateAngleFrom (xPos1, yPos1, xPos2, yPos2){
        var deltaX = yPos2 - yPos1;
        var deltaY = xPos2 - xPos1;
        var angleInDegress = Math.atan2(deltaX, deltaY);
        return angleInDegress;
    }

    return MyMap;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 17/01/14
 * Time: 10:33
 * To change this template use File | Settings | File Templates.
 */

var Particles = (function(){

    function Particle(){

    }

    function tick(e){

    }

    return Particles;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 19/01/14
 * Time: 10:32
 * To change this template use File | Settings | File Templates.
 */


var Player = (function(){

    function Player(){

        this.view = new createjs.Container();
        
    }



    return Player;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:30
 * To change this template use File | Settings | File Templates.
 */

/* globals UserModel:true */
/* globals ScreenManager:true */
/* globals appModel:true */

var Progress = (function(){

    var self;

    function Progress(xPos, yPos){

        self = this;

        bean.on(appModel.userModel, UserModel.PROGRESS_CHANGED, userProgressChangedHandler);

        this.view = new createjs.Container();
        this.view.regX = this.view.regY = -65/2;
        this.view.x = xPos;
        this.view.y = yPos;
        this.circle = new createjs.Shape();
        this.circle.mouseEnabled = true;
        this.circle.graphics.beginFill("#FFEA00").drawCircle(0, 0, 52);
        this.view.addChild(this.circle);
        this.circle.scaleX = this.circle.scaleY = 0;
        createjs.Tween.get(this.circle).to({scaleX:1, scaleY: 1}, 1700, createjs.Ease.elasticOut);

        this.borderCircle = new createjs.Shape();
        this.borderCircle.mouseEnabled = true;
        this.borderCircle.graphics.setStrokeStyle(0.3);
        this.borderCircle.graphics.beginStroke(createjs.Graphics.getRGB(180,180,180));
        this.borderCircle.graphics.drawCircle(0, 0, 70);
        this.view.addChild(this.borderCircle);
        this.borderCircle.scaleX = this.borderCircle.scaleY = 0;
        createjs.Tween.get(this.borderCircle).to({scaleX:1, scaleY: 1}, 1700, createjs.Ease.elasticOut).call(function(){
            self.plane = new createjs.Bitmap("assets/plane.png");
            self.plane.regX = 18/2;
            self.plane.regY = 158/2;
            self.view.addChild(self.plane);
        });

        this.logo = new createjs.Bitmap("assets/klara_logo.png");
        this.logo.regX = 58/2;
        this.logo.regY = 58/2;
        this.logo.alpha = 0;
        this.view.addChild(this.logo);
        createjs.Tween.get(this.logo).to({alpha:1}, 1000);

        this.progressTxt = new createjs.Text("","12px Arial", "#222222");
        this.progressTxt.y = 0;
        this.progressTxt.x = 88;
        this.view.addChild(this.progressTxt);

        this.isOpen = false;
        this.view.mouseEnabled = true;
        this.view.addEventListener("click", $.proxy( clickHandler, this ));

        this.progressTimer = setInterval(function(){
            appModel.userModel.setProgress(appModel.userModel.progress += 1);
        },1000);

        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function clickHandler(){
        if(!this.isOpen){
            createjs.Tween.get(this.circle).to({scaleX:35, scaleY: 35}, 500);
            ScreenManager.showScreen(ScreenManager.CAMPAIGN_INFO);
        }else{
            createjs.Tween.get(this.circle).to({scaleX:1, scaleY: 1}, 500, createjs.Ease.easeOut);
            ScreenManager.removeCurrentScreen();
        }
        this.isOpen = !this.isOpen;
    }

    function userProgressChangedHandler(){
        self.progressTxt.text = appModel.userModel.progress + "/20000KM";
    }

    function tick(){
        if(this.plane != null){
            this.plane.rotation -= 0.5;
        }
    }

    return Progress;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:30
 * To change this template use File | Settings | File Templates.
 */

/* globals Util:true */
/* globals DotInfo:true */
/* globals appModel:true */

var Timeline = (function(){

    function Timeline(){

        this.view = new createjs.Container();
        this.circle = new createjs.Shape();
        this.circle.mouseEnabled = true;
        this.circle.graphics.beginFill("#000").drawCircle(0, 0, 1.5);
        this.view.x = stage.canvas.width / 2;
        this.view.y = stage.canvas.height / 2;
        this.view.addChild(this.circle);
    }

    return Timeline;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 16/01/14
 * Time: 19:31
 * To change this template use File | Settings | File Templates.
 */

var AudioManager = function(){};

AudioManager.PLAYER_STATUS_CHANGED = "PLAYER_STATUS_CHANGED";
AudioManager.player = document.getElementById("#player")[0];
AudioManager.isPlaying = true;


AudioManager.togglePlay = function(){

};

AudioManager.stop = function(){

};

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 16/01/14
 * Time: 19:31
 * To change this template use File | Settings | File Templates.
 */

/* globals CampaignScreen:true */

var ScreenManager = function(){};

ScreenManager.CAMPAIGN_INFO = "CAMPAIGN_INFO";
ScreenManager.currentScreen = null;

ScreenManager.showScreen = function(screenType){

    ScreenManager.removeCurrentScreen();
    if(screenType === ScreenManager.CAMPAIGN_INFO){
        console.log("[ScreenManager] ");
        ScreenManager.currentScreen = new CampaignScreen();
    }
    stage.addChild(ScreenManager.currentScreen.view);
};

ScreenManager.removeCurrentScreen = function(){
    if(ScreenManager.currentScreen != null){
        stage.removeChild(ScreenManager.currentScreen.view);
        ScreenManager.currentScreen = null;
    }
};


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

var UserModel = (function(){

    function UserModel(){

        UserModel.COOKIE_NAME = "KLARA_REIS";
        UserModel.PROGRESS_CHANGED = "PROGRESS_CHANGED";

        this.progress = 0;

        var cookie = JSON.parse(readCookie(UserModel.COOKIE_NAME));
        this.setProgress(cookie.progress);
    }

    UserModel.prototype.save = function(){
        createCookie(UserModel.COOKIE_NAME,JSON.stringify(this),365);
    };

    function createCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)===' '){
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) === 0){
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,"",-1);
    }

    UserModel.prototype.setProgress = function(progress){
        this.progress = progress;
        bean.fire(this,UserModel.PROGRESS_CHANGED);
        this.save();
    };

    return UserModel;
})();

/* globals FB:true  */

window.fbAsyncInit = function() {
    FB.init({
        appId      : '602111939860965',
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });
};

// Load the SDK asynchronously
(function(d)
{
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

// Here we run a very simple test of the Graph API after login is successful.
// This testAPI() function is only called in those cases.
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
    console.log('Good to see you, ' + response.name + '.');
    });
}

function postOnFacebook(afstand){
    FB.ui(
        {
            method: 'stream.publish',
            display:'popup',
            message: '',
            name: 'Klara',
            caption: 'Ik ontdek muziek met Klara',
            description: (
                'I got '+ afstand
                ),
            link: 'http://klara.be',
            picture: 'http://images.uncyc.org/nl/a/a6/Logo_Klara.jpg'
        },
        function(response) {
            if (response && response.post_id) {
                console.log('Post was published');
            } else {
                console.log('Post NOT published');
            }
        }
    );
}

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
/* globals SoundManager:true */
/* globals Progress:true */

var REFRESH_RATE = 10000;

var appModel, stage;

var App = (function(){

    function App($sourceElement){
        _.bindAll(this); // this altijd slaat op deze klasse

        var canvas = document.getElementById('cnvs');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        stage = new createjs.Stage(document.getElementById("cnvs"));
        stage.enableMouseOver();
        createjs.Ticker.addEventListener("tick",tick);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.useRAF = true;

        appModel = new AppModel();
        appModel.getPlaylist();

        this.map = new MyMap();
        stage.addChild(this.map.view);

        this.progress = new Progress(70, 70);
        stage.addChild(this.progress.view);
    }

    function tick(){
        stage.update();
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