//游客绑定手机号 
// var BindMobile = (function(_super){
//     function BindMobile(){
//         BindMobile.super(this);
//         this.verBtnCanClick = true;//设置获取短信验证码的按为可点击
//         this.timer = 120;//默认120秒可重新获取
//         this.registData = {};//注册数据
//         this.mobileReg = /^1[3-9][\d]{9}$/;
//         this.zOrder = 100
//         this.init();
//     }
//     Laya.class(BindMobile,"BindMobile",_super);
//     var _proto = BindMobile.prototype;
//     _proto.init = function(){
//     	this.addLittleTip();
//     	this.getToken();
//     	this.setStyle();
//     	this.registFeedBtn();
//     	this.formBox.getChildByName("toBind").on("click",this,this.submitData);
//     	this.formBox.getChildByName("getMsgCode").on(Laya.Event.CLICK,this,this.getVerCode);
//     	this.formBox.getChildByName("backPage").on("click",this,this.hideThisAndGiveSeed);
//     	this.closeBindTip.on("click",this,this.hideBindTips);
//     	var nickName = (JSON.parse(localStorage.getItem("BASEINFO"))).nickname;
//     	this.bindDesc.text = "亲爱的"+nickName+"绑定支付宝可获得实时收益";
//     }
//     //得到token
//     _proto.getToken = function(){
//         if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
//             this.littleTip.showThis("获取token失败，请重新登录");
//             return;
//         }
//         this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
//     }
    
//     //样式设置
//     _proto.setStyle = function(){
//     	this.pivot(this.width/2,this.height/2);
//         this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
//         this.scale(0,0);
//     }
//     //添加小提示UI
//     _proto.addLittleTip = function(){
//         this.littleTip = new LittleTip();
//         this.addChild(this.littleTip);
//     };
//     //注册反馈按钮
//     _proto.registFeedBtn = function(){
//         new BtnFeed(this.formBox.getChildByName("backPage"));
//         new BtnFeed(this.formBox.getChildByName("toBind"));
//         new BtnFeed(this.formBox.getChildByName("getMsgCode"));
//         new BtnFeed(this.closeBindTip);
//     }
//     //显示提示层
//     _proto.showBindTips = function(){
//     	this.bindTipsBox.visible = true;
//     }
//     //显示提示层
//     _proto.hideBindTips = function(){
//     	this.bindTipsBox.visible = false;
//     }
//     //获取form控件数据
//     _proto.getFormData = function(){
//         this.registData.alipayAccount = this.alipayAccountVal = this.formBox.getChildByName("alipayAccount").text;//支付宝账号
//         this.registData.alipayName = this.alipayNameVal = this.formBox.getChildByName("alipayName").text;//支付宝用户名
//         this.registData.mobileNum = this.mobileNumVal = this.formBox.getChildByName("mobileNum").text;//手机号码
//         this.registData.inputPwd = this.inputPwdVal = this.formBox.getChildByName("inputPwd").text;//输入密码
//         this.registData.msgVerify = this.msgVerifyVal = this.formBox.getChildByName("msgVerify").text;//手机验证码
//     }
//     //从服务器获取验证码
//     _proto.getVerCode = function(){
//         //如果按钮可点击
//         if(this.verBtnCanClick){
//             this.getFormData();//获取input数据
//             if(!this.mobileReg.test(this.registData.mobileNum)){
//                 this.littleTip.showThis("请输入正确手机号");
//                 return;
//             }
//             var that = this;
//             that.verBtnCanClick = false;
//             Http.get('/api/sms/sendRegSms',{mobile:that.registData.mobileNum},function(data){
//                 console.log(data)
//                 //异常情况    
//                 if(!data.success){
//                     that.verBtnCanClick = true;
//                     that.littleTip.showThis(data.msg);
//                     return false;
//                 }
//                 //正常情况
//                 that.littleTip.showThis("验证码发送成功");
//                 that.formBox.getChildByName("getMsgCode").skin = "ui/building_03.png";
//                 that.formBox.getChildByName("getMsgCode").label = that.timer;
//                 that.countDown = setInterval(function(){
//                     that.timer--;
//                     that.formBox.getChildByName("getMsgCode").skin = "ui/building_03.png";
//                     that.formBox.getChildByName("getMsgCode").label = that.timer;
//                     if(that.timer<=0){
//                         clearInterval(that.countDown);
//                         that.formBox.getChildByName("getMsgCode").skin = "ui/common_a_45.png";
//                         that.formBox.getChildByName("getMsgCode").label = "获取";
//                         // 重新设置按钮状态可点击
//                         that.verBtnCanClick = true;
//                         that.timer = 120;
//                     }
//                 },1000)
//             });
//         }else{
//             return false;
//         }
//     }
//     //提交注册
//     _proto.submitData = function(){
//         this.getFormData();
//         var that = this;
//         if(!this.mobileReg.test(this.registData.mobileNum)){
//             this.littleTip.showThis("手机号码有误");
//             return;
//         }else if(!this.registData.alipayAccount){
// 			this.littleTip.showThis("请输入支付宝账号");
//             return;
//         }else if(!this.registData.alipayName){
// 			this.littleTip.showThis("请输入支付用户名");
//             return;
//         }else if(!(this.registData.inputPwd).trim()){
//             this.littleTip.showThis("请输入密码");
//             return;
//         }else if(!(this.registData.msgVerify).trim()){
//             this.littleTip.showThis("请输输入手机验证码");
//             return;
//         }else if((this.registData.inputPwd).length<6){
//             this.littleTip.showThis("密码长度不能小于6位");
//             return;
//         }else{
//             var regDatas = {
//             	alipay:that.registData.alipayAccount,
//             	alipayName:that.registData.alipayName,
//                 mobile:that.registData.mobileNum,
//                 code:that.registData.msgVerify,
//                 password:that.registData.inputPwd,
//                 superiorId:SUPERID
//             }; 
//             // console.log(JSON.stringify(this.registData));
//              Http.post('/api/game/bind',JSON.stringify(regDatas),function(data){
//                  console.log(data);
//                  if(!data.success){
//                      that.littleTip.showThis(data.msg);
//                      return false;
//                  }
//                  that.littleTip.showThis("绑定成功");
//                  //登录创建权限
//                  //登录参数
//                  var loadDatas = {
//                     captchaCode: " ",
//                     captchaValue: " ",
//                     clientId: "098f6bcd4621d373cade4e832627b4f6",
//                     userName: that.registData.mobileNum,
//                     password: that.registData.inputPwd,
//                     login_channel: LOGINCHANNEL,//登录渠道
//                  }
//                  //游客绑定成功后用绑定的账号重新登录
//                  Http.post('/api/oauth/token',JSON.stringify(loadDatas),function(data){
//                     console.log(loadDatas);
//                     console.log(data);
//                     if(!data.success){
//                         that.littleTip.showThis(data.msg);
//                         return false;
//                     }
//                     //本地储存
//                     localStorage.setItem("clientId","098f6bcd4621d373cade4e832627b4f6");//设备id
//                     localStorage.setItem("access_token",data.obj.access_token);//token
//                     localStorage.setItem("token_type",data.obj.token_type);//token类型
//                     localStorage.setItem("userName",loadDatas.userName);//用户名
//                     localStorage.setItem("password",loadDatas.password);//密码
//                     //清除游客信息
//                     localStorage.removeItem("virPassword");
//                     localStorage.removeItem("virMobile");
//                     LayaSample.farm.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");//改变定时器token值;
//                     // LayaSample.friendsFarm.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");//改变定时器token值;

//                     setTimeout(function(){
//                     	//设置当前用户不是visitor
//                     	ISVISITOR = false;
//                     	that.hideThis();//关闭游客绑定手机号弹出窗
//                         LayaSample.giveSeed.showThis();//显示赠送框
//                     },1000)
//                 });
//                 that.resetForm();
//              },["Authorization",that.token]);
//         }  
//     }
//     //注册成功重置表单
//     _proto.resetForm = function(){
//         this.registData.alipayAccount = this.alipayAccountVal = this.formBox.getChildByName("alipayAccount").text = '';//支付宝账号
//         this.registData.alipayName = this.alipayNameVal = this.formBox.getChildByName("alipayName").text = '';//支付宝用户名
//         this.registData.mobileNum = this.mobileNumVal = this.formBox.getChildByName("mobileNum").text = '';//手机号码
//         this.registData.inputPwd = this.inputPwdVal = this.formBox.getChildByName("inputPwd").text = '';//输入密码
//         this.registData.msgVerify = this.msgVerifyVal = this.formBox.getChildByName("msgVerify").text = '';//手机验证码
//         clearInterval(this.countDown);
//         this.formBox.getChildByName("getMsgCode").skin = "ui/common_a_45.png";
//         this.formBox.getChildByName("getMsgCode").label = "获取";
//         // 重新设置按钮状态可点击
//         this.verBtnCanClick = true;
//         this.timer = 120;
//     }
//     //显示
//     _proto.showThis = function(){
//     	if(ISVISITOR&&!ISDONENEW){//如果是游客登陆并且没有进行过新手引导
//     		this.formBox.getChildByName("backPage").skin = "ui/building_03.png";

//     	}
//     	LayaSample.farm.alertLayer.visible = true;
//         Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
//         this.showBindTips();
//         var that = this;
//         setTimeout(function(){
//             that.hideBindTips();
//         },3000)
//     }
//     //关闭
//     _proto.hideThis = function(){
//     	// if(ISVISITOR&&!ISDONENEW){
//     	// 	this.littleTip.showThis("请绑定手机号进行下一步");
//     	// 	return;
//     	// } 
//     	Laya.Tween.to(this,{scaleY:0,scaleX:0},150,Laya.Ease.null,null);
//     	LayaSample.farm.alertLayer.visible = true;
//     }
//     //关闭自己和赠送弹出框
//     _proto.hideThisAndGiveSeed = function(){
//     	this.hideThis()
//     	LayaSample.giveSeed.closeThis();
//     	if(!ISGIVE){
//     		LayaSample.greenHandGuide.done();
//     	}
//         var isFirstTran = JSON.parse(localStorage.getItem('BASEINFO')).doTransfer;
//         var isFirstReap = JSON.parse(localStorage.getItem('BASEINFO')).doHarvest;
//         if(isFirstTran==0&&isFirstReap==1){
//             LayaSample.msg.arrIdx = 0;
//             LayaSample.msg.msgArr = [{
//                 action:"show_ck",
//                 id:0,
//                 msg_type:"1"
//             }];
//             LayaSample.msg.msgLen = LayaSample.msg.msgArr.length;
//             LayaSample.msg.msgBtn.visible = LayaSample.msg.msgArr.length>0?true:false;
//         }else{
//             //LayaSample.farm.message();//从后台获取消息
//         }
//     	ISGIVE = true;
//     }
//     return BindMobile;
// })(ui.BindMobileUI)

// //绑定支付宝
// var BindAlipay = (function(_super){
//     function BindAlipay(){
//         BindAlipay.super(this);
//         this.verBtnCanClick = true;//设置获取短信验证码的按为可点击
//         this.timer = 120;//默认120秒可重新获取
//         this.registData = {};//注册数据
//         this.mobileReg = /^1[3-9][\d]{9}$/;
//         this.zOrder = 100
//         this.init();
//     }
//     Laya.class(BindAlipay,"BindAlipay",_super);
//     var _proto = BindAlipay.prototype;
//     _proto.init = function(){
//     	this.addLittleTip();
//     	this.getToken();
//     	this.setStyle();
//     	this.registFeedBtn();
//     	this.formBox.getChildByName("toBind").on("click",this,this.submitData);
//     	this.formBox.getChildByName("getMsgCode").on(Laya.Event.CLICK,this,this.getVerCode);
//     	this.formBox.getChildByName("backPage").on("click",this,this.hideThisAndGiveSeed);
//     	this.closeBindTip.on("click",this,this.hideBindTips);
//         var nickName = (JSON.parse(localStorage.getItem("BASEINFO"))).nickname;
//     	this.bindDesc.text = "亲爱的"+nickName+"绑定支付宝可获得实时收益";
//     }
//     //得到token
//     _proto.getToken = function(){
//         if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
//             this.littleTip.showThis("获取token失败，请重新登录");
//             return;
//         }
//         this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
//     }
//     //样式设置
//     _proto.setStyle = function(){
//     	this.pivot(this.width/2,this.height/2);
//         this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
//         this.scale(0,0);
//     }
//     //添加小提示UI
//     _proto.addLittleTip = function(){
//         this.littleTip = new LittleTip();
//         this.addChild(this.littleTip);
//     };
//     //注册反馈按钮
//     _proto.registFeedBtn = function(){
//         new BtnFeed(this.formBox.getChildByName("backPage"));
//         new BtnFeed(this.formBox.getChildByName("toBind"));
//         new BtnFeed(this.formBox.getChildByName("getMsgCode"));
//         new BtnFeed(this.closeBindTip);
//     }
//     //获取form控件数据
//     _proto.getFormData = function(){
//         this.registData.alipayAccount = this.alipayAccountVal = this.formBox.getChildByName("alipayAccount").text;//支付宝账号
//         this.registData.alipayName = this.alipayNameVal = this.formBox.getChildByName("alipayName").text;//支付宝用户名
//         this.registData.msgVerify = this.msgVerifyVal = this.formBox.getChildByName("msgVerify").text;//手机验证码
//     }
//     //从服务器获取验证码
//     _proto.getVerCode = function(){
//         //如果按钮可点击
//         if(this.verBtnCanClick){
//             this.getFormData();//获取input数据
//             // if(!this.mobileReg.test(this.registData.mobileNum)){
//             //     this.littleTip.showThis("请输入正确手机号");
//             //     return;
//             // }
//             var that = this;
//             that.verBtnCanClick = false;
//             Http.get('/api/game/sms/sendAlipaySms',null,function(data){
//                 console.log(data)
//                 //异常情况    
//                 if(!data.success){
//                     that.verBtnCanClick = true;
//                     that.littleTip.showThis(data.msg);
//                     return false;
//                 }
//                 //正常情况
//                 that.littleTip.showThis("验证码发送成功");
//                 that.formBox.getChildByName("getMsgCode").skin = "ui/building_03.png";
//                 that.formBox.getChildByName("getMsgCode").label = that.timer;
//                 that.countDown = setInterval(function(){
//                     that.timer--;
//                     that.formBox.getChildByName("getMsgCode").skin = "ui/building_03.png";
//                     that.formBox.getChildByName("getMsgCode").label = that.timer;
//                     if(that.timer<=0){
//                         clearInterval(that.countDown);
//                         that.formBox.getChildByName("getMsgCode").skin = "ui/common_a_45.png";
//                         that.formBox.getChildByName("getMsgCode").label = "获取";
//                         // 重新设置按钮状态可点击
//                         that.verBtnCanClick = true;
//                         that.timer = 120;
//                     }
//                 },1000)
//             },["Authorization",that.token]);
//         }else{
//             return false;
//         }
//     };
//     //提交注册
//     _proto.submitData = function(){
//         this.getFormData();
//         var that = this;
//   		if(!this.registData.alipayAccount){
// 			this.littleTip.showThis("请输入支付宝账号");
//             return;
//         }else if(!this.registData.alipayName){
// 			this.littleTip.showThis("请输入支付用户名");
//             return;
//         }else if(!(this.registData.msgVerify).trim()){
//             this.littleTip.showThis("请输输入手机验证码");
//             return;
//         }else{
//             var regDatas = {
//             	alipay:that.registData.alipayAccount,
//             	alipayName:that.registData.alipayName,
//                 vcode:that.registData.msgVerify
//             }; 
//             // console.log(JSON.stringify(this.registData));
//              Http.get('/api/game/security/updatealipay',regDatas,function(data){
//                  console.log(data);
//                  if(!data.success){
//                      that.littleTip.showThis(data.msg);
//                      return false;
//                  }
//                  that.littleTip.showThis("绑定成功");
//                  //登录创建权限
//                  //登录参数
//              	setTimeout(function(){
//                 	that.hideThis();
//                     LayaSample.giveSeed.showThis();//显示赠送框
//                 },1000)
//                 that.resetForm();
//              },["Authorization",that.token]);
//         }  
//     };
//     //注册成功重置表单
//     _proto.resetForm = function(){
//         this.registData.alipayAccount = this.alipayAccountVal = this.formBox.getChildByName("alipayAccount").text = '';//支付宝账号
//         this.registData.alipayName = this.alipayNameVal = this.formBox.getChildByName("alipayName").text = '';//支付宝用户名
//         this.registData.msgVerify = this.msgVerifyVal = this.formBox.getChildByName("msgVerify").text = '';//手机验证码
//         clearInterval(this.countDown);
//         this.formBox.getChildByName("getMsgCode").skin = "ui/common_a_45.png";
//         this.formBox.getChildByName("getMsgCode").label = "获取";
//         // 重新设置按钮状态可点击
//         this.verBtnCanClick = true;
//         this.timer = 120;
//     };
//     //显示提示层
//     _proto.showBindTips = function(){
//     	this.bindTipsBox.visible = true;
//     }
//     //显示提示层
//     _proto.hideBindTips = function(){
//     	this.bindTipsBox.visible = false;
//     }
//     //显示
//     _proto.showThis = function(){
//     	if(!ISDONENEW){//如果是注册用户登陆并且没有进行过新手引导
//     		this.formBox.getChildByName("backPage").skin = "ui/building_03.png";
//     	}
//     	LayaSample.farm.alertLayer.visible = true;
//         Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
//         this.showBindTips();
//         var that = this;
//         setTimeout(function(){
//             that.hideBindTips();
//         },3000)
//     }
//     //关闭
//     _proto.hideThis = function(){
//     	// if(!ISDONENEW){
//     	// 	this.littleTip.showThis("请绑定支付宝进行下一步");
//     	// 	return;
//     	// }
//     	Laya.Tween.to(this,{scaleY:0,scaleX:0},150,Laya.Ease.null,null);
//     	LayaSample.farm.alertLayer.visible = true;
    	
//     };
//     //关闭自己和赠送弹出框
//     _proto.hideThisAndGiveSeed = function(){
//     	this.hideThis()
//     	LayaSample.giveSeed.closeThis();
//     	if(!ISGIVE){
//     		LayaSample.greenHandGuide.done();
//     	}

//         var isFirstTran = JSON.parse(localStorage.getItem('BASEINFO')).doTransfer;
//         var isFirstReap = JSON.parse(localStorage.getItem('BASEINFO')).doHarvest;
//         if(isFirstTran==0&&isFirstReap==1){
//             LayaSample.msg.arrIdx = 0;
//             LayaSample.msg.msgArr = [{
//                 action:"show_ck",
//                 id:0,
//                 msg_type:"1"
//             }];
//             LayaSample.msg.msgLen = LayaSample.msg.msgArr.length;
//             LayaSample.msg.msgBtn.visible = LayaSample.msg.msgArr.length>0?true:false;
//         }else{
//             //LayaSample.farm.message();//从后台获取消息
//         }

//     	//LayaSample.farm.message();//从后台获取消息

//     	ISGIVE = true;
//     }
//     return BindAlipay;
// })(ui.BindAlipayUI)