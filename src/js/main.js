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

        this.btn = new createjs.Bitmap(preload.getResult(url));
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
/* globals Slideshow:true  */

var CampaignScreen = (function(){

    var self;

    function CampaignScreen(){
        self = this;
        this.view = new createjs.Container();
        /*var text = new createjs.Text("CAMPAIGN SCREEN","22px Arial", "#000000");
        text.x = stage.canvas.width/2 - 120;
        text.y = stage.canvas.height/2 - 15;
        this.view.addChild(text);*/

        this.slideshow = new Slideshow();
        this.view.addChild(this.slideshow.view);
        stage.addEventListener("NEXT_SLIDE", this.slideshow.nextSlideHandler);
    }

    CampaignScreen.prototype.willBeRemoved = function(){
        stage.removeEventListener("NEXT_SLIDE", self.slideshow.nextSlideHandler);
        self.view.removeChild(self.slideshow);
        self.slideshow = null;
    };

    return CampaignScreen;

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

var CurrentProgramma = (function(){

    var self;

    function CurrentProgramma(){

        self = this;

        this.view = new createjs.Container();

        this.background = new createjs.Shape();
        this.background.graphics.beginFill("#ffd600");
        this.background.graphics.drawRect(0,0,0, 20);
        this.background.graphics.endFill();
        this.view.addChild(this.background);

        this.programmaTitleTxt = new createjs.Text("","10px orator_stdregular", "#000000");
        this.programmaTitleTxt.textAlign = "right";
        this.view.addChild(this.programmaTitleTxt);

        this.programmaDescTxt = new createjs.Text("","12px orator_stdregular", "#000000");
        this.programmaDescTxt.y = 20;
        this.programmaDescTxt.textAlign = "right";
        this.programmaDescTxt.lineWidth = 300;
        this.programmaDescTxt.textBaseline = "top";
        this.programmaDescTxt.lineHeight = 14;
        this.view.addChild(this.programmaDescTxt);

        this.programmaPresentatorTxt = new createjs.Text("","12px orator_stdregular", "#000000");
        this.programmaPresentatorTxt.y = 0;
        this.programmaPresentatorTxt.textAlign = "right";
        //this.view.addChild(this.programmaPresentatorTxt);

        this.view.y = -50;
        //this.view.x = stage.canvas.width / 2;

        bean.on(appModel, AppModel.NOW_AND_NEXT_LOADED, function(e){
            if(appModel.nextSong == null){
                // show programma info
                self.view.alpha = 1;

            }else{
                // hide programma info
                self.view.alpha = 0;
            }
            console.log("[CurrentProgramma] now and next loaded: " + appModel.nextSong);
        });

        bean.on(appModel, AppModel.CURRENT_PROGRAMMA_CHANGED, function(e){
            console.log("[CurrentProgramma] programma changed: " + appModel.currentProgramma);
            self.programmaTitleTxt.text = appModel.currentProgramma.title.toUpperCase();

            self.background.graphics.clear();
            self.background.graphics.beginFill("#ffd600");
            self.background.graphics.drawRect(-self.programmaTitleTxt.getMeasuredWidth() - 11,-2,self.programmaTitleTxt.getMeasuredWidth() + 14, 18);
            self.background.graphics.endFill();

            var txt = appModel.currentProgramma.description;
            ///txt = txt.slice(0,50) + "\n" + txt.slice(50);
            self.programmaDescTxt.text = txt;
           // self.programmaPresentatorTxt.text = appModel.currentProgramma.presenters[0].name;

            if(appModel.userModel.songs.length - 1 === appModel.currentSongIndex){
                // no next, so show programma
                // show programma info
                self.view.alpha = 1;
            } else{
                self.view.alpha = 0;
            }

        });
    }

    return CurrentProgramma;

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
        this.view.x = stage.canvas.width / 2;
        this.view.y = stage.canvas.height / 2;

        this.bullet = new createjs.Container();
        this.view.addChild(this.bullet);

        var outerCircle = new createjs.Shape();
        outerCircle.graphics.beginFill("#000000").drawCircle(0, 0, 5);
        outerCircle.alpha = 0.01;
        this.bullet.addChild(outerCircle);

        this.circle = new createjs.Shape();
        this.circle.graphics.beginFill("#000000").drawCircle(0, 0, 1.5);
        this.bullet.addChild(this.circle);

        this.bullet.mouseEnabled = true;


        this.bullet.addEventListener("click",$.proxy( function(){
            appModel.setCurrentSongIndex(this.songIndex);
        }, this ));

        this.bullet.addEventListener("mouseover", $.proxy( function(e){
            createjs.Tween.get(this.circle).to({scaleX:2, scaleY:2},  100);
        }, this ));
        this.bullet.addEventListener("mouseout", $.proxy( function(e){
            createjs.Tween.get(this.circle).to({scaleX:1.0, scaleY:1.0},  100);
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
        this.bullet.scaleX = this.bullet.scaleY = 1;
        createjs.Tween.get(this.view).to({x:toX, y:toY, alpha:1}, speed, createjs.Ease.elasticOut);
    };

    Dot.prototype.centerPosition = function(){
        var toX = stage.canvas.width / 2;
        var toY = stage.canvas.height / 2;
        var speed = 3000 + Math.random() * 3000;
        this.view.alpha = 0;
        createjs.Tween.get(this.view).to({x:toX, y:toY, alpha:1}, speed, createjs.Ease.elasticOut);

        this.bullet.scaleX = this.bullet.scaleY = 2.5;
    };

    Dot.prototype.showInfoView = function(){
        if(this.dotInfo == null){
            this.dotInfo = new DotInfo(appModel.userModel.songs[this.songIndex]);
            this.view.addChild(this.dotInfo.view);
            this.bullet.scaleX = this.bullet.scaleY = 2.5;
        }
    };

    Dot.prototype.hideInfoView = function(){
        if(this.dotInfo != null){
            this.view.removeChild(this.dotInfo.view);
            this.dotInfo = null;
            this.bullet.scaleX = this.bullet.scaleY = 1;
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
/* globals appModel:true */

var DotInfo = (function(){

    function DotInfo(songInfo){

        this.view = new createjs.Container();

        this.shadowShape = new createjs.Shape();
        this.shadowShape.graphics.beginFill("#000000");
        this.shadowShape.graphics.lineTo(0,0);
        this.shadowShape.graphics.lineTo(60,-75);
        this.shadowShape.graphics.lineTo(70,-75);
        this.shadowShape.graphics.lineTo(70,-20);
        this.shadowShape.graphics.endFill();
        this.shadowShape.graphics.closePath();
        this.shadowShape.alpha = 0.1;
        this.view.addChild(this.shadowShape);
        //this.shadowShape.scaleY = this.shadowShape.scaleX = 0.6;

        this.backgroundShape = new createjs.Shape();
        this.backgroundShape.graphics.beginFill("#000");
        this.backgroundShape.graphics.lineTo(0,0);
        this.backgroundShape.graphics.lineTo(30,-100);
        this.backgroundShape.graphics.lineTo(150,-100);
        this.backgroundShape.graphics.lineTo(150,-40);
        this.backgroundShape.graphics.endFill();
        this.backgroundShape.graphics.closePath();
        this.view.addChild(this.backgroundShape);
        //this.backgroundShape.shadow = new createjs.Shadow("#bbbbbb", -2, -2, 40);

        this.titleTxt = new createjs.Text(songInfo.title.toUpperCase(),"18px proxima_nova_extra_condenseLt", "#f5f5f5");
        this.titleTxt.y = -94;
        this.titleTxt.mask = this.backgroundShape;
        this.view.addChild(this.titleTxt);
        this.titleTxt2 = new createjs.Text(songInfo.title.toUpperCase(),"18px proxima_nova_extra_condenseLt", "#f5f5f5");
        this.titleTxt2.y = -94;
        this.titleTxt2.mask = this.backgroundShape;
        this.view.addChild(this.titleTxt2);
        this.titleTxt.x = 55;
        this.titleTxt2.x = this.titleTxt.x + this.titleTxt.getMeasuredWidth();

        this.artistTxt = new createjs.Text(songInfo.artist.toUpperCase(),"12px orator_stdregular", "#D5C502");
        this.artistTxt.y = -70;
        this.artistTxt.x = 28;
        this.artistTxt.mask = this.backgroundShape;
        if(this.artistTxt.text.length > 15){
            this.artistTxt.text = this.artistTxt.text.substring(0, 15) + "...";
        }
        this.view.addChild(this.artistTxt);

       /* var fbButton = new Button(Button.FACEBOOK);
        this.view.addChild(fbButton.view);
        fbButton.view.x = 40;
        fbButton.view.y = 40;
        fbButton.view.addEventListener("click", function(e){
            postOnFacebook(appModel.userModel.progress);
        });

        var twButton = new Button(Button.TWITTER);
        this.view.addChild(twButton.view);
        twButton.view.x = -20;
        twButton.view.y = -25;
        twButton.view.addEventListener("click", function(e){
            var url = "http://twitter.com/home?status= Ik reisde al " + appModel.userModel.progress + "km met Klara. Reis ook mee en WIN een reis!";
            window.open(url,'_blank');
        });*/

        //console.log(this.titleTxt.getBounds().width);

        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function tick(e){
        this.titleTxt.x -= 0.6;
        this.titleTxt2.x -= 0.6;

        //console.log(this.titleTxt.x, this.titleTxt.getMeasuredWidth());


        if(this.titleTxt.x < - (this.titleTxt.getMeasuredWidth())){
            this.titleTxt.x = this.titleTxt2.x + this.titleTxt2.getMeasuredWidth() + 40;
        }
        if(this.titleTxt2.x < - (this.titleTxt2.getMeasuredWidth())){
            this.titleTxt2.x = this.titleTxt.x + this.titleTxt.getMeasuredWidth() + 40;
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
/* globals Particles:true */

var MyMap = (function(){

    var self;

    function MyMap(){
        self = this;

        this.dots = [];
        this.view = new createjs.Container();

        this.mapWidth = 12000;
        this.mapHeight = 12000;

       /* this.bg = new createjs.Shape();
        this.bg.graphics.beginFill("#ffffff").drawRect(0,0, this.mapWidth, this.mapHeight);
        this.view.addChild(this.bg);
*/
        this.mapBg = new createjs.Bitmap(preload.getResult("worldmap"));
        this.view.addChild(this.mapBg);

        this.lines = new createjs.Graphics();
        var linesShape = new createjs.Shape(this.lines);
        this.view.addChild(linesShape);

        /*this.particles = new Particles();
        this.view.addChild(this.particles.view);*/

        this.plane = new createjs.Bitmap("assets/plane.png");
        this.plane.regX = this.plane.regY = 18/2;
        this.view.addChild(this.plane);

        this.isAnimatingToCenter = false;

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
                createjs.Tween.removeTweens(self.plane);

                var toX = self.dots[appModel.currentSongIndex + 1].view.x;
                var toY = self.dots[appModel.currentSongIndex + 1].view.y;

                //console.log(calculateAngleFrom(startX, startY, toX, toY));

                self.plane.rotation = calculateAngleFrom(startX, startY, toX, toY) - 180;
                appModel.setFlightAngle(calculateAngleFrom(startX, startY, toX, toY) - 180);

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
        console.log("[MyMap] center map: "+index);
        if(!self.isAnimatingToCenter){
            self.isAnimatingToCenter = true;
            if(self.dots.length > 0){

                if(index < 0){
                    // center on belgium
                    console.log("[MyMap] zoom out on map");
                    var pos = convertGeoToPixel(50.5333, 4.7667);
                    console.log(pos);
                    var toXpos = Math.round(-pos.x + (stage.canvas.width/2));
                    var toYpos = Math.round(-pos.y + (stage.canvas.height/2));
                    createjs.Tween.get(self.view).to({x: toXpos, y: toYpos}, 2000, createjs.Ease.cubicInOut).call(function(){
                        self.isAnimatingToCenter = false;
                    });
                }
                else{
                    // center map
                    for(var i=0; i<self.dots.length; i++){
                        self.dots[i].hideInfoView();
                    }
                    self.dots[index].showInfoView();
                    var toX = Math.round(-self.dots[index].view.x + (stage.canvas.width/2));
                    var toY = Math.round(-self.dots[index].view.y + (stage.canvas.height/2));
                    createjs.Tween.get(self.view).to({x: toX, y: toY}, 2000, createjs.Ease.cubicInOut).call(function(){
                        self.isAnimatingToCenter = false;
                    });
                }
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
        var xPos = Math.round((lon+180) * (self.mapWidth/360));
        var latRad = lat * Math.PI/180;
        var mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
        var yPos   = Math.round((self.mapHeight / 2) - (self.mapWidth * mercN / (2 * Math.PI)));
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

    function Particles(){

        this.view = new createjs.Container();

        this.shape = new createjs.Shape();
        this.shape.graphics.setStrokeStyle(2);
        this.shape.graphics.beginStroke("#000000");
        this.shape.graphics.drawCircle(0,0,10);
        this.shape.graphics.endStroke();

        this.view.addChild(this.shape);
        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function tick(e){
        this.shape.scaleX = this.shape.scaleY +=0.01;
        this.shape.alpha -=0.03;
        if(this.shape.scaleX >= 3){
            this.shape.scaleX = this.shape.scaleY = 0;
            this.shape.alpha = 1;
        }
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
/* globals Button:true */
/* globals postOnFacebook:true */

var Progress = (function(){

    var self;

    function Progress(xPos, yPos){

        self = this;

        bean.on(appModel.userModel, UserModel.PROGRESS_CHANGED, userProgressChangedHandler);
        bean.on(appModel, AppModel.PLAYER_STATUS_CHANGED, playerStatusChangedHandler);
        bean.on(appModel, AppModel.FLIGHT_ANGLE_CHANGED, flightAngleChangedHandler);

        this.view = new createjs.Container();
        this.view.regX = this.view.regY = -64/2;
        this.view.x = xPos;
        this.view.y = yPos;

        var radius = stage.canvas.width + 64;
        /*var graphicBg = new createjs.Graphics().
            beginRadialGradientFill(
                ["#ec008c","#b5006c"],
                [0, 1],
                stage.canvas.width/2,
                stage.canvas.height/2,
                0,
                stage.canvas.width/2,
                stage.canvas.height/2,
                radius/3)
            .drawCircle(0, 0, radius);*/

        this.cloud = new createjs.Bitmap(preload.getResult('cloud'));
        this.cloud.regX = 486/2;
        this.cloud.regY = 249/2;
        //this.cloud.alpha = 0;
        this.view.addChild(this.cloud);
        //createjs.Tween.get(this.cloud).to({alpha:1}, 1000);

        this.shapeBg = new createjs.Shape();
        this.shapeBg.graphics.beginFill("#ec008c");
        this.shapeBg.graphics.drawCircle(0,0,radius);
        this.shapeBg.graphics.endFill();
        this.view.addChild(this.shapeBg);
        this.shapeBg.scaleX = this.shapeBg.scaleY = 0;

        this.app_title = new createjs.Bitmap(preload.getResult("app_title"));
        this.app_title.regX = -60;
        this.app_title.regY = 33;
        this.app_title.alpha = 0;
        this.view.addChild(this.app_title);
        createjs.Tween.get(this.app_title).to({alpha:1}, 1000);

        this.borderCircle = new createjs.Shape();
        this.borderCircle.mouseEnabled = true;
        this.borderCircle.graphics.setStrokeStyle(0.3);
        this.borderCircle.graphics.beginStroke(createjs.Graphics.getRGB(180,180,180));
        this.borderCircle.graphics.drawCircle(0, 0, 70);
        this.view.addChild(this.borderCircle);
        this.borderCircle.scaleX = this.borderCircle.scaleY = 0;

        this.logo_bg = new createjs.Bitmap(preload.getResult('logo_background'));
        this.logo_bg.regX = 94/2;
        this.logo_bg.regY = 94/2;
        this.logo_bg.alpha = 0;
        this.view.addChild(this.logo_bg);
        createjs.Tween.get(this.logo_bg).to({alpha:1}, 1000);

        this.compassOuter = new createjs.Bitmap(preload.getResult('compass-outer'));
        this.compassOuter.regX = 152/2;
        this.compassOuter.regY = 152/2;
        this.compassOuter.alpha = 0;
        this.view.addChild(this.compassOuter);
        createjs.Tween.get(this.compassOuter).to({alpha:1}, 1000);

        this.compassInner = new createjs.Bitmap(preload.getResult('compass-inner'));
        this.compassInner.regX = 118/2;
        this.compassInner.regY = 118/2;
        this.compassInner.alpha = 0;
        this.view.addChild(this.compassInner);
        createjs.Tween.get(this.compassInner).to({alpha:1}, 1000);

        this.indicator = new createjs.Bitmap(preload.getResult('compass-indicator'));
        this.indicator.regX = -110/2;
        this.indicator.regY = 4/2;
        this.indicator.alpha = 0;
        this.view.addChild(this.indicator);
        createjs.Tween.get(this.indicator).to({alpha:1}, 1000);

        this.logo = new createjs.Bitmap(preload.getResult('klara_logo'));
        this.logo.regX = 52/2;
        this.logo.regY = 56/2;
        this.logo.alpha = 0;
        this.view.addChild(this.logo);
        createjs.Tween.get(this.logo).to({alpha:1}, 1000);

        this.progressTxt = new createjs.Text("","12px orator_stdregular", "#222222");
        this.progressTxt.y = -7;
        this.progressTxt.x = 273;
        this.progressTxt.textAlign = "right";
        this.view.addChild(this.progressTxt);

        this.isOpen = false;
        this.view.mouseEnabled = true;
        this.view.addEventListener("click", $.proxy( clickHandler, this ));

        this.progressTimer = setInterval(function(){
            appModel.userModel.setProgress(appModel.userModel.progress += 1);
            if(appModel.userModel.progress === UserModel.LISTENING_TARGET){
                console.log("[UserModel] show form");
            }
        },1000);

        var fbButton = new Button(Button.FACEBOOK);
        this.view.addChild(fbButton.view);
        fbButton.view.x = 305;
        fbButton.view.y = -11;
        fbButton.view.addEventListener("click", function(e){
            postOnFacebook(appModel.userModel.progress);
        });

        var twButton = new Button(Button.TWITTER);
        this.view.addChild(twButton.view);
        twButton.view.x = fbButton.view.x + 30;
        twButton.view.y = -11;
        twButton.view.addEventListener("click", function(e){
            var url = "http://twitter.com/home?status= Ik reisde al " + appModel.userModel.progress + "km met Klara. Reis ook mee en WIN een reis!";
            window.open(url,'_blank');
        });

        $(this.view).on('tick', $.proxy( tick, this ));

        //doIndicatorAnimations();
        //doInnerCompassAnimations();
    }

    function flightAngleChangedHandler(){
        createjs.Tween.removeTweens(self.indicator);
        doIndicatorAnimations(appModel.flightAngle);
    }

    function doIndicatorAnimations(){
        var angle = appModel.flightAngle - 180;
        createjs.Tween.get(self.indicator).to({rotation: 15 + angle - Math.random() * 15}, 1000 + Math.random(), createjs.Tween.cubicInOut).call(doIndicatorAnimations);
    }

    function doInnerCompassAnimations(){
        createjs.Tween.get(self.compassInner).to({rotation:Math.random()*360}, 4000 + Math.random()*2000).call(doInnerCompassAnimations);
    }

    function clickHandler(){
        if(!this.isOpen){
            createjs.Tween.get(this.shapeBg).to({scaleX:1, scaleY: 1}, 500);
            ScreenManager.showScreen(ScreenManager.CAMPAIGN_INFO);
        }else{
            createjs.Tween.get(this.shapeBg).to({scaleX:0, scaleY: 0}, 500, createjs.Ease.easeOut);
            ScreenManager.removeCurrentScreen();
        }
        this.isOpen = !this.isOpen;
    }

    function userProgressChangedHandler(){
        self.progressTxt.text = appModel.userModel.progress + "/"+ UserModel.LISTENING_TARGET +"KM";
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
        //this.compassInner.rotation += 0.1;
        //this.indicator.rotation -= 0.1;
    }

    return Progress;

})();

/* globals Slideshow:true */

var SlideAthene = (function()
{

    var self;

    function SlideAthene()
    {
        self = this;

        this.view = new createjs.Container();

        this.line = new createjs.Graphics();
        var lineShape = new createjs.Shape(this.line);
        this.view.addChild(lineShape);
        this.line.clear();

        this.circleS = new createjs.Shape();
        this.circleS.graphics.beginFill("black").drawCircle(0,0,2);
        this.circleS.x = Math.floor(window.innerWidth/2-101);
        this.circleS.y = Math.floor(window.innerHeight/2+147);
        this.circleS.alpha = 0;
        this.view.addChild(this.circleS);

        this.circleE = new createjs.Shape();
        this.circleE.graphics.beginFill("black").drawCircle(0,0,2);
        this.circleE.x = Math.floor(window.innerWidth/2-100);
        this.circleE.y = Math.floor(window.innerHeight/2+146);
        this.view.addChild(this.circleE);

        this.logo = new createjs.Bitmap(preload.getResult("logo"));
        this.logo.width = 239;
        this.logo.height = 249;
        this.logo.x = window.innerWidth/2-this.logo.width/2;
        this.logo.y = window.innerHeight/2-this.logo.height/2;
        this.view.addChild(this.logo);

        this.airport = new createjs.Bitmap(preload.getResult("airport"));
        this.airport.x = Math.floor(window.innerWidth/2+156+17);
        this.airport.y = Math.floor(window.innerHeight/2-56+17);
        this.airport.scaleX = this.airport.scaleY = 0;
        this.airport.regX = this.airport.regY = 17;
        this.view.addChild(this.airport);

        this.label = new createjs.Bitmap(preload.getResult("athene_label"));
        this.label.x = Math.floor(window.innerWidth/2+174);
        this.label.y = Math.floor(window.innerHeight/2-71+29);
        this.label.regY = 29;
        this.label.rotation = 15;
        this.label.alpha = 0;
        this.view.addChild(this.label);

        this.image = new createjs.Bitmap(preload.getResult("athene_image"));
        this.image.x = Math.floor(window.innerWidth/2+50);
        this.image.y = Math.floor(window.innerHeight/2-124);
        this.image.alpha = 0;
        this.view.addChild(this.image);

        this.plane = new createjs.Bitmap(preload.getResult("plane"));
        this.plane.x = Math.floor(window.innerWidth/2-50);
        this.plane.y = Math.floor(window.innerHeight/2-84);
        this.plane.alpha = 0;
        this.view.addChild(this.plane);

        this.map = new createjs.Bitmap(preload.getResult("athene_map"));
        this.map.x = Math.floor(window.innerWidth/2-210);
        this.map.y = Math.floor(window.innerHeight/2-86);
        this.map.alpha = 0;
        this.view.addChild(this.map);

        this.twitter = new createjs.Bitmap(preload.getResult("twitter"));
        this.twitter.x = Math.floor(window.innerWidth/2-93+11);
        this.twitter.y = Math.floor(window.innerHeight/2+141+11);
        this.twitter.scaleX = this.twitter.scaleY = 0.5;
        this.twitter.regX = this.twitter.regY = 11;
        this.twitter.alpha = 0;
        this.view.addChild(this.twitter);

        this.facebook = new createjs.Bitmap(preload.getResult("facebook"));
        this.facebook.x = Math.floor(window.innerWidth/2-111+11);
        this.facebook.y = Math.floor(window.innerHeight/2+118+11);
        this.facebook.scaleX = this.facebook.scaleY = 0.5;
        this.facebook.regX = this.facebook.regY = 11;
        this.facebook.alpha = 0;
        this.view.addChild(this.facebook);

        this.tip = new createjs.Bitmap(preload.getResult("tip"));
        this.tip.width = 279;
        this.tip.height = 54;
        this.tip.x = Math.floor(window.innerWidth/2+150);
        this.tip.y = Math.floor(window.innerHeight/2-this.tip.height/2+5);
        this.tip.alpha = 0;
        this.view.addChild(this.tip);
    }

    SlideAthene.prototype.animateIn = function()
    {
        $(this.view).on("tick", $.proxy(tick, this));

        createjs.Tween.get(this.facebook).wait(800).to({scaleX:1, scaleY:1, alpha:1}, 600, createjs.Ease.elasticOut);
        createjs.Tween.get(this.twitter).wait(1000).to({scaleX:1, scaleY:1, alpha:1}, 600, createjs.Ease.elasticOut);

        createjs.Tween.get(this.map).to({alpha:1}, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.tip).to({x:Math.floor(window.innerWidth/2-this.tip.width/2), alpha:1}, 3000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.image).to({x:Math.floor(window.innerWidth/2-119), alpha:1}, 3000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.plane).to({x: Math.floor(window.innerWidth/2+155), alpha:1}, 3000, createjs.Ease.cubicOut).call(function(){self.animateOut();});

        createjs.Tween.get(this.circleE).to({x: Math.floor(window.innerWidth/2+174), y: Math.floor(window.innerHeight/2-39)}, 1000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.airport).wait(1000).to({scaleX:1, scaleY:1}, 1000, createjs.Ease.elasticOut);
        createjs.Tween.get(this.label).wait(1500).to({rotation:0, alpha:1}, 1000, createjs.Ease.elasticOut);
    };

    SlideAthene.prototype.animateOut = function()
    {
        createjs.Tween.get(this.facebook).wait(800).to({scaleX:0.5, scaleY:0.5, alpha:0}, 200, createjs.Ease.cubicIn);
        createjs.Tween.get(this.twitter).wait(1000).to({scaleX:0.5, scaleY:0.5, alpha:0}, 300, createjs.Ease.cubicIn);

        createjs.Tween.get(this.map).wait(1000).to({alpha:0}, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.tip).to({x: Math.floor(window.innerWidth/2-this.tip.width/2-150), alpha:0}, 2000, createjs.Ease.cubicIn);
        createjs.Tween.get(this.image).to({x: Math.floor(window.innerWidth/2-200), alpha:0}, 2000, createjs.Ease.cubicIn);
        createjs.Tween.get(this.plane).to({x: Math.floor(window.innerWidth/2+350), alpha:0}, 2000, createjs.Ease.cubicIn).call(function(){
            self.view.removeAllChildren();
            bean.fire(self, Slideshow.NEXT_SLIDE);
            //stage.dispatchEvent("NEXT_SLIDE");
        });

        createjs.Tween.get(this.circleE).wait(1050).to({x: Math.floor(window.innerWidth/2-101), y: Math.floor(window.innerHeight/2+147), alpha: 0}, 500, createjs.Ease.cubicIn);
        createjs.Tween.get(this.airport).wait(450).to({scaleX:0, scaleY:0}, 600, createjs.Ease.elasticIn);
        createjs.Tween.get(this.label).wait(200).to({rotation:20, alpha:0}, 250, createjs.Ease.cubicIn);
    };

    function tick()
    {
        if(this.line){
            this.line.clear();
        }
        this.line.setStrokeStyle(0.8);
        this.line.beginStroke("black");
        this.line.moveTo(window.innerWidth/2-101, window.innerHeight/2+147);
        this.line.lineTo(this.circleE.x, this.circleE.y);
        if(this.circleE.x === this.circleS.x){
            this.line.clear();
        }
    }

    return SlideAthene;

})();

/* globals Slideshow:true */

var SlideNewyork = (function()
{

    var self;

    function SlideNewyork()
    {
        self = this;

        this.view = new createjs.Container();

        this.line = new createjs.Graphics();
        var lineShape = new createjs.Shape(this.line);
        this.view.addChild(lineShape);

        this.circleS = new createjs.Shape();
        this.circleS.graphics.beginFill("black").drawCircle(0,0,2);
        this.circleS.x = Math.floor(window.innerWidth/2+185);
        this.circleS.y = Math.floor(window.innerHeight/2+79);
        this.circleS.alpha = 0;
        this.view.addChild(this.circleS);

        this.circleE = new createjs.Shape();
        this.circleE.graphics.beginFill("black").drawCircle(0,0,2);
        this.circleE.x = Math.floor(window.innerWidth/2+184);
        this.circleE.y = Math.floor(window.innerHeight/2+78);
        this.view.addChild(this.circleE);

        this.logo = new createjs.Bitmap(preload.getResult("logo"));
        this.logo.width = 239;
        this.logo.height = 249;
        this.logo.x = window.innerWidth/2-this.logo.width/2;
        this.logo.y = window.innerHeight/2-this.logo.height/2;
        this.view.addChild(this.logo);

        this.airport = new createjs.Bitmap(preload.getResult("airport"));
        this.airport.x = Math.floor(window.innerWidth/2-90+17);
        this.airport.y = Math.floor(window.innerHeight/2-178+17);
        this.airport.scaleX = this.airport.scaleY = 0;
        this.airport.regX = this.airport.regY = 17;
        this.view.addChild(this.airport);

        this.label = new createjs.Bitmap(preload.getResult("newyork_label"));
        this.label.x = Math.floor(window.innerWidth/2-72);
        this.label.y = Math.floor(window.innerHeight/2-189+26);
        this.label.regY = 26;
        this.label.rotation = 15;
        this.label.alpha = 0;
        this.view.addChild(this.label);

        this.plane = new createjs.Bitmap(preload.getResult("plane"));
        this.plane.x = Math.floor(window.innerWidth/2-300);
        this.plane.y = Math.floor(window.innerHeight/2-202);
        this.plane.alpha = 0;
        this.view.addChild(this.plane);

        this.image = new createjs.Bitmap(preload.getResult("newyork_image"));
        this.image.width = 239;
        this.image.height = 249;
        this.image.x = Math.floor(window.innerWidth/2+50);
        this.image.y = Math.floor(window.innerHeight/2-this.image.height/2);
        this.image.alpha = 0;
        this.view.addChild(this.image);

        this.map = new createjs.Bitmap(preload.getResult("newyork_map"));
        this.map.x = Math.floor(window.innerWidth/2-140);
        this.map.y = Math.floor(window.innerHeight/2-167);
        this.map.alpha = 0;
        this.view.addChild(this.map);

        this.twitter = new createjs.Bitmap(preload.getResult("twitter"));
        this.twitter.x = Math.floor(window.innerWidth/2+154+11);
        this.twitter.y = Math.floor(window.innerHeight/2+71+11);
        this.twitter.scaleX = this.twitter.scaleY = 0.5;
        this.twitter.regX = this.twitter.regY = 11;
        this.twitter.alpha = 0;
        this.view.addChild(this.twitter);

        this.facebook = new createjs.Bitmap(preload.getResult("facebook"));
        this.facebook.x = Math.floor(window.innerWidth/2+174+11);
        this.facebook.y = Math.floor(window.innerHeight/2+48+11);
        this.facebook.scaleX = this.facebook.scaleY = 0.5;
        this.facebook.regX = this.facebook.regY = 11;
        this.facebook.alpha = 0;
        this.view.addChild(this.facebook);

        this.tip = new createjs.Bitmap(preload.getResult("tip"));
        this.tip.width = 279;
        this.tip.height = 54;
        this.tip.x = Math.floor(window.innerWidth/2+150);
        this.tip.y = Math.floor(window.innerHeight/2-this.tip.height/2+5);
        this.tip.alpha = 0;
        this.view.addChild(this.tip);
    }

    SlideNewyork.prototype.animateIn = function()
    {
        $(this.view).on("tick", $.proxy(tick, this));

        createjs.Tween.get(this.facebook).wait(800).to({scaleX:1, scaleY:1, alpha:1}, 600, createjs.Ease.elasticOut);
        createjs.Tween.get(this.twitter).wait(1000).to({scaleX:1, scaleY:1, alpha:1}, 600, createjs.Ease.elasticOut);

        createjs.Tween.get(this.map).to({alpha:1}, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.tip).to({x:Math.floor(window.innerWidth/2-this.tip.width/2), alpha:1}, 3000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.image).to({x:Math.floor(window.innerWidth/2-this.image.width/2), alpha:1}, 3000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.plane).to({x: Math.floor(window.innerWidth/2-92), alpha:1}, 3000, createjs.Ease.cubicOut).call(function(){self.animateOut();});

        createjs.Tween.get(this.circleE).to({x: Math.floor(window.innerWidth/2-72), y: Math.floor(window.innerHeight/2-160)}, 1000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.airport).wait(1000).to({scaleX:1, scaleY:1}, 1000, createjs.Ease.elasticOut);
        createjs.Tween.get(this.label).wait(1500).to({rotation:0, alpha:1}, 1000, createjs.Ease.elasticOut);
    };

    SlideNewyork.prototype.animateOut = function()
    {
        createjs.Tween.get(this.facebook).wait(800).to({scaleX:0.5, scaleY:0.5, alpha:0}, 200, createjs.Ease.cubicIn);
        createjs.Tween.get(this.twitter).wait(1000).to({scaleX:0.5, scaleY:0.5, alpha:0}, 300, createjs.Ease.cubicIn);

        createjs.Tween.get(this.map).wait(1000).to({alpha:0}, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.tip).to({x: Math.floor(window.innerWidth/2-this.tip.width/2-150), alpha:0}, 2000, createjs.Ease.cubicIn);
        createjs.Tween.get(this.image).to({x: Math.floor(window.innerWidth/2-this.image.width/2-100), alpha:0}, 2000, createjs.Ease.cubicIn);
        createjs.Tween.get(this.plane).to({x:Math.floor(window.innerWidth/2+100), alpha:0}, 2000, createjs.Ease.cubicIn).call(function(){
            self.view.removeAllChildren();
            bean.fire(self, Slideshow.NEXT_SLIDE);
            //stage.dispatchEvent("NEXT_SLIDE");
        });

        createjs.Tween.get(this.circleE).wait(1050).to({x: Math.floor(window.innerWidth/2+185), y: Math.floor(window.innerHeight/2+79), alpha: 0}, 500, createjs.Ease.cubicIn);
        createjs.Tween.get(this.airport).wait(450).to({scaleX:0, scaleY:0}, 600, createjs.Ease.elasticIn);
        createjs.Tween.get(this.label).wait(200).to({rotation:20, alpha:0}, 250, createjs.Ease.cubicIn);
    };

    function tick()
    {
        if(this.line) {
            this.line.clear();
        }
        this.line.setStrokeStyle(0.8);
        this.line.beginStroke("black");
        this.line.moveTo(window.innerWidth/2+185, window.innerHeight/2+79);
        this.line.lineTo(this.circleE.x, this.circleE.y);
        if(this.circleE.x === this.circleS.x) {
            this.line.clear();
        }
    }

    return SlideNewyork;

})();

/* globals Slideshow:true */

var SlideWenen = (function()
{

    var self;

    function SlideWenen()
    {
        self = this;

        this.view = new createjs.Container();

        this.line = new createjs.Graphics();
        var lineShape = new createjs.Shape(this.line);
        this.view.addChild(lineShape);
        this.line.clear();

        this.circleS = new createjs.Shape();
        this.circleS.graphics.beginFill("black").drawCircle(0,0,2);
        this.circleS.x = Math.floor(window.innerWidth/2+191);
        this.circleS.y = Math.floor(window.innerHeight/2+120);
        this.circleS.alpha = 0;
        this.view.addChild(this.circleS);

        this.circleE = new createjs.Shape();
        this.circleE.graphics.beginFill("black").drawCircle(0,0,2);
        this.circleE.x = Math.floor(window.innerWidth/2+190);
        this.circleE.y = Math.floor(window.innerHeight/2+119);
        this.view.addChild(this.circleE);

        this.logo = new createjs.Bitmap(preload.getResult("logo"));
        this.logo.width = 239;
        this.logo.height = 249;
        this.logo.x = window.innerWidth/2-this.logo.width/2;
        this.logo.y = window.innerHeight/2-this.logo.height/2;
        this.view.addChild(this.logo);

        this.airport = new createjs.Bitmap(preload.getResult("airport"));
        this.airport.x = Math.floor(window.innerWidth/2-209+17);
        this.airport.y = Math.floor(window.innerHeight/2-62+17);
        this.airport.scaleX = this.airport.scaleY = 0;
        this.airport.regX = this.airport.regY = 17;
        this.view.addChild(this.airport);

        this.label = new createjs.Bitmap(preload.getResult("wenen_label"));
        this.label.x = Math.floor(window.innerWidth/2-191);
        this.label.y = Math.floor(window.innerHeight/2-80+32);
        this.label.regY = 32;
        this.label.rotation = 15;
        this.label.alpha = 0;
        this.view.addChild(this.label);

        this.plane = new createjs.Bitmap(preload.getResult("plane"));
        this.plane.x = Math.floor(window.innerWidth/2-400);
        this.plane.y = Math.floor(window.innerHeight/2-94);
        this.plane.alpha = 0;
        this.view.addChild(this.plane);

        this.image = new createjs.Bitmap(preload.getResult("wenen_image"));
        this.image.x = Math.floor(window.innerWidth/2+50);
        this.image.y = Math.floor(window.innerHeight/2-3);
        this.image.alpha = 0;
        this.view.addChild(this.image);

        this.map = new createjs.Bitmap(preload.getResult("wenen_map"));
        this.map.x = Math.floor(window.innerWidth/2-240);
        this.map.y = Math.floor(window.innerHeight/2-117);
        this.map.alpha = 0;
        this.view.addChild(this.map);

        this.twitter = new createjs.Bitmap(preload.getResult("twitter"));
        this.twitter.x = Math.floor(window.innerWidth/2+161+11);
        this.twitter.y = Math.floor(window.innerHeight/2+118+11);
        this.twitter.scaleX = this.twitter.scaleY = 0.5;
        this.twitter.regX = this.twitter.regY = 11;
        this.twitter.alpha = 0;
        this.view.addChild(this.twitter);

        this.facebook = new createjs.Bitmap(preload.getResult("facebook"));
        this.facebook.x = Math.floor(window.innerWidth/2+174+11);
        this.facebook.y = Math.floor(window.innerHeight/2+91+11);
        this.facebook.scaleX = this.facebook.scaleY = 0.5;
        this.facebook.regX = this.facebook.regY = 11;
        this.facebook.alpha = 0;
        this.view.addChild(this.facebook);

        this.tip = new createjs.Bitmap(preload.getResult("tip"));
        this.tip.width = 279;
        this.tip.height = 54;
        this.tip.x = Math.floor(window.innerWidth/2+150);
        this.tip.y = Math.floor(window.innerHeight/2-this.tip.height/2+5);
        this.tip.alpha = 0;
        this.view.addChild(this.tip);
    }

    SlideWenen.prototype.animateIn = function()
    {
        $(this.view).on("tick", $.proxy(tick, this));

        createjs.Tween.get(this.facebook).wait(800).to({scaleX:1, scaleY:1, alpha:1}, 600, createjs.Ease.elasticOut);
        createjs.Tween.get(this.twitter).wait(1000).to({scaleX:1, scaleY:1, alpha:1}, 600, createjs.Ease.elasticOut);

        createjs.Tween.get(this.map).to({alpha:1}, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.tip).to({x:Math.floor(window.innerWidth/2-this.tip.width/2), alpha:1}, 3000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.image).to({x:Math.floor(window.innerWidth/2-9), alpha:1}, 3000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.plane).to({x: Math.floor(window.innerWidth/2-210), alpha:1}, 3000, createjs.Ease.cubicOut).call(function(){self.animateOut();});

        createjs.Tween.get(this.circleE).to({x: Math.floor(window.innerWidth/2-191), y: Math.floor(window.innerHeight/2-45)}, 1000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.airport).wait(1000).to({scaleX:1, scaleY:1}, 1000, createjs.Ease.elasticOut);
        createjs.Tween.get(this.label).wait(1500).to({rotation:0, alpha:1}, 1000, createjs.Ease.elasticOut);
    };

    SlideWenen.prototype.animateOut = function()
    {
        createjs.Tween.get(this.facebook).wait(800).to({scaleX:0.5, scaleY:0.5, alpha:0}, 200, createjs.Ease.cubicIn);
        createjs.Tween.get(this.twitter).wait(1000).to({scaleX:0.5, scaleY:0.5, alpha:0}, 300, createjs.Ease.cubicIn);

        createjs.Tween.get(this.map).wait(1000).to({alpha:0}, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.tip).to({x: Math.floor(window.innerWidth/2-this.tip.width/2-150), alpha:0}, 2000, createjs.Ease.cubicIn);
        createjs.Tween.get(this.image).to({x: Math.floor(window.innerWidth/2-100), alpha:0}, 2000, createjs.Ease.cubicIn);
        createjs.Tween.get(this.plane).to({x: Math.floor(window.innerWidth/2+50), alpha:0}, 2000, createjs.Ease.cubicIn).call(function(){
            createjs.Tween.removeTweens(self.view);
            self.view.removeAllChildren();
            //stage.dispatchEvent("NEXT_SLIDE");
            bean.fire(self, Slideshow.NEXT_SLIDE);
        });

        createjs.Tween.get(this.circleE).wait(1050).to({x: Math.floor(window.innerWidth/2+191), y: Math.floor(window.innerHeight/2+120), alpha: 0}, 500, createjs.Ease.cubicIn);
        createjs.Tween.get(this.airport).wait(450).to({scaleX:0, scaleY:0}, 600, createjs.Ease.elasticIn);
        createjs.Tween.get(this.label).wait(200).to({rotation:20, alpha:0}, 250, createjs.Ease.cubicIn);
    };

    function tick()
    {
        if(this.line) {
            this.line.clear();
        }
        this.line.setStrokeStyle(0.8);
        this.line.beginStroke("black");
        this.line.moveTo(window.innerWidth/2+191, window.innerHeight/2+120);
        this.line.lineTo(this.circleE.x, this.circleE.y);
        if(this.circleE.x === this.circleS.x) {
            this.line.clear();
        }
    }

    return SlideWenen;

})();

/* globals SlideNewyork:true */
/* globals SlideWenen:true */
/* globals SlideAthene:true */


var Slideshow = (function()
{

    var self;

    function Slideshow()
    {
        self = this;

        Slideshow.NEXT_SLIDE = "NEXT_SLIDE";

        this.currentSlide = 1;
        this.line = new createjs.Shape();
        this.view = new createjs.Container();

        /*this.bg = new createjs.Shape();
        this.bg.graphics.beginFill("#ec008c");
        this.bg.graphics.drawRect(0,0,window.innerWidth,window.innerHeight);
        this.bg.graphics.endFill();
        this.view.addChild(this.bg);*/

        this.menuNewyork = new createjs.Text("reis naar new york", "14px orator_stdregular", "#fff");
        this.menuNewyork.addEventListener("click", self.changeSlideHandler);
        this.menuNewyork.x = window.innerWidth/2-400-this.menuNewyork.getBounds().width/2;
        this.menuNewyork.y = window.innerHeight-90;
        this.view.addChild(this.menuNewyork);

        this.menuWenen = new createjs.Text("reis naar wenen", "14px orator_stdregular", "#fff");
        this.menuWenen.addEventListener("click", self.changeSlideHandler);
        this.menuWenen.x = window.innerWidth/2-this.menuWenen.getBounds().width/2;
        this.menuWenen.y = window.innerHeight-90;
        this.view.addChild(this.menuWenen);

        this.menuAthene = new createjs.Text("reis naar athene", "14px orator_stdregular", "#fff");
        this.menuAthene.addEventListener("click", self.changeSlideHandler);
        this.menuAthene.x = window.innerWidth/2+400-this.menuAthene.getBounds().width/2;
        this.menuAthene.y = window.innerHeight-90;
        this.view.addChild(this.menuAthene);

        this.menuNewyork.cursor = this.menuWenen.cursor = this.menuAthene.cursor = "pointer";

        this.currentSlideView = null;

        this.nextSlideHandler();
    }

    Slideshow.prototype.changeSlideHandler = function(e)
    {
        switch(e.currentTarget.text)
        {
            case "reis naar new york":
                self.currentSlide = 1;
                break;
            case "reis naar wenen":
                self.currentSlide = 2;
                break;
            case "reis naar athene":
                self.currentSlide = 3;
                break;
        }
    };

    Slideshow.prototype.nextSlideHandler = function()
    {
        if(self.currentSlideView != null){
            bean.off(self.currentSlideView,Slideshow.NEXT_SLIDE, self.nextSlideHandler);
            self.view.removeChild(self.currentSlideView.view);
            self.currentSlideView = null;
        }

        switch(self.currentSlide)
        {
            case 1:
                self.currentSlideView = new SlideNewyork();
                lineHandler(self.menuNewyork);
                self.currentSlide++;
                break;
            case 2:
                self.currentSlideView = new SlideWenen();
                lineHandler(self.menuWenen);
                self.currentSlide++;
                break;
            case 3:
                self.currentSlideView = new SlideAthene();
                lineHandler(self.menuAthene);
                self.currentSlide = 1;
                break;
        }

        self.view.addChild(self.currentSlideView.view);
        self.currentSlideView.animateIn();
        bean.on(self.currentSlideView,Slideshow.NEXT_SLIDE, self.nextSlideHandler);
    };

    function lineHandler(item)
    {
        if(self.line){
            self.line.graphics.clear();
        }
        self.line.graphics.beginFill("#fff");
        self.line.graphics.drawRect(item.x,item.y + 20,item.getBounds().width,1);
        self.line.graphics.endFill();
        self.view.addChild(self.line);
    }

    return Slideshow;

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
/* globals AppModel:true */
/* globals TimelineDot:true */
/* globals TravelInfo:true */

var Timeline = (function(){

    var self;

    function Timeline(){

        self = this;

        this.view = new createjs.Container();
        this.dots = [];
        this.view.y = stage.canvas.height - 60;

        this.lines = new createjs.Graphics();
        var linesShape = new createjs.Shape(this.lines);
        this.view.addChild(linesShape);

        this.travelInfo = new TravelInfo();
        this.view.addChild(this.travelInfo.view);

        this.luggageIcon = new createjs.Bitmap(preload.getResult("luggage_icon"));
        this.view.addChild(this.luggageIcon);
        this.luggageIcon.x = stage.canvas.width - 84;
        this.luggageIcon.y = -15;
        this.luggageIcon.alpha = 0;


        bean.on(appModel, AppModel.NOW_AND_NEXT_LOADED, function(e)
        {
            self.lines.clear();
            self.lines.setStrokeStyle(0.3);
            self.lines.beginStroke(createjs.Graphics.getRGB(180,180,180));

            for(var i = self.dots.length; i < appModel.userModel.songs.length - 2; i++){

                var timelineDot = new TimelineDot(i);

                timelineDot.view.x = stage.canvas.width - (100 + i * 25);
                timelineDot.view.y = 0;
                self.view.addChild(timelineDot.view);
                console.log(stage.canvas.width - (50 + i * 25));
                self.dots.push(timelineDot);
            }


            if(self.dots.length > 0){
                self.lines.moveTo(self.dots[0].view.x + 30, self.dots[0].view.y );
                self.lines.lineTo(self.dots[self.dots.length - 1].view.x, self.dots[self.dots.length - 1].view.y);

                createjs.Tween.get(self.travelInfo.view).to({y:-70},800, createjs.Tween.cubicInOut  );
                createjs.Tween.get(self.luggageIcon).to({alpha:1, y:-6},400, createjs.Tween.cubicInOut  );
            }/*else{
                createjs.Tween.get(self.travelInfo.view).to({y:0}, 800);
            }*/
        });
    }

    return Timeline;

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

var TimelineDot = (function(){

    function TimelineDot(songIndex){
        //_.bindAll(this);

        // EVENT TYPES
        TimelineDot.CLICKED = "CLICKED";

        this.songIndex = songIndex;

        this.view = new createjs.Container();
        this.circle = new createjs.Shape();
        this.circle.mouseEnabled = true;
        this.circle.graphics.beginFill("#000000").drawCircle(0, 0, 2);

        this.countryTxt = new createjs.Text(appModel.userModel.songs[songIndex].location,"10px Arial","#000000");
        //this.view.addChild(this.countryTxt);

        /*this.view.x = stage.canvas.width / 2;
        this.view.y = stage.canvas.height / 2;*/
        this.view.addChild(this.circle);
        this.view.mouseEnabled = true;

        this.circle.addEventListener("click",$.proxy( function(){
            appModel.setCurrentSongIndex(this.songIndex);
        }, this ));
    }

   /* TimelineDot.prototype.showInfoView = function(){
        if(this.dotInfo == null){
            this.dotInfo = new DotInfo(appModel.userModel.songs[this.songIndex]);
            this.view.addChild(this.dotInfo.view);
            //console.log("[Dot] show dot info");
        }
    };

    TimelineDot.prototype.hideInfoView = function(){
        if(this.dotInfo != null){
            this.view.removeChild(this.dotInfo.view);
            this.dotInfo = null;
            //console.log("[Dot] hide dot info");
        }
    };*/

    return TimelineDot;

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
/* globals CurrentProgramma:true */

var TravelInfo = (function(){

    var self;

    function TravelInfo(){

        self = this;

        this.view = new createjs.Container();

        this.cloud = new createjs.Bitmap(preload.getResult('cloud'));
        this.cloud.regX = 486/2;
        this.cloud.regY = 249/2;
        this.cloud.x = -130;
        //this.cloud.alpha = 0;
        this.view.addChild(this.cloud);

        this.background = new createjs.Shape();
        this.background.graphics.beginFill("#ffd600");
        this.background.graphics.drawRect(0,0,0, 20);
        this.background.graphics.endFill();
        this.view.addChild(this.background);

        this.nextDestinationTxt = new createjs.Text("","12px orator_stdregular", "#000000");
        this.view.addChild(this.nextDestinationTxt);
        this.nextDestinationTxt.x = 0;
        this.nextDestinationTxt.y = 0;
        this.nextDestinationTxt.textAlign = "right";

        this.nextTitleTxt = new createjs.Text("","12px orator_stdregular", "#000000");
        this.nextTitleTxt.y = 22;
        this.nextTitleTxt.x = 4;
        this.view.addChild(this.nextTitleTxt);
        this.nextTitleTxt.textAlign = "right";

        /*this.nextDescriptionTxt = new createjs.Text("","12px orator_stdregular", "#000000");
        this.nextDescriptionTxt.y = 45;
        this.nextDescriptionTxt.x = 0;
        this.view.addChild(this.nextDescriptionTxt);
        this.nextDescriptionTxt.textAlign = "right";*/

        this.background.y = this.nextTitleTxt.y;

        this.currentProgramma = new CurrentProgramma();
        this.view.addChild(this.currentProgramma.view);

        this.view.y = -40;
        this.view.x = stage.canvas.width - 80;

        bean.on(appModel, AppModel.NOW_AND_NEXT_LOADED, function(e){
            if(appModel.nextSong != null){
                self.nextDestinationTxt.text = "volgende bestemming: " + appModel.nextSong.location;
                var title = appModel.nextSong.title + ", " + appModel.nextSong.artist;
                if(title.length > 34){
                    title = title.substr(0, 40);
                    title += "...";
                }
                self.nextTitleTxt.text = title;

                self.background.graphics.clear();
                self.background.graphics.beginFill("#ffd600");
                self.background.graphics.drawRect(-self.nextTitleTxt.getMeasuredWidth(),0,self.nextTitleTxt.getMeasuredWidth() + 8, 18);
                self.background.graphics.endFill();
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

/* globals stage:true  */

var PreloadManager = (function(){

    var self;

    function PreloadManager(){
        self = this;

        PreloadManager.LOADING_DONE = "LOADING_DONE";

        this.isPreloadingApp = false;
        this.view = new createjs.Container();

        preload = new createjs.LoadQueue();
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("progress", self.handleProgress);
        preload.addEventListener("complete", self.handleComplete);
        preload.addEventListener("fileload", self.handleFileLoad);

        this.preloaderView = new createjs.Container();
        this.progressTxt = new createjs.Text("","12 Arial", "#000000");
        this.preloaderView.addChild(this.progressTxt);
        this.progressTxt.x = stage.canvas.width / 2;
        this.progressTxt.y = stage.canvas.height / 2;

        this.removePreloaderTimeout = null;
    }

    PreloadManager.prototype.preloadApp = function(){
        showPreloader();
        self.isPreloadingApp = true;
        var manifest = [
            {src:"assets/cloud.png", id:"cloud"},
            {src:"assets/klara_logo.png", id:"klara_logo"},
            {src:"assets/logo_background.png", id:"logo_background"},
            {src:"assets/worldmap3.png", id:"worldmap"},
            {src:"assets/buttons/facebook.png", id:"twitter"},
            {src:"assets/buttons/twitter.png", id:"facebook"},
            {src:"assets/buttons/play_pause.png"},
            {src:"assets/compass-indicator.png", id:"compass-indicator"},
            {src:"assets/compass-outer.png", id:"compass-outer"},
            {src:"assets/compass-inner.png", id:"compass-inner"},
            {src:"assets/title_app.png", id:"app_title"},
            {src:"assets/luggage_icon.png", id:"luggage_icon"},

            {src:"assets/slideshow/plane.png", id:"plane"},
            {src:"assets/slideshow/airport.png", id:"airport"},
            {src:"assets/slideshow/athene_image.png", id:"athene_image"},
            {src:"assets/slideshow/athene_label.png", id:"athene_label"},
            {src:"assets/slideshow/athene_map.png", id:"athene_map"},
            {src:"assets/slideshow/logo.png", id:"logo"},
            {src:"assets/slideshow/newyork_image.png", id:"newyork_image"},
            {src:"assets/slideshow/newyork_label.png", id:"newyork_label"},
            {src:"assets/slideshow/newyork_map.png", id:"newyork_map"},
            {src:"assets/slideshow/tip.png", id:"tip"},
            {src:"assets/slideshow/wenen_image.png", id:"wenen_image"},
            {src:"assets/slideshow/wenen_label.png", id:"wenen_label"},
            {src:"assets/slideshow/wenen_map.png", id:"wenen_map"}
        ];
        //createjs.Sound.alternateExtensions = ["mp3"];
        preload.loadManifest(manifest, true);
    };

    PreloadManager.prototype.handleProgress = function(event) {
        console.log(event.loaded);
        self.progressTxt.text = event.loaded + "%";
    };

    PreloadManager.prototype.handleFileLoad = function(event) {
        console.log(event);
    };

    PreloadManager.prototype.handleComplete = function(e) {
        removePreloader();
        bean.fire(self,PreloadManager.LOADING_DONE);
    };

    PreloadManager.prototype.handleError = function(event){
        console.log("[StartScreen] error preload!"+event);
    };

    function showPreloader(){
        stage.addChild(self.preloaderView);
    }

    function removePreloader(){
        stage.removeChild(self.preloaderView);
    }

    return PreloadManager;

})();

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
        ScreenManager.currentScreen.willBeRemoved();
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
        AppModel.CURRENT_SONG_CHANGED = "CURRENT_SONG_CHANGED";
        AppModel.NOW_AND_NEXT_LOADED = "NOW_AND_NEXT_LOADED";
        AppModel.PLAYER_STATUS_CHANGED = "PLAYER_STATUS_CHANGED";
        AppModel.NEXT_SONG_CHANGED = "NEXT_SONG_CHANGED";
        AppModel.CURRENT_PROGRAMMA_CHANGED = "CURRENT_PROGRAMMA_CHANGED";
        AppModel.FLIGHT_ANGLE_CHANGED = "FLIGHT_ANGLE_CHANGED";

        this.currentSongIndex = null;
        this.userModel = new UserModel();
        this.isPlaying = true;
        this.currentSong = null;
        this.nextSong = null;
        this.loadingCount = 0;
        this.loadingProgress = 0;
        this.currentProgramma = null;
        this.flightAngle = 0;
    }


    /*
    ----------------------- API DATA
     */

    AppModel.prototype.fetchProgramma = function(){
        $.getJSON(Util.api + '/programma')
            .done(this.fetchProgrammasHandler);
    };

    AppModel.prototype.fetchProgrammasHandler = function(data){
        //self.programmas = data.list;
        if(data.onairs[0].hasOwnProperty("now"))
        {
            console.log("[AppModel] programma now changed");
            if(data.onairs[0].now.onAir){
                self.currentProgramma = data.onairs[0].now;
                bean.fire(self,AppModel.CURRENT_PROGRAMMA_CHANGED);
                console.log(self.currentProgramma);
            }
        }
        //console.log(data.onairs[0].now);
        /*if(self.playlist.length>0){
         self.fetchNowAndNext();
         }
         else{
         console.log("[AppModel] nog geen playlist beschikbaar");
         }*/
    };

    AppModel.prototype.fetchPlaylist = function(){
        $.getJSON(Util.api + '/playlist')
            .done(this.getPlaylistHandler);
    };

    AppModel.prototype.getPlaylistHandler = function(data){
        self.playlist = data.list;
        console.log(data);
        /*if(self.playlist.length>0){
            self.fetchNowAndNext();
        }
        else{
            console.log("[AppModel] nog geen playlist beschikbaar");
        }*/
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
            //var startDate = new Date();
            //console.log(startDate);
            var endDate = new Date(data.onairs[k].endDate);
            song.duration = (endDate.getTime() - startDate.getTime())/1000;
            //console.log(song.duration);

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
            if(nextSong != null){ // als er een volgende nummer is
                self.nextSong = nextSong;
                self.userModel.songs.push(nextSong);
                self.fetchInfoForSongWithIndex(self.userModel.songs.length - 1, false); // fetch next song data
            }else{
                self.nextSong = null;
            }
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
                    //self.setCurrentSongIndex(self.currentSongIndex);
                }

                self.loadingProgress++;
                if(self.loadingProgress >= self.loadingCount){
                    // set local current and next songs when everything is loaded
                    self.currentSong = appModel.userModel.songs[self.currentSongIndex];
                    if(appModel.userModel.songs.length >= self.currentSongIndex + 2){
                        self.nextSong = appModel.userModel.songs[self.currentSongIndex + 1];
                    }
                    console.log("[AppModel] loading done!!!!!!!!");
                    //var temp = self.currentSongIndex;
                    //self.currentSongIndex = -1;
                    /*if(isCurrentSong){
                        self.setCurrentSongIndex(index);
                    }*/
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

    AppModel.prototype.setFlightAngle = function(angle){
        if(this.flightAngle !== angle){
            this.flightAngle = angle;
            bean.fire(this,AppModel.FLIGHT_ANGLE_CHANGED);
        }
    };

    return AppModel;

})();

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
        UserModel.LISTENING_TARGET = 14400;

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
            caption: 'WIN ook een reis met klara.be',
            description: (
                'Ik reisde '+ afstand + 'km met klara.be. Reis ook de wereld rond en WIN!'
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
/* globals CurrentProgramma:true */
/* globals Timeline:true */
/* globals PreloadManager:true */

var REFRESH_RATE = 30000;

var appModel, stage, preload;

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

        this.preloader = new PreloadManager();
        bean.on(this.preloader,PreloadManager.LOADING_DONE, this.preloadingDoneHandler);
        this.preloader.preloadApp();
    }

    App.prototype.preloadingDoneHandler = function(){

        appModel = new AppModel();
        appModel.fetchNowAndNext();
        setInterval(appModel.fetchNowAndNext,REFRESH_RATE);

        this.map = new MyMap();
        stage.addChild(this.map.view);

       /* this.travelInfo = new TravelInfo();
        stage.addChild(this.travelInfo.view);*/

        /*this.currentProgramma = new CurrentProgramma();
        stage.addChild(this.currentProgramma.view);*/

        /*this.player = new Player();
        stage.addChild(this.player.view);*/

        this.timeline = new Timeline();
        stage.addChild(this.timeline.view);

        this.progress = new Progress(70, 70);
        stage.addChild(this.progress.view);

        appModel.fetchProgramma();
    };

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