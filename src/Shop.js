//商店
var Shop = (function(_super){
    var Handler = Laya.Handler;
    var testList = [];//模拟数据
    function Shop(){
        Shop.super(this);
        this.init();
        this.isLoading = false;
        this.zOrder = 99;
    }
    Laya.class(Shop,"Shop",_super);
    var _proto = Shop.prototype;
    _proto.init = function(){
        for(var i = 0;i<5;i++){
            testList.push({
                id:i,
                img:"ui/icon_92.png",
                name:"草莓"+i,
                desc:"淮南草莓"
            });
        }
        this.getToken();
        this.setStyle();
        this.closeBtn.on(Laya.Event.CLICK,this,this.closeThis);
        //this.seedsBox.getChildByName("seedListItem_0").getChildByName("buyBtn").on(Laya.Event.CLICK,this,this.buySeeds,[10]);
       // this.seedsBox.getChildByName("seedListItem_1").getChildByName("buyBtn").on(Laya.Event.CLICK,this,this.buySeeds,[50]);
        //this.seedsBox.getChildByName("seedListItem_2").getChildByName("buyBtn").on(Laya.Event.CLICK,this,this.buySeeds,[100]);
        this.listItemClick();
        this.loadListDatas();
        this.listRender();
    }
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //位置设置-垂直居中
    _proto.setStyle = function(){
        // this.stageWidth = Laya.stage.width;
        // this.stageHeight = Laya.stage.height;
        // this.anchorY = 0.5;
        // this.anchorX = 0.5;
        // this.scaleX = 0;
        // this.scaleY = 0;
        // this.left = (this.stageWidth-this.width)/2;
        // this.top = (this.stageHeight-this.height)/2;

        this.pivot(this.width/2,this.height/2);
        this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        this.scale(0,0);

        new BtnFeed(this.closeBtn);
        //new BtnFeed(this.seedsBox.getChildByName("seedListItem_0").getChildByName("buyBtn"));
        //new BtnFeed(this.seedsBox.getChildByName("seedListItem_1").getChildByName("buyBtn"));
       // new BtnFeed(this.seedsBox.getChildByName("seedListItem_2").getChildByName("buyBtn"));
    }
    //列表数据加载
    _proto.loadListDatas = function(){
        var that = this;
        // this.fruitList.array = testList;
        // this.seedList.array = testList;
        Http.get("/api/game/store/list",{type:"01"},function(data){
            console.log(data);
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return;
            }
            var data = data.obj;
            that.seedList.array = util.creShopArr(data);
            that.seedList.scrollBar.hide = true;//隐藏列表的滚动条。
        },["Authorization",that.token]);
    }
    //列表事件点击处理
    _proto.listItemClick = function(){
        // this.fruitList.mouseHandler = new Handler(this,this.shopOpr);
        this.seedList.mouseHandler = new Handler(this,this.shopOpr);//商店种子列表操作
    }
    //列表渲染后操作
    _proto.listRender = function(){
        //this.fruitList.renderHandler = new Handler(this, this.setBtnFeed);
    }
    //列表渲染完成后的事件 
    _proto.setBtnFeed = function(){
        // new BtnFeed(this.fruitList.getItem(""))
        // ;
    }
    //商店列表操作
    _proto.shopOpr = function(event,index){
        event.stopPropagation();
        var _idx = index;//当前列表索引
        if(event.type == Event.CLICK){
            var target = event.target
            console.log(target._parent);
            var datas = target.dataSource;
            console.log(_idx);
            if(target.name == "reduceNum"||target.name == "addNum"||target.name == "buyBtn"){
                Laya.Tween.to(target,{scaleY:1.05,scaleX:1.05},100,Laya.Ease.backOut,Laya.Handler.create(this,function(){
                    Laya.Tween.to(target,{scaleY:1,scaleX:1},10,Laya.Ease.backIn,null);
                }));
            };
            if(target.name == "reduceNum"){
                target._parent._childs[7].text = (parseInt(target._parent._childs[7].text))-1;
                if(target._parent._childs[7].text<=1){
                    target._parent._childs[7].text=1;
                }
            }else if(target.name == "addNum"){
                target._parent._childs[7].text = (parseInt(target._parent._childs[7].text))+1;
            }else if(target.name == "buyBtn"){
                var buyNum = target._parent._childs[7].text;//得到购买数量
                if(!buyNum||buyNum<1){
                    this.addChild(LayaSample.littleTip);
                    LayaSample.littleTip.showThis("请输入购买数量");
                }
                var id = target._parent._dataSource.id;//当前listItme的id
                var toUrl = centerUrl+"/dispense.html?toUrl=nccz.html&itemid="+id+"&num="+buyNum;
                skipToUrl(toUrl);
            }
        }
    }
    //关闭自己
    _proto.closeThis = function(){
        Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
        LayaSample.farm.alertLayer.visible = false;
    }
    //购买种子
    _proto.buySeeds = function(num){
        var that = this;
        var buySeedsDatas = {
            itemId:1001,
            num:num
        }
        if(!that.isLoading){
            that.isLoading = true;
            Http.get("/api/game/store/buy",buySeedsDatas,function(data){
                console.log(data)
                Laya.stage.addChild(LayaSample.littleTip);
                if(data.success){
                    LayaSample.littleTip.showThis("购买成功");
                }else{
                    LayaSample.littleTip.showThis(data.msg);
                }
                that.isLoading = false;
            },["Authorization",that.token])
        }
    }
    return Shop;
})(ui.ShopUI)