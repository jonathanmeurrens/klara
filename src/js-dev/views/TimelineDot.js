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