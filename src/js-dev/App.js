/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:02
 * To change this template use File | Settings | File Templates.
 */

/* globals Util:true */
/* globals $jit:true */
/* globals AppModel:true */
/* globals MyMap:true */
/* globals SoundManager:true */
/* globals Progress:true */
/* globals Player:true */
/* globals TravelInfo:true */
/* globals CurrentProgramma:true */
/* globals Timeline:true */
/* globals PreloadManager:true */

var REFRESH_RATE = 30000;

var appModel, stage, preload;

var App = (function(){

    function App($sourceElement){
        _.bindAll(this); // this altijd slaat op deze klasse

        var canvas = document.getElementById('cnvs');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        stage = new createjs.Stage(document.getElementById("cnvs"));
        stage.enableMouseOver();
        stage.mouseMoveOutside = true;
        createjs.Ticker.addEventListener("tick",tick);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.useRAF = true;

        this.preloader = new PreloadManager();
        bean.on(this.preloader,PreloadManager.LOADING_DONE, this.preloadingDoneHandler);
        this.preloader.preloadApp();
    }

    App.prototype.preloadingDoneHandler = function(){

        appModel = new AppModel();
        appModel.fetchNowAndNext();
        setInterval(appModel.fetchNowAndNext,REFRESH_RATE);

        this.map = new MyMap();
        stage.addChild(this.map.view);

       /* this.travelInfo = new TravelInfo();
        stage.addChild(this.travelInfo.view);*/

        /*this.currentProgramma = new CurrentProgramma();
        stage.addChild(this.currentProgramma.view);*/

        /*this.player = new Player();
        stage.addChild(this.player.view);*/

        this.timeline = new Timeline();
        stage.addChild(this.timeline.view);

        this.progress = new Progress(70, 70);
        stage.addChild(this.progress.view);

        appModel.fetchProgramma();
    };

    function tick(){
        stage.update();
    }

    return App;
})();