/* globals SlideNewyork:true */
/* globals SlideWenen:true */
/* globals SlideAthene:true */


var Slideshow = (function()
{

    var self;

    function Slideshow()
    {
        self = this;

        this.currentSlide = 1;
        this.line = new createjs.Shape();
        this.view = new createjs.Container();

        this.bg = new createjs.Shape();
        this.bg.graphics.beginFill("#ec008c");
        this.bg.graphics.drawRect(0,0,window.innerWidth,window.innerHeight);
        this.bg.graphics.endFill();
        this.view.addChild(this.bg);

        this.menuNewyork = new createjs.Text("reis naar new york", "normal 14px Arial", "#fff");
        this.menuNewyork.addEventListener("click", self.changeSlideHandler);
        this.menuNewyork.x = window.innerWidth/2-400-this.menuNewyork.getBounds().width/2;
        this.menuNewyork.y = window.innerHeight-50;
        this.view.addChild(this.menuNewyork);

        this.menuWenen = new createjs.Text("reis naar wenen", "normal 14px Arial", "#fff");
        this.menuWenen.addEventListener("click", self.changeSlideHandler);
        this.menuWenen.x = window.innerWidth/2-this.menuWenen.getBounds().width/2;
        this.menuWenen.y = window.innerHeight-50;
        this.view.addChild(this.menuWenen);

        this.menuAthene = new createjs.Text("reis naar athene", "normal 14px Arial", "#fff");
        this.menuAthene.addEventListener("click", self.changeSlideHandler);
        this.menuAthene.x = window.innerWidth/2+400-this.menuAthene.getBounds().width/2;
        this.menuAthene.y = window.innerHeight-50;
        this.view.addChild(this.menuAthene);

        this.menuNewyork.cursor = this.menuWenen.cursor = this.menuAthene.cursor = "pointer";

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
        switch(self.currentSlide)
        {
            case 1:
                var slideNewyork = new SlideNewyork();
                self.view.addChild(slideNewyork.view);
                slideNewyork.animateIn();
                lineHandler(self.menuNewyork);
                self.currentSlide++;
                break;
            case 2:
                var slideWenen = new SlideWenen();
                self.view.addChild(slideWenen.view);
                slideWenen.animateIn();
                lineHandler(self.menuWenen);
                self.currentSlide++;
                break;
            case 3:
                var slideAthene = new SlideAthene();
                self.view.addChild(slideAthene.view);
                slideAthene.animateIn();
                lineHandler(self.menuAthene);
                self.currentSlide = 1;
                break;
        }
    };

    function lineHandler(item)
    {
        if(self.line){
            self.line.graphics.clear();
        }
        self.line.graphics.beginFill("#fff");
        self.line.graphics.drawRect(item.x,item.y + 12,item.getBounds().width,1);
        self.line.graphics.endFill();
        self.view.addChild(self.line);
    }

    return Slideshow;

})();