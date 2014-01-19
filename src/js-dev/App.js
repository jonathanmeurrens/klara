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

var REFRESH_RATE = 10000;

var appModel, stage;

var App = (function(){

    function App($sourceElement){
        _.bindAll(this); // this altijd slaat op deze klasse

        var canvas = document.getElementById('cnvs');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        stage = new createjs.Stage(document.getElementById("cnvs"));
        stage.enableMouseOver();
        createjs.Ticker.addEventListener("tick",tick);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.useRAF = true;

        appModel = new AppModel();
        appModel.getPlaylist();

        this.map = new MyMap();
        stage.addChild(this.map.view);

        this.progress = new Progress(70, 70);
        stage.addChild(this.progress.view);
    }

    function tick(){
        stage.update();
    }

    return App;
})();