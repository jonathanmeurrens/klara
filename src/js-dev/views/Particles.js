/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 17/01/14
 * Time: 10:33
 * To change this template use File | Settings | File Templates.
 */

var Particles = (function(){

    function Particles(){

        this.view = new createjs.Container();

        this.shape = new createjs.Shape();
        this.shape.graphics.setStrokeStyle(2);
        this.shape.graphics.beginStroke("#000000");
        this.shape.graphics.drawCircle(0,0,10);
        this.shape.graphics.endStroke();

        this.view.addChild(this.shape);
        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function tick(e){
        this.shape.scaleX = this.shape.scaleY +=0.01;
        this.shape.alpha -=0.03;
        if(this.shape.scaleX >= 3){
            this.shape.scaleX = this.shape.scaleY = 0;
            this.shape.alpha = 1;
        }
    }

    return Particles;

})();