define(['webappControllers', 'jweixin'], function (controllers, wx) {
    //常见问题
    controllers.controller('CJWTCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        $rootScope.title = $scope.title = '常见问题';
        $scope.userOBJ = $filter('isRegister')();
        $scope.wap = $stateParams.wap;
        $scope.active = $stateParams.active;
        $scope.num1 = false;
        $scope.num2 = false;
        $scope.num3 = false;
        $scope.num4 = false;
        $scope.num5 = false;
        $scope.num6 = false;
        $filter('isPath')('GYWM');
        $scope.toback = function () {
            // $filter('跳回上一页')(2);
            $state.go('main.more')
        };
        $scope.onClick = function(num){
            if(num == 0){
                if($scope.num1){
                    $scope.num1 = false;
                }else{
                    $scope.num1 = true;
                }
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
            }else if(num == 1){
                $scope.num1 = false;
                if($scope.num2){
                    $scope.num2 = false;
                }else{
                    $scope.num2 = true;
                }
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
            }else if(num == 2){
                $scope.num1 = false;
                $scope.num2 = false;
                if($scope.num3){
                    $scope.num3 = false;
                }else{
                    $scope.num3 = true;
                }
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
            }else if(num == 3){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                if($scope.num4){
                    $scope.num4 = false;
                }else{
                    $scope.num4 = true;
                }
                $scope.num5 = false;
                $scope.num6 = false;
            }else if(num == 4){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                if($scope.num5){
                    $scope.num5 = false;
                }else{
                    $scope.num5 = true;
                }
                $scope.num6 = false;
            }else if(num == 5){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                if($scope.num6){
                    $scope.num6 = false;
                }else{
                    $scope.num6 = true;
                }
            }
        }
        $scope.YJFK = function(){
            if($scope.userOBJ.register){
                $state.go('YJFK');
            }else{
                $state.go('dl',{
                    returnurl:'CJWT'
                });
            }
        }
        
    }])
    //认证注册
    controllers.controller('RZZCCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        $rootScope.title = $scope.title = '常见问题';
        $scope.wap = $stateParams.wap;
        $scope.active = $stateParams.active;
        $scope.num1 = false;
        $scope.num2 = false;
        $scope.num3 = false;
        $scope.num4 = false;
        $scope.num5 = false;
        $scope.num6 = false;
        $scope.num7 = false;
        $scope.num8 = false;
        $scope.num9 = false;
        $scope.num10 = false;
        $scope.num11 = false;
        $scope.num12 = false;
        $filter('isPath')('GYWM');
        $scope.toback = function () {
            // $filter('跳回上一页')(2);
            $state.go('CJWT',{wap:true});
        };
        $scope.onClick = function(num){
            if(num == 0){
                if($scope.num1){
                    $scope.num1 = false;
                }else{
                    $scope.num1 = true;
                }
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
                $scope.num7 = false;
                $scope.num8 = false;
                $scope.num9 = false;
                $scope.num10 = false;
                $scope.num11 = false;
                $scope.num12 = false;
            }else if(num == 1){
                $scope.num1 = false;
                if($scope.num2){
                    $scope.num2 = false;
                }else{
                    $scope.num2 = true;
                }
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
                $scope.num7 = false;
                $scope.num8 = false;
                $scope.num9 = false;
                $scope.num10 = false;
                $scope.num11 = false;
                $scope.num12 = false;
            }else if(num == 2){
                $scope.num1 = false;
                $scope.num2 = false;
                if($scope.num3){
                    $scope.num3 = false;
                }else{
                    $scope.num3 = true;
                }
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
                $scope.num7 = false;
                $scope.num8 = false;
                $scope.num9 = false;
                $scope.num10 = false;
                $scope.num11 = false;
                $scope.num12 = false;
            }else if(num == 3){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                if($scope.num4){
                    $scope.num4 = false;
                }else{
                    $scope.num4 = true;
                }
                $scope.num5 = false;
                $scope.num6 = false;
                $scope.num7 = false;
                $scope.num8 = false;
                $scope.num9 = false;
                $scope.num10 = false;
                $scope.num11 = false;
                $scope.num12 = false;
            }else if(num == 4){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                if($scope.num5){
                    $scope.num5 = false;
                }else{
                    $scope.num5 = true;
                }
                $scope.num6 = false;
                $scope.num7 = false;
                $scope.num8 = false;
                $scope.num9 = false;
                $scope.num10 = false;
                $scope.num11 = false;
                $scope.num12 = false;
            }else if(num == 5){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                if($scope.num6){
                    $scope.num6 = false;
                }else{
                    $scope.num6 = true;
                }
                $scope.num7 = false;
                $scope.num8 = false;
                $scope.num9 = false;
                $scope.num10 = false;
                $scope.num11 = false;
                $scope.num12 = false;
            }else if(num == 6){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
                if($scope.num7){
                    $scope.num7 = false;
                }else{
                    $scope.num7 = true;
                }
                $scope.num8 = false;
                $scope.num9 = false;
                $scope.num10 = false;
                $scope.num11 = false;
                $scope.num12 = false;
            }else if(num == 7){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
                $scope.num7 = false;
                if($scope.num8){
                    $scope.num8 = false;
                }else{
                    $scope.num8 = true;
                }
                $scope.num9 = false;
                $scope.num10 = false;
                $scope.num11 = false;
                $scope.num12 = false;
            }else if(num == 8){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
                $scope.num7 = false;
                $scope.num8 = false;
                if($scope.num9){
                    $scope.num9 = false;
                }else{
                    $scope.num9 = true;
                }
                
                $scope.num10 = false;
                $scope.num11 = false;
                $scope.num12 = false;
            }else if(num == 9){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
                $scope.num7 = false;
                $scope.num8 = false;
                $scope.num9 = false;
                if($scope.num10){
                    $scope.num10 = false;
                }else{
                    $scope.num10 = true;
                }
                $scope.num11 = false;
                $scope.num12 = false;
            }else if(num == 10){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
                $scope.num7 = false;
                $scope.num8 = false;
                $scope.num9 = false;
                $scope.num10 = false;
                if($scope.num11){
                    $scope.num11 = false;
                }else{
                    $scope.num11 = true;
                }
                
                $scope.num12 = false;
            }else if(num == 11){
                $scope.num1 = false;
                $scope.num2 = false;
                $scope.num3 = false;
                $scope.num4 = false;
                $scope.num5 = false;
                $scope.num6 = false;
                $scope.num7 = false;
                $scope.num8 = false;
                $scope.num9 = false;
                $scope.num10 = false;
                $scope.num11 = false;
                if($scope.num12){
                    $scope.num12 = false;
                }else{
                    $scope.num12 = true;
                }
                
            }
        }
        
    }])
});