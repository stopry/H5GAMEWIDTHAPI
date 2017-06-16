var FriendTop = (function(_super){
    function FriendTop(id){
        FriendTop.super(this);
        this.id = id;//好友id
        this.init();
    }
    Laya.class(FriendTop,"FriendTop",_super);
    var _proto = FriendTop.prototype;
    _proto.init = function(){
    	this.getToken();
    	this.loadFriendInfo();
    }
    _proto.loadFriendInfo = function(){
    	var that = this;
    	Http.friend("/api/game/loadOtherPlayer",that.id,function(data){
    		console.log(data);
    		if(!data.success){
    			LayaSample.littleTip.showThis(data.msg);
    			return;
    		}else{
    			LayaSample.littleTip.showThis("欢迎来到 \""+data.obj.nickname+"\" 的家园");
    			that.header.getChildByName("nickName").text = data.obj.nickname+"的家园";
    			that.fruitNum.text = data.obj.money;//果实数
    			that.expText.text = data.obj.exp+"/"+data.obj.levexp;//经验值数值
    			that.epxBar.value = data.obj.exp/data.obj.levexp;//经验值数值
    			that.header.getChildByName("headerImg").skin = "ui/head"+data.obj.pic+".png";
    			that.idNum.text = data.obj.id;
    			// alert(data.obj.id);
    			that.nickname.text = data.obj.nickname;
    			that.lv.text = data.obj.level;
    			// that.exp.text = data.obj.exp;
                that.alertInfo = new UserAlert(data.obj);

                if(eval("("+localStorage.getItem('BASEINFO')+")").id==data.obj.id){
                    that.alertInfo.logOut.visible = true;
                }else{
                    that.alertInfo.logOut.visible = false;
                }

                that.header.getChildByName("headerImg").on("click",that,that.showFriendInfoAlert);
    		}
    	},["Authorization",that.token]);
    }
    _proto.updateFriendTop = function(data){
        var that = this;
        // LayaSample.littleTip.showThis("欢迎来到 \""+data.obj.nickname+"\" 的家园");
        that.header.getChildByName("nickName").text = data.obj.nickname+"的家园";
        that.fruitNum.text = data.obj.cnt?data.obj.cnt:"***";//果实数
        that.expText.text = data.obj.exp+"/"+data.obj.levexp;//经验值数值
        that.epxBar.value = data.obj.exp/data.obj.levexp;//经验值数值
        that.header.getChildByName("headerImg").skin = "ui/head"+data.obj.pic+".png";
        that.idNum.text = data.obj.id;
        // alert(data.obj.id);
        that.nickname.text = data.obj.nickname;
        that.lv.text = data.obj.level;
        that.alertInfo = new UserAlert(data.obj);

        if(eval("("+localStorage.getItem('BASEINFO')+")").id==data.obj.id){
            that.alertInfo.logOut.visible = true;
        }else{
            that.alertInfo.logOut.visible = false;
        }

        that.header.getChildByName("headerImg").on("click",that,that.showFriendInfoAlert);
    }
    //得到token
    _proto.getToken = function(){
         if(!localStorage.getItem("token_type")||!localStorage.getItem("access_token")){
            LayaSample.littleTip.showThis("获取token失败，请重新登录");
            return;
        }
        this.token = localStorage.getItem("token_type")+" "+localStorage.getItem("access_token");
    }
    //显示好友信息弹窗
    _proto.showFriendInfoAlert = function(){
        this.alertLayer = LayaSample.farm.alertLayer;
        this.alertLayer.zOrder = 20;
        Laya.stage.addChild(this.alertLayer);
        this.alertLayer.visible = true;
        Laya.stage.addChild(this.alertInfo);
        Laya.Tween.to(this.alertInfo,{scaleY:1,scaleX:1},200,null,null);
    }
    return FriendTop;
})(ui.FriendTopUI)