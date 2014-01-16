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