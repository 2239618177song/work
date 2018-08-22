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

        controllers.controller('investmentController'
            , ['$scope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$rootScope'
                , '$localStorage'
                , '$stateParams'
                , function ($scope, resourceService, $filter, $state, $rootScope, $localStorage, $stateParams) {
                    $scope.submitBool = true;
                    $rootScope.title = '产品投资';
                    $filter('isPath')('investment');
                    $scope.protocol = $filter('protocolFilter')()
                    var user = $filter('isRegister')().user;
                    $scope.smrFrom = {};
                    $scope.cpCoupon = {};
                    $scope.cpCoupon.type = 0;
                    if ($stateParams.pid) {
                        resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                            'pid': $stateParams.pid,
                            'uid': $filter('isRegister')().user.member.uid,
                        }, '产品详情');
                    } else {
                        $scope.cp = $localStorage.cp;
                    }
                    $scope.playSound = true;
                    $scope.userTypes = {};
                    $scope.userTypes.passWord = '';
                    $scope.showMask = false;
                    $scope.cpCoupon.id = '';
                    $scope.delCoupon = function () {
                        $scope.cpCoupon = { type: 0, id: null };
                    };
                    $scope.changeSelect = function () {
                        if ($scope.select == false) {
                            $scope.amount = 10000;
                        }
                        else if ($scope.amount >= 10000) {
                            $scope.amount = '';
                        }
                        $scope.select = !$scope.select;
                    }
                    $scope.onChange = function () {
                        $rootScope.amt = $scope.amount * 1;
                        tyjCheck()
                        hongbaoFilter()
                    };
                    $scope.agreeclick = function () {
                        $scope.playSound = !$scope.playSound;
                    }
                    $scope.add = function () {
                        if ($scope.amount === '') {
                            $scope.amount = 100
                            return
                        }
                        if ($scope.amount >= $scope.cp.info.surplusAmount) return
                        $scope.amount = parseInt($scope.amount) + 100
                        tyjCheck()
                        hongbaoFilter()
                    }
                    $scope.minus = function () {
                        if ($scope.amount <= $scope.cp.info.leastaAmount) return
                        $scope.amount = parseInt($scope.amount) - 100
                        tyjCheck()
                        hongbaoFilter()
                    }
                    // 体验金选择状态
                    function tyjCheck() {
                        $scope.select = $scope.amount >= 10000 ? true : false
                    }
                    // 红包可用状态
                    function hongbaoFilter() {
                        if ($localStorage.coupons && $localStorage.coupons.length > 0) {
                            $localStorage.coupons.forEach(function (item) {
                                if ($scope.amount >= item.enableAmount) {
                                    item.canuse = true
                                } else {
                                    item.canuse = false
                                }
                            })
                            var currentCoupon = $localStorage.coupons.filter(function (item) {
                                return item.id == $stateParams.cpid
                            })
                            if (currentCoupon.length > 0 && !currentCoupon[0].canuse) {
                                $scope.cpCoupon = { type: 0, id: null };
                            }
                            $localStorage.coupons.sort(function (a, b) {
                                return b.canuse - a.canuse
                            })
                        }
                    }
                    // 体验金点击事件
                    $scope.tyjSelect = function () {
                        if ($scope.amount < 10000) {
                            $scope.amount = 10000;
                        }
                        tyjCheck()
                        hongbaoFilter()
                    }
                    //体验金判断
                    resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                        uid: user.member.uid,
                        flag: 0
                    }, '我的体验金');
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type) {
                            case '用户状态':
                                if (data.success) {
                                    $scope.userTypes = data.map;
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y')
                                }
                                break;
                            case '产品详情':
                                if (data.success) {
                                    data.map.specialRate = parseFloat(data.map.specialRate);
                                    $localStorage.cp = $scope.cp = data.map;
                                    if ($scope.cp.info.type == 1) { $scope.playSound = true; }
                                    if ($filter('isRegister')().user.member != undefined) {
                                        resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                                            'uid': $filter('isRegister')().user.member.uid
                                        }, '用户状态');
                                        resourceService.queryPost($scope, $filter('getUrl')('产品可用全部优惠券'), {
                                            'uid': $filter('isRegister')().user.member.uid,
                                            'pid': $scope.cp.info.id,
                                            // 'amount': $scope.cp.info.surplusAmount,
                                        }, '产品可用优惠券');
                                        resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                                            'uid': $filter('isRegister')().user.member.uid,
                                            'pid': $scope.cp.info.id
                                        }, '账户余额');
                                    } else {
                                        resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                                        }, '用户状态');
                                        if ($scope.cp) {
                                            resourceService.queryPost($scope, $filter('getUrl')('产品可用全部优惠券'), {
                                                'pid': $scope.cp.info.id
                                            }, '产品可用优惠券');
                                        };
                                    };
                                }
                                break;
                            case '账户余额':
                                $scope.balance = data.map.balance;
                                $scope.repair = data.map.repair;
                                if ($stateParams.amt != null) {
                                    $scope.amount = $stateParams.amt * 1;
                                } else if (!$stateParams.pid) {
                                    $scope.amount = data.map.info.leastaAmount
                                }
                                $scope.$watch('amount', function () {
                                    tyjCheck()
                                    hongbaoFilter()
                                })
                                window.setTimeout(function () {
                                    hongbaoFilter()
                                }, 0)
                                // 返现红包
                                if ($scope.repair != undefined && $scope.cp.info.surplusAmount == $scope.amount) {
                                    if ($scope.repair.type == 2) {/*补标收益为加息*/
                                        $scope.FXJiaXi = true;
                                    } else if ($scope.repair.type == 1) {/*补标收益为返现*/
                                        $scope.FXFanXian = true;
                                    }
                                } else {
                                    $scope.noFXshouyi = true;
                                }
                                if ($scope.cp.info.establish != undefined) {
                                    var date3 = $scope.cp.info.establish - Date.parse(new Date());
                                    var day = Math.floor(date3 / (24 * 3600 * 1000));
                                    var hh = Math.floor(date3 / (3600 * 1000));
                                    if (day > 0) {
                                        $scope.nowTimer = day + '天';
                                        // $scope.isFinish = true;
                                    } else
                                        if (day == 0 && hh > 1) {
                                            $scope.nowTimer = hh + '小时';
                                            // $scope.isFinish = true;
                                            $scope.isBuTimer = true;
                                        } else
                                            if (day == 0 && hh < 1) {
                                                $scope.nowTimer = '1小时内'
                                                // $scope.isFinish = true;
                                            } else
                                                if (hh < 0) {
                                                    if ($scope.cp.info.type == 1) {
                                                        $scope.nowTimer = '无限制';
                                                    } else {
                                                        $scope.nowTimer = '已结束';
                                                    }
                                                    $scope.isFinish = true;
                                                }
                                } else {
                                    $scope.nowTimer = '已结束';
                                    $scope.isFinish = true;
                                };
                                if ($scope.repair != undefined && $scope.cp.info.surplusAmount == $scope.amount) {
                                    if ($scope.repair.type == 2) {
                                        $scope.FBJiaXi = true;
                                    } else if ($scope.repair.type == 1) {
                                        $scope.FBFanXian = true;
                                    }
                                } else {
                                    $scope.noFBshouyi = true;
                                }
                                if ($scope.repair != undefined && $scope.cp.info.surplusAmount == $scope.amount) {
                                    if ($scope.repair.type == 2) {
                                        $scope.JXQJiaXi = true;
                                    } else if ($scope.repair.type == 1) {
                                        $scope.JXQFanXian = true;
                                    }
                                } else {
                                    $scope.noJXshouyi = true;
                                }
                                // type==0
                                if ($scope.repair != undefined) {
                                    if ($scope.repair.type == 2) {
                                        $scope.noHBJiaXi = true;
                                    } else if ($scope.repair.type == 1) {
                                        $scope.noHBFanXian = true;
                                    }
                                } else {
                                    $scope.noHBshouyi = true;
                                }
                                break;
                            case '产品可用优惠券':
                                var couponAmount = {};
                                couponAmount.amount = 0;
                                if (data.success) {
                                    $localStorage.coupons = $scope.cop = data.map.list;
                                    if ($stateParams.cpid != undefined && $scope.cop.length > 0) {
                                        for (var i = 0; i < $scope.cop.length; i++) {
                                            if ($scope.cop[i].id == $stateParams.cpid) {
                                                $scope.cpCoupon = $scope.cop[i];
                                            }
                                        };
                                    }
                                    else if ($localStorage.fromJY != undefined && $scope.cop.length > 0) {//设置密码回来后回填
                                        for (var i = 0; i < $scope.cop.length; i++) {
                                            if ($scope.cop[i].id == $localStorage.fromJY.cpid) {
                                                $scope.cpCoupon = $scope.cop[i];
                                            }
                                        };
                                        $scope.amount = $localStorage.fromJY.amount;
                                        $scope.cp.info.id = $localStorage.fromJY.cpInfoId;
                                        tyjCheck()
                                        delete $localStorage.fromJY;
                                    }
                                    else {
                                        $scope.cpCoupon.type = 0;
                                    }
                                    if (!$stateParams.pid) {
                                        for (var j = 0; j < $scope.cop.length; j++) {
                                            if ($scope.cop[j].pid && !$localStorage.coupon) {
                                                $scope.cpCoupon = $scope.cop[j];
                                            }
                                        }
                                    }
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y')
                                }
                                break;
                            case '购买产品':
                                if (data.success) {
                                    $scope.successData = $scope.cp;
                                    $scope.successData.shouyi = $rootScope.shouyi;
                                    $scope.successData.investAmount = $scope.amount;
                                    $scope.successData.coupon = $scope.cpCoupon ? $scope.cpCoupon : 0;
                                    $scope.successData.isDoubleEgg = data.map.isDoubleEgg;
                                    $scope.successData.investTime = data.map.investTime;
                                    $scope.successData.isRepeats = data.map.isRepeats;
                                    $scope.successData.luckCodeCount = data.map.luckCodeCount;
                                    $scope.successData.luckCodes = data.map.luckCodes;
                                    $scope.successData.raisedRates = $scope.cpCoupon.raisedRates;
                                    $scope.successData.multiple = $scope.cpCoupon.multiple;
                                    $scope.successData.activityURL = data.map.activityURL;
                                    $scope.successData.jumpURL = data.map.jumpURL;
                                    $localStorage.successData = $scope.successData;
                                    $state.go('investSuccess');
                                } else {
                                    if (data.errorCode == '2001') {
                                        $filter('投资交易密码错误信息')($scope);
                                    } else {
                                        $filter('投资错误信息')(data.errorCode, $scope, 'y');
                                    }
                                }
                                break;
                            case '我的体验金':
                                if (data.success) {
                                    $scope.tyjFlag = data.map.list.filter(function (item) {
                                        return item.status === 0 && item.source === 100
                                    }).length > 0 ? true : false
                                }
                                break
                        };
                    });
                    $scope.tobuy = function () {
                        if ($scope.amount != '' && $scope.amount != undefined && $('#myPwd').val() != '') {
                            if ($scope.cpCoupon.enableAmount > $scope.amount) {
                                alert("投资金额小于使用红包的最小限额！");
                                return;
                            }
                            if (showCouponDailog($scope.amount)) {
                                $filter('invest-coupon-dialog')($scope);
                            } else {
                                $scope.topay();
                            }
                        } else {
                            if ($scope.amount == '' || $scope.amount == undefined) {
                                $filter('投资错误信息')('noInp', $scope, 'y');
                            } else if ($('#myPwd').val() == '') {
                                $filter('投资错误信息')('noPwd', $scope, 'y');
                            }
                        }
                    };
                    $scope.topay = function () {
                        resourceService.queryPost($scope, $filter('getUrl')('购买产品'), {
                            'pid': $scope.cp.info.id,
                            'tpwd': $scope.userTypes.passWord,
                            'amount': $scope.amount,
                            'uid': $filter('isRegister')().user.member.uid,
                            'fid': $scope.cpCoupon.id
                        }, '购买产品');
                    }
                    function showCouponDailog(amount) {
                        if ($scope.cpCoupon.id) {
                            return false;
                        }
                        var result = false;
                        var index = 0;
                        while (!result && index < $scope.cop.length) {
                            result = (amount >= $scope.cop[index].enableAmount) && ($scope.cop[index].maxAmount == null || amount <= $scope.cop[index].maxAmount);
                            index++;
                        }
                        return result;
                    }
                    if ($localStorage.cp && !$stateParams.pid) {
                        if ($filter('isRegister')().user.member != undefined) {
                            resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                                'uid': $filter('isRegister')().user.member.uid
                            }, '用户状态');
                            resourceService.queryPost($scope, $filter('getUrl')('产品可用全部优惠券'), {
                                'uid': $filter('isRegister')().user.member.uid,
                                'pid': $scope.cp.info.id,
                                // 'amount': $scope.cp.info.surplusAmount,
                            }, '产品可用优惠券');
                            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                                'uid': $filter('isRegister')().user.member.uid,
                                'pid': $scope.cp.info.id
                            }, '账户余额');
                        } else {
                            resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                            }, '用户状态');
                            if ($scope.cp) {
                                resourceService.queryPost($scope, $filter('getUrl')('产品可用全部优惠券'), {
                                    'pid': $scope.cp.info.id
                                }, '产品可用优惠券');
                            };
                        };
                    }
                    $scope.onClick = function (name) {
                        switch (name) {
                            case '去设置交易密码':
                                $localStorage.fromJY = {};
                                $localStorage.fromJY.amount = $scope.amount;
                                $localStorage.fromJY.cpid = $scope.cpCoupon.id;
                                $localStorage.fromJY.cpInfoId = $scope.cp.info.id;

                                $state.go('resetTradePwd', { firstset: true });
                                break;
                        };
                    };
                    $scope.toback = function () {
                        // $filter('跳回上一页')(2);
                        if ($localStorage.coupon) {
                            delete $localStorage.coupon
                            $filter('跳回上一页')(3)
                        } else {
                            $filter('跳回上一页')(2)
                        }
                    };
                }
            ]);
    })
