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