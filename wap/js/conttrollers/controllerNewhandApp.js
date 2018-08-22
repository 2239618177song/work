/*
 * @Author: lee
 * @Date:   2016-01-10 23:29:04
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-01-12 21:49:52
 */
define([
    'jweixin'
    , 'webappControllers'
    , 'jquery'
    , 'ngdialog'
    // , 'linearIndicator'
]
    , function (wx, controllers, $, ngdialog) {
        /*新手详情*/
        controllers.controller('controllerNewhandApp'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$stateParams'
                , '$localStorage'
                , function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $localStorage) {
                    $scope.wap = $stateParams.wap;
                    $scope.app = $stateParams.app;
                    if ($stateParams.pid) {
                        $scope.pid = $stateParams.pid;
                    }
                    function getUrlParam(name) {
                        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                        if (r != null) return unescape(r[2]); return null; //返回参数值
                    }
                    $filter('isPath')('newhand');
                    $('body').scrollTop(0);
                    $scope.toback = function () {
                        if (getUrlParam('from') == 'coupon') {
                            $state.go('myCoupon');
                        } else {
                            $filter('跳回上一页')(2);
                        }
                    };
                    $scope.gologin = function () {
                        $state.go('dl', { returnurl: 'newhand?pid=' + $scope.cp.id + "&wap=true" });
                    };
                    $rootScope.title = "新手体验";
                    var user = $filter('isRegister')();
                    $scope.mainbox = true;
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case 'newH':
                                $localStorage.cp = data.map;

                                $scope.cpObj = data.map;
                                $scope.cp = data.map.info;
                                if ($scope.cp.endDate != undefined) {
                                    var date3 = $scope.cp.endDate - Date.parse(new Date());
                                    var day = Math.floor(date3 / (24 * 3600 * 1000));
                                    var hh = Math.floor(date3 / (3600 * 1000));
                                    if (day > 0) {
                                        $scope.nowTimer = day + '天';
                                    } else
                                        if (day == 0 && hh > 1) {
                                            $scope.nowTimer = hh + '小时';
                                        } else
                                            if (day == 0 && hh < 1) {
                                                $scope.nowTimer = '1小时内'
                                            } else
                                                if (hh < 0) {
                                                    if ($scope.cp.status == 5) {
                                                        $scope.nowTimer = '无限制';
                                                    } else {
                                                        $scope.nowTimer = '已结束';
                                                    }
                                                }
                                } else {
                                    $scope.nowTimer = '已结束';
                                };
                                break;
                            case 'cpPicAndInvest':
                                $scope.cp = data.map.info;
                                break;
                        };
                    });

                    var obj = {};
                    obj.pid = $stateParams.pid;
                    if (user.register) {
                        obj.uid = user.user.member.uid;
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'newH' });
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
                }
            ])

        /*产品详情*/
        controllers.controller('controllerCpDrtail'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$stateParams'
                , '$location'
                , '$localStorage'
                , function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $location, $localStorage) {
                    delete $localStorage.coupon;
                    $filter('isPath')('cpDetail');
                    $scope.userOBJ = $filter('isRegister')();
                    $scope.isShow = true;
                    if ($scope.userOBJ.register == true) {
                        $scope.isShow = true;
                    } else {
                        $scope.isShow = false;
                    }
                    $scope.protocol = $filter('protocolFilter')()
                    $scope.toback = function () {
                        if (getUrlParam('from') == 'coupon') {
                            $state.go('myCoupon');
                        }
                        else if (getUrlParam('from') == 'hongyarunyue') {
                            $state.go('hongyarunyue', { wap: true });
                        }
                        else if (getUrlParam('from') == 'hongyahongbaoyu') {
                            $state.go('hongyahongbaoyu', { wap: true });
                        }
                        else if (getUrlParam('from') == 'hongyaqixi') {
                            $state.go('hongyaqixi', { wap: true });
                        }
                        else if (getUrlParam('from') == 'hongyaFanA') {
                            $state.go('hongyaFanA', { wap: true });
                        } else if (getUrlParam('from') == 'pastCplist') {
                            $state.go('pastcplist');
                        }
                        else {
                            $state.go('main.bankBillList');
                            // $filter('跳回上一页')(2);
                            // $state.go('pastcplist');
                        }
                    };
                    function getUrlParam(name) {
                        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                        if (r != null) return unescape(r[2]); return null; //返回参数值
                    }
                    $scope.yuebiao = {};
                    $rootScope.title = "新手专享";
                    $scope.mainbox = true;
                    var user = $filter('isRegister')();
                    $scope.user = user;
                    $scope.active = 0;
                    $scope.isShowRule = false;
                    $scope.showBigImg = false;
                    var $win = $(window);
                    $("html,body").animate({ scrollTop: $("body").offset().top });
                    $win.on('load resize scroll', function () {
                        // $('.check-img-wrap').height($('body').height());
                        $('.check-img-wrap').height($win.height()).width($win.width());
                        $('.check-img-wrap img').css('max-height', $win.height()).css('max-width', $win.width());
                    });
                    $scope.showImg = function (event) {
                        $scope.bigImgSrc = $(event.currentTarget).attr('src');
                        $scope.showBigImg = true;
                    };
                    $scope.slideToggle = function (e) {
                        $(e.currentTarget).parent().siblings("p").stop().slideToggle(200);
                        if ($(e.currentTarget).hasClass('slideDown')) {
                            $(e.currentTarget).removeClass('slideDown')
                        } else { $(e.currentTarget).addClass('slideDown') }
                    };
                    $scope.closeRealverify = function () {
                        $scope.isRealverify = false;
                    };
                    $scope.gologin = function () {
                        $state.go('dl', { returnurl: 'cpDetail?pid=' + $scope.cp.id });
                    };
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case 'cpDetail':
                                data.map.specialRate = parseFloat(data.map.specialRate);
                                $localStorage.cp = data.map;
                                $scope.yuebiao.name = data.map.name;
                                $scope.yuebiao.isReservation = data.map.isReservation;
                                $scope.yuebiao.prid = data.map.prid;
                                $scope.yuebiao.realverify = data.map.realverify;
                                $scope.linkURL = data.map.linkURL;
                                $scope.appTitle = data.map.appTitle;
                                $scope.cp = data.map.info;
                                $scope.nowTime = data.map.nowTime
                                $rootScope.title = $scope.cp.fullName;

                                $scope.isInvested = data.map.isInvested;
                                $scope.newHandInvested = data.map.newHandInvested;
                                $scope.type = data.map.info.type;
                                // 双蛋活动添加
                                $scope.doubleEggrule = data.map.doubleEggrule;
                                $scope.specialRate = parseFloat(data.map.specialRate);
                                $scope.isOldUser = data.map.isOldUser;
                                if ($scope.specialRate > 0) {
                                    $scope.isshuangdan = true;
                                }
                                else {
                                    $scope.isshuangdan = false;
                                }

                                if ($scope.cp.atid) { $rootScope.title = "投资送iPhone7"; }
                                $rootScope.cpInfo = data.map.repair;
                                $scope.extendInfos = data.map.extendInfos;
                                if ($scope.cp.establish != undefined) {
                                    var date3 = $scope.cp.establish - Date.parse(new Date());
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
                                                    if ($scope.cp.type == 1) {
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

                                /*补标弹窗显示*/
                                if ($stateParams.isShowRule == undefined) {
                                    if ($scope.cpInfo != undefined && $scope.cp.isRepair == 1 && $scope.cp.surplusAmount > 0) {
                                        $rootScope.isShowRule = true;
                                    }
                                } else {
                                    $scope.isShowRule = false;
                                }
                                if ($stateParams.pid) {
                                    var obj1 = {
                                        pid: $stateParams.pid,
                                        type: $scope.cp.type
                                    };
                                    if (user.register) {
                                        obj1.uid = user.user.member.uid;
                                    } else {
                                        obj1.uid = 0
                                    }
                                    resourceService.queryPost($scope, $filter('getUrl')('cpPicAndInvest'), obj1, { name: 'cpPicAndInvest' });


                                }
                                break;
                            case 'cpPicAndInvest':
                                $scope.picList = data.map.picList;
                                $scope.investList = data.map.investList;
                                break;
                            case '是否认证':
                                $scope.map = data.map;
                                break;
                            case '砸蛋':
                                if (data.success) {
                                    $scope.eggs.context.siblings('.chuizi').addClass('za');
                                    setTimeout(function () {
                                        $('.zjd').show();
                                        $('.zjd-box1').show();
                                        localStorage.sharezjd = false;
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
                                    $scope.eggs.obj.maxActivityCoupon = data.map.newActivityCoupon.raisedRates;
                                    setTimeout(function () {
                                        $('.zjd-box4').show().siblings().hide();
                                        $scope.iszadan = true;
                                        $scope.eggs.context.siblings('.chuizi').removeClass('za');
                                    }, 1000);
                                }
                                break;
                        };
                    });

                    $scope.panel1 = {
                        isAction: 1
                    }
                    $scope.panel2 = {
                        isAction: 1
                    }
                    $scope.panel3 = {
                        isAction: 1
                    }
                    $scope.panel4 = {
                        isAction: 1
                    }
                    $scope.onClick = function (name) {
                        switch (name) {
                            case 'closeRule':
                                $scope.isShowRule = false;
                                break;
                        };
                    };
                    $scope.setAction = function (item) {
                        if (item.isAction == 1) {
                            item.isAction = 0;
                        } else {
                            item.isAction = 1;
                        }
                    };

                    $scope.goyuebiao = function () {
                        if ($scope.yuebiao.realverify) {
                            $state.go('yuebiao', { prid: $scope.yuebiao.prid, name: $scope.yuebiao.name, toState: $state.current.name, pid: $stateParams.pid });
                        } else {
                            $scope.isRealverify = true;
                        }
                    };
                    if ($stateParams.pid != null) {
                        var obj = {};
                        obj.pid = $stateParams.pid;
                        if (user.register) {
                            obj.uid = user.user.member.uid;
                            resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                                uid: user.user.member.uid
                            }, { name: '是否认证' });
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'cpDetail' });
                    } else {
                        $filter('跳回上一页')(1);
                    };
                    var uid;
                    if (user.user.member) { uid = user.user.member.uid; }
                    $scope.iszadan = true;
                    $scope.eggs = {};
                    $scope.zaEgg = function (e, item) {
                        e.stopPropagation();
                        $scope.eggs.id = item.id;
                        $scope.eggs.context = $(e.currentTarget);
                        if (item.isEgg == 1 && $scope.iszadan) {
                            $scope.iszadan = false;
                            $scope.eggs.obj = item;
                            resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: item.id }, { name: '砸蛋' });
                        }
                    };
                    $scope.share = function (e) {
                        $('.zjd-box2').show();
                        //setTimeout(function(){$('.zjd-box3').show().siblings().hide();localStorage.sharezjd=false;}, 5000);
                        //$('.zjd-box3').show().siblings().hide();
                    };
                    $scope.zajindan = function (e) {
                        $scope.eggs.context = $(e.currentTarget);
                        if ($scope.iszadan) {
                            resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: $scope.eggs.id }, { name: '第二次砸蛋' });
                        }
                    };
                    $scope.closethis = function (e) {
                        $(e.currentTarget).hide();
                    }
                    $scope.cancelza = function (e) {
                        e.stopPropagation();
                    };
                    $scope.closeEgg = function () {
                        $('.zjd').hide();
                        $('.zjd').children().hide();
                    };
                    $scope.clickTab = function (n) {
                        $scope.active = n;
                    };
                    var userphone = "";
                    if ($filter('isRegister')().user.member) { userphone = '&recommCode=' + $filter('isRegister')().user.member.mobilephone; }
                    localStorage.sharezjd = false;
                    wx.ready(function () {
                        wx.onMenuShareTimeline({
                            link: 'http://wap.huiyuanjinfu.com/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareAppMessage({
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareQQ({
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareWeibo({
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareQZone({
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                    })

                }
            ])
            .directive('newhand', function () {
                return {
                    restrict: 'EA',
                    replace: true,
                    transclude: true,
                    scope: {},
                    templateUrl: 'template/newhand/newhandDetail.html',
                }
            });

    })