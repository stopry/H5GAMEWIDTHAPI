/**
 * Created by Administrator on 2017/4/17 0017.
 */
$(function(){
    var h =  parseInt($(window).height());

    function autoSize(){
        $("body").css("min-height",h+"px");
        $("#layer").css("height",h+"px");
    }
    autoSize();

    $(window).ajaxStart(function(){
        $("#layer").show();
    })
    $(window).ajaxStop(function(){
        $("#layer").hide();
    })

    function formatTime(now){
        var year = new Date(now).getFullYear();
        var month = new Date(now).getMonth() + 1 >= 10 ? new Date(now).getMonth() + 1 : '0' + (new Date(now).getMonth() + 1);
        var date = new Date(now).getDate() >= 10　? new Date(now).getDate() :　'0' + new Date(now).getDate();
        var hour = new Date(now).getHours();
        var minute = new Date(now).getMinutes();
        var second = new Date(now).getSeconds();
        return year + "-" + month + "-" + date+"&nbsp;"+(hour == '0' ? '00' : hour)+ ":" + (minute == '0' ? '00' : minute)  + ":" + (second == '0' ? '00' : second);
    }

    if(!$("#announce").length){
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        }
        var id = getQueryString("id");
        //$.ajax({
        //    url:'/api/notice/get',
        //    type:'GET',
        //    dataType:'json',
        //    data:{id:id},
        //    success:function(datas){
        //        if(!datas.success){
        //            alert('请求失败');
        //            return;
        //        }
        //        var data = datas.obj;
        //        var html = '<div class="newsitem-head">'+data.title+'</div>'+
        //            '<div class="newsitem-info">'+
        //            '<span>日期：'+formatTime(data.datetime)+'</span>'+
        //        '</div>'+
        //        '<div class="newsitem-text" style="min-height:400px;">'+
        //            '<p><br></p><p>'+data.content+'</p><p style="text-align: right;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 超级水稻&nbsp;</p><p style="text-align: right;">&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'+formatTime(data.datetime)+'&nbsp;</p><p><br></p>'+
        //        '</div>'
        //        $(".newsitem").html(html);
        //    }
        //})
        $.ajax({
            url:'/api/notice/getOne',
            type:'GET',
            dataType:'json',
            //data:{id:id},
            success:function(datas){
                if(!datas.success){
                    alert('请求失败');
                    return;
                }
                var data = datas.obj;
                var html = '<div class="newsitem-head">'+data.title+'</div>'+
                    '<div class="newsitem-info">'+
                    '<span>日期：'+formatTime(data.datetime)+'</span>'+
                    '</div>'+
                    '<div class="newsitem-text" style="min-height:400px;">'+
                    '<p><br></p><p>'+data.content+'</p>' +
                    '<p style="text-align: right;">超级水稻</p>'+
                    '<p style="text-align: right;">'+formatTime(data.datetime)+'</p><p><br></p>'+
                    '</div>'
                $(".newsitem").html(html);
            }
        })
        return;
    }
    //创建分页
    function createPage(pageNun,current){
        $(".page").createPage({
            pageCount : pageNun,
            current : current,
            backFn : function(){

            }
        })
    }
    //初始化分页
    function initPage(pageNun,current){
        var allPages = pageNun;
        var current = current;
        $(".page").createPage({
            pageCount : allPages,
            current : current,
            backFn : function(p){
                fillHtml(p);
            }
        })
    }
    //填充列表内容
    function fillList(lists){
        console.log(lists);
        var html = "";
        for(var i = 0;i<lists.length;i++){
            html+='<li>'+
                '<div class="newslist-item-head">'+
                '<a href="./announceDetail.html?id='+lists[i].id+'">'+lists[i].title+'</a>'+
                '</div>'+
                '<div class="newslist-item-info">'+
                '<span>日期：'+formatTime(lists[i].datetime)+'</span>'+
           '</div>'+
            '<div class="newslist-item-text">'+lists[i].title+
            '</li>'
        };
        $(".newslist").html(html);
    }
    //得到分页信息
    function getPageInfo(pageNum){
        $.ajax({
            url:'/api/notice/list?',
            type:'GET',
            dataType:'json',
            data:{pageNum:pageNum},
            success:function(datas){
                //console.log(datas);
                if(!datas.success){
                    alert(datas.msg);
                    return
                }
                var data = datas.obj;
                initPage(data.pages,data.current);
                fillList(data.records);
            },
            error:function(){
                alert('请求失败');
            }
        })
    }
    getPageInfo(1);

    //添加内容
    function fillHtml(pageNum){
        $.ajax({
            url:'#',
            type:'POST',
            dataType:'json',
            data:{page:pageNum},
            success:function(datas){
                console.log(datas);
                if(!datas.success){
                    alert("请求失败")
                    return;
                }
                var data = datas.obj;
                fillList(data.records);
            },
            error:function(){
                alert('请求失败');
            }
        })
    }
})