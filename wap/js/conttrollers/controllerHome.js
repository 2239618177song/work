/* 
* @Author: lee
* @Date:   2016-01-10 23:29:04
* @Last Modified by:   anchen
* @Last Modified time: 2016-01-12 21:49:52
*/

'use strict';
define(['webappControllers', 'jquery', 'ngdialog'], function (controllers, $, ngdialog) {
    'use strict';
    controllers.controller('pageHomeCtrl', function ($scope, $rootScope, $location, $filter, $state) {
        //控制器的具体js
        $rootScope.title = "汇元金服";
        $scope.home = 'main.home';
        $scope.active = 0;
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            link()
        })
        $scope.goAccount = function () {
            if ($filter('isRegister')().register) {
                $state.go('main.myaccountHome')
            } else {
                $rootScope.noviceDialogShow = true
            }
        }
        link()
        function link() {
            if ($location.$$path.match(/\/main\/home/)) {
                $scope.active = 1;
            } else if ($location.$$path.match(/\/main\/bankBillList/)) {
                $scope.active = 2;
            } else if ($location.$$path.match(/\/main\/more/)) {
                $scope.active = 3;
            } else if ($location.$$path.match(/\/main\/myaccountHome/)) {
                $scope.active = 4;
            }
        }

    })
    controllers.controller('controllerHome', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', '$localStorage', '$location', '$timeout', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $location, $timeout) {
        // 未登录状态点击账户中心展示弹窗
        $rootScope.noviceClose = function () {
            $rootScope.noviceDialogShow = false
        }
        $rootScope.signUp = function () {
            $state.go('zhuce')
            $rootScope.noviceDialogShow = false
        }
        $rootScope.signIn = function () {
            $state.go('dl')
            $rootScope.noviceDialogShow = false
        }
        //控制器的具体js
        //$scope.pageHome=true;
        $filter('isPath')('main.home');
        $scope.loginBox = true;
        $scope.showLogin = false;
        $scope.videoplay = false;
        $scope.active = 2;
        $scope.isLogin = $filter('isRegister')().register;
        if ($scope.isLogin) {
            $scope.user = $filter('isRegister')().user.member;
            $scope.realInfo = $scope.user.realVerify == '1' ? $scope.user.realName : $scope.user.mobilephone;
        }
        $scope.newHandShow = false;
        $scope.toLogin = function () {
            $state.go('dl');
        };
        $scope.toWay = function () {
            $state.go('whymeApp');
        };
        $scope.activefn = function (i) {
            $scope.active = i;
        }
        if (localStorage.userid) {
            $scope.phone = localStorage.phone;
            $scope.loginBox = false;
            $scope.showLogin = true;
        }
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        $scope.tomyaccount = function () {
            $state.go('myaccountHome');
        }
        $scope.goyuebiao = function () {
            $state.go("cpDetail", { pid: $scope.index.activity.pid, wap: true });
            /*if($scope.index.realverify){
                $state.go('yuebiao',{prid:$scope.index.prid,name:$scope.index.name,toState:$state.current.name});
            }else{
                $scope.isRealverify=true;
            }*/
        };
        // 公告
        resourceService.queryPost($scope, $filter('getUrl')('网站公告'), { proId: 14, limit: 3 }, { name: '公告列表' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case 'index':
                    $scope.index = data.map;
                    $scope.banner = data.map.banner;
                    if ($scope.index.newHand) {
                        $localStorage.newHand = $scope.index.newHand;
                    }
                    $scope.newHandShow = !(data.map.isInvested || data.map.newHandInvested);
                    $scope._homeList = []
                    if (data.map.newHand) {
                        $scope._homeList.push(data.map.newHand)
                    }
                    if (data.map.preferredInvest) {
                        $scope._homeList.push(data.map.preferredInvest)
                    }
                    $scope.homeList = $scope._homeList
                    var shuangdaneveryday = "'" + new Date().getFullYear() + new Date().getMonth() + new Date().getDate() + "'";
                    if ($scope.index.activityImgUrl) {
                        if (shuangdaneveryday == $localStorage.shuangdaneveryday) {
                            $scope.shuangdanBox = false;
                        }
                        else {
                            $scope.shuangdanBox = true;
                            $localStorage.shuangdaneveryday = shuangdaneveryday;
                        }
                    }
                    else {
                        $scope.shuangdanBox = false;
                    }
                    break;
                case '公告列表':
                    if (data.success) {
                        $scope.gglist = data.map.page.rows.slice(0, 3);
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
        var obj = {};
        if ($scope.user) { obj.uid = $scope.user.uid; }

        resourceService.queryPost($scope, $filter('getUrl')('shouYe'), obj, { name: 'index' });
        $scope.closeshuangdan = function () {
            $scope.shuangdanBox = false;
            $("body,html").css({ "overflow": "auto", "height": "auto" });
        };
        $scope.playvideo = function () {
            $("body,html").css({ "overflow": "hidden", "height": "100%" });
            $scope.videoplay = true;
        }
        $scope.closevideo = function () {
            $("body,html").css({ "overflow": "auto", "height": "auto" });
            $scope.videoplay = false;
        }

        var prev = new Date($localStorage.showActivityDialog);
        var curr = new Date();
        var sameDay = prev.getDate() == curr.getDate() && prev.getMonth() == curr.getMonth();
        $scope.dialogObj = undefined;
        if (curr >= new Date(2017, 10 - 1, 31, 0, 0, 0) && curr < new Date(2017, 11 - 1, 11, 0, 0, 0)) {
            $scope.dialogObj = {
                className: 'zm-back',
                href: 'zmBackCash'
            }
        }
        else if (curr >= new Date(Date.UTC(2017, 9 - 1, 6, -8, 0, 0)) && curr < new Date(Date.UTC(2017, 9 - 1, 13, -8, 0, 0))) {
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

    }])
        .directive("repeatFinish", function () {
            return {
                link: function (scope, element, attr) {
                    if (scope.$last == true) {
                        scope.$eval(attr.repeatFinish);
                    }
                }
            }
        })
        .directive('homescrollText', function () {
            var temp = '<span repeat-finish="finish()" ng-repeat="item in gglist" ui-sref="GGXQ({artiId:item.artiId,wap:true,from:' + "'home'" +'})">{{item.title}}</span>'
            return {
                template: temp,
                scope: true,
                transclude: true,
                link: function ($scope, element, attrs) {
                    var a = 1;
                    $scope.finish = function () {
                        if (a == 1) {
                            a++;
                            var height;
                            $('.notice-box').find('span').each(function (i) {
                                height = parseFloat($(this).css('height'));
                                $(this).css({
                                    top: (i * height) + 'px'
                                })
                                var that = this;
                                setInterval(function () {
                                    var top = parseFloat($(that).css('top'));
                                    $(that).animate({
                                        top: (top - height) + 'px'
                                    }, 500, function () {
                                        var top = parseFloat($(that).css('top'));
                                        if (top <= (height * (-1))) {
                                            $(that).css({ top: ($scope.gglist.length - 1) * height + 'px' });
                                        }
                                        if (top == 0) {
                                            $(that).css({ zIndex: 1 });
                                        }
                                        else {
                                            $(that).css({ zIndex: 0 });
                                        }
                                    })
                                }, 2500)
                            })
                        }
                    }
                }
            }
        });
})