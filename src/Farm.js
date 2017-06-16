//Farm类继承ui界面的FarmUI;
var Farm = (function(_super){
    function Farm(farmDatas){
        //反馈按钮列表
        this.feedBtn = [];
        //存放土地的数组
        this.lands = new Array;
        this.seeds = new Array;
        //土地数量
        this.landNum = 12;
        Farm.super(this);
        this._palyerId = farmDatas.id;
        this.farmDatas = farmDatas;//农场初始化信息
        // this.getFriendList();
        //土地、种子、神像数据 
        this.landInfo = farmDatas.lands;
        //种子信息
        this.seedInfo = util.creSeedArr(farmDatas.lands,farmDatas.playerPlantingDetail);
        console.log(this.seedInfo);
        this.statueInfo = Datas.statueInfo;
        //好友列表
        // 列表点击事件进入好友农场
        // this.m_list.selectEnable = true;
        // this.m_list.scrollBar.hide = true;//隐藏列表的滚动条。
        // this.m_list.scrollBar.elasticBackTime = 200;//设置橡皮筋回弹时间。单位为毫秒。
        // this.m_list.scrollBar.elasticDistance = 50;//设置橡皮筋极限距离。
        // this.m_list.selectHandler = new laya.utils.Handler(this, this.onSelect);//设置 list 改变选择项执行的处理器。
        this.alertLayer.zOrder = 20
        this.getToken();
        this.init();
        //显示弹窗
       
    }
    //注册Farm类
    Laya.class(Farm,"Farm",_super);
    //定义变量接收Farm类原型
    var _proto = Farm.prototype;
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    _proto.init = function(){
        var that = this;
        //添加排行榜
        // this.addChild(new RankList());
        this.onLoadHeader();//加载头部
        LayaSample.top.header.getChildByName("toggleMenu").getChildByName("friend").on(Laya.Event.CLICK,this,this.showFriendList);
        this.onLoadSeed();//加载种子 
        this.onLoadLand();//加载土地
        this.onLoadStatue();//加载神像
        this.getFeedBtn();
        new MyHome(this.myHome,this.famlilyMune,false,0,-100);//我的家园
        //new MyOrchard(this.myOrchard,this.orchardMenu,false,-2,100);//我的果园
        // new SignIn(this.signIn,Service.userInfo().isSingIn,this.signInAlert,this.signInAlert.getChildByName("signInAward"));//签到
        this.message();//消息
        new AddFriends(this.addFriendBtn);//一键添加好友
        // this.addUserInfo();
        // this.addRankList();//排行榜弹窗
        this.addLittleTip();//小提示弹窗 农场加载即添加
        this.myHouse.on(Laya.Event.CLICK,this,this.showUpgradeHouseUI);//显示升级房屋弹窗
        this.addAlertLayer();
        this.LoopUpdate();//定时更新
        //公告弹出最新公告
        this.Toannounce.on("click",this,function(){
           new Annouce(1,2);
            // location = ("http://center.0001wan.com/index.html?token="+localStorage.getItem("access_token")); 
        })
        //公告消息
        LayaSample.gongGao = new GongGao();
        //头部漂浮公告
        Laya.timer.loop(60000,LayaSample.gongGao,LayaSample.gongGao.init);
        //根据作物下一状态时间定时更新土地植物状态
        this.updateStatusByNextTime();
        //收购商说话
        buyerSay(that.buyerSpeak);
        LayaSample.buyerSpeakTime = setInterval(function(){
            buyerSay(that.buyerSpeak);
        },60000);
        LayaSample.dogSpeakTime = setInterval(function(){
            dogSay(that.dogSpeak);
        },40000);
        //收购商点击回调
        new BuyerFun(this.buyer);
        //添加狗
        this.addDog();
        //显示狗商店
        this.petHouse.on('click',this,this.showDogShop);
    }
    //添加遮罩层
    _proto.addAlertLayer = function(){
        Laya.stage.addChild(this.alertLayer);
        this.alertLayer.zOrder = 2;
        this.alertLayer.visible = false;
    }
    //添加狗
    _proto.addDog = function(){
        if(!LayaSample.dogs){
            LayaSample.dogs = new Dogs(this.farmDatas.dog);
        }
        this.dogSpeak.visible = this.farmDatas.dog.status=="0"?true:false;
        this.addChild(LayaSample.dogs);
        if(!LayaSample.dogShop){
            LayaSample.dogShop = new DogShop();
            Laya.stage.addChild(LayaSample.dogShop);
        }
        LayaSample.dogs.on('click',this,this.showDogShop);//显示狗商店
    }
    //实例化消息组件
    _proto.message = function(){
        var that = this;
        Http.get("/api/game/msg/list",null,function(data){
            console.log(data);
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return;
            }
            //更新土地和狗
            var msgArr = data.obj;
            // LayaSample.msg = null;
            // delete LayaSample.msg;
            if(!LayaSample.msg){
                LayaSample.msg = new Message(that.signIn,true,msgArr);
            }
            LayaSample.msg.arrIdx = 0;
            LayaSample.msg.msgArr = msgArr;
            LayaSample.msg.msgLen = msgArr.length;
            LayaSample.msg.msgBtn.visible = msgArr.length>0?true:false;

            for(var i = 0;i<msgArr.length;i++){
                if(msgArr[i].msg_type=="1"&&msgArr[i].action=='land'){
                    LayaSample.msg.updateActionMsg("land");//更新操作消息
                    // LayaSample.farm.message();//从后台获取消息
                    that.timerTask();//更新土地
                }else if(msgArr[i].msg_type=="1"&&msgArr[i].action=='dog'){
                    LayaSample.msg.updateActionMsg("dog");//更新操作消息
                    // LayaSample.farm.message();//从后台获取消息
                    that.dogSpeak.visible = true;
                    that.updateDog();//更新狗
                }
            }

        },["Authorization",that.token]);
    }
    //添加小提示UI
    _proto.addLittleTip = function(){
        if(!LayaSample.littleTip){
            LayaSample.littleTip = new LittleTip()
        }
        LayaSample.littleTip.zOrder = 999;
        Laya.stage.addChild(LayaSample.littleTip);

        if(!LayaSample.newFunTip){
            LayaSample.newFunTip = new NewFunTip()
        }
        LayaSample.newFunTip.zOrder = 999;
        Laya.stage.addChild(LayaSample.newFunTip);

    }
    //用户信息-点击头部图片弹出
    _proto.addUserInfo = function(){
        if(!LayaSample.userAlert){
            LayaSample.userAlert = new UserAlert(this.farmDatas);
        }
        this.addChild(LayaSample.userAlert);
    }
    //排行榜
    // _proto.addRankList = function(){
    //     if(!LayaSample.rankList){
    //         LayaSample.rankList = new RankList();
    //     }
    //     this.addChild(LayaSample.rankList);
    // }
    //初始化头部
    _proto.onLoadHeader = function(){
        if(!LayaSample.top){
            LayaSample.top = new Top();
        }
        LayaSample.top.zOrder = 1;
        Laya.stage.addChild(LayaSample.top);
        LayaSample.header = new Header(
        LayaSample.top.header,
        LayaSample.top.header.getChildByName("toggleMenu"),
        LayaSample.top.header.getChildByName("headerImg"),
        LayaSample.top.header.getChildByName("nickName"),
        LayaSample.top.header.getChildByName("toggleMenu").getChildByName("log"),
        LayaSample.top.header.getChildByName("toggleMenu").getChildByName("rank"),
        LayaSample.top.header.getChildByName("headerToggle"),
        true,
        6,
        LayaSample.top.header.getChildByName("toggleMenu").y,
        this.farmDatas,
        LayaSample.top.id,
        LayaSample.top.nickname,
        LayaSample.top.lv,
        LayaSample.top.fruitNum,
        LayaSample.top.expText,
        LayaSample.top.epxBar);
    }
    //初始化土地
    _proto.onLoadLand = function(){
        //循环数组
        this.lands = [];

        //默认第一块未开垦的土地索引
        var firsrtNoOpenLand = 0;
        for(var j = 0;j<this.landNum;j++){
            if(this.farmDatas.lands[j].status!=0){
                firsrtNoOpenLand++;
                console.log(firsrtNoOpenLand);
            }
        }

        for(var i = 0;i<this.landNum;i++){
            this.land = new Land(
                this.getChildByName("item"+i).getChildByName("land"),
                this.farmDatas.lands[i].pdId>0?true:false,
                this.getChildByName("item"+i).getChildByName("toolBox"),
                this.getChildByName("item"+i).getChildByName("toolBox").y,
                this.seeds[i],
                this.getChildByName("item"+i).getChildByName("oprTipLayer"),
                this.farmDatas.lands[i].id,
                this.farmDatas.lands[i].ownerId,
                this.farmDatas.lands[i].place,
                this.farmDatas.lands[i].rich,
                this.farmDatas.lands[i].name,
                // 1,
                this.farmDatas.lands[i].type,
                // 1,
                this.farmDatas.lands[i].status,
                this.farmDatas.lands[i].pdId,
                i==firsrtNoOpenLand?true:false,//是否显示指示牌
                this.getChildByName("item"+i).getChildByName("gradeSymble"),
                this.farmDatas.lands[i].openStatus//土地开发状态0 1 2;
            );
            this.lands.push(this.land);
        }
    }
    //初始化种子
    _proto.onLoadSeed = function(){
        this.seeds = [];
        for(var i = 0;i<12;i++){
            var seedTemp = this.getChildByName("item"+i).getChildByName('seed'+i);
            this.seed = new Seed(
                seedTemp,
                1,
                this.seedInfo[i].id,
                this.seedInfo[i].ownerId,
                this.seedInfo[i].seedId,
                this.seedInfo[i].status,
                this.seedInfo[i].nextStsTime,
                this.seedInfo[i].cnt,
                this.seedInfo[i].originalIncome,
                this.seedInfo[i].rich,
                this.seedInfo[i].wettability,
                this.seedInfo[i].illuminance,
                this.seedInfo[i].health,
                this.seedInfo[i].totalIncome,
                this.seedInfo[i].steal,
                this.seedInfo[i].totalStael,
                this.seedInfo[i].sWater,
                this.seedInfo[i].oWater,
                this.seedInfo[i].fruitId
            );
            this.seeds.push(this.seed);
        };
        // Laya.timer.once(1000,this,this.connectWs);
    }
    _proto.updateDog = function(){
        var that = this;
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
    }
    //链接websocket
    // _proto.connectWs = function(){
    //     var that = this;
    //     Http.socket('ws://192.168.19.222:8080/api/websocket/'+this._palyerId,null,function(data){
    //         var data = JSON.parse(data);
    //         console.log(data);
    //         if(data.msgType=="1"){
    //             if(data.action=='land'){
    //                 LayaSample.farm.timerTask();
    //             };
    //             if(data.action=='dog'){
    //                 that.updateDog();
    //             }
    //         };
    //     },function(){
    //         var noSeedTip = new TipDialog("链接失败","消息服务链接失败，请点击确定重新连接!",_proto.connectWs,null);
    //             LayaSample.farm.alertLayer.visible = true;
    //             Laya.stage.addChild(noSeedTip);
    //             noSeedTip.showThis();
    //             // Laya.Tween.to(noSeedTip,{scaleY:1,scaleX:1},200,null,null);
    //     },function(){
    //           var noSeedTip = new TipDialog("链接失败","消息服务链接关闭，请点击确定重新连接!",_proto.connectWs,null);
    //             LayaSample.farm.alertLayer.visible = true;
    //             Laya.stage.addChild(noSeedTip);
    //             noSeedTip.showThis();
    //     });
    // };
    //土地种子定时更新
    _proto.LoopUpdate = function(){
        Laya.timer.loop(60000,this,this.message);
    }
    //需要定时更新的任务 
    _proto.timerTask = function(){
        var that = this;
        Http.get("/api/game/loadPlayer",null,function(data){
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return;
            }
            shareParam = '?superId='+data.obj.userId+'&field2='+data.obj.field2;
            console.log('---------------------'+shareParam);
            that.farmDatas = data.obj;//农场数据
            that.seedInfo = util.creSeedArr(that.farmDatas.lands,that.farmDatas.playerPlantingDetail);//种子数组
            //循环数组更新状态
            for(var i = 0;i<12;i++){
                that.seeds[i].type = 1;
                that.seeds[i].ownerId = that.seedInfo[i].ownerId;
                that.seeds[i].seedId = that.seedInfo[i].seedId;
                that.seeds[i].status = that.seedInfo[i].status;
                that.seeds[i].nextStsTime = that.seedInfo[i].nextStsTime;
                that.seeds[i].cnt = that.seedInfo[i].cnt;
                that.seeds[i].originalIncome = that.seedInfo[i].originalIncome;
                that.seeds[i].rich = that.seedInfo[i].rich;
                that.seeds[i].wettability = that.seedInfo[i].wettability;
                that.seeds[i].illuminance = that.seedInfo[i].illuminance;
                that.seeds[i].totalIncome = that.seedInfo[i].totalIncome;
                that.seeds[i].steal = that.seedInfo[i].steal;
                that.seeds[i].totalStael = that.seedInfo[i].totalStael;
                that.seeds[i].sWater = that.seedInfo[i].sWater;
                that.seeds[i].oWater = that.seedInfo[i].oWater;
                that.seeds[i].fruitId = that.seedInfo[i].fruitId;
                that.seeds[i].loadSeed();
            }
            //得到第一块未开垦土地索引
            var firsrtNoOpenLand = 0;
            for(var j = 0;j<that.landNum;j++){
                if(that.farmDatas.lands[j].status!=0){
                    firsrtNoOpenLand++;
                    // console.log(firsrtNoOpenLand);
                }
            }
            for(var i = 0;i<12;i++){
                that.lands[i].isHasSedd = that.farmDatas.lands[i].pdId>0?true:false;
                that.lands[i].seed = that.seeds[i];
                that.lands[i].id = that.farmDatas.lands[i].id;
                that.lands[i].ownerId = that.farmDatas.lands[i].ownerId;
                that.lands[i].place = that.farmDatas.lands[i].place;
                that.lands[i].rich = that.farmDatas.lands[i].rich;
                that.lands[i].name = that.farmDatas.lands[i].name;
                that.lands[i].type = that.farmDatas.lands[i].type;
                that.lands[i].status = that.farmDatas.lands[i].status;
                that.lands[i].pdId = that.farmDatas.lands[i].pdId;
                that.lands[i].openStatue = that.farmDatas.lands[i].openStatus;
                that.lands[i].symbleStatue = i==firsrtNoOpenLand?true:false;
                that.lands[i].loadLand();
            }
            LayaSample.header.loadHeaderDatas(data.obj);
            that.updateStatusByNextTime();//拿到了上面
        },["Authorization",that.token])
        // this.updateStatusByNextTime();//6月8号拿到了上面
    }
    //得到作物下一状态时间到达时间后更新作物信息
    _proto.updateStatusByNextTime = function(){
         var that = this;
         Http.get("/api/game/loadPlayer",null,function(data){
             console.log(data);
             if(!data.success|!data.obj.playerPlantingDetail.length){
                 return;
             };
            shareParam = '?superId='+data.obj.userId+'&field2='+data.obj.field2;
            console.log('---------------------'+shareParam);
             var nextStsTimeArr = [];
             var plantingDetail = data.obj.playerPlantingDetail;
             var _tmpTime = parseInt(data.obj.date);//6月8号改为服务器时间
             for(var i = 0;i<plantingDetail.length;i++){
                // var _tmpTime = (new Date()).getTime();//客户端时间
                // var _tmpTime = parseInt(data.obj.date);//6月8号改为服务器时间
                if(plantingDetail[i].nextStsTime-_tmpTime>0){
                    nextStsTimeArr.push(plantingDetail[i].nextStsTime);
                }
             };
             if(!nextStsTimeArr.length) return;
             console.log(nextStsTimeArr);
             //得到下个状态最接近现在的时间
             var minNextTime = Math.min.apply(null,nextStsTimeArr);
             //得到当前时间
            //  var nowTime = (new Date()).getTime();//改为服务器时间
             //得到现在距下一个状态的时间差
             var updateTime = minNextTime - _tmpTime;
             if(updateTime<=0){
                 that.updateStatusByNextTime();
             }
            //  console.log(updateTime);
             Laya.timer.clear(that,that.timerTask);
             Laya.timer.once(updateTime+1000,that,that.timerTask);//在更新时间上多加1s钟
         },["Authorization",that.token])
    }
    //初始化神像
    _proto.onLoadStatue = function(){
        this.statues = [];
        for(var i = 0;i<3;i++){
            this.statueItem = new Statue(this.statue.getChildByName("statue_"+(i+1)),this.statueInfo[i].isActive,this.statueInfo[i].experience,i);
            // console.log(i)
            this.statues.push(this.statueItem);
        }
    }
    //显示升级房屋弹窗
    _proto.showUpgradeHouseUI = function(){
        LayaSample.newFunTip.showThis();
        if(1) return;
        if(!LayaSample.houseGrade){
            LayaSample.houseGrade = new HouseGrade();
        }
        Laya.stage.addChild(LayaSample.houseGrade);
        LayaSample.houseGrade.showThisUI();
    }
    //显示狗对话框
    _proto.showDogShop = function(){
        var that = this;
        if(!LayaSample.dogShop){
            LayaSample.dogShop = new DogShop();
            Laya.stage.addChild(LayaSample.dogShop);
        }
        Http.get("/api/game/loadPlayer",null,function(result){
            if(!result.success){
                LayaSample.littleTip.showThis(result.msg);
            }
            LayaSample.dogShop.setUI(result.obj.dog.type,result.obj.dog.hunger);//更新狗商店
        },["Authorization",that.token]);
        LayaSample.dogShop.setUI(this.farmDatas.dog.type,this.farmDatas.dog.hunger);
        LayaSample.dogShop.showThis();
    }
    _proto.onSelect = function(index,array){
        // console.log("当前选择的项目索引： index= ", index);
        // console.log(this.data[index]);
        // //检查是否有实例化的好友农场如果没有将实例化的好友农场赋给全局对象的friendsFarm属性
        // // if(!LayaSample.friendsFarm){
            
        // // }
        // LayaSample.friendsFarm = new FriendsFarm(this.data[index]);
        // //移除当前农场UI
        // this.visible = false;
        // LayaSample.top.visible = false;
        // //添加好友农场到舞台
        // Laya.stage.addChild(LayaSample.friendsFarm);
    }
    //得到好友列表
    _proto.showFriendList = function(){
        if(!LayaSample.friendList){
            LayaSample.friendList = new  FriendList();
            Laya.stage.addChild(LayaSample.friendList);
        }
        LayaSample.friendList.showThis();
        //新手引导提示点击赠送按钮
        if(!ISGIVE){
            LayaSample.greenHandGuide.step_clicl_give();
        }else if(ISGIVE&&!ISDONENEW){
            LayaSample.greenHandGuide.steal_click_home();
        }
    }
    //按钮反馈
    _proto.getFeedBtn = function(){
        this.feedBtn = [
            this.myHome,//我的家园
            this.Toannounce,//公告牌按钮
            this.famlilyMune.getChildByName("shop"),//我的家园-商店
            this.famlilyMune.getChildByName("entrepot"),//仓库
            this.famlilyMune.getChildByName("exchange"),//兑换中心
            this.famlilyMune.getChildByName("userCenter"),//用户中心
            // this.buyer,
            //this.myOrchard,//我的果园吧
            this.addFriendBtn,//一键添加好友按钮
            // this.orchardMenu.getChildByName("announce"),//公告
            // this.orchardMenu.getChildByName("strategy"),//攻略
            // this.orchardMenu.getChildByName("usercenter"),//用户中心
            // this.orchardMenu.getChildByName("market"),//行情
            LayaSample.top.header.getChildByName("headerToggle"),//下拉菜单按钮
            LayaSample.top.header.getChildByName("toggleMenu").getChildByName("log"),//日志
            LayaSample.top.header.getChildByName("toggleMenu").getChildByName("rank")//排名
        ]
        new FarmBtn(this.feedBtn);
    }
    return Farm;
})(ui.FarmUI)
