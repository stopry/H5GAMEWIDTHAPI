//狗
var Dog = (function(){
    function Dog(type,state,dogBox){
        this.type = type;//狗类型-1 2 3 4 土狗 哈士奇 金毛 藏獒
        this.state = state;//狗状态-0 1 饥饿 激活 
        this.dogBox = dogBox;//狗容器

        this.init();
    }
    var _proto = Dog.prototype;
    _proto.init = function(){
        this.setDogUI();
    };
    //设置狗的显示ui
    _proto.setDogUI = function(){
        console.log(this.type,this.state);
        for(var i = 1;i<5;i++){
            this.dogBox.getChildByName('type_'+i+'state_'+0).visible = false;
            this.dogBox.getChildByName('type_'+i+'state_'+0).stop();
            this.dogBox.getChildByName('type_'+i+'state_'+1).visible = false;
            this.dogBox.getChildByName('type_'+i+'state_'+1).stop();
        }
        this.dogBox.getChildByName('type_'+this.type+'state_'+this.state).visible = true;
        this.dogBox.getChildByName('type_'+this.type+'state_'+this.state).play(0,true);
    }
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    return Dog;
})();
//动画小狗
var Dogs = (function(_super){
    function Dogs(dogAttr){
        Dogs.super(this);
        this.dogAttr = dogAttr;//狗的属性
        this.init();
    }
    Laya.class(Dogs,'Dogs',_super);
    var _proto = Dogs.prototype;
    _proto.init = function(){
        this.pos(440,390);
        this.dog = new Dog(this.dogAttr.type,this.dogAttr.status,this.dog_box);
    };
    return Dogs;
})(ui.DogsUI);

//狗屋弹出层
var DogShop = (function(_super){
    function DogShop(){
        DogShop.super(this);
        this.init();
        this.isLoading = false;
    }
    Laya.class(DogShop,'DogShop',_super);
    var _proto = DogShop.prototype;
    _proto.init = function(){
        this.getToken();
        this.setBtnFeed();
        this.closeBtn.on('click',this,this.hideThis);
        this.feedDog.on('click',this,this.toFeedDog);
        this.ex_hsq.on('click',this,this.buyDog,[2]);//购买哈士奇
        this.ex_jm.on('click',this,this.buyDog,[3]);//购买金毛
        this.ex_za.on('click',this,this.buyDog,[4]);//购买藏獒
        this.ex_gl.on('click',this,this.buyFood);//购买狗粮
    };
    _proto.setBtnFeed = function(){
        new BtnFeed(this.closeBtn);
        new BtnFeed(this.feedDog);
        new BtnFeed(this.ex_hsq);
        new BtnFeed(this.ex_jm);
        new BtnFeed(this.ex_za);
        new BtnFeed(this.ex_gl);
        this.setStyle();
    }
    //界面显示设置
    _proto.setUI = function(type,hunPro){
        this.dog_pic.skin = "add/nowDog_"+type+".png";
        this.dog_name.skin = "add/dogName_"+type+".png";
        this.hunger_progress.value = hunPro/500;
        this.now_hun_prg.text = hunPro;
    }
    //饥饿度显示
    _proto.showHunPrg = function(){
        this.hunger_progress.value = 200/500;
        this.now_hun_prg.text = 200;
    }
    //喂食
    _proto.toFeedDog = function(){
        if(this.isLoading){
            LayaSample.littleTip.showThis('喂食频繁请稍后再喂！');
            return;
        }
        this.layer.visible = true;
        var that = this;
        var feedTips =  new TipDialog("给狗喂食","确定给狗喂食一袋狗粮吗,将增加狗100饥饿度!",function(){
           that.isLoading = true;
            Http.get('/api/game/dog/feed',null,function(datas){
                that.isLoading = false;
                if(!datas.success){
                    LayaSample.littleTip.showThis(datas.msg);
                    return;
                }
                LayaSample.littleTip.showThis('喂狗成功,狗增加了100点饥饿度。');
                Http.get("/api/game/loadPlayer",null,function(result){
                    if(!result.success){
                        LayaSample.littleTip.showThis(result.msg);
                    }
                    LayaSample.dogShop.setUI(result.obj.dog.type,result.obj.dog.hunger);//更新狗商店

                    LayaSample.dogs.dog.type = result.obj.dog.type;
                    LayaSample.dogs.dog.state = result.obj.dog.status;
                    LayaSample.dogs.dog.setDogUI();
                    LayaSample.farm.dogSpeak.visible = false;
                },["Authorization",that.token]);
            },["Authorization",that.token]);
            that.layer.visible = false;
        },function(){
            LayaSample.farm.alertLayer.visible = true;
            that.layer.visible = false;
        });
        Laya.stage.addChild(feedTips);
        feedTips.showThis();
        // Laya.Tween.to(feedTips,{scaleY:1,scaleX:1},200,null,null);
    };
    //买狗
    _proto.buyDog = function(type){
        var that = this;
        this.layer.visible = true;
        var tipson = ''

        if(type==2){
            tipson="确定用5000稻谷兑换哈士奇吗，兑换后将替换当前的狗！"
        }else if(type==3){
            tipson="确定用20000稻谷兑换金毛吗，兑换后将替换当前的狗！"
        }else if(type==4){
            tipson="确定用50000稻谷兑换藏獒吗，兑换后将替换当前的狗！"
        }

        var buyTips = new TipDialog('',tipson,function(){
            Http.get('/api/game/dog/up',{type:type},function(datas){
                if(!datas.success){
                    LayaSample.littleTip.showThis(datas.msg);
                    return
                }
                LayaSample.littleTip.showThis('兑换成功');
                that.layer.visible = false;
                Http.get("/api/game/loadPlayer",null,function(result){
                    if(!result.success){
                        LayaSample.littleTip.showThis(result.msg);
                    }
                    LayaSample.dogShop.setUI(result.obj.dog.type,result.obj.dog.hunger);
                    LayaSample.header.loadHeaderDatas(result.obj);

                    LayaSample.dogs.dog.type = result.obj.dog.type;
                    LayaSample.dogs.dog.state = result.obj.dog.status;
                    LayaSample.dogs.dog.setDogUI();

                },["Authorization",that.token]);
            },["Authorization",that.token]);
        },function(){
            LayaSample.farm.alertLayer.visible = true;
            that.layer.visible = false;
        });
        Laya.stage.addChild(buyTips);
        buyTips.showThis();
        // Laya.Tween.to(buyTips,{scaleY:1,scaleX:1},200,null,null);
    };
    //买狗粮
    _proto.buyFood = function(){
         if(this.isLoading){
            LayaSample.littleTip.showThis('购买频繁请稍后再买！');
            return;
        }
        var that = this;
        this.layer.visible = true;
        var foodTips = new TipDialog('','确定用100稻谷兑换一袋狗粮吗',function(){
             that.isLoading = true;
             Http.get('/api/game/dog/buyDogfood',null,function(datas){
                that.isLoading = false;
                if(!datas.success){
                    LayaSample.littleTip.showThis(datas.msg);
                    return
                }
                LayaSample.littleTip.showThis('兑换成功');
                Http.get("/api/game/loadPlayer",null,function(result){
                    if(!result.success){
                        LayaSample.littleTip.showThis(result.msg);
                    }
                    LayaSample.dogShop.setUI(result.obj.dog.type,result.obj.dog.hunger);
                    LayaSample.header.loadHeaderDatas(result.obj);
                },["Authorization",that.token]);
            },["Authorization",that.token]);
        },function(){
            LayaSample.farm.alertLayer.visible = true;
            that.layer.visible = false;
        });
        Laya.stage.addChild(foodTips);
        foodTips.showThis();
        // Laya.Tween.to(foodTips,{scaleY:1,scaleX:1},200,null,null);
    }
    _proto.setStyle = function(){
        this.zOrder = 99;
        this.stageWidth = Laya.stage.width;
        this.stageHeight = Laya.stage.height;
        this.pivot(this.width/2,this.height/2);
        this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        this.visible = false;
        // this.scale(0,0);
        // console.log(this.height);    
    }
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    _proto.sheFunc = function(){
        this.dogDia = new DogDia();
    }
    //显示自己
    _proto.showThis = function(){
        this.visible = true;
        LayaSample.farm.alertLayer.visible = true;
        // Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
        // Laya.timer.once(1000,this,this.setUI);
    }
    //隐藏自己
    _proto.hideThis = function(){
        this.visible = false;
        // Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
        LayaSample.farm.alertLayer.visible = false;
    }
    return DogShop;
})(ui.DogShopUI);