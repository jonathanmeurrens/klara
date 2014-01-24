/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:30
 * To change this template use File | Settings | File Templates.
 */

/* globals UserModel:true */
/* globals ScreenManager:true */
/* globals AppModel:true */
/* globals appModel:true */
/* globals Button:true */
/* globals postOnFacebook:true */

var Progress = (function(){

    var self;

    function Progress(xPos, yPos){

        self = this;

        bean.on(appModel.userModel, UserModel.PROGRESS_CHANGED, userProgressChangedHandler);
        bean.on(appModel, AppModel.PLAYER_STATUS_CHANGED, playerStatusChangedHandler);
        bean.on(appModel, AppModel.FLIGHT_ANGLE_CHANGED, flightAngleChangedHandler);

        this.view = new createjs.Container();
        this.view.regX = this.view.regY = -64/2;
        this.view.x = xPos;
        this.view.y = yPos;

        var radius = stage.canvas.width + 64;
        /*var graphicBg = new createjs.Graphics().
            beginRadialGradientFill(
                ["#ec008c","#b5006c"],
                [0, 1],
                stage.canvas.width/2,
                stage.canvas.height/2,
                0,
                stage.canvas.width/2,
                stage.canvas.height/2,
                radius/3)
            .drawCircle(0, 0, radius);*/

        this.cloud = new createjs.Bitmap(preload.getResult('cloud'));
        this.cloud.regX = 486/2;
        this.cloud.regY = 249/2;
        //this.cloud.alpha = 0;
        this.view.addChild(this.cloud);
        //createjs.Tween.get(this.cloud).to({alpha:1}, 1000);

        this.shapeBg = new createjs.Shape();
        this.shapeBg.graphics.beginFill("#ec008c");
        this.shapeBg.graphics.drawCircle(0,0,radius);
        this.shapeBg.graphics.endFill();
        this.view.addChild(this.shapeBg);
        this.shapeBg.scaleX = this.shapeBg.scaleY = 0;

        this.app_title = new createjs.Bitmap(preload.getResult("app_title"));
        this.app_title.regX = -60;
        this.app_title.regY = 33;
        this.app_title.alpha = 0;
        this.view.addChild(this.app_title);
        createjs.Tween.get(this.app_title).to({alpha:1}, 1000);

        this.borderCircle = new createjs.Shape();
        this.borderCircle.mouseEnabled = true;
        this.borderCircle.graphics.setStrokeStyle(0.3);
        this.borderCircle.graphics.beginStroke(createjs.Graphics.getRGB(180,180,180));
        this.borderCircle.graphics.drawCircle(0, 0, 70);
        this.view.addChild(this.borderCircle);
        this.borderCircle.scaleX = this.borderCircle.scaleY = 0;

        this.logo_bg = new createjs.Bitmap(preload.getResult('logo_background'));
        this.logo_bg.regX = 94/2;
        this.logo_bg.regY = 94/2;
        this.logo_bg.alpha = 0;
        this.view.addChild(this.logo_bg);
        createjs.Tween.get(this.logo_bg).to({alpha:1}, 1000);

        this.compassOuter = new createjs.Bitmap(preload.getResult('compass-outer'));
        this.compassOuter.regX = 152/2;
        this.compassOuter.regY = 152/2;
        this.compassOuter.alpha = 0;
        this.view.addChild(this.compassOuter);
        createjs.Tween.get(this.compassOuter).to({alpha:1}, 1000);

        this.compassInner = new createjs.Bitmap(preload.getResult('compass-inner'));
        this.compassInner.regX = 118/2;
        this.compassInner.regY = 118/2;
        this.compassInner.alpha = 0;
        this.view.addChild(this.compassInner);
        createjs.Tween.get(this.compassInner).to({alpha:1}, 1000);

        this.indicator = new createjs.Bitmap(preload.getResult('compass-indicator'));
        this.indicator.regX = -110/2;
        this.indicator.regY = 4/2;
        this.indicator.alpha = 0;
        this.view.addChild(this.indicator);
        createjs.Tween.get(this.indicator).to({alpha:1}, 1000);

        this.logo = new createjs.Bitmap(preload.getResult('klara_logo'));
        this.logo.regX = 52/2;
        this.logo.regY = 56/2;
        this.logo.alpha = 0;
        this.view.addChild(this.logo);
        createjs.Tween.get(this.logo).to({alpha:1}, 1000);

        this.progressTxt = new createjs.Text("","12px orator_stdregular", "#222222");
        this.progressTxt.y = -7;
        this.progressTxt.x = 273;
        this.progressTxt.textAlign = "right";
        this.view.addChild(this.progressTxt);

        this.isOpen = false;
        this.view.mouseEnabled = true;
        this.view.addEventListener("click", $.proxy( clickHandler, this ));

        this.progressTimer = setInterval(function(){
            appModel.userModel.setProgress(appModel.userModel.progress += 1);
            if(appModel.userModel.progress === UserModel.LISTENING_TARGET){
                console.log("[UserModel] show form");
            }
        },1000);

        var fbButton = new Button(Button.FACEBOOK);
        this.view.addChild(fbButton.view);
        fbButton.view.x = 305;
        fbButton.view.y = -11;
        fbButton.view.addEventListener("click", function(e){
            postOnFacebook(appModel.userModel.progress);
        });

        var twButton = new Button(Button.TWITTER);
        this.view.addChild(twButton.view);
        twButton.view.x = fbButton.view.x + 30;
        twButton.view.y = -11;
        twButton.view.addEventListener("click", function(e){
            var url = "http://twitter.com/home?status= Ik reisde al " + appModel.userModel.progress + "km met Klara. Reis ook mee en WIN een reis!";
            window.open(url,'_blank');
        });

        $(this.view).on('tick', $.proxy( tick, this ));

        //doIndicatorAnimations();
        //doInnerCompassAnimations();
    }

    function flightAngleChangedHandler(){
        createjs.Tween.removeTweens(self.indicator);
        doIndicatorAnimations(appModel.flightAngle);
    }

    function doIndicatorAnimations(){
        var angle = appModel.flightAngle - 180;
        createjs.Tween.get(self.indicator).to({rotation: 15 + angle - Math.random() * 15}, 1000 + Math.random(), createjs.Tween.cubicInOut).call(doIndicatorAnimations);
    }

    function doInnerCompassAnimations(){
        createjs.Tween.get(self.compassInner).to({rotation:Math.random()*360}, 4000 + Math.random()*2000).call(doInnerCompassAnimations);
    }

    function clickHandler(){
        if(!this.isOpen){
            createjs.Tween.get(this.shapeBg).to({scaleX:1, scaleY: 1}, 500);
            ScreenManager.showScreen(ScreenManager.CAMPAIGN_INFO);
        }else{
            createjs.Tween.get(this.shapeBg).to({scaleX:0, scaleY: 0}, 500, createjs.Ease.easeOut);
            ScreenManager.removeCurrentScreen();
        }
        this.isOpen = !this.isOpen;
    }

    function userProgressChangedHandler(){
        self.progressTxt.text = appModel.userModel.progress + "/"+ UserModel.LISTENING_TARGET +"KM";
    }

    function playerStatusChangedHandler(){
        if(!appModel.isPlaying){
            clearTimeout(self.progressTimer);
            self.progressTimer = null;
        }else{
            self.progressTimer = setInterval(function(){
                appModel.userModel.setProgress(appModel.userModel.progress += 1);
            },1000);
        }
    }

    function tick(){
        if(this.plane != null){
            this.plane.rotation -= 0.5;
        }
        //this.compassInner.rotation += 0.1;
        //this.indicator.rotation -= 0.1;
    }

    return Progress;

})();