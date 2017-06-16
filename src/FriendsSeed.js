//种子逻辑
var FriendsSeed = (function(){
    // params——种子-种子类型-等级-状态-是否成熟-是否被偷-土地等级
    function FriendsSeed(seed,type,id,ownerId,seedId,status,nextStsTime,cnt,originalIncome,rich,wettability,illuminance,health,totalIncome,steal,totalStael,sWater,oWater,fruitId){
        this.seed = seed;//种子 
        //种子类型默认全部先传1
        this.type = type;//类型
        /*数据参数start*/
        this.id = id;//主键id
        this.ownerId =  ownerId;//归属id
        this.seedId = seedId;//种子id
        this.status = status;//状态 0 1 2 3 4种子期 发芽期 成长期 成熟期 凋谢期
        this.nextStsTime = nextStsTime;//下一状态时间
        this.cnt = cnt;//可收获次数
        this.originalIncome = originalIncome;//原始收益（按一个收货季算）
        this.rich = rich;//肥沃度
        this.wettability = wettability;//湿润度
        this.illuminance = illuminance;//光照度
        this.health = this.health;//健康度
        this.totalIncome = totalIncome;//共计收益
        this.steal = steal;//当季被偷
        this.totalStael = totalStael;//共计被偷
        this.sWater = sWater;//自己浇水次数
        this.oWater = oWater;//上线浇水次数
        this.fruitId = fruitId;//果实id
        /*数据参数end*/
        this.loadSeed();//加载种子
    };
    var _proto = FriendsSeed.prototype;
    // 初始化种子
    _proto.alerts = function(){
        alert(1)
    }
    _proto.loadSeed = function(){
        this.setSeedUI(this.status,this.type);
    }
    //设置种子显示
    _proto.setSeedUI = function(status,type){
        switch(status)
        {
        case 0:
            this.seed.getChildByName('seedLv1').visible = true;
            this.seed.getChildByName('seedLv1').skin = "ui/seed_"+type+"_"+parseInt(status+1)+".png";
            this.seed.getChildByName('seedLv2').visible = false;
            this.seed.getChildByName('seedLv3').visible = false;
            this.seed.getChildByName('seedLv4').visible = false;
            this.seed.getChildByName('seedDie').visible = false;
        break;
        case 1:
            this.seed.getChildByName('seedLv2').visible = true;
            this.seed.getChildByName('seedLv2').skin = "ui/seed_"+type+"_"+parseInt(status+1)+".png";
            this.seed.getChildByName('seedLv1').visible = false;
            this.seed.getChildByName('seedLv3').visible = false;
            this.seed.getChildByName('seedLv4').visible = false;
            this.seed.getChildByName('seedDie').visible = false;
        break;
        case 2:
            this.seed.getChildByName('seedLv3').visible = true;
            this.seed.getChildByName('seedLv3').skin = "ui/seed_"+type+"_"+parseInt(status+1)+".png";
            this.seed.getChildByName('seedLv1').visible = false;
            this.seed.getChildByName('seedLv2').visible = false;
            this.seed.getChildByName('seedLv4').visible = false;
            this.seed.getChildByName('seedDie').visible = false;
        break;
        case 3:
            this.seed.getChildByName('seedLv4').visible = true;
            this.seed.getChildByName('seedLv4').skin = "ui/seed_"+type+"_"+parseInt(status+1)+".png";
            this.seed.getChildByName('seedLv1').visible = false;
            this.seed.getChildByName('seedLv2').visible = false;
            this.seed.getChildByName('seedLv3').visible = false;
            this.seed.getChildByName('seedDie').visible = false;
        break;
        case 4:
            this.seed.getChildByName('seedDie').visible = true;
            this.seed.getChildByName('seedDie').skin = "ui/seed_"+type+"_"+parseInt(status+1)+".png";
            this.seed.getChildByName('seedLv1').visible = false;
            this.seed.getChildByName('seedLv2').visible = false;
            this.seed.getChildByName('seedLv3').visible = false;
            this.seed.getChildByName('seedLv4').visible = false;
        break;
        default:
            // this.seed.visible = false;
            this.seed.getChildByName('seedLv1').visible = false;
            this.seed.getChildByName('seedLv2').visible = false;
            this.seed.getChildByName('seedLv3').visible = false;
            this.seed.getChildByName('seedLv4').visible = false;
            this.seed.getChildByName('seedDie').visible = false;
        }
    }
    return FriendsSeed;
})()