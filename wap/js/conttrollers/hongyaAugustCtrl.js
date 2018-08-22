define(['webappControllers','jweixin'], function (controllers, wx) {
    controllers.controller('hongyaAugustCtrl', function ($scope,$rootScope,$stateParams,$filter,resourceService,$state,$localStorage) {
        $rootScope.title = '汇元金服-投资理财,P2P理财，P2P网贷,个人理财';
        $scope.showDialog = false;

        $scope.dialogType = '';
        $scope.showPopbtn = false;

        var date = new Date();
        if(date < new Date(2017,8-1,21,0,0,0)){
            $scope.dateState = 1;
        } else if(date >= new Date(2017,8-1,21,0,0,0) && date < new Date(2017,8-1,26,0,0,0)){
            $scope.dateState = 2;
        } else if(date >= new Date(2017,8-1,26,0,0,0) && date < new Date(2017,8-1,28,0,0,0)){
            $scope.dateState = 3;
        } else {
            $scope.dateState = 4;
        }

        $scope.wap = $stateParams.wap;
        $scope.userOBJ = $filter('isRegister')();
        $scope.user = $scope.userOBJ.user.member;

        var userObj = {};
        
        if($scope.userOBJ.register){
            userObj = {uid: $scope.user.uid}
            if($localStorage.showActivityRedbagDialog == undefined){
                resourceService.queryPost($scope, $filter('getUrl')('getMyInvestStatistics'), userObj, 'weekendPopup');
            }
        } else if (!$scope.wap && $stateParams.uid && $stateParams.token){
            userObj = {
                uid: $stateParams.uid,
                token: $stateParams.token
            }
        }


        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case 'moneySeasonRedSend':
                    if (data.success) {
                        if(data.map.isSendSuccess){
                            $scope.dialogType = 'succ'
                        } else {
                            $scope.dialogType = 'successful'
                        }
                        $scope.showDialog = true;
                    } else {
                        if (data.msg=='未登录，请先登录') {
                            window.location.href = 'jsmp://page=3';
                        } else {
                            $filter('活动信息')(1002, $scope, 'y')
                        }
                    }
                    break;
                case 'getMyInvestStatistics':
                    if (data.success) {
                        $scope.investNumber = data.map.totalAmount
                        $scope.dialogType = 'result'
                        $scope.showDialog = true;
                    } else {
                        if (data.msg=='未登录，请先登录') {
                            window.location.href = 'jsmp://page=3';
                        } else {
                            $filter('活动信息')(1002, $scope, 'y')
                        }
                    }

                    break;
                case 'moneySeasonRedSendActive':
                    if (data.success) {
                        if($scope.wap) {
                            $state.go('cpDetail', { pid: data.map.id ,from: 'hongyaAugust'});
                        } else {
                            window.location.href = 'jsmp://page=5?pid=' + data.map.id;
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case 'weekendPopup':
                    if(data.map.totalAmount >= 100000){
                        redbag = 998;
                    } else if(data.map.totalAmount >= 50000){
                        redbag = 448;
                    }  else if(data.map.totalAmount >= 30000){
                        redbag = 288;
                    }  else if(data.map.totalAmount >= 10000){
                        redbag = 88;
                    } 
                    if(redbag > 0){
                        $scope.dialogObj = {
                            className: 'august-hongbao',
                            href: 'main.bankBillList',
                            redbag: redbag
                        }
                        $scope.showActivityDialog = true;
                    }
                break;
            }
        })

        document.addEventListener('scroll',handleScroll,false);

        function handleScroll(){
            if($state.current.name == 'hongyaAugust'){
            　　var scrollTop = $(window).scrollTop();
            　　var windowHeight = $(window).height();
                var btnTop = $('.box-a').offset().top;
    
                $scope.$apply(function(){
                    $scope.showPopbtn = (scrollTop + windowHeight * 0.4 >= btnTop);
                })

            } else{
                document.removeEventListener('scroll',handleScroll,false);
            }
        }

        $scope.getGift = function(){
            if($scope.wap && !$scope.userOBJ.register){
                $state.go('dl',{ returnurl: 'hongyaAugust?wap=true'});
            } else {
                resourceService.queryPost($scope, $filter('getUrl')('moneySeasonRedSend'), userObj, 'moneySeasonRedSend');
            }
        }

        $scope.goInvest = function(){
            resourceService.queryPost($scope, $filter('getUrl')('moneySeasonRedSendActive'), userObj, 'moneySeasonRedSendActive');
        }        

        $scope.goInvestList = function(){
            if($scope.wap){
                $state.go('main.bankBillList');
            } else {
                window.location.href = 'jsmp://page=2';
            }
        }

        $scope.getResult = function(){
            if($scope.wap && !$scope.userOBJ.register){
                $state.go('dl',{ returnurl: 'hongyaAugust?wap=true'});
            } else {
                resourceService.queryPost($scope, $filter('getUrl')('getMyInvestStatistics'), userObj, 'getMyInvestStatistics');
            }
        }

        $scope.handleDialog = function(){
            switch($scope.dialogType){
                case 'rule':
                    break;
                case 'result':
                    break;
                case 'succ':
                    if($scope.wap){
                        $state.go('main.bankBillList');
                    } else {
                        window.location.href = 'jsmp://page=2';
                    }
                    break;
                case 'successful':
                    if($scope.wap){
                        $state.go('myCoupon');
                    } else {
                        window.location.href = 'jsmp://page=11';
                    }
                    break;
            }
        }

        $scope.closeActivityDialog = function(){
            $scope.showActivityDialog = false;
            $localStorage.showActivityRedbagDialog = true;
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
                title: '8月超级钜献！啄米四重礼，红包拿到你手软。',
                desc: '厉害了，每次都是大招！这样的壕礼此时不领更待何时？', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyaAugust?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/august.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '8月超级钜献！啄米四重礼，红包拿到你手软。',
                desc: '厉害了，每次都是大招！这样的壕礼此时不领更待何时？', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyaAugust?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/august.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '8月超级钜献！啄米四重礼，红包拿到你手软。',
                desc: '厉害了，每次都是大招！这样的壕礼此时不领更待何时？', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyaAugust?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/august.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '8月超级钜献！啄米四重礼，红包拿到你手软。',
                desc: '厉害了，每次都是大招！这样的壕礼此时不领更待何时？', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyaAugust?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/august.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '8月超级钜献！啄米四重礼，红包拿到你手软。',
                desc: '厉害了，每次都是大招！这样的壕礼此时不领更待何时？', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyaAugust?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/august.png', // 分享图标
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