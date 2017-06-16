
var data ={
    urlStr:document.location.href
}

var jsapi = {
    init : function(){
        if(LOGINCHANNEL == 'WXWeb'){
            Http.get("/api/wx/getJsapiInfo", data, function (data) {
                if (!data.success) {
                    console.log('获取jsapi信息失败');
                } else {
                    var d = data.obj;
                    wx.config({
                        debug: false,
                        appId: 'wx1145c472059abf96',
                        timestamp: d.timestamp,
                        nonceStr: d.nonceStr,
                        signature: d.signature,
                        jsApiList: [
                            // 所有要调用的 API 都要加到这个列表中
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone'
                        ]
                    });
                }
            });
        }
    }
}


wx.ready(function () {
    if(LOGINCHANNEL == 'WXWeb'){
        var flag = true;
        registerShare();
        setInterval(function(){
            if(shareParam != '' && flag){
                flag = false;
                registerShare();
            }
        },500);
    }
});


function registerShare(){

        //分享到朋友圈
    wx.onMenuShareTimeline({
        title: '超级水稻', // 分享标题
        desc: '超级水稻，一起来玩吧', // 分享描述
        link: gameUrl + '/index.html' + shareParam, // 分享链接
        imgUrl: gameUrl+'/logo.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    
    //分享给朋友
    wx.onMenuShareAppMessage({
        title: '超级水稻', // 分享标题
        desc: '超级水稻，为爱耕田，迎娶白富美', // 分享描述
        link: gameUrl + '/index.html' + shareParam, // 分享链接
        imgUrl: gameUrl+'/logo.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    //分享到QQ
    wx.onMenuShareQQ({
        title: '超级水稻', // 分享标题
        desc: '超级水稻，为爱耕田，迎娶白富美', // 分享描述
        link: gameUrl + '/index.html' + shareParam, // 分享链接
        imgUrl: gameUrl+'/logo.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    //分享到腾讯微博
    wx.onMenuShareWeibo({
        title: '超级水稻', // 分享标题
        desc: '超级水稻，为爱耕田，迎娶白富美', // 分享描述
        link: gameUrl + '/index.html' + shareParam, // 分享链接
        imgUrl: gameUrl+'/logo.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    //分享到QQ空间
    wx.onMenuShareQZone({
        title: '超级水稻', // 分享标题
        desc: '超级水稻，为爱耕田，迎娶白富美', // 分享描述
        link: gameUrl + '/index.html' + shareParam, // 分享链接
        imgUrl: gameUrl+'/logo.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
}