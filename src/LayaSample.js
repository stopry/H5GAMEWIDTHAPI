// 主入口文件
(function(){
    var global;
    (function(LayaSample){


        soundManager = Laya.SoundManager;//音频管理
        //播放音乐
        window.playMusic = function(){
            soundManager.playMusic("res/bg_shound.mp3", 0, null);
        }
        //停止音乐
        window.stopMusic = function(){
            soundManager.stopMusic();
        }

        var Browser = Laya.Browser;
        //初始化引擎
        Laya.init(640,1024);
        //得到url查询参数
        function getSearchString(key) {
            // 获取URL中?之后的字符
            var str = location.search;
            str = str.substring(1,str.length);
            // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
            var arr = str.split("&");
            var obj = new Object();
            // 将每一个数组元素以=分隔并赋给obj对象    
            for(var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split("=");
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
            }
            return obj[key];
        };
        ISAPP = navigator.userAgent.indexOf('Appcan')>0?true:false||'';
    
        SUPERID = getSearchString('superId')||0;
        FILED1 =  getSearchString('field1')||'';
        FILED2 =  getSearchString('field2')||'';
        FILED3 =  getSearchString('field3')||'';
        FILED4 =  getSearchString('field4')||'';
        FILED5 =  getSearchString('field5')||'';
        //得到登录渠道
        function getChannel() {
            var ua = window.navigator.userAgent.toLowerCase();//微信
            var u = navigator.userAgent;//手机类型android或ios
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){//微信
                LOGINCHANNEL = 'WXWeb';
                console.log(LOGINCHANNEL);
                return;
            }else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
                LOGINCHANNEL = 'AWeb';
                console.log(LOGINCHANNEL);
                return;
            } else if (u.indexOf('iPhone') > -1) {//苹果手机
                LOGINCHANNEL = 'IOSWeb';
                console.log(LOGINCHANNEL);
                return;
            } else {//PC
                var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
                for (var v = 0; v < Agents.length; v++) {
                    if (u.indexOf(Agents[v]) < 0) {
                        LOGINCHANNEL = 'PCWeb';
                        console.log(LOGINCHANNEL);
                        return;
                    }
                } 
            }
        }
        getChannel();
        //屏幕适配  PC
        if(Browser.clientWidth>640){
            SCALEMODE="showall"
            Laya.stage.scaleMode = "showall";
            Laya.stage.bgColor = "#000";
            Laya.stage.alignH = "center";
            Laya.stage.alignV = "middle";
        }else{
            //MOBILE
            SCALEMODE="fixedwidth"
            Laya.stage.scaleMode = "fixedwidth";
            Laya.stage.bgColor = "#6AB9FB";
            Laya.stage.alignH = "center";
            Laya.stage.alignV = "bottom";
        }
        // Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        
        // Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;

        Laya.stage.screenMode = "none";
        //设置stage颜色
        
        //加载资源-资源路径-回调-进度回调-资源类型
        // document.getElementById("layaCanvas").style.maxWidth = "640px";
        init();
        Laya.loader.load(
            [
                "ui/LoadBg.png",
                "ui/login_title.png",
                "ui/icon_94.png",
                "ui/progress_time$bar.png",
                "ui/progress_time.png",
                "res/bg_shound.mp3",
            ],
            Laya.Handler.create(this,loading),
            null,
            null,
            0,
            false
        );
    })();
    //初始加载
    function init(){
        global = new LoadAni();
        global.bgColor = "#ff0000";
    }
    function loading(){
        // console.log(2)
        document.getElementsByClassName("spinner")[0].style.display = "none";
        Laya.stage.addChild(global);
        global.Loading.play(0,false);
        Laya.loader.load(
            ["res/atlas/ui.json","res/atlas/dialog.json","res/atlas/createRole.json","res/atlas/add.json","res/atlas/dog.json","res/atlas/dog2.json"],
            Laya.Handler.create(this,onLoaded),
            Laya.Handler.create(this,progress,null,false),
            Laya.Loader.ATLAS,
            1,
            false
        );
    }
    function onLoaded(){
        addLittleTip();
        global.destroy();
        global.removeSelf();
        var autoLoadStr = localStorage.getItem('AUTOLOAD');
        if(autoLoadStr){
            autoLoadStr = JSON.parse(autoLoadStr);
            var now = new Date().getTime();
            var expr = 86400000;
            var token = autoLoadStr.token;
            var access_token = autoLoadStr.token.split(' ')[1];
            localStorage.setItem('access_token',access_token);
            if(now-autoLoadStr.timestamp<86400000){
                Http.get("/api/game/loadPlayer",null,function(data){
                    if(!data.success){
                        LayaSample.LogIn = new LogIn();
                        Laya.stage.addChild(LayaSample.LogIn);
                        return;
                    }else{
                        var _type = data.obj.userType;

                        ISVISITOR = _type==1?false:true;
                        // LayaSample.littleTip.showThis("登录成功");
                        // that.removeSelf();
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
                        jsapi.init();   
                    }
                },["Authorization",token],function(){
                    LayaSample.LogIn = new LogIn();
                    Laya.stage.addChild(LayaSample.LogIn);
                });
                return;
            }
            console.log(autoLoadStr);
        }
        /**初始化加载登录UI */
        LayaSample.LogIn = new LogIn();
        Laya.stage.addChild(LayaSample.LogIn);

        jsapi.init();
        /**初始化加载登录UI */
    };
    function progress(proce){
        // console.log(proce);
        global.process.value = proce;
        global.proceText.text = parseInt(100*proce)+"%";
    }
    //添加小提示UI
    function addLittleTip(){
        if(!LayaSample.littleTip){
            LayaSample.littleTip = new LittleTip()
        }
        LayaSample.littleTip.zOrder = 99999;
        Laya.stage.addChild(LayaSample.littleTip);
    };
    //注册全局变量LayaSample
})(window.LayaSample || (window.LayaSample = {}));




