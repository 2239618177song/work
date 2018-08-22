define(['webappControllers','jweixin'], function (controllers, wx) {
    controllers.controller('hongyaQixiCtrl', function ($scope,$rootScope,$stateParams,$filter,resourceService,$state) {
        $rootScope.title = '汇元金服-投资理财,P2P理财，P2P网贷,个人理财';

        $scope.showDialog = false;
        $scope.lastCount = 0;
        $scope.dialogType = ''
        $scope.lotteryStatus = true;
        $scope.showFixbtn = false;
        $scope.lastCount = 0;
        $scope.form = {}

        var giftMap = {
            1 : [1,9],
            2 : [6,11],
            3 : [3,8],
            4 : [2],
            5 : [5],
            6 : [0],
            7 : [4],
            8 : [7],
            9 : [10],
        }

        var endDay = new Date(2017,9-1,1,0,0,0);
        $scope.overDue = new Date() >= endDay;

        $scope.wap = $stateParams.wap;
        $scope.userOBJ = $filter('isRegister')();
        $scope.user = $scope.userOBJ.user.member;

        var userObj = {};
        
        if($scope.userOBJ.register){
            userObj = {uid: $scope.user.uid}
        } else if (!$scope.wap && $stateParams.uid && $stateParams.token){
            userObj = {
                uid: $stateParams.uid,
                token: $stateParams.token
            }
        }

        resourceService.queryPost($scope,$filter('getUrl')('qixiActivityWinningMembers'),{},'qixiActivityWinningMembers');
        resourceService.queryPost($scope,$filter('getUrl')('qixiActivityIndex'),userObj,'qixiActivityIndex');

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case 'qixiActivityIndex':
                    if(data.success){
                        $scope.lastCount = data.map.lastCount;
                    }
                    break;
                case 'qixiActivityWinningMembers':
                    if(data.success){
                        $scope.giftList = data.map.winningMemberList;

                        var $list = $('.gift-list');
                        var tdHeight = $('.tdHeight').css('height')
                        if ($scope.giftList.length > 6) {
                            setInterval(function() {
                                $list.animate({'margin-top':'-'+tdHeight},500,function() {
                                    $list.find('li').eq(0).appendTo($list);
                                    $list.css('margin-top',0);
                                });
                            }, 3000);
                        }
                    }
                    break;  
                case 'qixiActivityId':
                    if (data.success) {
                        if($scope.wap) {
                            $state.go('cpDetail', { pid: data.map.id ,from: 'hongyaqixi'});
                        } else {
                            window.location.href = 'jsmp://page=5?pid=' + data.map.id;
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }

                    break;
                case 'myQixiActivityGifts':
                    if (data.success) {
                        $scope.myGiftList = data.map.giftList;
                        showDialog('gift')
                    } else {
                        if (data.msg=='未登录，请先登录') {
                            window.location.href = 'jsmp://page=3';
                        } else {
                            $filter('活动信息')(1002, $scope, 'y')
                        }
                    }
                    break;
                case 'qixiActivityLottery':
                    if(data.success){
                        $scope.lastCount = data.map.lastCount;
                        var arr = giftMap[data.map.giftId]; 
                        var index = Math.floor((Math.random()*arr.length));
                        $scope.prize = {
                            id: data.map.giftId,
                            index: arr[index],
                            type: data.map.prizeType,
                            logId: data.map.lotteryLogId
                        }

                        lottery.speed = 100;
                        roll();
                    } else {
                        if (data.msg=='未登录，请先登录') {
                            window.location.href = 'jsmp://page=3';
                        } else if(data.errorCode == '1003'){
                            $scope.lastCount = 0;
                            alert(data.errorMsg);
                        } else {
                            $filter('活动信息')(1002, $scope, 'y')
                        }
                    }
                    break;
                case 'insertDeliveryAddress':
                    if(data.success){
                        showDialog('address-ok')
                    } else{
                        if (data.msg=='未登录，请先登录') {
                            window.location.href = 'jsmp://page=3';
                        } else if(data.errorCode == '1004'){
                            alert(data.errorMsg);
                            $scope.dialogType = ''
                            hideDialog();
                        } else {
                            $filter('活动信息')(1002, $scope, 'y')
                        }
                    }
                    break;
            }
        })

        $scope.getGift = function(){
            if($scope.wap && !$scope.userOBJ.register){
                $state.go('dl',{ returnurl: 'hongyaqixi?wap=true'});
            } else {
                resourceService.queryPost($scope,$filter('getUrl')('myQixiActivityGifts'),userObj,'myQixiActivityGifts');                  
            }
        }

        $scope.goInvite = function(){
            if ($scope.wap && !$scope.userOBJ.register) {
                $state.go('dl',{ returnurl: 'myInvitation'});
            } else if($scope.wap && $scope.userOBJ.register){
                window.location.href = '/myInvitation'
            } else {
                window.location.href = 'jsmp://page=1'
            }
        }

        $scope.goInvest = function($event){
            resourceService.queryPost($scope,$filter('getUrl')('qixiActivityIndex'),{},'qixiActivityId');
        }

        $scope.beginLottery = function(){
            if($scope.lotteryStatus){
                $scope.lotteryStatus = false;
                resourceService.queryPost($scope,$filter('getUrl')('qixiActivityLottery'),userObj,'qixiActivityLottery');
            }
        }

        $scope.checkAddress = function(){
            $scope.showNameError = false;
            $scope.showPhoneError = false;
            $scope.showAddressError = false;

            if($scope.form.name == undefined || $scope.form.name == ''){
                $scope.showNameError = true;
            } else if($scope.form.phone == undefined || $scope.form.phone == ''){
                $scope.showPhoneError = true;
            } else if($scope.form.address == undefined || $scope.form.address == ''){
                $scope.showAddressError = true;
            } else {
                $scope.dialogType = 'address-sure';
            }
        }

        $scope.submitAddress = function(){
            var obj = {}
            if($scope.userOBJ.register){
                obj = {uid: $scope.user.uid}
            } else if (!$scope.wap && $stateParams.uid && $stateParams.token){
                obj = {
                    uid: $stateParams.uid,
                    token: $stateParams.token
                }
            }
            obj.name = $scope.form.name;
            obj.phone = $scope.form.phone;
            obj.address = $scope.form.address;
            obj.lotteryLogId = $scope.prize.logId;
            resourceService.queryPost($scope,$filter('getUrl')('insertDeliveryAddress'),obj,'insertDeliveryAddress');
        }

        $scope.hideDialog = function(){
            switch($scope.dialogType){
                case 'gift':
                case 'gift-1':
                case 'address-ok':
                case '':
                    $('body').css({overflow:'visible',height:'auto',position:'relative'})
                    var top = parseInt($('.hy-qixi').css('marginTop')) * -1;
                    $('.hy-qixi').css({marginTop: 0});
                    $(window).scrollTop(top)
                    $scope.dialogType = ''
                    $scope.showDialog = false;
                    break;
            }
        }

        function showGift(){
            showDialog('gift-'+$scope.prize.type)
        }

        function showDialog(type){
            var top = $(window).scrollTop()
            console.log(top)
            $('body').css({overflow:'hidden',height:'100%',position:'absolute'})
            $('.hy-qixi').css({marginTop: top * (-1)})
            $scope.dialogType = type
            $scope.showDialog = true;
        }

        var lottery = {
            index: -1, //当前转动到哪个位置，起点位置
            count: 0, //总共有多少个位置
            timer: 0, //setTimeout的ID，用clearTimeout清除
            speed: 20, //初始转动速度
            times: 0, //转动次数
            cycle: 10, //转动基本次数：即至少需要转动多少次再进入抽奖环节
            prize: -1, //中奖位置
            init: function(id) {
                if ($("#" + id).find(".lottery-unit").length > 0) {
                    $lottery = $("#" + id);
                    $units = $lottery.find(".lottery-unit");
                    this.obj = $lottery;
                    this.count = $units.length;
                    $lottery.find(".lottery-unit-" + this.index).addClass("qixi-gift-active");
                };
            },
            roll: function() {
                var index = this.index;
                var count = this.count;
                var lottery = this.obj;
                $(lottery).find(".lottery-unit-" + index).removeClass("qixi-gift-active");
                index += 1;
                if (index > count - 1) {
                    index = 0;
                };
                $(lottery).find(".lottery-unit-" + index).addClass("qixi-gift-active");
                this.index = index;
                return false;
            },
            stop: function(index) {
                this.prize = index;
                return false;
            }
        };

        function roll() {
            lottery.times += 1;
            lottery.roll();
            if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
                clearTimeout(lottery.timer);
                lottery.prize = -1;
                lottery.times = 0;
                setTimeout(function(){
                    $scope.$apply(function(){
                        $scope.lotteryStatus = true;
                        showGift();
                    })
                }, 1000)
            } else {
                if (lottery.times < lottery.cycle) {
                    lottery.speed -= 10;
                } else if (lottery.times == lottery.cycle) {
                    lottery.prize = $scope.prize.index;
                } else {
                    if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                        lottery.speed += 110;
                    } else {
                        lottery.speed += 20;
                    }
                }
                if (lottery.speed < 40) {
                    lottery.speed = 40;
                };
                //console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
                lottery.timer = setTimeout(roll, lottery.speed);
            }
            return false;
        }

        lottery.init('lottery');

        document.addEventListener('scroll',handleScroll,false);
        function handleScroll(){
            if($state.current.name == 'hongyaqixi'){
            　　var scrollTop = $(window).scrollTop();
                var windowHeight = $(window).height();
                var h1 = $('.box-a').offset().top;
                var h2 = $('.box-b').offset().top + $('.qixi-ticket').height();
                var h3 = $('.page-1').offset().top;
                $scope.$apply(function(){
                    $scope.showFixbtn = (scrollTop + 0.5*windowHeight >= h1 && scrollTop < h2 + 0.5*windowHeight) || scrollTop >= h3;
                })
            } else {
                document.removeEventListener('scroll',handleScroll,false);
            }
        }   

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
                title: '你约会我报销！啄米理财助你七夕壕壕过~',
                desc: '啄米理财七夕超值活动：最高1314元返现、专享标加息，更有iphone7、iPadmini4等大礼等你抽（百分百中奖哦）', // 分享描述
                link: 'https://m.hongyajinrong.com/hongyaqixi?wap=true', // 分享链接
                imgUrl: 'https://m.hongyajinrong.com/images/wechat-share/qixi.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '你约会我报销！啄米理财助你七夕壕壕过~',
                desc: '啄米理财七夕超值活动：最高1314元返现、专享标加息，更有iphone7、iPadmini4等大礼等你抽（百分百中奖哦）', // 分享描述
                link: 'https://m.hongyajinrong.com/hongyaqixi?wap=true', // 分享链接
                imgUrl: 'https://m.hongyajinrong.com/images/wechat-share/qixi.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '你约会我报销！啄米理财助你七夕壕壕过~',
                desc: '啄米理财七夕超值活动：最高1314元返现、专享标加息，更有iphone7、iPadmini4等大礼等你抽（百分百中奖哦）', // 分享描述
                link: 'https://m.hongyajinrong.com/hongyaqixi?wap=true', // 分享链接
                imgUrl: 'https://m.hongyajinrong.com/images/wechat-share/qixi.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '你约会我报销！啄米理财助你七夕壕壕过~',
                desc: '啄米理财七夕超值活动：最高1314元返现、专享标加息，更有iphone7、iPadmini4等大礼等你抽（百分百中奖哦）', // 分享描述
                link: 'https://m.hongyajinrong.com/hongyaqixi?wap=true', // 分享链接
                imgUrl: 'https://m.hongyajinrong.com/images/wechat-share/qixi.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '你约会我报销！啄米理财助你七夕壕壕过~',
                desc: '啄米理财七夕超值活动：最高1314元返现、专享标加息，更有iphone7、iPadmini4等大礼等你抽（百分百中奖哦）', // 分享描述
                link: 'https://m.hongyajinrong.com/hongyaqixi?wap=true', // 分享链接
                imgUrl: 'https://m.hongyajinrong.com/images/wechat-share/qixi.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
        })
    });
})