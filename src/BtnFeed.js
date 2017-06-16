//按钮点击反馈类
var BtnFeed = (function(){
    // params——操作对象-回调
    function BtnFeed(obj,backEdHd){
        this.obj = obj;
        this.backEdHd = backEdHd||void(0);
        this.clickEnd = function(){
            Laya.timer.once(0,this,this.reset);
        };
        this.reset = function(){
            Laya.Tween.to(this.obj,{scaleY:1,scaleX:1},10,Laya.Ease.backIn,Laya.Handler.create(this,this.backEdHd));
        }
        this.init = function(){
            Laya.Tween.to(this.obj,{scaleY:1.05,scaleX:1.05},100,Laya.Ease.backOut,Laya.Handler.create(this,this.clickEnd));
        }
        this.obj.on(Laya.Event.CLICK,this,this.init);
    }
    return BtnFeed;
})();

var FarmBtn = (function(){
    // params——操作对象-回调
    function FarmBtn(arr){
        this.arr = arr;
        for(var i = 0;i<this.arr.length;i++){
            new BtnFeed(this.arr[i]);  
        }
    }
    return FarmBtn;
})();