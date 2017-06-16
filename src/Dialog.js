/*Dialog基类*/
function DiaLogSuper(){
}
//初始化
DiaLogSuper.prototype.setStyle = function(){
    this.stageWidth = Laya.stage.width;
    this.stageHeight = Laya.stage.height;
    this.pivot(this.width/2,this.height/2);
    this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
    this.scale(0,0);
    // console.log(this.height);    
}
//显示自己
DiaLogSuper.prototype.showThis = function(){
    LayaSample.farm.alertLayer.visible = true;
    Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
}
//隐藏自己
DiaLogSuper.prototype.hideThis = function(){
    Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
    LayaSample.farm.alertLayer.visible = false;
}
/*基类结束*/
//消息弹框
var MsgAlert = (function(_super){
    function MsgAlert(){
        MsgAlert.super(this);
        this.zOrder = 99;
        this.init();
    }
    Laya.class(MsgAlert,"MsgAlert",_super);
    var _proto = MsgAlert.prototype;
    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.hideThis = DiaLogSuper.prototype.hideThis;
    _proto.init = function(){
        this.setStyle();
        new BtnFeed(this.closeBtn);
        this.closeBtn.on("click",this,this.hideThis);//关闭当前
    }
    _proto.showThis = function(title,con){
        LayaSample.farm.alertLayer.visible = true;
        Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
        this.msgTitle.text = title;
        this.msgCon.text = con;
    }
    return MsgAlert;
})(ui.MsgAlertUI)
//用户信息dialog
var UserAlert = (function(_super){
    function UserAlert(userInfos){
        UserAlert.super(this);
        this.userInfos = userInfos;//用户信息
        // this.stageWidth = Laya.stage.width;
        // this.stageHeight = Laya.stage.height;
        // this.anchorY = 0.5;
        // this.anchorX = 0.5;
        // this.left = (this.stageWidth-this.width)/2;
        // this.top = (this.stageHeight-this.height)/2;
        this.zOrder = 99;
        this.init();
    }
    Laya.class(UserAlert,"UserAlert",_super);
    var _proto = UserAlert.prototype;
    _proto.showThis = function(){
        if(eval("("+localStorage.getItem('BASEINFO')+")").id==this.userInfos.id){
            this.logOut.visible = true;
        }else{
            this.logOut.visible = false;
        }
        this.showThisBase();
    }
    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.showThisBase = DiaLogSuper.prototype.showThis;
    _proto.hideThis = DiaLogSuper.prototype.hideThis;
    _proto.init = function(){
        this.setStyle();
        new BtnFeed(this.dialogClose);
        new BtnFeed(this.logOut);
        this.dialogClose.on(Laya.Event.CLICK,this,this.hideThis);
        this.logOut.on('click',this,this.toLogOut);
        this.setUserInfo(this.userInfos);
    }
    _proto.toLogOut = function(){
        this.hideThis();
        // var destroyList = [
        //     LayaSample.top,
        //     LayaSample.farm,
        //     LayaSample.enterPot,
        //     LayaSample.shop,
        //     LayaSample.friendsFarm,
        //     LayaSample.friendTop,
        //     LayaSample.msgAlert,
        //     LayaSample.userAlert,
        //     LayaSample.landGrade,
        //     LayaSample.selSeedDia,
        //     LayaSample.shareAlert,
        //     LayaSample.log
        // ]
        // for(var i = 0;i<destroyList.length;i++){
        //     if(destroyList[i]){
        //         destroyList[i].removeSelf();
        //         destroyList[i].destroy();
        //         destroyList[i] = null;
        //     }
        // }

        LayaSample.top.removeSelf();
        LayaSample.top.destroy();
        LayaSample.top = null;
        LayaSample.farm.removeSelf();
        LayaSample.farm.destroy();
        LayaSample.farm = null;
        LayaSample.userAlert.removeSelf();
        LayaSample.userAlert.destroy();
        LayaSample.userAlert = null;

        if(LayaSample.enterPot){
            LayaSample.enterPot.removeSelf();
            LayaSample.enterPot.destroy();
            LayaSample.enterPot = null;
        }
        
        if(LayaSample.shop){
            LayaSample.shop.removeSelf();
            LayaSample.shop.destroy();
            LayaSample.shop = null;
        }
        
        if(LayaSample.friendsFarm){
            LayaSample.friendsFarm.removeSelf();
            LayaSample.friendsFarm.destroy();
            LayaSample.friendsFarm = null;
        }
        

        if(LayaSample.friendTop){
            LayaSample.friendTop.removeSelf();
            LayaSample.friendTop.destroy();
            LayaSample.friendTop = null;
        }

        if(LayaSample.msgAlert){
            LayaSample.msgAlert.removeSelf();
            LayaSample.msgAlert.destroy();
            LayaSample.msgAlert = null;
        }
        
        if(LayaSample.userAlert){
            LayaSample.userAlert.removeSelf();
            LayaSample.userAlert.destroy();
            LayaSample.userAlert = null;
        }
        
        if(LayaSample.landGrade){
            LayaSample.landGrade.removeSelf();
            LayaSample.landGrade.destroy();
            LayaSample.landGrade = null;
        }
        
        if(LayaSample.selSeedDia){
            LayaSample.selSeedDia.removeSelf();
            LayaSample.selSeedDia.destroy();
            LayaSample.selSeedDia = null;
        }
    
        if(LayaSample.shareAlert){
            LayaSample.shareAlert.removeSelf();
            LayaSample.shareAlert.destroy();
            LayaSample.shareAlert = null;
        }
        
        if(LayaSample.log){
            LayaSample.log.removeSelf();
            LayaSample.log.destroy();
            LayaSample.log = null;
        }
        
        if(LayaSample.friendList){
            LayaSample.friendList.removeSelf();
            LayaSample.friendList.destroy();
            LayaSample.friendList = null;
        }

        if(LayaSample.bindMobile){
            LayaSample.bindMobile.removeSelf();
            LayaSample.bindMobile.destroy();
            LayaSample.bindMobile = null;
        }

        if(LayaSample.bindAlipay){
            LayaSample.bindAlipay.removeSelf();
            LayaSample.bindAlipay.destroy();
            LayaSample.bindAlipay = null;
        }
        
        if(LayaSample.giveSeed){
            LayaSample.giveSeed.removeSelf();
            LayaSample.giveSeed.destroy();
            LayaSample.giveSeed = null;
        }

        if(LayaSample.noSeedTip){
            LayaSample.noSeedTip.removeSelf();
            LayaSample.noSeedTip.destroy();
            LayaSample.noSeedTip = null;
        }

        if(LayaSample.firstGive){
            LayaSample.firstGive.removeSelf();
            LayaSample.firstGive.destroy();
            LayaSample.firstGive = null;
        }

        if(LayaSample.visitorBind){
            LayaSample.visitorBind.removeSelf();
            LayaSample.visitorBind.destroy();
            LayaSample.visitorBind = null;
        }

        if(LayaSample.giveSeedDia){
            LayaSample.giveSeedDia.removeSelf();
            LayaSample.giveSeedDia.destroy();
            LayaSample.giveSeedDia = null;
        }

        //销毁狗
        if(LayaSample.dogs){
            LayaSample.dogs.removeSelf();
            LayaSample.dogs.destroy();
            LayaSample.dogs = null;
        }
        if(LayaSample.friendDogs){
            LayaSample.friendDogs.removeSelf();
            LayaSample.friendDogs.destroy();
            LayaSample.friendDogs = null;
        }

        //销毁狗商店
        if(LayaSample.dogShop){
            LayaSample.dogShop.removeSelf();
            LayaSample.dogShop.destroy();
            LayaSample.dogShop = null;
        }

        if(LayaSample.msg){
            LayaSample.msg = null;
        }

        if(LayaSample.changeFriendFarm){
            LayaSample.changeFriendFarm = null;
        }
        LayaSample.friendIdArr = null;
        
        localStorage.removeItem("AUTOLOAD");    

        Laya.stage.addChild(LayaSample.LogIn);
        Laya.stage.addChild(LayaSample.littleTip);

        //LayaSample.LogIn = new LogIn();
        if(!LayaSample.LogIn){
            LayaSample.LogIn = new LogIn();
        }
        Laya.stage.addChild(LayaSample.LogIn);
        stopMusic();
    }
    //关闭弹出层
    // _proto.closeUserAlert = function(){
    //     Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
    //     LayaSample.farm.alertLayer.visible = false;
    // }
    //用户信息设置
    _proto.setUserInfo = function(userInfo){
        this.userInfo.getChildByName("userPic").skin = "ui/head"+userInfo.pic+".png";
        this.userInfo.getChildByName("userNickName").text = userInfo.nickname;
        this.userInfo.getChildByName("userNickNameT").text = userInfo.nickname;
        this.userInfo.getChildByName("houseLevel").text = "Lv."+userInfo.level;
        //this.userInfo.getChildByName("userTreasure").text = userInfo.money;
        this.userInfo.getChildByName("userId").text = userInfo.id;
    };
    return UserAlert;
})(ui.UserAlertUI);
//小提示
var LittleTip = (function(_super){
    function LittleTip(){
        LittleTip.super(this);
        this.zOrder = 99999;
        this.init();
    }
    Laya.class(LittleTip,"LittleTip",_super);
    var _proto = LittleTip.prototype;
    _proto.init = function(){
        // this.zOrder = 99;
        this.stageWidth = Laya.stage.width;
        this.stageHeight = Laya.stage.height;
        this.anchorY = 0.5;
        this.anchorX = 0.5;
        this.left = (this.stageWidth-this.width)/2;
        this.top = (this.stageHeight-this.height)/2.5;
        this.scaleY = 0;
        this.alpha = 0;
    }
    _proto.showThis = function(msg){
        this.con.text = msg;
        Laya.timer.clear(this,this.hideHandler);
        this.hideHandler();
        Laya.Tween.to(this,{scaleY:1,alpha:1},500,Laya.Ease.backOut,Laya.Handler.create(this,this.hideThis));
    }
    _proto.hideThis = function(){
        Laya.timer.once(1000,this,this.hideHandler);
    }
    _proto.hideHandler = function(){
        Laya.Tween.to(this,{scaleY:0,alpha:0},500,Laya.Ease.backOut,null);
    }
    return LittleTip;
})(ui.LittleTipUI)
//小提示
var NewFunTip = (function(_super){
    function NewFunTip(){
        NewFunTip.super(this);
        this.zOrder = 99999;
        this.init();
    }
    Laya.class(NewFunTip,"NewFunTip",_super);
    var _proto = NewFunTip.prototype;
    _proto.init = function(){
        // this.zOrder = 99;
        this.stageWidth = Laya.stage.width;
        this.stageHeight = Laya.stage.height;
        this.anchorY = 0.5;
        this.anchorX = 0.5;
        this.left = (this.stageWidth-this.width)/1.7;
        this.top = (this.stageHeight-this.height)/2.5;
        this.scaleY = 0;
        this.alpha = 0;
    }
    _proto.showThis = function(){
        Laya.timer.clear(this,this.hideHandler);
        this.hideHandler();
        Laya.Tween.to(this,{scaleY:1,alpha:1},500,Laya.Ease.backOut,Laya.Handler.create(this,this.hideThis));
    }
    _proto.hideThis = function(){
        Laya.timer.once(1200,this,this.hideHandler);
    }
    _proto.hideHandler = function(){
        Laya.Tween.to(this,{scaleY:0,alpha:0},500,Laya.Ease.backOut,null);
    }
    return NewFunTip;
})(ui.NewFunTipUI)
//收收获成功偷取成功提示
var GetAni = (function(_super){
    function GetAni(){
        GetAni.super(this);
        this.zOrder = 99999;
        this.init();
    }
    Laya.class(GetAni,"GetAni",_super);
    var _proto = GetAni.prototype;
    _proto.init = function(){
        this.pivot(this.width/2,this.height/2);
        this.visible = false;
        this.alpha = 0.618;
        this.scaleX = 0.5;
        this.scaleY = 0.5
    }
    _proto.showThis = function(x,y,pic,cnt){
        this.pos(x,y);
        this.getPic.skin = pic;
        this.getNum.text = cnt;
        this.visible = true;
        Laya.Tween.to(this,{scaleY:1,scaleX:1,alpha:1,y:y-150},1500,Laya.Ease.backOut,Laya.Handler.create(this,this.hideThis));
    }
    _proto.hideThis = function(){
        Laya.Tween.to(this,{scaleY:0.5,scaleX:0.5,alpha:0},500,Laya.Ease.backOut,Laya.Handler.create(this,this.opacity));
    }
    _proto.opacity = function(){
        this.visible = false
        Laya.stage.removeSelf();
    }
    return GetAni;
})(ui.GetAniUI)
//充值弹窗
// var Recharge = (function(_super){
//     var alertLayer;//充值弹窗界面遮罩层的引用
//     var that;//当前界面的引用
//     function Recharge(){
//         Recharge.super(this);
//         that = this;
//         alertLayer = this.alertLayer;
//         this.init();
//     }
//     Laya.class(Recharge,"Recharge",_super);
//     var _proto = Recharge.prototype;
//     _proto.init = function(){
//         this.setStyle();
//         new BtnFeed(this.rechargeBtn);
//         new BtnFeed(this.closeBtn);
//         this.getAccoutBalance();//得到账户余额
//         this.closeBtn.on(Laya.Event.CLICK,this,this.hideThis);
//         this.rechargeBtn.on(Laya.Event.CLICK,this,this.goUrl,["https://www.baidu.com"]);//充值跳转
//         this.littleJewel.on(Laya.Event.CLICK,this,this.addJewelTip,[2000]);//充值两千钻
//         this.normalJewel.on(Laya.Event.CLICK,this,this.addJewelTip,[20000]);//充值两万钻
//         this.bigJewel.on(Laya.Event.CLICK,this,this.addJewelTip,[200000]);//充值20w钻
//     }
//     _proto.setStyle = function(){
//         this.stageWidth = Laya.stage.width;
//         this.stageHeight = Laya.stage.height;
//         this.anchorY = 0.5;
//         this.anchorX = 0.5;
//         this.left = (this.stageWidth-this.width)/2;
//         this.top = (this.stageHeight-this.height)/2;
//         this.scaleY = 0;
//         this.scaleX = 0;
//     }
//     //显示自己
//     _proto.showThis = function(){
//         LayaSample.farm.alertLayer.visible = true;
//         Laya.Tween.to(this,{scaleY:1,scaleX:1},300,Laya.Ease.backIn);
//         LayaSample.littleTip.zOrder = 9999;
//         Laya.stage.addChild(LayaSample.littleTip);
//     }
//     //隐藏自己
//     _proto.hideThis = function(){
//          Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn);
//          if(this.recTip){
//             this.recTip.closeThis();//关闭提示框
//          }
//          LayaSample.farm.alertLayer.visible = false;
//     }
//     //得到账户余额
//     _proto.getAccoutBalance = function(){
//         var balance = Service.assets().accountBalance;
//         this.accountBalance.text = balance;
//     }
//     //充值跳转
//     _proto.goUrl = function(url){
//         window.open(url);
//     }
//     //充值钻石提示框
//     _proto.addJewelTip = function(num){
//         this.recTip = new TipDialog("确定充值"+num+"钻石吗？","钻石只能在游戏内使用",this.addJewelFn,this.showLayer);
//         this.alertLayer.visible = true;//显示遮罩层
//         Laya.stage.addChild(this.recTip);
//         this.recTip.showThis();
//     }
//     //充值钻石方法
//     _proto.addJewelFn = function(){
//         var assets = Service.assets();
//         alertLayer.visible = false;//显示遮罩层
//         // LayaSample.farm.addChild(LayaSample.littleTip);
//         LayaSample.littleTip.showThis("钻石数量不足");
//         LayaSample.farm.alertLayer.visible = true;
//     }
//     //点击充值提示按钮不关闭大的遮罩层
//     _proto.showLayer = function(){
//         LayaSample.farm.alertLayer.visible = true;
//     }
//     return Recharge;
// })(ui.RechargeUI)
//升级土地弹窗
var LandGrade = (function(_super){
    function LandGrade(){
        LandGrade.super(this)
        this.setStyle();
        this.zOrder = 99;
        this.init();
    }
    Laya.class(LandGrade,"LandGrade",_super)
    var _proto = LandGrade.prototype;
    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.showThis = DiaLogSuper.prototype.showThis;
    _proto.hideThis = DiaLogSuper.prototype.hideThis;
    _proto.init = function(){
        this.registFeedBtn();
        this.closeBtn.on(Laya.Event.CLICK,this,this.hideThis)
        this.gradeList.array = landGradeArr;
        this.gradeList.scrollBar.hide = true;//隐藏列表的滚动条。
    }
    //反馈按钮注册
    _proto.registFeedBtn = function(){
        new BtnFeed(this.closeBtn);
    }
    return LandGrade;
})(ui.LandGradeUI)
//升级房屋弹窗
var HouseGrade = (function(_super){
    function HouseGrade(){
        HouseGrade.super(this)
        this.setStyle();
        this.zOrder = 99;
        this.init();
    }
    Laya.class(HouseGrade,"HouseGrade",_super)
    var _proto = HouseGrade.prototype;
    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.showThis = DiaLogSuper.prototype.showThis;
    _proto.hideThis = DiaLogSuper.prototype.hideThis;
    _proto.init = function(){
        this.registFeedBtn();
        this.closeBtn.on(Laya.Event.CLICK,this,this.hideThis)
        this.gradeBtn.on(Laya.Event.CLICK,this,this.gradeHouse);
    }
    //反馈按钮注册
    _proto.registFeedBtn = function(){
        new BtnFeed(this.closeBtn);
        new BtnFeed(this.gradeBtn);//升级按钮
    }
    //显示弹窗并且更新数据
    _proto.showThisUI = function(){
        this.needWood.getChildByName("has").text = Service.assets().wood;
        this.needJewel.getChildByName("has").text = Service.assets().jewel;
        this.showThis();
    } 
    //升级房屋
    _proto.gradeHouse = function(){
        // this.addChild(LayaSample.littleTip);
        LayaSample.littleTip.zOrder = 9999;
        Laya.stage.addChild(LayaSample.littleTip);
        LayaSample.littleTip.showThis("材料不足");
    }
    return HouseGrade;
})(ui.HouseGradeUI)
//装扮弹出层
var Decorate = (function(_super){
    function Decorate(){
        Decorate.super(this);
        this.init();
        this.zOrder = 99;
        this.setStyle();
    }
    Laya.class(Decorate,"Decorate",_super)
    var _proto = Decorate.prototype;
    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.showThis = DiaLogSuper.prototype.showThis;
    _proto.hideThis = DiaLogSuper.prototype.hideThis;
    _proto.init = function(){
        this.getToken();
        this.setListFunc();
        this.setListUI();
        this.closeBtn.on(Laya.Event.CLICK,this,this.hideThis);
    }
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    _proto.setListFunc = function(){
        this.decorateList.selectEnable = true;
        this.decorateList.scrollBar.hide = true;//隐藏列表的滚动条。
        this.decorateList.scrollBar.elasticBackTime = 200;//设置橡皮筋回弹时间。单位为毫秒。
        this.decorateList.scrollBar.elasticDistance = 50;//设置橡皮筋极限距离。
    }
    //渲染列表  
    _proto.setListUI = function(){
        this.decorateList.array = Service.decorate();
        console.log(Service.decorate());
    }
    return Decorate;
})(ui.DecorateUI);
//种植选择种子弹出层
var SelSeedDia = (function(_super){
    //土地id 种植成功回调
    function SelSeedDia(landId,callBack){
        SelSeedDia.super(this);
        this.landId = landId;//土地id
        this.callBack = callBack;
        this.zOrder = 99
        this.init();
        this.setStyle();
    }
    Laya.class(SelSeedDia,"SelSeedDia",_super);
    var _proto = SelSeedDia.prototype;
    _proto.init = function(){
        new BtnFeed(this.confirmBtn);
        new BtnFeed(this.cancelBtn);
        new BtnFeed(this.greenguiBtn);
        // this.judgeDoNew();
        this.getToken();
        this.seedList.selectEnable = true;
        this.setArrayList();
        this.cancelBtn.on(Laya.Event.CLICK,this,this.closeThis);
        this.confirmBtn.on(Laya.Event.CLICK,this,this.confirmSow,[this.landId]);
        this.greenguiBtn.on(Laya.Event.CLICK,this,this.confirmSow,[this.landId]);
    };
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //设置列表
    _proto.setArrayList = function(){
        var that = this;
        Http.get("/api/game/getPlayerItemDetailByType",{type:"01"},function(data){
            that.seedList.array = util.creSelSeedArr(data.obj)
            that.listItemClick();
            console.log(that.seedList.array);
        },["Authorization",that.token])
    }
    //为列表添加click事件
    _proto.listItemClick = function(){
        // this.seedList.selectHandler = new Handler(this,this.listSelect);
        this.seedList.mouseHandler = new Handler(this,this.listClick);
    }
    //列表选择事件-选择种子
    // _proto.listSelect = function(index,event){
    //     this.idx = index;//选中的索引
    //     // var target = event
    //     // console.log(event);
    // };
    //重置列表样式
    _proto.resetListStyle = function(evt){
        var list = evt;
        console.log(list);  
        for(var i = 0;i<list._childs[0]._childs.length;i++){
            list._childs[0]._childs[i]._childs[5].skin = "ui/common_a_31.png";
        }
    }
    //列表点击
    _proto.listClick = function(event,index){
        var _idx = index;
        event.stopPropagation();
        var target = event.target;
        if(event.type == Event.CLICK){
            console.log(target);
            if((/^checkBox$/).test(target.name)){
                this.resetListStyle(this.seedList);
                target.skin = "ui/r-4.png";
                this.seedId = target._parent._dataSource.id;
            }
        }
    }
    _proto.confirmSow = function(landId){
        var that = this;
        if(!this.seedId){
            var littleTips = new LittleTip();
            Laya.stage.addChild(littleTips);
            littleTips.showThis("请选择要播种的种子");
            return;
        }else{
            var plantDatas = {
                    "landId": landId,//土地id
                    "speedId":that.seedId,//种子id
                }
            Http.post("/api/game/plant",JSON.stringify(plantDatas),function(datas){
                console.log(datas,plantDatas);
                if(!datas.success){
                    LayaSample.littleTip.showThis(datas.msg);
                    return false;
                }
                that.hideThis();
                that.seedId = null;
                that.resetListStyle(that.seedList);
                LayaSample.littleTip.showThis("种植成功");
                that.callBack();
                setTimeout(function(){
                    LayaSample.selSeedDia.removeSelf();
                    LayaSample.selSeedDia.destroy();
                    LayaSample.selSeedDia = null;
                },300);
                console.log(landId);
            },["Authorization",that.token]);
        };
    }
    _proto.showThis = function(){
        this.judgeDoNew();
        this.judgeShowThis();
    }
    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.judgeShowThis = DiaLogSuper.prototype.showThis;
    _proto.hideThis = DiaLogSuper.prototype.hideThis;
    _proto.closeThis = function(){
        this.hideThis();
        setTimeout(function(){
            LayaSample.selSeedDia.removeSelf();
            LayaSample.selSeedDia.destroy();
            LayaSample.selSeedDia = null;
        },300);
    }
    _proto.judgeDoNew = function(){
        if(!ISDONENEW){
             this.cancelBtn.visible = false;
             this.confirmBtn.visible = false;
             this.greenguiBtn.visible = true;
        }
    }
    return SelSeedDia;
})(ui.SelSeedDiaUI)
//分享弹出框
var ShareAlert = (function(_super){
    function ShareAlert(){
        ShareAlert.super(this);
        this.init();
    }   
    Laya.class(ShareAlert,"ShareAlert",_super);
    var _proto = ShareAlert.prototype;
    _proto.init = function(){
        this.zOrder = 99;
        new BtnFeed(this.close_btn);
        this.setStyle();
        this.shareConfig();
        this.close_btn.on('click',this,this.hideThis);
        this.confirm_btn.on('click',this,this.hideThis);
        this.qq_share.on('click',this,this.toShareQQ);
        this.wx_share.on('click',this,this.toShareWX);
    }
    _proto.shareConfig = function(){
        shareconfig = {//分享参数
            url:'http://game.0001wan.com/bin/index.html?superId='+SUPERID,
            title:'超级水稻',
            desc:'超级水稻，分享赚提成',
            img:'http://t10.baidu.com/it/u=3334453527,4077871420&fm=76',
            img_title:'来自超级水稻的分享',
            from:'来自超级水稻的分享'
        };
        this.share_obj = new nativeShare('qq_share',shareconfig);
    }
    _proto.toShareQQ = function(){

        if(LOGINCHANNEL=="WXWeb"){
            LayaSample.littleTip.showThis('开发中');
            return;
        }

        console.log('qq分享');
        this.share_obj.share('QQ');
    }
    _proto.toShareWX = function(){
        if(LOGINCHANNEL=="WXWeb"){
            LayaSample.littleTip.showThis('开发中');
            return;
        }

        console.log('WX分享');
        this.share_obj.share('weixinFriend');
    };
    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.showThis = DiaLogSuper.prototype.showThis;
    _proto.hideThis = DiaLogSuper.prototype.hideThis;
    return ShareAlert;
})(ui.ShareAlertUI)
//没有稻谷提示
var noSeedTip = (function(_super){
    function noSeedTip(){
        noSeedTip.super(this);
        this.init();
    }
    Laya.class(noSeedTip,"noSeedTip",_super);
    var _proto = noSeedTip.prototype;
    _proto.init = function(){
        this.zOrder = 99;
        this.setStyle();
        new BtnFeed(this.confirmBtn);
        this.confirmBtn.on('click',this,this.hideThis);
    }

    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.showThis = DiaLogSuper.prototype.showThis;
    _proto.hideThis = DiaLogSuper.prototype.hideThis;
    return noSeedTip;

})(ui.noSeedTipUI);

//第一次赠送果实-绑定支付宝加赠送
var FirstGive = (function(_super){
    function FirstGive(){
        FirstGive.super(this);
        this.isLoading = false;
        this.init();
    }
    Laya.class(FirstGive,"FirstGive",_super);
    var _proto = FirstGive.prototype;
    _proto.init = function(){
        this.zOrder = 99;
        this.setStyle();
        this.getToken();
        new BtnFeed(this.confirmBtn);
        new BtnFeed(this.cancelBtn);
        this.cancelBtn.on('click',this,this.hideThis);
        this.confirmBtn.on('click',this,this.bindAlipay);
    }
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    };
    //第一次赠送绑定支付宝
    _proto.bindAlipay = function(){
        if(this.isLoading){
            LayaSample.littleTip.showThis('请勿重复提交');
            return;
        };
        this.alicount = (this.alipayAccount.text).trim();
        var aliName = (this.alipayName.text).trim();
        var token = this.token;
        var that = this;
        this.isLoading = true;
        Http.post("/api/game/bindAlipay?alipay="+this.alicount+"&alipayName="+aliName,null,function(datas){
            console.log(datas);
            if(!datas.success){
                LayaSample.littleTip.showThis(datas.msg);
                LayaSample.farm.message();//从后台获取消息
                if(datas.code=="988"){//code988处理
                    var noFadeTip = new TipDialog("",datas.msg,function(){
                        if(!LayaSample.visitorBind){
                            LayaSample.visitorBind = new VisitorBind();
                            Laya.stage.addChild(LayaSample.visitorBind);
                        }
                        LayaSample.visitorBind.showThis();
                    },null);

                    that.hideThis();//隐藏支付宝绑定框

                    noFadeTip.zOrder = 999;
                    LayaSample.farm.alertLayer.visible = true;
                    Laya.stage.addChild(noFadeTip);
                    noFadeTip.showThis();
                    // Laya.Tween.to(noFadeTip,{scaleY:1,scaleX:1},300,Laya.Ease.backIn,null);

                    LayaSample.farm.message();//从后台获取消息
                    that.isLoading = false;

                    return false;
                }
                that.isLoading = false;
                return false;
            }
            // if(datas)
            that.hideThis();
            LayaSample.littleTip.showThis("赠送成功!");
            LayaSample.msg.updateActionMsg("show_ck");//更新操作消息
            LayaSample.farm.message();//从后台获取消息
            that.isLoading = false;
        },["Authorization",that.token])
    };
    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.showThis = DiaLogSuper.prototype.showThis;
    _proto.hideThisJ = DiaLogSuper.prototype.hideThis;

    _proto.hideThis = function(){
        LayaSample.farm.message();//从后台获取消息
        this.hideThisJ();
    }

    return FirstGive;
})(ui.FirstGiveUI);

//赠送完成但为游客-游客绑定手机号
var VisitorBind = (function(_super){
    function VisitorBind(){
        VisitorBind.super(this);

        this.verBtnCanClick = true;//设置获取短信验证码的按为可点击
        this.timer = 120;//默认120秒可重新获取
        this.mobileReg = /^1[3-9][\d]{9}$/;
        this._uuid = '';//图片验证码识别码
        this.init();
    }
    Laya.class(VisitorBind,"VisitorBind",_super);
    var _proto = VisitorBind.prototype;
    _proto.init = function(){
        this.zOrder = 99;
        this.setStyle();
        this.getToken();
        new BtnFeed(this.confirmBtn);
        new BtnFeed(this.getVcodeBtn);
        new BtnFeed(this.cancelBtn);
        new BtnFeed(this.imgCode);
        this.cancelBtn.on('click',this,this.hideThis);
        this.confirmBtn.on('click',this,this.bindMobile);
        this.getVcodeBtn.on('click',this,this.getVerCode);
        this.imgCode.on('click',this,this.getNewCode);

        this.getNewCode();
        
    };
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    };
    //从服务器获取验证码
    _proto.getVerCode = function(){
        //如果按钮可点击
        if(this.verBtnCanClick){
            if(!this.mobileReg.test((this.mobileNum.text).trim())){
                LayaSample.littleTip.showThis("请输入正确手机号");
                return;
            }
			if(!(this.verImgCode.text).trim()){
                LayaSample.littleTip.showThis('请输入图片验证码');
                return;
            }
            var that = this;
            that.verBtnCanClick = false;
            Http.get('/api/sms/sendRegSms',{mobile:(that.mobileNum.text).trim(),uuid:that._uuid,imgCodeVal:(that.verImgCode.text).trim()},function(data){
                console.log(data)
                //异常情况    
                if(!data.success){
                    that.verBtnCanClick = true;
                    LayaSample.littleTip.showThis(data.msg);
                    return false;
                }
				
                //正常情况
                LayaSample.littleTip.showThis("验证码发送成功");
                that.getVcodeBtn.disabled = true;
                that.getVcodeBtn.label = that.timer;
                that.countDown = setInterval(function(){
                    that.timer--;
                    that.getVcodeBtn.disabled = true;
                    that.getVcodeBtn.label = that.timer;
                    if(that.timer<=0){
                        clearInterval(that.countDown);
                        that.getVcodeBtn.disabled = false;
                        that.getVcodeBtn.label = "重新获取";
                        // 重新设置按钮状态可点击
                        that.verBtnCanClick = true;
                        that.timer = 120;
                    }
                },1000)
            });
        }else{
            return false;
        }
    }
    //重置表单
    _proto.resetForm = function(){
        this.verCode.text = ''
        this.mobileNum.text = ''
        this.password.text = ''
    }
    //绑定手机号
    _proto.bindMobile = function(){
        var that = this;
        var code  = (this.verCode.text).trim();
        var mobile = (this.mobileNum.text).trim();
        var password = (this.password.text).trim();
        if(!this.mobileReg.test(mobile)){
            LayaSample.littleTip.showThis('请输入正确手机号');
            return;
        }else if(!password||password.length<6||password.length>18){
            LayaSample.littleTip.showThis('请输入6-18位密码');
            return;
        }else if(!(that.verImgCode.text).trim()){
            LayaSample.littleTip.showThis('请输入图片验证码');
            return;
        }else if(!code){
            LayaSample.littleTip.showThis('请输入短信验证码');
            return;
        }
        var bindData = {
              "code": code,
              "mobile": mobile,
              "password": password,
              "superiorId": SUPERID,
              "imgCode":(that.verImgCode.text).trim(),
              uuid:that._uuid,
            };
        Http.post('/api/game/bindPhone',JSON.stringify(bindData),function(data){
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return;
            }
            //游客绑定成功后用绑定的账号重新登录
            LayaSample.littleTip.showThis("绑定成功");
                 //登录创建权限
                 //登录参数
            var loadDatas = {
                captchaCode: " ",
                captchaValue: " ",
                clientId: "098f6bcd4621d373cade4e832627b4f6",
                userName: bindData.mobile,
                password: bindData.password,
                login_channel: LOGINCHANNEL,//登录渠道
            }
            Http.post('/api/oauth/token',JSON.stringify(loadDatas),function(data){
                console.log(loadDatas);
                console.log(data);
                if(!data.success){
                    that.littleTip.showThis(data.msg);
                    return false;
                }
                //本地储存
                localStorage.setItem("clientId","098f6bcd4621d373cade4e832627b4f6");//设备id
                localStorage.setItem("access_token",data.obj.access_token);//token
                localStorage.setItem("token_type",data.obj.token_type);//token类型
                localStorage.setItem("userName",loadDatas.userName);//用户名
                localStorage.setItem("password",loadDatas.password);//密码
                //清除游客信息
                localStorage.removeItem("virPassword");
                localStorage.removeItem("virMobile");
                LayaSample.farm.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");//改变定时器token值;
                // LayaSample.friendsFarm.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");//改变定时器token值;
                var loadToken = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
                Http.get("/api/game/loadPlayer",null,function(data){
                    if(!data.success){
                        console.log(data);
                        return;
                    }else{
                        var _type = data.obj.userType;
                        ISVISITOR = _type==1?false:true;

                        localStorage.setItem('BASEINFO',JSON.stringify(data.obj));

                        //记住token为下次自动登录做准备
                        var timestamp = new Date().getTime();
                        var AUTOLOAD = {
                            token:loadToken,
                            timestamp:timestamp,
                        };
                        localStorage.setItem("AUTOLOAD",JSON.stringify(AUTOLOAD));
                    }
                },["Authorization",loadToken]);

                setTimeout(function(){
                    //设置当前用户不是visitor
                    ISVISITOR = false;
                    that.hideThis();//关闭游客绑定手机号弹出窗
                    if(!LayaSample.firstGive){
                        LayaSample.firstGive = new FirstGive();
                        Laya.stage.addChild(LayaSample.firstGive);
                    }
                    LayaSample.firstGive.showThis();
                    // LayaSample.giveSeed.showThis();//显示赠送框
                },1000)
            });
            that.resetForm();
        },["Authorization",that.token]);
    };
    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.showThis = DiaLogSuper.prototype.showThis;
    _proto.hideThis = DiaLogSuper.prototype.hideThis;
    _proto.getNewCode = function(){
        this._uuid = util.createUUID();
        this.imgCode.skin = '/api/captcha-image?ck='+this._uuid+'&t='+new Date().getTime();
    }
    return VisitorBind;
})(ui.VisitorBindUI);

//赠送果实弹框
var GiveSeedDia = (function(_super){

    function GiveSeedDia(){
        GiveSeedDia.super(this);
        this.init();
        this.isLoading = false;
    }
    Laya.class(GiveSeedDia,"GiveSeedDia",_super);
    var _proto = GiveSeedDia.prototype;
    _proto.init = function(){
        this.zOrder = 99;
        this.setStyle();
        this.getToken();
        new BtnFeed(this.confirmBtn);
        new BtnFeed(this.cancelBtn);
        new BtnFeed(this.reduceBtn);
        new BtnFeed(this.addBtn);
        new BtnFeed(this.selMax);
        new BtnFeed(this.changeBind);
        this.cancelBtn.on('click',this,this.hideThis);//关闭
        this.selMax.on('click',this,this.setMax);//设置最大赠送数
        this.reduceBtn.on('click',this,this.reduceNum);//减少数量
        this.addBtn.on('click',this,this.addNum);//减少数量
        this.confirmBtn.on('click',this,this.confirmGive);//减少数量
        this.changeBind.on('click',this,this.toUserCenter);//减少数量
    }
    //获取token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //得到最大数
    _proto.setMax = function(){
        var that = this;
        Http.get("/api/game/getPlayerItemDetailByType",{type:"02"},function(data){
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            if(!data.length) {
                that.max = 0;
                return
            };
            if(!data[0].cnt){
                that.max = 0;
            }else{
                that.max = parseInt(data[0].cnt||0);
            }
            if(that.max>5000000){
                that.max = 50000000;
            }
            that.giveNum.text = that.max;
        },["Authorization",that.token]);
    }
    //增加赠送数量
    _proto.addNum = function(){
        if(this.giveNum.text>=this.max||this.giveNum.text>=5000000) return;
        this.giveNum.text = parseInt(this.giveNum.text)+1;
    }
    //减少数量
    _proto.reduceNum = function(){
        if(this.giveNum.text<=10) return;
        this.giveNum.text = parseInt(this.giveNum.text)-1;
    }
    //显示弹窗
    _proto.showThis = function(){
        LayaSample.farm.alertLayer.visible = true;
        Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
        this.TipsAni.play(0,false);
        this.showAliAcut();
        var that = this;
        Http.get("/api/game/getPlayerItemDetailByType",{type:"02"},function(data){
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            if(!data.length) {
                that.max = 0;
                that.giveNum.text = 0;
                return
            };
            if(!data[0].cnt){
                that.max = 0;
                that.giveNum.text = 0;
            }else{
                that.max = parseInt(data[0].cnt||0);
                that.giveNum.text = parseInt(data[0].cnt||0);
            }
            if(data[0].cnt<50&&data[0].cnt){
                that.giveNum.text = data[0].cnt;
            }else{
                that.giveNum.text = 50;
            }
        },["Authorization",that.token]);
    }
    //显示绑定的支付宝账号
    _proto.showAliAcut = function(){
        var that = this;
        this.getToken();
        Http.get("/api/game/loadPlayer",null,function(data){
            if(!data.success){
                return;
            };
            var show_text = '';
            var alipay_account = data.obj.alipay;
            if(!alipay_account){
                show_text = '';
            }else{
                show_text = util.formatAliStr(alipay_account);
            }
            that.alipayText.text = show_text;
        },["Authorization",that.token]);
    }
    //确定赠送果实
    _proto.confirmGive = function(){
        var that = this;
        if(!that.isLoading){
            that.isLoading = true;
            var givingDatas = {
                friendId:1,
                cnt:that.giveNum.text
            }
            Http.get("/api/game/friend/giving",givingDatas,function(data){
                console.log(data);
                that.isLoading = false;
                if(!data.success){
                    // littleTips.showThis(data.msg);
                    LayaSample.littleTip.showThis(data.msg);   
                    return;
                }
                // littleTips.showThis("赠送成功");
                LayaSample.littleTip.showThis("赠送成功！");

                Http.get("/api/game/loadPlayer",null,function(result){
                    if(!result.success) return;
                    LayaSample.header.loadHeaderDatas(result.obj);     
                },["Authorization",that.token]);
                that.hideThis();
                LayaSample.msg.updateActionMsg("show_ck");//更新操作消息
                LayaSample.farm.message();//从后台获取消息

            },["Authorization",that.token])
        }
    }
    //去重新绑定支付宝
    _proto.toUserCenter = function(){
        var toUrl = centerUrl+"/dispense.html?toUrl=ncbd.html";
        skipToUrl(toUrl);
    }
    _proto.setStyle = DiaLogSuper.prototype.setStyle;
    _proto.hideThis = DiaLogSuper.prototype.hideThis;
    return GiveSeedDia;

})(ui.GiveSeedDiaUI)