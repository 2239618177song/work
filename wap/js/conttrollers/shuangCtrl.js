define(['webappControllers', 'jweixin', ['$scope', '$filter', '$rootScope',"$state", '$stateParams', 'resourceService']], function (controllers, jweixin) {
    controllers.controller('shuangCtrl', function ($scope, $filter,$rootScope,$state,$stateParams, resourceService, isWeixin) {
       
       $scope.app = $stateParams.app;
       var browser = {
            versions: function () {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return { //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        function isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }
       
       resourceService.queryPost($scope, $filter('getUrl')('双十二活动'), {}, '双十二活动');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '双十二活动':
                    if (data.success) {
//                  	console.log(data);
                    	$scope.userList = data.map.Statisticslist.slice(0, 10);
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
            };
        });
    })
})