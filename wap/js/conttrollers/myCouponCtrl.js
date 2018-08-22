/* 
* @Author: xyc
* @Date:   2016-01-18 23:29:04
*/

'use strict';
define([
    'webappControllers'
    , 'jquery'
    , 'ngdialog'
]
    , function (controllers, $, ngdialog) {

        controllers.controller('myCouponCtrl'
            , ['$scope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$rootScope'
                , '$localStorage'
                , '$location'
                , '$stateParams'
                , function ($scope, resourceService, $filter, $state, $rootScope, $localStorage, $location, $stateParams) {
                    if ($location.$$path.match(/myUselessCoupon/g)) {
                        $rootScope.title = '失效的优惠券';
                    } else {
                        $rootScope.title = '优惠券';
                    }

                    $scope.userOBJ = $filter('isRegister')();
                    $filter('isPath')('myCoupon');
                    if (!$scope.userOBJ.register) {
                        $state.go("dl");
                        return;
                    }
                    $scope.active = $stateParams.active || 0;
                    $scope.showDownload = true;
                    // console.log($scope.userOBJ);
                    if ($scope.userOBJ.user.member.toFrom == '16yy' || '18yy' == $scope.userOBJ.user.member.toFrom) {
                        $rootScope.isShowMaskError = true;
                        $rootScope.errorText = '投资新手标不参加此活动';

                    } else if ($scope.userOBJ.user.member.toFrom == '19yy') {
                        switch ($localStorage.maskType) {
                            case '1':
                                $rootScope.isShowMaskError = true;
                                $rootScope.errorText = '投资新手标不参加此活动';
                                break;
                            case '3':
                                $rootScope.isShowMaskError = true;
                                $rootScope.errorText = '投资新手标不参加此活动';
                                break;
                        };
                    }


                    if ($location.$$path.match(/myUselessCoupon/g)) {
                        $scope.active = 3;
                        resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                            uid: $scope.userOBJ.user.member.uid,
                            status: 1
                        }, '我的红包')
                        resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                            uid: $scope.userOBJ.user.member.uid,
                            status: 1
                        }, '已使用')
                        resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                            uid: $scope.userOBJ.user.member.uid,
                            status: 2
                        }, '已过期')

                    } else {
                        resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                            uid: $scope.userOBJ.user.member.uid,
                            flag: $scope.active + 2,
                            status: 0
                        }, '我的红包');
                        resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                            uid: $scope.userOBJ.user.member.uid,
                            status: 0
                        }, '全部红包')
                    }
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type) {
                            case '我的红包':
                                if (data.success) {
                                    $scope.coupons = data.map.list;
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y')
                                }
                                break;
                            case '已使用':
                                if (data.success) {
                                    $scope.hadUseLength = data.map.list.filter(function (item) {
                                        return item.type != 3
                                    }).length
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y')
                                }
                                break;
                            case '已过期':
                                if (data.success) {
                                    $scope.passLength = data.map.list.filter(function (item) {
                                        return item.type != 3
                                    }).length
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y')
                                }
                                break;
                            case '全部红包':
                                if (data.success) {
                                    $scope.backCashLength = data.map.list.filter(function (item) {
                                        return item.type === 1
                                    }).length
                                    $scope.addIncomeLength = data.map.list.filter(function (item) {
                                        return item.type === 2
                                    }).length
                                    $scope.doubleLength = data.map.list.filter(function (item) {
                                        return item.type === 4
                                    }).length
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y')
                                }
                                break;
                        };
                    });
                    $scope.onClick = function (num) {
                        $scope.active = num;
                        $scope.coupons = [];
                        if ($scope.active < 3) {
                            resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                                uid: $scope.userOBJ.user.member.uid,
                                flag: $scope.active + 2,
                                status: 0
                            }, '我的红包');
                        } else if ($scope.active >= 3) {
                            resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                                uid: $scope.userOBJ.user.member.uid,
                                status: $scope.active - 2
                            }, '我的红包');
                        }
                    };
                    $scope.toback = function () {
                        $filter('跳回上一页')(2);
                    };
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
                    $scope.downloadapp = function () {
                        if (isWeiXin()) {
                            if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                                // $('.share-ios').fadeIn(200);
                                window.location.href = "http://wap.huiyuanjinfu.com";
                            } else {
                                // $('.share-android').fadeIn(200);
                                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.hyjr.hy_app";
                            }
                        } else if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                            window.location.href = "https://itunes.apple.com/cn/app/%E5%95%84%E7%B1%B3%E7%90%86%E8%B4%A2/id1294612994?mt=8";
                        } else if (browser.versions.android) {
                            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.hyjr.hy_app";
                        } else {
                            window.location.href = "http://www.hongyajinrong.com/upload/apk/hy_app.apk";
                        }
                    };
                    $scope.closethis = function () {
                        $('.share-ios,.share-android').fadeOut(200);
                    };
                }
            ]);
    })
