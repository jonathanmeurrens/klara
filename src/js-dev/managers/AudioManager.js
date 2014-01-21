/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 16/01/14
 * Time: 19:31
 * To change this template use File | Settings | File Templates.
 */

var AudioManager = function(){};

AudioManager.player = document.getElementById("player");
AudioManager.isPlaying = true;


AudioManager.togglePlay = function(){
    if (AudioManager.player.paused) {
        AudioManager.player.play();
    }
    else {
        AudioManager.player.stop();
    }
};

AudioManager.stop = function(){
    AudioManager.player.stop();
};