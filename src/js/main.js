(function(){

var Util = (function(){

    function Util(){

    }

    Util.api = "http://localhost:8888/devine/MAV/klara/api/";

    return Util;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 19:02
 * To change this template use File | Settings | File Templates.
 */

/* globals Util:true */

var App = (function(){

    function App($sourceElement){
        _.bindAll(this); // this altijd slaat op deze klasse
        this.$sourceElement = $sourceElement;

        $.getJSON(Util.api + '/programma')
         .done(function(data){
            console.log(data);
         });

        $.getJSON(Util.api + '/nummer')
            .done(function(data){
                console.log(data);
            });

        $.getJSON(Util.api + '/playlist')
            .done(function(data){
                console.log(data);
            });
    }

   /* Main.prototype.init = function(){
        polls = new Polls(this.$sourceElement);
        bean.on(polls,"get_poll", this.getPoll);
        polls.load();
    };

    Main.prototype.getPoll = function(poll_id){
        var poll_data = _.findWhere(polls.data, {id:poll_id});
        poll = new Poll(poll_data);

        overview = new Overview(this.$sourceElement);

        bean.on(poll, "get_question", this.getQuestion);
        bean.on(poll, "show_overview", this.showOverview);

        poll.getQuestion();
    };

    Main.prototype.showOverview = function(){
        overview.init();
    };

    Main.prototype.getQuestion = function(question_id){
        question = new Question(this.$sourceElement);
        bean.on(question, "next_question",this.nextQuestion);
        question.load(question_id);
    };

    Main.prototype.nextQuestion = function(filledInAnswer){
        overview.addFilledInAnswer(filledInAnswer);
        poll.getQuestion();
    };*/

    return App;
})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 17:37
 * To change this template use File | Settings | File Templates.
 */

/* globals App:true */
var app = new App($("#container"));
//app.init();


/*$.getJSON("http://services.vrt.be/playlist/onair?channel_code=31&accept=application%2Fvnd.playlist.vrt.be.noa_1.0%2Bjson&callback=?")
    .done(function(data){
        console.log(data);
    });*/


})();