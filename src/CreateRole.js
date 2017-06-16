//创建角色
var CreateRole = (function(_super){
    function CreateRole(){
        CreateRole.super(this);
        this.pic = 2;//默认头像为第二个
        this.init();
        this._focus = false;//默认输入框失去焦点
    }
    Laya.class(CreateRole,"CreateRole",_super);
    var _proto = CreateRole.prototype;
    _proto.init = function(){
        this.addLittleTip();
        new BtnFeed(this.confirmBtn);
        this.confirmBtn.on(Laya.Event.CLICK,this,this.submitData);

        this.nickName.on(Laya.Event.FOCUS,this,this.iptFocus);
        this.nickName.on(Laya.Event.BLUR,this,this.iptBlur);

        this.eachClick();
    }
    //输入框得到焦点
    _proto.iptFocus = function(){
        this._focus = true;
        console.log(this._focus);
    } 
    //输入框失去焦点
    _proto.iptBlur = function(){
        var that = this;
        setTimeout(function(){
            that._focus = false;
            console.log(that._focus);
        },700);
    } 
    //提交表单
    _proto.submitData = function(){
        var that = this;
        this.nickNameVal = this.nickName.text;
        this.picVal = this.pic;
        if(((this.nickNameVal).trim()).length>5||!this.nickNameVal.trim()){
            LayaSample.littleTip.showThis("昵称不合法")
        }else{
            //服务器交互
            var roleDatas = {
                nickname: that.nickNameVal,
                pic: that.picVal,
                superiorId: 1
            }
            var token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
            Http.post('/api/game/createPlayer',JSON.stringify(roleDatas),function(data){
                console.log(data);
                if(!data.success){
                    LayaSample.littleTip.showThis(data.msg);
                    return;
                }
                var token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");

                //创建完成重新登陆
                if(!ISVISITOR){
                    var loadDatas = {
                        captchaCode: " ",
                        captchaValue: " ",
                        clientId: "098f6bcd4621d373cade4e832627b4f6",
                        userName: localStorage.getItem("userName"),
                        password: localStorage.getItem("password"),
                        login_channel: LOGINCHANNEL,//登录渠道
                    }
                }else{
                    var loadDatas = {
                        captchaCode: " ",
                        captchaValue: " ",
                        clientId: "098f6bcd4621d373cade4e832627b4f6",
                        userName: localStorage.getItem("virMobile"),
                        password: localStorage.getItem("virPassword"),
                        login_channel: LOGINCHANNEL,//登录渠道
                    }
                }
                console.log(loadDatas);
                Http.post("/api/oauth/token",JSON.stringify(loadDatas),function(data){
                    if(!data.success){
                        LayaSample.littleTip.showThis(data.msg);
                        return;
                    }
                    console.log(data);
                    //本地储存
                    localStorage.setItem("clientId","098f6bcd4621d373cade4e832627b4f6");//设备id
                    localStorage.setItem("access_token",data.obj.access_token);//token
                    localStorage.setItem("token_type",data.obj.token_type);//token类型
                    var token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
                    Http.get("/api/game/loadPlayer",null,function(data){
                        console.log(data);
                        if(!data.success){
                            LayaSample.littleTip.showThis(data.msg);
                            // that.regSusTip()
                            return;
                        }else{
                            LayaSample.littleTip.showThis("创建成功,即将进入游戏！");
                            that.nickName.text = '';
                            that.removeSelf();
                            shareParam = '?superId='+data.obj.id+'&field2='+data.obj.field2;
                            console.log('---------------------'+shareParam);
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

                // Http.get("/api/game/loadPlayer",null,function(data){
                //     console.log(data);
                //     if(!data.success){
                //         LayaSample.littleTip.showThis(data.msg);
                //         return;
                //     }else{
                //         LayaSample.littleTip.showThis("创建成功,即将进入游戏！");
                //         setTimeout(function() {
                //             that.removeSelf();
                //             if(!LayaSample.farm){
                //                 LayaSample.farm = new Farm(data.obj);
                //             }
                //             Laya.stage.addChild(LayaSample.farm);    
                //         }, 1000);
                //     }
                // },["Authorization",token]);
            },["Authorization",token]);
        }
    }
    //界面跳转
    _proto.toLogIn = function(){
        this.removeSelf();
        Laya.stage.addChild(LayaSample.LogIn);
    }
    //添加小提示UI
    _proto.addLittleTip = function(){
        if(!LayaSample.littleTip){
            LayaSample.littleTip = new LittleTip()
        }
        this.addChild(LayaSample.littleTip);
    };
    //选择头像
    _proto.selPic = function(num){
        console.log(this._focus);
        console.log(this.pic);
        if(this._focus) return;
        this.pic = num;//改变选中的头像 
        console.log(this.pic);
        for(var i = 1;i<7;i++){
            if(i==num){
                this.headPicBox.getChildByName("head_"+num).getChildByName("bg").skin = "dialog/headerPicBgSel.png";
            }else{
                this.headPicBox.getChildByName("head_"+i).getChildByName("bg").skin = "dialog/headerPicBg.png";
            }
        }
    }
    //for循环选择头像事件遍历
    _proto.eachClick = function(){
        for(var i = 1;i<7;i++){
            new BtnFeed(this.headPicBox.getChildByName("head_"+i));
            this.headPicBox.getChildByName("head_"+i).on(Laya.Event.CLICK,this,this.selPic,[i]);
        };
    }
    return CreateRole;
})(ui.CreateRoleUI)