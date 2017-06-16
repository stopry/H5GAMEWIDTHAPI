var Header = (function(){
    //params——头部-下拉菜单-头像-木材-石头-水泥板-钻石-日志-排行-充值-toggle按钮-下拉菜单状态-菜单隐藏是的y值-菜单显示状态下的y值
    function Header(header,toggleMenu,headerImg,nickName,log,rank,headerToggle,menuState,topMenu,noramalTop,datas,id,nichen,lvgrade,fruitNum,expText,epxBar){
        this.header = header;//头部
        this.toggleMenu = toggleMenu;//下拉菜单
        this.headerImg = headerImg;//头像
        this.nickName = nickName;//用户昵称
        this.log = log;//日志
        this.rank = rank;//排行
        this.headerToggle = headerToggle;//toggle按钮
        this.menuState = menuState;//下拉菜单状态
        this.topMenu = topMenu;//6菜单隐藏是的y值
        this.noramalTop = noramalTop;//菜单显示状态下的y值
        this.datas = datas;//数据
        this.id = id;//用户id
        this.nichen = nichen;//用户昵称
        this.lvgrade = lvgrade;//用户等级
        this.fruitNum = fruitNum;//用户果实数
        this.expText = expText;//经验数值
        this.epxBar = epxBar;//经验条
        console.log(this.datas);    
        //初始化
        this.onLoad();
    };
    var _proto = Header.prototype;
    _proto.onLoad = function(){
        this.getToken();
        this.headerToggle.on(Laya.Event.CLICK,this,this.menuToggle);
        this.loadHeaderDatas(this.datas);
        this.log.on(Laya.Event.CLICK,this,this.showLogList);
        this.headerImg.on(Laya.Event.CLICK,this,this.showUserInfoDia);
        this.rank.on(Laya.Event.CLICK,this,this.showRankList);
        this.setHeaderPos();
        //新手引导添加
        this.start();
    };
    //得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //是否进行新手引导
    _proto.start = function(){
        var that = this;
        // console.log(1);
        if(this.datas.doNew == "1"){//已经进行过新手引导
            ISDONENEW = true; 
            console.log(1,ISDONENEW); 
            return;
        }
        ISDONENEW = false;
        setTimeout(function(){
            LayaSample.greenHandGuide = new GreenHandGuide(that.datas.nickname);//传用户昵称到新手引导类
            LayaSample.greenHandGuide.init();
            // LayaSample.greenHandGuide.addAngel(18.25,820);
        },0)
        
    }
    //设置头部显示位置
    _proto.setHeaderPos = function(){
        var h = Laya.Browser.clientHeight;
        var w = Laya.Browser.clientWidth;
        var lh = Laya.stage.height;
        var lw = Laya.stage.width;
        // console.log(h);
        // console.log(w);
        // console.log(lh);
        // console.log(lw);
        // var y = -(lh - 1024+10)
        // console.log(y)
        this.header.y = -10;
        // if(!ISAPP){
        //     this.header.y = (640/w)*35-10
        //     // alert(1);
        // }
        // alert((640/w)*35);
    }
    //显示日志列表
    _proto.showLogList = function(){
        if(!LayaSample.log){
            LayaSample.log = new Log();
        }
        Laya.stage.addChild(LayaSample.log);
        LayaSample.farm.alertLayer.visible = true;
        LayaSample.log.showThis();
    }
    //显示用户信息弹出层】
    _proto.showUserInfoDia = function(){
        if(!LayaSample.userAlert){
            LayaSample.userAlert = new UserAlert(this.datas);
        }
        Laya.stage.addChild(LayaSample.userAlert);
        LayaSample.farm.alertLayer.visible = true;
        LayaSample.userAlert.showThis();
        // Laya.Tween.to(LayaSample.userAlert,{scaleY:1,scaleX:1},300,Laya.Ease.backIn,null);
    }
    //显示排行榜列表
    _proto.showRankList = function(){
        // LayaSample.farm.alertLayer.visible = true;
        // Laya.Tween.to(LayaSample.rankList,{scaleY:1,scaleX:1},300,Laya.Ease.backIn,null);
        if(!LayaSample.rankList){
            LayaSample.rankList = new RankList();
        }
        Laya.stage.addChild(LayaSample.rankList);
        LayaSample.rankList.showThis();
    }
    //显示充值弹出层
    // _proto.showRechargeDia = function(){
    //     if(!LayaSample.recharge){
    //         LayaSample.recharge = new Recharge();
    //     }
    //     Laya.stage.addChild(LayaSample.recharge);
    //     LayaSample.recharge.showThis();
    // }
    //下拉菜单效果
    _proto.menuToggle = function(){
        if(this.menuState){
            this.headerToggle.skin = "ui/header_pulldown.png";
            Laya.Tween.to(this.toggleMenu,{y:this.topMenu},300,Laya.Ease.backOut,null);
        }else{  
            this.headerToggle.skin = "ui/header_pullup.png";
            Laya.Tween.to(this.toggleMenu,{y:this.noramalTop},300,Laya.Ease.backOut,null);
        }
        this.menuState = !this.menuState;
    };
    //头部数据显示
    _proto.loadHeaderDatas = function(headerDatas){
        this.nickName.text = headerDatas.nickname+"的家园";
        this.headerImg.skin = "ui/head"+headerDatas.pic+".png"; 
        this.id.text = headerDatas.id;//用户id
        this.nichen.text = headerDatas.nickname;//用户昵称
        this.lvgrade.text = headerDatas.level//用户等级
        this.fruitNum.text = headerDatas.cnt?headerDatas.cnt:0;//果实数
        this.expText.text = headerDatas.exp+"/"+headerDatas.levexp;
        this.epxBar.value = headerDatas.exp/headerDatas.levexp; 
    }; 
    return Header;
})()