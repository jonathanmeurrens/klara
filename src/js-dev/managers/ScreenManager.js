/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 16/01/14
 * Time: 19:31
 * To change this template use File | Settings | File Templates.
 */

/* globals CampaignScreen:true */

var ScreenManager = function(){};

ScreenManager.CAMPAIGN_INFO = "CAMPAIGN_INFO";
ScreenManager.currentScreen = null;

ScreenManager.showScreen = function(screenType){

    ScreenManager.removeCurrentScreen();
    if(screenType === ScreenManager.CAMPAIGN_INFO){
        console.log("[ScreenManager] ");
        ScreenManager.currentScreen = new CampaignScreen();
    }
    stage.addChild(ScreenManager.currentScreen.view);
};

ScreenManager.removeCurrentScreen = function(){
    if(ScreenManager.currentScreen != null){
        stage.removeChild(ScreenManager.currentScreen.view);
        ScreenManager.currentScreen = null;
    }
};
