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
            {src:"assets/cloud.png", id:"cloud"},
            {src:"assets/klara_logo.png", id:"klara_logo"},
            {src:"assets/logo_background.png", id:"logo_background"},
            {src:"assets/worldmap3.png", id:"worldmap"},
            {src:"assets/buttons/facebook.png", id:"twitter"},
            {src:"assets/buttons/twitter.png", id:"facebook"},
            {src:"assets/buttons/play_pause.png"},
            {src:"assets/compass-indicator.png", id:"compass-indicator"},
            {src:"assets/compass-outer.png", id:"compass-outer"},
            {src:"assets/compass-inner.png", id:"compass-inner"},
            {src:"assets/title_app.png", id:"app_title"},
            {src:"assets/luggage_icon.png", id:"luggage_icon"},

            {src:"assets/slideshow/plane.png", id:"plane"},
            {src:"assets/slideshow/airport.png", id:"airport"},
            {src:"assets/slideshow/athene_image.png", id:"athene_image"},
            {src:"assets/slideshow/athene_label.png", id:"athene_label"},
            {src:"assets/slideshow/athene_map.png", id:"athene_map"},
            {src:"assets/slideshow/logo.png", id:"logo"},
            {src:"assets/slideshow/newyork_image.png", id:"newyork_image"},
            {src:"assets/slideshow/newyork_label.png", id:"newyork_label"},
            {src:"assets/slideshow/newyork_map.png", id:"newyork_map"},
            {src:"assets/slideshow/tip.png", id:"tip"},
            {src:"assets/slideshow/wenen_image.png", id:"wenen_image"},
            {src:"assets/slideshow/wenen_label.png", id:"wenen_label"},
            {src:"assets/slideshow/wenen_map.png", id:"wenen_map"}
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