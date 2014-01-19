/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:30
 * To change this template use File | Settings | File Templates.
 */

/* globals UserModel:true */
/* globals ScreenManager:true */
/* globals appModel:true */

var Progress = (function(){

    var self;

    function Progress(xPos, yPos){

        self = this;

        bean.on(appModel.userModel, UserModel.PROGRESS_CHANGED, userProgressChangedHandler);

        this.view = new createjs.Container();
        this.view.regX = this.view.regY = -65/2;
        this.view.x = xPos;
        this.view.y = yPos;
        this.circle = new createjs.Shape();
        this.circle.mouseEnabled = true;
        this.circle.graphics.beginFill("#FFEA00").drawCircle(0, 0, 52);
        this.view.addChild(this.circle);
        this.circle.scaleX = this.circle.scaleY = 0;
        createjs.Tween.get(this.circle).to({scaleX:1, scaleY: 1}, 1700, createjs.Ease.elasticOut);

        this.borderCircle = new createjs.Shape();
        this.borderCircle.mouseEnabled = true;
        this.borderCircle.graphics.setStrokeStyle(0.3);
        this.borderCircle.graphics.beginStroke(createjs.Graphics.getRGB(180,180,180));
        this.borderCircle.graphics.drawCircle(0, 0, 70);
        this.view.addChild(this.borderCircle);
        this.borderCircle.scaleX = this.borderCircle.scaleY = 0;
        createjs.Tween.get(this.borderCircle).to({scaleX:1, scaleY: 1}, 1700, createjs.Ease.elasticOut).call(function(){
            self.plane = new createjs.Bitmap("assets/plane.png");
            self.plane.regX = 18/2;
            self.plane.regY = 158/2;
            self.view.addChild(self.plane);
        });

        this.logo = new createjs.Bitmap("assets/klara_logo.png");
        this.logo.regX = 58/2;
        this.logo.regY = 58/2;
        this.logo.alpha = 0;
        this.view.addChild(this.logo);
        createjs.Tween.get(this.logo).to({alpha:1}, 1000);

        this.progressTxt = new createjs.Text("","12px Arial", "#222222");
        this.progressTxt.y = 0;
        this.progressTxt.x = 88;
        this.view.addChild(this.progressTxt);

        this.isOpen = false;
        this.view.mouseEnabled = true;
        this.view.addEventListener("click", $.proxy( clickHandler, this ));

        this.progressTimer = setInterval(function(){
            appModel.userModel.setProgress(appModel.userModel.progress += 1);
        },1000);

        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function clickHandler(){
        if(!this.isOpen){
            createjs.Tween.get(this.circle).to({scaleX:35, scaleY: 35}, 500);
            ScreenManager.showScreen(ScreenManager.CAMPAIGN_INFO);
        }else{
            createjs.Tween.get(this.circle).to({scaleX:1, scaleY: 1}, 500, createjs.Ease.easeOut);
            ScreenManager.removeCurrentScreen();
        }
        this.isOpen = !this.isOpen;
    }

    function userProgressChangedHandler(){
        self.progressTxt.text = appModel.userModel.progress + "/20000KM";
    }

    function tick(){
        if(this.plane != null){
            this.plane.rotation -= 0.5;
        }
    }

    return Progress;

})();