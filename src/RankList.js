var RankList = (function(_super){
    var lists;
    var Handler = Laya.Handler;
    function RankList(){
        RankList.super(this);
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

        this.modelPage = 1;//劳模默认页
        this.stealPage = 1;
        this.helpPage = 1;
        this.isLoading = false;


       lists = [];
            for(var i = 0;i<50;i++){
                lists.push({
                    userName:"姓名"+i,
                    userLevel:i,
                    userJewel:i/(-0.01),
                    homePic:'dialog/rank_list_home.png',
                    id:i
                })
            }
        this.init();
    }
    Laya.class(RankList,"RankList",_super);
    var _proto = RankList.prototype;
    _proto.init = function(){
        this.getToken();
        this.setFeedBtn();
    	// this.setListDatas(Service.farmList());

        this.modelList.selectEnable = true;
        this.modelList.mouseHandler = new Handler(this, this.farmListClickHandler);

		// this.farmList.renderHandler = new Handler(this, this.setListDatas);

        this.setListFunc();
        this.closeBtn.on(Laya.Event.CLICK,this,this.closeRankAlert);
        this.changeType();
    }
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //排行类型切换
    _proto.changeType =function(){
        this.modelRankText.on("click",this,this.showModel);
        this.stealRankText.on("click",this,this.showSteal);
        this.helpRankText.on("click",this,this.showHelp);
    }   
    //显示劳模
    _proto.showModel = function(){
        this.modelRankText.getChildByName("bgImg").skin = "dialog/tableActive.png";
        this.modelRankText.getChildByName("text").color = "#fff";
        this.modelRankText.getChildByName("text").stroke = 3;
        this.modelRankText.getChildByName("text").strokeColor = "#58280d";

        this.stealRankText.getChildByName("bgImg").skin = "dialog/tableNormal.png";
        this.stealRankText.getChildByName("text").color = "#58280d";
        this.stealRankText.getChildByName("text").stroke = 0;
        this.stealRankText.getChildByName("text").strokeColor = "#58280d";

        this.helpRankText.getChildByName("bgImg").skin = "dialog/tableNormal.png";
        this.helpRankText.getChildByName("text").color = "#58280d";
        this.helpRankText.getChildByName("text").stroke = 0;
        this.helpRankText.getChildByName("text").strokeColor = "#58280d";

        this.modelRank.visible = true;
        this.stealRank.visible = false;
        this.helpRank.visible = false;
    } 
    //显示盗圣
    _proto.showSteal = function(){
        var that = this;
        //盗圣
        Http.get("/api/game/ranking/get",{type:2},function(data){
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return false;
            }
            console.log(data);
            var data = data.obj;
            that.stealList.array = data;
        },["Authorization",that.token]);

        this.stealRankText.getChildByName("bgImg").skin = "dialog/tableActive.png";
        this.stealRankText.getChildByName("text").color = "#fff";
        this.stealRankText.getChildByName("text").stroke = 3;
        this.stealRankText.getChildByName("text").strokeColor = "#58280d";

        this.modelRankText.getChildByName("bgImg").skin = "dialog/tableNormal.png";
        this.modelRankText.getChildByName("text").color = "#58280d";
        this.modelRankText.getChildByName("text").stroke = 0;
        this.modelRankText.getChildByName("text").strokeColor = "#58280d";

        this.helpRankText.getChildByName("bgImg").skin = "dialog/tableNormal.png";
        this.helpRankText.getChildByName("text").color = "#58280d";
        this.helpRankText.getChildByName("text").stroke = 0;
        this.helpRankText.getChildByName("text").strokeColor = "#58280d";

        this.modelRank.visible = false;
        this.stealRank.visible = true;
        this.helpRank.visible = false;
    } 
    //显示雷锋 
    _proto.showHelp = function(){

        var that = this;
        //雷锋排行
        Http.get("/api/game/ranking/get",{type:3},function(data){
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return false;
            }
            console.log(data);
            var data = data.obj;
            that.helpList.array = data;
        },["Authorization",that.token]);

        this.helpRankText.getChildByName("bgImg").skin = "dialog/tableActive.png";
        this.helpRankText.getChildByName("text").color = "#fff";
        this.helpRankText.getChildByName("text").stroke = 3;
        this.helpRankText.getChildByName("text").strokeColor = "#58280d";

        this.modelRankText.getChildByName("bgImg").skin = "dialog/tableNormal.png";
        this.modelRankText.getChildByName("text").color = "#58280d";
        this.modelRankText.getChildByName("text").stroke = 0;
        this.modelRankText.getChildByName("text").strokeColor = "#58280d";

        this.stealRankText.getChildByName("bgImg").skin = "dialog/tableNormal.png";
        this.stealRankText.getChildByName("text").color = "#58280d";
        this.stealRankText.getChildByName("text").stroke = 0;
        this.stealRankText.getChildByName("text").strokeColor = "#58280d";

        this.modelRank.visible = false;
        this.stealRank.visible = false;
        this.helpRank.visible = true;
    } 
    //列表功能设置
    _proto.setListFunc = function(){
        this.modelList.selectEnable = true;
        // this.modelList.scrollBar.hide = true;//隐藏列表的滚动条。
        // this.modelList.scrollBar.elasticBackTime = 200;//设置橡皮筋回弹时间。单位为毫秒。
        // this.modelList.scrollBar.elasticDistance = 50;//设置橡皮筋极限距离。
    }
    //渲染列表数据
    // _proto.setListDatas = function(list){
    //     this.helpList.array = list;
    // }
    //农场列表点击回调
    _proto.farmListClickHandler = function(event){
        event.stopPropagation();
        if(event.type == Event.CLICK){
            console.log(event.target)
            var datas = event.target.dataSource;
        }
        
        // if(datas){
        //     LayaSample.friendsFarm = new FriendsFarm(datas);
        //     //移除当前农场UI
        //     LayaSample.farm.removeSelf();
        //     //添加好友农场到舞台
        //     Laya.stage.addChild(LayaSample.friendsFarm);
        // }
    }
    //显示当前界面
    _proto.showThis = function(){
        this.modelPage = 1;
        this.stealPage = 1;
        this.helpPage = 1;
        var that = this;
         //劳模
        Http.get("/api/game/ranking/get",{type:1},function(data){
            console.log(data);
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return false;
            }
            console.log(data);
            var data = data.obj;
            that.modelList.array = data;
        },["Authorization",that.token]);
        
        LayaSample.farm.alertLayer.visible = true;
        Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
    }
    //关闭当前界面
    _proto.closeRankAlert = function(){
        Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
        LayaSample.farm.alertLayer.visible = false;
    }
    //按钮反馈
    _proto.setFeedBtn = function(){
        var feedBtn = [
            this.closeBtn,
           // this.modelPageControl.getChildByName("prePageBtn"),
            //this.modelPageControl.getChildByName("prePageBtn"),
            // this.stealPageControl.getChildByName("prePageBtn"),
            // this.stealPageControl.getChildByName("prePageBtn"),
            // this.helpPageControl.getChildByName("prePageBtn"),
            // this.helpPageControl.getChildByName("prePageBtn"),
        ]
        for(var i = 0;i<feedBtn.length;i++){
        	new BtnFeed(feedBtn[i]);
        }
    }
    return RankList;
})(ui.RankListUI)