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

        this.programmaTitleTxt = new createjs.Text("","12px Arial", "#000000");
        this.view.addChild(this.programmaTitleTxt);

        this.programmaDescTxt = new createjs.Text("","10px Arial", "#000000");
        this.programmaDescTxt.y = 20;
        this.view.addChild(this.programmaDescTxt);

        this.programmaPresentatorTxt = new createjs.Text("","10px Arial", "#000000");
        this.programmaPresentatorTxt.y = 40;
        this.view.addChild(this.programmaPresentatorTxt);

        this.view.y = stage.canvas.height / 2;
        this.view.x = stage.canvas.width / 2;

        bean.on(appModel, AppModel.NOW_AND_NEXT_LOADED, function(e){
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
            self.programmaTitleTxt.text = appModel.currentProgramma.title;
            self.programmaDescTxt.text = appModel.currentProgramma.description;
            self.programmaPresentatorTxt.text = appModel.currentProgramma.presenters[0].name;

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