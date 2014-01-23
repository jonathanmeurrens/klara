var Button = (function(){

    var self;

    function Button(button_type){

        self = this;

        this.view = new createjs.Container();

        var url = 'assets/buttons/' + button_type.toLowerCase()+".png";

        this.width = 50;
        this.height = 50;

        if(button_type === Button.FACEBOOK || button_type === Button.TWITTER){
            this.width = 23;
            this.height = 23;
        }

        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        this.btn = new createjs.Bitmap(preload.getResult(url));
        this.view.addChild(this.btn);
        this.btn.regX = this.width/2;
        this.btn.regY = this.height/2;

        this.btn.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.07, scaleY:1.07},  100);
        });
        this.btn.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });

        this.view.cursor = 'pointer';
        this.btn.scaleX = 0.7;
        this.btn.scaleY = 0.7;
        createjs.Tween.get(this.btn).to({scaleX:1, scaleY:1},  1400, createjs.Ease.elasticOut);
    }

    return Button;

})();

// BUTTON TYPES
Button.FACEBOOK = "FACEBOOK";
Button.TWITTER = "TWITTER";