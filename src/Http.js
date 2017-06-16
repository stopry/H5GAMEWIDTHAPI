//http

// var Http = (function(http){
//     http = http ||{};
//     var HttpRequest = Laya.HttpRequest;
//     var Event = Laya.Event;
//     http.hr = new HttpRequest();
//     // params——url-发生的数据-请求完成回调
//     http.connect = function(Url,Json,type,callBack){
        
//         http.hr.once(Event.PROGRESS, this, function(){
//             console.log("请求进度改变");
//         });
        
// 		http.hr.once(Event.COMPLETE, this, function(e){
// 		    callBack(Http.hr.data);
// 		});
		
// 		http.hr.once(Event.ERROR, this, function(e){
// 		    console.error(e+"请求失败");
// 		});
		
// 		http.hr.send(Url+toUrlPar(Json),null,type,"json",["Content-Type", "application/json"]);
//     }
//     return http;
// })(Http)

var HTTPTIMEOUT = 10000;//请求超时时间改为10s



var Http = (function(http){
    http = http||{};
    var HttpRequest = Laya.HttpRequest;
    var Event = Laya.Event;
    var Ws = Laya.Socket;//websocket
    //socket链接
    http.socket = function(url,data,callBack,callErrBack,closeBack){
        var socket = new Ws();
        socket.connectByUrl(url);
        //打开链接
		socket.on(Event.OPEN, this, function(){
            console.log('socket已经连接');
            // socket.send(data);
        });
		socket.on(Event.CLOSE, this, function(){
            console.log('socket已关闭');
            closeBack();
            // socket.send('1');
        });
		socket.on(Event.MESSAGE, this, function(datas){
            console.log('socket已接受到消息')
            callBack(datas);
        });
		socket.on(Event.ERROR, this, function(e){
            callErrBack();
            console.log(e+'socket连接错误');
        });
    }
    //post请求
    http.post = function(url,data,callBack,header,callErrBack){
        document.getElementById("ajaxloading").style.display = 'block';
        header = header||void(0);
        var hr = new HttpRequest();
        hr.http.timeout = HTTPTIMEOUT;
        // params——url-发生的数据-请求完成回调
        hr.once(Event.PROGRESS, this, function(){
            console.log("请求进度改变");
        });
        
        hr.once(Event.COMPLETE, this, function(e){
            callBack(hr.data);
            document.getElementById("ajaxloading").style.display = 'none';
        });
        
        hr.once(Event.ERROR, this, function(e){
            console.error(e+"请求失败");
            document.getElementById("ajaxloading").style.display = 'none';
            callErrBack();
        });
        if(header){
            hr.send(url,data,'post',"json",["Content-Type", "application/json"].concat(header));
        }else{
            hr.send(url,data,'post',"json",["Content-Type", "application/json"]);
        }
    };
    //get请求
    http.get = function(url,data,callBack,header,callErrBack){
        document.getElementById("ajaxloading").style.display = 'block';
        loadingLayer = 'block';
        header = header||void(0);
        var hr = new HttpRequest();
        hr.http.timeout = HTTPTIMEOUT;
        // params——url-发生的数据-请求完成回
        hr.once(Event.PROGRESS, this, function(){
            console.log("请求进度改变");
        });
        
        hr.once(Event.COMPLETE, this, function(e){
            callBack(hr.data);
            document.getElementById("ajaxloading").style.display = 'none';
        });
        
        hr.once(Event.ERROR, this, function(e){
            console.error(e+"请求失败");
            document.getElementById("ajaxloading").style.display = 'none';
            callErrBack();
        });
        if(header){
            hr.send(url+toUrlPar(data),null,'get',"json",["Content-Type", "application/json"].concat(header));
        }else{
            hr.send(url+toUrlPar(data),null,'get',"json",["Content-Type", "application/json"]);
        }    
    }
    //得到好友信息
    http.friend = function(url,data,callBack,header){
        document.getElementById("ajaxloading").style.display = 'block';
        loadingLayer = 'block';
        header = header||void(0);
        var hr = new HttpRequest();
        hr.http.timeout = HTTPTIMEOUT;
        // params——url-发生的数据-请求完成回
        hr.once(Event.PROGRESS, this, function(){
            console.log("请求进度改变");
        });
        
        hr.once(Event.COMPLETE, this, function(e){
            callBack(hr.data);
            document.getElementById("ajaxloading").style.display = 'none';
        });
        
        hr.once(Event.ERROR, this, function(e){
            console.error(e+"请求失败");
            document.getElementById("ajaxloading").style.display = 'none';
        });
        if(header){
            hr.send(url+"/"+data,null,'get',"json",["Content-Type", "application/json"].concat(header));
        }else{
            hr.send(url+"/"+data,null,'get',"json",["Content-Type", "application/json"]);
        }
    }
    return http;
})(Http);

//调用方式 (注意this指向问题)
// Http.connect('http://xkxz.zhonghao.huo.inner.layabox.com/api/getData', 'name=myname&psword=xxx',function(data){
//     console.log(data);
// })


//websocket





//对象转url参数
function toUrlPar(obj) {
    var s = ""
    for (var itm in obj) {
        if (obj[itm] instanceof Array == true) {
            //是数组
            s += "&" + itm + "_count=" + obj[itm].length
            for (var i = 0; i < obj[itm].length; i++) {
                if (obj[itm][i] instanceof Array == true) {
                    s += ergodicJson2(obj[itm][i]);
                } else if (obj[itm][i] instanceof Object == true) {
                    s += ergodicJson2(obj[itm][i]);
                } else {
                    s += "&" + encodeURI(obj[itm][i]) + "=" + encodeURI(obj[itm][i]);
                }
            }
        } else if (obj[itm] instanceof Object == true) {
            //是json对象。
            s += ergodicJson2(obj[itm]);
        }
        else {
            //是简单数值   
            s += "&" + encodeURI(itm) + "=" + encodeURI(obj[itm]);
        }
    }
    if(s){
        s = "?"+s.substring(1,s.length);
        return s;
    }else{
        return '';
    }
    
}

/*
websocket
实例化方法
//url为连接地址
//fnget为接收数据方法
//默认自动执行
var web = new myWebsocket(url,fnget)//连接并接收消息
web.sendMsg('消息体')//发送消息
 */
// function myWebsocket(url,fnget){
//     var url = url||'';
//     var fnget = fnget||void(0);
//     var mysocket = new WebSocket(url);
//     //连接并接受消息
//     this.socket =  function(){
//         mysocket.onopen =function(result){
//             console.log("socketConnectSuccess"+result)
//         }
//         mysocket.onmessage = function(result){
//             fnget&&fnget(result);
//         }
//     }
//     //自动执行
//     this.socket();
//     //发送消息
//     this.sendMsg = function(msg){
//         mysocket.send(msg)
//     }
// }


function skipToUrl(url){
    if(!url || url == ''){
        return;
    }
    Http.get('/api/game/getSkipSign',{},function(result){
         if(!result.success) return;
         if(url.indexOf('?') >= 0){
             url += '&'+new Date().getTime()+'&sign=';
         }else{
             url += '?'+new Date().getTime()+'&sign=';
         }
         url += result.obj;
         window.location = url;
    },['Authorization','bearer '+localStorage.getItem('access_token')]);
}