//提示弹出框
var TipDialog = (function(_super){
    function TipDialog(_tipTitle,_tipCon,callBack,cancelCallBack){
        TipDialog.super(this);
        // this.stageWidth = Laya.stage.width;
        // this.stageHeight = Laya.stage.height;
        // this.anchorY = 0.5;
        // this.anchorX = 0.5;
        // this.scaleX = 0;
        // this.scaleY = 0;
        // this.left = (this.stageWidth-this.width)/2;
        // this.top = (this.stageHeight-this.height)/2;
        this._tipTitle = _tipTitle;//标题
        this._tipCon = _tipCon;//内容
        this.callBack = callBack;//回调
        this.cancelCallBack = cancelCallBack||function(){};//取消回调;
        this.zOrder = 99;
        this.init();
    }
    Laya.class(TipDialog,"TipDialog",_super);
    var _proto = TipDialog.prototype;
    _proto.init = function(){
        this.pivot(this.width/2,this.height/2);
        this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        // this.scale(0,0);
        this.visible = false;
        new BtnFeed(this.confirmBtn);
        new BtnFeed(this.cancelBtn);
        this.tipTitle.text = this._tipTitle;//设置标题
        this.tipCon.text = this._tipCon;//设置内容
        this.confirmBtn.on(Laya.Event.CLICK,this,this.toUI);
        this.cancelBtn.on(Laya.Event.CLICK,this,this.closeThis);
    }
    //界面跳转
    _proto.toUI = function(){
        this.closeThis();
        this.callBack();
    }
    //显示弹窗
    _proto.showThis = function(){
        this.visible = true;
        LayaSample.farm.alertLayer.visible = true;
        // Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
    }
    //关闭弹窗
    _proto.closeThis = function(){
        this.visible = false;
        // Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
        // if(LayaSample.recharge){
        //     LayaSample.recharge.alertLayer.visible = false;//关闭充值弹出窗遮罩层
        // }
        LayaSample.farm.alertLayer.visible = false;
        this.cancelCallBack();//执行取消回调
    }
    return TipDialog;
})(ui.TipDialogUI);
//水稻生长信息提示
var SeedInfo = (function(_super){
    function SeedInfo(){
        SeedInfo.super(this);
        this.zOrder = 100
        this.init();
    }
    Laya.class(SeedInfo,"SeedInfo",_super);
    var _proto = SeedInfo.prototype;
    _proto.init = function(){
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.scaleX = 0;
        this.scaleY = 0;
    };
    //名字，状态，进入下一阶段时间，进度条值
    _proto.showThis = function(name,status,time,progress){
        this.seedInfo.getChildByName("seedName").text = name+"("+status+")";
        this.seedInfo.getChildByName("seedDesc").text = time;
        this.seedInfo.getChildByName("grouProgress").value = progress;
        Laya.Tween.to(this,{scaleY:1,scaleX:1},150,Laya.Ease.null,null);
    }
    _proto.hideThis = function(){
        Laya.Tween.to(this,{scaleY:0,scaleX:0},150,Laya.Ease.null,null);
    }
    return  SeedInfo;
})(ui.SeedInfoUI);
//赠送果实弹窗
// var GiveSeed = (function(_super){
//     function GiveSeed(_tipTitle,userInfo,callBack,cancelCallBack){
//         GiveSeed.super(this);
//         // this.stageWidth = Laya.stage.width;
//         // this.stageHeight = Laya.stage.height;
//         // this.anchorY = 0.5;
//         // this.anchorX = 0.5;
//         // this.scaleX = 0;
//         // this.scaleY = 0;
//         // this.left = (this.stageWidth-this.width)/2;
//         // this.top = (this.stageHeight-this.height)/2;
//         this._tipTitle = _tipTitle;//标题
//         this.userInfo = userInfo;//用户信息
//         this.callBack = callBack;//确定回调
//         this.cancelCallBack = cancelCallBack||function(){};//取消回调;
//         this.init();
//     }
//     Laya.class(GiveSeed,"GiveSeed",_super);
//     var _proto = GiveSeed.prototype;
//     _proto.init = function(){
//         var that = this;
//         this.getToken();
//         //得到种子总数
        
//         /*Http.get("/api/game/getPlayerItemDetailByType",{type:"02"},function(data){
//             var littleTips = new LittleTip();
//             that.addChild(littleTips);
//             if(!data.success){
//                 littleTips.showThis(data.msg);
//                 return;
//             }
//             var data = data.obj;
//             if(!data.length) {
//                 that.max = 0;
//                 return
//             };
//             if(!data[0].cnt){
//                 that.max = 0;
//             }else{
//                 that.max = parseInt(data[0].cnt||0);
//             }
//         },["Authorization",that.token]);*/


//         this.pivot(this.width/2,this.height/2);
//         this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
//         this.scale(0,0);
//         new BtnFeed(this.confirmBtn);
//         new BtnFeed(this.cancelBtn);
//         new BtnFeed(this.reduceBtn);
//         new BtnFeed(this.addBtn);
//         new BtnFeed(this.selMax);
//         this.title.text = this._tipTitle;//设置标题
//         //用户信息设置 
//         this.userPic.skin = "createRole/head_"+this.userInfo.pic+".png"
//         this.nickName.text = this.userInfo.nickname;
//         this.level.text = "LV."+this.userInfo.level;
//         this.confirmBtn.on(Laya.Event.CLICK,this,this.toUI);
//         this.cancelBtn.on(Laya.Event.CLICK,this,this.closeThis);
//         this.reduceBtn.on("click",this,this.reduceNum);
//         this.addBtn.on("click",this,this.addNum);
//         this.selMax.on("click",this,this.setMax);
//     }
//     //得到token
//     _proto.getToken = function(){
//         if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
//             LayaSample.littleTip.showThis("获取token失败，请重新登录");
//             return;
//         }
//         this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
//     }
//     //界面跳转
//     _proto.toUI = function(){
//         if(this.giveNum.text>5000000||this.giveNum.text<10){
//             LayaSample.littleTip.showThis('数量需在10-5000000之间');
//             return;
//         }
//         this.closeThis();
//         this.callBack();
//     }
//     //得到最大数
//     _proto.setMax = function(){
//         var that = this;
//         Http.get("/api/game/getPlayerItemDetailByType",{type:"02"},function(data){
//             var littleTips = new LittleTip();
//             that.addChild(littleTips);
//             if(!data.success){
//                 littleTips.showThis(data.msg);
//                 return;
//             }
//             var data = data.obj;
//             if(!data.length) {
//                 that.max = 0;
//                 return
//             };
//             if(!data[0].cnt){
//                 that.max = 0;
//             }else{
//                 that.max = parseInt(data[0].cnt||0);
//             }
//             if(that.max>5000000){
//                 that.max = 50000000;
//             }
//             that.giveNum.text = that.max;
//         },["Authorization",that.token]);
//     }
//     //增加赠送数量
//     _proto.addNum = function(){
//         if(this.giveNum.text>=this.max||this.giveNum.text>=5000000) return;
//         this.giveNum.text = parseInt(this.giveNum.text)+1;
//     }
//     //减少数量
//     _proto.reduceNum = function(){
//         if(this.giveNum.text<=10) return;
//         this.giveNum.text = parseInt(this.giveNum.text)-1;
//     }
//     //显示弹窗
//     _proto.showThis = function(){
//         LayaSample.farm.alertLayer.visible = true;
//         Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
//         this.TipsAni.play(0,false);
//         var that = this;
//         Http.get("/api/game/getPlayerItemDetailByType",{type:"02"},function(data){
//             var littleTips = new LittleTip();
//             that.addChild(littleTips);
//             if(!data.success){
//                 littleTips.showThis(data.msg);
//                 return;
//             }
//             var data = data.obj;
//             if(!data.length) {
//                 that.max = 0;
//                 that.giveNum.text = 0;
//                 return
//             };
//             if(!data[0].cnt){
//                 that.max = 0;
//                 that.giveNum.text = 0;
//             }else{
//                 that.max = parseInt(data[0].cnt||0);
//                 that.giveNum.text = parseInt(data[0].cnt||0);
//             }
//             if(data[0].cnt<50&&data[0].cnt){
//                 that.giveNum.text = data[0].cnt;
//             }else{
//                 that.giveNum.text = 50;
//             }
//         },["Authorization",that.token]);
//     }
//     //关闭弹窗
//     _proto.closeThis = function(){
//         Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
//         if(LayaSample.recharge){
//             LayaSample.recharge.alertLayer.visible = false;//关闭充值弹出窗遮罩层
//         }
//         LayaSample.farm.alertLayer.visible = false;
//         this.cancelCallBack();//执行取消回调
//     }
//     return GiveSeed;
// })(ui.GiveSeedUI)
//长按物品信息提示
var ArticleDesc = (function(_super){
    function ArticleDesc(){
        ArticleDesc.super(this);
        this.zOrder = 120;
        this.init();
    }
    Laya.class(ArticleDesc,"ArticleDesc",_super);
    var _proto = ArticleDesc.prototype;
    _proto.init = function(){
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.scaleX = 0;
        this.scaleY = 0;
    };
    //名字，状态，进入下一阶段时间，进度条值
    _proto.showThis = function(skin,name,desc){
        this.goodsInfo.getChildByName("goodsSkin").skin = skin;
        this.goodsInfo.getChildByName("goodsName").text = name;
        this.goodsInfo.getChildByName("goodsDesc").text = desc;
        Laya.Tween.to(this,{scaleY:1,scaleX:1},150,Laya.Ease.null,null);
    }
    _proto.hideThis = function(){
        Laya.Tween.to(this,{scaleY:0,scaleX:0},150,Laya.Ease.null,null);
    }
    return  ArticleDesc;
})(ui.ArticleDescUI);