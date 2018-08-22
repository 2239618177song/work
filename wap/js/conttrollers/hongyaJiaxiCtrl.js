define(['webappControllers','jweixin'], function (controllers, wx) {
    controllers.controller('hongyaJiaxiCtrl', function ($scope,$rootScope,$stateParams,$filter,resourceService,$state) {
        $rootScope.title = '汇元金服-投资理财,P2P理财，P2P网贷,个人理财';
        $scope.showFixedbtn = true;
        $scope.wap = $stateParams.wap;
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
                title: '啄米理财-纯国企背景投资理财平台',
                desc: '月中加息专场，累计加息到达一定金额，即可获得加息券', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyajiaxi?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/jaixi.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '啄米理财-纯国企背景投资理财平台',
                desc: '月中加息专场，累计加息到达一定金额，即可获得加息券', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyajiaxi?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/jaixi.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '啄米理财-纯国企背景投资理财平台',
                desc: '月中加息专场，累计加息到达一定金额，即可获得加息券', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyajiaxi?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/jaixi.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '啄米理财-纯国企背景投资理财平台',
                desc: '月中加息专场，累计加息到达一定金额，即可获得加息券', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyajiaxi?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/jaixi.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '啄米理财-纯国企背景投资理财平台',
                desc: '月中加息专场，累计加息到达一定金额，即可获得加息券', // 分享描述
                link: 'http://wap.huiyuanjinfu.com/hongyajiaxi?wap=true', // 分享链接
                imgUrl: 'http://wap.huiyuanjinfu.com/images/wechat-share/jaixi.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
        })
        document.addEventListener('scroll', handleScroll, false);

        function handleScroll(){
            if($state.current.name == 'hongyajiaxi'){
            　　var scrollTop = $(window).scrollTop();
            　　var windowHeight = $(window).height();
                var btnBottom = $('.invest-btn').offset().top + $('.invest-btn').height();

                $scope.$apply(function(){
                    $scope.showFixedbtn = !(scrollTop + windowHeight > btnBottom);
                })
            } else {
                document.removeEventListener('scroll',handleScroll,false);
            }
        }

    });
})