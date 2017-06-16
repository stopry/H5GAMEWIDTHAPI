var Top = (function(_super){
    function Top(){
        Top.super(this);
        this.init();
        this.isPlay = false;
    }
    Laya.class(Top,"Top",_super);
    var _proto = Top.prototype;

    _proto.init = function(){
        stopMusic();
        this.bgShoudBtn.on('click',this,this.MusicCtr);
        this.kehu.on('click',this,this.showKF);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.hideKF);
    }
    //背景音乐控制
    _proto.MusicCtr = function(){
        if(this.isPlay){
            this.bgShoudBtn.skin = "createRole/stop_music.png";
            this.music_play.stop();
            stopMusic();
            this.isPlay = false;
        }else{
           this.bgShoudBtn.skin = "createRole/play_music.png";
           this.music_play.play(0,true);
           playMusic();
           this.isPlay = true;
        }
    }
    //显示客户
    _proto.showKF = function(){
        Laya.Tween.to( this.kehuQQ,{scaleY:1,scaleX:1},300,null,null);
    }
    //隐藏客户
    _proto.hideKF = function(){
        Laya.Tween.to( this.kehuQQ,{scaleY:0,scaleX:0},300,null,null);
    }
    return Top;
})(ui.TopUI)