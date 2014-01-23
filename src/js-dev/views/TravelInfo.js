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

        this.background.y = this.nextTitleTxt.y;

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
                self.background.graphics.drawRect(-self.nextTitleTxt.getBounds().width,0,self.nextTitleTxt.getBounds().width + 8, 18);
                self.background.graphics.endFill();
            }
        });
    }

    return TravelInfo;

})();