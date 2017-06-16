var Log = (function(_super){
    function Log(){
        Log.super(this);
        // this.stageWidth = Laya.stage.width;
        // this.stageHeight = Laya.stage.height;
        // this.anchorY = 0.5;
        // this.anchorX = 0.5;
        // this.scaleX = 0;
        // this.scaleY = 0;
        // this.left = (this.stageWidth-this.width)/2;
        // this.top = (this.stageHeight-this.height)/2;
        this.zOrder = 99;
        this.pivot(this.width/2,this.height/2);
        this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        this.scale(0,0);

        this.oprPage = 1;

        this.traPage = 1;

        this.isLoading = false;

        this.init();
    }
    Laya.class(Log,"Log",_super);
    var _proto = Log.prototype;
    _proto.init = function(){
        this.getToken();
        this.setFeedBtn();
    	this.setListDatas();
        this.setListFunc();
        this.closeBtn.on(Laya.Event.CLICK,this,this.closeLogAlert);
        this.logList.on(Laya.Event.CLICK,this,this.listClickHandler);
        this.changeLogType();
        this.changePage();
    }
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //列表功能设置
    _proto.setListFunc = function(){
        this.logList.selectEnable = true;
        // this.logList.scrollBar.hide = true;//隐藏列表的滚动条。
        // this.logList.scrollBar.elasticBackTime = 200;//设置橡皮筋回弹时间。单位为毫秒。
        // this.logList.scrollBar.elasticDistance = 50;//设置橡皮筋极限距离。

        this.tradeLogList.selectEnable = true;
    }
    //渲染列表数据
    _proto.setListDatas = function(){
        // this.logList.array = Service.log();
    }
    //日志列表点击事件回调
    _proto.listClickHandler = function(event){
        // event.stopPropagation();
        // var datas = event.target.dataSource;
        // if(datas){
        //     this.addChild(LayaSample.littleTip);
        //     LayaSample.littleTip.showThis(datas.logCon);
        // }
    }
    //关闭当前界面
    _proto.closeLogAlert = function(){
        Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
        LayaSample.farm.alertLayer.visible = false;
    }
    //打开当前界面
    _proto.showThis = function(){
        this.oprPage = 1;
        this.traPage = 1;
        var that = this;
        //得到操作日志
        Http.get("/api/game/log/list",{type:1,pageNum:that.oprPage},function(data){
            console.log(data);
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return false;
            }
            var data = data.obj;
            that.oprAllPage = data.pages;
            that.oprLogLists = data.records;//操作日志列表
            var resourceArr = [];
            for(var i = 0;i<that.oprLogLists.length;i++){
                if(!resourceArr[i]) resourceArr[i] = {};
                resourceArr[i].logCon = that.oprLogLists[i].desc;
                resourceArr[i].data = util.formatTimeForH5(that.oprLogLists[i].operateTime)[0];
                resourceArr[i].time = util.formatTimeForH5(that.oprLogLists[i].operateTime)[1];
            }
            that.logList.array = resourceArr;//渲染列表
            that.pageControl.getChildByName("currentPage").text = that.oprPage;
            if(data.records.length==0){
                that.pageControl.getChildByName("currentPage").text = 0;
            }
            that.pageControl.getChildByName("allPage").text = that.oprAllPage;
        },["Authorization",that.token]);
        
        
        LayaSample.farm.alertLayer.visible = true;
        Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
    }
    //翻页操作
    _proto.changePage = function(){
        this.pageControl.getChildByName("nextPageBtn").on("click",this,this.oprNextPage);
        this.pageControl.getChildByName("prePageBtn").on("click",this,this.oprPrePage);
        this.tradePageControl.getChildByName("nextPageBtn").on("click",this,this.traNextPage);
        this.tradePageControl.getChildByName("prePageBtn").on("click",this,this.traPrePage);
    }
    //得到操作日志下一页
    _proto.oprNextPage = function(){
        var that = this;
        if(!that.isLoading){
            that.isLoading = true;
            if(that.oprAllPage<=that.oprPage){
                that.isLoading = false;
                return
            };
            that.oprPage++;
            that.pageControl.getChildByName("currentPage").text = that.oprPage;
            // if()
            Http.get("/api/game/log/list",{type:1,pageNum:that.oprPage},function(data){
                console.log(that.oprPage,data);
                if(!data.success){
                    LayaSample.littleTip.showThis(data.msg);
                    return false;
                }
                var data = data.obj;
                that.oprAllPage = data.pages;
                that.oprLogLists = data.records;//操作日志列表
                var resourceArr = [];
                for(var i = 0;i<that.oprLogLists.length;i++){
                    if(!resourceArr[i]) resourceArr[i] = {};
                    resourceArr[i].logCon = that.oprLogLists[i].desc;
                    resourceArr[i].data = util.formatTimeForH5(that.oprLogLists[i].operateTime)[0];
                    resourceArr[i].time = util.formatTimeForH5(that.oprLogLists[i].operateTime)[1];
                }
                that.logList.array = resourceArr;//渲染列表
                that.isLoading = false;
            },["Authorization",that.token]);
        }
        
    }
    //得到操作日志上一页
    _proto.oprPrePage = function(){
        var that = this;
        if(!that.isLoading){
            that.isLoading = true;
            if(that.oprPage<=1){
                that.isLoading = false;
                return
            };
            that.oprPage--;
            that.pageControl.getChildByName("currentPage").text = that.oprPage;
            // if()
            Http.get("/api/game/log/list",{type:1,pageNum:that.oprPage},function(data){
                if(!data.success){
                    LayaSample.littleTip.showThis(data.msg);
                    return false;
                }
                var data = data.obj
                that.oprAllPage = data.pages;
                that.oprLogLists = data.records;//操作日志列表
                var resourceArr = [];
                for(var i = 0;i<that.oprLogLists.length;i++){
                    if(!resourceArr[i]) resourceArr[i] = {};
                    resourceArr[i].logCon = that.oprLogLists[i].desc;
                    resourceArr[i].data = util.formatTimeForH5(that.oprLogLists[i].operateTime)[0];
                    resourceArr[i].time = util.formatTimeForH5(that.oprLogLists[i].operateTime)[1];
                }
                that.logList.array = resourceArr;//渲染列表
                that.isLoading = false;
            },["Authorization",that.token]);
        }
    }
    //得到交易日志下一页
    _proto.traNextPage = function(){
        var that = this;
        if(!that.isLoading){
            that.isLoading = true;
            if(that.traAllPage<=that.traPage){
                that.isLoading = false;
                return
            };
            that.traPage++;
            that.tradePageControl.getChildByName("currentPage").text = that.traPage;
            // if()
            Http.get("/api/game/log/list",{type:2,pageNum:that.traPage},function(data){
                if(!data.success){
                    LayaSample.littleTip.showThis(data.msg);
                    return false;
                }
                var data = data.obj;
                that.traAllPage = data.pages;
                that.oprLogLists = data.records;//操作日志列表
                var resourceArr = [];
                for(var i = 0;i<that.tradeLogLists.length;i++){
                    if(!resourceArr[i]) resourceArr[i] = {};
                    resourceArr[i].logCon = that.oprLogLists[i].desc;
                    resourceArr[i].data = util.formatTimeForH5(that.tradeLogLists[i].operateTime)[0];
                    resourceArr[i].time = util.formatTimeForH5(that.tradeLogLists[i].operateTime)[1];
                }
                that.tradeLogList.array = resourceArr;//渲染列表
                that.isLoading = false;
            },["Authorization",that.token]);
        }
    }
    //得到交易日志上一页
    _proto.traPrePage = function(){
        var that = this;
        if(!that.isLoading){
            that.isLoading = true;
            if(that.traPage<=1){
                that.isLoading = false;
                return
            };
            that.traPage--;
            that.tradePageControl.getChildByName("currentPage").text = that.traPage;
            // if()
            Http.get("/api/game/log/list",{type:2,pageNum:that.traPage},function(data){
                if(!data.success){
                    LayaSample.littleTip.showThis(data.msg);
                    return false;
                }
                var data = data.obj;
                that.traAllPage = data.pages;
                that.oprLogLists = data.records;//操作日志列表
                var resourceArr = [];
                for(var i = 0;i<that.tradeLogLists.length;i++){
                    if(!resourceArr[i]) resourceArr[i] = {};
                    resourceArr[i].logCon = that.oprLogLists[i].desc;
                    resourceArr[i].data = util.formatTimeForH5(that.tradeLogLists[i].operateTime)[0];
                    resourceArr[i].time = util.formatTimeForH5(that.tradeLogLists[i].operateTime)[1];
                }
                that.tradeLogList.array = resourceArr;//渲染列表
                that.isLoading = false;
            },["Authorization",that.token]);
        }
    }
    //按钮反馈
    _proto.setFeedBtn = function(){
        var feedBtn = [
            this.closeBtn,
            this.pageControl.getChildByName("nextPageBtn"),
            this.pageControl.getChildByName("prePageBtn"),
            this.tradePageControl.getChildByName("nextPageBtn"),
            this.tradePageControl.getChildByName("prePageBtn"),
        ]
        for(var i = 0;i<feedBtn.length;i++){
        	new BtnFeed(feedBtn[i]);
        }
    }
    //日志类型切换
    _proto.changeLogType = function(){
        this.oprText.on("click",this,this.showOprLog);
        this.tradeText.on("click",this,this.showTraLog);
    }
    //显示操作日志
    _proto.showOprLog = function(){
        this.oprText.getChildByName("bgImg").skin = "dialog/tableActive.png";
        this.oprText.getChildByName("text").color = "#fff";
        this.oprText.getChildByName("text").stroke = 3;
        this.oprText.getChildByName("text").strokeColor = "#58280d";

        this.tradeText.getChildByName("bgImg").skin = "dialog/tableNormal.png";
        this.tradeText.getChildByName("text").color = "#58280d";
        this.tradeText.getChildByName("text").stroke = 0;
        this.tradeText.getChildByName("text").strokeColor = "#58280d";

        this.logBox.visible = true;
        this.tradeLogBox.visible = false;
    }
    //显示交易日志
    _proto.showTraLog = function(){

        var that = this;

        //得到交易日志
        Http.get("/api/game/log/list",{type:2,pageNum:that.traPage},function(data){
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                console.log(data)
                return false;
            }
            var data = data.obj;
            that.traAllPage = data.pages;
            that.tradeLogLists = data.records;//操作日志列表
            var resourceArr = [];
            for(var i = 0;i<that.tradeLogLists.length;i++){
                if(!resourceArr[i]) resourceArr[i] = {};
                resourceArr[i].logCon = that.tradeLogLists[i].desc;
                resourceArr[i].data = util.formatTimeForH5(that.tradeLogLists[i].operateTime)[0];
                resourceArr[i].time = util.formatTimeForH5(that.tradeLogLists[i].operateTime)[1];
            }
            that.tradeLogList.array = resourceArr;//渲染列表
            that.tradePageControl.getChildByName("currentPage").text = that.traPage;
            if(data.records.length==0){
                that.tradePageControl.getChildByName("currentPage").text = 0;
            }
            that.tradePageControl.getChildByName("allPage").text = that.traAllPage;
        },["Authorization",that.token]);


        this.tradeText.getChildByName("bgImg").skin = "dialog/tableActive.png";
        this.tradeText.getChildByName("text").color = "#fff";
        this.tradeText.getChildByName("text").stroke = 3;
        this.tradeText.getChildByName("text").strokeColor = "#58280d";

        this.oprText.getChildByName("bgImg").skin = "dialog/tableNormal.png";
        this.oprText.getChildByName("text").color = "#58280d";
        this.oprText.getChildByName("text").stroke = 0;
        this.oprText.getChildByName("text").strokeColor = "#58280d";

        this.logBox.visible = false;
        this.tradeLogBox.visible = true;
    }
    return Log;
})(ui.LogUI)