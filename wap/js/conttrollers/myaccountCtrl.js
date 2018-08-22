/* 
* @Author: xyc
* @Date:   2016-01-18 23:29:04
*/

define(['jweixin', 'webappControllers', 'jquery', 'ngdialog'], function (wx, controllers, $, ngdialog) {
    'use strict';
    // controllers.controller('controller1',function($scope){
    //     //控制器的具体js
    //     console.log('crtl1-ok')
    // })
    controllers.controller('accountHomeCtrl', ['$scope', 'resourceService', '$filter', '$state', '$rootScope', '$localStorage', 'ngDialog', 'isWeixin', '$timeout', 'signWeChatService', function ($scope, resourceService, $filter, $state, $rootScope, $localStorage, ngDialog, isWeixin, $timeout, signWeChatService) {
        // signWeChatService();
        $rootScope.title = "我的账户";
        $scope.userOBJ = $filter('isRegister')();
        $scope.user = $scope.userOBJ.user.member;
        $scope.date = new Date().getTime();
        $scope.showAsset = true;
        if ($scope.userOBJ.register) {
            resourceService.queryPost($scope, $filter('getUrl')('myacc'), {
                uid: $scope.userOBJ.user.member.uid
            }, '我的账户');
        } else {
            $state.go('dl');
            return;
        };
        // ngDialog.closeAll();
        $scope.hongbaoShow = false;
        $scope.hongbaoShow2 = false;
        $scope.openredpackets = function () {
            $scope.hongbaoShow2 = false;
            $scope.hongbaoShow = true;
            $("body,html").css({ "overflow": "hidden", "height": "100%" });
        };
        $scope.closeredpackets = function () {
            $scope.hongbaoShow = false;
            $("body,html").css({ "overflow": "auto", "height": "auto" });
        };
        $scope.openredpackets2 = function () {
            if ($scope.youxiaohb == true) {
                $scope.hongbaoShow = false;
                $scope.hongbaoShow2 = true;
                $("body,html").css({ "overflow": "hidden", "height": "100%" });
            } else {
                $scope.hongbaoShow = false;
                $scope.hongbaoShow2 = false;
                $state.go('getCash');
                //$scope.hongbaoShow2=false;
                //$("body,html").css({"overflow":"auto","height":"auto"});
            }

        };
        $scope.closeredpackets2 = function () {
            $scope.hongbaoShow = false;
            $scope.hongbaoShow2 = false;
            $("body,html").css({ "overflow": "auto", "height": "auto" });
        };
        $scope.closepackets2 = function () {
            $state.go('getCash');
            $scope.hongbaoShow = false;
            $scope.hongbaoShow2 = false;
            $("body,html").css({ "overflow": "auto", "height": "auto" });
        }
        $scope.out = function (argument) {
            switch (argument) {
                case 'out':
                    $filter('清空缓存')();
                    $state.go('main.home');
                    break;
            };
        }
        //页面展示数据
        resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
            uid: $scope.userOBJ.user.member.uid,
            status: 0
        }, '全部红包')
        resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
            uid: $scope.userOBJ.user.member.uid,
            flag: 0
        }, '我的体验金');
        // resourceService.queryPost($scope, $filter('getUrl')('myInvitation'), {
        //     uid: $scope.userOBJ.user.member.uid
        // }, '我的邀请');
        // resourceService.queryPost($scope, $filter('getUrl')('我的投资'), {
        //     uid: $scope.userOBJ.user.member.uid,
        //     status: 1,
        //     pageOn: 1,
        //     pageSize: 5
        // }, '持有中');
        // resourceService.queryPost($scope, $filter('getUrl')('我的投资'), {
        //     uid: $scope.userOBJ.user.member.uid,
        //     status: 3,
        //     pageOn: 1,
        //     pageSize: 5
        // }, '已还款');
        $filter('isPath')('main.myaccountHome');
        $scope.shareUrl = 'http://wap.huiyuanjinfu.com/zhuomireg?recommCode=' + $scope.user.mobilephone;
        function IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '我的账户':
                    if (data.success) {
                        data.map.isPayment = false;
                        $scope.accunt = data.map;
                        resourceService.queryPost($scope, $filter('getUrl')('getPromoteRedelivery'), {
                            uid: $scope.userOBJ.user.member.uid
                        }, '有效红包');
                        if (data.map.isPayment == true) {
                            $scope.hongbaoicon = 1;
                            $scope.iconhongbao = true;
                            if ($localStorage.hongbaoeveryday) {
                                $scope.hongbaoShow = true;
                                delete $localStorage.hongbaoeveryday;
                            }
                        } else {
                            $scope.iconhongbao = false;
                            $scope.hongbaoicon = 2;
                            $scope.hongbaoShow = false;
                        }
                        $localStorage.user.member.balance = data.map.balance;
                        $localStorage.user.member.free = data.map.free;
                        $localStorage.user.realName = data.map.realName;
                        $localStorage.user.member.realVerify = data.map.realVerify;
                        $localStorage.user.member.sex = data.map.sex;
                        $localStorage.user.member.unReadMsg = data.map.unReadMsg;
                        $localStorage.user.member.winterest = data.map.winterest;
                        $localStorage.user.member.wprincipal = data.map.wprincipal;
                        $scope.unclaimed = data.map.unclaimed;
                        $scope.rfid = data.map.afid;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case '领取奖励':
                    $scope.hongbao = {};
                    $scope.hongbao.amount = data.map.amount;
                    $('.activity-firend-hongbao').fadeIn(200);
                    $('.yaoqing').fadeOut(200);
                    break;
                case '有效红包':
                    if (data.success == true) {
                        $scope.youxiaohb = true;
                        $scope.hongbaoData = data.map;
                        $scope.iconhongbao = true;
                        if ($scope.hongbaoShow == false && $localStorage.hongbaoeveryday) {
                            $scope.hongbaoShow = true;
                            delete $localStorage.hongbaoeveryday;
                        }
                    } else {
                        $scope.youxiaohb = false;
                        if ($scope.iconhongbao == false) {
                            $scope.iconhongbao = false;
                        }
                    }
                    break;
                case '红包投资详情':
                    if (data.success) {
                        $scope.hongbaoShow = false;
                        $scope.hongbaoShow2 = false;
                        if (data.map.pid != -1) {
                            $state.go('investment', { pid: data.map.pid, cpid: $scope.activefid, uid: $scope.userOBJ.user.member.uid });
                        } else {
                            $state.go('main.bankBillList');
                        }
                    }
                    break;
                case '全部红包':
                    if (data.success) {
                        $scope.allHongBaoLength = data.map.list.filter(function (item) {
                            // 体验金过滤  
                            return item.type !== 3
                        }).length
                    }
                    break;
                case '我的体验金':
                    if (data.success) {
                        var tyjFilter = data.map.list.filter(function (item) {
                            return item.status === 0
                        })
                        var sum = 0
                        tyjFilter.forEach(function (item) {
                            sum += item.amount
                        })
                        $scope.allTYJ = sum
                    }
                    break;
                case '我的邀请':
                    if (data.success) {
                        $scope.invite = {
                            total: data.map.total,
                            investors: data.map.investors
                        }
                    }
                    break;
                case '持有中':
                    if (data.success) {
                        $scope.getInvestNumber = data.map.page.total
                    }
                    break;
                case '已还款':
                    if (data.success) {
                        $scope.gotInvestNumber = data.map.page.total
                    }
                    break;
            };
        });
        $scope.onClick = function (argument) {
            switch (argument) {
                case 'yes':
                    $filter('清空缓存')();
                    $state.go('dl');
                    $scope.hongbaoShow = false;
                    $scope.hongbaoShow2 = false;
                    break;
            };
        };
        $scope.gotoInvest = function (item) {
            $scope.hongbaoShow2 = false;
            $("body,html").css({ "overflow": "auto", "height": "auto" });
            resourceService.queryPost($scope, $filter('getUrl')('getUse'), {
                uid: $scope.userOBJ.user.member.uid,
                fid: item.id
            }, '红包投资详情');
            $scope.activefid = item.id;
        };
        $scope.lingqu = function () {
            resourceService.queryPost($scope, $filter('getUrl')('getTheRewards'), { uid: $localStorage.user.member.uid, afid: $scope.rfid }, '领取奖励');
        };
        $scope.lijiyaoqing = function () {
            if (isWeixin()) {
                $('.activity-firend-boxweixin').fadeIn(200);
            } else {
                $('.activity-firend-boxh5').fadeIn(200);
            }
        };
        $scope.copyShare = function () {
            var e = document.getElementById("shareurl");//对象是contents 
            e.select(); //选择对象 
            document.execCommand("Copy");
            $scope.isCopy = true;
            if (IsPC()) {
                $scope.isCopytext = '链接已复制';
            } else {
                $scope.isCopytext = '长按文字全选复制链接';
            }
            /*$timeout(function(){
                $('.activity-firend-boxh5').fadeOut(200);
                $scope.isCopy = false;
            },1000);*/
        };
        $scope.closeshareh5 = function () {
            $('.activity-firend-boxh5').fadeOut(200);
        }
        $scope.default = function (e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function () {
            $('.activity-firend-boxweixin').fadeOut(200);
        };
        $scope.closehongbao = function () {
            $('.activity-firend-hongbao').fadeOut(200);
        };
        var linkstr = "";
        if ($scope.user && $scope.user.mobilephone) {
            linkstr = '&recommCode=' + $scope.user.mobilephone;
        }
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '啄米理财，国企背景',
                desc: '注册就送618红包+99999体验金', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/zhuomireg?wap=true' + linkstr, // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '啄米理财，国企背景',
                desc: '注册就送618红包+99999体验金', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/zhuomireg?wap=true' + linkstr, // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '啄米理财，国企背景',
                desc: '注册就送618红包+99999体验金', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/zhuomireg?wap=true' + linkstr, // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '啄米理财，国企背景',
                desc: '注册就送618红包+99999体验金', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/zhuomireg?wap=true' + linkstr, // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '啄米理财，国企背景',
                desc: '注册就送618红包+99999体验金', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/zhuomireg?wap=true' + linkstr, // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
        });
    }
    ]);
})
