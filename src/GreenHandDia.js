var GreenHandDia = (function(_super){
	function GreenHandDia(textObj,closeCallBack,firstdSelectCallBack,secondSelectCallBack){
		GreenHandDia.super(this);
		this.textObj = textObj;//对话框标题内容对象按钮text值  {title:'',con:'',sel1:'',sel2:''};
		this.closeCallBack = closeCallBack;//关闭按钮回调
		this.firstdSelectCallBack = firstdSelectCallBack;//选项1回调
		this.secondSelectCallBack = secondSelectCallBack;//选项2回调
		this.zOrder = 99;
		this.init();
	}
	Laya.class(GreenHandDia,"GreenHandDia",_super);
	var _proto = GreenHandDia.prototype;
	_proto.init = function(){
		this.setStyle();
		this.getToken();
		this.setFeedBtn();
		this.addListener();
	}
	//样式设置
	_proto.setStyle = function(){
		this.stageWidth = Laya.stage.width;
	    this.stageHeight = Laya.stage.height;
	    this.pivot(this.width/2,this.height/2);
	    this.pos(Laya.stage.width / 2, Laya.stage.height / 2);
	    this.scale(0,0);
	}
	//得到token
    _proto.getToken = function(){
        if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            this.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
	//显示自己
	_proto.showThis = function(){
		this.msgTitle.text = this.textObj.title;
	    this.msgCon.text = this.textObj.con;
	    this.firstdSelect.label = this.textObj.sel1;
	    this.secondSelect.label = this.textObj.sel2;

	    LayaSample.farm.alertLayer.visible = true;
	    Laya.Tween.to(this,{scaleY:1,scaleX:1},200,null,null);
	}
	//隐藏自己
	_proto.hideThis = function(){
	    Laya.Tween.to(this,{scaleY:0,scaleX:0},300,Laya.Ease.backIn,null);
	    LayaSample.farm.alertLayer.visible = false;
	}
	//注册反馈按钮
	_proto.setFeedBtn = function(){
		new BtnFeed(this.closeBtn);
		new BtnFeed(this.firstdSelect);
		new BtnFeed(this.secondSelect);
	}
	//关闭回调
	_proto.closeFn = function(){
		this.hideThis();
		this.closeCallBack();
	}
	//点击选项一回调
	_proto.firstFn = function(){
		this.hideThis();
		this.firstdSelectCallBack();
	}
	//点击选项二回调
	_proto.secondFn = function(){
		this.hideThis();
		this.secondSelectCallBack();
	}
	//按钮添加事件监听
	_proto.addListener = function(){
		this.closeBtn.on("click",this,this.closeFn);
		this.firstdSelect.on("click",this,this.firstFn);
		this.secondSelect.on("click",this,this.secondFn);
	}
	return GreenHandDia;
})(ui.GreenHandDiaUI)