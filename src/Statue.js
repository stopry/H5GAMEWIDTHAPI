//神像操作类
var Statue = (function(){
    //params——神像-是否激活-经验值-介绍框-神像索引
    function Statue(statue,isActive,experience,index){
        this.statue = statue;
        this.isActive = isActive;
        this.experience = experience;
        //this.desp = desp;
        this.index = index+1;
        this.loadStatue();
        // this.statue.on(Laya.Event.MOUSE_DOWN,this,this.showStatueDesp);

        // this.statue.on(Laya.Event.MOUSE_DOWN,this,this.showStatueDesp);

        // Laya.stage.on(Laya.Event.MOUSE_UP,this,this.hideStatueDesp);
        this.statue.on("click",this,this.clickhandler);
    };
    var _proto = Statue.prototype;
    _proto.loadStatue = function(){
        //皮肤设置
        this.statue.skin = !this.isActive?"ui/statue_"+this.index+"_0.png":"ui/statue_"+this.index+"_1.png";
        //经验条设置
        //this.desp.getChildByName("activeProgress").value = this.experience;
        //this.setDespData();
    };
    _proto.clickhandler = function(e){
        LayaSample.newFunTip.showThis()
        // LayaSample.littleTip.showThis("新功能即将开放，敬请期待！");
        console.log("发生点击");
    }
    _proto.setDespData = function(){
        // if(this.index==1){
        //     if(this.isActive){
        //         this.desp.getChildByName("title").text = "弑草之神(已激活)";
        //         this.desp.getChildByName("isActive").text = "神像已激活";
        //     }else{
        //         this.desp.getChildByName("title").text = "弑草之神(未激活)";
        //         this.desp.getChildByName("isActive").text = "神像未激活";
        //     }
        // }else if(this.index==2){
        //     if(this.isActive){
        //         this.desp.getChildByName("title").text = "屠虫之神(已激活)";
        //         this.desp.getChildByName("isActive").text = "神像已激活";
        //     }else{
        //         this.desp.getChildByName("title").text = "屠虫之神(未激活)";
        //         this.desp.getChildByName("isActive").text = "神像未激活";
        //     }
        // }else if(this.index==3){
        //     if(this.isActive){
        //         this.desp.getChildByName("title").text = "雨露之神(已激活)";
        //         this.desp.getChildByName("isActive").text = "神像已激活";
        //     }else{
        //         this.desp.getChildByName("title").text = "雨露之神(未激活)";
        //         this.desp.getChildByName("isActive").text = "神像未激活";
        //     }
        // }else if(this.index==4){
        //     if(this.isActive){
        //         this.desp.getChildByName("title").text = "丰收之神(已激活)";
        //         this.desp.getChildByName("isActive").text = "神像已激活";
        //     }else{
        //         this.desp.getChildByName("title").text = "丰收之神(未激活)";
        //         this.desp.getChildByName("isActive").text = "神像未激活";
        //     }
        // }
    }
    //显示神像介绍
    _proto.showStatueDesp = function(){
        // TIMER = new Date().getTime();
        // console.log(TIMER);
        //Laya缓动动画——操作对新-属性列表-执行时间-动画效果-回调
        //Laya.Tween.to(this.desp,{scaleX:1,scaleY:1},300,null,null);
    }
    //隐藏神像介绍
    _proto.hideStatueDesp = function(){
        // var timeEnd = new Date().getTime();
        // if(timeEnd-HOLD_TIME>TIMER){
        //     this.statue.on(Laya.Event.MOUSE_UP,this,this.showStatueDesp);
        // }else{
        //     this.statue.off(Laya.Event.MOUSE_UP,this,this.showStatueDesp);
        // }
        //Laya.Tween.to(this.desp,{scaleX:0,scaleY:0},150,null,null);
    }
    return Statue;
})()