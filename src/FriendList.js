//好友列表逻辑类
var FriendList = (function(_super){
    var Handler = Laya.Handler;
    // params——弹出层-弹出层标题-关闭按钮-列表项-List对象-点击打开弹出层的按钮-宠物
    function FriendList(){
        FriendList.super(this);
        this.zOrder = 99;
        this.isLoading = false;
        this.friendPage = 1;
        this.normalPage = 1;
        this.init();
    }
    Laya.class(FriendList,"FriendList",_super);
    var _proto = FriendList.prototype;
    _proto.init = function(){
        this.getToken();
        this.setStyle();
        this.closeBtn.on("click",this,this.hideThis);
        this.listItemClick();
        new BtnFeed(this.modelPageControl.getChildByName("nextPageBtn"));
        new BtnFeed(this.modelPageControl.getChildByName("prePageBtn"));
        new BtnFeed(this.normalPageControl.getChildByName("nextPageBtn"));
        new BtnFeed(this.normalPageControl.getChildByName("prePageBtn"));
        this.modelPageControl.getChildByName("nextPageBtn").on("click",this,this.getNextPage);
        this.modelPageControl.getChildByName("prePageBtn").on("click",this,this.getPrePage);
        this.normalPageControl.getChildByName("nextPageBtn").on("click",this,this.getNextPageN);
        this.normalPageControl.getChildByName("prePageBtn").on("click",this,this.getPrePageN);
        this.changeLogType();
    }
    //得到token
    _proto.getToken = function(){
         if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //样式设置
    _proto.setStyle = function(){
        this.pivot(this.width/2,this.height/2);
        this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        this.scale(0,0);

        // this.stageWidth = Laya.stage.width;
        // this.stageHeight = Laya.stage.height;
        // this.anchorY = 0.5;
        // this.anchorX = 0.5;
        // this.scaleX = 0;
        // this.scaleY = 0;
        // this.left = (this.stageWidth-this.width)/2;
        // this.top = (this.stageHeight-this.height)/2;
    }
    //列表事件点击处理
    _proto.listItemClick = function(){
        this.modelList.mouseHandler = new Handler(this,this.listOpr);//好友列表操作
        this.normalList.mouseHandler = new Handler(this,this.listOpr);//好友列表操作
    }
    // 列表点击回调
    _proto.listOpr = function(event,index){
        var that = this;
        event.stopPropagation();
        var _idx = index;
        if(event.type == Event.CLICK){
            var target = event.target;
            var datas = target.dataSource;
            if(target.name == "homePic"||target.name == "remove_friend"){
                Laya.Tween.to(target,{scaleY:1.05,scaleX:1.05},100,Laya.Ease.backOut,Laya.Handler.create(this,function(){
                    Laya.Tween.to(target,{scaleY:1,scaleX:1},10,Laya.Ease.backIn,null);
                }));
            };
            if(target.name == "homePic"){
                var id = target._parent._dataSource.friendId;//好友id

                if(!LayaSample.friendIdArr){
                    Http.get('/api/game/friend/listId',null,function(data){
                        if(!data.success){
                            return
                        }
                        LayaSample.friendIdArr = data.obj;
                        LayaSample.friendIdIndex = LayaSample.friendIdArr.indexOf(id);

                        console.log(LayaSample.friendIdArr)
                    },["Authorization",that.token])
                }else{
                    LayaSample.changeFriendFarm.currentIdIndex = LayaSample.friendIdArr.indexOf(id);
                    LayaSample.changeFriendFarm.init();
                }

                // console.info(target._parent._dataSource)
                // LayaSample.friendsFarm = new FriendsFarm(id);

                if(!LayaSample.friendsFarm){
                    LayaSample.friendsFarm = new FriendsFarm(id);
                    //添加好友农场到舞台
                    Laya.stage.addChild(LayaSample.friendsFarm);
                }else{
                    LayaSample.friendsFarm.friendId = id;
                    // LayaSample.friendsFarm.getLandSeed();
                    LayaSample.friendsFarm.timerTask();
                    // LayaSample.friendTop.id = id;
                    // LayaSample.friendTop.init();

                    LayaSample.friendsFarm.visible = true;
                    LayaSample.friendTop.visible = true;
                }
                //移除当前农场UI
                Laya.timer.clear(LayaSample.farm,LayaSample.farm.timerTask);//停用自己农场定时请求
                LayaSample.farm.visible = false;
                LayaSample.top.visible = false;
                this.hideThis();

                if(!ISDONENEW){
                    LayaSample.greenHandGuide.steal_click_seed();
                }
            }
            //删除好友步骤
            if(target.name == "remove_friend"){
                var fri_id = target._parent._dataSource.friendId;//好友id
                var fri_name = target._parent._dataSource.nickname;//昵称

                that.layer.visible = true;

                var removeTip = new TipDialog('','确定删除好友'+fri_name+'吗?',function(){
                    Http.get('/api/game/friend/del',{friendId:fri_id},function(datas){
                        if(!datas.success){
                            LayaSample.littleTip.showThis(datas.msg);
                            return
                        }
                        LayaSample.littleTip.showThis('删除成功');

                        //重新获取好友id列表
                        Http.get('/api/game/friend/listId',null,function(data){
                            if(!data.success){
                                return
                            }
                            // LayaSample.friendIdArr = data.obj;
                            if(LayaSample.changeFriendFarm){
                                LayaSample.changeFriendFarm.idArr = data.obj;
                            }
                            // LayaSample.changeFriendFarm.idArr = data.obj;
                        },["Authorization",that.token]);

                        that.layer.visible = false;
                        that.showPt();//重新加载普通好友
                    },["Authorization",that.token]);
                },function(){
                    LayaSample.farm.alertLayer.visible = true;
                    that.layer.visible = false;
                });
                Laya.stage.addChild(removeTip);
                removeTip.showThis();
                // Laya.Tween.to(removeTip,{scaleY:1,scaleX:1},200,null,null);
            }

            // if(target.name == "give"){
            //     //如果是游客去绑定手机号与支付宝
            //     if(ISVISITOR){
            //         if(!LayaSample.bindMobile){
            //             LayaSample.bindMobile =  new BindMobile();
            //         }
            //         Laya.stage.addChild(LayaSample.bindMobile);
            //         LayaSample.bindMobile.showThis();
            //     }else{//如果不是游客判断是否绑定过支付宝
            //         Http.post("/api/game/security/checkalipay",null,function(data){
            //             if(!data.success){
            //                 var littleTips = new LittleTip();
            //                 that.addChild(littleTips);
            //                 littleTips.showThis(data.msg);
            //             }else{
            //                 if(!data.obj){//没有设置过支付宝
            //                     if(!LayaSample.bindAlipay){
            //                         LayaSample.bindAlipay =  new BindAlipay();
            //                     }
            //                      Laya.stage.addChild(LayaSample.bindAlipay);
            //                      LayaSample.bindAlipay.showThis();
            //                 }else{
            //                     LayaSample.giveSeed.showThis();//显示赠送框
            //                 }
            //             }
            //         },["Authorization",that.token]);
            //     }

            //     var id = target._parent._dataSource.friendId;//好友id
            //     var name = target._parent._dataSource.nickname;//昵称
            //     that.layer.visible = true;
            //     if(!ISGIVE){
            //         // that.layer.visible = false;
            //         LayaSample.greenHandGuide.step_click_confirm();
            //     }
            //     if(!LayaSample.giveSeed){
            //         LayaSample.giveSeed = new GiveSeed("赠送果实给果实收购商",{skin:"1",nickname:"果实收购商",level:"1"},function(){
            //         // alert(tips.giveNum.text);
            //             if(!that.isLoading){
            //                 that.isLoading = true;
            //                 that.layer.visible = false;
            //                 var givingDatas = {
            //                     friendId:1,
            //                     cnt:LayaSample.giveSeed.giveNum.text
            //                 }
            //                 Http.get("/api/game/friend/giving",givingDatas,function(data){
            //                     if(!ISGIVE){
            //                         that.layer.visible = false;
            //                         // LayaSample.greenHandGuide.done();
            //                         LayaSample.friendList.hideThis();
            //                         LayaSample.farm.famlilyMune.rotation = 0;
            //                         LayaSample.greenHandGuide.invite_click_invite();
            //                         var littleTips1 = new LittleTip();
            //                         that.addChild(littleTips1);
            //                         ISDONENEW = true;//设置已经做过新手引导
            //                         // ISGIVE = true;//设置已经做过新手引导
            //                         // littleTips1.showThis("完成新手引导");
            //                         // alert(1);
            //                     }
            //                     console.log(data);
            //                     that.isLoading = false;
            //                     var littleTips = new LittleTip();
            //                     that.addChild(littleTips);
            //                     LayaSample.littleTip.zOrder = 999;
            //                     if(!data.success){
            //                         // littleTips.showThis(data.msg);
            //                         LayaSample.littleTip.showThis(data.msg);   
            //                         return;
            //                     }
            //                     // littleTips.showThis("赠送成功");
            //                     LayaSample.littleTip.showThis("赠送成功");

            //                     Http.get("/api/game/loadPlayer",null,function(result){
            //                         if(!result.success) return;
            //                         LayaSample.header.loadHeaderDatas(result.obj);     
            //                     },["Authorization",that.token])

            //                     LayaSample.msg.updateActionMsg("show_ck");//更新操作消息
            //                     LayaSample.farm.message();//从后台获取消息
            //                 },["Authorization",that.token])
            //             }
            //         },function(){
            //             that.layer.visible = false;
            //             LayaSample.farm.alertLayer.visible = true;
            //         });
            //     }
            //     // var tips = 
            //     LayaSample.giveSeed.pos(that.width / 2.2, that.height / 2.5)
            //     this.addChild(LayaSample.giveSeed); 
            // }
        }
    }
    //显示自己
    _proto.showThis = function(){
        var that = this;
        // that.friendPage = 1;
        //关系好友
        Http.get("/api/game/friend/list",{pageNum:that.friendPage,type:1},function(data){
            console.log(data);
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            console.log(data);
            that.friendAllPage = data.pages;
            that.modelPageControl.getChildByName("allPage").text = data.pages;
            that.modelPageControl.getChildByName("currentPage").text = that.friendPage;
            if(data.records.length==0){
                that.modelPageControl.getChildByName("currentPage").text = 0;
            }
            that.modelList.array = util.creFriendlistArr(data.records);
            LayaSample.farm.alertLayer.visible = true;
            Laya.Tween.to(that,{scaleY:1,scaleX:1},200,null,null);
            if(!ISGIVE){
                that.showGx();
            }
        },["Authorization",that.token]);
    };
    //得到关系下一页
    _proto.getNextPage = function(){
        var that = this;
        if(that.isLoading) return;
        if(that.friendPage>=that.friendAllPage) return;
        that.friendPage+=1;
        that.isLoading = true;
        Http.get("/api/game/friend/list",{pageNum:that.friendPage,type:1},function(data){
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            that.friendAllPage = data.pages;
            that.modelPageControl.getChildByName("allPage").text = data.pages;
            that.modelPageControl.getChildByName("currentPage").text = that.friendPage;
            that.modelList.array = util.creFriendlistArr(data.records);
            that.isLoading = false
        },["Authorization",that.token])
    }
    //得到关系上一页
    _proto.getPrePage = function(){ 
        var that = this;
        if(that.isLoading) return;
        if(that.friendPage<=1) return;
        that.friendPage-=1;
        that.isLoading = true;
         Http.get("/api/game/friend/list",{pageNum:that.friendPage,type:1},function(data){
            // console.log(data);
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            that.friendAllPage = data.pages;
            that.modelPageControl.getChildByName("allPage").text = data.pages;
            that.modelPageControl.getChildByName("currentPage").text = that.friendPage;
            that.modelList.array = util.creFriendlistArr(data.records);
            that.isLoading = false
        },["Authorization",that.token])
    }

    //得到普通下一页
    _proto.getNextPageN = function(){
        var that = this;
        if(that.isLoading) return;
        if(that.normalPage>=that.normalAllPage) return;
        that.normalPage+=1;
        that.isLoading = true;
        Http.get("/api/game/friend/list",{pageNum:that.normalPage,type:2},function(data){
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            that.normalAllPage = data.pages;
            that.normalPageControl.getChildByName("allPage").text = data.pages;
            that.normalPageControl.getChildByName("currentPage").text = that.normalPage;
            that.normalList.array = util.creFriendlistArr(data.records);
            that.isLoading = false
        },["Authorization",that.token])
    }
    //得到普通上一页
    _proto.getPrePageN = function(){ 
        var that = this;
        if(that.isLoading) return;
        if(that.normalPage<=1) return;
        that.normalPage-=1;
        that.isLoading = true;
         Http.get("/api/game/friend/list",{pageNum:that.normalPage,type:2},function(data){
            // console.log(data);
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            that.normalAllPage = data.pages;
            that.normalPageControl.getChildByName("allPage").text = data.pages;
            that.normalPageControl.getChildByName("currentPage").text = that.normalPage;
            that.normalList.array = util.creFriendlistArr(data.records);
            that.isLoading = false
        },["Authorization",that.token])
    }
    //好友类型切换
    _proto.changeLogType = function(){
        this.gxText.on("click",this,this.showGx);
        this.ptText.on("click",this,this.showPt);
    }
    //显示关系好友
    _proto.showGx = function(){
        this.gxText.getChildByName("bgImg").skin = "dialog/tableActive.png";
        this.gxText.getChildByName("text").color = "#fff";
        this.gxText.getChildByName("text").stroke = 3;
        this.gxText.getChildByName("text").strokeColor = "#58280d";

        this.ptText.getChildByName("bgImg").skin = "dialog/tableNormal.png";
        this.ptText.getChildByName("text").color = "#58280d";
        this.ptText.getChildByName("text").stroke = 0;
        this.ptText.getChildByName("text").strokeColor = "#58280d";

        this.modelRank.visible = true;
        this.normalFriend.visible = false;
    }
    //显示普通好友
    _proto.showPt = function(){
        var that = this;
        //普通好友
        Http.get("/api/game/friend/list",{pageNum:that.normalPage,type:2},function(data){
            console.log(data);
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            console.log(data);
            that.normalAllPage = data.pages;
            that.normalPageControl.getChildByName("allPage").text = data.pages;
            that.normalPageControl.getChildByName("currentPage").text = that.normalPage;
            if(data.records.length==0){
                 that.normalPageControl.getChildByName("currentPage").text = 0;
            }
            that.normalList.array = util.creFriendlistArr(data.records);
            // LayaSample.farm.alertLayer.visible = true;
            // Laya.Tween.to(that,{scaleY:1,scaleX:1},200,null,null);
        },["Authorization",that.token]);

        this.ptText.getChildByName("bgImg").skin = "dialog/tableActive.png";
        this.ptText.getChildByName("text").color = "#fff";
        this.ptText.getChildByName("text").stroke = 3;
        this.ptText.getChildByName("text").strokeColor = "#58280d";

        this.gxText.getChildByName("bgImg").skin = "dialog/tableNormal.png";
        this.gxText.getChildByName("text").color = "#58280d";
        this.gxText.getChildByName("text").stroke = 0;
        this.gxText.getChildByName("text").strokeColor = "#58280d";

        this.modelRank.visible = false;
        this.normalFriend.visible = true;
    }
    //隐藏自己 
    _proto.hideThis = function(){
        Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
        LayaSample.farm.alertLayer.visible = false;
    }
    return FriendList;
})(ui.FriendListUI);