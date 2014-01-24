/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 21/01/14
 * Time: 21:51
 * To change this template use File | Settings | File Templates.
 */

/* globals appModel:true */
/* globals AppModel:true */

var CurrentProgramma = (function(){

    var self;

    function CurrentProgramma(){

        self = this;

        this.view = new createjs.Container();

        this.background = new createjs.Shape();
        this.background.graphics.beginFill("#ffd600");
        this.background.graphics.drawRect(0,0,0, 20);
        this.background.graphics.endFill();
        this.view.addChild(this.background);

        this.programmaTitleTxt = new createjs.Text("","10px orator_stdregular", "#000000");
        this.programmaTitleTxt.textAlign = "right";
        this.view.addChild(this.programmaTitleTxt);

        this.programmaDescTxt = new createjs.Text("","12px orator_stdregular", "#000000");
        this.programmaDescTxt.y = 20;
        this.programmaDescTxt.textAlign = "right";
        this.programmaDescTxt.lineWidth = 300;
        this.programmaDescTxt.textBaseline = "top";
        this.programmaDescTxt.lineHeight = 14;
        this.view.addChild(this.programmaDescTxt);

        this.programmaPresentatorTxt = new createjs.Text("","12px orator_stdregular", "#000000");
        this.programmaPresentatorTxt.y = 0;
        this.programmaPresentatorTxt.textAlign = "right";
        //this.view.addChild(this.programmaPresentatorTxt);

        this.view.y = -50;
        //this.view.x = stage.canvas.width / 2;

        bean.on(appModel, AppModel.NOW_AND_NEXT_LOADED, function(e){
            console.log("[CurrentProgramma] now and next loaded, is nextSong? =>",appModel.nextSong);
            if(appModel.nextSong == null){
                // show programma info
                self.view.alpha = 1;

            }else{
                // hide programma info
                self.view.alpha = 0;
            }
            console.log("[CurrentProgramma] now and next loaded: " + appModel.nextSong);
        });

        bean.on(appModel, AppModel.CURRENT_PROGRAMMA_CHANGED, function(e){
            console.log("[CurrentProgramma] programma changed: " + appModel.currentProgramma);
            self.programmaTitleTxt.text = appModel.currentProgramma.title.toUpperCase();

            self.background.graphics.clear();
            self.background.graphics.beginFill("#ffd600");
            self.background.graphics.drawRect(-self.programmaTitleTxt.getMeasuredWidth() - 11,-2,self.programmaTitleTxt.getMeasuredWidth() + 14, 18);
            self.background.graphics.endFill();

            var txt = appModel.currentProgramma.description;
            ///txt = txt.slice(0,50) + "\n" + txt.slice(50);
            self.programmaDescTxt.text = txt;
           // self.programmaPresentatorTxt.text = appModel.currentProgramma.presenters[0].name;

            if(appModel.userModel.songs.length - 1 === appModel.currentSongIndex){
                // no next, so show programma
                // show programma info
                self.view.alpha = 1;
            } else{
                self.view.alpha = 0;
            }

        });
    }

    return CurrentProgramma;

})();