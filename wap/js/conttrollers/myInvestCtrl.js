define([
    'webappControllers'
    , 'asPieProgress'
    , 'rainbow'
]
    , function (controllers) {
        controllers.controller('myInvestCtrl'
            , ['$scope'
                , '$rootScope'
                , '$filter'
                , '$state'
                , 'resourceService'
                , '$localStorage'
                , '$stateParams'
                , function ($scope, $rootScope, $filter, $state, resourceService, $localStorage, $stateParams) {
                    $rootScope.title = "我的投资";
                    $scope.userOBJ = $filter('isRegister')();
                    $filter('isPath')('myInvest');
                    $scope.showMode = $stateParams.tab ? $stateParams.tab : 1;
                    $scope.one = {
                        request: false,
                        status: 4,
                        beforePage: 2,
                        pageOn: 1,
                        pro: [],
                        isLoad: true
                    };
                    var oneArr = [];
                    $scope.two = {
                        request: false,
                        status: 3,
                        beforePage: 2,
                        pageOn: 1,
                        pro: [],
                        isLoad: true
                    };
                    $scope.three = {
                        request: false,
                        status: 0,
                        beforePage: 2,
                        pageOn: 1,
                        pro: [],
                        isLoad: true
                    };
                    $scope.linkDetail = function (item) {
                        $state.go('myInvestDetail', {
                            info: JSON.stringify(item)
                        })
                    }
                    $scope.getData = function (item, proItem) {
                        $scope.member = {
                            uid: $scope.userOBJ.user.member.uid,
                            status: item.status,
                            pageOn: item.pageOn,
                            pageSize: 5
                        };
                        if (item.request == false) {
                            resourceService.queryPost($scope, $filter('getUrl')('我的投资'), $scope.member, { name: '我的投资', item: item });
                            item.request = true;
                        } else {
                            if (item.isLoad) {
                                if (proItem.id == item.pro[item.pro.length - 1].id) {
                                    if (item.beforePage != item.pageOn) {
                                        $scope.member.pageOn = item.beforePage;
                                        resourceService.queryPost($scope, $filter('getUrl')('我的投资'), $scope.member, { name: '我的投资', item: item });
                                        item.isLoad = false;
                                    }
                                }
                            }
                        }
                    };
                    if ($stateParams.tab == 1) {
                        $scope.getData($scope.one);
                    } else if ($stateParams.tab == 2) {
                        $scope.getData($scope.two);
                    } else {
                        $scope.getData($scope.one);
                    }
                    $scope.toback = function () {
                        $filter('跳回上一页')(2);
                    };
                    $scope.goCashed = function (item) {
                        $state.go("mycashed", { cashedId: item.id });
                    }
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type.name) {
                            case '我的投资':
                                if (data.success) {
                                    type.item.user = data.map;
                                    $scope.userInfo = data.map;
                                    type.item.pageOn = data.map.page.pageOn;
                                    if (type.item.beforePage == type.item.pageOn) {
                                        type.item.isLoad = true;
                                    }
                                    if (data.map.page.pageOn <= data.map.page.totalPage) {
                                        type.item.beforePage = data.map.page.pageOn + 1;
                                        for (var i = 0; i < data.map.page.rows.length; i++) {
                                            type.item.pro.push(data.map.page.rows[i]);
                                        }
                                    } else {
                                        type.item.isLoad = false;
                                    }
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y');
                                }
                                break;
                        }
                    });

                    $scope.upDownClick = function (event) {
                        var $this = $(event.currentTarget),
                            $thisCon = $this.parents('.con');
                        if ($thisCon.hasClass('active')) {
                            $thisCon.removeClass('active');
                        } else {
                            $thisCon.addClass('active');
                        }
                    };

                    $scope.changeMode = function (type) {
                        var $triggerAct = $('.trigger-wrap .active');
                        switch (type) {
                            case 1:
                                $scope.showMode = 1;
                                if ($scope.one.request == false) {
                                    $scope.getData($scope.one);
                                }
                                break;
                            case 2:
                                $scope.showMode = 2;
                                if ($scope.two.request == false) {
                                    $scope.getData($scope.two);
                                }
                                break;
                            case 3:
                                $scope.showMode = 3;
                                if ($scope.three.request == false) {
                                    $scope.getData($scope.three);
                                }
                                break;
                        }
                    };

                }
            ]);
    })