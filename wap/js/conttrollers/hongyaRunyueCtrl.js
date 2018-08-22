define(['webappControllers','jweixin'], function (controllers, wx) {
    controllers.controller('hongyaRunyueCtrl', function ($scope,$rootScope,$stateParams,$filter,resourceService,$state) {
        $rootScope.title = '汇元金服-投资理财,P2P理财，P2P网贷,个人理财';
        $scope.showFixedbtn = true;

        var endDay = new Date(2017,8-1,22,0,0,0);
        $scope.overDue = new Date() >= endDay;

        $scope.wap = $stateParams.wap;
        $scope.userOBJ = $filter('isRegister')();
        $scope.user = $scope.userOBJ.user.member;

        var userObj = {};
        
        if($scope.userOBJ.register){
            userObj = {uid: $scope.user.uid}
        } else if (!$scope.wap && $stateParams.uid && $stateParams.token){
            userObj = {
                uid: $stateParams.uid,
                token: $stateParams.token
            }
        }

        resourceService.queryPost($scope, $filter('getUrl')('leapMonthStatist'), userObj, 'leapMonthStatist');

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case 'leapMonthActive':
                    if (data.success) {
                        if($scope.wap) {
                            $state.go('cpDetail', { pid: data.map.id ,from: 'hongyarunyue'});
                        } else {
                            window.location.href = 'jsmp://page=5?pid=' + data.map.id;
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case 'leapMonthStatist':
                    if (data.success) {
                        $scope.userData = data.map;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
            }
        })

        $scope.goInvest = function(){
            resourceService.queryPost($scope, $filter('getUrl')('leapMonthActive'), {}, 'leapMonthActive');
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
                title: '错过这次再等8年！你投资我就送，百万现金疯抢中...',
                desc: '啄米理财任性送壕礼，就问你来不来！', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyarunyue?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/runyue.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '错过这次再等8年！你投资我就送，百万现金疯抢中...',
                desc: '啄米理财任性送壕礼，就问你来不来！', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyarunyue?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/runyue.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '错过这次再等8年！你投资我就送，百万现金疯抢中...',
                desc: '啄米理财任性送壕礼，就问你来不来！', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyarunyue?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/runyue.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '错过这次再等8年！你投资我就送，百万现金疯抢中...',
                desc: '啄米理财任性送壕礼，就问你来不来！', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyarunyue?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/runyue.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '错过这次再等8年！你投资我就送，百万现金疯抢中...',
                desc: '啄米理财任性送壕礼，就问你来不来！', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyarunyue?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/runyue.png', // 分享图标
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