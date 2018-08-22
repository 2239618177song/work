define(['webappControllers', 'jweixin', ['$scope', '$filter', '$rootScope','$location',"$state", '$stateParams', 'resourceService']], function (controllers, jweixin) {
    controllers.controller('lcktCtrl', function ($scope, $filter,$rootScope,$location,$state,$stateParams, resourceService, isWeixin) {
        $rootScope.title = "理财课堂";
        $scope.title = "理财课堂";
        $scope.active = $stateParams.active;
        $scope.artList = [];
        $scope.obj = {};
        var isLoad = true;
        var pageOn = 1;
        $scope.toback = function(){
            $state.go('main.more');
        }
        switch ($scope.active) {
            case '4':
                $scope.data = {name:'P2P理财'};
                break;
            case '5':
                $scope.data = {name:'个人理财'};
                break;
            case '6':
                $scope.data = {name:'理财知识'};
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
                        resourceService.queryPost($scope, $filter('getUrl')('文章列表'), $scope.obj, '文章列表');
                        isLoad = false;
                    }
                };
            };
        };
        resourceService.queryPost($scope, $filter('getUrl')('文章列表'), $scope.data,'文章列表');
        $scope.onClick = function(num){
            $scope.active = num;
            pageOn = 1;
            if($scope.active == 4){
                $scope.data = {name:'P2P理财'};
            }else if($scope.active == 5){
                $scope.data = {name:'个人理财'};
            }else if($scope.active == 6){
                $scope.data = {name:'理财知识'};
            }
            resourceService.queryPost($scope, $filter('getUrl')('文章列表'), {
                name:$scope.data.name,
            }, '文章列表');
            
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