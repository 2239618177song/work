define(['webappControllers', 'jweixin', ['$scope', '$filter', '$rootScope',"$state", '$stateParams', 'resourceService']], function (controllers, jweixin) {
    controllers.controller('xxplCtrl', function ($scope, $filter,$rootScope,$state,$stateParams, resourceService, isWeixin) {
        $rootScope.title = "信息披露";
        $scope.title = "信息披露";
        $scope.active = 0;

        $scope.onClick = function(num){
            $scope.active = num;
        }
    })
})