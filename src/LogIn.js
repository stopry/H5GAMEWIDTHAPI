//登录界面UI
var LogIn = (function(_super){
    //Laya Http对象
    var HttpRequest = Laya.HttpRequest;
    var hr;//全局http实例对象
    var datas;//请求返回数据
    function LogIn(){
        LogIn.super(this);
        this.verBtnCanClick = true;//设置获取短信验证码的按为可点击
        this.timer = 120;//默认120秒可重新获取
        this.resetPwdData = {};//注册数据
        this.mobileReg = /^1[3-9][\d]{9}$/;
        //登录事件
        this.toLoad.on(Laya.Event.CLICK,this,this.logIn);
        //界面跳转
        this.toRegist.on(Laya.Event.CLICK,this,this.toRegistUI);
        this.mobileReg = /^1[3-9][\d]{9}$/;//手机号正则
        this.addLittleTip();
        //显示界面时检测是否自动填充登录信息
        this.autoInput();
        this.setFeedBtn();
        // this.forgetPwd.on("click",this,function(){window.open("https://www.baidu.com")});//忘记密码
        this.visLoad.on("click",this,this.visitors);//游客登陆
        this.visLoad.visible = ISAPP?false:true;

        this.forgetPwd.on("click",this,this.showResetPwdBox);
        this.formBox.getChildByName("backPage").on("click",this,this.closeResetPwdBox);
        this.formBox.getChildByName("getMsgCode").on("click",this,this.getVerCode);
        this.formBox.getChildByName("toReset").on("click",this,this.submitRestForm);
        this.clearBtn.on('click',this,this.clear);

    };
    Laya.class(LogIn,"LogIn",_super);
    var _proto = LogIn.prototype;
    //设置按钮反馈
    _proto.setFeedBtn = function(){
        new BtnFeed(this.toLoad);
        new BtnFeed(this.toRegist);
        new BtnFeed(this.remPwd);
        new BtnFeed(this.remAcut);
        new BtnFeed(this.forgetPwd);
        new BtnFeed(this.visLoad);
        new BtnFeed(this.formBox.getChildByName("getMsgCode"));
        new BtnFeed(this.formBox.getChildByName("backPage"));
        new BtnFeed(this.formBox.getChildByName("toReset"));
    }
    //显示重置密码弹框
    _proto.showResetPwdBox = function(){
        this.alertLayer.visible = true;
        Laya.Tween.to(this.retPwdForm,{scaleY:1,scaleX:1},200,null,null);
    }
    //关闭重置密码
    _proto.closeResetPwdBox = function(){
        Laya.Tween.to(this.retPwdForm,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
        this.alertLayer.visible = false;
    }
    //获取表单数据
    _proto.getFormData = function(){
        this.resetPwdData.mobile = (this.formBox.getChildByName("mobileNum").text).trim();;//手机号
        this.resetPwdData.newpwd = (this.formBox.getChildByName("inputPwd").text).trim();//新密码
        this.resetPwdData.vcode = (this.formBox.getChildByName("msgVerify").text).trim();//短信验证码
    }
    //重置表单
    _proto.reResetPwdForm = function(){
        this.resetPwdData.mobile = this.formBox.getChildByName("mobileNum").text = "";
        this.resetPwdData.newpwd = this.formBox.getChildByName("inputPwd").text = "";
        this.resetPwdData.vcode = this.formBox.getChildByName("msgVerify").text = "";
        clearInterval(this.countDown);
        this.formBox.getChildByName("getMsgCode").skin = "ui/common_a_45.png";
        this.formBox.getChildByName("getMsgCode").label = "获取";
        this.verBtnCanClick = true;
        this.timer = 120;
    }
    //获取验证码
    _proto.getVerCode = function(){
        //如果按钮可点击
        if(this.verBtnCanClick){
            this.getFormData();//获取input数据
            if(!this.mobileReg.test(this.resetPwdData.mobile)){
                LayaSample.littleTip.showThis("请输入正确手机号");
                return;
            }
            var that = this;
            that.verBtnCanClick = false;
            Http.get('/api/sms/sendRestSms',{mobile:that.resetPwdData.mobile},function(data){
                console.log(data)
                //异常情况    
                if(!data.success){
                    that.verBtnCanClick = true;
                    LayaSample.littleTip.showThis(data.msg);
                    return false;
                }
                //正常情况
                LayaSample.littleTip.showThis("验证码发送成功");
                that.formBox.getChildByName("getMsgCode").skin = "ui/building_03.png";
                that.formBox.getChildByName("getMsgCode").label = that.timer;
                that.countDown = setInterval(function(){
                    that.timer--;
                    that.formBox.getChildByName("getMsgCode").skin = "ui/building_03.png";
                    that.formBox.getChildByName("getMsgCode").label = that.timer;
                    if(that.timer<=0){
                        clearInterval(that.countDown);
                        that.formBox.getChildByName("getMsgCode").skin = "ui/common_a_45.png";
                        that.formBox.getChildByName("getMsgCode").label = "获取";
                        // 重新设置按钮状态可点击
                        that.verBtnCanClick = true;
                        that.timer = 120;
                    }
                },1000)
            });
        }else{
            return false;
        }
    }
    //提交表单
    _proto.submitRestForm = function(){
        var that = this;
        this.getFormData();//获取input数据
        Http.get("/api/reg/resetPwd",that.resetPwdData,function(data){
            console.log(data);
            if(!data.success){
                LayaSample.littleTip.showThis(data.msg);
                return;
            }
            LayaSample.littleTip.showThis("密码重置成功");
            that.reResetPwdForm();
            that.closeResetPwdBox();
        })
    }
    //添加小提示UI
    _proto.addLittleTip = function(){
        if(!LayaSample.littleTip){
            LayaSample.littleTip = new LittleTip()
        }
        LayaSample.littleTip.zOrder = 99999;
        Laya.stage.addChild(LayaSample.littleTip);
    };
    //移除加载动画
    _proto.removeLoadAni = function(){
        this.removeChild(this.loading);
    }
    //登录
    _proto.logIn = function(){
        ISVISITOR = false;
        var that = this;
        //账号
        this.account = this.logTel.text;
        //密码
        this.password = this.logPwd.text;
        if(!this.account){
            LayaSample.littleTip.showThis("请输入账号");
            return;
        }else if(!this.password){
            LayaSample.littleTip.showThis("请输入密码");
            return;
        }else if(!this.mobileReg.test(this.account)){
            LayaSample.littleTip.showThis("请输入正确手机号");
            return;
        }else{
            var loadDatas = {
                captchaCode: " ",
                captchaValue: " ",
                clientId: "098f6bcd4621d373cade4e832627b4f6",
                userName: that.account,
                password: that.password,
                login_channel: LOGINCHANNEL,//登录渠道
            }
            Http.post('/api/oauth/token',JSON.stringify(loadDatas),function(data){
                console.log(data);
                if(!data.success){
                    LayaSample.littleTip.showThis(data.msg);
                    return false;
                }
                //本地储存
                localStorage.setItem("clientId","098f6bcd4621d373cade4e832627b4f6");//设备id
                localStorage.setItem("access_token",data.obj.access_token);//token
                localStorage.setItem("token_type",data.obj.token_type);//token类型
                localStorage.setItem("userName",loadDatas.userName);//用户名
                localStorage.setItem("password",loadDatas.password);//密码
                //记住账号密码
                that.remLogInInfo();
                //获取当前登录玩家信息
                if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
                    LayaSample.littleTip.showThis("获取token失败，请重新登录");
                    return;
                }
                var token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
                Http.get("/api/game/loadPlayer",null,function(data){
                    console.log(data);
                    if(!data.success){
                        LayaSample.littleTip.showThis(data.msg);
                        that.regSusTip();
                        return;
                    }else{
                        LayaSample.littleTip.showThis("登录成功");
                        shareParam = '?superId='+data.obj.userId+'&field2='+data.obj.field2;
                        console.log('---------------------'+shareParam);          
                        that.removeSelf();
                        if(!LayaSample.farm){
                            LayaSample.farm = new Farm(data.obj);
                        }
                        localStorage.setItem('BASEINFO',JSON.stringify(data.obj));
                        LayaSample.farm.farmDatas = data.obj;
                        Laya.stage.addChild(LayaSample.farm);

                        //记住token为下次自动登录做准备
                        var timestamp = new Date().getTime();
                        var AUTOLOAD = {
                            token:token,
                            timestamp:timestamp,
                        };
                        localStorage.setItem("AUTOLOAD",JSON.stringify(AUTOLOAD));       

                    }
                },["Authorization",token]);
                
            })
        }
    }
    _proto.regSusTip = function(){
        if(!LayaSample.createRole){
            LayaSample.createRole = new CreateRole();
        }
        this.removeSelf();
        Laya.stage.addChild(LayaSample.createRole);
    }    
    //游客登录-设置虚拟手机号密码
    _proto.visitors = function(){
        ISVISITOR = true;
        var that = this;
        if(!localStorage.getItem("virMobile")||!localStorage.getItem("virPassword")){
        // if(true){
            Http.post("/api/reg/visitors",JSON.stringify({"field1": FILED1,"field2": FILED2,"field3": FILED3,"field4": FILED4, "field5": FILED5,sid:SUPERID}),function(data){
                if(!data.success){
                    LayaSample.littleTip.showThis(data.msg);
                    return
                }
                var data = data.obj;
                console.log(data);
                localStorage.setItem("virMobile",data.loginName);
                localStorage.setItem("virPassword",data.pwd);
                var visitorsLoad = {
                    "captchaCode": " ",
                    "captchaValue": " ",
                    "clientId": "098f6bcd4621d373cade4e832627b4f6",
                    "password": localStorage.getItem("virPassword"),
                    "userName": localStorage.getItem("virMobile"),
                    login_channel: LOGINCHANNEL,//登录渠道
                }
                console.log(visitorsLoad);
                Http.post("/api/oauth/token",JSON.stringify(visitorsLoad),function(data){
                    //本地储存
                    localStorage.setItem("clientId","098f6bcd4621d373cade4e832627b4f6");//设备id
                    localStorage.setItem("access_token",data.obj.access_token);//token
                    localStorage.setItem("token_type",data.obj.token_type);//token类型
                    //加载临时用户信息
                    if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
                        LayaSample.littleTip.showThis("获取token失败，请重新登录");
                        return;
                    }
                    var token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
                    Http.get("/api/game/loadPlayer",null,function(data){
                        console.log(data);
                        if(!data.success){
                            LayaSample.littleTip.showThis(data.msg);
                            that.regSusTip();                        
                            return;
                        }else{
                            LayaSample.littleTip.showThis("登录成功");
                            shareParam = '?superId='+data.obj.userId+'&field2='+data.obj.field2;
                            console.log('---------------------'+shareParam);          
                            that.removeSelf();
                            if(!LayaSample.farm){
                                LayaSample.farm = new Farm(data.obj);
                            }
                            localStorage.setItem('BASEINFO',JSON.stringify(data.obj));
                            Laya.stage.addChild(LayaSample.farm);

                            //记住token为下次自动登录做准备
                            var timestamp = new Date().getTime();
                            var AUTOLOAD = {
                                token:token,
                                timestamp:timestamp,
                            };
                            localStorage.setItem("AUTOLOAD",JSON.stringify(AUTOLOAD));        
                        }
                    },["Authorization",token]);
                })
            });
        }else{
            var visitorsLoad = {
                "captchaCode": " ",
                "captchaValue": " ",
                "clientId": "098f6bcd4621d373cade4e832627b4f6",
                "password": localStorage.getItem("virPassword"),
                "userName": localStorage.getItem("virMobile"),
                login_channel: LOGINCHANNEL,//登录渠道
            }
            Http.post("/api/oauth/token",JSON.stringify(visitorsLoad),function(data){
                //本地储存
                localStorage.setItem("clientId","098f6bcd4621d373cade4e832627b4f6");//设备id
                localStorage.setItem("access_token",data.obj.access_token);//token
                localStorage.setItem("token_type",data.obj.token_type);//token类型
                //加载临时用户信息
                if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
                    LayaSample.littleTip.showThis("获取token失败，请重新登录");
                    return;
                }
                var token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
                Http.get("/api/game/loadPlayer",null,function(data){
                    console.log(data);
                    if(!data.success){
                        LayaSample.littleTip.showThis(data.msg);
                        that.regSusTip();               
                        return;
                    }else{
                        LayaSample.littleTip.showThis("登录成功");
                        shareParam = '?superId='+data.obj.userId+'&field2='+data.obj.field2;
                        console.log('---------------------'+shareParam);          
                        that.removeSelf();
                        if(!LayaSample.farm){
                            LayaSample.farm = new Farm(data.obj);
                        }
                        localStorage.setItem('BASEINFO',JSON.stringify(data.obj));
                        Laya.stage.addChild(LayaSample.farm);

                        //记住token为下次自动登录做准备
                        var timestamp = new Date().getTime();
                        var AUTOLOAD = {
                            token:token,
                            timestamp:timestamp,
                        };
                        localStorage.setItem("AUTOLOAD",JSON.stringify(AUTOLOAD));    
                    }
                },["Authorization",token]);
            })
        }
    }
    //记住登录信息 
    _proto.remLogInInfo = function(){
        //是否记住账号
        this.isRemAct = this.remAcut.selected;
        //是否记住密码
        this.isRemPwd = this.remPwd.selected;
        //账号密码存储到本地
        if(this.isRemAct) localStorage.setItem("act",this.account);
        if(this.isRemPwd) localStorage.setItem("pwd",this.password);
        //从本地移除账号密码
        if(!this.isRemAct&&localStorage.getItem("act")) localStorage.removeItem("act");
        if(!this.isRemPwd&&localStorage.getItem("pwd")) localStorage.removeItem("pwd");
    }
    //将密码填充至对应input
    _proto.autoInput = function(){
        if(localStorage.getItem("act")){
            this.logTel.text = localStorage.getItem("act");
        }
        if(localStorage.getItem("pwd")){
            this.logPwd.text = localStorage.getItem("pwd");
        }
    }
    //界面跳转去注册
    _proto.toRegistUI = function(){
        this.removeSelf();
        if(!LayaSample.regist){
            LayaSample.regits = new Regist();
        }
        Laya.stage.addChild(LayaSample.regits);
    }
    //清理缓存
    _proto.clear = function(){
        console.log('清理缓存');
        window.clear_res = new Laya.LoaderManager();
        clear_res.clearRes("res/atlas/ui.json");
        clear_res.clearRes("res/atlas/dialog.json");
        clear_res.clearRes("res/atlas/createRole.json");

        window.location.href = gameUrl;
        // Laya.loader.load(
        //     ["res/atlas/ui.json","res/atlas/dialog.json","res/atlas/createRole.json"],
        //     null,
        //     null,
        //     Laya.Loader.ATLAS,
        //     1,
        //     false
        // );
    };
    return LogIn;
})(ui.LogInUI)