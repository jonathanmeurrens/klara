/* globals gameData:true  */
/* globals Slideshow:true  */

var CampaignScreen = (function(){

    var self;

    function CampaignScreen(){
        self = this;
        this.view = new createjs.Container();
        /*var text = new createjs.Text("CAMPAIGN SCREEN","22px Arial", "#000000");
        text.x = stage.canvas.width/2 - 120;
        text.y = stage.canvas.height/2 - 15;
        this.view.addChild(text);*/

        setTimeout(showSlideshow, 300);

    }

    function showSlideshow(){
        self.slideshow = new Slideshow();
        self.view.addChild(self.slideshow.view);
        //stage.addEventListener("NEXT_SLIDE", this.slideshow.nextSlideHandler);
    }

    CampaignScreen.prototype.willBeRemoved = function(){
        //stage.removeEventListener("NEXT_SLIDE", self.slideshow.nextSlideHandler);
        self.view.removeChild(self.slideshow);
        self.slideshow = null;
    };

    return CampaignScreen;

})();