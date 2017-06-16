// 全局变量
var Browser = Laya.Browser;//浏览器对象
var Handler = Laya.Handler;//处理对象
var Event = Laya.Event;//事件对象 
var Stage = Laya.stage;//舞台对象引用
var Sprite = Laya.Sprite;//精灵对象
var HitArea = Laya.HitArea;//打击区域

var shareParam = ''; //分享参数

var centerUrl = 'http://center.0001wan.com';
var gameUrl = 'http://www.0001wan.com';

/*区别点击事件和长按事件*/
var HOLD_TIME = 300;//鼠标hold时间判断
var TIMER = new Date().getTime();//获取当前时间戳 

var ISVISITOR =  false;//默认非游客登陆


var ISDONENEW = false;//是否做过新手引导 默认未做过新手引导
var ISGIVE = true;//是否赠送过果实 默认没有

//游戏舞台的缩放模式(设置默认为固定宽度-手机设备下),电脑模式下位showall=>用来判断新手引导过程提示层和点击区域的定位问题;
var SCALEMODE = "fixedwidth";

//上级id
var SUPERID = 0;

//登录渠道
var LOGINCHANNEL = null;
//PCWeb->PCweb端 IOSWeb->IOS手机web端 AWeb->android手机web端 WXWeb->微信端

// filed
var FILED1 = ''
var FILED2 = ''
var FILED3 = ''
var FILED4 = ''
var FILED5 = ''

//手否在app中打开
var ISAPP = '';