define([
    'webappControllers'
    ]
    ,function(controllers){
    controllers.controller('myAssetsCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,function($scope,$rootScope,$filter,$state,resourceService){
            $rootScope.title="我的资产";
            $scope.userOBJ=$filter('isRegister')();

            resourceService.queryPost($scope, $filter('getUrl')('我的资产'), {
                    uid:$scope.userOBJ.user.member.uid
            }, '我的资产');

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '我的资产': 
                        if(data.success){
                            $scope.user = data.map.funds;
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        };
                    break;
                }
            });
            $scope.toback=function () {
                $filter('跳回上一页')();
            };
        }
    ]);
})