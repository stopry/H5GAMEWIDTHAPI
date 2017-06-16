window.onload = function() {
    var h = parseInt(window.innerHeight);
    function autoSize() {
        //document.getElementsByTagName('body')[0].setAttribute('style', 'min-height:' + h + 'px');
        document.getElementsByTagName('body')[0].style.minHeight = h+'px';
        //document.getElementById('#layer').setAttribute('style', 'height:' + h + 'px');
        //document.getElementById('#layer').style.height = h+'px';
    }
    autoSize();
    function formatTime(now) {
        var year = new Date(now).getFullYear();
        var month = new Date(now).getMonth() + 1 >= 10 ? new Date(now).getMonth() + 1 : '0' + (new Date(now).getMonth() + 1);
        var date = new Date(now).getDate() >= 10 ? new Date(now).getDate() : '0' + new Date(now).getDate();
        var hour = new Date(now).getHours();
        var minute = new Date(now).getMinutes();
        var second = new Date(now).getSeconds();
        return year + "-" + month + "-" + date + "&nbsp;" + (hour == '0' ? '00' : hour) + ":" + (minute == '0' ? '00' : minute) + ":" + (second == '0' ? '00' : second);
    }
    //获取最新数据
    function getDatas() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/api/notice/getOne', true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var b = xhr.responseText;
                if (b) {
                    b = eval("("+b+")");
                    if(!b.success){
                        alert(b.msg)
                        return
                    }
                    var data = b.obj;
                    var html = '<div class="newsitem-head">' + data.title + '</div>' +
                        '<div class="newsitem-info">' +
                        '<span>日期：' + formatTime(data.datetime) + '</span>' +
                        '</div>' +
                        '<div class="newsitem-text" style="min-height:400px;">' +
                        '<p><br></p><p>' + data.content + '</p>' +
                        '<p style="text-align: right;">超级水稻</p>' +
                        '<p style="text-align: right;">' + formatTime(data.datetime) + '</p><p><br></p>' +
                        '</div>'
                    document.querySelector(".newsitem").innerHTML = (html);
                    console.log(b)
                } else {
                    alert('获取数据失败');
                }
            } else {

            }
        }
    }
    getDatas();
}