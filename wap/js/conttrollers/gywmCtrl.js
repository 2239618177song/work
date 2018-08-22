define(['webappControllers', 'jweixin'], function (controllers, wx) {
    controllers.controller('GYWMCtrl', ['$location','isWeixin', 'signWeChatService', '$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($location,isWeixin, signWeChatService, $scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        $rootScope.title = $scope.title = '信息披露';
        $scope.wap = $stateParams.wap;
        $scope.active = $stateParams.active;
        $filter('isPath')('GYWM');
        $scope.toback = function () {
            $state.go('main.more')
        };
        $scope.onClick = function (num) {
            $scope.active = num;
        }
    }])
     //走进汇元
     controllers.controller('ZJHYCtrl', ['$location','isWeixin', 'signWeChatService', '$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($location,isWeixin, signWeChatService, $scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        // $scope.wap = $stateParams.wap;
        // $scope.active = $stateParams.active;
        // $filter('isPath')('GYWM');
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
        var urlstr1 = $location.absUrl();
        // var urlstr1 = window.location.href;
        if (urlstr1 === 'https://wap.huiyuanjinfu.com' || urlstr1 === 'https://wap.huiyuanjinfu.com/') {
            urlstr1 = 'https://wap.huiyuanjinfu.com/main/home'
        }
        // console.log(urlstr1 + '.......')
        $.ajax({
            url: '/product/signWeChat.dos',
            type: 'post',
            data: { url: urlstr1, version: '2.0.0', channel: '3' },
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
                    wx.ready(function () {
                        wx.onMenuShareTimeline({
                            title: '走进汇元',
                            desc: '终于等到您的大驾光临', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/GYWM/ZJHY?wap=true&active=0', // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/gonIn.jpg', // 分享图标
                            success: function () {
                                alert('分享成功！');
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareAppMessage({
                            title: '走进汇元',
                            desc: '终于等到您的大驾光临', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/GYWM/ZJHY?wap=true&active=0', // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/gonIn.jpg', // 分享图标
                            success: function () {
                                alert('分享成功！');
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareQQ({
                            title: '走进汇元',
                            desc: '终于等到您的大驾光临', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/GYWM/ZJHY?wap=true&active=0', // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/gonIn.jpg', // 分享图标
                            success: function () {
                                alert('分享成功！');
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareWeibo({
                            title: '走进汇元',
                            desc: '终于等到您的大驾光临', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/GYWM/ZJHY?wap=true&active=0', // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/gonIn.jpg', // 分享图标
                            success: function () {
                                alert('分享成功！');
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareQZone({
                            title: '走进汇元',
                            desc: '终于等到您的大驾光临', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/GYWM/ZJHY?wap=true&active=0', // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/gonIn.jpg', // 分享图标
                            success: function () {
                                alert('分享成功！');
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                    })
                };
            }
        });
    }])
    //汇元大事件
    controllers.controller('HYSJCtrl', ['$location','isWeixin', 'signWeChatService', '$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($location,isWeixin, signWeChatService, $scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        // $scope.wap = $stateParams.wap;
        // $scope.active = $stateParams.active;
        // $filter('isPath')('GYWM');
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
        var urlstr = $location.absUrl();
        // var urlstr = window.location.href;
        if (urlstr === 'https://wap.huiyuanjinfu.com' || urlstr === 'https://wap.huiyuanjinfu. com/') {
            urlstr = 'https://wap.huiyuanjinfu.com/main/home'
        }
        // console.log(urlstr + '+++++')
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
                    wx.ready(function () {
                        wx.onMenuShareTimeline({
                            title: '汇元大事件',
                            desc: '与您分享汇元的每一个里程', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/GYWM/HYSJ?wap=true&active=1', // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/bigThing.jpg', // 分享图标
                            success: function () {
                                alert('分享成功！');
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareAppMessage({
                            title: '汇元大事件',
                            desc: '与您分享汇元的每一个里程', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/GYWM/HYSJ?wap=true&active=1', // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/bigThing.jpg', // 分享图标
                            success: function () {
                                alert('分享成功！');
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareQQ({
                            title: '汇元大事件',
                            desc: '与您分享汇元的每一个里程', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/GYWM/HYSJ?wap=true&active=1', // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/bigThing.jpg', // 分享图标
                            success: function () {
                                alert('分享成功！');
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareWeibo({
                            title: '汇元大事件',
                            desc: '与您分享汇元的每一个里程', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/GYWM/HYSJ?wap=true&active=1', // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/bigThing.jpg', // 分享图标
                            success: function () {
                                alert('分享成功！');
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareQZone({
                            title: '汇元大事件',
                            desc: '与您分享汇元的每一个里程', // 分享描述
                            link: 'http://wap.huiyuanjinfu.com/GYWM/HYSJ?wap=true&active=1', // 分享链接
                            imgUrl: 'http://wap.huiyuanjinfu.com/images/bigThing.jpg', // 分享图标
                            success: function () {
                                alert('分享成功！');
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                    })
                };
            }
        });
       
    }])
});