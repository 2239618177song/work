define([
    'webappControllers'
], function(controllers) {
    controllers.controller('investSuccess', ['$scope', '$rootScope', '$filter', '$state', 'resourceService','$localStorage', function($scope, $rootScope, $filter, $state, resourceService,$localStorage) {
        $rootScope.title = "投资成功";
        $scope.data={};
        $scope.user = $filter('isRegister')().user.member;
        if(!$scope.user){$state.go('dl');return;}
        if($localStorage.successData){
            $scope.data=$localStorage.successData;
        }
        delete $localStorage.successData;
        if($scope.data.coupon&&$scope.data.coupon.type){
            if($scope.data.coupon.type==1){
                $scope.couponText='返现券 '+$scope.data.coupon.amount+"元";
                $scope.couponTitle='红包';
            }else if($scope.data.coupon.type==2){
                $scope.couponText='加息券 '+$scope.data.coupon.raisedRates+"%";
                $scope.couponTitle='加息券';
            }
            else if($scope.data.coupon.type==4){
                $scope.couponText='翻倍券 '+$scope.data.coupon.multiple+"倍";
                $scope.couponTitle='翻倍券';
            }
        }
        $scope.closeyaoqing=function(){
            $('.yaoqinghaoyou').fadeOut(200);
        };
        $scope.showCancel=function(){
            $scope.cancelShow=true;
        };
        $scope.closeCancel=function(){
            $scope.cancelShow=false;
        };


    }]);
})
