//注册UI
var registCite;//定义regist界面引用
var Regist = (function(_super){
    function Regist(){
        Regist.super(this);
        this.verBtnCanClick = true;//设置获取短信验证码的按为可点击
        this.timer = 120;//默认120秒可重新获取
        this.registData = {};//注册数据
        this.mobileReg = /^1[3-9][\d]{9}$/;
        this._uuid = '';//图片验证码识别码
        this.init();
    }
    Laya.class(Regist,"Regist",_super);
    var _proto = Regist.prototype;
    _proto.init = function(){
        registCite = this;
        this.registFeedBtn();
        this.addLittleTip();
        this.formBox.getChildByName("backPage").on(Laya.Event.CLICK,this,this.backLoadUI);
        this.formBox.getChildByName("getMsgCode").on(Laya.Event.CLICK,this,this.getVerCode);
        this.formBox.getChildByName("toRegist").on(Laya.Event.CLICK,this,this.submitData);
        this.formBox.getChildByName("imgCode").on(Laya.Event.CLICK,this,this.getNewCode)
        this.formBox.getChildByName("tjCode").text = SUPERID;
        // this.formBox.getChildByName("imgCode").skin='/api/captcha-image?'+new Date().getTime();
        this.getNewCode();
        console.log(SUPERID);
        this.formBox.getChildByName("tjCode").disabled = ISAPP?false:true;
    }
    //添加小提示UI
    _proto.addLittleTip = function(){
        if(!LayaSample.littleTip){
            LayaSample.littleTip = new LittleTip()
        }
        this.addChild(LayaSample.littleTip);
    };
    //注册反馈按钮
    _proto.registFeedBtn = function(){
        new BtnFeed(this.formBox.getChildByName("backPage"));
        new BtnFeed(this.formBox.getChildByName("toRegist"));
        new BtnFeed(this.formBox.getChildByName("getMsgCode"));
        new BtnFeed(this.formBox.getChildByName("imgCode"));
    }
    //获取form控件数据
    _proto.getFormData = function(){
        this.registData.mobileNum = this.mobileNumVal = this.formBox.getChildByName("mobileNum").text;//手机号码
        this.registData.inputPwd = this.mobileNumVal = this.formBox.getChildByName("inputPwd").text;//输入密码
        this.registData.msgVerify = this.mobileNumVal = this.formBox.getChildByName("msgVerify").text;//手机验证码
        this.registData.imgVerify = this.formBox.getChildByName("imgVerify").text;
    }
    //从服务器获取验证码
    _proto.getVerCode = function(){
        //如果按钮可点击
        if(this.verBtnCanClick){
            this.getFormData();//获取input数据
            if(!this.mobileReg.test(this.registData.mobileNum)){
                LayaSample.littleTip.showThis("请输入正确手机号");
                return;
            }
            if(!(this.registData.imgVerify).trim()){
                LayaSample.littleTip.showThis("请输入图片验证码");
                return;
            }
            var that = this;
            that.verBtnCanClick = false;
            Http.get('/api/sms/sendRegSms',{mobile:that.registData.mobileNum,uuid:that._uuid,imgCodeVal:that.registData.imgVerify},function(data){
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
    //提交注册
    _proto.submitData = function(){
        ISVISITOR = false;
        this.getFormData();
        var that = this;
        if(!this.mobileReg.test(this.registData.mobileNum)){
            LayaSample.littleTip.showThis("手机号码有误");
            return;
        }else if(!(this.registData.inputPwd).trim()){
            LayaSample.littleTip.showThis("请输入密码");
            return;
        }else if(!(this.registData.msgVerify).trim()){
            LayaSample.littleTip.showThis("请输输入手机验证码");
            return;
        }else if(!(this.registData.imgVerify).trim()){
            LayaSample.littleTip.showThis("请输输入图片验证码");
            return;
        }else if((this.registData.inputPwd).length<6){
            LayaSample.littleTip.showThis("密码长度不能小于6位");
            return;
        }else{
            SUPERID = this.formBox.getChildByName("tjCode").text||0;
            var regDatas = {
                mobile:that.registData.mobileNum,
                code:that.registData.msgVerify,
                password:that.registData.inputPwd,
                superiorId:SUPERID,
                field1:FILED1,
                field2:FILED2,
                field3:FILED3,
                field4:FILED4,
                field5:FILED5,
                imgCode:that.registData.imgVerify,
                uuid:that._uuid,
            };
            // console.log(JSON.stringify(this.registData));
             Http.post('/api/reg/register',JSON.stringify(regDatas),function(data){
                 console.log(data);
                 if(!data.success){
                     LayaSample.littleTip.showThis(data.msg);
                     return false;
                 }
                 LayaSample.littleTip.showThis("注册成功,即将进入角色创建页面");
                 //登录创建权限
                 //登录参数
                 var loadDatas = {
                    captchaCode: " ",
                    captchaValue: " ",
                    clientId: "098f6bcd4621d373cade4e832627b4f6",
                    userName: that.registData.mobileNum,
                    password: that.registData.inputPwd,
                    login_channel: LOGINCHANNEL,//登录渠道
                 }
                 Http.post('/api/oauth/token',JSON.stringify(loadDatas),function(data){
                    console.log(loadDatas);
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
                    setTimeout(function() {//进入创建角色界面
                        that.regSusTip();
                    }, 1000);
                 })
                 that.resetForm();
             })
        }  
    }
    //注册成功重置表单
    _proto.resetForm = function(){
        this.registData.mobileNum = this.mobileNumVal = this.formBox.getChildByName("mobileNum").text = '';//手机号码
        this.registData.inputPwd = this.mobileNumVal = this.formBox.getChildByName("inputPwd").text = '';//输入密码
        this.registData.msgVerify = this.mobileNumVal = this.formBox.getChildByName("msgVerify").text = '';//手机验证码
        this.registData.imgVerify = this.mobileNumVal = this.formBox.getChildByName("imgVerify").text = '';//手机验证码
        clearInterval(this.countDown);
        this.formBox.getChildByName("getMsgCode").skin = "ui/common_a_45.png";
        this.formBox.getChildByName("getMsgCode").label = "获取";
        // 重新设置按钮状态可点击
        this.verBtnCanClick = true;
        this.timer = 120;
    }
    //注册成功提示
    _proto.regSusTip = function(){
        if(!LayaSample.createRole){
            LayaSample.createRole = new CreateRole();
        }
        this.removeSelf();
        Laya.stage.addChild(LayaSample.createRole);
        // if(!LayaSample.farm){
        //     LayaSample.farm = new Farm()
        // }
        // this.alertLayer.visible = true;
        // var susTips = new TipDialog("注册成功","注册成功,是否返回登录页",this.backLoadUI,this.hideAlertLaye);
        // this.addChild(susTips);
        // susTips.showThis();
    }
    //隐藏alertLayer
    _proto.hideAlertLaye = function(){
        registCite.alertLayer.visible = false;
    }
    //返回登陆页面
    _proto.backLoadUI = function(){
        registCite.hideAlertLaye();
        this.removeSelf();
        Laya.stage.addChild(LayaSample.LogIn);
    }
    //生成uuid
    
    _proto.getNewCode = function(){
        this._uuid = util.createUUID();
        this.formBox.getChildByName("imgCode").skin='/api/captcha-image?ck='+this._uuid+'&t='+new Date().getTime();
    }
    return Regist;
})(ui.RegistUI)