/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 19/01/14
 * Time: 10:32
 * To change this template use File | Settings | File Templates.
 */

/* globals AudioManager:true */
/* globals appModel:true */

var Player = (function(){

    var self;

    function Player(){

        self = this;

        this.view = new createjs.Container();
        this.player = document.getElementById("player");

        var mute_data = {
            images: ["assets/buttons/play_pause.png"],
            frames: {width:28.5, height:37},
            animations: {on:[0], mute:[1]}
        };
        var muteBtnspritesheet = new createjs.SpriteSheet(mute_data);
        this.muteBtnSprite = new createjs.Sprite(muteBtnspritesheet);
        this.view.addChild(this.muteBtnSprite);
        this.muteBtnSprite.addEventListener("click", function(e){
            if (self.player.paused) {
                self.player.play();
                self.muteBtnSprite.gotoAndStop("on");
            }
            else {
                self.player.pause();
                self.muteBtnSprite.gotoAndStop("mute");
            }
            appModel.setIsPlaying(!self.player.paused);
        });
    }

    return Player;

})();