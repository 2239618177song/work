define(['jweixin', 'webappControllers', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('newtyjController', function ($scope, $rootScope, resourceService, $filter, $state, $location, $localStorage, $stateParams) {
        $filter('isPath')('newtyj');
        $('body').scrollTop(0);
        $rootScope.title = '汇元金服-投资理财,P2P理财，P2P网贷,个人理财';
        $scope.login = {};
        $scope.showdownload = true;
        if ($localStorage.webFormPath != undefined) {
            if ($localStorage.webFormPath.recommCode != undefined) {
                $scope.login.recommPhone = $localStorage.webFormPath.recommCode;
            };
            if ($localStorage.webFormPath.toFrom != undefined) {
                $scope.login.toFrom = $localStorage.webFormPath.toFrom;
            };
            if ($localStorage.webFormPath.tid != undefined) {
                $scope.login.tid = $localStorage.webFormPath.tid;
            };
        };
        $scope.webFormPath = $localStorage.webFormPath;
        if ($location.$$search) { $scope.webFormPath = $location.$$search; }

        if ($scope.webFormPath.toFrom != undefined) {
            $scope.login.toFrom = $scope.webFormPath.toFrom;
        }
        if ($scope.webFormPath.recommCode != undefined) {
            $scope.login.recommPhone = $scope.webFormPath.recommCode;
        }
        if ($scope.webFormPath.tid != undefined) {
            $scope.login.tid = $scope.webFormPath.tid;
        }
        if ($stateParams.myToFrom != '' && $stateParams.myToFrom != null) {
            $scope.login.toFrom = $stateParams.myToFrom;
        }
        if ($stateParams.maskType != '' || $stateParams.maskType != undefined) {
            $localStorage.maskType = $stateParams.maskType;
        }
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
            var user = $filter('isRegister')();
            if(user.register==true){
                $scope.isLog = true;
                resourceService.queryPost($scope, $filter('getUrl')('推广页账户'), {
                    uid: user.user.member.uid
                }, { name: '推广页账户' });
            }
            else{
                $scope.isLog = false;
            }
        }
        else{
            if($stateParams.uid){
                $scope.isLog = true;
                resourceService.queryPost($scope, $filter('getUrl')('推广页账户'), {
                    uid: $stateParams.uid
                }, { name: '推广页账户' });
            }
            else{
                $scope.isLog = false;
            }
        }
        resourceService.queryPost($scope, $filter('getUrl')('lastRegMember'), {}, { name: 'lastRegMember' });
        // 图形验证码
        var changeIMG = function (i,event) { //换图片验证码
            if (event != undefined) {
                event.currentTarget.src += '?' + new Date().getTime();
            } else {
                if ($('.img-box img')[i] != undefined) {
                    $('.img-box img')[i].src += '?' + new Date().getTime();
                }
            }
        };
        changeIMG(0);
        $scope.clickInput = function (i,event) {
            // $scope.userLogin.picCode = null;
            changePicEvent = event;
            changeIMG(i,changePicEvent);
        };
        $scope.passwordText = false;
        $scope.isSubMin = true;
        $scope.nowTimer = "获取验证码";
        var isSub = true;
        var changePicEvent;
        $scope.isImgCode = true;
        $scope.zuce = function (tegForm) {
            $scope.login.checkbox = true;
            if ($scope.login.recommPhone === undefined) {
                delete $scope.login.recommPhone;
            };
            if ($scope.login.toFrom === undefined) {
                delete $scope.login.toFrom;
            };
            if (tegForm.$valid) {
                if ($scope.login.passWord.length > 5) {
                    if (isSub) {
                        isSub = false;
                        resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                    }
                }
            } else {
                $rootScope.errorText = '请正确填写以上信息';
                $rootScope.maskError = true;
            }
        }
        $scope.getyzm = function (tegForm,i) {
            if ($scope.isSubMin == true) {
                if($scope.isImgCode==true){
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
                            isPic : true
                        }, { name: '获取验证码', tegForm: tegForm });
                    }
                }
                else{
                    $scope.login.picCode = '';
                    $scope.isImgCode=true;
                    changeIMG(i);
                    $rootScope.errorText = '请重新输入图形码';
                    $rootScope.maskError = true;
                }
            }
        };
        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm, i) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            changeIMG(i);
        };
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height()/5;
        $scope.showSuccess = false;
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '推广页账户':
                    if (data.success) {
                        $scope.user = data.map;
                    }
                    break;
                case '获取验证码':
                    if (data.success==true) {
                        $filter('60秒倒计时')($scope, 120);
                        $scope.isImgCode=false;
                        $rootScope.errorText = '验证码发送成功';
                        $rootScope.maskError = true;
                    } else if(data.errorCode == '1006'){
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
                            $scope.cangetm = false;
                        }
                        else{
                            $scope.cangetm = true;
                        }
                    }
                    break;
                case '注册':
                    isSub = true;
                    if (data.success) {
                        $localStorage.user = data.map;
                        // $rootScope.errorText = '注册成功';
                        // $rootScope.maskError = true;
                        // _hmt.push(['_trackPageview', '/maidian/zccg']);
                        // _hmt.push(['_trackPageview', '/mian/myCoupon']);
                        // if($stateParams.wap){
                        //     $state.go('tyj',{wap:true});
                        // }
                        // else{
                        //     $state.go('tyj');
                        // }
                        $scope.showSuccess = true;
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.login.passWord = '';
                    };
                    break;
                case 'lastRegMember':
                    if (data.success) {
                        $scope.newtyjList = data.map.list;
                        $dataTable.find('tr').each(function(i){
                            if(i%2==0){
                                $(this).css('background','#F9EDD2');
                            }
                        })
                        // 列表数据轮动
                        if ($scope.newtyjList.length > 5) {
                            setInterval(function() {
                                $dataTable.animate({'margin-top': '-'+trHeight+'px'},1000,function() {
                                    $dataTable.find('tr').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top',0);
                                });
                            }, 3000);
                        }
                    } 
                    break;
            };
        });
        $scope.background = function(){
            $dataTable.find('tr').each(function(i){
                if(i%2==0){
                    $(this).css('background','#F9EDD2');
                }
            })
        }
        $scope.closeSuccess = function(){
            $scope.showSuccess = false;
            $state.go('newtyj',{wap:true});
        }
        var ruleHeight = $('.rule-box').height();
        var ruleheaderHeight = $('.rule-box').find('h1').outerHeight();
        $('.rule-box').height(ruleheaderHeight);
        $scope.ruleShow=false;
        $scope.ruleCtrl = function(){
            if($scope.ruleShow==true){
                $scope.ruleShow=false;
                $('.rule-box').animate({
                    height:ruleheaderHeight
                },300);
                $('.rule-box').find('img').css({
                    transform: 'rotate(180deg)',
                    
                });
            }
            else{
                $scope.ruleShow=true;
                $('.rule-box').animate({
                    height:ruleHeight
                },300);
                $('.rule-box').find('img').css({
                    transform: 'rotate(0deg)'
                });
                $("html,body").animate({ scrollTop: $(".rule-box").offset().top });
            }
        }
        $scope.openhongbao = function(){
            changeIMG(1);
            $scope.hasopen=true;
        }
        $scope.closedownload = function(){
            $scope.showdownload = false;
            $('.newtyj').css('padding-bottom',0);
        }
        var browser = {
            versions: function() {
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
        function isWeiXin(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        }
        $scope.downloadclick=function(){
            if (isWeiXin()){
                if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                    $('.share-ios').fadeIn(200);
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
        $scope.closethis=function(){
            $('.share-ios,.share-android').fadeOut(200);
        };
    })
})