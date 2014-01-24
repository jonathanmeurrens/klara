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
/* globals AppModel:true */
/* globals TimelineDot:true */
/* globals TravelInfo:true */

var Timeline = (function(){

    var self;

    function Timeline(){

        self = this;

        this.view = new createjs.Container();
        this.dots = [];
        this.view.y = stage.canvas.height - 60;

        this.lines = new createjs.Graphics();
        var linesShape = new createjs.Shape(this.lines);
        this.view.addChild(linesShape);

        this.travelInfo = new TravelInfo();
        this.view.addChild(this.travelInfo.view);

        this.luggageIcon = new createjs.Bitmap(preload.getResult("luggage_icon"));
        this.view.addChild(this.luggageIcon);
        this.luggageIcon.x = stage.canvas.width - 84;
        this.luggageIcon.y = -15;
        this.luggageIcon.alpha = 0;


        bean.on(appModel, AppModel.NOW_AND_NEXT_LOADED, function(e)
        {
            self.lines.clear();
            self.lines.setStrokeStyle(0.3);
            self.lines.beginStroke(createjs.Graphics.getRGB(180,180,180));

            for(var i = self.dots.length; i < appModel.userModel.songs.length - 2; i++){

                var timelineDot = new TimelineDot(i);

                timelineDot.view.x = stage.canvas.width - (100 + i * 25);
                timelineDot.view.y = 0;
                self.view.addChild(timelineDot.view);
                console.log(stage.canvas.width - (50 + i * 25));
                self.dots.push(timelineDot);
            }


            if(self.dots.length > 0){
                self.lines.moveTo(self.dots[0].view.x + 30, self.dots[0].view.y );
                self.lines.lineTo(self.dots[self.dots.length - 1].view.x, self.dots[self.dots.length - 1].view.y);

                createjs.Tween.get(self.travelInfo.view).to({y:-70},800, createjs.Tween.cubicInOut  );
                createjs.Tween.get(self.luggageIcon).to({alpha:1, y:-6},400, createjs.Tween.cubicInOut  );
            }/*else{
                createjs.Tween.get(self.travelInfo.view).to({y:0}, 800);
            }*/
        });
    }

    return Timeline;

})();