/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 19/01/14
 * Time: 10:32
 * To change this template use File | Settings | File Templates.
 */


var Player = (function(){

    function Player(){

        this.view = new createjs.Container();

        // SOUND MUTE
        //SoundManager.playSounds = gameData.gamerData.isMusicOn;
        var mute_data = {
            images: ["assets/common/buttons/play_pause.png"],
            frames: {width:28.5, height:37},
            animations: {on:[0], mute:[1]}
        };
        var muteBtnspritesheet = new createjs.SpriteSheet(mute_data);
        this.muteBtnSprite = new createjs.Sprite(muteBtnspritesheet);
        this.view.addChild(this.muteBtnSprite);
        this.muteBtnSprite.addEventListener("click", function(e){
            SoundManager.toggleSound();
            updateMuteBtnState();
        });

    }



    return Player;

})();