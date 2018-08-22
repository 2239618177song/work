
define([
    'webappControllers',
    'clipboard'
], function (controllers, clipboard) {
    controllers.controller('moreController'
        , ['$scope'
            , '$filter'
            , '$state'
            , 'resourceService', function ($scope, $filter, $state, resourceService) {
                $filter('isPath')('main.more');
                $scope.userOBJ = $filter('isRegister')();
                $scope.protocol = $filter('protocolFilter')()
                $scope.title = '发现';
                $scope.wechat = 'hyjf888666';
                $scope.articleList1 = [];
                $scope.articleList2 = [];
                $scope.type1 = '官方公告';
                $scope.type2 = 'P2P理财';
                $scope.active = 0;
                resourceService.queryPost($scope, $filter('getUrl')('活动聚合'), {}, { name: '活动聚合' });
                resourceService.queryPost($scope, $filter('getUrl')('文章首页'), {}, { name: '文章首页' });
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                    switch (type.name) {
                        case '活动聚合':
                            if (data.success) {
                                $scope.activeList = data.map.Page.rows.filter(function (item) {
                                    return item.status === 1
                                });
                            }
                            break;
                            case '文章首页':
                            if (data.success) {
                                $scope.articleList1 = data.map.listO;
                                $scope.articleList2 = data.map.listT;
                                if(data.map.listO.typeName == '官方公告'){
                                    $scope.active = 0;
                                }else if(data.map.listO.typeName == '汇元动态'){
                                    $scope.active = 1;
                                }else if(data.map.listO.typeName == 'P2P网贷'){
                                    $scope.active = 2;
                                }else if(data.map.listO.typeName == '网贷资讯'){
                                    $scope.active = 3;
                                }
                                if(data.map.listT.typeName == 'P2P理财'){
                                    $scope.active = 4;
                                }else if(data.map.listT.typeName == '个人理财'){
                                    $scope.active = 5;
                                }if(data.map.listT.typeName == '理财知识'){
                                    $scope.active = 6;
                                }
                            }
                            break;
                    }
                });
                $scope.out = function (argument) {
                    switch (argument) {
                        case 'out':
                            $filter('清空缓存')();
                            $state.go('main.home');
                            break;
                    };
                }
                $scope.hint = function (argument) {
                    switch (argument) {
                        case 'server':
                            $filter('serverCenter')($scope);
                            break;
                        case 'coming':
                            $filter('reminder')(1001);
                            break;
                        case 'wechat':
                            $filter('wechatReminder')($scope);
                            break;
                    };
                }
                $scope.copyWechat = function () {
                    if (clipboard($scope.wechat)) {
                        $scope.hint('wechat')
                    }
                }
                $scope.yjfk = function(){
                    if($scope.userOBJ.register){
                        $state.go('YJFK');
                    }else{
                        $state.go('dl',{
                            returnurl:'main.more'
                        });
                    }
                }
            }
        ]);
    controllers.controller('hlsbtCtrl'
        , ['$scope'
            , '$filter'
            , '$state'
            , '$location'
            , '$localStorage'
            , function ($scope, $filter, $state, $location, $localStorage) {
                if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
                    $localStorage.webFormPath = $location.$$search;
                };
            }
        ]);
})