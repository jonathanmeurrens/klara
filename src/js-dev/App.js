/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:02
 * To change this template use File | Settings | File Templates.
 */

/* globals Util:true */
/* globals $jit:true */
/* globals AppModel:true */
/* globals MyMap:true */

var appModel;

var App = (function(){

    function App($sourceElement){
        _.bindAll(this); // this altijd slaat op deze klasse
        /*this.$sourceElement = $sourceElement;*/

        appModel = new AppModel();
        appModel.getPlaylist();

        this.map = new MyMap();
    }

    return App;
})();