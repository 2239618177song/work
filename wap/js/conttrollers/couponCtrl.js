/* 
* @Author: xyc
* @Date:   2016-01-18 23:29:04
*/

'use strict';
define([
    'webappControllers'
    , 'jquery'
    , 'ngdialog'
]
    , function (controllers, $, ngdialog) {

        controllers.controller('couponController'
            , ['$scope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$rootScope'
                , '$localStorage'
                , '$location'
                , '$stateParams'
                , function ($scope, resourceService, $filter, $state, $rootScope, $localStorage
                    , $location, $stateParams) {
                    if ($localStorage.pathUrl.length > 0) {
                        $localStorage.pathUrl.splice($localStorage.pathUrl.length - 1, 1)
                    }
                    if (!$stateParams.cpid) {
                        delete $localStorage.coupon
                    }
                    $scope.toback = function () {
                        if ($localStorage.coupon) {
                            $state.go('investment', { cpid: $localStorage.coupon.id, amt: $stateParams.amt });
                        } else {
                            $state.go('investment', { amt: $stateParams.amt });
                        }
                    };
                    $scope.notUse = function () {
                        delete $localStorage.coupon;
                        $state.go('investment', { amt: $stateParams.amt });
                    }
                    $scope.myId = $location.$$search.cpid;
                    $scope.coupons = $localStorage.coupons;
                    $scope.amt = $stateParams.amt;
                    $scope.onClick = function (item) {
                        if (!item.canuse) return false
                        if ((item.enableAmount <= $scope.amt && (item.maxAmount == null || item.maxAmount >= $scope.amt)) || $scope.amt == null) {
                            $localStorage.coupon = item;
                            $state.go('investment', { cpid: item.id, amt: $stateParams.amt });
                        } else {
                            delete $localStorage.coupon;
                            $state.go('investment', { amt: $stateParams.amt });
                        }
                    };
                }
            ]);
    })
