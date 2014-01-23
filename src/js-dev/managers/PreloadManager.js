/* globals stage:true  */

var PreloadManager = (function(){

    var self;

    function PreloadManager(){
        self = this;

        PreloadManager.LOADING_DONE = "LOADING_DONE";

        this.isPreloadingApp = false;
        this.view = new createjs.Container();

        preload = new createjs.LoadQueue();
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("progress", self.handleProgress);
        preload.addEventListener("complete", self.handleComplete);
        preload.addEventListener("fileload", self.handleFileLoad);

        this.preloaderView = new createjs.Container();
        this.progressTxt = new createjs.Text("","12 Arial", "#000000");
        this.preloaderView.addChild(this.progressTxt);
        this.progressTxt.x = stage.canvas.width / 2;
        this.progressTxt.y = stage.canvas.height / 2;

        this.removePreloaderTimeout = null;
    }

    PreloadManager.prototype.preloadApp = function(){
        showPreloader();
        self.isPreloadingApp = true;
        var manifest = [
            {src:"assets/klara_logo.png", id:"klara_logo"},
            {src:"assets/logo_background.png", id:"logo_background"},
            {src:"assets/worldmap3.png", id:"worldmap"},
            {src:"assets/buttons/facebook.png"},
            {src:"assets/buttons/twitter.png"},
            {src:"assets/buttons/play_pause.png"},
            {src:"assets/compass-indicator.png", id:"compass-indicator"},
            {src:"assets/compass-outer.png", id:"compass-outer"},
            {src:"assets/compass-inner.png", id:"compass-inner"},
            {src:"assets/title_app.png", id:"app_title"},
            {src:"assets/luggage_icon.png", id:"luggage_icon"}
        ];
        //createjs.Sound.alternateExtensions = ["mp3"];
        preload.loadManifest(manifest, true);
    };

    PreloadManager.prototype.handleProgress = function(event) {
        console.log(event.loaded);
        self.progressTxt.text = event.loaded + "%";
    };

    PreloadManager.prototype.handleFileLoad = function(event) {
        console.log(event);
    };

    PreloadManager.prototype.handleComplete = function(e) {
        removePreloader();
        bean.fire(self,PreloadManager.LOADING_DONE);
    };

    PreloadManager.prototype.handleError = function(event){
        console.log("[StartScreen] error preload!"+event);
    };

    function showPreloader(){
        stage.addChild(self.preloaderView);
    }

    function removePreloader(){
        stage.removeChild(self.preloaderView);
    }

    return PreloadManager;

})();