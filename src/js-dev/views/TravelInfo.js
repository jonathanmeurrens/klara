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

        bean.on(appModel, AppModel.NOW_AND_NEXT_LOADED, function(e){
            if(appModel.nextSong != null){

                console.log("[TravelInfo] update info",appModel.nextSong.location);
            }
        });
    }

    return TravelInfo;

})();