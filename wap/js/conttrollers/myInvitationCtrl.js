define(['jweixin', 'webappControllers'], function (wx, controllers) {
    controllers.controller('myInvitationCtrl', function ($scope, $rootScope, $filter, $state, resourceService, isWeixin, signWeChatService) {
        // signWeChatService();
        $('body').scrollTop(0);
        $rootScope.title = "我的邀请";
        $scope.userOBJ = $filter('isRegister')();
        if ($scope.userOBJ.register) {
            resourceService.queryPost($scope, $filter('getUrl')('我的邀请'), { uid: $scope.userOBJ.user.member.uid }, '我的邀请');
        } else {
            $state.go('dl');
            return;
        };
        $scope.protocol = $filter('protocolFilter')()
        $scope.invitePerson = '';
        if ($scope.userOBJ.user.member.realName) {
            var name = $scope.userOBJ.user.member.realName;
            $scope.invitePerson = $filter('mosaic')(name)
        } else {
            var mobile = $scope.userOBJ.user.member.mobilephone;
            $scope.invitePerson = $filter('mosaic')(mobile)
        }


        // 分享相关
        $scope.share = function () {
            if (isWeixin()) {
                $('.activity-firend-boxweixin').fadeIn(150);
            } else {
                $('.fixed-box').fadeIn(200);
            }
        };
        $scope.closeshareweixin = function () {
            $('.activity-firend-boxweixin').fadeOut(150);
        };
        $scope.closeshare = function () {
            $('.fixed-box').fadeOut(200);
        };
        $scope.default = function (event) {
            event.stopPropagation();
        };
        // 领取奖金
        $scope.lingqu = function () {
            resourceService.queryPost($scope, $filter('getUrl')('getTheRewards'), { uid: $scope.userOBJ.user.member.uid, afid: $scope.data.threePresentAfid }, '领取奖励');
        };
        $scope.closehongbao = function () {
            $('.activity-firend-hongbao').fadeOut(200);
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '我的邀请':
                    if (data.success) {
                        $scope.data = data.map;
                        $scope.firstInvestList = data.map.firstInvestList;
                        $scope.repeatInvestList = data.map.repeatInvestList;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '领取奖励':
                    if (data.success) {
                        $scope.hongbaoAmount = data.map.amount;
                        $('.activity-firend-hongbao').fadeIn(200);
                        resourceService.queryPost($scope, $filter('getUrl')('我的邀请'), { uid: $scope.userOBJ.user.member.uid, }, '我的邀请');
                    }
                    break;
            };
        });
        $scope.toback = function () {
            $filter('跳回上一页')();
        };
        var linkstr = "";
        if ($scope.userOBJ.user && $scope.userOBJ.user.member.mobilephone) {
            linkstr = 'recommCode=' + $scope.userOBJ.user.member.mobilephone + '&';
        }
        if ($scope.invitePerson) {
            linkstr += 'invitePerson=' + $scope.invitePerson;
        }
        // 三重礼邀请
        $filter('微信邀请分享-邀请')(linkstr)
    });
}) 