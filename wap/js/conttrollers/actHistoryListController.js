define(['webappControllers'], function (controllers) {
    controllers.controller('actHistoryListController', ['$scope', '$filter', '$state', '$stateParams', 'resourceService', '$timeout', '$localStorage', function ($scope, $filter, $state, $stateParams, resourceService, $timeout, $localStorage) {
        $scope.title = '活动中心';
        $filter('isPath')('actList');
        var isLoad = true;
        var pageOn = 1;
        $scope.publicWelfareList = [];
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
            if ($stateParams.active == 3) {
                $scope.active = 3;
                $localStorage.active = 3;
                resourceService.queryPost($scope, $filter('getUrl')('公益活动列表'), { pageOn: pageOn, pageSize: 10 }, { name: '公益活动列表' });
            }
            else {
                $scope.active = 0;
                init();
            }
        }
        else {
            $scope.active = 3;
            resourceService.queryPost($scope, $filter('getUrl')('公益活动列表'), { pageOn: pageOn, pageSize: 10 }, { name: '公益活动列表' });
        }
        function init() {
            resourceService.queryPost($scope, $filter('getUrl')('活动聚合'), {
                pageSize: 100,
                pageOn: 1
            }, { name: '活动聚合' });
        }
        $scope.changeMode = function (i) {
            if ($scope.active != i) {
                $scope.active = i;
                if (i == 0) {
                    init();
                    delete $localStorage.active;
                }
                else if (i == 3) {
                    isLoad = true;
                    pageOn = 1;
                    $scope.publicWelfareList = [];
                    $localStorage.active = 3;
                    resourceService.queryPost($scope, $filter('getUrl')('公益活动列表'), { pageOn: pageOn, pageSize: 10 }, { name: '公益活动列表' });
                }
            }
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '活动聚合':
                    if (data.success) {
                        $scope.datalist = data.map.Page.rows;
                        $scope.ableList = data.map.Page.rows.filter(function (item) {
                            return item.status === 1
                        })
                        $scope.unableList = data.map.Page.rows.filter(function (item) {
                            return item.status === 2
                        })
                    }
                    break;
                case '公益活动列表':
                    if (data.success) {
                        $scope.page = data.map.page;
                        $scope.kfrBanner = data.map.openDayPicUrl;
                        $scope.kfrTitle = data.map.openDayLabel;
                        if (pageOn == $scope.page.pageOn) {
                            isLoad = true;
                        }
                        if (data.map.page.pageOn <= data.map.page.totalPage) {
                            pageOn = $scope.page.pageOn + 1;
                            for (var i = 0; i < data.map.page.rows.length; i++) {
                                $scope.publicWelfareList.push(data.map.page.rows[i]);
                            }
                        }
                        else {
                            isLoad = false;
                        }
                    }
                    break;
            }
        });
        $scope.loadMore = function (item) {
            if (item.id == $scope.publicWelfareList[$scope.publicWelfareList.length - 1].id) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        var obj = {
                            pageOn: pageOn,
                            pageSize: 10
                        };
                        resourceService.queryPost($scope, $filter('getUrl')('公益活动列表'), obj, { name: '公益活动列表' });
                        isLoad = false;
                    }
                };
            };
        };
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
    }]);
})