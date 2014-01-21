var UserModel = (function(){

    function UserModel(){

        UserModel.COOKIE_NAME = "KLARA_REIS";
        UserModel.PROGRESS_CHANGED = "PROGRESS_CHANGED";

        this.progress = 0;
        this.songs = [];

        /*eraseCookie(UserModel.COOKIE_NAME);
        var cookie = JSON.parse(readCookie(UserModel.COOKIE_NAME));
        if(cookie != null){
            this.setProgress(cookie.progress);
        }*/
    }

    UserModel.prototype.save = function(){
        createCookie(UserModel.COOKIE_NAME,JSON.stringify(this),365);
    };

    function createCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)===' '){
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) === 0){
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,"",-1);
    }

    UserModel.prototype.setProgress = function(progress){
        this.progress = progress;
        bean.fire(this,UserModel.PROGRESS_CHANGED);
        this.save();
    };

    return UserModel;
})();