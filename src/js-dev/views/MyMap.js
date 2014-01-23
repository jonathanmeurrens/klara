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