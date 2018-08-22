define(['webappControllers', 'jweixin', ['$scope', '$filter', '$rootScope', '$stateParams', 'resourceService']], function (controllers, jweixin) {
    controllers.controller('inviteCenter', function ($scope, $filter, resourceService, isWeixin) {
        $scope.title = '我的邀请'
        $scope.userOBJ = $filter('isRegister')();
        if ($scope.userOBJ.register) {
            resourceService.queryPost($scope, $filter('getUrl')('我的邀请列表'), { uid: $scope.userOBJ.user.member.uid, pageSize: 20, pageOn: 1 }, '我的邀请');
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
        $scope.toback = function () {
            $filter('跳回上一页')();
        };
        $scope.height = {
            'min-height': window.innerHeight + 'px'
        }
        var linkstr = "";
        if ($scope.userOBJ.user && $scope.userOBJ.user.member.mobilephone) {
            linkstr = 'recommCode=' + $scope.userOBJ.user.member.mobilephone + '&';
        }
        if ($scope.invitePerson) {
            linkstr += 'invitePerson=' + $scope.invitePerson;
        }
        // 三重礼邀请
        $filter('微信邀请分享-邀请')(linkstr)
        // 分享相关
        $scope.share = function () {
            $('.fixed-box').fadeIn(200);
            // if (isWeixin()) {
            //     $('.activity-firend-boxweixin').fadeIn(150);
            // } else {
            //     $('.fixed-box').fadeIn(200);
            // }
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
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '我的邀请':
                    if (data.success) {
                        $scope.inviteList = data.map
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break
            }
        })
    })
})