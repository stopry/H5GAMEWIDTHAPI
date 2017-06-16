//数据操作模块
var Service = (function(ser){
    ser = ser||function(){};
    var pro = ser.prototype;
    //得到材料数据
    pro.material = function(){
        
        return Datas.material;
    }
    //用户信息
    pro.userInfo = function(){
        return Datas.userInfo;
    }
    //签到
    pro.signIn = function(){
        return Datas.signIn;
    }
    //得到农场列表
    pro.farmList = function(){
        return Datas.farmList();
    }
    //得到用户资产
    pro.assets = function(){
        return Datas.assets;
    }
    //日志列表
    pro.log = function(){
        return Datas.log;
    }
    //装扮列表
    pro.decorate = function(){
        return Datas.decorate;
    }
    //仓库果实列表
    pro.fruit = function(){
        return Datas.fruit;
    }
    return new ser;
})(Service);

var goUrl = function(url){
    window.open(url);
}

//土地数组
var landGradeArr = [
    {
        landIcon:'dialog/gold_landIcon.png',
        land_text:'等级达到1级，可开垦第二块地。'
    },
    {
        landIcon:'dialog/gold_landIcon.png',
        land_text:'等级达到3级，邀请1个好友充值可开垦第三块地。'
    },
    {
        landIcon:'dialog/gold_landIcon.png',
        land_text:'等级达到3级，邀请3个好友充值可开垦第四块地。'
    },
    {
        landIcon:'dialog/gold_landIcon.png',
        land_text:'等级达到5级，邀请5个好友充值可开垦第五块地。'
    },
    {
        landIcon:'dialog/gold_landIcon.png',
        land_text:'等级达到7级，邀请10个好友充值可开垦第六块地。'
    },
    {
        landIcon:'dialog/gold_landIcon.png',
        land_text:'等级达到10级，邀请20个好友充值可开垦第七块地。'
    },
    {
        landIcon:'dialog/gold_landIcon.png',
        land_text:'等级达到10级，邀请30个好友充值可将黄土地升级成红土地。'
    },
    {
        landIcon:'dialog/gold_landIcon.png',
        land_text:'等级达到10级，邀请50个好友充值可将红土地升级成黑土地。'
    }
]

//小工具

var util = (function(utl){
    //无种子对象 
    var noSeedObj = {
        cnt:null,
        fruitId:null,
        health:null,
        id:null,
        illuminance:null,
        nextStsTime:null,
        originalIncome:null,
        owater:null,
        ownerId:null,
        rich:null,
        seedId:null,
        status:null,
        steal:null,
        swater:null,
        totalIncome:null,
        totalSteal:null,
        wettability:null,
    };
    utl = utl||{};
    //生成uuid
    utl.createUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
    //构建和土地对应的种子数组——Parm-土地数组,种子数组；
    utl.creSeedArr = function(landARR,seedArr){
        var newSeedArr = new Array(12);//新的 种子数组
        // console.log(newSeedArr.length);
        for(var i = 0;i<landARR.length;i++){
            var lsid = landARR[i].pdId;//土地的pid
            for(var j = 0;j<seedArr.length;j++){
                var sid = seedArr[j].id;
                if(lsid==sid){
                    newSeedArr[i] = seedArr[j];
                }
            }
        };
        //没有种子信息的设置为noSeedObj;
        for(var k =0 ;k<newSeedArr.length;k++){
            if(!newSeedArr[k]){
                newSeedArr[k] = {};
                //属性深拷贝
                for(var l in noSeedObj){
                    // console.log(noSeedObj[l])
                    newSeedArr[k][l] = noSeedObj[l];
                }
            }
        }
        return newSeedArr;
    };
    //商店列表数组组合
    utl.creShopArr = function(shopArr){
        var newArr = [];
        for(var i = 0;i<shopArr.length;i++){
            newArr.push({
                id:shopArr[i].itemTypeId,
                img:"ui/"+shopArr[i].pic+".png",
                name:shopArr[i].name,
                desc:shopArr[i].desc,
                price:shopArr[i].price+"元/个"
            });
        }
        return newArr;
    }
    //好友列表数组组合
    utl.creFriendlistArr = function(listArr){
        var noDataObj = {
            friendId:null,
            id:null,
            lev:null,
            level:null,
            nickname:null,
            pic:null,
            playerId:null,
            type:null,
            up:null,
            give:null,
        };
        var newArr = [];
        for(var i = 0;i<listArr.length;i++){
            newArr[i] = {};
            newArr[i].friendId = listArr[i].friendId;
            newArr[i].id = listArr[i].id;
            newArr[i].lev = "dialog/"+listArr[i].lev+".png";
            newArr[i].steal = listArr[i].isSteal?"add/can_reap.png":"add/null.png";//是否可偷取图标
            newArr[i].level = listArr[i].level;
            newArr[i].nickname = listArr[i].nickname;
            newArr[i].pic = listArr[i].pic;
            newArr[i].playerId = listArr[i].playerId;
            newArr[i].type = listArr[i].type;
            newArr[i].up = listArr[i].up;
            if(listArr[i].friendId==1){
                newArr[i].give = 'dialog/giveSeedIcon.png';
            }else{
                // newArr[i].give = null;
            }
        }
        return newArr;
    };
    //仓库列表数组组合
    utl.creEnterPotArr = function(potArr){
        var noDataObj = {
            id:null,
            pic:null,
            amount:null,
            name:null,
            desc:null,
        };
        var newArr = new Array(20);
        if(potArr.length<1){
            for(var i = 0;i<20;i++){
                newArr[i] = {};
                newArr[i].id = null;
                newArr[i].pic = null;
                newArr[i].amount = null;
                newArr[i].name = null;
                newArr[i].desc = null;
            }
        }else{
            for(var j = 0;j<potArr.length;j++){
                newArr[j] = {};
                newArr[j].id = potArr[j].itemTypeId;
                newArr[j].pic = "ui/"+potArr[j].pic+".png";
                newArr[j].amount = "x"+potArr[j].cnt;
                newArr[j].name = potArr[j].name;
                newArr[j].desc = potArr[j].desc;
            };
            for(var k = 19;potArr.length<k+1;--k){
                newArr[k] = {};
                newArr[k].id = null;
                newArr[k].pic = null;
                newArr[k].amount = null;
                newArr[k].name = null;
                newArr[k].desc = null;
            }
        }
        return newArr;
    };
    //种植选择种子弹出框数组创建
    utl.creSelSeedArr = function(seedArr){
        var newArr = [];
        for(var i = 0;i<seedArr.length;i++){
            newArr[i] = {};
            newArr[i].id = seedArr[i].itemTypeId;
            newArr[i].pic = "ui/"+seedArr[i].pic+".png";
            newArr[i].amount = "x"+seedArr[i].cnt;
            newArr[i].name = seedArr[i].name;
            newArr[i].desc = seedArr[i].desc;
        }
        return newArr;
        // return newArr.concat(newArr).concat(newArr).concat(newArr).concat(newArr);
    }
    //格式化时间戳
    utl.formatTimeForH5 = function (now) {
        var year = new Date(now).getFullYear();
        var month = new Date(now).getMonth() + 1 >= 10 ? new Date(now).getMonth() + 1 : '0' + (new Date(now).getMonth() + 1);
        var date = new Date(now).getDate() >= 10　? new Date(now).getDate() :　'0' + new Date(now).getDate();
        var hour = new Date(now).getHours();
        var minute = new Date(now).getMinutes();
        var second = new Date(now).getSeconds();

        return [year + "-" + month + "-" + date,(hour == '0' ? '00' : hour)
            + ":" + (minute == '0' ? '00' : minute)  + ":" + (second == '0' ? '00' : second)]; 
    };
    //得到现在到未来某个时间点的倒计时
    utl.getCountDown = function(future){
        var now = new Date().getTime();
        var nextStatus = future
        var nextStatusText = (nextStatus-now)/1000;
        console.log(nextStatusText);
        var days=Math.floor(nextStatusText/3600/24); 
        var hours=Math.floor((nextStatusText-days*24*3600)/3600); 
        var mins=Math.floor((nextStatusText-days*24*3600-hours*3600)/60); 
        var secs=Math.floor((nextStatusText-days*24*3600-hours*3600-mins*60)); 

        console.log(days,hours,mins,secs);
        if(hours<=0){
            hours = 0;
        }
        if(mins<=0){
            mins = 0;
        }
        if(secs<=0){
            secs = 0;
        }
        var time = hours+"小时"+mins+"分钟"+secs+"秒";
        return time;
    }
    //格式化支付宝账号
    utl.formatAliStr = function(str){

        function subAliStr(_string){
            var len = _string.length;
            var new_string = '';

            var _xin = '';
            for(var i = 0;i<len-4;i++){
                _xin+='*';
            }

            new_string = _string.substr(0,2)+_xin+_string.substr(len-2,len);

            return new_string;
        }

        var str = str.toString();
        var newStr = '';
        if(str.indexOf('@')>0){//支付宝账号为邮箱
            var strj = str.split('@');
            var fLength = strj[0].length;
            if(fLength==1){
                var tmp = "*@"+strj[1];
                newStr = tmp;
            }else if(fLength==2){
                var tmp = strj[0].substr(0,1)+"*@"+strj[1];
                newStr = tmp;
            }else if(fLength==3){
                var tmp = strj[0].substr(0,2)+"*@"+strj[1];
                newStr = tmp;
            }else if(fLength==4){
                var tmp = strj[0].substr(0,2)+"**@"+strj[1];
                newStr = tmp;
            }else{
                var tmp = subAliStr(strj[0])+"@"+strj[1];
                newStr = tmp;
            }

        }else{
           newStr = str.substr(0, 3) + '****' + str.substr(7)
        }
        return newStr;
    }
    return utl;
})(util);
// util.creSeedArr(arr1,arr2);