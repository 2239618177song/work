/* 
* @Author: lee
* @Date:   2016-01-10 23:29:04
* @Last Modified by:   anchen
* @Last Modified time: 2016-01-12 21:49:52
*/

'use strict';

define([
    'webappControllers'
    , 'ngdialog'
]
    , function (controllers, ngdialog) {
        controllers.controller('controllerSign1'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams, $location) {
                    if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
                        $localStorage.webFormPath = $location.$$search;
                    };
                    $rootScope.title = '用户登录';
                    $scope.protocol = $filter('protocolFilter')()
                    $scope.userLogin = {};
                    $scope.showCode = false;
                    $scope.height = {
                        height: window.innerHeight + 'px'
                    }
                    $scope.sbmit = function (tegForm) {
                        resourceService.queryPost($scope, $filter('getUrl')('login'), $scope.userLogin, { name: 'login', tegForm: tegForm });
                    }
                    if ($filter('isRegister')().user && $filter('isRegister')().user.member && $filter('isRegister')().user.member.uid) {
                        // if ($stateParams.returnurl) {
                        //     $state.go($stateParams.returnurl, { wap: true });
                        // } else {
                        //     $state.go("main.myaccountHome");
                        // }
                        if ($state.params.returnurl) {
                            if ($state.params.returnurl.indexOf('?') != -1) {
                                var router = $state.params.returnurl.split('?')[0];
                                var params = $state.params.returnurl.split('?')[1];
                                var obj = {};
                                var array = params.split("&");
                                if (array.length > 1) {
                                    for (var i = 0; i < array.length; i++) {
                                        obj[array[i].split("=")[0]] = array[i].split("=")[1];
                                    }
                                } else {
                                    obj[array[0].split("=")[0]] = array[0].split("=")[1];
                                }
                                obj.wap = true;
                                $state.go(router, obj);
                            } else {
                                $state.go($state.params.returnurl, { wap: true });
                            }
                        } else {
                            $state.go("main.myaccountHome");
                        }
                    }
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type.name) {
                            case 'login':
                                if (data.success) {
                                    $localStorage.user = data.map;
                                    $localStorage.hongbaoeveryday = 1;
                                    // if ($localStorage.specialLogin == true) {
                                    //     // $rootScope.$emit('loginSuccess',true);
                                    //     $state.go('special',{wap:true});
                                    // } else {
                                    if ($state.params.returnurl) {
                                        if ($state.params.returnurl.indexOf('?') != -1) {
                                            var router = $state.params.returnurl.split('?')[0];
                                            var params = $state.params.returnurl.split('?')[1];
                                            var obj = {};
                                            var array = params.split("&");
                                            if (array.length > 1) {
                                                for (var i = 0; i < array.length; i++) {
                                                    obj[array[i].split("=")[0]] = array[i].split("=")[1];
                                                }
                                            } else {
                                                obj[array[0].split("=")[0]] = array[0].split("=")[1];
                                            }
                                            obj.wap = true;
                                            $state.go(router, obj);
                                        } else {
                                            $state.go($state.params.returnurl, { wap: true });
                                        }
                                    } else {
                                        $state.go("main.myaccountHome");
                                    }
                                    // }
                                } else {
                                    $filter('登录错误信息')(data.errorCode, $scope, 'y')

                                    $scope.userLogin.mobilephone = null;
                                    $scope.userLogin.passWord = null;
                                }
                                break;
                        };
                    });
                    $scope.toback = function () {
                        $filter('跳回上一页')();
                    };
                }
            ])

        // 关于我们
        controllers.controller('GYWMCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '关于汇元';
            $scope.wap = $stateParams.wap;
            $filter('isPath')('GYWM');
            $scope.toback = function () {
                // $filter('跳回上一页')(2);
                $state.go('main.more')
            };
            $scope.goto = function (url) {
                switch (url) {
                    case '公司介绍':
                        if ($scope.wap == 'true') {
                            $state.go('GSJS', { wap: true });
                        }
                        else {
                            $state.go('GSJS');
                        }
                        break;
                    case '股东介绍':
                        if ($scope.wap == 'true') {
                            $state.go('GDJS', { wap: true });
                        }
                        else {
                            $state.go('GDJS');
                        }
                        break;
                    case '管理团队':
                        if ($scope.wap == 'true') {
                            $state.go('GLTD', { wap: true });
                        }
                        else {
                            $state.go('GLTD');
                        }
                        break;
                    case '公司资质':
                        if ($scope.wap == 'true') {
                            $state.go('GSZZ', { wap: true });
                        }
                        else {
                            $state.go('GSZZ');
                        }
                        break;
                    case '一亿验资':
                        if ($scope.wap == 'true') {
                            $state.go('YYYZ', { wap: true });
                        }
                        else {
                            $state.go('YYYZ');
                        }
                        break;
                    case '网站公告':
                        if ($scope.wap == 'true') {
                            $state.go('WZGG', { wap: true });
                        }
                        else {
                            $state.go('WZGG');
                        }
                        break;
                };
            }
        }])
        // 公司介绍
        controllers.controller('GSJSCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '公司介绍';
            $scope.wap = $stateParams.wap;
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
        }])
        // 股东介绍
        controllers.controller('GDJSCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '股东介绍';
            $scope.wap = $stateParams.wap;
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
        }])
        // 管理团队
        controllers.controller('GLTDCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '管理团队';
            $scope.wap = $stateParams.wap;
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
        }])
        // 公司资质
        controllers.controller('GSZZCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '公司资质';
            $scope.wap = $stateParams.wap;
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
        }])
        // 一亿验资
        controllers.controller('YYYZCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '一亿验资';
            $scope.wap = $stateParams.wap;
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
        }])

        // 股权结构
        controllers.controller('GQJGCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $scope.wap = $stateParams.wap;
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
        }])

        controllers.controller('WZGGCtrl', function ($scope, resourceService, $filter, $state, $rootScope, $stateParams) {
            $scope.wap = $stateParams.wap;
            $rootScope.title = $scope.title = '网站公告';
            $filter('isPath')('WZGG');
            $scope.toback = function () {
                $filter('跳回上一页')(2);
            };
            var isLoad = true;
            var pageOn = 1;
            $scope.ggList = [];
            $scope.loadMore = function (item) {
                if (item.id == $scope.ggList[$scope.ggList.length - 1].id) {
                    if (isLoad) {
                        if (pageOn != $scope.page.pageOn) {
                            var obj = {
                                pageOn: pageOn,
                                pageSize: 10,
                                proId: 14
                            };
                            resourceService.queryPost($scope, $filter('getUrl')('网站公告'), obj, { name: '公告列表' });
                            isLoad = false;
                        }
                    };
                };
            };
            var objs = {};
            objs.proId = 14;
            resourceService.queryPost($scope, $filter('getUrl')('网站公告'), objs, { name: '公告列表' });
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                switch (eObj.name) {
                    case '公告列表':
                        $scope.page = data.map.page;
                        if (pageOn == $scope.page.pageOn) {
                            isLoad = true;
                        }
                        if (data.map.page.pageOn <= data.map.page.totalPage) {
                            pageOn = $scope.page.pageOn + 1;
                            for (var i = 0; i < data.map.page.rows.length; i++) {
                                $scope.ggList.push(data.map.page.rows[i]);
                            }
                        } else {
                            isLoad = false;
                        }
                        break;
                };
            });
            $scope.goto = function (id) {
                if ($scope.wap == 'true') {
                    $state.go('GGXQ', { wap: true, artiId: id });
                }
                else {
                    $state.go('GGXQ', { artiId: id });
                }
            }
        })
        controllers.controller('GGXQCtrl', function ($scope, resourceService, $filter, $stateParams, $state, $rootScope) {
            if ($stateParams.wap) {
                $scope.wap = $stateParams.wap;
            }
            $scope.from = $stateParams.from;
            if ($stateParams.from == 'kfr') {
                $rootScope.title = $scope.title = '活动详情';
            }
            else {
                if ($stateParams.active == 0) {
                    $rootScope.title = $scope.title = '官方公告';
                } else if ($stateParams.active == 1) {
                    $rootScope.title = $scope.title = '汇元动态';
                } else if ($stateParams.active == 2) {
                    $rootScope.title = $scope.title = 'P2P网贷';
                } else if ($stateParams.active == 3) {
                    $rootScope.title = $scope.title = '网贷资讯';
                } else if ($stateParams.active == 4) {
                    $rootScope.title = $scope.title = 'P2P理财';
                } else if ($stateParams.active == 5) {
                    $rootScope.title = $scope.title = '个人理财';
                } else if ($stateParams.active == 6) {
                    $rootScope.title = $scope.title = '理财知识';
                } else {
                    $rootScope.title = $scope.title = '网站公告';
                }

            }
            $('body').scrollTop(0);
            var obj = {};
            if ($stateParams.from == 'kfr') {
                obj.openDayId = $stateParams.artiId;
                resourceService.queryPost($scope, $filter('getUrl')('getOpenDayArticleDetail'), obj, { name: '活动详情' });
            }
            else {
                obj.artiId = $stateParams.artiId;
                resourceService.queryPost($scope, $filter('getUrl')('公告详情'), obj, { name: '公告详情' });
            }
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                switch (eObj.name) {
                    case '公告详情':
                        $scope.ggxq = data.map.sysArticle;
                        break;
                    case '活动详情':
                        $scope.ggxq = data.map.sysArticle;
                        break;
                };
            });
            $scope.toback = function () {
                if ($stateParams.type == '汇元资讯' || $stateParams.type == '理财课堂') {
                    $state.go('main.more');
                }else if ($stateParams.type == '官方公告') {
                    $state.go('HYZX', { active: 0 });
                } else if ($stateParams.type == '汇元动态') {
                    $state.go('HYZX', { active: 1 });
                } else if ($stateParams.type == 'P2P网贷') {
                    $state.go('HYZX', { active: 2 });
                } else if ($stateParams.type == '网贷资讯') {
                    $state.go('HYZX', { active: 3 });
                } else if ($stateParams.type == 'P2P理财') {
                    $state.go('LCKT', { active: 4 });
                } else if ($stateParams.type == '个人理财') {
                    $state.go('LCKT', { active: 5 });
                } else if ($stateParams.type == '理财知识') {
                    $state.go('LCKT', { active: 6 });
                }else{
                    $state.go('main.home');
                }

            };
            // $scope.goBack = function () {
            //     if ($stateParams.from == 'home') {
            //         $state.go('main.home');
            //     }
            //     else {
            //         $state.go('WZGG', { wap: true });
            //     }
            // }
        })
    })