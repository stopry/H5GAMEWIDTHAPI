//仓库弹出UI
(function(_super){
    function EnterPot(){
        EnterPot.super(this);
        this.setStyle();
        this.init();
        this.zOrder = 99;
    }
    Laya.class(EnterPot,"EnterPot",_super);
    var _proto = EnterPot.prototype;
    _proto.init = function(){
        this.getToken();
        this.setListFunc();//功能设置
        // this.setListUI();//果实列表
        //this.goOrchard.on(Laya.Event.CLICK,this,this.toOrchard);//页面跳转
        this.closeBtn.on(Laya.Event.CLICK,this,this.hideThis);//关闭
        this.changeType();
        this.listItemClick();
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
        this.fruitList.selectEnable = true;
        // this.fruitList.scrollBar.hide = true;//隐藏列表的滚动条。
        // this.fruitList.scrollBar.elasticBackTime = 200;//设置橡皮筋回弹时间。单位为毫秒。
        // this.fruitList.scrollBar.elasticDistance = 50;//设置橡皮筋极限距离。
    }
    _proto.setStyle = function(){
        this.pivot(this.width/2,this.height/2);
        this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        this.scale(0,0);
        console.log(this.height);

        this.stageWidth = Laya.stage.width;
        this.stageHeight = Laya.stage.height;
        // this.anchorY = 0.5;
        // this.anchorX = 0.5;
        // this.scaleX = 0;
        // this.scaleY = 0;
        this.seedList.repeatX = 4;
        this.seedList.repeatY = 4;
        // this.left = (this.stageWidth-this.width)/2;
        // this.top = (this.stageHeight-this.height)/2;
    }
    //列表事件点击处理
    _proto.listItemClick = function(){
        this.seedList.mouseHandler = new Handler(this,this.listOpr);//仓库列表鼠标事件操作
        this.fruitList.mouseHandler = new Handler(this,this.listOpr);//仓库列表鼠标事件操作
        // this.materiaList.mouseHandler = new Handler(this,this.listOpr);//仓库列表鼠标事件操作
        // this.jewelList.mouseHandler = new Handler(this,this.listOpr);//仓库列表鼠标事件操作
        this.propList.mouseHandler = new Handler(this,this.listOpr);//仓库列表鼠标事件操作
    }
    //更新列表，数据为空列表ui不重新渲染
    _proto.updateItem = function(cell){
        for(var i = 0;i<16;i++){
            // if(!cell[i]._dataSource){
                cell[i]._childs[1].skin = '';
                cell[i]._childs[2].text = '';
            // }
        }
    }
    _proto.showThis = function(){
        var that = this;

        that.showSeed();

        /*
        Http.get("/api/game/getPlayerItemDetailByType",{type:"01"},function(data){
            console.log(data);
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;

            console.log(that.seedList.cells);
            that.updateItem(that.seedList.cells)
            that.seedList.array = util.creEnterPotArr(data);
            // that.updateItem(that.seedList.cells)
            that.showSeed();
            LayaSample.farm.alertLayer.visible = true;
            Laya.Tween.to(that,{scaleY:1,scaleX:1},200,null,null);
        },["Authorization",that.token]);
        */

        /*
        Http.get("/api/game/getPlayerItemDetailByType",{type:"03"},function(data){
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            that.updateItem(that.materiaList.cells)
            that.materiaList.array = util.creEnterPotArr(data);
        },["Authorization",that.token]);
        Http.get("/api/game/getPlayerItemDetailByType",{type:"04"},function(data){
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            that.updateItem(that.jewelList.cells)
            that.jewelList.array = util.creEnterPotArr(data);
        },["Authorization",that.token]);
        */
    }
    //仓库列表鼠标事件
    _proto.listOpr = function(event,index){
        event.stopPropagation();
        var _idx = index;
        if(event.type == Event.MOUSE_DOWN){
            var startTime = new Date().getTime();
            var target = event.target;
            console.log(target);
            var datas = target.dataSource;
            console.log(datas);
            if(!LayaSample.ArticleDesc){
                LayaSample.ArticleDesc = new ArticleDesc();
            }
            var x = Laya.stage.mouseX;
            var y = Laya.stage.mouseY - LayaSample.ArticleDesc.height/1.1;
            if(!datas.id) return;
            this.showGoodsDetail(x,y,datas.pic,datas.name,datas.desc);
        }else{
            this.hideGoodsDetail();
        }
    };
    //显示物品详细信息
    _proto.showGoodsDetail = function(x,y,skin,name,desc){
        if(!LayaSample.ArticleDesc){
            LayaSample.ArticleDesc = new ArticleDesc();
        }
        LayaSample.ArticleDesc.pos(x,y);
        Laya.stage.addChild(LayaSample.ArticleDesc);
        LayaSample.ArticleDesc.showThis(skin,name,desc);
    }
    //隐藏物品详细信息
    _proto.hideGoodsDetail = function(){
        if(!LayaSample.ArticleDesc){
            LayaSample.ArticleDesc = new ArticleDesc();
        }
        LayaSample.ArticleDesc.hideThis();
    }
    _proto.hideThis = function(){
        Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
        LayaSample.farm.alertLayer.visible = false;
    }
    //渲染列表
    // _proto.setListUI = function(){
    //     console.log(Service.fruit());
    //     this.fruitList.array = Service.fruit();
    // }
    //仓库物品类型切换
    _proto.changeType = function(){
        this.seedText.on("click",this,this.showSeed);
        this.fruitText.on("click",this,this.showFruit);
        //this.material.on("click",this,this.showMaterial);
        //this.gem.on("click",this,this.showJewel);
        this.prop.on("click",this,this.showProp);
    }   
    //显示种子 
    _proto.showSeed = function(){

        var that = this;
        Http.get("/api/game/getPlayerItemDetailByType",{type:"01"},function(data){
            console.log(data);
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            console.log(that.seedList.cells);
            that.updateItem(that.seedList.cells)
            that.seedList.array = util.creEnterPotArr(data);
            LayaSample.farm.alertLayer.visible = true;
            Laya.Tween.to(that,{scaleY:1,scaleX:1},200,null,null);
        },["Authorization",that.token]);

        this.seedText.getChildByName("bgImg").skin = "dialog/table_key_active.png";
        this.seedText.getChildByName("text").color = "#fff";
        this.seedText.getChildByName("text").stroke = 0;
        this.seedText.getChildByName("text").strokeColor = "#58280d";

        this.fruitText.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        this.fruitText.getChildByName("text").color = "#f3d9c0";
        this.fruitText.getChildByName("text").stroke = 1;
        this.fruitText.getChildByName("text").strokeColor = "#58280d";

        // this.material.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.material.getChildByName("text").color = "#f3d9c0";
        // this.material.getChildByName("text").stroke = 1;
        // this.material.getChildByName("text").strokeColor = "#58280d";

        // this.gem.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.gem.getChildByName("text").color = "#f3d9c0";
        // this.gem.getChildByName("text").stroke = 1;
        // this.gem.getChildByName("text").strokeColor = "#58280d";

        this.prop.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        this.prop.getChildByName("text").color = "#f3d9c0";
        this.prop.getChildByName("text").stroke = 1;
        this.prop.getChildByName("text").strokeColor = "#58280d";

        this.seedBox.visible = true;
        this.fruitBox.visible = false;
        //this.materialBox.visible = false;
        //this.jeweltBox.visible = false;
        this.propBox.visible = false;
    }
    //显示果实
    _proto.showFruit = function(){

        var that = this;

        Http.get("/api/game/getPlayerItemDetailByType",{type:"02"},function(data){
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            that.updateItem(that.fruitList.cells)
            that.fruitList.array = util.creEnterPotArr(data);
        },["Authorization",that.token]);

        this.fruitText.getChildByName("bgImg").skin = "dialog/table_key_active.png";
        this.fruitText.getChildByName("text").color = "#fff";
        this.fruitText.getChildByName("text").stroke = 0;
        this.fruitText.getChildByName("text").strokeColor = "#58280d";

        this.seedText.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        this.seedText.getChildByName("text").color = "#f3d9c0";
        this.seedText.getChildByName("text").stroke = 1;
        this.seedText.getChildByName("text").strokeColor = "#58280d";

        // this.material.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.material.getChildByName("text").color = "#f3d9c0";
        // this.material.getChildByName("text").stroke = 1;
        // this.material.getChildByName("text").strokeColor = "#58280d";

        // this.gem.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.gem.getChildByName("text").color = "#f3d9c0";
        // this.gem.getChildByName("text").stroke = 1;
        // this.gem.getChildByName("text").strokeColor = "#58280d";

        this.prop.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        this.prop.getChildByName("text").color = "#f3d9c0";
        this.prop.getChildByName("text").stroke = 1;
        this.prop.getChildByName("text").strokeColor = "#58280d";

        this.seedBox.visible = false;
        this.fruitBox.visible = true;
        //this.materialBox.visible = false;
        //this.jeweltBox.visible = false;
        this.propBox.visible = false;
    }
    //显示材料
    _proto.showMaterial = function(){

        // this.material.getChildByName("bgImg").skin = "dialog/table_key_active.png";
        // this.material.getChildByName("text").color = "#fff";
        // this.material.getChildByName("text").stroke = 0;
        // this.material.getChildByName("text").strokeColor = "#58280d";

        // this.seedText.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.seedText.getChildByName("text").color = "#f3d9c0";
        // this.seedText.getChildByName("text").stroke = 1;
        // this.seedText.getChildByName("text").strokeColor = "#58280d";

        // this.fruitText.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.fruitText.getChildByName("text").color = "#f3d9c0";
        // this.fruitText.getChildByName("text").stroke = 1;
        // this.fruitText.getChildByName("text").strokeColor = "#58280d";

        // this.gem.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.gem.getChildByName("text").color = "#f3d9c0";
        // this.gem.getChildByName("text").stroke = 1;
        // this.gem.getChildByName("text").strokeColor = "#58280d";

        // this.prop.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.prop.getChildByName("text").color = "#f3d9c0";
        // this.prop.getChildByName("text").stroke = 1;
        // this.prop.getChildByName("text").strokeColor = "#58280d";

        // this.seedBox.visible = false;
        // this.fruitBox.visible = false;
        // this.materialBox.visible = true;
        // this.jeweltBox.visible = false;
        // this.propBox.visible = false;
    }
    //显示宝石
    _proto.showJewel = function(){
        // this.gem.getChildByName("bgImg").skin = "dialog/table_key_active.png";
        // this.gem.getChildByName("text").color = "#fff";
        // this.gem.getChildByName("text").stroke = 0;
        // this.gem.getChildByName("text").strokeColor = "#58280d";

        this.seedText.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        this.seedText.getChildByName("text").color = "#f3d9c0";
        this.seedText.getChildByName("text").stroke = 1;
        this.seedText.getChildByName("text").strokeColor = "#58280d";

        this.fruitText.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        this.fruitText.getChildByName("text").color = "#f3d9c0";
        this.fruitText.getChildByName("text").stroke = 1;
        this.fruitText.getChildByName("text").strokeColor = "#58280d";

        // this.material.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.material.getChildByName("text").color = "#f3d9c0";
        // this.material.getChildByName("text").stroke = 1;
        // this.material.getChildByName("text").strokeColor = "#58280d";

        this.prop.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        this.prop.getChildByName("text").color = "#f3d9c0";
        this.prop.getChildByName("text").stroke = 1;
        this.prop.getChildByName("text").strokeColor = "#58280d";

        this.seedBox.visible = false;
        this.fruitBox.visible = false;
        //this.materialBox.visible = false;
        //this.jeweltBox.visible = true;
        this.propBox.visible = false;
    }
    //显示道具
    _proto.showProp = function(){
        var that = this;

        Http.get("/api/game/getPlayerItemDetailByType",{type:"05"},function(data){
            var littleTips = new LittleTip();
            that.addChild(littleTips);
            if(!data.success){
                littleTips.showThis(data.msg);
                return;
            }
            var data = data.obj;
            that.updateItem(that.propList.cells)
            that.propList.array = util.creEnterPotArr(data);
        },["Authorization",that.token]);

        this.prop.getChildByName("bgImg").skin = "dialog/table_key_active.png";
        this.prop.getChildByName("text").color = "#fff";
        this.prop.getChildByName("text").stroke = 0;
        this.prop.getChildByName("text").strokeColor = "#58280d";

        this.seedText.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        this.seedText.getChildByName("text").color = "#f3d9c0";
        this.seedText.getChildByName("text").stroke = 1;
        this.seedText.getChildByName("text").strokeColor = "#58280d";

        this.fruitText.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        this.fruitText.getChildByName("text").color = "#f3d9c0";
        this.fruitText.getChildByName("text").stroke = 1;
        this.fruitText.getChildByName("text").strokeColor = "#58280d";

        // this.material.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.material.getChildByName("text").color = "#f3d9c0";
        // this.material.getChildByName("text").stroke = 1;
        // this.material.getChildByName("text").strokeColor = "#58280d";

        // this.gem.getChildByName("bgImg").skin = "dialog/table_key_normal.png";
        // this.gem.getChildByName("text").color = "#f3d9c0";
        // this.gem.getChildByName("text").stroke = 1;
        // this.gem.getChildByName("text").strokeColor = "#58280d";

        this.seedBox.visible = false;
        this.fruitBox.visible = false;
        //this.materialBox.visible = false;
        //this.jeweltBox.visible = false;
        this.propBox.visible = true;
    }
    //进入果园
    // _proto.toOrchard = function(){
    //     goUrl("https://www.baidu.com");
    // }
    return EnterPot;
})(ui.EnterPotUI)