// var isdDoneNew = true;//做过新手引导
var Stage = Laya.stage;//舞台对象引用
var Sprite = Laya.Sprite;//精灵对象
var HitArea = Laya.HitArea;//打击区域
var _stage_width = Laya.stage.width;//舞台宽度
var _stage_height = Laya.stage.height;//舞台高度
var _browser_width = Laya.Browser.clientWidth;//浏览器宽度
var _browser_height = Laya.Browser.clientHeight;//浏览器高度

//手指点击动画
var ClickAni = (function(_super){
    function ClickAni(){
        ClickAni.super(this);
    }
    Laya.class(ClickAni,'ClickAni',_super)
    var _proto = ClickAni.prototype;
    _proto.setStyle = function(w,h){
        this.mouseEnabled = false;
        this.mouseThrough = true;
        this.stageWidth = Laya.stage.width;
        this.stageHeight = Laya.stage.height;
        this.pivot(this.width/2.5,this.height/2.5);
        this.pos(w,h);
    }
    return ClickAni;
})(ui.ClickAniUI)
//天使对话框
var AngelDia = (function(_super){
    function AngelDia(){
        AngelDia.super(this);
    }
    Laya.class(AngelDia,"AngelDia",_super);
    var _proto = AngelDia.prototype
    //设置介绍文字
    _proto.setText = function(png){
        this.zOrder = 2;
        this.textCon.skin = png;
    }
    _proto.setStyle = function(w,h){
        this.stageWidth = Laya.stage.width;
        this.stageHeight = Laya.stage.height;
        this.pivot(this.width/2,this.height/2);
        this.pos(w / 2.1, h );
    }
    return AngelDia;
})(ui.AngelDiaUI)
//新手引导类
var GreenHandGuide = (function(){
    // alert(ISDONENEW);
    // console.log(_browser_height,_stage_height,_browser_height/_stage_height,_stage_width);
    //交互区域y值设置

    function yval(y){
        var bl =  SCALEMODE=="fixedwidth"?_browser_width/640:_stage_width/640;//比例
        var yv = SCALEMODE=="fixedwidth"?_browser_height/bl-y:_stage_height/bl-y;//最终值  
        return yv;
    }

    // function yval(y){
    //     var bl =  _stage_width/640;//比例
    //     var yv =  _stage_height/bl-y;//最终值  
    //     return yv;
    // }

    //好友弹框弹框y值设置
    function diaYval(y){
        var bl =  SCALEMODE=="fixedwidth"?_browser_width/640:_stage_width/640;
        var yv = SCALEMODE=="fixedwidth"?(_browser_height/bl - 873)/2 + y:(_stage_height/bl - 873)/2 + y;
        return yv;
    }

    // function diaYval(y){
    //     var bl =  _stage_width/640;
    //     var yv = (_stage_height/bl - 873)/2 + y;
    //     return yv;
    // }
    //交互区域配置
    var interactionConfig = [
        {//1提示点击土地弹出播种种子对话框
            x:_stage_width/2.4,
            y:yval(470),
            radius:50,
            // tipimg: "ui/step_1.png",
            tipimg: "",
            tipx: _stage_width/3.2,
            tipy: yval(700)
        },
        {//2提示点击播种种下种子
            x:_stage_width/2.4,
            y:yval(562),
            radius:40,
            // tipimg: "ui/step_2.png",
            tipimg: "",
            tipx: _stage_width/3.2,
            tipy: yval(780)
        },
        {//3提示点击土地弹出浇水对话框
            x:_stage_width/2.4,
            y:yval(470),
            radius:50,
            tipimg: "",
            // tipimg: "ui/step_3.png",
            tipx: _stage_width/3.2,
            tipy: yval(700)
        },
        {//4提示点击水壶土地浇水
            x:_stage_width/2.38,
            y:yval(593),
            radius:40,
            // tipimg: "ui/step_4.png",
            tipimg: "",
            tipx: _stage_width/3.2,
            tipy: yval(820)
        },
        {//5提示点击土地弹出施肥对话框
            x:_stage_width/2.4,
            y:yval(470),
            radius:50,
            tipimg: "",
            // tipimg: "ui/step_5.png",
            tipx: _stage_width/3.2,
            tipy: yval(700)
        },
        {//6提示点击肥料给土地施肥
            x:_stage_width/3.53,
            y:yval(531),
            radius:35,
            tipimg: "",
            // tipimg: "ui/step_6.png",
            tipx: _stage_width/5.8,
            tipy: yval(768)
        },
        {//7提示点击土地弹出收割对话框
            x:_stage_width/2.4,
            y:yval(470),
            radius:50,
            // tipimg: "ui/step_7.png",
            tipimg: "",
            tipx: _stage_width/3.2,
            tipy: yval(700)
        },
        {//8提示点击收割收割植物
            x:_stage_width/2.42,
            y:yval(562),
            radius:40,
            tipimg: "",
            // tipimg: "ui/step_8.png",
            tipx: _stage_width/3.2,
            tipy: yval(780)
        },
    ];
    //偷果实引导配置
    var stealConfig = [
        {//1提示点击好友列表
            x:_stage_width/1.25,
            y:154,
            radius:40,
            tipimg: "",
            // tipimg: "ui/step_click_friend.png",
            tipx: _stage_width/1.6,
            tipy: 200
        },
        {//2提示点击家园按钮进入果实收购商家园
            x:_stage_width/1.28,
            y:diaYval(260),
            radius:30,
            tipimg: "",
            // tipimg: "ui/steal_click_home.png",
            tipx: _stage_width/3.2,
            tipy: diaYval(240)
        },
        {//3提示点击土地弹出偷取植物对话框
            x:_stage_width/2.4,
            y:yval(470),
            radius:50,
            tipimg: "",
            // tipimg: "ui/steal_click_seed.png",
            tipx: _stage_width/4.2,
            tipy: yval(700)
        },
        {//4提示点击偷取图表偷取植物
            x:_stage_width/1.91,
            y:yval(555),
            radius:40,
            tipimg: "",
            // tipimg: "ui/steal_click_stealicon.png",
            tipx: _stage_width/3.7,
            tipy: yval(770)
        },
        {//5提示点返回家园按钮
            x:_stage_width/1.15,
            y:yval(70),
            radius:50,
            tipimg: "",
            // tipimg: "ui/steal_click_backhome.png",
            tipx: _stage_width/1.5,
            tipy: yval(300)
        },
        {//6提示点击消息按钮
            x:_stage_width/11.73,
            y:yval(665),
            radius:40,
            tipimg: "",
            // tipimg: "ui/steal_click_message.png",
            tipx: _stage_width/5.5,
            tipy: yval(760)
        }
    ]
    //开垦土地引导
    var gradeLandConfig = [
        {//1提示点击带有建设牌的土地
            x:_stage_width/3.48,
            y:yval(420),
            radius:40,
            // tipimg: "ui/step_1.png",
            tipimg: "",
            tipx: _stage_width/3.2,
            tipy: yval(700)
        },
        {//2提起点击确定升级按钮点击
            x:_stage_width/1.44,
            y:diaYval(510),
            radius:40,
            // tipimg: "ui/step_1.png",
            tipimg: "",
            tipx: _stage_width/3.2,
            tipy: yval(700)
        },
    ]
    //用户不是游客并且已经绑定支付宝账户-点击好友赠送果实步骤
    var giveConfig = [
        {//提示点击好友列表
            x:_stage_width/1.31,
            y:154,
            radius:40,
            tipimg: "",
            // tipimg: "ui/step_click_friend.png",
            tipx: _stage_width/1.6,
            tipy: 200
        },
        {//提示点击赠送按钮
            x:_stage_width/1.45,
            y:diaYval(260),
            radius:30,
            tipimg: "",
            // tipimg: "ui/step_click_give.png",
            tipx: _stage_width/4.0,
            tipy: diaYval(240)
        },
        {//点击赠送按钮
            x:_stage_width/2.54,
            y:diaYval(500),
            radius:40,
            tipimg: "",
            // tipimg: "ui/step_click_confirm.png",
            tipx: _stage_width/3.2,
            tipy: diaYval(550)
        }
    ];
    //点击果实收购商赠送果实步骤
    var clickBuyer = [
        {//提示点击好友列表
            x:_stage_width/5.5,
            y:yval(200),
            radius:40,
            tipimg: "",
            // tipimg: "ui/step_click_friend.png",
            tipx: _stage_width/1.6,
            tipy: 200
        },
        {//提示点击好友列表
            x:_stage_width/1.31,
             y:diaYval(500),
            radius:40,
            tipimg: "",
            // tipimg: "ui/step_click_friend.png",
            tipx: _stage_width/1.6,
            tipy: 200
        },
    ]
    //邀请好友步骤
    var inviteConfig = [
        {//1点击邀请好友按钮
            x:_stage_width/1.60,
            y:yval(50),
            radius:30,
            tipimg: "",
            // tipimg: "ui/invite_click_invite.png",
            tipx: _stage_width/2.3,
            tipy: yval(280)
        }
    ]
    //console.log(_stage_height,interactionConfig[0].y);
    function GreenHandGuide(nickname){
        this.doNew = true;//新手引导
        this.nickname = nickname;
        // this.init();
    }
    var guideContainer;
    var _proto = GreenHandGuide.prototype;
    _proto.init = function(){
        this.start();        
    }
    _proto.start = function(){

        var that = this;

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        LayaSample.angelDia.setText('dialog/new_guide_1.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,Laya.stage.height/2);
        LayaSample.farm.alertLayer.visible = true;
        

        var _layer = new Sprite();
        _layer.zOrder = 3;
        _layer.alpha = 0;
        _layer.mouseEnabled = true;
        _layer.mouseThrough = false;
        _layer.height = Laya.stage.height
        _layer.width = Laya.stage.width
        _layer.graphics.drawRect(0,0,Laya.stage.width,Laya.stage.height,"#ff0000");
        Laya.stage.addChild(_layer);
        _layer.on('click',this,function(){
            _layer.removeSelf();
            _layer.destroy();
            LayaSample.farm.alertLayer.visible = false;
            LayaSample.angelDia.visible = false;
            that.step1();
        });

        /*
        var textObj = {
            title:'新手引导',
            con:'亲爱的'+that.nickname+'欢迎来到超级水稻,下面由稻神来为您介绍一下超级水稻的玩法,可以领现金红包哦...',
            sel1:'美女开始吧',
            sel2:'我才不要呢'
        }
        var green = new GreenHandDia(
        textObj,
        //关闭回调
        function(){
           console.log('关闭回调');
           that.donew();//告诉服务器不进行新手引导设置全局变量ISDONENEW为true=>已经进行过新手引导
           ISDONENEW = true;
           that.angel.destroy();
           that.angel.removeSelf();
        //左边按钮回调    
        },function(){
            console.log('选择1回调进行新手引导');
            that.step1();
            that.angel.destroy();
            that.angel.removeSelf();
        //右边按钮回调 
        },function(){
            console.log('选择2回调,跳过新手引导');
            that.donew();//告诉服务器不进行新手引导设置全局变量
            ISDONENEW = true;
            that.angel.destroy();
            that.angel.removeSelf();
        });
        Laya.stage.addChild(green);
        green.showThis();
        */

    }
    //画图公用方法
    _proto.draw = function(x,y,radius,tipimg,tipx,tipy){
        this.hitArea.unHit.clear();
        this.hitArea.unHit.drawCircle(x, y, radius, "#000000");

        this.interactionArea.graphics.clear();
        this.interactionArea.graphics.drawCircle(x, y, radius, "#000000");

        this.tipContainer.graphics.clear();
		// this.tipContainer.loadImage(tipimg);
		this.tipContainer.pos(tipx,tipy);
    }
    //第一步引导种植
    _proto.step1 = function(){
        console.info('step1');
        // 引导所在容器
		this.guideContainer = new Sprite();
        this.guideContainer.zOrder = 19;
		// 设置容器为画布缓存
		this.guideContainer.cacheAs = "bitmap";
		Laya.stage.addChild(this.guideContainer);
        //绘制游戏背景
        this.maskArea = new Sprite();
        this.maskArea.alpha = 0.2;
        this.maskArea.mouseEnabled = true;
        this.maskArea.mouseThrough = false;
        //绘制矩形
        this.maskArea.graphics.drawRect(0,0,Laya.stage.width,Laya.stage.height,"#000000");
        this.guideContainer.addChild(this.maskArea);

        //绘制一个圆形区域，利用叠加模式，从遮罩区域抠出可交互区
        this.interactionArea = new Sprite();
        //设置叠加模式
        this.interactionArea.blendMode = "destination-out";
        this.guideContainer.addChild(this.interactionArea);

        //hitArea
        this.hitArea = new HitArea();
        this.hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");

        this.guideContainer.hitArea = this.hitArea;
        this.guideContainer.mouseEnabled = true;
        //提示容器 
        this.tipContainer = new Sprite();
        this.tipContainer.zOrder = 19;
		Laya.stage.addChild(this.tipContainer);

        this.draw(interactionConfig[0].x,interactionConfig[0].y,interactionConfig[0].radius,interactionConfig[0].tipimg,interactionConfig[0].tipx,interactionConfig[0].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }

        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(interactionConfig[0].x,interactionConfig[0].y);
        LayaSample.clickAni.zOrder = 20;
        

        LayaSample.angelDia.setText('dialog/new_guide_2.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(656));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //添加天使
    _proto.addAngel = function(posx,posy){
        this.angel = new Sprite();
        this.angel.zOrder = 100;
        Laya.stage.addChild(this.angel);
        this.angel.graphics.clear();
        // this.angel.loadImage('ui/angel.png');
        this.angel.loadImage('ui/null.png');
        this.angel.pivot(this.angel.width/2,this.angel.height/2);

        // this.pivot(this.width/2,this.height/2);
        // this.pos(Laya.stage.width / 2, Laya.stage.height / 2);

        var x = _stage_width/posx;
        var y = posy;
        this.angel.pos(x,y);
    }
    //请求新手引导接口
    _proto.donew = function(){
        var that = this;
        this.getToken();
        Http.get("/api/game/updateDoNew",null,function(data){
            console.log(data);
            if(!data.success){ //已经进行过新手引导
                // ISDONENEW = true; 
                console.log(1,ISDONENEW); 
                return;
            };
        },["Authorization",that.token]);
    }
    //第二部种下种子  
    _proto.step2 = function(){
        console.log("step2");
        this.draw(interactionConfig[1].x,interactionConfig[1].y,interactionConfig[1].radius,interactionConfig[1].tipimg,interactionConfig[1].tipx,interactionConfig[1].tipy);
        this.donew();

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }

        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(interactionConfig[1].x,interactionConfig[1].y);
        LayaSample.clickAni.zOrder = 20;

        LayaSample.angelDia.setText('dialog/new_guide_2.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(356));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //第三部点击土地浇水提示  
    _proto.step3 = function(){
        console.log("step3");
        this.draw(interactionConfig[2].x,interactionConfig[2].y,interactionConfig[2].radius,interactionConfig[2].tipimg,interactionConfig[2].tipx,interactionConfig[2].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(interactionConfig[2].x,interactionConfig[2].y);
        LayaSample.clickAni.zOrder = 20;

        LayaSample.angelDia.setText('dialog/new_guide_3.png');
        LayaSample.angelDia.setStyle(Laya.stage.width-70,yval(356));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //第四部点击水壶浇水提示  
    _proto.step4 = function(){
        console.log("step4");
        this.draw(interactionConfig[3].x,interactionConfig[3].y,interactionConfig[3].radius,interactionConfig[3].tipimg,interactionConfig[3].tipx,interactionConfig[3].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(interactionConfig[3].x,interactionConfig[3].y);
        LayaSample.clickAni.zOrder = 20;

        LayaSample.angelDia.setText('dialog/new_guide_3.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(356));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //第五部点击土地施肥提示
    _proto.step5 = function(){
        console.log("step5");
        this.draw(interactionConfig[4].x,interactionConfig[4].y,interactionConfig[4].radius,interactionConfig[4].tipimg,interactionConfig[4].tipx,interactionConfig[4].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(interactionConfig[4].x,interactionConfig[4].y);
        LayaSample.clickAni.zOrder = 20;

        LayaSample.angelDia.setText('dialog/new_guide_4.png');
        LayaSample.angelDia.setStyle(Laya.stage.width-70,yval(346));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //第六部点击肥料进行施肥
    _proto.step6 = function(){
        console.log("step6");
        this.draw(interactionConfig[5].x,interactionConfig[5].y,interactionConfig[5].radius,interactionConfig[5].tipimg,interactionConfig[5].tipx,interactionConfig[5].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(interactionConfig[5].x,interactionConfig[5].y);
        LayaSample.clickAni.zOrder = 20;

        LayaSample.angelDia.setText('dialog/new_guide_4.png');
        LayaSample.angelDia.setStyle(Laya.stage.width-70,yval(336));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //第7部点击土地弹出施肥收割
    _proto.step7 = function(){
        console.log("step7");
        this.draw(interactionConfig[6].x,interactionConfig[6].y,interactionConfig[6].radius,interactionConfig[6].tipimg,interactionConfig[6].tipx,interactionConfig[6].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(interactionConfig[6].x,interactionConfig[6].y);
        LayaSample.clickAni.zOrder = 20;

        LayaSample.angelDia.setText('dialog/new_guide_5.png');
        LayaSample.angelDia.setStyle(Laya.stage.width-20,yval(356));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //第8部点击收割收货种子
    _proto.step8 = function(){
        console.log("step8");
        this.draw(interactionConfig[7].x,interactionConfig[7].y,interactionConfig[7].radius,interactionConfig[7].tipimg,interactionConfig[7].tipx,interactionConfig[7].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(interactionConfig[7].x,interactionConfig[7].y);
        LayaSample.clickAni.zOrder = 20;
        LayaSample.angelDia.setText('dialog/new_guide_5.png');
        LayaSample.angelDia.setStyle(Laya.stage.width-50,yval(386));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }

    //提示点击带有升级公告牌的土地
    _proto.step_click_grade_1 = function(){
        console.log('step_click_grade');
        this.draw(gradeLandConfig[0].x,gradeLandConfig[0].y,gradeLandConfig[0].radius,gradeLandConfig[0].tipimg,gradeLandConfig[0].tipx,gradeLandConfig[0].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(gradeLandConfig[0].x,gradeLandConfig[0].y);
        LayaSample.clickAni.zOrder = 20;
        LayaSample.angelDia.setText('dialog/new_guide_open_land.png');
        LayaSample.angelDia.setStyle(Laya.stage.width-70,yval(236));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //提示点击确定升级按钮
    _proto.step_click_grade_2 = function(){
        console.log('step_click_grade');

        this.guideContainer.zOrder = 100;
        this.tipContainer.zOrder = 100;

        this.draw(gradeLandConfig[1].x,gradeLandConfig[1].y,gradeLandConfig[1].radius,gradeLandConfig[1].tipimg,gradeLandConfig[1].tipx,gradeLandConfig[1].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(gradeLandConfig[1].x,gradeLandConfig[1].y);
        LayaSample.clickAni.zOrder = 101;
        LayaSample.angelDia.setText('dialog/new_guide_open_land.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(286));
        LayaSample.angelDia.zOrder = 101;
        LayaSample.angelDia.visible = true;
    }

    //点击好友弹出好友列表对话框
    _proto.step_click_friend = function(){
        // this.guideContainer.zOrder = 100;
        // this.tipContainer.zOrder = 100;
        console.log("step_click_friend");

        this.guideContainer.zOrder = 19;
        this.tipContainer.zOrder = 19;

        this.draw(giveConfig[0].x,giveConfig[0].y,giveConfig[0].radius,giveConfig[0].tipimg,giveConfig[0].tipx,giveConfig[0].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(giveConfig[0].x,giveConfig[0].y);
        LayaSample.clickAni.zOrder = 20;
        LayaSample.angelDia.setText('dialog/new_guide_12.png');
        LayaSample.angelDia.setStyle(Laya.stage.width+70,yval(406));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //点击好友弹出好友列表对话框->偷取果实步骤
    _proto.step_click_friend_steal = function(){
        // this.guideContainer.zOrder = 100;
        // this.tipContainer.zOrder = 100;
        console.log("step_click_friend_steal");

        this.guideContainer.zOrder = 19;
        this.tipContainer.zOrder = 19;


        this.draw(giveConfig[0].x,giveConfig[0].y,giveConfig[0].radius,giveConfig[0].tipimg,giveConfig[0].tipx,giveConfig[0].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(giveConfig[0].x,giveConfig[0].y);
        LayaSample.clickAni.zOrder = 20;
        LayaSample.angelDia.setText('dialog/new_guide_6.png');
        LayaSample.angelDia.setStyle(Laya.stage.width+70,yval(406));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //提示点击赠送按钮
    _proto.step_clicl_give = function(){
        this.draw(0,0,null,0,0);
        this.guideContainer.removeSelf();
        this.guideContainer.destroy();//销毁之前对象
        this.step1();
        this.guideContainer.zOrder = 100;
        this.tipContainer.zOrder = 100;
        this.draw(giveConfig[1].x,giveConfig[1].y,giveConfig[1].radius,giveConfig[1].tipimg,giveConfig[1].tipx,giveConfig[1].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(giveConfig[1].x,giveConfig[1].y);
        LayaSample.clickAni.zOrder = 101;
        LayaSample.angelDia.setText('dialog/new_guide_15.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(456));
        LayaSample.angelDia.zOrder = 101;
        LayaSample.angelDia.visible = true;
    }
    //确定赠送
    _proto.step_click_confirm = function(){
        this.draw(giveConfig[2].x,giveConfig[2].y,giveConfig[2].radius,giveConfig[2].tipimg,giveConfig[2].tipx,giveConfig[2].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(giveConfig[2].x,giveConfig[2].y);
        LayaSample.clickAni.zOrder = 100;
        LayaSample.angelDia.setText('dialog/new_guide_15.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(300));
        LayaSample.angelDia.zOrder = 100;
        LayaSample.angelDia.visible = true;
    }

    // 偷取引导部分
    //1提示点击好友使用step_click_friend

    //2提示点击好友家园图标
    _proto.steal_click_home = function(){
        console.log('steal_click_home');
        this.guideContainer.zOrder = 100;
        this.tipContainer.zOrder = 100;
        this.draw(stealConfig[1].x,stealConfig[1].y,stealConfig[1].radius,stealConfig[1].tipimg,stealConfig[1].tipx,stealConfig[1].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(stealConfig[1].x,stealConfig[1].y);
        LayaSample.clickAni.zOrder = 101;
        LayaSample.angelDia.setText('dialog/new_guide_8.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(556));
        LayaSample.angelDia.zOrder = 101;
        LayaSample.angelDia.visible = true;
    }
    //3提示点击成熟的植物
    _proto.steal_click_seed = function(){
        console.log('steal_click_land');
        this.guideContainer.zOrder = 19;
        this.tipContainer.zOrder = 19;
        this.draw(stealConfig[2].x,stealConfig[2].y,stealConfig[2].radius,stealConfig[2].tipimg,stealConfig[2].tipx,stealConfig[2].tipy);

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(stealConfig[2].x,stealConfig[2].y);
        LayaSample.clickAni.zOrder = 20;
        LayaSample.angelDia.setText('dialog/new_guide_9.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(256));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;

    }
    //4提示点击偷取按钮
    _proto.steal_click_stealicon = function(){
        console.log('steal_click_stealicon');
        this.draw(stealConfig[3].x,stealConfig[3].y,stealConfig[3].radius,stealConfig[3].tipimg,stealConfig[3].tipx,stealConfig[3].tipy)

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(stealConfig[3].x,stealConfig[3].y);
        LayaSample.clickAni.zOrder = 20;
        LayaSample.angelDia.setText('dialog/new_guide_9.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(356));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //5提示点击返回家园按钮
    _proto.steal_click_backhome = function(){
        console.log('steal_click_backhome');
        this.draw(stealConfig[4].x,stealConfig[4].y,stealConfig[4].radius,stealConfig[4].tipimg,stealConfig[4].tipx,stealConfig[4].tipy)

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(stealConfig[4].x,stealConfig[4].y);
        LayaSample.clickAni.zOrder = 20;
        LayaSample.angelDia.setText('dialog/new_guide_11.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(256));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
    }
    //6提示点击消息图标
    _proto.steal_click_message = function(){
        console.log('steal_click_messgae');
        this.draw(stealConfig[5].x,stealConfig[5].y,stealConfig[5].radius,stealConfig[5].tipimg,stealConfig[5].tipx,stealConfig[5].tipy)

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(stealConfig[5].x,stealConfig[5].y);
        LayaSample.clickAni.zOrder = 20;
        LayaSample.angelDia.setText('dialog/new_guide_7.png');
        LayaSample.angelDia.setStyle(Laya.stage.width+90,yval(656));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;

        // this.done();
        ISDONENEW = true;//结束新手引导
    }
    //赠送果实给果实收购商
    _proto.give_click_buyer = function(){
        console.log('点击果实收购商');

        console.log('steal_click_messgae');
        this.draw(clickBuyer[0].x,clickBuyer[0].y,clickBuyer[0].radius,clickBuyer[0].tipimg,clickBuyer[0].tipx,clickBuyer[0].tipy)

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(clickBuyer[0].x,clickBuyer[0].y);
        LayaSample.clickAni.zOrder = 20;
        LayaSample.angelDia.setText('dialog/new_guide_12.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(456));
        LayaSample.angelDia.zOrder = 20;
        LayaSample.angelDia.visible = true;
        ISDONENEW = true;//结束新手引导
        // this.done();
    }
    //

    //邀请好友步骤
    //1点击邀请好友按钮
    _proto.invite_click_invite = function(){
        console.log('invite_click_invite');
        this.draw(inviteConfig[0].x,inviteConfig[0].y,inviteConfig[0].radius,inviteConfig[0].tipimg,inviteConfig[0].tipx,inviteConfig[0].tipy)

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }
        LayaSample.clickAni.setStyle(inviteConfig[0].x,inviteConfig[0].y);
        LayaSample.clickAni.zOrder = 101;
        LayaSample.angelDia.setText('dialog/new_guide_18.png');
        LayaSample.angelDia.setStyle(Laya.stage.width,yval(256));
        LayaSample.angelDia.zOrder = 101;
        LayaSample.angelDia.visible = true;
    }
    //结束引导
    _proto.done = function(){
        this.draw(0,0,null,0,0);
        this.guideContainer.visible = false;
        this.guideContainer.removeSelf();
        this.guideContainer.destroy();

        if(!LayaSample.angelDia){
            LayaSample.angelDia = new AngelDia();
            Laya.stage.addChild(LayaSample.angelDia);
        }
        if(!LayaSample.clickAni){
            LayaSample.clickAni = new ClickAni();
            Laya.stage.addChild(LayaSample.clickAni);
        }

        LayaSample.angelDia.removeSelf()
        LayaSample.angelDia.destroy()
        LayaSample.angelDia = null;
        LayaSample.clickAni.removeSelf()
        LayaSample.clickAni.destroy()
        LayaSample.clickAni = null;

        console.log(444)
    }
    return GreenHandGuide;
})();
