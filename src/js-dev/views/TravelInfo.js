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

    var self;

    function TravelInfo(){

        self = this;

        this.view = new createjs.Container();

        this.nextDestinationTxt = new createjs.Text("","12px Arial", "#000000");
        this.view.addChild(this.nextDestinationTxt);

        this.nextTitleTxt = new createjs.Text("","10px Arial", "#000000");
        this.nextTitleTxt.y = 20;
        this.view.addChild(this.nextTitleTxt);

        this.view.y = stage.canvas.height - 80;
        this.view.x = 40;

        bean.on(appModel, AppModel.NOW_AND_NEXT_LOADED, function(e){
            if(appModel.nextSong != null){
                self.nextDestinationTxt.text = "next destination: " + appModel.nextSong.location;
                self.nextTitleTxt.text = appModel.nextSong.title;
                console.log("[TravelInfo] update info",appModel.nextSong.location);
            }
        });
    }

    return TravelInfo;

})();