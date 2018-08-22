define([
    'webappControllers'
    , 'asPieProgress'
    , 'rainbow'
], function (controllers) {
    controllers.controller('myInvestDetailCtrl'
        , ['$scope'
            , '$rootScope'
            , '$filter'
            , '$state'
            , 'resourceService'
            , '$localStorage'
            , '$stateParams'
            , function ($scope, $rootScope, $filter, $state, resourceService, $localStorage, $stateParams) {
                $filter('isPath')('myInvestDetail')
                $scope.protocol = $filter('protocolFilter')()
                $scope.title = '投资详情'
                $scope.info = $localStorage.investDetail = JSON.parse($stateParams.info) || $localStorage.investDetail
                $scope.toback = function () {
                    $filter('跳回上一页')(2)
                }
                $scope.goCashed = function () {
                    $state.go("mycashed", { cashedId: $scope.info.id })
                }
                $scope.goProductionDetail = function () {
                    $state.go("cpDetail", { pid: $scope.info.pid })
                }
            }
        ])
})