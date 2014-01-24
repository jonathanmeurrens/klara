/* globals Slideshow:true */

var SlideNewyork = (function()
{

    var self;

    function SlideNewyork()
    {
        self = this;

        this.view = new createjs.Container();

        this.line = new createjs.Graphics();
        var lineShape = new createjs.Shape(this.line);
        this.view.addChild(lineShape);

        this.circleS = new createjs.Shape();
        this.circleS.graphics.beginFill("black").drawCircle(0,0,2);
        this.circleS.x = Math.floor(window.innerWidth/2+185);
        this.circleS.y = Math.floor(window.innerHeight/2+79);
        this.circleS.alpha = 0;
        this.view.addChild(this.circleS);

        this.circleE = new createjs.Shape();
        this.circleE.graphics.beginFill("black").drawCircle(0,0,2);
        this.circleE.x = Math.floor(window.innerWidth/2+184);
        this.circleE.y = Math.floor(window.innerHeight/2+78);
        this.view.addChild(this.circleE);

        this.logo = new createjs.Bitmap(preload.getResult("logo"));
        this.logo.width = 239;
        this.logo.height = 249;
        this.logo.x = window.innerWidth/2-this.logo.width/2;
        this.logo.y = window.innerHeight/2-this.logo.height/2;
        this.view.addChild(this.logo);

        this.airport = new createjs.Bitmap(preload.getResult("airport"));
        this.airport.x = Math.floor(window.innerWidth/2-90+17);
        this.airport.y = Math.floor(window.innerHeight/2-178+17);
        this.airport.scaleX = this.airport.scaleY = 0;
        this.airport.regX = this.airport.regY = 17;
        this.view.addChild(this.airport);

        this.label = new createjs.Bitmap(preload.getResult("newyork_label"));
        this.label.x = Math.floor(window.innerWidth/2-72);
        this.label.y = Math.floor(window.innerHeight/2-189+26);
        this.label.regY = 26;
        this.label.rotation = 15;
        this.label.alpha = 0;
        this.view.addChild(this.label);

        this.plane = new createjs.Bitmap(preload.getResult("plane"));
        this.plane.x = Math.floor(window.innerWidth/2-300);
        this.plane.y = Math.floor(window.innerHeight/2-202);
        this.plane.alpha = 0;
        this.view.addChild(this.plane);

        this.image = new createjs.Bitmap(preload.getResult("newyork_image"));
        this.image.width = 239;
        this.image.height = 249;
        this.image.x = Math.floor(window.innerWidth/2+50);
        this.image.y = Math.floor(window.innerHeight/2-this.image.height/2);
        this.image.alpha = 0;
        this.view.addChild(this.image);

        this.map = new createjs.Bitmap(preload.getResult("newyork_map"));
        this.map.x = Math.floor(window.innerWidth/2-140);
        this.map.y = Math.floor(window.innerHeight/2-167);
        this.map.alpha = 0;
        this.view.addChild(this.map);

        this.twitter = new createjs.Bitmap(preload.getResult("twitter"));
        this.twitter.x = Math.floor(window.innerWidth/2+154+11);
        this.twitter.y = Math.floor(window.innerHeight/2+71+11);
        this.twitter.scaleX = this.twitter.scaleY = 0.5;
        this.twitter.regX = this.twitter.regY = 11;
        this.twitter.alpha = 0;
        this.view.addChild(this.twitter);

        this.facebook = new createjs.Bitmap(preload.getResult("facebook"));
        this.facebook.x = Math.floor(window.innerWidth/2+174+11);
        this.facebook.y = Math.floor(window.innerHeight/2+48+11);
        this.facebook.scaleX = this.facebook.scaleY = 0.5;
        this.facebook.regX = this.facebook.regY = 11;
        this.facebook.alpha = 0;
        this.view.addChild(this.facebook);

        this.tip = new createjs.Bitmap(preload.getResult("tip"));
        this.tip.width = 279;
        this.tip.height = 54;
        this.tip.x = Math.floor(window.innerWidth/2+150);
        this.tip.y = Math.floor(window.innerHeight/2-this.tip.height/2+5);
        this.tip.alpha = 0;
        this.view.addChild(this.tip);
    }

    SlideNewyork.prototype.animateIn = function()
    {
        $(this.view).on("tick", $.proxy(tick, this));

        createjs.Tween.get(this.facebook).wait(800).to({scaleX:1, scaleY:1, alpha:1}, 600, createjs.Ease.elasticOut);
        createjs.Tween.get(this.twitter).wait(1000).to({scaleX:1, scaleY:1, alpha:1}, 600, createjs.Ease.elasticOut);

        createjs.Tween.get(this.map).to({alpha:1}, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.tip).to({x:Math.floor(window.innerWidth/2-this.tip.width/2), alpha:1}, 3000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.image).to({x:Math.floor(window.innerWidth/2-this.image.width/2), alpha:1}, 3000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.plane).to({x: Math.floor(window.innerWidth/2-92), alpha:1}, 3000, createjs.Ease.cubicOut).call(function(){self.animateOut();});

        createjs.Tween.get(this.circleE).to({x: Math.floor(window.innerWidth/2-72), y: Math.floor(window.innerHeight/2-160)}, 1000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.airport).wait(1000).to({scaleX:1, scaleY:1}, 1000, createjs.Ease.elasticOut);
        createjs.Tween.get(this.label).wait(1500).to({rotation:0, alpha:1}, 1000, createjs.Ease.elasticOut);
    };

    SlideNewyork.prototype.animateOut = function()
    {
        createjs.Tween.get(this.facebook).wait(800).to({scaleX:0.5, scaleY:0.5, alpha:0}, 200, createjs.Ease.cubicIn);
        createjs.Tween.get(this.twitter).wait(1000).to({scaleX:0.5, scaleY:0.5, alpha:0}, 300, createjs.Ease.cubicIn);

        createjs.Tween.get(this.map).wait(1000).to({alpha:0}, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(this.tip).to({x: Math.floor(window.innerWidth/2-this.tip.width/2-150), alpha:0}, 2000, createjs.Ease.cubicIn);
        createjs.Tween.get(this.image).to({x: Math.floor(window.innerWidth/2-this.image.width/2-100), alpha:0}, 2000, createjs.Ease.cubicIn);
        createjs.Tween.get(this.plane).to({x:Math.floor(window.innerWidth/2+100), alpha:0}, 2000, createjs.Ease.cubicIn).call(function(){
            self.view.removeAllChildren();
            bean.fire(self, Slideshow.NEXT_SLIDE);
            //stage.dispatchEvent("NEXT_SLIDE");
        });

        createjs.Tween.get(this.circleE).wait(1050).to({x: Math.floor(window.innerWidth/2+185), y: Math.floor(window.innerHeight/2+79), alpha: 0}, 500, createjs.Ease.cubicIn);
        createjs.Tween.get(this.airport).wait(450).to({scaleX:0, scaleY:0}, 600, createjs.Ease.elasticIn);
        createjs.Tween.get(this.label).wait(200).to({rotation:20, alpha:0}, 250, createjs.Ease.cubicIn);
    };

    function tick()
    {
        if(this.line) {
            this.line.clear();
        }
        this.line.setStrokeStyle(0.8);
        this.line.beginStroke("black");
        this.line.moveTo(window.innerWidth/2+185, window.innerHeight/2+79);
        this.line.lineTo(this.circleE.x, this.circleE.y);
        if(this.circleE.x === this.circleS.x) {
            this.line.clear();
        }
    }

    return SlideNewyork;

})();