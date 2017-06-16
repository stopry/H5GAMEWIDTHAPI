//Land（土地）逻辑类
var Land = (function(){
    // params——土地-土地等级-是否有种子
    function Land(land,isHasSedd,toolBox,toolBoxY,seed,oprTipLayer,id,ownerId,place,rich,name,type,status,pdId,symbleStatue,symble,openStatue){
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
        this.symbleStatue = symbleStatue;//是否展示升级指示牌
        this.symble = symble;//土地升级指示牌
        this.openStatue = openStatue;//土地可开垦状态0 1 2 不可开垦不可升级 可开垦 可升级    
        /**数据参数end */
        this.isWatering = false;//默认未浇水
        //执行加载土地
        this.loadLand();
        //土地添加点击事件——事件名称-执行域-执行方法;
        //点击空白区域重置工具箱
        Laya.stage.on(Laya.Event.CLICK,this,this.clickBlank);
        this.land.on(Laya.Event.CLICK,this,this.oprLand);
        this.loading = false;//是否在请求中
    }
    var _proto = Land.prototype;
    //加载土地
    _proto.loadLand = function(){
        this.symble.visible = this.symbleStatue;//判断指示牌的显示隐藏
        this.getToken();
        this.setLandUI(this.type);
        //种植
        this.toolBox.getChildByName("sow").on(Laya.Event.CLICK,this,this.sowSeed);
        this.toolBox.getChildByName("sow_grade").getChildByName("sow").on(Laya.Event.CLICK,this,this.sowSeed);
        //施肥
        this.toolBox.getChildByName("grouSecTool").getChildByName("fertiliZation").on(Laya.Event.CLICK,this,this.fertiLizer);
        //铲除-判断是否在凋谢期否则进行确认框操作
        this.toolBox.getChildByName("grouSecTool").getChildByName("upRoot").on(Laya.Event.CLICK,this,this.judgeUproot);
        //浇水
        this.toolBox.getChildByName("grouSecTool").getChildByName("watering").on(Laya.Event.CLICK,this,this.watering);
        //收割
        this.toolBox.getChildByName("reap").on(Laya.Event.CLICK,this,this.reap);
        //铲除已收割植物
        this.toolBox.getChildByName("upRoot").on(Laya.Event.CLICK,this,this.uproot);
        //升级土地
        this.toolBox.getChildByName("sow_grade").getChildByName("upGrade").on(Laya.Event.CLICK,this,this.gradeLand);
        //添加植物详细信息框到舞台
        this.addSeedDetailInfo();
        this.land.on(Laya.Event.MOUSE_DOWN,this,this.mouseDownHandler);
        this.land.on(Laya.Event.MOUSE_UP,this,this.mouseUpHandler);
    };
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
    //得到种子状态
    _proto.getSeedDetail = function(){
        var that = this;
        Http.get("/api/game/land/get",{landId:that.id},function(datas){
            if(!datas.success){
                LayaSample.littleTip.showThis(datas.msg);
                return;
            }
            var pdId = datas.obj.pdId
            if(!pdId) return;
            Http.get("/api/game/getDetaile",{id:pdId},function(data){
                if(!data.success){
                    LayaSample.littleTip.showThis(data.msg);
                    return;
                }
                var status = data.obj.status;
                that.seed.status = status;
                that.seed.loadSeed();
            },["Authorization",that.token]);
        },["Authorization",that.token])
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
        console.log(x);
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
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return;
            }
            // var nowTime = new Date().getTime();//当前时间戳
            var nowTime = parseInt(data.obj.date);
            var status;
            var nextStaus;
            var mature;
            var time;
            var data = data.obj
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
            console.log(util.formatTimeForH5(nowTime),util.formatTimeForH5(data.lastStsTime),util.formatTimeForH5(data.nextStsTime));
            var process = (nowTime-data.lastStsTime)/(data.nextStsTime-data.lastStsTime);
            console.log(process);
            //成熟后
            if(data.status>=3){
                mature = data.status==3?"已成熟,请尽快收割":"已凋谢,请铲除";
                LayaSample.seedInfo.seedInfo.getChildByName("grouProgress").visible = false;
                LayaSample.seedInfo.seedInfo.getChildByName("clock").visible = false;
            };
            LayaSample.seedInfo.seedInfo.getChildByName("grouProgress").visible = true;
            LayaSample.seedInfo.seedInfo.getChildByName("clock").visible = true;
            var processText = data.status>2?1:process;
            var desc = data.status>2?mature:time;
            var name = data.seedName;
            LayaSample.seedInfo.showThis(name,status,desc,processText);
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
            Laya.Tween.to(this.toolBox.getChildByName("sow"),{scaleY:0,scaleX:0,y:y},300,Laya.Ease.backIn,Laya.Handler.create(this,this.hideToolBox));
            Laya.Tween.to(this.toolBox.getChildByName("upRoot"),{scaleY:0,scaleX:0,y:y},300,Laya.Ease.backIn,Laya.Handler.create(this,this.hideToolBox));
            Laya.Tween.to(this.toolBox.getChildByName("reap"),{scaleY:0,scaleX:0,y:y},300,Laya.Ease.backIn,Laya.Handler.create(this,this.hideToolBox));
            Laya.Tween.to(this.toolBox.getChildByName("grouSecTool"),{scaleY:0,scaleX:0,y:y},300,Laya.Ease.backIn,Laya.Handler.create(this,this.hideToolBox));
            Laya.Tween.to(this.toolBox.getChildByName("sow_grade"),{scaleY:0,scaleX:0,y:y},300,Laya.Ease.backIn,Laya.Handler.create(this,this.hideToolBox));
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
    //种下种子
    _proto.sowSeed = function(){
        if(this.loading) return;
        var that = this;
        this.resetToolBox();
        this.getToken();
        //先得到仓库是否有种子
        that.loading = true;
         Http.get("/api/game/getPlayerItemDetailByType",{type:"01"},function(data){
            that.loading = false;
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return;
            }
            var data = data.obj;
            if(!data.length){
                //种子数小于1
                var noSeedTip = new TipDialog("种子不足","种子不足，是否去商店够买？",that.loadShop,null);
                LayaSample.farm.alertLayer.visible = true;
                Laya.stage.addChild(noSeedTip);
                noSeedTip.showThis();
                // Laya.Tween.to(noSeedTip,{scaleY:1,scaleX:1},200,null,null);
                return false;
            }else{
                if(!LayaSample.selSeedDia){
                    LayaSample.selSeedDia = new SelSeedDia(that.id,function(){
                        that.seed.type = 1;
                        that.seed.status = 0;//种子进入第一阶段种子期
                        that.seed.loadSeed();//加载种子
                        that.status = 2;//土地状态变为种植状态
                        that.isHasSedd = true;//已经有种子
                        that.getSeedDetail();
                        //新手引导第三步
                        if(!ISDONENEW){
                            LayaSample.greenHandGuide.step3();
                        };
                        LayaSample.farm.timerTask();
                    });
                }
                Laya.stage.addChild(LayaSample.selSeedDia);
                LayaSample.selSeedDia.showThis();
                return;

                // var plantDatas = {
                //     "landId": that.id,
                //     "speedId": data[0].itemTypeId,//默认种子id1
                // }
                // Http.post("/api/game/plant",JSON.stringify(plantDatas),function(datas){
                //     console.log(datas,plantDatas);
                //     if(!datas.success){
                //         LayaSample.littleTip.showThis(datas.msg);
                //         return false;
                //     }
                //     LayaSample.littleTip.showThis("种植成功");
                //     that.seed.type = 1;
                //     that.seed.status = 0;//种子进入第一阶段种子期
                //     that.seed.loadSeed();//加载种子
                //     that.status = 2;//土地状态变为种植状态
                //     that.isHasSedd = true;//已经有种子
                //     that.getSeedDetail();
                //     //新手引导第三步
                //     if(!ISDONENEW){
                //         LayaSample.greenHandGuide.step3();
                //     };
                // },["Authorization",that.token])
            }
        },["Authorization",that.token]);
    }
    //施肥
    _proto.fertiLizer = function(){
        if(this.loading) return;
        var that = this;
        this.resetToolBox();
        this.getToken();
        that.loading = true;
         Http.get("/api/game/getPlayerItemDetailByType",{type:"05"},function(msg){
            that.loading =false;
            if(!msg.success){
                LayaSample.littleTip.showThis(msg.msg);
                return false;
            }
            if(msg.obj.length<1){
                LayaSample.littleTip.showThis("肥料不足");
                return false;
            }
            var msg = msg.obj;
            var applyDatas = {
                "itemId":msg[0].itemTypeId,//道具id
                "landId": that.id,//土地id
            }
            Http.post("/api/game/apply",JSON.stringify(applyDatas),function(data){
                if(!data.success){
                    LayaSample.littleTip.showThis(data.msg);
                    return false;
                }
                LayaSample.littleTip.showThis("施肥成功");
                that.rich += 100;//肥沃度加100
                that.seed.type = 1;
                // that.seed.status += 1;//种子状态值+1
                that.seed.rich +=100;
                if(msg[0].name=="新手肥料"){
                    that.seed.status = 3;
                };
                that.seed.loadSeed();
                that.getSeedDetail();
                that.isHasSedd = true;
                //施肥成功进入第七部
                if(!ISDONENEW){
                    LayaSample.greenHandGuide.step7();
                }
                LayaSample.farm.timerTask();
            },["Authorization",that.token])
         },["Authorization",that.token])
    }
    //铲除
    _proto.uproot = function(){
        var that = this;
        this.resetToolBox();
        var shovelDatas = {
            "landId": that.id
        };
        this.getToken();
        Http.post("/api/game/shovel",JSON.stringify(shovelDatas),function(data){
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return false;
            }
            LayaSample.littleTip.showThis("铲除成功");
            that.seed.type = null;
            that.seed.status = null;
            that.status = 1;//土地设置为闲置
            that.seed.loadSeed();
            that.getSeedDetail();
            that.isHasSedd = false;
            LayaSample.farm.timerTask();
        },["Authorization",that.token]);
    };
    //铲除操作判断
    _proto.judgeUproot = function(){
        var that = this;

        //不确认铲除datas
        var ubshovelDatas = {
            "landId": that.id,
            "neglectSts":false
        }

        Http.post("/api/game/shovel",JSON.stringify(ubshovelDatas),function(msg){
            if(!msg.success){
                // LayaSample.littleTip.showThis(msg.msg);
                return false;
            }
            // LayaSample.littleTip.showThis("铲除成功");
            // that.seed.type = null;
            // that.seed.status = null;
            // that.seed.loadSeed();
            // that.isHasSedd = false;
        },["Authorization",that.token]);

        //确认铲除datas
        var shovelDatas = {
            "landId": that.id,
            "neglectSts":true
        };
        if(that.seed.status!=4){
            var noFadeTip = new TipDialog("确认铲除吗？","植物未凋谢，是否铲除？",function(){
                Http.post("/api/game/shovel",JSON.stringify(shovelDatas),function(data){
                    if(!data.success){
                        LayaSample.littleTip.showThis(data.msg);
                        return false;
                    }
                    LayaSample.littleTip.showThis("铲除成功");
                    that.seed.type = null;
                    that.seed.status = null;
                    that.seed.loadSeed();
                    that.isHasSedd = false;
                    that.getSeedDetail();
                    LayaSample.farm.timerTask();
                },["Authorization",that.token]);
            },null);
            noFadeTip.zOrder = 999;
            LayaSample.farm.alertLayer.visible = true;
            Laya.stage.addChild(noFadeTip);
            noFadeTip.showThis();
            // Laya.Tween.to(noFadeTip,{scaleY:1,scaleX:1},300,Laya.Ease.backIn,null);
            return;
        }else{
            // that.uproot();
        }
    }
    //收割
    _proto.reap = function(){
        if(this.loading) return;
        var _mouseX = Laya.stage.mouseX;
        var _mouseY = Laya.stage.mouseY;
        var that = this;
        this.resetToolBox();
        var pickDatas = {
            landId:that.id
        };
        // alert(that.id);
        this.loading = true;
        Http.post("/api/game/pick",JSON.stringify(pickDatas),function(data){
            that.loading = false;
            if(!ISDONENEW){
                LayaSample.greenHandGuide.step_click_friend();
            }
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

            LayaSample.littleTip.showThis("收割成功");

            var isFirstReap = JSON.parse(localStorage.getItem('BASEINFO')).doHarvest;
            
            if(isFirstReap==0){
                Http.get("/api/game/loadPlayer",null,function(data){
                    if(!data.success){               
                        return;
                    }else{
                        localStorage.setItem('BASEINFO',JSON.stringify(data.obj));  
                    }
                },["Authorization",that.token]);

                LayaSample.msg.arrIdx = 0;
                LayaSample.msg.msgArr = [{
                    action:"show_ck",
                    id:0,
                    msg_type:"1"
                }];
                LayaSample.msg.msgLen = LayaSample.msg.msgArr.length;
                LayaSample.msg.msgBtn.visible = LayaSample.msg.msgArr.length>0?true:false;
            }else{
                LayaSample.farm.message();//从后台获取消息
            }
            console.log(4)
            that.seed.type = 1;
            that.seed.wettability -= 1;//可收割次数减一
            if(that.seed.wettability<1){
                that.seed.status = 4;//收割次数为0是凋谢
                that.seed.loadSeed();
            }else{
                that.seed.status = 0;//还可以收割撞他不变
                that.seed.loadSeed();
            }
            that.getSeedDetail();
            that.isHasSedd = true;
            //进入开垦土地引导
            if(!ISDONENEW){
                // LayaSample.greenHandGuide.done();//结束新手引导
                // LayaSample.greenHandGuide.step_click_friend_steal();
                LayaSample.greenHandGuide.step_click_grade_1();//提示点击带升级公告牌的土地
            }
            LayaSample.farm.timerTask();
        },["Authorization",that.token]);
    }
    //浇水
    _proto.watering = function(){
        var that = this;
        this.resetToolBox();
        console.log("土地id",that.id,"所属id",that.ownerId);
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
            if(!ISDONENEW){//浇水成功进入第五步
                LayaSample.greenHandGuide.step5();
            }
            that.seed.wettability += 100;
            if(that.seed.wettability>=100) that.seed.wettability = 100;
            that.seed.loadSeed();
            that.isHasSedd = true;
            LayaSample.farm.timerTask();
        },["Authorization",that.token]);
    }
    //升级土地 
    _proto.gradeLand = function(){
        if(this.loading) return;
        var that = this;
        this.resetToolBox();
        var landId = this.id;
        this.getToken();
        this.loading = true;
        Http.get("/api/game/land/up",{landId:landId},function(data){
            that.loading = false;
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return false;
            }
            LayaSample.littleTip.showThis("升级成功");
            that.type+=1;
            that.seed.loadSeed();
            that.loadLand();
            LayaSample.farm.timerTask();
        },["Authorization",that.token])
    }
    //开垦土地
    _proto.digupLand = function(){
        var that = this;
        var landId = this.id;
        this.getToken();
        Http.get("/api/game/land/open",{landId:landId},function(data){
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return false;
            }
            LayaSample.littleTip.showThis("开垦成功");
            that.status+=1;
            this.symbleStatue = false;
            that.seed.loadSeed();
            that.loadLand();
            LayaSample.farm.timerTask();
        },["Authorization",that.token]);
    }
    //土地操作
    _proto.oprLand = function(){
        console.log(this.status);
        //如果土地未开垦并且有升级指示牌显示升级土地弹窗
        if(this.status<=0&&this.symbleStatue){  
            //如果开垦状态为1(可开垦)=>弹出是否开垦土地对话框
            if(this.openStatue==1){
                var that = this;

                if(!ISDONENEW){
                    // LayaSample.greenHandGuide.done();//结束新手引导
                    // LayaSample.greenHandGuide.step_click_friend_steal();
                    LayaSample.greenHandGuide.step_click_grade_2();//提示点击确定开垦土地
                }

                var cfmDia = new TipDialog("确定升级土地?","您的土地可以升级确定升级吗？",function(){
                    var landId = that.id;
                    that.getToken();
                    Http.get("/api/game/land/open",{landId:landId},function(data){
                        if(!data.success){
                            LayaSample.littleTip.showThis(data.msg);
                            return false;
                        }
                        LayaSample.littleTip.showThis("开垦成功");
                        that.status+=1;
                        this.symbleStatue = false;
                        that.seed.loadSeed();
                        that.loadLand();
                        LayaSample.farm.timerTask();

                        if(!ISDONENEW){
                            LayaSample.greenHandGuide.step_click_friend_steal();//点击好友图标打开好友列表界面
                        }

                    },["Authorization",that.token]);
                },null)
                Laya.stage.addChild(cfmDia);
                cfmDia.showThis();
                return;
            }
            //否则=>弹出开坑土地所需要的条件弹框
            if(!LayaSample.landGrade){
                LayaSample.landGrade = new LandGrade();
            }
            Laya.stage.addChild(LayaSample.landGrade);
            LayaSample.landGrade.showThis();
            return;
        }
        console.log(this.type);
        for(var k = 0;k<12;k++){
                LayaSample.farm.lands[k].resetToolBox();
        }
        if(this.activeToolBox()){
            this.toolBox.visible = true;
            
            //如果土地为闲置状态并且没有种子——可以种植
            if(this.status==1&&this.openStatue==2){
                Laya.Tween.to(
                    this.toolBox.getChildByName("sow_grade"),
                    {scaleY:1,scaleX:1,y:this.toolBoxShowY},
                    300,Laya.Ease.backInOut,
                    null
                );
            //如果土地为种植状态并并且有种子 且种子未成熟——可以施肥或铲除
            }else if(this.status==1&&!this.isHasSedd){
                Laya.Tween.to(
                    this.toolBox.getChildByName("sow"),
                    {scaleY:1,scaleX:1,y:this.toolBoxShowY},
                    300,Laya.Ease.backInOut,
                    null
                );
                if(!ISDONENEW){
                    LayaSample.greenHandGuide.step2();
                }
            //如果土地状态为1(已开垦并且是闲置状态)&&并且开垦状态为2(可以升级)=>弹出种植与升级选项按钮
            }else if(this.status==2&&this.isHasSedd&&this.seed.status<3){
                Laya.Tween.to(
                    this.toolBox.getChildByName("grouSecTool"),
                    {scaleY:1,scaleX:1,y:this.toolBoxShowY},
                    300,Laya.Ease.backInOut,
                    null
                );
                if(!ISDONENEW){
                    if(!this.isWatering){
                        LayaSample.greenHandGuide.step4();
                        this.isWatering = true;
                    }else{
                        LayaSample.greenHandGuide.step6();
                    }
                    
                }
                //如果土地为种植状态，有种子，种子已经成熟——可以收割
            }else if(this.status==2&&this.isHasSedd&&this.seed.status==3){
                Laya.Tween.to(
                    this.toolBox.getChildByName("reap"),
                    {scaleY:1,scaleX:1,y:this.toolBoxShowY},
                    300,Laya.Ease.backInOut,
                    null
                );
                if(!ISDONENEW){
                    LayaSample.greenHandGuide.step8();
                }
                //如果土地为种植状态，并且有种子，种子状态等于4（已经收割）——可以铲除
            }else if(this.status==2&&this.isHasSedd&&this.seed.status==4){
                Laya.Tween.to(
                    this.toolBox.getChildByName("upRoot"),
                    {scaleY:1,scaleX:1,y:this.toolBoxShowY},
                    300,Laya.Ease.backInOut,
                    null
                );
                
            }
            //如果土地等级大于1，有种子，种子等级小于4（未成熟），土地干旱——需要浇水
            // else if(this.level>1&&this.isHasSedd&&this.seed.level<4&&this.isDry){
            //     Laya.Tween.to(
            //         this.toolBox.getChildByName("watering"),
            //         {scaleY:1,scaleX:1,y:this.toolBoxShowY},
            //         300,Laya.Ease.backInOut,
            //         null
            //     );
            // }   
        }else{
            console.log("工具箱未激活");
            return false;
        }
        
    }
    //加载商店
    _proto.loadShop = function(){
        if(!LayaSample.shop){
            LayaSample.shop = new Shop();
        }
        Laya.stage.addChild(LayaSample.shop);
        LayaSample.farm.alertLayer.visible = true;
        Laya.Tween.to(LayaSample.shop,{scaleY:1,scaleX:1},300,Laya.Ease.backIn,null);
    }
    //种地
    _proto.seedLand = function(){

    }
    return Land;
})()

// Http.get("/api/game/loadPlayer",null,function(data){
//     console.log(data);
//     if(!data.success){
//         LayaSample.littleTip.showThis(data.msg);
//         that.regSusTip();
//         return;
//     }else{
//         LayaSample.littleTip.showThis("登录成功");
//         that.removeSelf();
//         if(!LayaSample.farm){
//             LayaSample.farm = new Farm(data.obj);
//         }
//         LayaSample.farm.farmDatas = data.obj;
//         Laya.stage.addChild(LayaSample.farm);    
//     }
// },["Authorization",token]);