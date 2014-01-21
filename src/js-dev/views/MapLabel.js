/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 20/01/14
 * Time: 22:27
 * To change this template use File | Settings | File Templates.
 */

var MapLabel = (function(){

    function MapLabel(x, y, txt){

        this.view = new createjs.Container();

        var lblTxt = new createjs.Text(txt,"12px Arial","#000000");

        var bg = new createjs.Shape();

        this.view.addChild(bg);
        this.view.addChild(lblTxt);

        this.view.x = x;
        this.view.y = y;

        //bg.graphics.beginFill("#000000").drawRect(0,0, lblTxt.getBounds().width, lblTxt.getBounds().height);
        //console.log(lblTxt);
    }

    return MapLabel;

})();