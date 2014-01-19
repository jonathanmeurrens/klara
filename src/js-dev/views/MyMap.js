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