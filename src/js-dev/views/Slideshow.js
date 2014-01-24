/* globals SlideNewyork:true */
/* globals SlideWenen:true */
/* globals SlideAthene:true */


var Slideshow = (function()
{

    var self;

    function Slideshow()
    {
        self = this;

        Slideshow.NEXT_SLIDE = "NEXT_SLIDE";

        this.currentSlide = 1;
        this.line = new createjs.Shape();
        this.view = new createjs.Container();

        /*this.bg = new createjs.Shape();
        this.bg.graphics.beginFill("#ec008c");
        this.bg.graphics.drawRect(0,0,window.innerWidth,window.innerHeight);
        this.bg.graphics.endFill();
        this.view.addChild(this.bg);*/

        this.menuNewyork = new createjs.Text("reis naar new york", "14px orator_stdregular", "#fff");
        this.menuNewyork.addEventListener("click", self.changeSlideHandler);
        this.menuNewyork.x = window.innerWidth/2-400-this.menuNewyork.getBounds().width/2;
        this.menuNewyork.y = window.innerHeight-90;
        this.view.addChild(this.menuNewyork);

        this.menuWenen = new createjs.Text("reis naar wenen", "14px orator_stdregular", "#fff");
        this.menuWenen.addEventListener("click", self.changeSlideHandler);
        this.menuWenen.x = window.innerWidth/2-this.menuWenen.getBounds().width/2;
        this.menuWenen.y = window.innerHeight-90;
        this.view.addChild(this.menuWenen);

        this.menuAthene = new createjs.Text("reis naar athene", "14px orator_stdregular", "#fff");
        this.menuAthene.addEventListener("click", self.changeSlideHandler);
        this.menuAthene.x = window.innerWidth/2+400-this.menuAthene.getBounds().width/2;
        this.menuAthene.y = window.innerHeight-90;
        this.view.addChild(this.menuAthene);

        this.menuNewyork.cursor = this.menuWenen.cursor = this.menuAthene.cursor = "pointer";

        this.currentSlideView = null;

        this.nextSlideHandler();
    }

    Slideshow.prototype.changeSlideHandler = function(e)
    {
        switch(e.currentTarget.text)
        {
            case "reis naar new york":
                self.currentSlide = 1;
                break;
            case "reis naar wenen":
                self.currentSlide = 2;
                break;
            case "reis naar athene":
                self.currentSlide = 3;
                break;
        }
    };

    Slideshow.prototype.nextSlideHandler = function()
    {
        if(self.currentSlideView != null){
            bean.off(self.currentSlideView,Slideshow.NEXT_SLIDE, self.nextSlideHandler);
            self.view.removeChild(self.currentSlideView.view);
            self.currentSlideView = null;
        }

        switch(self.currentSlide)
        {
            case 1:
                self.currentSlideView = new SlideNewyork();
                lineHandler(self.menuNewyork);
                self.currentSlide++;
                break;
            case 2:
                self.currentSlideView = new SlideWenen();
                lineHandler(self.menuWenen);
                self.currentSlide++;
                break;
            case 3:
                self.currentSlideView = new SlideAthene();
                lineHandler(self.menuAthene);
                self.currentSlide = 1;
                break;
        }

        self.view.addChild(self.currentSlideView.view);
        self.currentSlideView.animateIn();
        bean.on(self.currentSlideView,Slideshow.NEXT_SLIDE, self.nextSlideHandler);
    };

    function lineHandler(item)
    {
        if(self.line){
            self.line.graphics.clear();
        }
        self.line.graphics.beginFill("#fff");
        self.line.graphics.drawRect(item.x,item.y + 20,item.getBounds().width,1);
        self.line.graphics.endFill();
        self.view.addChild(self.line);
    }

    return Slideshow;

})();