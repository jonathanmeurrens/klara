/* globals gameData:true  */

var CampaignScreen = (function(){

    var self;

    function CampaignScreen(){
        self = this;
        this.view = new createjs.Container();
        var text = new createjs.Text("CAMPAIGN SCREEN","22px Arial", "#000000");
        text.x = stage.canvas.width/2 - 120;
        text.y = stage.canvas.height/2 - 15;
        this.view.addChild(text);
    }

    return CampaignScreen;

})();