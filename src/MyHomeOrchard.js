//我的家园操作类
var MyHome = (function(){
    function MyHome(myHomeBtn,homeMenuBox,isHomeMenuBoxActive,showRotate,hideRotate){
        this.myHomeBtn = myHomeBtn;//我的家园按钮
        this.homeMenuBox = homeMenuBox;//我的家园菜单
        this.isHomeMenuBoxActive = isHomeMenuBoxActive;//菜单是否激活状态
        this.showRotate = showRotate;//显示时的角度
        this.hideRotate = hideRotate;//隐藏时的角度

        this.init();
    }
    var _proto = MyHome.prototype;
    _proto.init = function(){
        this.getToken();
        this.myHomeBtn.on(Laya.Event.CLICK,this,this.showMyfamMenu);
        this.homeMenuBox.getChildByName("shop").on(Laya.Event.CLICK,this,this.showShopBox);
        this.homeMenuBox.getChildByName("userCenter").on(Laya.Event.CLICK,this,this.toUserCenter);
        this.homeMenuBox.getChildByName("entrepot").on(Laya.Event.CLICK,this,this.showEnterPotBox);
        this.homeMenuBox.getChildByName("exchange").on("click",this,this.showEXCenter);
    }
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //显示隐藏菜单
    _proto.showMyfamMenu = function(){
        if(!this.isHomeMenuBoxActive){
        //Laya缓动动画——操作对新-属性列表-执行时间-动画效果-回调
            Laya.Tween.to(this.homeMenuBox,{rotation:this.showRotate},500,Laya.Ease.backOut,null);
        }else{
            Laya.Tween.to(this.homeMenuBox,{rotation:this.hideRotate},500,Laya.Ease.backOut,null);
        }
        //重置状态
        this.isHomeMenuBoxActive = !this.isHomeMenuBoxActive
    }
    //显示商店弹出窗
    _proto.showShopBox = function(){
        if(!LayaSample.shop){
            LayaSample.shop = new Shop();
        }
        Laya.stage.addChild(LayaSample.shop);
        LayaSample.farm.alertLayer.visible = true;
        Laya.Tween.to(LayaSample.shop,{scaleY:1,scaleX:1},200,null,null);
        this.showMyfamMenu();
    };
    //显示仓库弹窗
    _proto.showEnterPotBox = function(){
        if(!LayaSample.enterPot){
            LayaSample.enterPot = new EnterPot();
        }
        Laya.stage.addChild(LayaSample.enterPot);
        LayaSample.enterPot.showThis();
        LayaSample.farm.alertLayer.visible = true;
        this.showMyfamMenu();
    }
    //显示兑换中心弹窗-改为邀请好友
    _proto.showEXCenter = function(){
        if(!ISGIVE){
            LayaSample.greenHandGuide.done();//进入推广页面 完成所有新手引导
            ISGIVE = true;
        }

        /*
        if(!LayaSample.shareAlert){
            LayaSample.shareAlert = new ShareAlert();
        }
        Laya.stage.addChild(LayaSample.shareAlert);
        LayaSample.shareAlert.showThis();
        */
        var toUrl = centerUrl+"/dispense.html?toUrl=tuiguang.html";
        skipToUrl(toUrl);
        return;
        
        // LayaSample.littleTip.showThis("功能开发中");
        // if(!LayaSample.exchangeCenter){
        //     LayaSample.exchangeCenter = new ExchangeCenter();
        // }
        // Laya.stage.addChild(LayaSample.exchangeCenter);
        // LayaSample.exchangeCenter.showThis();
        this.showMyfamMenu();
    }
    _proto.toUserCenter = function(){
        var toUrl = centerUrl+"/dispense.html?toUrl=grzx.html";
        skipToUrl(toUrl);
    }
    //显示装扮弹出窗
    _proto.showDecorateBox = function(){
        if(!LayaSample.decorate){
            LayaSample.decorate = new Decorate();
        }
        Laya.stage.addChild(LayaSample.decorate);
        LayaSample.farm.alertLayer.visible = true;
        LayaSample.decorate.showThis();
        this.showMyfamMenu();
    }
    return MyHome;
})()

//我的果园操作类
var MyOrchard = (function(){
    function MyOrchard(myHomeBtn,homeMenuBox,isHomeMenuBoxActive,showRotate,hideRotate){
        this.myHomeBtn = myHomeBtn;//我的家园按钮
        this.homeMenuBox = homeMenuBox;//我的家园菜单
        this.isHomeMenuBoxActive = isHomeMenuBoxActive;//菜单是否激活状态
        this.showRotate = showRotate;//显示时的角度
        this.hideRotate = hideRotate;//隐藏时的角度
        this.init();
    }
    var _proto = MyOrchard.prototype;
    //显示菜单方法继承自我的家园部分
    _proto.showMyOrchardMenu = MyHome.prototype.showMyfamMenu;
    _proto.init = function(){
        this.myHomeBtn.on(Laya.Event.CLICK,this,this.showMyOrchardMenu);
    }
    return MyOrchard;
})()