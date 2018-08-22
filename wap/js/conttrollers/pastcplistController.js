define(['jweixin', 'webappControllers', 'ngdialog'], function (wx, controllers, ngdialog) {
    controllers.controller('pastcplistController', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $timeout,$stateParams) {
        $rootScope.title = "往期企融计划";
        delete $localStorage.coupon;
        $filter('isPath')('normalcplist');
        var isLoad = true;
        var pageOn = 1;
        $scope.cpList = [];
        if($localStorage.pastlist == undefined){
            $scope.active = 0;
        }else {
            $scope.active = $localStorage.pastlist;
        }
        
        if($scope.active == 0){
            $scope.statuses = "6,8"
        } else if ($scope.active == 1){
            $scope.statuses = "9";
        }
        // $scope.statuses = "6,8";
        resourceService.queryPost($scope, $filter('getUrl')('pastProductList'), { statuses : $scope.statuses},{ name: '产品列表' });
        $scope.loadMore = function (item) {
            if (item.id == $scope.cpList[$scope.cpList.length - 1].id) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        var obj = {
                            pageOn: pageOn,
                            pageSize: 10,
                            statuses : $scope.statuses
                        };
                        obj.type = 2;
                        resourceService.queryPost($scope, $filter('getUrl')('pastProductList'), obj, { name: '产品列表' });
                        isLoad = false;
                    }
                };
            };
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '产品列表':
                    $scope.page = data.map.page;
                    if (pageOn == $scope.page.pageOn) {
                        isLoad = true;
                    }
                    if (data.map.page.pageOn <= data.map.page.totalPage) {
                        pageOn = $scope.page.pageOn + 1;
                        for (var i = 0; i < data.map.page.rows.length; i++) {
                            $scope.cpList.push(data.map.page.rows[i]);
                        }
                    } else {
                        isLoad = false;
                    }
                    break;
            };
        });
        $scope.toback = function () {
            // $filter('跳回上一页')(2);
            $state.go('main.bankBillList');
        };
        $scope.onClick = function (num) {
            $scope.active = num;
            $localStorage.pastlist = num;
            if(num == 0){
                $scope.statuses = "6,8"
            } else if (num == 1){
                $scope.statuses = "9";
            }
            pageOn = 1;
            $scope.cpList = [];
            resourceService.queryPost($scope, $filter('getUrl')('pastProductList'), { statuses : $scope.statuses},{ name: '产品列表' });            
        };
        $scope.radius = $('.rem-rule').width();
    }) 
})