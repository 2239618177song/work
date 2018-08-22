define(['webappControllers', ['$scope', '$filter', '$rootScope', '$stateParams']], function (controllers) {
    controllers.controller('aqbzDetailCtrl', function ($scope, $filter, $rootScope,$stateParams) {
        $rootScope.title = "安全保障";
        $scope.wap = $stateParams.wap;

        $scope.toback = function () {
            $filter('跳回上一页')();
        };
    })
})
