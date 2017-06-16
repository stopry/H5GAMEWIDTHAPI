//签到
var SignIn = (function(){
    function SignIn(signIn,isCheck,signInAlert,signInAward){
        this.signIn = signIn;//签到日历
        this.isCheck = isCheck;//是否签到
        this.signInAlert = signInAlert;//签到弹出框
        this.signInAward = signInAward;//签到奖励
        this.init();
        this.signIn.on(Laya.Event.CLICK,this,this.checkIn);
    }
    var _proto = SignIn.prototype;
    _proto.init = function(){
        this.signIn.visible = this.isCheck?false:true;
    }
    _proto.checkIn = function(){
        this.signIn.visible = false;
        this.award = Service.signIn().award;
        this.signInAward.text = "获得"+this.award;
        Laya.Tween.to(this.signInAlert,{visible:true,alpha:1,scaleX:1,scaleY:1},300,Laya.Ease.backOut,Laya.Handler.create(this,this.callBackHd));
    }
    _proto.callBackHd = function(){
        Laya.timer.once(400,this,this.hideAni);
    }
    _proto.hideAni = function(){
        Laya.Tween.to(this.signInAlert,{alpha:0,scaleX:0,scaleY:0,visible:false},300,Laya.Ease.backOut,null);
    }   
    return SignIn;
})()

//消息展示
var Message = (function(){
    function Message(msgBtn,isHasMsg,msgArr){
        this.msgBtn = msgBtn;//消息提示按钮
        this.isHasMsg = isHasMsg;//是否有消息
        this.msgArr = msgArr;//消息列表数组
        this.msgLen = this.msgArr.length;//消息数量
        this.arrIdx = 0;//消息列表索引
        this.isLoading = false;//是否在加载中
        this.getToken();//获取token
        this.init();
    }
    var _proto = Message.prototype;
    _proto.init = function(){
        this.msgBtn.visible = this.isHasMsg;//是否展示消息按钮
        if(this.msgLen<1){
            this.msgBtn.visible = false;
        }
        this.msgBtn.on("click",this,this.showMsgDetail);//点击展示消息
    }
    //显示消息详情
    _proto.showMsgDetail = function(){
        console.log('testBug22');
        var that = this;
        if(that.arrIdx>=that.msgLen){//没有可读取的消息
            return;
        }
        if(!this.isLoading){
            this.isLoading = true;

            console.log(this.arrIdx);

            var id = this.msgArr[this.arrIdx].id;//消息id
            if(this.msgArr[this.arrIdx].action=="show_ck"){
                var nickName = (JSON.parse(localStorage.getItem("BASEINFO"))).nickname;
                ISGIVE = false;//有show_ck操作消息说明没有赠送过果实 重置ISGIVE为false 进行第二部赠送果实引导
                if(LayaSample.greenHandGuide&&LayaSample.greenHandGuide.guideContainer){
                    // LayaSample.greenHandGuide.step1();
                    LayaSample.greenHandGuide.done();   
                }
                if(!LayaSample.greenHandGuide){
                    LayaSample.greenHandGuide = new GreenHandGuide(nickName);//传用户昵称到新手引导类
                };
                var textObj = {
                    title:'赠送果实',
                    con:'亲爱的'+nickName+',您种植的第一棵作物成熟并有了收成，您可以将果实赠送给果实收购商来换取红包哦！',
                    sel1:'仓库看看',
                    sel2:''
                }
                var closeFn = function(){
                    console.log('关闭');
                    ISGIVE = true;
                    LayaSample.farm.message();//从后台获取消息
                    LayaSample.greenHandGuide.angel.destroy();
                    LayaSample.greenHandGuide.angel.removeSelf();
                }
                var sel1Fn = function(){
                    console.log('去仓库');
                    ISGIVE = true;
                    LayaSample.farm.message();//从后台获取消息
                    LayaSample.greenHandGuide.angel.destroy();
                    LayaSample.greenHandGuide.angel.removeSelf();
                    if(!LayaSample.enterPot){
                        LayaSample.enterPot = new EnterPot();
                    }
                    Laya.stage.addChild(LayaSample.enterPot);
                    LayaSample.enterPot.showThis();
                    setTimeout(function(){
                        LayaSample.enterPot.showFruit();
                    },300)
                    LayaSample.farm.alertLayer.visible = true;
                }
                var sel2Fn = function(){
                    console.log('赠送果实');
                    ISGIVE = true;
                    LayaSample.greenHandGuide.angel.destroy();
                    LayaSample.greenHandGuide.angel.removeSelf();
                    LayaSample.greenHandGuide.step1();
                    LayaSample.greenHandGuide.give_click_buyer();
                }
                if(!LayaSample.greenGive){
                    LayaSample.greenGive = new GreenHandDia(textObj,closeFn,sel1Fn,sel2Fn);
                }
                Laya.stage.addChild(LayaSample.greenGive);
                LayaSample.greenGive.showThis()

                //LayaSample.greenHandGuide.angel.destroy();
                //LayaSample.greenHandGuide.angel.removeSelf();
                if(LayaSample.greenHandGuide.angel){
                    LayaSample.greenHandGuide.angel.destroy();
                    LayaSample.greenHandGuide.angel.removeSelf();
                }
                LayaSample.greenHandGuide.addAngel(5.25,Laya.stage.height / 3.1);

                that.arrIdx++;
                if(that.arrIdx>=that.msgLen-1){//没有可读取的消息
                    that.msgBtn.visible = false;
                }
                that.isLoading = false;
                return;
            }
            Http.get("/api/game/msg/get",{id:id},function(data){
                if(!data.success){
                    LayaSample.littleTip.showThis(data.msg);
                    that.msgBtn.visible = false;
                    return;
                }
                if(!LayaSample.msgAlert){
                    LayaSample.msgAlert = new MsgAlert();
                }
                Laya.stage.addChild(LayaSample.msgAlert);
                LayaSample.msgAlert.showThis(data.obj.msgTitle,data.obj.msgContent);
                that.arrIdx++;
                if(that.arrIdx>=that.msgLen){//没有可读取的消息
                // if(that.arrIdx>=that.msgLen-1){//没有可读取的消息
                    that.msgBtn.visible = false;
                }
                that.isLoading = false;    
            },["Authorization",that.token]);
        }
    }
    //向服务器更新操作消息
    _proto.updateActionMsg = function(action){
        //循环消息列表
        var that = this;
        if(!this.msgArr.length) return;
        for(var i = 0;i<this.msgArr.length;i++){
            if(!this.msgArr[i].action){
                continue;
            }else{
                if(this.msgArr[i].action==action){
                    Http.get("/api/game/msg/update",{id:that.msgArr[i].id},function(data){
                        if(!data.success) return;
                        LayaSample.farm.message();//重新更新消息列表
                    },["Authorization",that.token])
                }
            }
        }    
    }
    //得到token
    _proto.getToken = function(){
         if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }

    // _proto.checkIn = function(){
    //     this.signIn.visible = false;
    //     this.award = Service.signIn().award;
    //     this.signInAward.text = "获得"+this.award;
    //     Laya.Tween.to(this.signInAlert,{visible:true,alpha:1,scaleX:1,scaleY:1},300,Laya.Ease.backOut,Laya.Handler.create(this,this.callBackHd));
    // }
    // _proto.callBackHd = function(){
    //     Laya.timer.once(400,this,this.hideAni);
    // }
    // _proto.hideAni = function(){
    //     Laya.Tween.to(this.signInAlert,{alpha:0,scaleX:0,scaleY:0,visible:false},300,Laya.Ease.backOut,null);
    // }
    return Message;
})()

//一键添加好友
var AddFriends = (function(){
    function addFriends(addBtn){
        this.addBtn = addBtn;
        this.init();
    }
    addFriends.prototype.init = function(){
        this.getToken();
        this.isAdded();
        this.addBtn.on("click",this,this.toAdd);
    };
    addFriends.prototype.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //判断是否可添加
    addFriends.prototype.isAdded = function(){
        var that = this;
        Http.get("/api/game/friend/checkadd",null,function(data){
            console.log(data);
            if(!data.success){
                that.addBtn.visible = false;
                return
            };
            if(data.obj){
                that.addBtn.visible = true;
            }else{
                that.addBtn.visible = false;
            }
        },["Authorization",that.token])
    };
    //添加好友
    addFriends.prototype.toAdd = function(){
        var that = this;
        Http.get("/api/game/friend/addRand",null,function(data){
            console.log(data);
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                that.addBtn.visible = false;
                return;
            }
            LayaSample.littleTip.showThis("添加好友成功");
            that.addBtn.visible = false;
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
        },["Authorization",that.token]);
    }
    return addFriends;
})()
//公告
var Annouce = (function(){
    var Stage             = Laya.Stage;//舞台
    var HTMLDivElement    = Laya.HTMLDivElement;//html
    var HTMLIframeElement = Laya.HTMLIframeElement;//iframe
    var Browser           = Laya.Browser;//浏览器
    function Annouce(billBoard,backBtn){
        this.billBoard = billBoard;//农场公告牌
        this.backBtn = backBtn;//农场公告box关闭按钮
        this.init();
    }
    var _proto = Annouce.prototype;
    _proto.init = function(){
        this.createBox()
        this.setStyle();
    };
    //设置样式
    _proto.setStyle = function(){

    }
    //创建公告框容器
    _proto.createBox = function(){
        // var div = document.createElement("div");
        // div.style.position = "fixed";
        // div.style.top = 0;
        // div.style.left = 0;
        // div.style.width = "100%";
        // div.style.height = "100%";
        // div.style.zIndex = "9999999 !important";
        // div.style.background = "#fff";
		var html = '<div id="iframeBox"><iframe style="width:100%;height:100%;" id="webview-iframe" name="webview-iframe" frameborder="no" scrolling="auto" src="./res/html/announceDetail.html"></iframe><img src="./res/html/images/game/webp_btn_back.png" id="backFarm" style="z-index:999;position:absolute;bottom:0;width:36%;left:32%;"/></div>'
        // div.innerHTML = html;
        document.getElementById("announce").setAttribute("class","");
        document.getElementById("announce").innerHTML = html;
        document.getElementById("backFarm").addEventListener("click",function(){
            document.getElementById("announce").setAttribute("class","hide");
        },!1)
        var h = window.innerHeight;
        document.getElementById("iframeBox").style.marginTop = ((h-(h*0.84))/2)+"px";
    }
    //显示公告
    _proto.showAnnounceBox = function(){

    }
    //关闭公共
    _proto.hideAnnounceBox = function(){

    };
    return Annouce;
})()
//头部滚动消息
var GongGao = (function(){
	var Text = Laya.Text;
	var txt;
    var timeLoop;
    var _textLength;
    function GongGao(){
        this.init();
    };
    var _proto = GongGao.prototype;
    _proto.init = function(){
        console.log(4);
        this.start();
    }
    //开始
    _proto.start = function(){
        var that = this;
        Http.get("/api/msg/get",null,function(data){
            if(!data.success|!data.obj) return;
            var text = data.obj;
            var _initLen = text.length;
            var pre = "";
            for(var k = 0;k<24;k++){
                pre+="    ";
            }
            text = pre+text+pre;
            var _len = text.length;
            _textLength = ((_len-_initLen)/4.8+_initLen)*14.5;
            that.createText(text);
        })
    }
    //创建滚动文字
    _proto.createText = function(msgText){
        txt = new Text();
		txt.overflow = Text.SCROLL;
		txt.text = msgText;
		txt.size(520, 25);
		txt.x = Laya.stage.width - txt.width >> 1;
		txt.y = Laya.stage.height - txt.height >> 1;
		// txt.borderColor = "#FFFF00";
		txt.fontSize = 20;
		txt.color = "#ff0000";
		Laya.stage.addChild(txt);
        this.setStyle(txt);
        Laya.timer.clear(this,this.startScrollText);
        txt.visible = true;
		Laya.timer.loop(20,this,this.startScrollText);
    }
    //设置样式
    _proto.setStyle = function(ele){
        ele.pivot(ele.width/2,ele.height/2);
        ele.pos(Laya.stage.width / 2, 222);
        ele.zOrder = 999;
    }
    //滚动文字
    _proto.startScrollText = function(){
        txt.scrollX +=1;
        console.log(txt.scrollX,_textLength);
        if(txt.scrollX>=_textLength){
            this.stop();
        }
    }
    //结束
    _proto.stop = function(){
        Laya.timer.clear(this,this.startScrollText);
        txt.visible = false;
    }
    return GongGao;
})();
//收购商说话
function buyerSay(word){
    //生成随机数(0-9);
    var word = word;
    var rnd = Math.floor(Math.random()*10);
    if(rnd<=3){
        word.skin = 'createRole/tips1.png';
    }else if(rnd>3&&rnd<=6){
        word.skin = 'createRole/tips2.png';
    }else{
        word.skin = 'createRole/tips3.png';
    }
    Laya.Tween.to(word,{scaleY:1,scaleX:1,alpha:1},600,Laya.Ease.backIn,Laya.Handler.create(null,function(){setTimeout(function(){ Laya.Tween.to(word,{scaleY:0.3,scaleX:0.3,alpha:0},500,Laya.Ease.backIn,null);},3000)}));

}
//狗说话
function dogSay(word){
    //生成随机数(0-9);
    var word = word;
    var rnd = Math.floor(Math.random()*10);
    word.skin = 'add/dog_speak.png';
    Laya.Tween.to(word,{scaleY:1,scaleX:1,alpha:1},600,Laya.Ease.backIn,Laya.Handler.create(null,function(){setTimeout(function(){ Laya.Tween.to(word,{scaleY:0.3,scaleX:0.3,alpha:0},500,Laya.Ease.backIn,null);},3000)}));

}
//收购商功能
var BuyerFun = (function(){
    function BuyerFun(buyer){
        this.buyer = buyer;//收购商;

        this.init();
    };
    var _proto = BuyerFun.prototype;
    _proto.init = function(){
        this.getToken();
        this.buyer.on('click',this,this.clickCallBack);
    };

    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }

    _proto.clickCallBack = function(){
        this.getToken();
        // FirstGive
        var that = this;
        if(LayaSample.greenHandGuide){
            LayaSample.greenHandGuide.done()
        };
        Http.get("/api/game/getPlayerItemDetailByType",{type:"02"},function(data){
            var fruitData = data;
            var seedNum = 0;
            console.log(fruitData);
            if(fruitData.obj.length&&fruitData.obj[0]){
                seedNum = fruitData.obj[0].cnt;//种子数量 
            };
            //用户信息
            Http.get("/api/game/loadPlayer",null,function(result){
                console.log(result);
                if(!result.success){
                    LayaSample.littleTip.showThis(result.msg);
                    return
                };
                var data = result.obj;

                var isFirstGive = data.doTransfer==0?true:false;//是否是第一次赠送
                var isVisitor = data.userType==0?true:false;//是否是游客
                var isBindAli = data.alipay?true:false;//是否绑定支付宝
                
                if(isFirstGive&&!isBindAli){//第一次赠送并且未绑定支付宝-绑定支付宝
                    if(!LayaSample.firstGive){
                        LayaSample.firstGive = new FirstGive();
                        Laya.stage.addChild(LayaSample.firstGive);
                    }
                    LayaSample.firstGive.showThis();
                }else if(!isFirstGive&&isVisitor){//不是第一次赠送且是游客身份-绑定手机号
                    if(!LayaSample.visitorBind){
                        LayaSample.visitorBind = new VisitorBind();
                        Laya.stage.addChild(LayaSample.visitorBind);
                    }
                    LayaSample.visitorBind.showThis();
                }else if(seedNum<10||!fruitData.obj.length){
                    LayaSample.littleTip.showThis("您的仓库中的果实数量少于10个");
                    if(!LayaSample.noSeedTip){
                        LayaSample.noSeedTip = new noSeedTip();
                        Laya.stage.addChild(LayaSample.noSeedTip);
                    }
                    LayaSample.noSeedTip.showThis();
                    return;
                }else if(!isFirstGive&&!isVisitor){//已绑定支付宝(不是第一次赠送)且不是游客-直接弹出赠送框
                    if(!LayaSample.giveSeedDia){
                        LayaSample.giveSeedDia = new GiveSeedDia();
                        Laya.stage.addChild(LayaSample.giveSeedDia);
                    }
                    LayaSample.giveSeedDia.showThis();
                }

            },["Authorization",that.token])

        },["Authorization",that.token]);



        // if(!LayaSample.GiveSeedDia){
        //     LayaSample.GiveSeedDia = new GiveSeedDia();
        //     Laya.stage.addChild(LayaSample.GiveSeedDia);
        // }
        // LayaSample.GiveSeedDia.showThis();
        return;
        
    };
    return BuyerFun;
})()