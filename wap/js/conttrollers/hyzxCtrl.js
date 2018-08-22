define(['webappControllers', 'jweixin', ['$scope', '$filter', '$rootScope', "$state", '$stateParams', 'resourceService']], function (controllers, jweixin) {
    controllers.controller('hyzxCtrl', function ($scope, $filter, $rootScope, $state, $stateParams, resourceService, isWeixin) {
        $rootScope.title = "汇元资讯";
        $scope.title = "汇元资讯";
        $scope.active = $stateParams.active;
        $scope.artList = [];
        $scope.obj = {};
        var isLoad = true;
        var pageOn = 1;
        $scope.toback = function () {
            $state.go('main.more');
        }
        switch ($scope.active) {
            case '0':
                $scope.data = { name: '官方公告' };
                break;
            case '1':
                $scope.data = { name: '汇元动态' };
                break;
            case '2':
                $scope.data = { name: 'P2P网贷' };
                break;
            case '3':
                $scope.data = { name: '网贷资讯' };
                break;
        }
        $scope.loadMore = function (item) {
            if (item.artiId == $scope.artList[$scope.artList.length - 1].artiId) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        $scope.obj = {
                            name: $scope.data.name,
                            pageOn: pageOn,
                            pageSize: 10,
                        };
                        resourceService.queryPost($scope, $filter('getUrl')('文章列表'),$scope.obj , '文章列表');
                        isLoad = false;
                    }
                };
            };
        };
        resourceService.queryPost($scope, $filter('getUrl')('文章列表'), $scope.data, '文章列表');   
        $scope.onClick = function (num) {
            $scope.active = num;
            pageOn = 1;
            if ($scope.active == 0) {
                $scope.data = { name: '官方公告' };
            } else if ($scope.active == 1) {
                $scope.data = { name: '汇元动态' };
            } else if ($scope.active == 2) {
                $scope.data = { name: 'P2P网贷' };
            } else if ($scope.active == 3) {
                $scope.data = { name: '网贷资讯' };
            }
            resourceService.queryPost($scope, $filter('getUrl')('文章列表'), {
                name: $scope.data.name,
            }, '文章列表' );
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) { 
                    case '文章列表':
                    if (data.success) {
                        if(data.map.page.pageOn == 1){
                            $scope.artList = [];
                        }
                        $scope.page = data.map.page;
                        if (pageOn == $scope.page.pageOn) {
                            isLoad = true;
                        }
                        if (data.map.page.pageOn <= data.map.page.totalPage) {
                            pageOn = $scope.page.pageOn + 1;
                            for (var i = 0; i < data.map.page.rows.length; i++) {
                                $scope.artList.push(data.map.page.rows[i]);
                            }
                        } else {
                            isLoad = false;
                        }
                    }
                    break;
            }
        })
    })
})