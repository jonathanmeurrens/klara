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

var Timeline = (function(){

    function Timeline(){

        this.view = new createjs.Container();
        this.circle = new createjs.Shape();
        this.circle.mouseEnabled = true;
        this.circle.graphics.beginFill("#000").drawCircle(0, 0, 1.5);
        this.view.x = stage.canvas.width / 2;
        this.view.y = stage.canvas.height / 2;
        this.view.addChild(this.circle);
    }

    return Timeline;

})();