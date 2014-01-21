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
        this.circle.graphics.beginFill("#000000").drawCircle(0, 0, 1.5);
        this.view.x = stage.canvas.width / 2;
        this.view.y = stage.canvas.height / 2;
        this.view.addChild(this.circle);
        this.view.mouseEnabled = true;

        this.circle.addEventListener("click",$.proxy( function(){
            appModel.setCurrentSongIndex(this.songIndex);
        }, this ));
    }

    Dot.prototype.randomPosition = function(){
        var marge = 0;
        /*var toX = marge + (Math.random() * (stage.canvas.width - (marge * 2)));
        var toY = marge + (Math.random() * (stage.canvas.height - (marge * 2)));*/
        this.view.alpha = 0;
        //console.log((this.songIndex / appModel.userModel.songs.length) * (stage.canvas.width / 2));
        var toX = stage.canvas.width / 2 - (((appModel.userModel.songs.length - (this.songIndex + 1))) * 150);
        var toY = stage.canvas.height / 2;
        var speed = 3000 + Math.random() * 3000;
        this.circle.scaleX = this.circle.scaleY = 1;
        createjs.Tween.get(this.view).to({x:toX, y:toY, alpha:1}, speed, createjs.Ease.elasticOut);
    };

    Dot.prototype.centerPosition = function(){
        var toX = stage.canvas.width / 2;
        var toY = stage.canvas.height / 2;
        var speed = 3000 + Math.random() * 3000;
        this.view.alpha = 0;
        createjs.Tween.get(this.view).to({x:toX, y:toY, alpha:1}, speed, createjs.Ease.elasticOut);

        this.circle.scaleX = this.circle.scaleY = 2.5;
    };

    Dot.prototype.showInfoView = function(){
        if(this.dotInfo == null){
            this.dotInfo = new DotInfo(appModel.userModel.songs[this.songIndex]);
            this.view.addChild(this.dotInfo.view);
            //console.log("[Dot] show dot info");
        }
    };

    Dot.prototype.hideInfoView = function(){
        if(this.dotInfo != null){
            this.view.removeChild(this.dotInfo.view);
            this.dotInfo = null;
            //console.log("[Dot] hide dot info");
        }
    };

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

        //console.log(this.titleTxt.getBounds().width);

        //$(this.view).on('tick', $.proxy( tick, this ));
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
 * Date: 20/01/14
 * Time: 22:27
 * To change this template use File | Settings | File Templates.
 */

var MapLabel = (function(){

    function MapLabel(x, y, txt){

        this.view = new createjs.Container();

        var lblTxt = new createjs.Text(txt,"12px Arial","#000000");

        var bg = new createjs.Shape();

        this.view.addChild(bg);
        this.view.addChild(lblTxt);

        this.view.x = x;
        this.view.y = y;

        //bg.graphics.beginFill("#000000").drawRect(0,0, lblTxt.getBounds().width, lblTxt.getBounds().height);
        //console.log(lblTxt);
    }

    return MapLabel;

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
/* globals MapLabel:true */

var MyMap = (function(){

    var self;

    function MyMap(){
        self = this;

        this.dots = [];
        this.view = new createjs.Container();

        this.mapWidth = 12000;
        this.mapHeight = 12000;

        this.bg = new createjs.Shape();
        this.bg.graphics.beginFill("#ffffff").drawRect(0,0, this.mapWidth, this.mapHeight);
        this.view.addChild(this.bg);

        this.mapBg = new createjs.Bitmap("assets/geography-class6.png");
        this.view.addChild(this.mapBg);

        this.lines = new createjs.Graphics();
        var linesShape = new createjs.Shape(this.lines);
        this.view.addChild(linesShape);

        this.plane = new createjs.Bitmap("assets/plane.png");
        this.plane.regX = this.plane.regY = 18/2;
        this.view.addChild(this.plane);

        bean.on(appModel, AppModel.NOW_AND_NEXT_LOADED, function(e){
            console.log("[MyMap] loading done");

            self.draw();

            centerMapAndShowInfoForDotWithIndex(appModel.currentSongIndex);

            var startX = self.dots[appModel.currentSongIndex].view.x;
            var startY = self.dots[appModel.currentSongIndex].view.y;

            self.plane.x = startX;
            self.plane.y = startY;

            if(self.dots.length >= appModel.currentSongIndex + 2) // is there a next desination?
            {
                var toX = self.dots[appModel.currentSongIndex + 1].view.x;
                var toY = self.dots[appModel.currentSongIndex + 1].view.y;

                console.log(calculateAngleFrom(startX, startY, toX, toY));
                self.plane.rotation = - calculateAngleFrom(startX, startY, toX, toY) + 42;

                createjs.Tween.get(self.plane).to({
                    x: toX,
                    y: toY
                },appModel.userModel.songs[appModel.currentSongIndex].duration * 1000);
            }
    });
        bean.on(appModel, AppModel.CURRENT_SONG_CHANGED, function(){
            centerMapAndShowInfoForDotWithIndex(appModel.currentSongIndex);
        });

        this.view.addEventListener("mousedown", function(evt) {
            var o = self.view;
            self.view.offset = {x:o.x-evt.stageX, y:o.y-evt.stageY};
        });

        this.view.on("pressmove",function(evt) {
            var o = self.view;
            o.x = evt.stageX+ o.offset.x;
            o.y = evt.stageY+ o.offset.y;

            stage.update();
        });

        $(this.view).on('tick', $.proxy( tick, this ));
    }



    MyMap.prototype.draw = function(){

        var length = this.dots.length;
        if(length < 0){
            length = 0;
        }

        for(var i = length; i < appModel.userModel.songs.length; i++){
            var dot = new Dot(i);
            this.view.addChild(dot.view);
            this.dots.push(dot);
            var pos = convertGeoToPixel(appModel.userModel.songs[i].lat, appModel.userModel.songs[i].lng);
            dot.view.x = pos.x;
            dot.view.y = pos.y;
        }
    };

    function addCapitalMarkersOnMap(){
        $.getJSON("assets/countries.json", function(data){
            for(var i=0; i<data.length; i++){
                var pos = convertGeoToPixel(data[i].latlng[0], data[i].latlng[1]);
                var label = new MapLabel(pos.x, pos.y, data[i].capital);
                self.view.addChild(label.view);
            }
        });
    }

    function centerMapAndShowInfoForDotWithIndex(index){
        if(self.dots.length > 0){

            if(index < 0){
                // center on belgium
                console.log("[MyMap] zoom out on map");
                var pos = convertGeoToPixel(50.5333, 4.7667);
                console.log(pos);
                var toXpos = -pos.x + (stage.canvas.width/2);
                var toYpos = -pos.y + (stage.canvas.height/2);
                createjs.Tween.get(self.view).to({x: toXpos, y: toYpos}, 2000, createjs.Ease.cubicInOut);
            }
            else{
                // center map
                for(var i=0; i<self.dots.length; i++){
                    self.dots[i].hideInfoView();
                }
                self.dots[index].showInfoView();
                var toX = -self.dots[index].view.x + (stage.canvas.width/2);
                var toY = -self.dots[index].view.y + (stage.canvas.height/2);
                createjs.Tween.get(self.view).to({x: toX, y: toY}, 2000, createjs.Ease.cubicInOut);
            }
        }
    }

    function tick(e){
        this.lines.clear();
        this.lines.setStrokeStyle(0.3);
        this.lines.beginStroke(createjs.Graphics.getRGB(180,180,180));
        for(var i = 0; i < this.dots.length - 1; i++){
            this.lines.moveTo(this.dots[i].view.x, this.dots[i].view.y);
            this.lines.lineTo(this.dots[i+1].view.x, this.dots[i+1].view.y);
        }
    }

    function convertGeoToPixel(lat, lon){
        var xPos = (lon+180) * (self.mapWidth/360);
        var latRad = lat * Math.PI/180;
        var mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
        var yPos   = (self.mapHeight / 2) - (self.mapWidth * mercN / (2 * Math.PI));
        return {x: xPos, y: yPos};
    }

    function calculateAngleFrom (xPos1, yPos1, xPos2, yPos2){
        var deltaX = yPos2 - yPos1;
        var deltaY = xPos2 - xPos1;
        var angleInDegress = Math.atan2(deltaX, deltaY) * 180 / Math.PI;
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

/* globals AudioManager:true */
/* globals appModel:true */

var Player = (function(){

    var self;

    function Player(){

        self = this;

        this.view = new createjs.Container();
        this.player = document.getElementById("player");

        var mute_data = {
            images: ["assets/buttons/play_pause.png"],
            frames: {width:28.5, height:37},
            animations: {on:[0], mute:[1]}
        };
        var muteBtnspritesheet = new createjs.SpriteSheet(mute_data);
        this.muteBtnSprite = new createjs.Sprite(muteBtnspritesheet);
        this.view.addChild(this.muteBtnSprite);
        this.muteBtnSprite.addEventListener("click", function(e){
            if (self.player.paused) {
                self.player.play();
                self.muteBtnSprite.gotoAndStop("on");
            }
            else {
                self.player.pause();
                self.muteBtnSprite.gotoAndStop("mute");
            }
            appModel.setIsPlaying(!self.player.paused);
        });
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
/* globals AppModel:true */
/* globals appModel:true */

var Progress = (function(){

    var self;

    function Progress(xPos, yPos){

        self = this;

        bean.on(appModel.userModel, UserModel.PROGRESS_CHANGED, userProgressChangedHandler);
        bean.on(appModel, AppModel.PLAYER_STATUS_CHANGED, playerStatusChangedHandler);

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

    function playerStatusChangedHandler(){
        if(!appModel.isPlaying){
            clearTimeout(self.progressTimer);
            self.progressTimer = null;
        }else{
            self.progressTimer = setInterval(function(){
                appModel.userModel.setProgress(appModel.userModel.progress += 1);
            },1000);
        }
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
 * Date: 21/01/14
 * Time: 21:51
 * To change this template use File | Settings | File Templates.
 */

/* globals appModel:true */
/* globals AppModel:true */

var TravelInfo = (function(){

    function TravelInfo(){

        this.view = new createjs.Container();

        this.

        bean.on(appModel, AppModel.NOW_AND_NEXT_LOADED, function(e){
            if(appModel.nextSong != null){

                console.log("[TravelInfo] update info",appModel.nextSong.location);
            }
        });
    }

    return TravelInfo;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 16/01/14
 * Time: 19:31
 * To change this template use File | Settings | File Templates.
 */

var AudioManager = function(){};

AudioManager.player = document.getElementById("player");
AudioManager.isPlaying = true;


AudioManager.togglePlay = function(){
    if (AudioManager.player.paused) {
        AudioManager.player.play();
    }
    else {
        AudioManager.player.stop();
    }
};

AudioManager.stop = function(){
    AudioManager.player.stop();
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

var SongModel = (function(){

    function SongModel(){

        this.title = "";
        this.artist = "";
        this.lng = 0;
        this.lat = 0;
        this.location = "";
        this.duration = 0;
        this.period = 2014;
    }


    return SongModel;
})();

var UserModel = (function(){

    function UserModel(){

        UserModel.COOKIE_NAME = "KLARA_REIS";
        UserModel.PROGRESS_CHANGED = "PROGRESS_CHANGED";

        this.progress = 0;
        this.songs = [];

        /*eraseCookie(UserModel.COOKIE_NAME);
        var cookie = JSON.parse(readCookie(UserModel.COOKIE_NAME));
        if(cookie != null){
            this.setProgress(cookie.progress);
        }*/
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
/* globals Player:true */
/* globals TravelInfo:true */

var REFRESH_RATE = 20000;

var appModel, stage;

var App = (function(){

    function App($sourceElement){
        _.bindAll(this); // this altijd slaat op deze klasse

        var canvas = document.getElementById('cnvs');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        stage = new createjs.Stage(document.getElementById("cnvs"));
        stage.enableMouseOver();
        stage.mouseMoveOutside = true;
        createjs.Ticker.addEventListener("tick",tick);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.useRAF = true;

        appModel = new AppModel();
        appModel.fetchNowAndNext();
        setInterval(appModel.fetchNowAndNext,REFRESH_RATE);

        this.map = new MyMap();
        stage.addChild(this.map.view);

        this.progress = new Progress(70, 70);
        stage.addChild(this.progress.view);

        this.travelInfo = new TravelInfo();
        stage.addChild(this.travelInfo.view);

        this.player = new Player();
        stage.addChild(this.player.view);
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