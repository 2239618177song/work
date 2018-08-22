define(['webappControllers','jweixin'], function (controllers, wx) {
    controllers.controller('hongyaFanACtrl', function ($scope,$rootScope,$stateParams,$filter,resourceService,$state) {
        $rootScope.title = '汇元金服-投资理财,P2P理财，P2P网贷,个人理财';
        $scope.showDialog = false;
        $scope.showFixedbtn = true;

        var startTime = (new Date(Date.UTC(2017,9-1,6,-8,0,0))).getTime();
        var endTime = (new Date(Date.UTC(2017,9-1,13,-8,0,0))).getTime();
        var now = (new Date()).getTime();

        if(now < startTime){
            $scope.activityStatus = -1;
        } else if(now >= endTime){
            $scope.activityStatus = 1;
        } else {
            $scope.activityStatus = 0;
        }


        $scope.wap = $stateParams.wap;
        $scope.userOBJ = $filter('isRegister')();
        $scope.user = $scope.userOBJ.user.member;

        var userObj = {};
        
        if($scope.userOBJ.register){
            userObj = {uid: $scope.user.uid}
            resourceService.queryPost($scope, $filter('getUrl')('financingInvestStatistics'), userObj, 'financingInvestStatistics');
        } else if (!$scope.wap && $stateParams.uid && $stateParams.token){
            userObj = {
                uid: $stateParams.uid,
                token: $stateParams.token
            }    
            resourceService.queryPost($scope, $filter('getUrl')('financingInvestStatistics'), userObj, 'financingInvestStatistics');
        }

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case 'financingInvestStatistics':
                    if (data.success) {
                        $scope.result = data.map.repeatTotalAmount;
                        $scope.gift = data.map.rewards;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case 'moneySeasonRedSend':
                    if (data.success) {
                        $scope.showDialog = true;
                        $scope.getGiftSuccess = data.map.isSendSuccess;
                    } else {
                        if (data.msg=='未登录，请先登录') {
                            window.location.href = 'jsmp://page=3';
                        } else {
                            $filter('活动信息')(1002, $scope, 'y')
                        }
                    }
                    break;
                case 'summerRedpaperSendActive':
                    if (data.success) {
                        if($scope.wap) {
                            $state.go('cpDetail', { pid: data.map.id ,from: 'hongyaFanA'});
                        } else {
                            window.location.href = 'jsmp://page=5?pid=' + data.map.id;
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
            }
        })

        $scope.getGift = function(){
            if($scope.wap && !$scope.userOBJ.register){
                $state.go('dl',{ returnurl: 'hongyaFanA?wap=true'});
            } else {
                resourceService.queryPost($scope, $filter('getUrl')('moneySeasonRedSend'), userObj, 'moneySeasonRedSend');
            }
        }

        $scope.goInvest = function(){
            resourceService.queryPost($scope, $filter('getUrl')('summerRedpaperSendActive'), {}, 'summerRedpaperSendActive');
        }

        document.addEventListener('scroll', handleScroll, false);

        function handleScroll(){
            if($state.current.name == 'hongyaFanA'){
            　　var scrollTop = $(window).scrollTop();
            　　var windowHeight = $(window).height();
                var btnBottom = $('.invest-btn').offset().top + $('.invest-btn').height();

                $scope.$apply(function(){
                    $scope.showFixedbtn = !(scrollTop + windowHeight > btnBottom);
                })
            } else {
                document.removeEventListener('scroll',handleScroll,false);
            }
        }        

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
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '啄米理财喜获A轮融资',
                desc: '感恩回馈，最高送2000元京东卡', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyaFanA?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/fan-a.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '啄米理财喜获A轮融资',
                desc: '感恩回馈，最高送2000元京东卡', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyaFanA?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/fan-a.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '啄米理财喜获A轮融资',
                desc: '感恩回馈，最高送2000元京东卡', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyaFanA?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/fan-a.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '啄米理财喜获A轮融资',
                desc: '感恩回馈，最高送2000元京东卡', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyaFanA?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/fan-a.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '啄米理财喜获A轮融资',
                desc: '感恩回馈，最高送2000元京东卡', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyaFanA?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/fan-a.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
        })
    });
})