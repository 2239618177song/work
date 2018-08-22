define([
    'webappControllers'
], function (controller) {
    controller.controller('newAccountSuccess', ['$scope', '$filter', '$rootScope', function ($scope, $filter, $rootScope) {
        $scope.toback = function () {
            $filter('跳回上一页')(2)
        }
        $rootScope.title = '注册成功'
        $scope.height = {
            height: window.innerHeight + 'px',
            paddingBottom: '0'
        }
    }])
})