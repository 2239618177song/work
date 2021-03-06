/* 
 * @Author: lee
 * @Date:   2016-01-10 23:29:04
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-01-12 21:49:52
 */

define([
    'jweixin', 'webappControllers', 'jquery', 'ngdialog', 'SHR256'
    // ,'weixin'
], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('chedaoController', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', 'signWeChatService', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, signWeChatService) {
        // signWeChatService();
        $scope.protocol = $filter('protocolFilter')()
        if ($filter('isRegister')().register) {
            $scope.user = $filter('isRegister')().user.member;
        }
        $rootScope.title = '新用户注册';
        $scope.login = {};
        $scope.changchengclick = function (i) {
            resourceService.queryPost($scope, $filter('getUrl')('getUse'), { deadline: i }, { name: '长城宽带' });
        }
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: $(".changcheng-reg").offset().top });
        };
        // 图形验证码
        var changeIMG = function (event) { //换图片验证码
            if (event != undefined) {
                event.currentTarget.src += '?' + new Date().getTime();
            } else {
                if ($('.img-box img')[0] != undefined) {
                    $('.img-box img')[0].src += '?' + new Date().getTime();
                }
            }
        };
        changeIMG();
        $scope.clickInput = function (event) {
            // $scope.userLogin.picCode = null;
            changePicEvent = event;
            changeIMG(changePicEvent);
        };
        $scope.passwordText = false;
        $scope.isSubMin = false;
        $scope.nowTimer = "获取验证码";
        var changePicEvent;
        var targetFrom;
        if ($location.$$search.frompc) { $scope.frompc = $location.$$search.frompc; }
        var isSub = true;
        $scope.isImgCode = true;
        $scope.zuce = function (tegForm) {
            $scope.login.toFrom = 'chedao'
            if (tegForm.$valid) {
                if ($scope.login.passWord.length > 5) {
                    if (isSub) {
                        isSub = false;
                        resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                    }
                }
            } else {
                if (tegForm.mobilephone.$invalid) {
                    $rootScope.errorText = '请正确填写手机号码';
                } else if (tegForm.picCode.$invalid) {
                    $rootScope.errorText = '请正确填写图形验证码';
                } else if (tegForm.smsCode.$invalid) {
                    $rootScope.errorText = '请正确填写短信验证码';
                } else if (tegForm.passWord.$invalid) {
                    if (tegForm.passWord.$error.pattern) {
                        $rootScope.errorText = '密码为6-18位字母数字混合';
                    } else {
                        $rootScope.errorText = '请正确填写密码';
                    }
                } else {
                    $rootScope.errorText = '请正确填写以上信息';
                }
                $rootScope.maskError = true;
            }
        }
        $scope.showPassword = function (passwordTextBool) {
            if (passwordTextBool) {
                $scope.passwordText = false;
            } else {
                $scope.passwordText = true;
            }
        }
        $scope.isSubMin = true;
        $scope.hasPhone = false;
        $scope.getyzm = function (tegForm) {
            targetFrom = tegForm;
            if ($scope.isSubMin == true) {
                if ($scope.isImgCode == true) {
                    if (tegForm.mobilephone.$error.required == true) {
                        $rootScope.errorText = '请输入需验证的手机号码';
                        $rootScope.maskError = true;
                    }
                    else if (tegForm.mobilephone.$valid == false) {
                        $rootScope.errorText = '请输入正确的手机号码';
                        $rootScope.maskError = true;
                    }
                    else if ($scope.hasPhone == true) {
                        $rootScope.errorText = '此手机已注册';
                        $rootScope.maskError = true;
                    }
                    else if (tegForm.picCode.$error.required == true) {
                        $rootScope.errorText = '请输入图形码';
                        $rootScope.maskError = true;
                    }
                    else if (tegForm.picCode.$valid == false) {
                        $rootScope.errorText = '请输入正确的图形码';
                        $rootScope.maskError = true;
                    }
                    else {
                        resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                            mobilephone: $scope.login.mobilephone,
                            picCode: $scope.login.picCode,
                            // 有图形码时设置isPic为true，没有不设置
                            isPic: true
                        }, { name: '获取验证码', tegForm: tegForm });

                        // resourceService.queryPost($scope, $filter('getUrl')('验证图形码'), {
                        //     mobilephone: $scope.login.mobilephone,
                        //     picCode: $scope.login.picCode
                        // }, { name: '验证图形码' });
                    }
                }
                else {
                    $scope.login.picCode = '';
                    $scope.isImgCode = true;
                    changeIMG();
                    $rootScope.errorText = '请重新输入图形码';
                    $rootScope.maskError = true;
                }
            }
        };
        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            changeIMG();
        };
        $scope.toback = function () {
            $filter('跳回上一页')();
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '获取验证码':
                    if (data.success == true) {
                        $filter('60秒倒计时')($scope, 120);
                        $scope.isImgCode = false;
                        $rootScope.errorText = '验证码发送成功';
                        $rootScope.maskError = true;
                    } else if (data.errorCode == '1006') {
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    } else {
                        // $scope.stop();
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $rootScope.errorText = '此手机已注册';
                            $rootScope.maskError = true;
                            $scope.hasPhone = true;
                        } else {
                            $scope.hasPhone = false;
                        };
                    }
                    break;
                case '验证图形码':
                    if (data.success) {
                        if (data.map) { //图形码验证失败
                            $rootScope.errorText = '请输入正确的图形码';
                            $rootScope.maskError = true;
                        }
                        else if ($scope.isSubMin) {
                            resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                                mobilephone: $scope.login.mobilephone,
                                picCode: $scope.login.picCode
                            }, { name: '获取验证码', tegForm: tegForm });
                            $filter('60秒倒计时')($scope, 120);
                        }
                    }
                    break;
                case '注册':
                    isSub = true;
                    if (data.success) {
                        $localStorage.user = data.map;
                        // _hmt.push(['_trackPageview', '/maidian/zccg']);
                        // _hmt.push(['_trackPageview', '/mian/myCoupon']);                        
                        // $state.go('tyjRegSuccess2');
                        window.location.href = window.location.origin + (window.location.port != '' ? ':' + window.location.port : '') + '/tyjRegSuccess2'
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.login.passWord = '';
                    };
                    break;
                case '长城宽带':
                    $state.go("cpDetail", { pid: data.map.pid });
                    break;
            };
        });
        var linkstr = "";
        if ($stateParams.toFrom) {
            linkstr = '&toFrom=' + $stateParams.toFrom;
        } else if ($scope.user && $scope.user.mobilephone) {
            linkstr = '&recommCode=' + $scope.user.mobilephone;
        }
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '啄米理财，国企背景',
                desc: '注册就送618红包+99999体验金', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/zhuomireg?' + linkstr, // 分享链接
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
                link: 'http://wap.huiyuanjinfu.com/zhuomireg?' + linkstr, // 分享链接
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
                link: 'http://wap.huiyuanjinfu.com/zhuomireg?' + linkstr, // 分享链接
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
                link: 'http://wap.huiyuanjinfu.com/zhuomireg?' + linkstr, // 分享链接
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
                link: 'http://wap.huiyuanjinfu.com/zhuomireg?' + linkstr, // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
        })
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
        $scope.downloadclick = function () {
            if (isWeiXin()) {
                if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                    $('.share-ios').fadeIn(200);
                } else {
                    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.zmlc.zm_app";
                }
            } else if (window.HM_JsBridge) {
                if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                    openInBrowser("https://itunes.apple.com/cn/app/%E5%95%84%E7%B1%B3%E7%90%86%E8%B4%A2/id1294612994?mt=8");
                } else if (browser.versions.android) {
                    openInBrowser("http://a.app.qq.com/o/simple.jsp?pkgname=com.hyjr.hy_app");
                } else {
                    openInBrowser("http://www.hongyajinrong.com/upload/apk/hy_app.apk");
                }
            } else if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                window.location.href = "https://itunes.apple.com/cn/app/%E5%95%84%E7%B1%B3%E7%90%86%E8%B4%A2/id1294612994?mt=8";
            } else if (browser.versions.android) {
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.zmlc.zm_app";
            } else {
                window.location.href = "http://www.zhuomilicai.com/upload/apk/zm_app.apk";
            }
        };
        $scope.closethis = function () {
            $('.share-ios,.share-android').fadeOut(200);
        };
    }
    ])
})
