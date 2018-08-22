define(['jweixin', "app", 'filter', 'urlFilters', 'md5js', 'slider'], function (wx, app) {
    var rootApp = app;
    rootApp.config([
        '$compileProvider',
        function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|sms|jsmp):/);
            // Angular v1.2 之前使用 $compileProvider.urlSanitizationWhitelist(...)
        }
    ]);
    rootApp.factory('httpInterceptor', ['$q', '$injector', '$rootScope', function ($q, $injector, $rootScope) {
        $rootScope.version = '1.0.0';
        $rootScope.channel = '3';
        var httpInterceptor = {
            'responseError': function (response) {
                return $q.reject("response", response);
            },
            'response': function (response) {
                // response.headers["Access-Control-Allow-Origin"]= "*";
                // response.headers["Access-Control-Allow-Methods"]="POST";
                // response.headers["Access-Control-Allow-Headers"]="x-requested-with,content-type";
                return response;
            },
            'request': function (config) {
                config.headers['X-Requested-With'] = "XMLHttpRequest";
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                // config.headers['Content-Type'] = 'application/json; charset=UTF-8;';
                return config;
            },
            'requestError': function (config) {
                return $q.reject(config);
            }
        };
        return httpInterceptor;
    }]);
    rootApp.factory('isWeixin', function () {
        return function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }
    });
    rootApp.run([
        '$rootScope',
        '$state',
        '$stateParams',
        '$localStorage',
        '$templateCache',
        function ($rootScope, $state, $stateParams, $localStorage, $templateCache) {
            $localStorage.pathUrl = [];
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.maskHidde = false;
            $rootScope.maskError = false;
            $rootScope.appPath = '../';
            // var urlstr = window.location.href;
            // if (urlstr.split('.com').length < 2 || (urlstr.split('.com').length > 1 && urlstr.split('.com')[1] == "/")) {
            //     if (urlstr.substring(urlstr.length - 1, urlstr.length) == "/") {
            //         urlstr += "main/home";
            //     } else {
            //         urlstr += "/main/home";
            //     }
            // }
            // $.ajax({
            //     url: '/product/signWeChat.dos',
            //     type: 'post',
            //     data: { url: urlstr, version: '2.0.0', channel: '3' },
            //     success: function (data) {
            //         if (data.success) {
            //             wx.config({
            //                 debug: false,
            //                 appId: data.map.appid,
            //                 timestamp: data.map.timestamp,
            //                 nonceStr: data.map.noncestr,
            //                 signature: data.map.sign,
            //                 jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
            //             });
            //         };
            //     }
            // });
        }
    ])
    rootApp.config(function ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {
        //用于改变state时跳至顶部
        // $uiViewScrollProvider.userAnchorScroll();
        $locationProvider.html5Mode(true);
        var date = "?date=" + new Date().getTime();

        // 默认进入先重定向
        var param = function (obj) {
            var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };
        // Override $http service's default transformRequest = 改变request payload 中的传参类型=str
        $httpProvider.defaults.transformRequest = [function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
        $httpProvider.interceptors.push('httpInterceptor');

        $urlRouterProvider.otherwise('main/home');
        $stateProvider
            .state('main', {
                //abstract: true,
                url: '/main',
                templateUrl: 'template/page-home.html' + date
            })
            .state('main.home', {
                url: '/home',
                templateUrl: 'template/home.html' + date
            })
            .state('dl', {
                url: '/dl?returnurl',
                templateUrl: 'template/login/sign.html' + date
            })
            /*实名认证*/
            .state('certification', {
                url: '/certification?from',
                templateUrl: 'template/Certification/shiMingRengZheng.html' + date
            })
            /*静态页面*/
            .state('zhuce', {
                url: '/zhuce?recommPhone&myPhone&myToFrom&maskType?frompc&toWhere&recommCode',
                templateUrl: 'template/login/register.html' + date
            })
            // .state('newRegister', {
            //     url: '/newRegister?phone&from&recommPhone',
            //     templateUrl: 'template/pages/newRegister.html' + date
            // })
            //CP080
            // .state('CP080', {
            //     url: '/CP080',
            //     templateUrl: 'template/app/CP080.html' + date
            // })
            // .state('enroll', {
            //     url: '/enroll',
            //     templateUrl: 'template/login/enroll.html' + date
            // })
            // .state('whymeApp', {
            //     url: '/whymeApp',
            //     templateUrl: 'template/pages/whyme-app.html' + date
            // })
            .state('main.more', {
                url: '/more',
                templateUrl: 'template/pages/more.html' + date,
            })
            .state('GYWM', {
                url: '/GYWM',
                templateUrl: 'template/pages/GYWM.html' + date,
                controller: "GYWMCtrl"
            })
            
            .state('GYWM.ZJHY', {
                url: '/ZJHY?wap&active',
                templateUrl: 'template/pages/ZJHY.html' + date,
                // controller: "GYWMCtrl"
            })
            .state('GYWM.HYSJ', {
                url: '/HYSJ?wap&active',
                templateUrl: 'template/pages/HYSJ.html' + date,
                // controller: "HYSJCtrl"
            })
            .state('GYWM.LXWM', {
                url: '/LXWM?wap&active',
                templateUrl: 'template/pages/LXWM.html' + date,
                controller: "GYWMCtrl"
            })
            .state('GSJS', {
                url: '/GSJS?wap',
                templateUrl: 'template/pages/GSJS.html' + date
            })
            .state('GSJS-ios', {
                url: '/GSJS-ios?wap',
                templateUrl: 'template/pages/GSJS-ios.html' + date
            })
            // .state('GDJS',{
            //     url: '/GDJS?wap',
            //     templateUrl: 'template/pages/GDJS.html'+date
            // })
            // .state('GLTD', {
            //     url: '/GLTD?wap',
            //     templateUrl: 'template/pages/GLTD.html' + date
            // })
            .state('GSZZ', {
                url: '/GSZZ?wap',
                templateUrl: 'template/pages/GSZZ.html' + date
            })
            .state('GSZZ-ios', {
                url: '/GSZZ-ios?wap',
                templateUrl: 'template/pages/GSZZ-ios.html' + date
            })
            .state('WZGG', {
                url: '/WZGG?wap',
                templateUrl: 'template/pages/WZGG.html' + date
            })
            .state('GGXQ', {
                url: '/GGXQ?wap&artiId&from&active&type',
                templateUrl: 'template/pages/GGXQ.html' + date
            })
            // .state('YYYZ', {
            //     url: '/YYYZ?wap',
            //     templateUrl: 'template/pages/YYYZ.html' + date
            // })
            // .state('GQJG', {
            //     url: '/GQJG?wap',
            //     templateUrl: 'template/pages/GQJG.html' + date
            // })
            .state('YJFK', {
                url: '/YJFK',
                templateUrl: 'template/pages/YJFK.html' + date
            })
            //汇元资讯
            .state('HYZX',{
                url:'/HYZX?wap&active&type',
                templateUrl:'template/pages/HYZX.html' + date
            })
            //理财课堂
            .state('LCKT',{
                url:'/LCKT?wap&active&type',
                templateUrl:'template/pages/LCKT.html' + date
            })
            //常见问题
            .state('CJWT',{
                url:'/CJWT?wap',
                templateUrl:'template/pages/CJWT.html' + date
            })
            //认证注册
            .state('RZZC',{
                url:'/RZZC?wap',
                templateUrl:'template/pages/RZZC.html' + date
            })
            //账户安全
            .state('ZHAQ',{
                url:'/ZHAQ?wap',
                templateUrl:'template/pages/ZHAQ.html' + date
            })
            //充值提现
            .state('CZTX',{
                url:'/CZTX?wap',
                templateUrl:'template/pages/CZTX.html' + date
            })
            //投资福利
            .state('TZFL',{
                url:'/TZFL?wap',
                templateUrl:'template/pages/TZFL.html' + date
            })
            //产品介绍
            .state('CPJS',{
                url:'/CPJS?wap',
                templateUrl:'template/pages/CPJS.html' + date
            })
            //其他问题
            .state('other',{
                url:'/other?wap',
                templateUrl:'template/pages/other.html' + date
            })
            //信息披露
            .state('XXPL',{
                url:'/XXPL?wap',
                templateUrl:'template/pages/XXPL.html' + date
            })
            .state('realname', {
                url: '/realname',
                templateUrl: 'template/login/realname.html' + date
            })
            .state('password', {
                url: '/password',
                templateUrl: 'template/login/setpassword.html' + date
            })
            /*产品*/
            .state('newhand', {
                url: '/newhand?pid&uid&wap&app',
                templateUrl: 'template/newhand/newhand.html' + date
            })
            .state('newhandApp', {
                url: '/newhandApp?pid&uid&wap&app',
                templateUrl: 'template/newhand/newhandApp.html' + date
            })
            .state('cpDetail', {
                url: '/cpDetail?pid&uid&isShowRule&from&active',
                templateUrl: 'template/cp/cpDetail.html' + date
            })
            .state('aqbzDetail', {
                url: '/aqbzDetail?wap',
                templateUrl: 'template/cp/aqbz.html' + date,
                controller: "aqbzDetailCtrl"
            })
            .state('aqbzDetailApp', {
                url: '/aqbzDetailApp?wap',
                templateUrl: 'template/cp/aqbzApp.html' + date,
                controller: "aqbzDetailCtrl"
            })
            .state('investment', {
                url: '/investment?cpid&amt&pid&uid',
                templateUrl: 'template/cp/investment.html' + date
            })
            .state('investSuccess', {
                url: '/investSuccess',
                templateUrl: 'template/cp/investSuccess.html' + date,
                controller: "investSuccess"
            })
            .state('continuedInvest', {
                url: '/continuedInvest',
                templateUrl: 'template/cp/xutou.html' + date,
                controller: "continuedInvest"
            })
            .state('coupon', {
                url: '/coupon?cpid&amt',
                templateUrl: 'template/cp/coupon.html' + date
            })
            // 我的账户-体验金
            .state('myTyj', {
                url: '/myTyj',
                templateUrl: 'template/myaccount/myTyj.html' + date,
                controller: 'myTyjController'
            })
            // 体验金活动页
            // .state('tyj', {
            //     url: '/tyj?wap&uid',
            //     templateUrl: 'template/activity/tyj.html' + date,
            //     controller: 'tyjController'
            // })
            // 体验金注册成功页
            .state('tyjRegSuccess', {
                url: '/tyjRegSuccess',
                templateUrl: 'template/activity/tyjRegSuccess.html' + date,
                // controller:'tyjRegSuccessController'
            })
            // 体验金详情页
            .state('tyjdetail', {
                url: '/tyjdetail',
                templateUrl: 'template/cp/tyjdetail.html' + date,
                controller: 'tyjdetailController'
            })
            // 体验金投资成功页
            .state('tyjSuccess', {
                url: '/tyjSuccess',
                templateUrl: 'template/cp/tyjSuccess.html' + date,
                controller: 'tyjSuccessController'
            })
            //元旦活动
            .state('yuandanCtrl', {
                url: '/yuandanCtrl?uid&token&app',
                templateUrl: 'template/activityhy/yuandan.html' + date,
                controller: 'yuandanCtrl'
            })
           
            // 双蛋活动
            // .state('shuangdan', {
            //     url: '/shuangdan?wap&uid',
            //     templateUrl: 'template/activity/shuangdan.html' + date,
            //     controller: 'shuangdanController'
            // })
            // .state('shuangdanshare', {
            //     url: '/shuangdanshare?wap&uid',
            //     templateUrl: 'template/activity/shuangdanshare.html' + date,
            //     controller: 'shuangdanshareController'
            // })
            // .state('shuangdanshyd', {
            //     url: '/shuangdanshyd',
            //     templateUrl: 'template/activity/shuangdanshyd.html' + date
            // })
            // 年末豪礼投即送活动
            // 活动页
            // .state('tjs', {
            //     url: '/tjs?wap&uid',
            //     templateUrl: 'template/activity/tjs.html' + date,
            //     controller: 'tjsController'
            // })
            // 礼品预约
            // .state('giftyy', {
            //     url: '/giftyy?wap&id',
            //     templateUrl: 'template/activity/giftyy.html' + date,
            //     controller: 'giftyyController'
            // })
            // 投即送标的详情页
            // .state('tjsdetail', {
            //     url: '/tjsdetail?wap&pid&from',
            //     templateUrl: 'template/activity/tjsdetail.html' + date,
            //     controller: 'tjsdetailController'
            // })
            // 投即送确认投资页
            // .state('tjsinvestment', {
            //     url: '/tjsinvestment?wap&pid',
            //     templateUrl: 'template/activity/tjsinvestment.html' + date,
            //     controller: 'tjsinvestmentController'
            // })
            // 投即送投资成功页
            // .state('tjssuccess', {
            //     url: '/tjssuccess?wap',
            //     templateUrl: 'template/activity/tjssuccess.html' + date,
            //     controller: 'tjssuccessController'
            // })
            // 我的账户进入的投资即送
            // .state('mytjs', {
            //     url: '/mytjs?wap&uid',
            //     templateUrl: 'template/activity/mytjs.html' + date,
            //     controller: 'mytjsController'
            // })
            // 投即送-礼品心愿
            // .state('tjswish', {
            //     url: '/tjswish?wap&uid',
            //     templateUrl: 'template/activity/tjswish.html' + date,
            //     controller: 'tjswishController'
            // })
            // 填投即送地址
            // .state('tjsaddress', {
            //     url: '/tjsaddress?wap&investId&type',
            //     templateUrl: 'template/activity/tjsaddress.html' + date,
            //     controller: 'tjsaddressController'
            // })
            // 礼品详情页
            // .state('prizedetail', {
            //     url: '/prizedetail?wap',
            //     templateUrl: 'template/activity/prizedetail.html' + date,
            //     controller: 'prizedetailController'
            // })
            // 新闻发布会专题页
            // .state('conference', {
            //     url: '/conference?wap&currentv',
            //     templateUrl: 'template/activity/conference.html'+date,
            //     controller:'conferenceController'
            // })
            // 企业形象推广页
            // .state('promote', {
            //     url: '/promote?wap',
            //     templateUrl: 'template/activity/promote.html'+date,
            //     controller:'promoteController'
            // })
            //我的账户
            .state('main.myaccountHome', {
                url: '/myaccountHome',
                templateUrl: 'template/myaccount/account-home.html' + date
            })
            .state('main.bankBillList', {
                url: '/bankBillList',
                templateUrl: 'template/cp/invests-list.html' + date
            })
            // .state('hbopen', {
            //     url: '/hbopen',
            //     templateUrl: 'template/myaccount/my-hbopen.html' + date
            // })
            .state('investDetail', {
                url: '/investDetail',
                templateUrl: 'template/myaccount/invest-detail.html' + date
            })
            .state('investRecord', {
                url: '/investRecord',
                templateUrl: 'template/myaccount/invest-record.html' + date
            })
            .state('minxi', {
                url: '/minxi',
                templateUrl: 'template/myaccount/my-minxi.html' + date
            })
            .state('paybackDetail', {
                url: '/paybackDetail',
                templateUrl: 'template/myaccount/payback-detail.html' + date
            })
            .state('investProtocol', {
                url: '/investProtocol',
                templateUrl: 'template/myaccount/invest-investProtocol.html' + date
            })
            .state('myCoupon', {
                url: '/myCoupon?active',
                templateUrl: 'template/myaccount/myCoupon.html' + date
            })
            .state('myUselessCoupon', {
                url: '/myUselessCoupon',
                templateUrl: 'template/myaccount/myCoupon-useless.html' + date
            })
            .state('myAssets', {
                url: '/myAssets',
                templateUrl: 'template/myaccount/my-assets.html' + date
            })
            .state('myActivity', {
                url: '/myActivity',
                templateUrl: 'template/myaccount/my-activity.html' + date
            })
            .state('activityPerson', {
                url: '/activityPerson?id&wap',
                templateUrl: 'template/cp/activityPerson.html' + date
            })
            .state('myInvest', {
                url: '/myInvest?tab',
                templateUrl: 'template/myaccount/my-invest.html' + date
            })
            .state('myInvestDetail', {
                url: '/myInvestDetail?info',
                templateUrl: 'template/myaccount/my-invest-detail.html' + date
            })
            .state('mycashed', {
                url: '/mycashed?cashedId',
                templateUrl: 'template/myaccount/my-cashed.html' + date
            })
            //充值提现
            .state('recharge', {
                url: '/recharge?from',
                templateUrl: 'template/recharge/recharge.html' + date
            })
            .state('getCash', {
                url: '/getCash',
                templateUrl: 'template/recharge/get-cash.html' + date
            })
            .state('myInvitation', {
                url: '/myInvitation',
                templateUrl: 'template/myaccount/my-invitation.html' + date
            })
            .state('myInfo', {
                url: '/myInfo',
                templateUrl: 'template/myaccount/my-info.html' + date
            })
            .state('myBank', {
                url: '/myBank',
                templateUrl: 'template/myaccount/my-bank.html' + date
            })
            .state('myMessage', {
                url: '/myMessage',
                templateUrl: 'template/myaccount/my-message.html' + date
            })
            .state('znMessage', {
                url: '/znMessage',
                templateUrl: 'template/myaccount/zn-message.html' + date
            })
            .state('resetTradePwd', {
                url: '/resetTradePwd?firstset&amt&cpid',
                templateUrl: 'template/myaccount/reset-tradepwd.html' + date
            })
//          .state('findPwd', {
//              url: '/findPwd?forget',
//              templateUrl: 'template/myaccount/findPwd.html' + date
//          })
            .state('resetPwd', {
                url: '/resetPwd?forget',
                templateUrl: 'template/myaccount/reset-pwd.html' + date
            })
            .state('payPW', {
                url: '/payPW',
                templateUrl: 'template/recharge/payPassWord.html' + date
            })
            .state('inviteCenter', {
                url: '/inviteCenter',
                templateUrl: 'template/myaccount/inviteCenter.html' + date
            })
            // .state('getCashSuccess', {
            //     url: '/getCashSuccess',
            //     templateUrl: 'template/recharge/get-cash-success.html' + date
            // })
            // .state('triplegift', {
            //     url: '/triplegift',
            //     templateUrl: 'template/activity/triplegift.html' + date
            // })
            // .state('financing', {
            //     url: '/financing',
            //     templateUrl: 'template/activity/financing.html' + date
            // })
            // .state('spider', {
            //     url: '/spider',
            //     templateUrl: 'template/activity/spider-app.html' + date
            // })
            // .state('sendmask', {
            //     url: '/sendmask',
            //     templateUrl: 'template/activity/sendmask.html' + date
            // })
            // .state('aunt', {
            //     url: '/aunt',
            //     templateUrl: 'template/activity/aunt.html' + date
            // })
            // .state('telecom', {
            //     url: '/telecom',
            //     templateUrl: 'template/activity/telecom.html' + date
            // })
            // .state('rechargegift', {
            //     url: '/rechargegift',
            //     templateUrl: 'template/activity/rechargegift.html' + date
            // })
            // .state('ZJJL', {
            //     url: '/ZJJL',
            //     templateUrl: 'template/activity/ZJJL.html' + date
            // })
            // .state('invite', {
            //     url: '/invite',
            //     templateUrl: 'template/activity/invite.html' + date
            // })
            // .state('aqbz', {
            //     url: '/aqbz?wap',
            //     templateUrl: 'template/pages/AQBZ.html' + date
            // })
            // 渠道推广注册页
            // .state('newcomer', {
            //     url: '/newcomer?wap',
            //     templateUrl: 'template/pages/newcomer.html' + date
            // })
            // .state('flwhz', {
            //     url: '/flwhz',
            //     templateUrl: 'template/pages/flwhz.html' + date
            // })
            // .state('invite-rules', {
            //     url: '/invite-rules',
            //     templateUrl: 'template/activity/invite-rules.html' + date
            // })
            // .state('XSXQ', {
            //     url: '/XSXQ?wap',
            //     templateUrl: 'template/pages/XSXQ.html' + date
            // })
            // iPhone活动页
            // .state('special', {
            //     url: '/special?wap',
            //     templateUrl: 'template/activity/iPhone.html' + date,
            //     controller: 'iPhoneController'
            // })
            // .state('special', {
            //     url: '/special?wap',
            //     templateUrl: 'template/activity/special.html' + date
            // })
            // .state('iphonelist', {
            //     url: '/iphonelist?wap',
            //     templateUrl: 'template/activity/iphonelist.html' + date
            // })
            // .state('hlsbt', {
            //     url: '/hlsbt',
            //     templateUrl: 'template/activity/hlsbt.html' + date
            // })
            // .state('inviteFriend1', {
            //     url: '/inviteFriend1?wap&afid&uid',
            //     templateUrl: 'template/activity/inviteFriend1.html' + date,
            //     controller: 'inviteFriend1'
            // })
            // .state('inviteFriend2', {
            //     url: '/inviteFriend2?wap&afid&uid',
            //     templateUrl: 'template/activity/inviteFriend2.html' + date,
            //     controller: 'inviteFriend2'
            // })
            // .state('inviteFriend3', {
            //     url: '/inviteFriend3?wap&afid&uid',
            //     templateUrl: 'template/activity/inviteFriend3.html' + date,
            //     controller: 'inviteFriend3'
            // })
            // .state('inviteFriend4', {
            //     url: '/inviteFriend4?wap&afid&uid',
            //     templateUrl: 'template/activity/inviteFriend4.html' + date,
            //     controller: 'inviteFriend4'
            // })
            // .state('inviteFriend5', {
            //     url: '/inviteFriend5?wap&afid&uid',
            //     templateUrl: 'template/activity/inviteFriend5.html' + date,
            //     controller: 'inviteFriend5'
            // })
            // .state('inviteFriend6', {
            //     url: '/inviteFriend6?wap&afid&uid',
            //     templateUrl: 'template/activity/inviteFriend6.html' + date,
            //     controller: 'inviteFriend6'
            // })
            // .state('inviteFriendTri', {
            //     url: '/inviteFriendTri?wap&afid&uid',
            //     templateUrl: 'template/activity/inviteFriendTri.html' + date,
            //     controller: 'inviteFriendTri'
            // })
            // .state('friendreg', {
            //     url: '/friendreg?frompc&recommCode',
            //     templateUrl: 'template/activity/friendReg.html' + date,
            //     controller: 'friendregController'
            // })
            // .state('myMission', {
            //     url: '/myMission',
            //     templateUrl: 'template/myaccount/myMission.html' + date,
            //     controller: 'myMissionCtrl'
            // })
            // 活动聚合页
            .state('actList', {
                url: '/actList?wap&active',
                templateUrl: 'template/myaccount/actList.html' + date,
                controller: 'actListController'
            })
            //往期活动
            .state('actHistoryList', {
                url: '/actHistoryList?wap&active',
                templateUrl: 'template/myaccount/actHistoryList.html' + date,
                controller: 'actHistoryListController'
            })
            //邀请好友
            .state('inviteFri', {
                url: '/inviteFri?upgrade&wap&app',
                templateUrl: 'template/activityhy/inviteFriend.html' + date
            })
            //邀请好友App
            .state('inviteFriApp', {
                url: '/inviteFriApp?upgrade&wap&app',
                templateUrl: 'template/activityhy/inviteFriendApp.html' + date
            })
            //双十二活动
            .state('shuangSE', {
                url: '/shuangSE?upgrade&wap&app',
                templateUrl: 'template/activity/shaung12.html' + date
            })
            //圣诞活动
            .state('christmasCtrl', {
                url: '/christmasCtrl?upgrade&wap&app',
                templateUrl: 'template/activity/Christmas.html' + date
            })
            //云锐开发
            .state('yunrui', {
                url: '/yunrui',
                templateUrl: 'template/activityhy/yunrui.html' + date
            })
            //360导航
            .state('nav360', {
                url: '/nav360',
                templateUrl: 'template/activityhy/nav360.html' + date
            })
            //典典养车
            .state('ddyc', {
                url: '/ddyc',
                templateUrl: 'template/activityhy/ddyc.html' + date
            })
            //车点点
            .state('chediandian', {
                url: '/chediandian',
                templateUrl: 'template/activityhy/chediandian.html' + date
            })
            //
            // .state('appdownload', {
            //     url: '/appdownload',
            //     templateUrl: 'template/pages/appdownload.html' + date,
            //     controller: 'appdownload'
            // })
            // .state('app2download', {
            //     url: '/app2download',
            //     templateUrl: 'template/pages/app2download.html' + date,
            //     controller: 'app2download'
            // })
            // .state('carReg', {
            //     url: '/carReg',
            //     templateUrl: 'template/activity/carReg.html' + date,
            //     controller: 'controllerRegister'
            // })
            // .state('changcheng', {
            //     url: '/changcheng',
            //     templateUrl:'template/activity/changcheng.html'+date,
            //     controller:'controllerRegister'
            // })
            // .state('changcheng2', {
            //     url: '/changcheng2',
            //     templateUrl:'template/activity/changcheng2.html'+date,
            //     controller:'changcheng2Controller'
            // })
            // .state('yuebiao', {
            //     url: '/yuebiao?prid&name&toState&pid',
            //     templateUrl: 'template/activity/yuebiao.html' + date,
            //     controller: 'yuebiaoCtrl'
            // })
            // .state('fanli', {
            //     url: '/fanli?toFrom',
            //     templateUrl: 'template/activity/fanli.html' + date,
            //     controller: 'fanliCtrl'
            // })
            // 新年活动页
            // .state('newyear', {
            //     url: '/newyear?wap&uid',
            //     templateUrl: 'template/activity/newyear.html' + date,
            //     controller: 'newyearController'
            // })
            // 新年活动一
            // .state('newyearact1', {
            //     url: '/newyearact1?wap&uid',
            //     templateUrl: 'template/activity/newyearact1.html' + date,
            //     controller: 'newyearact1Controller'
            // })
            // 新年活动分享页
            // .state('newyearshare', {
            //     url: '/newyearshare?wap&uid&phone&recommPhone',
            //     templateUrl: 'template/activity/newyearshare.html' + date,
            //     controller: 'newyearshareController'
            // })
            // 媒体报道
            // .state('report', {
            //     url: '/report?page&wap',
            //     templateUrl: 'template/pages/report.html' + date,
            //     controller: 'reportController'
            // })
            // 元宵活动
            // .state('yuanxiao', {
            //     url: '/yuanxiao?wap&uid',
            //     templateUrl: 'template/activity/yuanxiao.html' + date,
            //     controller: 'yuanxiaoController'
            // })
            // 新手标推广页
            // .state('newhandreg', {
            //     url: '/newhandreg?wap',
            //     templateUrl: 'template/newhand/newhandreg.html'+date,
            //     controller:'newhandregController'
            // })
            // 新体验金推广页（外）
            // .state('newtyj', {
            //     url: '/newtyj?wap&uid',
            //     templateUrl: 'template/activity/newtyj.html' + date,
            //     controller: 'newtyjController'
            // })
            // iPhone7推广页
            // .state('iPhonead', {
            //     url: '/iPhonead?wap',
            //     templateUrl: 'template/activity/iPhonead.html' + date,
            //     controller: 'iPhoneadController'
            // })
            // 垂直管理推广页
            // .state('czglad', {
            //     url: '/czglad?wap',
            //     templateUrl: 'template/activity/czglad.html'+date,
            //     controller:'czgladController'
            // })
            // 投即送推广页
            // .state('tjsad', {
            //     url: '/tjsad?wap',
            //     templateUrl: 'template/activity/tjsad.html' + date,
            //     controller: 'tjsadController'
            // })
            // 开放日报名页
            // .state('kfrEnrol', {
            //     url: '/kfrEnrol?wap&openDayId',
            //     templateUrl: 'template/myaccount/kfr-enrol.html' + date,
            //     controller: 'kfrEnrolController'
            // })
            // 优惠券温馨提示
            .state('reminder', {
                url: '/reminder?wap',
                templateUrl: 'template/myaccount/reminder.html' + date,
                controller: 'reminderController'
            })
            // app2.0翻牌
            // .state('app2lottery', {
            //     url: '/app2lottery?wap&version&uid&channel',
            //     templateUrl: 'template/activity/app2lottery.html' + date,
            //     controller: 'app2lotteryController'
            // })
            // 小米推广页
            // .state('xiaomiad', {
            //     url: '/xiaomiad?wap&uid&channel&version',
            //     templateUrl: 'template/activity/xiaomiad.html' + date,
            //     controller: 'xiaomiadController'
            // })
            // 开放日活动页
            // .state('openday', {
            //     url: '/openday?wap',
            //     templateUrl: 'template/activity/openday.html' + date,
            //     controller: 'opendayController'
            // })
            // 公益活动页
            // .state('publicWelfare', {
            //     url: '/publicWelfare?wap&id',
            //     templateUrl: 'template/activity/publicWelfare.html' + date,
            //     controller: 'publicWelfareController'
            // })
            // 新体验金推广页(内)
            // .state('newtyj2', {
            //     url: '/newtyj2?wap&uid',
            //     templateUrl: 'template/activity/newtyj2.html' + date,
            //     controller: 'newtyj2Controller'
            // })
            // 518理财节
            // .state('festival518', {
            //     url: '/festival518?wap&uid',
            //     templateUrl: 'template/activity/festival518.html' + date,
            //     controller: 'festival518Controller'
            // })
            // 企融计划列表页
            // .state('normalcplist', {
            //     url: '/normalcplist',
            //     templateUrl: 'template/cp/normalcplist.html' + date,
            //     controller: 'normalcplistController'
            // })
            // 已募集企融计划列表页
            .state('pastcplist', {
                url: '/pastcplist?active',
                templateUrl: 'template/cp/pastcplist.html' + date,
                controller: 'pastcplistController'
            })
            // 活动标列表页
            .state('activitycplist', {
                url: '/activitycplist',
                templateUrl: 'template/cp/activitycplist.html' + date,
                controller: 'activitycplistController'
            })
            // 新手注册
            .state('hongyareg', {
                url: '/zhuomireg?toFrom&tid&phone',
                templateUrl: 'template/activityhy/reg.html' + date,
                // controller: 'hongyaregCtrl'
            })
            //chedaojiayou 渠道推广
            // .state('oilReg', {
            //     url: '/oilReg',
            //     templateUrl: 'template/activityhy/reg_oil.html' + date,
            // })
            //小米运动 渠道推广
            // .state('xiaomiReg', {
            //     url: '/xiaomiReg',
            //     templateUrl: 'template/activityhy/reg_xiaomi.html' + date,
            // })
            // xiaomiyundong 渠道推广
            // .state('xmydReg1', {
            //     url: '/xmydReg1',
            //     templateUrl: 'template/activityhy/reg_xmyd1.html' + date,
            // })
            // .state('xmydReg2', {
            //     url: '/xmydReg2',
            //     templateUrl: 'template/activityhy/reg_xmyd2.html' + date,
            // })
            // 头条推广
            // .state('jinritoutiao', {
            //     url: '/jinritoutiao',
            //     templateUrl: 'template/activityhy/toutiao.html' + date,
            // })
            // 车点点
            // .state('chediandian', {
            //     url: '/chediandian',
            //     templateUrl: 'template/activityhy/reg_cdd.html' + date,
            // })
            // 新手注册
            .state('inviteReg', {
                url: '/inviteReg?toFrom&tid&invitePerson&app',
                templateUrl: 'template/activityhy/inviteReg.html' + date,
            })
            // 邀请活动
            .state('hongyainvite', {
                url: '/zhuomiinvite?toFrom&wap',
                templateUrl: 'template/activityhy/invite.html' + date,
            })
            // 下载页面
            .state('zhuomidownload', {
                url: '/zhuomidownload',
                templateUrl: 'template/activityhy/download.html' + date,
            })
            // 体验金注册成功页
            .state('tyjRegSuccess2', {
                url: '/tyjRegSuccess2',
                templateUrl: 'template/activity/tyjRegSuccess2.html' + date,
            })
            // 投资月
            // .state('hongyatouziyue', {
            //     url: '/hongyatouziyue?wap&uid&app',
            //     templateUrl: 'template/activityhy/touziyue.html' + date,
            // })
            // 0710加息活动
            // .state('hongyajiaxi', {
            //     url: '/hongyajiaxi?wap',
            //     templateUrl: 'template/activityhy/jiaxi.html' + date,
            // })
            // 闰6月活动
            // .state('hongyarunyue', {
            //     url: '/hongyarunyue?wap&uid&token',
            //     templateUrl: 'template/activityhy/runyue.html' + date,
            // })
            // 8月红包月活动
            // .state('hongyahongbaoyu', {
            //     url: '/hongyahongbaoyu?wap&uid&token',
            //     templateUrl: 'template/activityhy/hongbaoyu.html' + date,
            // })
            // .state('hongyaAugust', {
            //     url: '/hongyaAugust?wap&uid&token',
            //     templateUrl: 'template/activityhy/august.html' + date,
            // })
            // .state('hongyaqixi', {
            //     url: '/hongyaqixi?wap&uid&token',
            //     templateUrl: 'template/activityhy/qixi.html' + date,
            // })
            // .state('hongyaFanA', {
            //     url: '/hongyaFanA?wap&uid&token',
            //     templateUrl: 'template/activityhy/fan_a.html' + date,
            // })
            //////////////////////////////////////////////////////////
            //活动
            .state('zmBackCash', {
                url: '/zmBackCash?wap&uid&token',
                templateUrl: 'template/zmActive/zmInvite.html' + date
            })
            //车到加油
            .state('chedaoReg', {
                url: '/chedaoReg',
                templateUrl: 'template/zmChannel/chedao.html' + date
            })
            // CHEDIANDIAN
            .state('chediandianReg', {
                url: '/chediandianReg',
                templateUrl: 'template/zmChannel/chediandian.html' + date
            })
    })
    /*---------------------------Banner-----------------------------------*/
    rootApp.directive(
        'myBanner',
        function () {
            var temp = '<div class="swiper-container swiper-container-h" style="width:100%;">' +
                '<div class="swiper-wrapper">' +
                '</div>' +
                '<div class="swiper-pagination swiper-pagination-h"></div>' +
                '</div>';
            return {
                restrict: 'E',
                template: temp,
                replace: true,
                scope: {
                    banner: '='
                },
                controller: [
                    '$scope',
                    '$state',
                    'resourceService',
                    '$filter',
                    '$timeout',
                    '$element',
                    '$stateParams',
                    '$localStorage',
                    '$compile',
                    function ($scope, $state, resourceService, $filter, $timeout, $element,$stateParams, $localStorage, $compile) {
                        if ($localStorage.user != undefined) {
                            $scope.userId = '&uid=' + $localStorage.user.member.uid;
                            $scope.token = '&token=' + $localStorage.user.token;
                        } else { $scope.userId = '';$scope.token = ''; };
                        var str = "";
                        $scope.$watch(function () { return $scope.banner }, function (n, o) {
                            if (n && n.length > 0) {
                                for (var i = 0; i < n.length; i++) {
                                    str += '<div class="swiper-slide"><a target="_blank" href="' + n[i].location + "&wap=true" + $scope.userId + $scope.token +'"><img ng-src="' + n[i].imgUrl + '" alt=""></a></div>';
                                }
//                              console.log($scope.token);
                                $element[0].childNodes[0].innerHTML = str;
                                $compile($element[0].childNodes[0])($scope);
                                $timeout(function () {
                                    swiperH = new Swiper('.swiper-container-h', {
                                        pagination: '.swiper-pagination-h',
                                        paginationClickable: true,
                                        loop:true,
                                        autoplay:2000,
                                        // spaceBetween: 50,
                                        preventClicks: false
                                    });
                                });
                            }
                        })
                    }],
            };
        }
    );
    rootApp.directive('scroll', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'template/find-active.html',
            scope: {
                data: '='
            },
            link: function ($scope, element, attrs) {
                $scope.init = function () {
                    $timeout(function () {
                        var swiper = new Swiper('.active-swiper', {
                            pagination: '.swiper-pagination',
                            paginationClickable: true,
                            centeredSlides: true,
                            autoplay:2000,
                            loop:true,
							effect: 'slide'
                        })
                    }, 0)
                }
            }
        }
    }])
    rootApp.directive('repeatFinish', function () {
        return {
            link: function (scope, element, attr) {
                if (scope.$last && scope.data) {
                    scope.$parent.init()
                }
            }
        }
    })
    rootApp.directive(
        'ngSwiper',
        function () {
            var temp = '<div class="swiper-container {{ngSwiper.name}}" ng-transclude>' +

                '</div>';
            return {
                restrict: 'A',
                template: temp,
                replace: true,
                scope: {
                    ngSwiperConf: '=',
                    ngSwiper: "="
                },
                transclude: true,
                controller: [
                    '$scope',
                    '$timeout',
                    '$element',
                    '$compile',
                    function ($scope, $timeout, $element, $compile) {
                        $scope.ngSwiper.initSwiper = function () {
                            $timeout(function () {
                                $scope.ngSwiper.swiper = new Swiper("." + $scope.ngSwiper.name, $scope.ngSwiperConf);
                            });
                        }
                        if ($scope.ngSwiper.readyLoading) {
                            $scope.ngSwiper.initSwiper();
                        }
                    }
                ],
            };
        });
    /*进度条*/
    rootApp.directive(
        'myCirclePlan',
        function () {
            var temp = '<div class="prg-cont rad-prg" id="progress">12</div>'
            return {
                restrict: 'E',
                // templateUrl:'template/cp/cpTpl.html',
                template: temp,
                replace: false,
                transclude: true,
                scope: true,
                controller: [
                    '$scope',
                    '$state',
                    'resourceService',
                    '$filter',
                    '$element',
                    function ($scope, $state, resourceService, $filter, $element) {

                        $('#progress1').radialIndicator({
                            initValue: 10,
                            displayNumber: false
                        });
                    }],
            };
        }
    );
    /*刮刮卡*/
    rootApp.directive(
        'ggk',
        function () {
            var temp = '<div id="scratch">' +
                '<div id="card">￥5000000元</div>' +
                '</div>'
            return {
                restrict: 'E',
                // templateUrl:'template/cp/cpTpl.html',
                template: temp,
                replace: false,
                transclude: true,
                scope: true,
                controller: [
                    '$scope',
                    '$state',
                    'resourceService',
                    '$filter',
                    '$element',
                    function ($scope, $state, resourceService, $filter, $element) {
                        // console.log(LuckyCard);
                    }],
            };
        }
    );

    // 提现金额小于余额
    rootApp.directive('withdrawlimit', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {

                ngModelController.$parsers.unshift(function (viewVal) {
                    if (viewVal == '') {
                        ngModelController.$setValidity("withdrawlimit", true);
                        return viewVal;
                    }
                    if (viewVal <= scope.cash.funds) {
                        ngModelController.$setValidity("withdrawlimit", true);
                        return viewVal;
                    }
                    else {
                        ngModelController.$setValidity("withdrawlimit", false);
                        return undefined;
                    }
                    // if (scope.cash.funds <= 100000) {
                    // } else {
                    //     ngModelController.$setValidity("withdrawlimit", true);
                    //     return viewVal;
                    // }
                })
            }
        }
    });

    // 提现金额单笔最高限额
    rootApp.directive('maxlimit', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {

                ngModelController.$parsers.unshift(function (viewVal) {
                    if (scope.cash.funds > 5000000) {
                        if (viewVal == '' || scope.cashForm.cash.$error.withdrawlimit) {
                            ngModelController.$setValidity("maxlimit", true);
                            return viewVal;
                        }
                        if (viewVal <= 5000000) {
                            ngModelController.$setValidity("maxlimit", true);
                            return viewVal;
                        }
                        else {
                            ngModelController.$setValidity("maxlimit", false);
                            return undefined;
                        }
                    } else {
                        ngModelController.$setValidity("maxlimit", true);
                        return viewVal;
                    }
                });
            }
        };
    });

    // 输入金额大于1
    rootApp.directive('morethan', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {
                ngModelController.$parsers.unshift(function (viewVal) {
                    if (viewVal == '') {
                        ngModelController.$setValidity("morethan", true);
                        return viewVal;
                    }
                    if (viewVal >= 1) {
                        ngModelController.$setValidity("morethan", true);
                        return viewVal;
                    } else {
                        ngModelController.$setValidity("morethan", false);
                        return undefined;
                    }
                });
            }
        };
    });

    rootApp.directive('morethan3', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {
                ngModelController.$parsers.unshift(function (viewVal) {
                    if (viewVal == '') {
                        ngModelController.$setValidity("morethan3", true);
                        return viewVal;
                    }
                    if (viewVal >= 3) {
                        ngModelController.$setValidity("morethan3", true);
                        return viewVal;
                    } else {
                        ngModelController.$setValidity("morethan3", false);
                        return undefined;
                    }
                });
            }
        };
    });

    rootApp.directive('more3', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {
                ngModelController.$parsers.unshift(function (viewVal) {
                    if (viewVal == '') {
                        ngModelController.$setValidity("more3", true);
                        return viewVal;
                    }
                    if (viewVal >= 3) {
                        ngModelController.$setValidity("more3", true);
                        return viewVal;
                    } else {
                        ngModelController.$setValidity("more3", false);
                        return undefined;
                    }
                });
            }
        };
    });

    // 充值金额小于单笔限额
    rootApp.directive('rechargelimit', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {
                ngModelController.$parsers.unshift(function (viewVal) {
                    if (viewVal == '') {
                        ngModelController.$setValidity("rechargelimit", true);
                        return viewVal;
                    }
                    if (viewVal <= scope.recharge.singleQuota) {
                        ngModelController.$setValidity("rechargelimit", true);
                        return viewVal;
                    } else {
                        ngModelController.$setValidity("rechargelimit", false);
                        return undefined;
                    }
                });
            }
        };
    });
    //普通标
//  rootApp.directive('ring', function () {
//          return {
//              restrict: 'A',
//              scope: true,
//              link: function ($scope, element, attrs) {
//                  var width = $(element).width();
//
//                  if (attrs.color == 'blue') {
//                      var startColor = '#fff800'; //新手
//                      var endColor = '#fff800';
//                  } else {
//                      var startColor = '#fff800';
//                      var endColor = '#fff800';
//                  }
//                  var config = {
//                      width: width,
//                      radius: ($scope.radius - 8) / 2,
//                      barWidth: 1,
//                      startColor: startColor,
//                      endColor: endColor,
//                      barBgColor: '#ffffff',
//                      percentage: true,
//                      displayNumber: true,
//                      fontSize: 10,
//                      fontWeight: 'lighter',
//                      roundCorner: false,
//                      initValue: 0,
//                      interpolate: true,
//                      barColor: '#ffffff',
//                      frameTime: (1000 / attrs.progress)
//                  }
//                  if (attrs.progress >= 100) {
//
//                      config.initValue = 100;
//                      config.barColor = '#fff800';
//                      config.startColor = '#fff800';
//                      config.endColor = '#fff800';
//                  }
//                  else if (attrs.progress <= 0) {
//                      config.roundCorner = false;
//                  }
//                  var radialObj = $(element).linearIndicator(config).data('linearIndicator');
//                  radialObj.animate(attrs.progress);
//              }
//          }
//      })
    /*rootApp.directive('ring', ['$timeout', function ($timeout) {
        return {
            restrict: 'AE',
            scope: {
                data: '@'
            },
            link: function ($scope, element, attrs) {
                $timeout(function () {
                    var ctx = element[0].getContext('2d')
                    var center = 56
//                  var rad = Math.PI * 2 / 100
//                  var grad = ctx.createLinearGradient(56, 0, 0, 0)
					var grad = ctx.createLinearGradient(0, 0, 56, 0)
                    grad.addColorStop(0, '#fdb73e')
                    grad.addColorStop(1, '#fc764d')
                    var speed = 0

                    function bgCircle() {
                        ctx.save()
                        ctx.beginPath()
                        ctx.lineWidth = 2
                        ctx.strokeStyle = "#e8e8e8";
                        //ctx.arc(center, center, 53, 0, Math.PI * 2, false)//画圆或者圆弧
                        ctx.stroke()
                        ctx.closePath()
                        ctx.restore()
                    }
                    function activeCircle(n) {
                        ctx.save()
                        ctx.strokeStyle = grad
                        ctx.lineWidth = 2
                        ctx.beginPath()
                        //ctx.arc(center, center, 53, -Math.PI / 2, -Math.PI / 2 + n * rad, false)
                        ctx.stroke()
                        ctx.closePath()
                        ctx.restore()
                    }
                    function text(n) {
                        ctx.save()
                        ctx.beginPath()
                        ctx.fillStyle = "#f06043"
                        ctx.font = "0.8125rem '微软雅黑'"
//                      ctx.textAlign = 'center'
						ctx.textAlign = 'end'
                        ctx.textBaseline = "middle"
                        ctx.fillText(n + '%', center, center)
                        ctx.stroke()
                        ctx.closePath()
                        ctx.restore()
                    }
                    (function drawFrame() {
                        var animatId = window.requestAnimationFrame(drawFrame, element[0])
                        ctx.clearRect(0, 0, center * 2, center * 2)
                        bgCircle()
                        text(speed)
                        activeCircle(speed)
                        if (speed >= parseInt($scope.data)) {
                            speed = 0
                            window.cancelAnimationFrame(animatId)
                        }
                        speed += 1;
                    }())
                }, 10)
            }
        }
    }])*/
    // -----------------------------------------------server---------------------------------------------//
    rootApp.directive('getdate', function () {
        return {
            restrict: 'E',
            scope: {
                type: '@'
            },
            templateUrl: 'template/getDate.html',
            replace: true,
            link: function (scope, el, attrs) {
                console.log(scope.type)
                var now = new Date()
                var day = {
                    0: '星期日',
                    1: '星期一',
                    2: '星期二',
                    3: '星期三',
                    4: '星期四',
                    5: '星期五',
                    6: '星期六'
                }
                scope.date = now.getDate()
                scope.day = day[now.getDay()]
            }
        }
    })
    rootApp.factory(
        'resourceService',
        ['$state', '$resource', '$http', '$rootScope', 'ngDialog', '$filter', '$localStorage', 'md5', '$location', function ($state, $resource, $http, $rootScope, ngDialog, $filter, $localStorage, md5, $location) {
            return new resourceService($resource, $http, $state, $rootScope, ngDialog, $filter, $localStorage, md5, $location);
        }]);
    function resourceService(resource, http, $state, $rootScope, ngDialog, $filter, $localStorage, md5, $location) {
        var actions = {
            'query': {
                method: 'GET'
            },
            'queryPost': {
                method: 'POST'
            },
            'toJsonP': {
                method: 'JSONP'
            }
        };
        //加载json模板页面
        this.getJsonPServer = function (scope, url, data, type) {
            showMask($rootScope);
            var queryResource = resource(url, {}, actions);
            queryResource.toJsonP(data, function (data) {
                removeMask($rootScope);
                scope.$broadcast('resourceService_GET_JSON.MYEVENT', data, type);
            }, function (error) {
                removeMask($rootScope);
                $filter('errorUserMessages')('netErro', ngDialog, scope);
            });
        };//加载json模板页面
        this.getJsonServer = function (scope, url, data, type) {
            showMask($rootScope);
            var queryResource = resource(url, {}, actions);
            queryResource.query(data, function (data) {
                removeMask($rootScope);
                scope.$broadcast('resourceService_GET_JSON.MYEVENT', data, type);
            }, function (error) {
                removeMask($rootScope);
                $filter('errorUserMessages')('netErro', ngDialog, scope);
            });
        };
        //查找
        this.queryPost = function (scope, url, data, type) {
            scope.submitBool = false;
            showMask($rootScope);
            /*临时改变时间*/
            var queryResource = resource(url, {}, actions);
            if (!data.version) {
                data.version = $rootScope.version;
            }
            if (!data.channel) {
                data.channel = $rootScope.channel;
            }
            if (!data.token) {
                data.token = $filter('isRegister')().user.token;
            }
            if (data.passWord != undefined) {
                data.passWord = hex_sha256(md5.createHash(data.passWord || ''));
            }
            if (data.tpwd != undefined) {
                data.tpwd = hex_sha256(md5.createHash(data.tpwd || ''));
            }
            if (data.tpw != undefined) {
                data.tpw = hex_sha256(md5.createHash(data.tpw || ''));
            }
            if (data.pwd != undefined) {
                data.pwd = hex_sha256(md5.createHash(data.pwd || ''));
            }
            queryResource.queryPost(data, function (data) {
                scope.submitBool = true;
                removeMask($rootScope);
                if (data.success) {
                    scope.$broadcast('resourceService.QUERY_POST_MYEVENT', data, type);
                } else {
                    if (data.errorCode == '9999') {
                        // $state.go('404');
                        $filter('服务器信息')(data.errorCode, scope, 'y');
                        scope.onClick = function (type) {
                            if (type == 'yes') {
                                delete $localStorage.user;
                                ngDialog.close();
                                $state.go('main.home');
                            }
                        }
                    } else if (data.errorCode == '9998') {
                        $filter('实名认证错误信息')(data.errorCode, scope, 'y');
                        scope.onClick = function (type) {
                            if (type == 'yes') {
                                delete $localStorage.user;
                                ngDialog.close();
                                $state.go('dl');
                            }
                        }
                    }
                    else if (data.errorCode == 'XTWH') {
                        window.location.href = 'http://wap.huiyuanjinfu.com/template/pages/maintenance.html';
                    }
                    else {
                        scope.$broadcast('resourceService.QUERY_POST_MYEVENT', data, type);
                    }
                }
            }, function (error) {
                removeMask($rootScope);
            });
        };
        /******静态调结束*******/
        function showMask(rootSp) {
            rootSp.maskHidde = true;
        };
        function removeMask(rootSp) {
            rootSp.maskHidde = false;
        };
    };
    // 微信签名
    rootApp.factory('signWeChatService', function () {
        return function () {
            var urlstr = window.location.href;
            if (urlstr.split('.com').length < 2 || (urlstr.split('.com').length > 1 && urlstr.split('.com')[1] == "/")) {
                if (urlstr.substring(urlstr.length - 1, urlstr.length) == "/") {
                    urlstr += "main/home";
                } else {
                    urlstr += "/main/home";
                }
            };
            $.ajax({
                url: '/product/signWeChat.dos',
                type: 'post',
                data: { url: urlstr, version: '2.0.0', channel: '3' },
                success: function (data) {
                    if (data.success) {
                        wx.config({
                            debug: false,
                            appId: data.map.appid,
                            timestamp: data.map.timestamp,
                            nonceStr: data.map.noncestr,
                            signature: data.map.sign,
                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
                        });
                    };
                }
            });
        }
    })
});


