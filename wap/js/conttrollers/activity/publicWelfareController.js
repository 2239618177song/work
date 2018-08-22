define(['webappControllers'], function(controllers) {
    controllers.controller('publicWelfareController', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage) {
        $scope.title = '公益活动';
        $filter('isPath')('publicWelfare');
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        resourceService.queryPost($scope, $filter('getUrl')('公益活动内容'), {id:$stateParams.id}, { name: '公益活动内容' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case "公益活动内容":
                    if (data.success) {
                        $scope.picList = data.map.picList;
                        $scope.h5Banner = data.map.jsActivityOffline.h5Banner;
                        $scope.content = data.map.jsActivityOffline.content;
                        $scope.mtitle = data.map.jsActivityOffline.title;
                        $scope.summary = data.map.jsActivityOffline.summary;
                        $scope.imgUrl = data.map.jsActivityOffline.imgUrl;
                        $scope.videoUrl = data.map.jsActivityOffline.videoUrl;
                        $timeout(function () {
                            var swiper = new Swiper('.live-slider',{
                                slidesPerView: 1.3,
                                loop: true,
                                autoplay: 2500,
                                autoplayDisableOnInteraction: false,
                                effect: 'coverflow',
                                grabCursor: true,
                                centeredSlides: true,
                                // slideToClickedSlide:true,
                                loopAdditionalSlides : 1,
                                coverflow: {
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 200,
                                    modifier: 1,
                                    slideShadows : true
                                }
                            })
                        });
                    }
                    break;
            }
        });
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
    });
})