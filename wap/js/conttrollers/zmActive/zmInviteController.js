define([
    'webappControllers',
    'jquery'
], function (controller) {
    controller.controller('zmInviteController', ['$scope', '$filter', '$state', '$location', 'resourceService', 'isWeixin', '$timeout', '$localStorage', '$stateParams', function ($scope, $filter, $state, $location, resourceService, isWeixin, $timeout, $localStorage, $stateParams) {
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '返现列表':
                    if (data.success) {
                        $scope.list = data.map.awardList
                    }
                    break
                case '30天标':
                    if (data.success) {
                        $scope.goInvestList = function () {
                            if ($stateParams.wap) {
                                $state.go('cpDetail', {
                                    pid: data.map.id
                                })
                            } else {
                                window.location.href = 'jsmp://page=5?pid=' + data.map.id
                            }
                        }
                    }
                    break
            }
        })
        var startTime = new Date(2017, 10 - 1, 31, 0, 0, 0),
            endTime = new Date(2017, 11 - 1, 11, 0, 0, 0),
            nowTime = new Date()
            
        $scope.isActiveTime = (function () {
            if (nowTime < startTime) return 1
            if (nowTime >= startTime && nowTime < endTime) return 2
            return 3
        })()
        resourceService.queryPost($scope, $filter('getUrl')('啄米返现活动'), {
            type: 2
        }, '返现列表')
        resourceService.queryPost($scope, $filter('getUrl')('30天标'), {
            deadline: 30
        }, '30天标')
        $scope.gofriend = function () {
            if ($stateParams.wap) {
                $state.go('myInvitation')
            } else {
                window.location.href = 'jsmp://page=1'
            }
        }
    }])
        .directive("repeatFinish", function () {
            return {
                link: function (scope, element, attr) {
                    if (scope.$last == true) {
                        scope.$eval(attr.repeatFinish);
                    }
                }
            }
        })
        .directive('scroll', function () {
            var temp = '<span repeat-finish="finish()" ng-repeat="item in list">{{item.mobilePhone}}成功投资{{item.investAmount}}获得{{item.amount}}元现金</span>'
            return {
                template: temp,
                scope: true,
                transclude: true,
                link: function ($scope, element, attrs) {
                    var a = 1;
                    $scope.finish = function () {
                        if (a == 1) {
                            a++;
                            var height;
                            $('.notice-box').find('span').each(function (i) {
                                height = parseFloat($(this).css('height'));
                                $(this).css({
                                    top: (i * height) + 'px'
                                })
                                var that = this;
                                setInterval(function () {
                                    var top = parseFloat($(that).css('top'));
                                    $(that).animate({
                                        top: (top - height) + 'px'
                                    }, 500, function () {
                                        var top = parseFloat($(that).css('top'));
                                        if (top <= (height * (-1))) {
                                            $(that).css({ top: ($scope.list.length - 1) * height + 'px' });
                                        }
                                        if (top == 0) {
                                            $(that).css({ zIndex: 1 });
                                        }
                                        else {
                                            $(that).css({ zIndex: 0 });
                                        }
                                    })
                                }, 2500)
                            })
                        }
                    }
                }
            }
        });
})