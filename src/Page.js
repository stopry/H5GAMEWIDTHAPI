//分页逻辑
var Page = (function(){
    function Page(List,prePageBtn,nextPageBtn,currentPage,allPage){
        this.list = List;//带渲染列表
        this.prePageBtn = prePageBtn;//上一页按钮
        this.nextPageBtn =nextPageBtn;//下一页按钮
        this.currentPage = currentPage;//当前页label
        this.allPage = allPage;//总页数label
        this.initPage = 1;//默认第一页
        this.init()
    }
    var _proto = Page.prototype;
    _proto.init = function(){
        this.getFirstPage();
        this.prePageBtn.on(Laya.Event.CLICK,this,this.getDatas());
        this.nextPageBtn.on(Laya.Event.CLICK,this,this.getnexDatas());       
    }
    //得到第一页
    _proto.getFirstPage = function(){
        
    }
    //得到上一页
    _proto.getPreDatas = function(){
        // Http.connect('page.jsp', JSON.stringify({pageNum:pageNum}),function(data){
        //     console.log(data);
        // })
        // return Service.farmList;
    }
    //得到上一页
    _proto.getnexDatas = function(){
        // Http.connect('page.jsp', JSON.stringify({pageNum:pageNum}),function(data){
        //     console.log(data);
        // })
        // return Service.farmList;
    }
    return Page;
})()