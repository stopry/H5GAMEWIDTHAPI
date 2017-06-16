//Land（土地）逻辑类
var FriendsLand = (function(){
    // params——土地-土地等级-是否有种子
    function FriendsLand(land,isHasSedd,toolBox,toolBoxY,seed,oprTipLayer,id,ownerId,place,rich,name,type,status,pdId){
        this.land = land;//土地
        //土地等级-根据土地等级切换土地皮肤
        this.isHasSedd = isHasSedd;//是否有种子
        this.toolBox = toolBox;//工具箱
        this.toolBox.active = false;//工具箱默认状态为未激活
        this.toolBoxY = toolBoxY;//工具箱的y值
        this.toolBoxShowY = this.toolBoxY-this.toolBoxY/1;//工具箱激活时的y值
        this.seed = seed;//种子 
        this.oprTipLayer = oprTipLayer;//操作当前土地提示层
        /**数据参数start */
        this.id = id;//主键id
        this.ownerId = ownerId;//归属id
        this.place = place;//土地位置 1-12
        this.rich = rich;//肥沃度
        this.name = name;//土地类型名称
        this.type = type;//土地类型 1 2 3 黄土地 红土地 黑土地
        this.status = status;//状态 0 1 2 未开垦 闲置 种植
        this.pdId = pdId;//种子id 对应的种子id为pdId的种子    
        /**数据参数end */
        //执行加载土地
        this.loadLand();
        //土地添加点击事件——事件名称-执行域-执行方法;
        //点击空白区域重置工具箱
        Laya.stage.on(Laya.Event.CLICK,this,this.clickBlank);
        this.land.on(Laya.Event.CLICK,this,this.oprLand);
    }
    var _proto = FriendsLand.prototype;
    //加载土地
    _proto.loadLand = function(){
        this.setToolStyle();
        this.getToken();
        this.setLandUI(this.type);
        //种植
        // this.toolBox.getChildByName("sow").on(Laya.Event.CLICK,this,this.sowSeed);
        //施肥
        // this.toolBox.getChildByName("grouSecTool").getChildByName("fertiliZation").on(Laya.Event.CLICK,this,this.fertiLizer);
        //铲除-判断是否在凋谢期否则进行确认框操作
        // this.toolBox.getChildByName("grouSecTool").getChildByName("upRoot").on(Laya.Event.CLICK,this,this.judgeUproot);
        //浇水
        this.toolBox.getChildByName("grouSecTool").getChildByName("watering").on(Laya.Event.CLICK,this,this.watering);
        this.toolBox.getChildByName("grouSecToolSteal").getChildByName("watering").on(Laya.Event.CLICK,this,this.watering);
        //收割
        this.toolBox.getChildByName("grouSecToolSteal").getChildByName("steal").on(Laya.Event.CLICK,this,this.reap);
        //铲除已收割植物
        // this.toolBox.getChildByName("upRoot").on(Laya.Event.CLICK,this,this.uproot);
        //添加植物详细信息框到舞台
        this.addSeedDetailInfo();
        this.land.on(Laya.Event.MOUSE_DOWN,this,this.mouseDownHandler);
        this.land.on(Laya.Event.MOUSE_UP,this,this.mouseUpHandler);
    };
    //设置工具的显示
    _proto.setToolStyle = function(){
        // this.toolBox.getChildByName("sow").visible = false;
        // this.toolBox.getChildByName("upRoot").visible = false;
        this.toolBox.getChildByName("grouSecTool").getChildByName("upRoot").visible = false;
        this.toolBox.getChildByName("grouSecTool").getChildByName("fertiliZation").visible = false;
    }
    //鼠标按下事件处理
    _proto.mouseDownHandler = function(){
        TIMER = new Date().getTime();
        if(this.status!=2) return;
        if(this.isHasSedd){
            Laya.timer.once(300,this,this.showSeedDetailInfo);
        };
    }
    //鼠标抬起事件处理
    _proto.mouseUpHandler = function(){
        var timeEnd = new Date().getTime();
        if(timeEnd-HOLD_TIME>TIMER){
            //长按事件，取消点击事件
            this.land.off(Laya.Event.CLICK,this,this.oprLand);
        }else{
            //点击事件重新绑定点击事件
            this.land.on(Laya.Event.CLICK,this,this.oprLand);
            Laya.timer.clear(this,this.showSeedDetailInfo);
        }
    } 
    _proto.clickhandler = function(e){
        console.log("发生点击");
    }
    //添加种子悬浮信息框到舞台 
    _proto.addSeedDetailInfo = function(){
        if(!LayaSample.seedInfo){
            LayaSample.seedInfo = new SeedInfo();
        }
        LayaSample.seedInfo.zOrder = 99;
        Laya.stage.addChild(LayaSample.seedInfo);
    }
    //长按事件显示种子详细信息
    _proto.showSeedDetailInfo = function(){
        var that = this;
        var x = Laya.stage.mouseX;
         if(x<120){
            x = x+50;
        }
        if(x>600){
            x = x-50; 
        }
        var y = Laya.stage.mouseY - LayaSample.seedInfo.height ;
        LayaSample.seedInfo.x = x;
        LayaSample.seedInfo.y = y;
        Http.get("/api/game/getDetaile",{id:that.pdId},function(data){
            console.log(data);
            var nowTime = new Date().getTime();//当前时间戳
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return;
            }
            var data = data.obj;
            var status;
            var nextStaus;
            var mature;
            var time;
            if(data.status>=0){
                switch(data.status){
                    case 0:
                        status = "种子期"
                        nextStaus = "后发芽"
                    break;
                    case 1:
                        status = "发芽期"
                        nextStaus = "后进入成长期"
                    break;
                    case 2:
                        status = "成长期"
                        nextStaus = "后成熟"
                    break;
                    case 3:
                        status = "成熟期"
                    break;
                    case 4:
                        status = "凋谢期"
                    break;
                    default:
                    status = "你猜"
                };
                //成熟期之前显示的描述
                time = util.getCountDown(data.nextStsTime)+nextStaus;
            }
            var process = (nowTime-data.lastStsTime)/(data.nextStsTime-data.lastStsTime);
            console.log(process);
            //成熟后
            if(data.status>=3){
                mature = data.status==3?"已成熟,请尽快偷取":"已凋谢,请铲除";
                LayaSample.seedInfo.seedInfo.getChildByName("grouProgress").visible = false;
                LayaSample.seedInfo.seedInfo.getChildByName("clock").visible = false;
            };
            LayaSample.seedInfo.seedInfo.getChildByName("grouProgress").visible = true;
            LayaSample.seedInfo.seedInfo.getChildByName("clock").visible = true;
            var processText = data.status>2?1:process;
            var desc = data.status>2?mature:time;
            LayaSample.seedInfo.showThis("水稻1号",status,desc,processText);
        },["Authorization",that.token])
    }
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //设置土地皮肤接口
    _proto.setLandUI = function(type){
        // 如果土地未开垦
        if(type==1&&this.status<=0){
            this.land.skin = "ui/land-1.png";//类型1黄土地
            return;
        } 
        switch(type)
        {
        case 1:
            this.land.skin = "ui/land0.png";//类型1黄土地
        break;
        case 2:
            this.land.skin = "ui/redLand .png";//类型2红土地
        break;
        case 3:
            this.land.skin = "ui/blackLand.png";//类型3黑土地
        break;
        default:
            this.land.skin = "ui/land-1.png";
        }
    }
    //初始化工具箱
    _proto.resetToolBox = function(){
        //如果是激活状态
        if(this.toolBox.active){
            var y = this.toolBoxY-this.toolBoxY/0.3;
            // Laya.Tween.to(this.toolBox.getChildByName("sow"),{scaleY:0,scaleX:0,y:y},300,Laya.Ease.backIn,Laya.Handler.create(this,this.hideToolBox));
            // Laya.Tween.to(this.toolBox.getChildByName("upRoot"),{scaleY:0,scaleX:0,y:y},300,Laya.Ease.backIn,Laya.Handler.create(this,this.hideToolBox));
            // Laya.Tween.to(this.toolBox.getChildByName("reap"),{scaleY:0,scaleX:0,y:y},300,Laya.Ease.backIn,Laya.Handler.create(this,this.hideToolBox));
            Laya.Tween.to(this.toolBox.getChildByName("grouSecTool"),{scaleY:0,scaleX:0,y:y},300,Laya.Ease.backIn,Laya.Handler.create(this,this.hideToolBox));
            Laya.Tween.to(this.toolBox.getChildByName("grouSecToolSteal"),{scaleY:0,scaleX:0,y:y},300,Laya.Ease.backIn,Laya.Handler.create(this,this.hideToolBox));
        }else{
            // console.log("工具箱已经隐藏");
        }
        //设为未激活
        this.toolBox.active = false;
    }
    //点击空白区域隐藏工具箱
    _proto.clickBlank = function(event){
        event.stopPropagation();
        LayaSample.seedInfo.hideThis();
        var target = event.target.name;
        // console.log(target);
        if(!target){
            return;
        }
        if(target!="land"){
            this.resetToolBox();
        }
        // console.log(target);
    }
    //隐藏工具箱Box
    _proto.hideToolBox = function(){
        this.oprTipLayer.visible = false;
        this.toolBox.visible = false;
        this.toolBox.active = false;
    }
    //显示工具箱
    _proto.showToolBox = function(){
        this.toolBox.visible = true;
    }
    //激活工具箱
    _proto.activeToolBox = function(){
        if(!this.toolBox.active&&this.status>0){
            this.showToolBox();
            this.toolBox.active = true;
            this.oprTipLayer.visible = true;
            return true;
        }
        return false;
    }
    // //种下种子
    // _proto.sowSeed = function(){
    //     var that = this;
    //     this.resetToolBox();
    //     var plantDatas = {
    //         "landId": that.id,
    //         "speedId": 1,//默认种子id1
    //     }
    //     this.getToken();
    //     Http.post("/api/game/plant",JSON.stringify(plantDatas),function(data){
    //         if(!data.success){
    //             LayaSample.littleTip.showThis(data.msg);
    //             return false;
    //         }
    //         LayaSample.littleTip.showThis("种植成功");

    //     },["Authorization",that.token])
    //     //种子数小于1
    //     if(!Service.assets.seeds<80){
    //         var noSeedTip = new TipDialog("种子不足","种子不足，是否去商店够买？",that.loadShop,null);
    //         LayaSample.farm.alertLayer.visible = true;
    //         Laya.stage.addChild(noSeedTip);
    //         noSeedTip.showThis();
    //         // Laya.Tween.to(noSeedTip,{scaleY:1,scaleX:1},300,Laya.Ease.backIn,null);
    //         return false;
    //     }
    //     this.seed.type = 1;
    //     this.seed.status = 0;//种子进入第一阶段种子期
    //     this.seed.loadSeed();//加载种子
    //     this.isHasSedd = true;//已经有种子
    // }
    //施肥
    // _proto.fertiLizer = function(){
    //     var that = this;
    //     this.resetToolBox();
    //     var applyDatas = {
    //         "itemId":5001,//道具id
    //         "landId": that.id,//土地id
    //     }
    //     this.getToken();
    //     Http.post("/api/game/apply",JSON.stringify(applyDatas),function(data){
    //         if(!data.success){
    //             LayaSample.littleTip.showThis(data.msg);
    //             return false;
    //         }
    //         LayaSample.littleTip.showThis("施肥成功");
    //         that.rich += 100;//肥沃度加100
    //         that.seed.type = 1;
    //         // that.seed.status += 1;//种子状态值+1
    //         that.seed.rich +=100;
    //         that.seed.loadSeed();
    //         that.isHasSedd = true;
    //     },["Authorization",that.token])
        
    // }
    //铲除
    // _proto.uproot = function(){
    //     var that = this;
    //     this.resetToolBox();
    //     var shovelDatas = {
    //         "landId": that.id
    //     };
    //     this.getToken();
    //     Http.post("/api/game/shovel",JSON.stringify(shovelDatas),function(data){
    //         if(!data.success){
    //             LayaSample.littleTip.showThis(data.msg);
    //             return false;
    //         }
    //         LayaSample.littleTip.showThis("铲除成功");
    //         that.seed.type = null;
    //         that.seed.status = null;
    //         that.seed.loadSeed();
    //         that.isHasSedd = false;
    //     },["Authorization",that.token]);
    // };
    //铲除操作判断
    // _proto.judgeUproot = function(){
    //     var that = this;
    //     var shovelDatas = {
    //         "landId": that.id
    //     };
    //     if(that.seed.status!=4){
    //         var noFadeTip = new TipDialog("确认铲除吗？","植物未凋谢，是否铲除？",function(){
    //             Http.post("/api/game/shovel",JSON.stringify(shovelDatas),function(data){
    //                 if(!data.success){
    //                     LayaSample.littleTip.showThis(data.msg);
    //                     return false;
    //                 }
    //                 LayaSample.littleTip.showThis("铲除成功");
    //                 that.seed.type = null;
    //                 that.seed.status = null;
    //                 that.seed.loadSeed();
    //                 that.isHasSedd = false;
    //             },["Authorization",that.token]);
    //         },null);
    //         noFadeTip.zOrder = 999;
    //         LayaSample.farm.alertLayer.visible = true;
    //         Laya.stage.addChild(noFadeTip);
    //         noFadeTip.showThis();
    //         // Laya.Tween.to(noFadeTip,{scaleY:1,scaleX:1},300,Laya.Ease.backIn,null);
    //         return;
    //     }else{
    //         that.uproot();
    //     }
    // }
    
    //偷取
    _proto.reap = function(){
        var _mouseX = Laya.stage.mouseX;
        var _mouseY = Laya.stage.mouseY;
        var that = this;
        this.resetToolBox();
        var pickDatas = {
            landId:that.id,
            toId:that.ownerId
        };
        Http.post("/api/game/steal",JSON.stringify(pickDatas),function(data){
            console.log(data);
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return false;
            }

            var f_pic = "ui/"+data.obj.item.pic+".png";
            var f_cnt = "+"+data.obj.cnt;
            if(!LayaSample.getAni){
                LayaSample.getAni = new GetAni();
            }
            Laya.stage.addChild(LayaSample.getAni);
            LayaSample.getAni.showThis(_mouseX,_mouseY,f_pic,f_cnt);

            Http.get("/api/game/loadPlayer",null,function(result){
                if(!result.success) return;
                LayaSample.header.loadHeaderDatas(result.obj);     
            },["Authorization",that.token])

            LayaSample.littleTip.showThis("偷取成功");
            that.seed.type = 1;
            that.seed.steal += 1;
            that.seed.totalStael += 1;

            // this.seed.wettability -= 1;//可收割次数减一
            // if(this.seed.wettability<1){
            //     this.seed.status = 4;//收割次数为0是凋谢
            //     this.seed.loadSeed();
            // }else{
            //     this.seed.status = 3;//还可以收割撞他不变
            //     this.seed.loadSeed();
            // }
            this.isHasSedd = true;
            if(!ISDONENEW){
                LayaSample.greenHandGuide.steal_click_backhome();
            }
            LayaSample.friendsFarm.timerTask();
        },["Authorization",that.token]);
    }
    //浇水
    _proto.watering = function(){
        var that = this;
        this.resetToolBox();
        var waterDatas = {
            "landId":that.id,//土地id
            "toId": that.ownerId,//给自己浇水-自己id
        }
        this.getToken();
        Http.post('/api/game/water',JSON.stringify(waterDatas),function(data){
            console.log(data);
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return false;
            }
            LayaSample.littleTip.showThis("浇水成功");
            
            Http.get("/api/game/loadPlayer",null,function(result){
                if(!result.success) return;
                LayaSample.header.loadHeaderDatas(result.obj);     
            },["Authorization",that.token])

            that.seed.wettability += 100;
            if(that.seed.wettability>=100) that.seed.wettability = 100;
            that.seed.loadSeed();
            that.isHasSedd = true;
            LayaSample.friendsFarm.timerTask();
        },["Authorization",that.token]);
    }
    //土地操作
    _proto.oprLand = function(){
        console.log(this.status);
        //如果土地未开垦显示升级土地弹窗
        /*未开垦土地不做任何操作*/
        if(this.status<=0){
            return;
        }
        /*除了成熟期可以 偷取 其他都是浇水*/
        // console.log(this.type);
        for(var k = 0;k<12;k++){
            LayaSample.friendsFarm.lands[k].resetToolBox();
        }
        if(this.activeToolBox()){
            this.toolBox.visible = true;
            //如果土地为闲置状态并且没有种子——可以种植    浇水
            if(this.status==1&&!this.isHasSedd){
                Laya.Tween.to(
                    this.toolBox.getChildByName("grouSecTool"),
                    {scaleY:1,scaleX:1,y:this.toolBoxShowY},
                    300,Laya.Ease.backInOut,
                    null
                );
                //如果土地为种植状态并并且有种子 且种子未成熟——可以施肥或铲除    浇水
            }else if(this.status==2&&this.isHasSedd&&this.seed.status<3){
                Laya.Tween.to(
                    this.toolBox.getChildByName("grouSecTool"),
                    {scaleY:1,scaleX:1,y:this.toolBoxShowY},
                    300,Laya.Ease.backInOut,
                    null
                );
                //如果土地为种植状态，有种子，种子已经成熟——可以收割     可以偷
            }else if(this.status==2&&this.isHasSedd&&this.seed.status==3){
                Laya.Tween.to(
                    this.toolBox.getChildByName("grouSecToolSteal"),
                    {scaleY:1,scaleX:1,y:this.toolBoxShowY},
                    300,Laya.Ease.backInOut,
                    null
                );
                //如果土地为种植状态，并且有种子，种子状态等于4（已经收割）——可以铲除     浇水
            }else if(this.status==2&&this.isHasSedd&&this.seed.status==4){
                Laya.Tween.to(
                    this.toolBox.getChildByName("grouSecTool"),
                    {scaleY:1,scaleX:1,y:this.toolBoxShowY},
                    300,Laya.Ease.backInOut,
                    null
                );
                
            }
        }else{
            console.log("工具箱未激活");
            return false;
        }
        if(!ISDONENEW){
            LayaSample.greenHandGuide.steal_click_stealicon();
        }
    }
    //加载商店
    // _proto.loadShop = function(){
    //     if(!LayaSample.shop){
    //         LayaSample.shop = new Shop();
    //     }
    //     Laya.stage.addChild(LayaSample.shop);
    //     LayaSample.farm.alertLayer.visible = true;
    //     Laya.Tween.to(LayaSample.shop,{scaleY:1,scaleX:1},300,Laya.Ease.backIn,null);
    // }
    //种地
    // _proto.seedLand = function(){

    // }
    return FriendsLand;
})()