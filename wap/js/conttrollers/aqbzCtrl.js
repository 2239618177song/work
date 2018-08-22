define([
    'webappControllers','jquery'
    ]
    ,function(controllers,$){
    controllers.controller('aqbzCtrl'
        ,['$scope',function($scope){
            $scope.title="安全保障";
            $scope.showFile = false;
            $scope.showMore=function(e){
            	var elm=$(e.currentTarget);
            	var padding=parseInt(elm.siblings().css("padding-bottom"))+parseInt(elm.parent().css("padding-bottom"));
            	var parent=elm.parent().parent();
            	$scope.height=parent.height();
            	var h=parseInt(elm.siblings().find("p").height());
            	parent.css({height:h+padding}).siblings(".aqbzContent-box").height($scope.height).find(".more").show();
            	elm.hide();
            }
            $scope.wap = getUrlParam('wap');
            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]); return null; //返回参数值
            }
            var $win = $(window);
            $win.on('load resize scroll', function() {
                $('.aqbzcheck-wrap').height()
                $('.aqbzcheck-box').height($win.height()).width($win.width());
                $('.aqbzcheck-box img').css('max-height',$win.height()).css('max-width',$win.width());
            });
        }
    ]);
})