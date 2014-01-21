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