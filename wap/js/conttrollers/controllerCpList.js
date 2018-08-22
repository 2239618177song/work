define(['jweixin', 'webappControllers', 'ngdialog', 'asPieProgress', 'gagaka', 'radialIndicator', 'linearIndicator'], function (wx, controllers, ngdialog, k, LuckyCard) {
    controllers.controller('controllerCpList', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $anchorScroll, isWeixin,$interval, $timeout) {
        $rootScope.title = "我要投资";
        $scope.title = '理财'
        delete $localStorage.coupon;
        $scope.perList = [];
        $scope.time = [];
        $scope.interId = [];//定时器
        $filter('isPath')('main.bankBillList');
        $scope.isLogin = $filter('isRegister')().register;
        if ($scope.isLogin) {
            $scope.user = $filter('isRegister')().user.member;
            $scope.realInfo = $scope.user.realVerify == '1' ? $scope.user.realName : $scope.user.mobilephone;
        }
        resourceService.queryPost($scope, $filter('getUrl')('cplist'), { status: 5, pageSize: 30 }, { name: '产品列表' });
        resourceService.queryPost($scope, $filter('getUrl')('raisedAndRepayedNum'), {}, { name: 'raisedAndRepayedNum' });
        var obj = {};
        if ($scope.user) { obj.uid = $scope.user.uid; }
        resourceService.queryPost($scope, $filter('getUrl')('shouYe'), obj, { name: 'index' });

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '产品列表':
                    $scope.perList = [];
                    $scope.time = [];
                    $scope.cp = data.map;
                    $scope.activityProduct = data.map.activityProduct;
                    $scope.cpList = data.map.page.rows;
                    $scope.perList = data.map.perList;
                    for(var i=0;i<$scope.perList.length;i++){
                        $scope.time[i] = $scope.perList[i].time + 1 ; //获取到倒计时 标的倒计时时间
                        (function(i){
                            $scope.interId[i] = $interval(function(){
                                $scope.time[i]=$scope.time[i] - 1;
                                if($scope.time[i] == 0){
                                    for(var j = 0;j<$scope.interId.length;j++){
                                        $interval.cancel($scope.interId[j]);
                                    }
                                    $scope.time[i] = 0;
                                    resourceService.queryPost($scope, $filter('getUrl')('cplist'), { status: 5, pageSize: 30 }, { name: '产品列表' });
                                    resourceService.queryPost($scope, $filter('getUrl')('shouYe'), obj, { name: 'index' });
                                }
                            },1000)
                        })(i)
                        
                    }
                    if (data.map.jhsFlag == true) {
                        $scope.jhsList = data.map.pageJHS.rows;
                    }
                    break;
                case '砸蛋':
                    if (data.success) {
                        $scope.eggs.context.siblings('.chuizi').addClass('za');
                        setTimeout(function () {
                            $('.zjd').show();
                            $('.zjd-box1').show();
                            localStorage.sharezjd = true;
                            $scope.$apply(function () {
                                $scope.eggs.obj.isEgg = 2;
                                $scope.eggs.obj.maxActivityCoupon = data.map.newActivityCoupon.raisedRates;
                                $scope.iszadan = true;
                                $scope.eggs.context.siblings('.chuizi').removeClass('za');
                            })

                        }, 1000);
                        $scope.eggs.oldActivityCoupon = data.map.newActivityCoupon;
                    }
                    break;
                case '第二次砸蛋':
                    if (data.success) {
                        $scope.eggs.context.siblings('.chuizi').addClass('za');
                        $scope.eggs.oldActivityCoupon = data.map.oldActivityCoupon;
                        $scope.eggs.newActivityCoupon = data.map.newActivityCoupon;
                        setTimeout(function () {
                            $('.zjd-box4').show().siblings().hide();
                            $scope.iszadan = true;
                            $scope.eggs.context.siblings('.chuizi').removeClass('za');
                        }, 1000);
                    }
                    break;
                case 'goinvestment':
                    if (data.success) {
                        $localStorage.cp = data.map;
                        $state.go('investment');
                    }
                    break;
                case 'index':
                    $scope.index = data.map;
                    $scope.newHandShow = !(data.map.isInvested || data.map.newHandInvested);
                    $scope.newHandList = data.map.newHandList
                    $scope.haveNewHandList = data.map.newHandList.length > 0 ? true : false
                    break;
                case 'raisedAndRepayedNum':
                    if (data.success) {
                        $scope.raisedNum = data.map.raisedNum;
                        $scope.repayedNum = data.map.repayedNum;
                    }
                    break;
                case 'weekendPopup':
                    var redbag = 0;
                    if (data.map.totalAmount >= 100000) {
                        redbag = 998;
                    } else if (data.map.totalAmount >= 50000) {
                        redbag = 448;
                    } else if (data.map.totalAmount >= 30000) {
                        redbag = 288;
                    } else if (data.map.totalAmount >= 10000) {
                        redbag = 88;
                    }
                    if (redbag > 0) {
                        $scope.dialogObj = {
                            className: 'august-hongbao',
                            href: 'main.bankBillList',
                            redbag: redbag
                        }
                        $scope.showActivityDialog = true;
                    } else {
                        $localStorage.showActivityRedbagDialog = true;
                        if ($localStorage.showActivityDialog == undefined || !sameDay) {
                            $scope.dialogObj = {
                                className: 'august',
                                href: 'extend.hongyaAugust'
                            }
                            $scope.showActivityDialog = true;
                        }
                    }
                    break;
            };
        });
        $scope.radius = $('.rem-rule').width();
        $scope.goNext = function(){
            $localStorage.pastlist = 0;
            $state.go('pastcplist');
        }
        // old
        $scope.showList = function (type) {
            if ($scope.type != type) {
                $scope.type = type;
                $scope.cpList = [];
                objs.type = $scope.type;
                resourceService.queryPost($scope, $filter('getUrl')('cplist'), objs, { name: '产品列表' });
            }
        }
        $scope.zaEgg = function (e, item) {
            e.stopPropagation();
            $scope.eggs.id = item.id;
            $scope.eggs.context = $(e.currentTarget);
            if (item.isEgg == 1 && $scope.iszadan) {
                $scope.iszadan = false;
                $scope.eggs.obj = item;
                resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: item.id }, { name: '砸蛋' });
            } else if (item.isEgg != 1) {
                $state.go('cpDetail', { pid: item.id });
            }
        };
        $scope.share = function (e) {
            if (isWeixin()) {
                $('.zjd-box2').show();
            } else {
                $('.zjd-boxpc').show().siblings().hide();
                $scope.width = $('.zjd-boxpc').find('.erweima').children().width() - 20;
                $('.zjd-boxpc').find('canvas').css({ left: 10, bottom: 10 });
                $scope.finishsaoma = true;
                $timeout(function () { $scope.finishsaoma = false; }, 5000);
            }
        };
        $scope.finishshare = function () {
            $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false;
        }
        $scope.zajindan = function (e) {
            $scope.eggs.context = $(e.currentTarget);
            if ($scope.iszadan) {
                resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: $scope.eggs.id }, { name: '第二次砸蛋' });
            }
        };
        $scope.closethis = function (e) {
            $(e.currentTarget).hide();
        }
        $scope.goinvestment = function () {
            var obj = {};
            obj.pid = $scope.eggs.id;
            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'goinvestment' });
        }
        $scope.cancelza = function (e) {
            e.stopPropagation();
        };
        $scope.closeEgg = function () {
            $('.zjd').hide();
            $('.zjd').children().hide();
        };


        var prev = new Date($localStorage.showActivityDialog);
        var curr = new Date();
        var sameDay = prev.getDate() == curr.getDate() && prev.getMonth() == curr.getMonth();
        $scope.dialogObj = undefined;

        if (curr >= new Date(Date.UTC(2017, 9 - 1, 6, -8, 0, 0)) && curr < new Date(Date.UTC(2017, 9 - 1, 13, -8, 0, 0))) {
            $scope.dialogObj = {
                className: 'fan-a',
                href: 'hongyaFanA'
            }
        } else if (curr >= new Date(2017, 8 - 1, 28, 0, 0, 0) && curr < new Date(2017, 9 - 1, 1, 0, 0, 0)) {
            $scope.dialogObj = {
                className: 'qixi',
                href: 'hongyaqixi'
            }
        } else if (curr >= new Date(2017, 8 - 1, 26, 0, 0, 0) && curr < new Date(2017, 8 - 1, 28, 0, 0, 0)) {
            if ($scope.isLogin && $localStorage.showActivityRedbagDialog == undefined) {
                resourceService.queryPost($scope, $filter('getUrl')('getMyInvestStatistics'), obj, { name: 'weekendPopup' });
            } else {
                $scope.dialogObj = {
                    className: 'august',
                    href: 'hongyaAugust'
                }
            }
        } else if (curr >= new Date(2017, 8 - 1, 21, 0, 0, 0) && curr < new Date(2017, 8 - 1, 26, 0, 0, 0)) {
            $scope.dialogObj = {
                className: 'august',
                href: 'hongyaAugust'
            }
        } else if (curr >= new Date(2017, 8 - 1, 7, 0, 0, 0) && curr < new Date(2017, 8 - 1, 21, 0, 0, 0)) {
            $scope.dialogObj = {
                className: 'hongbaoyu',
                href: 'hongyahongbaoyu'
            }
        } else if (curr >= new Date(2017, 7 - 1, 28, 0, 0, 0) && curr < new Date(2017, 8 - 1, 22, 0, 0, 0)) {
            $scope.dialogObj = {
                className: 'runyue',
                href: 'hongyarunyue'
            }
        }

        $scope.showActivityDialog = (!$localStorage.showActivityDialog || !sameDay);

        $scope.closeActivityDialog = function () {
            $localStorage.showActivityDialog = new Date();
            $scope.showActivityDialog = false;
            if ($scope.dialogObj.className == 'august-hongbao') {
                $localStorage.showActivityRedbagDialog = true;
            }
        }

    })
        .directive('progressCircle', function () {
            return {
                restrict: 'A',
                scope: true,
                link: function ($scope, element, attrs) {
                    var config = {
                        radius: ($scope.radius - 8) / 2,
                        barWidth: 4,
                        barBgColor: '#EBEBEB',
                        percentage: false,
                        displayNumber: false,
                        roundCorner: false,
                        initValue: 0,
                        interpolate: true,
                        barColor: '#FF9593',
                        frameTime: (1000 / attrs.progress)
                    }
                    if (attrs.progress >= 100) {
                        config.initValue = 100;
                        config.barColor = '#D6D6D6';
                    }
                    else if (attrs.progress <= 0) {
                        config.roundCorner = false;
                    }
                    var radialObj = $(element).radialIndicator(config).data('radialIndicator');
                    radialObj.animate(attrs.progress);
                }
            }
        })
        .directive('newHandProgressLine', function () {
            return {
                restrict: 'A',
                scope: true,
                link: function ($scope, element, attrs) {
                    var width = $(element).width();

                    if (attrs.color == 'blue') {
                        var startColor = '#ffffff'; //新手
                        var endColor = '#ffffff';
                    } else {
                        var startColor = '#ffffff';
                        var endColor = '#ffffff';
                    }
                    var config = {
                        width: width,
                        radius: ($scope.radius - 8) / 2,
                        barWidth: 1,
                        startColor: startColor,
                        endColor: endColor,
                        barBgColor: '#ffffff',
                        percentage: true,
                        displayNumber: true,
                        fontSize: 10,
//                      fontWeight: 'lighter',
                        roundCorner: false,
                        initValue: 0,
                        interpolate: true,
                        textAlign:'left',
                        barColor: '#ffffff',
                        frameTime: (1000 / attrs.progress)
                    }
                    if (attrs.progress >= 100) {
                        config.initValue = 100;
                        config.barColor = '#fff800';
                        config.startColor = '#fff800';
                        config.endColor = '#fff800';
                    }
                    else if (attrs.progress <= 0) {
                        config.roundCorner = false;
                    }
                    var radialObj = $(element).linearIndicator(config).data('linearIndicator');
                    radialObj.animate(attrs.progress);
                }
            }
        })
        .directive('progressLine', function () {
            return {
                restrict: 'A',
                scope: true,
                link: function ($scope, element, attrs) {
                    var width = $(element).width();

                    if (attrs.color == 'blue') {
                        var startColor = '#dab340'; //新手
                        var endColor = '#fc764d';
                    } else {
                        var startColor = '#dab340';
                        var endColor = '#fc764d';
                    }
                    var config = {
                        width: width,
                        radius: ($scope.radius - 8) / 2,
                        barWidth: 1,
                        startColor: startColor,
                        endColor: endColor,
                        barBgColor: '#b2b2b2',
                        percentage: true,
                        displayNumber: true,
                        fontSize: 10,
                        fontWeight: 'lighter',
                        roundCorner: false,
                        initValue: 0,
                        interpolate: true,
                        barColor: '#b2b2b2',
                        textAlign:'left',
                        frameTime: (1000 / attrs.progress)
                    }
                    if (attrs.progress >= 100) {
                        config.initValue = 100;
                        config.barColor = '#b2b2b2';
                        config.startColor = '#dab340';
                        config.endColor = '#fc764d';
                    }
                    else if (attrs.progress <= 0) {
                        config.roundCorner = false;
                    }
                    var radialObj = $(element).linearIndicator(config).data('linearIndicator');
                    radialObj.animate(attrs.progress);
                }
            }
        });

    /*刮刮卡*/
    controllers.controller('testGGKCtrl'
        , ['$scope', '$rootScope'
            , 'resourceService'
            , '$filter'
            , '$state'
            , '$localStorage'
            , '$anchorScroll'
            , function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $anchorScroll) {
                $rootScope.title = "guaguaka";
                LuckyCard.case({
                    ratio: .1,
                    // coverImg:'images/activity/act-rule.png'
                    coverImg: 'images/ggk/gg.png'
                }, function () {
                    // alert('至于你信不信，我反正不信！');
                    this.clearCover();
                });

                resourceService.queryPost($scope, $filter('getUrl')('cplist'), {}, { name: '产品列表' });
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                    switch (eObj.name) {
                        case '产品列表':
                            $scope.jl = "$1000家园";
                            break;
                    };
                });
            }
        ])
})

