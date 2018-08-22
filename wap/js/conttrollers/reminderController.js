define(['webappControllers'], function (controllers) {
    controllers.controller('reminderController', function ($scope, $filter, $rootScope,$stateParams) {
        $rootScope.title = "优惠券温馨提示";
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
        }
        $scope.toback = function () {
            $filter('跳回上一页')();
        };
    })
})
