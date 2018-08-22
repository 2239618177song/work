
/* 
* @Author: xyc
* @Date:   2016-01-18 23:29:04
*/

define([
    'webappControllers'
]
    , function (controllers) {
        controllers.controller('moreController'
            , ['$scope'
                , '$filter'
                , '$state'
                , 'resourceService'
                , function ($scope, $filter, $state, resourceService) {
                    $filter('isPath')('main.more');
                    var isPageHide = false;
                    // 文章列表
                    resourceService.queryPost($scope, $filter('getUrl')('文章列表'), {}, '文章列表');
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type) {
                            case '文章列表':
                                if (data.success) {
                                   console.log(11);
                                }
                                break;
                        }
                    });
                    window.addEventListener('pageshow', function () {
                        if (isPageHide) {
                            window.location.reload();
                        }
                    });

                    window.addEventListener('pagehide', function () {
                        isPageHide = true;
                    });
                    $scope.out = function (argument) {
                        switch (argument) {
                            case 'out':
                                $filter('清空缓存')();
                                $state.go('main.home');
                                break;
                        };
                    }
                }
            ]);
        controllers.controller('YJFKController'
            , ['$scope'
                , '$filter'
                , '$state'
                , 'resourceService'
                , function ($scope, $filter, $state, resourceService) {
                    $scope.userOBJ = $filter('isRegister')();

                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {

                        switch (type) {
                            case '意见反馈':
                                if (data.success) {
                                    $filter('意见反馈信息')('ok', $scope, 'y');
                                } else {
                                    $filter('意见反馈信息')(data.errorCode, $scope, 'y');
                                }
                                break;
                        };
                    });
                    $scope.toSub = function () {
                        if (!$scope.userOBJ.register) {
                            $state.go('dl');
                        } else {
                            resourceService.queryPost($scope, $filter('getUrl')('意见反馈'), {
                                uid: $scope.userOBJ.user.member.uid,
                                contactInformation: $scope.userOBJ.user.member.mobilephone,
                                content: $scope.content
                            }, '意见反馈');
                        }
                    }
                }
            ]);
    })