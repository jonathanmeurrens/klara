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
        this.shadowShape.graphics.lineTo(170,-75);
        this.shadowShape.graphics.lineTo(170,-30);
        this.shadowShape.graphics.endFill();
        this.shadowShape.graphics.closePath();
        this.shadowShape.alpha = 0.07;
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